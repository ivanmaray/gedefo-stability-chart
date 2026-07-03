'use server'

import { createClient } from '@supabase/supabase-js'
import { revalidatePath } from 'next/cache'
import type { Database, Json } from '@/lib/types'

type NovedadUpdate = Database['public']['Tables']['cima_novedad']['Update']

async function logEvento(db: ReturnType<typeof admin>, cn: string, tipo: string, detalle: Json) {
  await db.from('cima_sync_log').insert({ codigo_nacional: cn, tipo_evento: tipo, detalle })
}

// Cliente con service role: las escrituras de gobernanza van server-side.
function admin() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  )
}

type VotoResult =
  | { ok: true; estado: string; promovida: boolean }
  | { ok: false; error: string }

/**
 * Registra el voto de un revisor sobre una novedad (DOBLE VALIDACIÓN).
 * - Cada novedad necesita DOS revisores distintos.
 * - Solo se acepta (e incorpora a producción) si AMBOS dicen "incluir".
 * - Si alguno dice "descartar", la novedad se rechaza.
 * Al aceptar una `nueva_presentacion` de un PA existente, se crea la fila en
 * `presentacion_comercial`. Un `nuevo_principio_activo` se marca aceptado pero
 * requiere alta manual de la ficha (no se autocrea).
 */
export async function votarNovedad(input: {
  id: string
  decision: 'incluir' | 'descartar'
  revisor: string
}): Promise<VotoResult> {
  const revisor = input.revisor.trim()
  if (!revisor) return { ok: false, error: 'Indica tu nombre como revisor.' }

  const db = admin()

  const { data: n, error } = await db
    .from('cima_novedad')
    .select('*')
    .eq('id', input.id)
    .maybeSingle()

  if (error || !n) return { ok: false, error: 'Novedad no encontrada.' }
  if (n.estado === 'aceptada' || n.estado === 'rechazada') {
    return { ok: false, error: `Ya resuelta (${n.estado}).` }
  }

  const now = new Date().toISOString()
  const patch: NovedadUpdate = {}

  if (!n.revisor_1) {
    patch.revisor_1 = revisor
    patch.revisor_1_decision = input.decision
    patch.revisor_1_fecha = now
    patch.estado = 'en_revision'
  } else if (n.revisor_1 === revisor) {
    return { ok: false, error: 'Ya votaste como revisor 1. Hacen falta DOS revisores distintos.' }
  } else if (!n.revisor_2) {
    patch.revisor_2 = revisor
    patch.revisor_2_decision = input.decision
    patch.revisor_2_fecha = now
  } else {
    return { ok: false, error: 'Ya hay dos revisores registrados.' }
  }

  // ¿Se cierra la doble validación?
  const d1 = patch.revisor_1_decision ?? n.revisor_1_decision
  const d2 = patch.revisor_2_decision ?? n.revisor_2_decision
  if (d1 && d2) {
    patch.estado = d1 === 'incluir' && d2 === 'incluir' ? 'aceptada' : 'rechazada'
  }

  const { error: upErr } = await db.from('cima_novedad').update(patch).eq('id', n.id)
  if (upErr) return { ok: false, error: upErr.message }

  // Promoción a producción (modelo jerárquico: presentacion_comercial=nregistro, envase=CN)
  let promovida = false
  if (patch.estado === 'aceptada' && n.tipo === 'nueva_presentacion' && n.principio_activo_id) {
    // 1. Presentación (nivel nregistro): reutilizar si ya existe, si no crearla.
    let presentacionId: string | null = null
    if (n.nregistro_cima) {
      const { data: existente } = await db
        .from('presentacion_comercial')
        .select('id')
        .eq('nregistro_cima', n.nregistro_cima)
        .maybeSingle()
      presentacionId = existente?.id ?? null
    }
    if (!presentacionId) {
      const { data: nueva, error: presErr } = await db
        .from('presentacion_comercial')
        .insert({
          principio_activo_id: n.principio_activo_id,
          nregistro_cima: n.nregistro_cima,
          nombre_comercial: n.nombre_comercial ?? 'Sin nombre',
          laboratorio_titular: n.laboratorio_titular,
          forma_farmaceutica: n.forma_farmaceutica,
          ficha_tecnica_url: n.ficha_tecnica_url,
          cima_datos_raw: n.cima_datos_raw,
          cima_last_sync: now,
        })
        .select('id')
        .maybeSingle()
      if (presErr) await logEvento(db, n.codigo_nacional, 'error', { fase: 'crear_presentacion', message: presErr.message })
      presentacionId = nueva?.id ?? null
    }

    // 2. Envase (nivel CN) bajo esa presentación.
    if (presentacionId) {
      const { error: envErr } = await db.from('envase').insert({
        presentacion_id: presentacionId,
        codigo_nacional: n.codigo_nacional,
        comercializado: n.comercializado ?? true,
      })
      if (!envErr) {
        await db.from('cima_novedad').update({ presentacion_creada_id: presentacionId }).eq('id', n.id)
        promovida = true
      }
      await logEvento(db, n.codigo_nacional, 'nueva_presentacion', {
        via: 'revision',
        promovida,
        error: envErr?.message ?? null,
      })
    }
  }

  revalidatePath('/revision')
  revalidatePath('/novedades')
  return { ok: true, estado: patch.estado ?? 'en_revision', promovida }
}
