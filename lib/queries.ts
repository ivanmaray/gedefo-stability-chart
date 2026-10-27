import { query } from './db'

type Row = Record<string, any>

function groupBy(rows: Row[], key: string): Map<any, Row[]> {
  const m = new Map<any, Row[]>()
  for (const r of rows) {
    const k = r[key]
    const arr = m.get(k)
    if (arr) arr.push(r)
    else m.set(k, [r])
  }
  return m
}

/**
 * Datos completos de la home: todos los principios activos con sus
 * presentaciones (+envases), condiciones de preparación, administración,
 * compatibilidades, estabilidades y matriz de riesgo. Cada hijo lleva su
 * `referencia` embebida. Reproduce la forma que devolvía la consulta anidada
 * de Supabase, así el JSX de la página no cambia.
 */
export async function getHomeData(): Promise<Row[]> {
  const [pas, pres, envases, cond, admin, dilu, mat, estab, matriz, refs] = await Promise.all([
    query('select * from principio_activo order by dci'),
    query('select * from presentacion_comercial order by created_at nulls last, id'),
    query('select * from envase order by created_at nulls last, id'),
    query('select * from condicion_preparacion'),
    query('select * from administracion'),
    query('select * from compatibilidad_diluente'),
    query('select * from compatibilidad_material'),
    query('select * from estabilidad'),
    query('select * from matriz_riesgo'),
    query('select id, titulo, tipo_fuente, url, anio, autores from referencia'),
  ])

  const refById = new Map<any, Row>(refs.map((r) => [r.id, r]))
  const withRef = (row: Row): Row => ({
    ...row,
    referencia: row.referencia_id ? refById.get(row.referencia_id) ?? null : null,
  })

  const envByPres = groupBy(envases, 'presentacion_id')
  const presWithEnv = pres.map((p) => ({ ...p, envase: envByPres.get(p.id) ?? [] }))
  const presByPa = groupBy(presWithEnv, 'principio_activo_id')
  const condByPa = groupBy(cond.map(withRef), 'principio_activo_id')
  const diluByPa = groupBy(dilu.map(withRef), 'principio_activo_id')
  const matByPa = groupBy(mat.map(withRef), 'principio_activo_id')
  const estabByPa = groupBy(estab.map(withRef), 'principio_activo_id')
  const matrizByPa = groupBy(matriz.map(withRef), 'principio_activo_id')
  // administración lleva dos referencias: la normal y la de extravasación.
  const adminByPa = groupBy(
    admin.map((a) => ({
      ...a,
      referencia: a.referencia_id ? refById.get(a.referencia_id) ?? null : null,
      referencia_extravasacion: a.referencia_extravasacion_id
        ? refById.get(a.referencia_extravasacion_id) ?? null
        : null,
    })),
    'principio_activo_id',
  )

  return pas.map((pa) => ({
    ...pa,
    presentacion_comercial: presByPa.get(pa.id) ?? [],
    condicion_preparacion: condByPa.get(pa.id) ?? [],
    administracion: adminByPa.get(pa.id) ?? [],
    compatibilidad_diluente: diluByPa.get(pa.id) ?? [],
    compatibilidad_material: matByPa.get(pa.id) ?? [],
    estabilidad: estabByPa.get(pa.id) ?? [],
    matriz_riesgo: matrizByPa.get(pa.id) ?? [],
  }))
}

/** Detalle de un principio activo con sus tablas relacionadas (página /farmaco/[id]). */
export async function getDrugDetail(id: string): Promise<{
  pa: Row | null
  presentaciones: Row[]
  estabilidades: Row[]
  condiciones: Row[]
  administraciones: Row[]
  compatibilidades: Row[]
  compatDiluentes: Row[]
  matrizRiesgo: Row | null
}> {
  const [paRows, pres, envases, estab, cond, admin, compat, dilu, matrizRows] = await Promise.all([
    query('select * from principio_activo where id = $1', [id]),
    query('select * from presentacion_comercial where principio_activo_id = $1 order by nombre_comercial', [id]),
    query('select e.* from envase e join presentacion_comercial p on p.id = e.presentacion_id where p.principio_activo_id = $1', [id]),
    query('select * from estabilidad where principio_activo_id = $1 order by temperatura_celsius', [id]),
    query('select * from condicion_preparacion where principio_activo_id = $1', [id]),
    query('select * from administracion where principio_activo_id = $1', [id]),
    query('select * from compatibilidad_material where principio_activo_id = $1 order by resultado', [id]),
    query('select * from compatibilidad_diluente where principio_activo_id = $1 order by resultado', [id]),
    query('select * from matriz_riesgo where principio_activo_id = $1 limit 1', [id]),
  ])
  const envByPres = groupBy(envases, 'presentacion_id')
  const presentaciones = pres.map((p) => ({ ...p, envase: envByPres.get(p.id) ?? [] }))
  return {
    pa: paRows[0] ?? null,
    presentaciones,
    estabilidades: estab,
    condiciones: cond,
    administraciones: admin,
    compatibilidades: compat,
    compatDiluentes: dilu,
    matrizRiesgo: matrizRows[0] ?? null,
  }
}

/** Novedades CIMA pendientes (estado pendiente/en_revision), para /novedades y /revision. */
export async function getNovedadesPendientes(ascending = false): Promise<Row[]> {
  return query(
    `select * from cima_novedad
       where estado = any($1::text[])
       order by detectada_en ${ascending ? 'asc' : 'desc'} nulls last`,
    [['pendiente', 'en_revision']],
  )
}

/** Envases marcados como baja pendiente, con su presentación y principio activo (para /revision). */
export async function getBajasPendientes(): Promise<{
  envaseId: string
  codigo_nacional: string | null
  motivo: string | null
  dci: string | null
  nombre_comercial: string | null
  atc_code: string | null
}[]> {
  const rows = await query(
    `select e.id as envase_id, e.codigo_nacional, e.baja_motivo,
            p.nombre_comercial, pa.dci, pa.atc_code
       from envase e
       join presentacion_comercial p on p.id = e.presentacion_id
       join principio_activo pa on pa.id = p.principio_activo_id
      where e.baja_pendiente = true`,
  )
  return rows.map((e) => ({
    envaseId: e.envase_id,
    codigo_nacional: e.codigo_nacional,
    motivo: e.baja_motivo,
    dci: e.dci,
    nombre_comercial: e.nombre_comercial,
    atc_code: e.atc_code,
  }))
}
