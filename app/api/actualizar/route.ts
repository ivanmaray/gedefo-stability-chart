import { NextResponse } from 'next/server'
import { query, queryOne } from '@/lib/db'

// ACTUALIZAR EXISTENTES: sincroniza la info de las presentaciones que YA tenemos
// con CIMA (distinto del barrido, que descubre presentaciones nuevas).
//   Fase A — problema de suministro: lista completa de CIMA (/psuministro) cruzada
//            con nuestros CN. Cubre todo el catálogo de una vez. Solo en la 1ª
//            llamada de una vuelta (suministro=true).
//   Fase B — bajas: por CN (/presentaciones?cn=), en lotes. El cliente pasa `desde`
//            (inicio de la vuelta) y encadena llamadas hasta bajas_pendientes=0,
//            así una sola pulsación recorre todo el catálogo.
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
    const body = await req.json().catch(() => ({}))
    const maxBajas: number = Number(body?.max_bajas ?? 80)
    // Inicio de la vuelta: solo se revisan envases no tocados desde este instante.
    const desde: string = body?.desde ?? new Date().toISOString()
    const conSuministro: boolean = body?.suministro !== false

    // ── FASE A: problema de suministro (solo en la 1ª llamada de la vuelta) ──
    let suministroMarcados = 0
    let suministroResueltos = 0
    if (conSuministro) {
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

      const envs = await query<{ id: string; codigo_nacional: string | null; problema_suministro: boolean | null }>(
        'select id, codigo_nacional, problema_suministro from envase where codigo_nacional is not null',
      )

      for (const e of envs) {
        const cn = String(e.codigo_nacional)
        const desired = shortage.has(cn)
        if (desired === e.problema_suministro) continue
        if (desired) {
          const d = shortage.get(cn)!
          await query(
            'update envase set problema_suministro = true, psum_observaciones = $1, psum_fecha_inicio = $2, psum_fecha_fin = $3 where id = $4',
            [d.observ, d.fini, d.ffin, e.id],
          )
          suministroMarcados++
        } else {
          await query(
            'update envase set problema_suministro = false, psum_observaciones = null, psum_fecha_inicio = null, psum_fecha_fin = null where id = $1',
            [e.id],
          )
          suministroResueltos++
        }
      }
    }

    // ── FASE B: bajas por CN (lote de la vuelta) ────────────────────────────
    // Pendientes en esta vuelta: nunca revisados o revisados antes de `desde`.
    const lote = await query<{ id: string; codigo_nacional: string | null }>(
      `select id, codigo_nacional from envase
         where comercializado = true and codigo_nacional is not null
           and (cima_revisado_en is null or cima_revisado_en < $1)
         order by cima_revisado_en asc nulls first
         limit $2`,
      [desde, maxBajas],
    )

    const now = new Date().toISOString()
    let bajasNuevas = 0
    for (const e of lote) {
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
      if (motivo) {
        await query(
          'update envase set cima_revisado_en = $1, baja_pendiente = true, baja_motivo = $2, baja_detectada_en = $1 where id = $3',
          [now, motivo, e.id],
        )
        bajasNuevas++
        await query(
          'insert into cima_sync_log (codigo_nacional, tipo_evento, detalle) values ($1, $2, $3::jsonb)',
          [cn, 'baja_detectada', JSON.stringify({ motivo })],
        )
      } else {
        await query('update envase set cima_revisado_en = $1 where id = $2', [now, e.id])
      }
    }

    // Cuántos envases quedan por revisar en esta vuelta.
    const cnt = await queryOne<{ count: number }>(
      `select count(*)::int as count from envase
         where comercializado = true and codigo_nacional is not null
           and (cima_revisado_en is null or cima_revisado_en < $1)`,
      [desde],
    )
    const pendientes = cnt?.count ?? 0

    const resumen = {
      ok: true,
      desde,
      suministro_marcados: suministroMarcados,
      suministro_resueltos: suministroResueltos,
      bajas_nuevas: bajasNuevas,
      revisados_lote: lote.length,
      bajas_pendientes: pendientes,
    }
    if (conSuministro) {
      await query(
        'insert into cima_sync_log (codigo_nacional, tipo_evento, detalle) values ($1, $2, $3::jsonb)',
        ['actualizar', 'barrido_ok', JSON.stringify(resumen)],
      )
    }
    return NextResponse.json(resumen)
  } catch (err) {
    return NextResponse.json({ ok: false, error: err instanceof Error ? err.message : String(err) }, { status: 500 })
  }
}
