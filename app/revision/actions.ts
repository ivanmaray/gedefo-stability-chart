'use server'

import { createClient } from '@supabase/supabase-js'
import { revalidatePath } from 'next/cache'
import type { Database, Json } from '@/lib/types'
import { formatearTextoCima } from '@/lib/cima-format'

type Novedad = Database['public']['Tables']['cima_novedad']['Row']

// Cliente con service role: las escrituras van server-side.
function admin() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  )
}

async function logEvento(db: ReturnType<typeof admin>, cn: string, tipo: string, detalle: Json) {
  await db.from('cima_sync_log').insert({ codigo_nacional: cn, tipo_evento: tipo, detalle })
}

// Sales frecuentes a quitar del nombre para dejar la DCI base.
const SALT_RE =
  /\b(hidrocloruro|clorhidrato|dihidrocloruro|bromhidrato|sulfato|acetato|fosfato|difosfato|sodico|disodico|mesilato|besilato|tartrato|maleato|succinato|citrato|lactato|pamoato|tosilato|fumarato|gluconato|estearato|palmitato)\b/gi

function normalizeDci(dci: string | null): string | null {
  if (!dci) return null
  const limpio = dci.toLowerCase().replace(SALT_RE, '').replace(/\s+/g, ' ').trim()
  return limpio || dci.toLowerCase().trim()
}

/**
 * Núcleo: incorpora UNA novedad a producción (fase inicial, sin revisión de campos).
 * Crea el principio_activo si es nuevo (nombre CIMA normalizado + ATC), reutiliza/crea
 * la presentación (nregistro) y añade el envase (CN).
 */
async function incorporarUna(
  db: ReturnType<typeof admin>,
  n: Novedad,
  revisor: string,
  now: string,
): Promise<{ incorporada: boolean; paCreado: boolean; error?: string }> {
  // 1. Principio activo: reutilizar por ATC o crear nuevo.
  let paId = n.principio_activo_id
  let paCreado = false
  if (!paId) {
    if (!n.atc_code) return { incorporada: false, paCreado: false, error: 'Sin ATC; no puedo crear el principio activo.' }
    const { data: existente } = await db.from('principio_activo').select('id').eq('atc_code', n.atc_code).maybeSingle()
    if (existente) {
      paId = existente.id
    } else {
      const { data: nuevoPa, error: paErr } = await db
        .from('principio_activo')
        .insert({ dci: normalizeDci(n.dci) ?? n.codigo_nacional, atc_code: n.atc_code })
        .select('id')
        .maybeSingle()
      if (paErr || !nuevoPa) return { incorporada: false, paCreado: false, error: `PA: ${paErr?.message ?? 'error'}` }
      paId = nuevoPa.id
      paCreado = true
    }
  }

  // 2. Presentación (nivel nregistro): reutilizar o crear.
  let presentacionId: string | null = null
  if (n.nregistro_cima) {
    const { data } = await db.from('presentacion_comercial').select('id').eq('nregistro_cima', n.nregistro_cima).maybeSingle()
    presentacionId = data?.id ?? null
  }
  if (!presentacionId) {
    // Heredar conservación de una presentación hermana del mismo PA, si todas
    // coinciden (las "IP"/importación paralela no tienen FT propia que parsear).
    let temp: string | null = null
    let luz = false
    const { data: hermanas } = await db
      .from('presentacion_comercial')
      .select('temperatura_conservacion, proteccion_luz_almacenamiento')
      .eq('principio_activo_id', paId)
      .not('temperatura_conservacion', 'is', null)
    const temps = [...new Set((hermanas ?? []).map((h) => h.temperatura_conservacion))]
    if (temps.length === 1) {
      temp = temps[0]
      luz = (hermanas ?? []).some((h) => h.proteccion_luz_almacenamiento)
    }

    const { data: nueva, error: presErr } = await db
      .from('presentacion_comercial')
      .insert({
        principio_activo_id: paId,
        nregistro_cima: n.nregistro_cima,
        nombre_comercial: formatearTextoCima(n.nombre_comercial, { nombresPropios: true }) ?? 'Sin nombre',
        laboratorio_titular: n.laboratorio_titular,
        forma_farmaceutica: formatearTextoCima(n.forma_farmaceutica),
        ficha_tecnica_url: n.ficha_tecnica_url,
        temperatura_conservacion: temp,
        proteccion_luz_almacenamiento: luz,
        cima_datos_raw: n.cima_datos_raw,
        cima_last_sync: now,
      })
      .select('id')
      .maybeSingle()
    if (presErr || !nueva) return { incorporada: false, paCreado, error: `Presentación: ${presErr?.message ?? 'error'}` }
    presentacionId = nueva.id
  }

  // 3. Envase (nivel CN).
  const { error: envErr } = await db.from('envase').insert({
    presentacion_id: presentacionId,
    codigo_nacional: n.codigo_nacional,
    comercializado: n.comercializado ?? true,
  })
  const incorporada = !envErr || /duplicate|unique/i.test(envErr.message)

  await db.from('cima_novedad').update({
    estado: 'aceptada',
    revisor_1: revisor,
    revisor_1_decision: 'incluir',
    revisor_1_fecha: now,
    presentacion_creada_id: presentacionId,
  }).eq('id', n.id)

  await logEvento(db, n.codigo_nacional, 'nueva_presentacion', {
    via: 'confirmacion',
    por: revisor,
    pa_creado: paCreado,
    error: envErr?.message ?? null,
  })

  return { incorporada, paCreado }
}

type Result =
  | { ok: true; estado: string; incorporada: boolean; paCreado: boolean }
  | { ok: false; error: string }

/** Confirmación por 1 persona de una novedad: incorporar directo o descartar. */
export async function confirmarNovedad(input: {
  id: string
  decision: 'incorporar' | 'descartar'
  revisor: string
}): Promise<Result> {
  const revisor = input.revisor.trim()
  if (!revisor) return { ok: false, error: 'Indica tu nombre.' }

  const db = admin()
  const { data: n, error } = await db.from('cima_novedad').select('*').eq('id', input.id).maybeSingle()
  if (error || !n) return { ok: false, error: 'Novedad no encontrada.' }
  if (n.estado === 'aceptada' || n.estado === 'rechazada') return { ok: false, error: `Ya resuelta (${n.estado}).` }

  const now = new Date().toISOString()

  if (input.decision === 'descartar') {
    await db.from('cima_novedad').update({
      estado: 'rechazada',
      revisor_1: revisor,
      revisor_1_decision: 'descartar',
      revisor_1_fecha: now,
    }).eq('id', n.id)
    await logEvento(db, n.codigo_nacional, 'novedad_detectada', { accion: 'descartada', por: revisor })
    revalidatePath('/revision')
    revalidatePath('/novedades')
    return { ok: true, estado: 'rechazada', incorporada: false, paCreado: false }
  }

  const r = await incorporarUna(db, n, revisor, now)
  if (r.error) return { ok: false, error: r.error }
  revalidatePath('/revision')
  revalidatePath('/novedades')
  return { ok: true, estado: 'aceptada', incorporada: r.incorporada, paCreado: r.paCreado }
}

type BajaResult = { ok: true; estado: string } | { ok: false; error: string }

/** Confirmación por 1 persona de una BAJA: retirar (comercializado=false) o mantener. */
export async function confirmarBaja(input: {
  envaseId: string
  decision: 'retirar' | 'mantener'
  revisor: string
}): Promise<BajaResult> {
  const revisor = input.revisor.trim()
  if (!revisor) return { ok: false, error: 'Indica tu nombre.' }

  const db = admin()
  const { data: env } = await db.from('envase').select('codigo_nacional').eq('id', input.envaseId).maybeSingle()
  const cn = env?.codigo_nacional ?? input.envaseId

  if (input.decision === 'retirar') {
    const { error } = await db.from('envase').update({
      comercializado: false,
      baja_pendiente: false,
      estado_comercializacion: 'Retirada de CIMA',
    }).eq('id', input.envaseId)
    if (error) return { ok: false, error: error.message }
    await logEvento(db, cn, 'baja_detectada', { accion: 'retirada', por: revisor })
  } else {
    const { error } = await db.from('envase').update({ baja_pendiente: false }).eq('id', input.envaseId)
    if (error) return { ok: false, error: error.message }
    await logEvento(db, cn, 'baja_detectada', { accion: 'mantenida', por: revisor })
  }

  revalidatePath('/revision')
  revalidatePath('/novedades')
  return { ok: true, estado: input.decision === 'retirar' ? 'retirada' : 'mantenida' }
}

type BajaBulkResult = { ok: true; retiradas: number } | { ok: false; error: string }

/** Retira en bloque todas las bajas pendientes (comercializado=false, conserva histórico). */
export async function retirarTodasBajas(input: { revisor: string }): Promise<BajaBulkResult> {
  const revisor = input.revisor.trim()
  if (!revisor) return { ok: false, error: 'Indica tu nombre.' }

  const db = admin()
  const { data: pend, error } = await db.from('envase').select('id, codigo_nacional').eq('baja_pendiente', true)
  if (error) return { ok: false, error: error.message }

  let retiradas = 0
  for (const e of pend ?? []) {
    const { error: upErr } = await db.from('envase').update({
      comercializado: false,
      baja_pendiente: false,
      estado_comercializacion: 'Retirada de CIMA',
    }).eq('id', e.id)
    if (!upErr) {
      retiradas++
      await logEvento(db, e.codigo_nacional ?? e.id, 'baja_detectada', { accion: 'retirada', por: revisor, bulk: true })
    }
  }

  revalidatePath('/revision')
  revalidatePath('/novedades')
  return { ok: true, retiradas }
}

type BulkResult =
  | { ok: true; incorporadas: number; paCreados: number; errores: number }
  | { ok: false; error: string }

/** Incorpora en bloque todas las novedades pendientes (confirmación en bloque de 1 persona). */
export async function incorporarTodas(input: { revisor: string }): Promise<BulkResult> {
  const revisor = input.revisor.trim()
  if (!revisor) return { ok: false, error: 'Indica tu nombre.' }

  const db = admin()
  const { data: pendientes, error } = await db
    .from('cima_novedad')
    .select('*')
    .in('estado', ['pendiente', 'en_revision'])
  if (error) return { ok: false, error: error.message }

  const now = new Date().toISOString()
  let incorporadas = 0
  let paCreados = 0
  let errores = 0
  for (const n of pendientes ?? []) {
    const r = await incorporarUna(db, n, revisor, now)
    if (r.error) errores++
    else {
      incorporadas++
      if (r.paCreado) paCreados++
    }
  }

  revalidatePath('/revision')
  revalidatePath('/novedades')
  return { ok: true, incorporadas, paCreados, errores }
}
