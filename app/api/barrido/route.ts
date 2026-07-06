import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/lib/types'

// El barrido es lento (rate-limit con CIMA). Se ejecuta por LOTES acotados por
// `max_detalle` para caber en el límite de tiempo de la función; como es
// reanudable, basta con volver a pulsar el botón para procesar el siguiente lote.
export const maxDuration = 60
export const dynamic = 'force-dynamic'

const CIMA_BASE = 'https://cima.aemps.es/cima/rest'
const DELAY_MS = 500
const PAGE_SIZE = 200
const MAX_PAGES = 30

interface CimaAtc { codigo?: string; nivel?: number }
interface CimaDoc { tipo: number; url?: string }
interface CimaPresentacion { cn?: string; nombre?: string }
interface CimaVia { nombre?: string }
interface CimaMedicamento {
  nregistro?: string
  nombre?: string
  labtitular?: string
  comerc?: boolean
  formaFarmaceutica?: { nombre?: string }
  viasAdministracion?: CimaVia[]
  principiosActivos?: { nombre?: string }[]
  atcs?: CimaAtc[]
  docs?: CimaDoc[]
  presentaciones?: CimaPresentacion[]
}

// Alcance del proyecto: SOLO parenterales (preparación de mezclas). Oral, tópico,
// oftálmico, etc. quedan fuera. Criterio: vía de administración de CIMA (como la
// migración 00041), con la forma farmacéutica como respaldo si falta la vía.
const PARENTERAL_RE = /INTRAVEN|SUBCUT|INTRAMUSCULAR|INTRATECAL|INTRAARTERIAL|INTRAVESICAL|INTRAVITRE|INTRAPERITON|EPIDURAL|INTRALESIONAL|PERFUS|INFUS|PARENTERAL/
const norm = (s: string | undefined | null) =>
  (s ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toUpperCase()

function isParenteral(m: CimaMedicamento): boolean {
  const vias = m.viasAdministracion ?? []
  if (vias.length > 0) return vias.some((v) => PARENTERAL_RE.test(norm(v.nombre)))
  return /INYECTABLE|PERFUS|INFUS|INYECCION|DISPERSION PARA SOL/.test(norm(m.formaFarmaceutica?.nombre))
}
interface CimaLista { totalFilas?: number; resultados?: CimaMedicamento[] }

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

function deepestAtc(m: CimaMedicamento): string | null {
  const atcs = m.atcs
  if (!Array.isArray(atcs) || atcs.length === 0) return null
  const code = atcs.reduce((a, b) => ((b?.nivel ?? 0) >= (a?.nivel ?? 0) ? b : a)).codigo
  return code ? code.toUpperCase() : null
}

function ftUrlOf(m: CimaMedicamento): string | null {
  return m.docs?.find((d) => d.tipo === 1)?.url ?? null
}

export async function POST(req: Request) {
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (!url || !key) {
      return NextResponse.json({ ok: false, error: 'Falta SUPABASE_SERVICE_ROLE_KEY en el entorno.' }, { status: 500 })
    }
    const supabase = createClient<Database>(url, key)

    const body = await req.json().catch(() => ({}))
    const atc: string = (body?.atc ?? 'L01').toString().toUpperCase()
    const maxDetalle: number = Number(body?.max_detalle ?? 25)

    // 1. Estado actual (modelo jerárquico: presentacion=nregistro, envase=CN)
    const [pres, env, pas, nov] = await Promise.all([
      supabase.from('presentacion_comercial').select('nregistro_cima'),
      supabase.from('envase').select('codigo_nacional'),
      supabase.from('principio_activo').select('id, atc_code'),
      supabase.from('cima_novedad').select('codigo_nacional, nregistro_cima'),
    ])
    if (pres.error) throw pres.error
    if (env.error) throw env.error
    if (pas.error) throw pas.error
    if (nov.error) throw nov.error

    const knownCn = new Set<string>()
    for (const r of env.data ?? []) if (r.codigo_nacional) knownCn.add(String(r.codigo_nacional))
    const knownNreg = new Set<string>()
    for (const r of pres.data ?? []) if (r.nregistro_cima) knownNreg.add(String(r.nregistro_cima))
    const paByAtc = new Map<string, string>()
    for (const r of pas.data ?? []) if (r.atc_code) paByAtc.set(String(r.atc_code).toUpperCase(), r.id)
    const queuedCn = new Set<string>()
    const processedNreg = new Set<string>()
    for (const r of nov.data ?? []) {
      if (r.codigo_nacional) queuedCn.add(String(r.codigo_nacional))
      if (r.nregistro_cima) processedNreg.add(String(r.nregistro_cima))
    }

    // 2. Enumerar medicamentos del ATC en CIMA
    const cimaNregistros: string[] = []
    let pagina = 1
    let total = Infinity
    while ((pagina - 1) * PAGE_SIZE < total && pagina <= MAX_PAGES) {
      await sleep(DELAY_MS)
      const page = (await fetchJson(`${CIMA_BASE}/medicamentos?atc=${encodeURIComponent(atc)}&pagina=${pagina}`)) as CimaLista | null
      total = page?.totalFilas ?? 0
      for (const m of page?.resultados ?? []) {
        if (m?.comerc === false) continue
        if (!isParenteral(m)) continue // solo parenterales (oral/tópico fuera)
        if (m?.nregistro) cimaNregistros.push(String(m.nregistro))
      }
      pagina++
    }

    // 3. Priorizar: medicamentos nuevos, luego conocidos (para CN nuevos)
    const nuevos = cimaNregistros.filter((n) => !knownNreg.has(n) && !processedNreg.has(n))
    const conocidos = cimaNregistros.filter((n) => knownNreg.has(n))
    const cola = [...nuevos, ...conocidos].slice(0, maxDetalle)

    // 4. Abrir cada medicamento y encolar CN nuevos
    const insertadosRun = new Set<string>()
    let nuevasPresentaciones = 0
    let nuevosPrincipios = 0

    for (const nregistro of cola) {
      await sleep(DELAY_MS)
      const med = (await fetchJson(`${CIMA_BASE}/medicamento?nregistro=${nregistro}`)) as CimaMedicamento | null
      if (!med) continue

      const atcCode = deepestAtc(med)
      // CIMA hace match por substring en ?atc=, colando vacunas J07*L01*, etc.:
      // exigir que el ATC real empiece por el prefijo pedido.
      if (!atcCode || !atcCode.startsWith(atc)) continue
      // Emparejar por CÓDIGO ATC (robusto ante sales y variantes ortográficas del nombre).
      const paId = paByAtc.get(atcCode) ?? null
      const tipo = paId ? 'nueva_presentacion' : 'nuevo_principio_activo'
      const dci = med.principiosActivos?.[0]?.nombre ?? null
      const ftUrl = ftUrlOf(med)

      for (const p of med.presentaciones ?? []) {
        const cn = p?.cn ? String(p.cn) : null
        if (!cn) continue
        if (knownCn.has(cn) || queuedCn.has(cn) || insertadosRun.has(cn)) continue

        const { error } = await supabase.from('cima_novedad').insert({
          tipo,
          codigo_nacional: cn,
          nregistro_cima: String(nregistro),
          dci,
          atc_code: atcCode,
          nombre_comercial: p?.nombre ?? med.nombre ?? null,
          laboratorio_titular: med.labtitular ?? null,
          forma_farmaceutica: med.formaFarmaceutica?.nombre ?? null,
          comercializado: med.comerc ?? null,
          ficha_tecnica_url: ftUrl,
          principio_activo_id: paId,
          barrido_atc: atc,
          cima_datos_raw: med as unknown as Database['public']['Tables']['cima_novedad']['Insert']['cima_datos_raw'],
        })
        if (error) continue

        insertadosRun.add(cn)
        if (tipo === 'nueva_presentacion') nuevasPresentaciones++
        else nuevosPrincipios++
        await supabase.from('cima_sync_log').insert({
          codigo_nacional: cn,
          tipo_evento: 'novedad_detectada',
          detalle: { tipo, nregistro, dci, atc: atcCode },
        })
      }
    }

    const resumen = {
      ok: true,
      atc,
      medicamentos_cima: cimaNregistros.length,
      detalle_procesados: cola.length,
      novedades_nuevas: insertadosRun.size,
      nuevas_presentaciones: nuevasPresentaciones,
      nuevos_principios_activos: nuevosPrincipios,
      quedan_por_procesar: Math.max(0, nuevos.length - Math.min(nuevos.length, maxDetalle)),
    }
    await supabase.from('cima_sync_log').insert({
      codigo_nacional: `atc:${atc}`,
      tipo_evento: 'barrido_ok',
      detalle: resumen,
    })

    return NextResponse.json(resumen)
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : String(err) },
      { status: 500 },
    )
  }
}
