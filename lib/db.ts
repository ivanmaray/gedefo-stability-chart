import { Pool } from 'pg'

// Pool de conexiones a PostgreSQL. Reemplaza al cliente de Supabase.
// Se guarda en globalThis para sobrevivir al hot-reload de Next en desarrollo
// (si no, cada recarga abriría un pool nuevo y agotaría conexiones).
const globalForPg = globalThis as unknown as { _pgPool?: Pool }

export const pool =
  globalForPg._pgPool ??
  new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 10,
    idleTimeoutMillis: 30_000,
  })

if (process.env.NODE_ENV !== 'production') globalForPg._pgPool = pool

/** Ejecuta una consulta y devuelve las filas. */
export async function query<T = any>(text: string, params?: unknown[]): Promise<T[]> {
  const res = await pool.query(text, params)
  return res.rows as T[]
}

/** Ejecuta una consulta y devuelve la primera fila (o null). */
export async function queryOne<T = any>(text: string, params?: unknown[]): Promise<T | null> {
  const rows = await query<T>(text, params)
  return rows[0] ?? null
}
