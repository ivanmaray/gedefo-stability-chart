/**
 * sync-cima — Edge Function
 *
 * Sincroniza una presentación comercial con la API de CIMA (AEMPS).
 *
 * Uso:
 *   POST /functions/v1/sync-cima
 *   Body: { "codigo_nacional": "603411" }
 *
 * O con un array para batch:
 *   Body: { "codigos_nacionales": ["603411", "746494"] }
 *
 * Cron (semanal): se puede invocar sin body para sincronizar todas las
 * presentaciones que tengan codigo_nacional en la BD.
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const CIMA_BASE = 'https://cima.aemps.es/cima/rest'
const DELAY_MS = 1000 // 1 req/s — conservador

Deno.serve(async (req) => {
  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    )

    let codigosNacionales: string[] = []

    if (req.method === 'POST') {
      const body = await req.json().catch(() => ({}))
      if (body.codigo_nacional) {
        codigosNacionales = [String(body.codigo_nacional)]
      } else if (Array.isArray(body.codigos_nacionales)) {
        codigosNacionales = body.codigos_nacionales.map(String)
      }
    }

    // Sin body → sincronizar todas las presentaciones con codigo_nacional
    if (codigosNacionales.length === 0) {
      const { data, error } = await supabase
        .from('presentacion_comercial')
        .select('codigo_nacional')
        .not('codigo_nacional', 'is', null)

      if (error) throw error
      codigosNacionales = (data ?? [])
        .map((r) => r.codigo_nacional)
        .filter((cn): cn is string => cn !== null)
    }

    const results: Array<{ cn: string; status: string; error?: string }> = []

    for (const cn of codigosNacionales) {
      await sleep(DELAY_MS)
      const result = await syncOne(supabase, cn)
      results.push(result)
    }

    return Response.json({ ok: true, synced: results.length, results })
  } catch (err) {
    return Response.json(
      { ok: false, error: err instanceof Error ? err.message : String(err) },
      { status: 500 },
    )
  }
})

async function syncOne(
  // deno-lint-ignore no-explicit-any
  supabase: any,
  cn: string,
): Promise<{ cn: string; status: string; error?: string }> {
  try {
    const cimaResp = await fetch(`${CIMA_BASE}/medicamento?cn=${cn}`, {
      headers: { Accept: 'application/json' },
    })

    if (!cimaResp.ok) {
      await logSync(supabase, cn, 'error', { http_status: cimaResp.status })
      return { cn, status: 'error', error: `CIMA HTTP ${cimaResp.status}` }
    }

    const cimaData = await cimaResp.json()

    // Mapear campos CIMA → presentacion_comercial
    const mapped = mapCimaToPresentation(cimaData)

    // Buscar si existe la presentación en BD
    const { data: existing } = await supabase
      .from('presentacion_comercial')
      .select('id, cima_datos_raw')
      .eq('codigo_nacional', cn)
      .maybeSingle()

    const hasDiff = existing && JSON.stringify(existing.cima_datos_raw) !== JSON.stringify(cimaData)
    const isNew = !existing

    if (isNew) {
      // Necesitamos principio_activo_id — buscar por nombre del PA en CIMA
      const dci = extractDci(cimaData)
      const { data: pa } = await supabase
        .from('principio_activo')
        .select('id')
        .ilike('dci', dci)
        .maybeSingle()

      if (!pa) {
        return { cn, status: 'skip', error: `PA no encontrado: ${dci}` }
      }

      await supabase.from('presentacion_comercial').insert({
        ...mapped,
        codigo_nacional: cn,
        principio_activo_id: pa.id,
        cima_datos_raw: cimaData,
        cima_last_sync: new Date().toISOString(),
      })

      await logSync(supabase, cn, 'nueva_presentacion', { dci })
      return { cn, status: 'created' }
    }

    // Actualizar siempre cima_datos_raw y cima_last_sync
    await supabase
      .from('presentacion_comercial')
      .update({
        ...mapped,
        cima_datos_raw: cimaData,
        cima_last_sync: new Date().toISOString(),
      })
      .eq('codigo_nacional', cn)

    if (hasDiff) {
      const diff = buildDiff(existing.cima_datos_raw, cimaData)
      await logSync(supabase, cn, 'cambio_detectado', { diff })
      return { cn, status: 'updated' }
    }

    await logSync(supabase, cn, 'sync_ok', null)
    return { cn, status: 'ok' }
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    await logSync(supabase, cn, 'error', { message: msg }).catch(() => {})
    return { cn, status: 'error', error: msg }
  }
}

// deno-lint-ignore no-explicit-any
function mapCimaToPresentation(d: any) {
  return {
    nombre_comercial: d.nombre ?? null,
    laboratorio_titular: d.labtitular ?? null,
    forma_farmaceutica: d.formaFarmaceutica?.nombre ?? null,
    estado_comercializacion: d.estado?.aut ?? null,
    ficha_tecnica_url: d.docs?.find((doc: { tipo: number }) => doc.tipo === 1)?.url ?? null,
  }
}

// deno-lint-ignore no-explicit-any
function extractDci(d: any): string {
  const pa = d.principiosActivos?.[0]
  return (pa?.nombre ?? '').toLowerCase().trim()
}

// deno-lint-ignore no-explicit-any
function buildDiff(before: any, after: any): Record<string, { before: unknown; after: unknown }> {
  const diff: Record<string, { before: unknown; after: unknown }> = {}
  const keys = new Set([...Object.keys(before ?? {}), ...Object.keys(after ?? {})])
  for (const k of keys) {
    if (JSON.stringify(before?.[k]) !== JSON.stringify(after?.[k])) {
      diff[k] = { before: before?.[k], after: after?.[k] }
    }
  }
  return diff
}

// deno-lint-ignore no-explicit-any
async function logSync(supabase: any, cn: string, tipo: string, detalle: unknown) {
  await supabase.from('cima_sync_log').insert({
    codigo_nacional: cn,
    tipo_evento: tipo,
    detalle,
  })
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
