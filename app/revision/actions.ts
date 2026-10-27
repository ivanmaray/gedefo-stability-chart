'use server'

import { query, queryOne } from '@/lib/db'
import { revalidatePath } from 'next/cache'
import type { Database } from '@/lib/types'
import { formatearTextoCima } from '@/lib/cima-format'

type Novedad = Database['public']['Tables']['cima_novedad']['Row']

async function logEvento(cn: string, tipo: string, detalle: unknown) {
  await query(
    'insert into cima_sync_log (codigo_nacional, tipo_evento, detalle) values ($1, $2, $3::jsonb)',
    [cn, tipo, JSON.stringify(detalle ?? null)],
  )
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
  n: Novedad,
  revisor: string,
  now: string,
): Promise<{ incorporada: boolean; paCreado: boolean; error?: string }> {
  // 1. Principio activo: reutilizar por ATC o crear nuevo.
  let paId = n.principio_activo_id
  let paCreado = false
  if (!paId) {
    if (!n.atc_code) return { incorporada: false, paCreado: false, error: 'Sin ATC; no puedo crear el principio activo.' }
    const existente = await queryOne<{ id: string }>('select id from principio_activo where atc_code = $1', [n.atc_code])
    if (existente) {
      paId = existente.id
    } else {
      try {
        const nuevoPa = await queryOne<{ id: string }>(
          'insert into principio_activo (dci, atc_code) values ($1, $2) returning id',
          [normalizeDci(n.dci) ?? n.codigo_nacional, n.atc_code],
        )
        if (!nuevoPa) return { incorporada: false, paCreado: false, error: 'PA: no se pudo crear' }
        paId = nuevoPa.id
        paCreado = true
      } catch (e: any) {
        return { incorporada: false, paCreado: false, error: `PA: ${e?.message ?? 'error'}` }
      }
    }
  }

  // 2. Presentación (nivel nregistro): reutilizar o crear.
  let presentacionId: string | null = null
  if (n.nregistro_cima) {
    const data = await queryOne<{ id: string }>('select id from presentacion_comercial where nregistro_cima = $1', [n.nregistro_cima])
    presentacionId = data?.id ?? null
  }
  if (!presentacionId) {
    // Heredar conservación de una presentación hermana del mismo PA, si todas
    // coinciden (las "IP"/importación paralela no tienen FT propia que parsear).
    let temp: string | null = null
    let luz = false
    const hermanas = await query<{ temperatura_conservacion: string | null; proteccion_luz_almacenamiento: boolean | null }>(
      'select temperatura_conservacion, proteccion_luz_almacenamiento from presentacion_comercial where principio_activo_id = $1 and temperatura_conservacion is not null',
      [paId],
    )
    const temps = [...new Set(hermanas.map((h) => h.temperatura_conservacion))]
    if (temps.length === 1) {
      temp = temps[0]
      luz = hermanas.some((h) => h.proteccion_luz_almacenamiento)
    }

    try {
      const nueva = await queryOne<{ id: string }>(
        `insert into presentacion_comercial
           (principio_activo_id, nregistro_cima, nombre_comercial, laboratorio_titular,
            forma_farmaceutica, ficha_tecnica_url, temperatura_conservacion,
            proteccion_luz_almacenamiento, cima_datos_raw, cima_last_sync)
         values ($1, $2, $3, $4, $5, $6, $7, $8, $9::jsonb, $10)
         returning id`,
        [
          paId,
          n.nregistro_cima,
          formatearTextoCima(n.nombre_comercial, { nombresPropios: true }) ?? 'Sin nombre',
          n.laboratorio_titular,
          formatearTextoCima(n.forma_farmaceutica),
          n.ficha_tecnica_url,
          temp,
          luz,
          JSON.stringify(n.cima_datos_raw ?? null),
          now,
        ],
      )
      if (!nueva) return { incorporada: false, paCreado, error: 'Presentación: no se pudo crear' }
      presentacionId = nueva.id
    } catch (e: any) {
      return { incorporada: false, paCreado, error: `Presentación: ${e?.message ?? 'error'}` }
    }
  }

  // 3. Envase (nivel CN). Un CN duplicado se considera "ya incorporado".
  let envErr: string | null = null
  try {
    await query('insert into envase (presentacion_id, codigo_nacional, comercializado) values ($1, $2, $3)', [
      presentacionId,
      n.codigo_nacional,
      n.comercializado ?? true,
    ])
  } catch (e: any) {
    if (e?.code !== '23505') envErr = e?.message ?? 'error' // 23505 = unique_violation
  }
  const incorporada = !envErr

  await query(
    `update cima_novedad
        set estado = 'aceptada', revisor_1 = $1, revisor_1_decision = 'incluir',
            revisor_1_fecha = $2, presentacion_creada_id = $3
      where id = $4`,
    [revisor, now, presentacionId, n.id],
  )

  await logEvento(n.codigo_nacional, 'nueva_presentacion', {
    via: 'confirmacion',
    por: revisor,
    pa_creado: paCreado,
    error: envErr,
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

  const n = await queryOne<Novedad>('select * from cima_novedad where id = $1', [input.id])
  if (!n) return { ok: false, error: 'Novedad no encontrada.' }
  if (n.estado === 'aceptada' || n.estado === 'rechazada') return { ok: false, error: `Ya resuelta (${n.estado}).` }

  const now = new Date().toISOString()

  if (input.decision === 'descartar') {
    await query(
      `update cima_novedad
          set estado = 'rechazada', revisor_1 = $1, revisor_1_decision = 'descartar', revisor_1_fecha = $2
        where id = $3`,
      [revisor, now, n.id],
    )
    await logEvento(n.codigo_nacional, 'novedad_detectada', { accion: 'descartada', por: revisor })
    revalidatePath('/revision')
    revalidatePath('/novedades')
    return { ok: true, estado: 'rechazada', incorporada: false, paCreado: false }
  }

  const r = await incorporarUna(n, revisor, now)
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

  const env = await queryOne<{ codigo_nacional: string | null }>('select codigo_nacional from envase where id = $1', [input.envaseId])
  const cn = env?.codigo_nacional ?? input.envaseId

  try {
    if (input.decision === 'retirar') {
      await query(
        `update envase set comercializado = false, baja_pendiente = false, estado_comercializacion = 'Retirada de CIMA' where id = $1`,
        [input.envaseId],
      )
      await logEvento(cn, 'baja_detectada', { accion: 'retirada', por: revisor })
    } else {
      await query('update envase set baja_pendiente = false where id = $1', [input.envaseId])
      await logEvento(cn, 'baja_detectada', { accion: 'mantenida', por: revisor })
    }
  } catch (e: any) {
    return { ok: false, error: e?.message ?? 'error' }
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

  let pend: { id: string; codigo_nacional: string | null }[]
  try {
    pend = await query('select id, codigo_nacional from envase where baja_pendiente = true')
  } catch (e: any) {
    return { ok: false, error: e?.message ?? 'error' }
  }

  let retiradas = 0
  for (const e of pend) {
    try {
      await query(
        `update envase set comercializado = false, baja_pendiente = false, estado_comercializacion = 'Retirada de CIMA' where id = $1`,
        [e.id],
      )
      retiradas++
      await logEvento(e.codigo_nacional ?? e.id, 'baja_detectada', { accion: 'retirada', por: revisor, bulk: true })
    } catch {
      // seguimos con las demás
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

  let pendientes: Novedad[]
  try {
    pendientes = await query<Novedad>('select * from cima_novedad where estado = any($1::text[])', [['pendiente', 'en_revision']])
  } catch (e: any) {
    return { ok: false, error: e?.message ?? 'error' }
  }

  const now = new Date().toISOString()
  let incorporadas = 0
  let paCreados = 0
  let errores = 0
  for (const n of pendientes) {
    const r = await incorporarUna(n, revisor, now)
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
