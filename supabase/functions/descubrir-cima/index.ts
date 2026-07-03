/**
 * descubrir-cima — Edge Function
 *
 * Barrido de DESCUBRIMIENTO de novedades en CIMA por código ATC (por defecto
 * L01, antineoplásicos). A diferencia de `sync-cima` (que solo mantiene al día
 * lo que ya existe), esta función busca lo que AÚN NO está en la base de datos.
 *
 * NO inserta nada en producción: deja las novedades detectadas en la tabla
 * `cima_novedad` (cola de revisión) para su valoración por DOBLE VALIDACIÓN
 * (2 revisores) antes de incorporarlas. Todo queda registrado en `cima_sync_log`.
 *
 * Detecta dos cosas:
 *   A. Medicamentos nuevos — nº de registro del ATC que no están en la BD.
 *   B. Presentaciones nuevas — CN nuevos bajo medicamentos que YA conocemos.
 *
 * Uso:
 *   POST /functions/v1/descubrir-cima
 *   Body (todo opcional): { "atc": "L01", "max_detalle": 40 }
 *
 * Cron: invocable sin body (atc=L01). El tope `max_detalle` acota la duración;
 * como las novedades ya encoladas no se re-procesan, el barrido es reanudable
 * entre ejecuciones (la primera pasada completa requiere varias ejecuciones).
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const CIMA_BASE = 'https://cima.aemps.es/cima/rest'
const DELAY_MS = 1000 // 1 req/s — conservador con CIMA
const PAGE_SIZE = 200
const MAX_PAGES = 30 // salvaguarda anti-bucle

Deno.serve(async (req) => {
  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    )

    const body = req.method === 'POST' ? await req.json().catch(() => ({})) : {}
    const atc: string = (body.atc ?? 'L01').toString().toUpperCase()
    const maxDetalle: number = Number(body.max_detalle ?? 40)

    // ── 1. Estado actual de la BD ──────────────────────────────────────────
    // Modelo jerárquico: presentacion_comercial = nivel nregistro; envase = nivel CN.
    const [pres, env, pas, nov] = await Promise.all([
      supabase.from('presentacion_comercial').select('nregistro_cima'),
      supabase.from('envase').select('codigo_nacional'),
      supabase.from('principio_activo').select('id, dci'),
      supabase.from('cima_novedad').select('codigo_nacional, nregistro_cima'),
    ])
    if (pres.error) throw pres.error
    if (env.error) throw env.error
    if (pas.error) throw pas.error
    if (nov.error) throw nov.error

    const knownCn = new Set<string>()
    const knownNreg = new Set<string>()
    for (const r of env.data ?? []) {
      if (r.codigo_nacional) knownCn.add(String(r.codigo_nacional))
    }
    for (const r of pres.data ?? []) {
      if (r.nregistro_cima) knownNreg.add(String(r.nregistro_cima))
    }
    const paByDci = new Map<string, string>()
    for (const r of pas.data ?? []) {
      if (r.dci) paByDci.set(String(r.dci).toLowerCase().trim(), r.id)
    }
    // CN ya encolados y nregistros ya procesados por el barrido (para no repetir)
    const queuedCn = new Set<string>()
    const processedNreg = new Set<string>()
    for (const r of nov.data ?? []) {
      if (r.codigo_nacional) queuedCn.add(String(r.codigo_nacional))
      if (r.nregistro_cima) processedNreg.add(String(r.nregistro_cima))
    }

    // ── 2. Enumerar medicamentos del ATC en CIMA (nivel nregistro) ─────────
    const cimaNregistros: string[] = []
    let pagina = 1
    let total = Infinity
    while ((pagina - 1) * PAGE_SIZE < total && pagina <= MAX_PAGES) {
      await sleep(DELAY_MS)
      const page = await fetchJson(
        `${CIMA_BASE}/medicamentos?atc=${encodeURIComponent(atc)}&pagina=${pagina}`,
      )
      total = page?.totalFilas ?? 0
      for (const m of page?.resultados ?? []) {
        if (m?.comerc === false) continue // solo comercializados
        if (m?.nregistro) cimaNregistros.push(String(m.nregistro))
      }
      pagina++
    }

    // ── 3. Priorizar qué medicamentos abrir en detalle (acotado) ───────────
    // A) medicamentos nuevos (nunca vistos)   B) conocidos (buscar CN nuevos)
    const nuevos = cimaNregistros.filter((n) => !knownNreg.has(n) && !processedNreg.has(n))
    const conocidos = cimaNregistros.filter((n) => knownNreg.has(n))
    const cola = [...nuevos, ...conocidos].slice(0, maxDetalle)

    // ── 4. Abrir cada medicamento y detectar CN nuevos ─────────────────────
    const insertadosRun = new Set<string>()
    let nuevasPresentaciones = 0
    let nuevosPrincipios = 0

    for (const nregistro of cola) {
      await sleep(DELAY_MS)
      const med = await fetchJson(`${CIMA_BASE}/medicamento?nregistro=${nregistro}`)
      if (!med) continue

      const dci = extractDci(med)
      const paId = dci ? paByDci.get(dci) ?? null : null
      const tipo = paId ? 'nueva_presentacion' : 'nuevo_principio_activo'
      const atcCode = deepestAtc(med)
      const ftUrl = ftUrlOf(med)

      for (const p of med?.presentaciones ?? []) {
        const cn = p?.cn ? String(p.cn) : null
        if (!cn) continue
        if (knownCn.has(cn) || queuedCn.has(cn) || insertadosRun.has(cn)) continue

        const { error } = await supabase.from('cima_novedad').insert({
          tipo,
          codigo_nacional: cn,
          nregistro_cima: String(nregistro),
          dci: med?.principiosActivos?.[0]?.nombre ?? dci ?? null,
          atc_code: atcCode,
          nombre_comercial: p?.nombre ?? med?.nombre ?? null,
          laboratorio_titular: med?.labtitular ?? null,
          forma_farmaceutica: med?.formaFarmaceutica?.nombre ?? null,
          comercializado: med?.comerc ?? null,
          ficha_tecnica_url: ftUrl,
          principio_activo_id: paId,
          barrido_atc: atc,
          cima_datos_raw: med,
        })

        if (error) {
          // conflicto de unicidad = ya encolado por una ejecución solapada: ok
          if (!/duplicate key|unique/i.test(error.message)) {
            await logSync(supabase, cn, 'error', { fase: 'insert_novedad', message: error.message })
          }
          continue
        }

        insertadosRun.add(cn)
        if (tipo === 'nueva_presentacion') nuevasPresentaciones++
        else nuevosPrincipios++
        await logSync(supabase, cn, 'novedad_detectada', { tipo, nregistro, dci, atc: atcCode })
      }
    }

    // ── 5. Resumen + trazabilidad ──────────────────────────────────────────
    const resumen = {
      atc,
      medicamentos_cima: cimaNregistros.length,
      medicamentos_nuevos_pendientes: nuevos.length,
      detalle_procesados: cola.length,
      novedades_nuevas: insertadosRun.size,
      nuevas_presentaciones: nuevasPresentaciones,
      nuevos_principios_activos: nuevosPrincipios,
      quedan_por_procesar: Math.max(0, nuevos.length - Math.min(nuevos.length, maxDetalle)),
    }
    await logSync(supabase, `atc:${atc}`, 'barrido_ok', resumen)

    return Response.json({ ok: true, ...resumen })
  } catch (err) {
    return Response.json(
      { ok: false, error: err instanceof Error ? err.message : String(err) },
      { status: 500 },
    )
  }
})

// deno-lint-ignore no-explicit-any
async function fetchJson(url: string): Promise<any | null> {
  try {
    const res = await fetch(url, { headers: { Accept: 'application/json' } })
    if (!res.ok) return null
    return await res.json()
  } catch {
    return null
  }
}

// deno-lint-ignore no-explicit-any
function extractDci(med: any): string {
  return (med?.principiosActivos?.[0]?.nombre ?? '').toLowerCase().trim()
}

// deno-lint-ignore no-explicit-any
function deepestAtc(med: any): string | null {
  const atcs = med?.atcs
  if (!Array.isArray(atcs) || atcs.length === 0) return null
  return atcs.reduce((a: { nivel?: number }, b: { nivel?: number }) =>
    (b?.nivel ?? 0) >= (a?.nivel ?? 0) ? b : a
  )?.codigo ?? null
}

// deno-lint-ignore no-explicit-any
function ftUrlOf(med: any): string | null {
  return med?.docs?.find((d: { tipo: number }) => d.tipo === 1)?.url ?? null
}

// deno-lint-ignore no-explicit-any
async function logSync(supabase: any, cn: string, tipo: string, detalle: unknown) {
  await supabase.from('cima_sync_log').insert({
    codigo_nacional: cn,
    tipo_evento: tipo,
    detalle,
  }).catch(() => {})
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
