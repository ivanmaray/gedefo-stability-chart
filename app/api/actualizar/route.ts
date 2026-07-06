import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/lib/types'

// ACTUALIZAR EXISTENTES: sincroniza la info de las presentaciones que YA tenemos
// con CIMA (distinto del barrido, que descubre presentaciones nuevas).
//   Fase A — problema de suministro: lista completa de CIMA (/psuministro) cruzada
//            con nuestros CN. Cubre todo el catálogo de una vez.
//   Fase B — bajas: por CN (/presentaciones?cn=), por lotes que ciclan con
//            cima_revisado_en para recorrer todo el catálogo en varias ejecuciones.
export const maxDuration = 60
export const dynamic = 'force-dynamic'

const CIMA_BASE = 'https://cima.aemps.es/cima/rest'
const DELAY_MS = 400
const PAGE_SIZE = 200

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))
async function fetchJson(url: string): Promise<unknown> {
  try {
    const res = await fetch(url, { headers: { Accept: 'application/json' } })
    if (!res.ok) return null
    return await res.json()
  } catch {
    return null
  }
}
const toDate = (ms?: number | null): string | null => (ms ? new Date(ms).toISOString().slice(0, 10) : null)

interface PsumItem { cn?: string; fini?: number; ffin?: number | null; activo?: boolean; observ?: string }
interface PsumLista { totalFilas?: number; resultados?: PsumItem[] }
interface PresLista { totalFilas?: number; resultados?: { comerc?: boolean; estado?: { rev?: number } }[] }

export async function POST(req: Request) {
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (!url || !key) return NextResponse.json({ ok: false, error: 'Falta SUPABASE_SERVICE_ROLE_KEY en el entorno.' }, { status: 500 })
    const supabase = createClient<Database>(url, key)

    const body = await req.json().catch(() => ({}))
    const maxBajas: number = Number(body?.max_bajas ?? 60)

    // ── FASE A: problema de suministro (lista completa de CIMA) ─────────────
    const shortage = new Map<string, { observ: string | null; fini: string | null; ffin: string | null }>()
    let pagina = 1
    let total = Infinity
    while ((pagina - 1) * PAGE_SIZE < total && pagina <= 10) {
      await sleep(DELAY_MS)
      const page = (await fetchJson(`${CIMA_BASE}/psuministro?pagina=${pagina}`)) as PsumLista | null
      total = page?.totalFilas ?? 0
      for (const p of page?.resultados ?? []) {
        if (p?.cn && p.activo !== false) {
          shortage.set(String(p.cn), { observ: p.observ ?? null, fini: toDate(p.fini), ffin: toDate(p.ffin) })
        }
      }
      pagina++
    }

    const { data: envs } = await supabase
      .from('envase')
      .select('id, codigo_nacional, problema_suministro')
      .not('codigo_nacional', 'is', null)

    let suministroMarcados = 0
    let suministroResueltos = 0
    for (const e of envs ?? []) {
      const cn = String(e.codigo_nacional)
      const desired = shortage.has(cn)
      if (desired === e.problema_suministro) continue
      if (desired) {
        const d = shortage.get(cn)!
        await supabase.from('envase').update({
          problema_suministro: true,
          psum_observaciones: d.observ,
          psum_fecha_inicio: d.fini,
          psum_fecha_fin: d.ffin,
        }).eq('id', e.id)
        suministroMarcados++
      } else {
        await supabase.from('envase').update({
          problema_suministro: false,
          psum_observaciones: null,
          psum_fecha_inicio: null,
          psum_fecha_fin: null,
        }).eq('id', e.id)
        suministroResueltos++
      }
    }

    // ── FASE B: bajas por CN (lote que cicla por cima_revisado_en) ──────────
    const { data: lote } = await supabase
      .from('envase')
      .select('id, codigo_nacional')
      .eq('comercializado', true)
      .not('codigo_nacional', 'is', null)
      .order('cima_revisado_en', { ascending: true, nullsFirst: true })
      .limit(maxBajas)

    const now = new Date().toISOString()
    let bajasNuevas = 0
    for (const e of lote ?? []) {
      const cn = String(e.codigo_nacional)
      await sleep(DELAY_MS)
      const pres = (await fetchJson(`${CIMA_BASE}/presentaciones?cn=${encodeURIComponent(cn)}`)) as PresLista | null
      let motivo: string | null = null
      if (!pres || (pres.totalFilas ?? 0) === 0) motivo = 'retirada_cima'
      else {
        const p = pres.resultados?.[0]
        if (p?.estado?.rev) motivo = 'revocada'
        else if (p?.comerc === false) motivo = 'no_comercializada'
      }
      const upd: Database['public']['Tables']['envase']['Update'] = { cima_revisado_en: now }
      if (motivo) {
        upd.baja_pendiente = true
        upd.baja_motivo = motivo
        upd.baja_detectada_en = now
        bajasNuevas++
        await supabase.from('cima_sync_log').insert({ codigo_nacional: cn, tipo_evento: 'baja_detectada', detalle: { motivo } })
      }
      await supabase.from('envase').update(upd).eq('id', e.id)
    }

    const resumen = {
      ok: true,
      suministro_marcados: suministroMarcados,
      suministro_resueltos: suministroResueltos,
      bajas_nuevas: bajasNuevas,
      envases_revisados_bajas: lote?.length ?? 0,
    }
    await supabase.from('cima_sync_log').insert({ codigo_nacional: 'actualizar', tipo_evento: 'barrido_ok', detalle: resumen })
    return NextResponse.json(resumen)
  } catch (err) {
    return NextResponse.json({ ok: false, error: err instanceof Error ? err.message : String(err) }, { status: 500 })
  }
}
