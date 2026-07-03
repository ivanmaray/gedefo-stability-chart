import { supabase } from '@/lib/supabase'
import type { Database } from '@/lib/types'

export const revalidate = 0

type Novedad = Database['public']['Tables']['cima_novedad']['Row']

function fmtFecha(iso: string | null): string {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

// Doble validación: cuántos revisores han dicho "incluir" (de 2)
function votosIncluir(n: Novedad): number {
  return (n.revisor_1_decision === 'incluir' ? 1 : 0) + (n.revisor_2_decision === 'incluir' ? 1 : 0)
}

const estadoBadge: Record<string, string> = {
  pendiente:   'bg-amber-50 border-amber-200 text-amber-700',
  en_revision: 'bg-sky-50 border-sky-200 text-sky-700',
  aceptada:    'bg-green-50 border-green-200 text-green-700',
  rechazada:   'bg-gray-100 border-gray-200 text-gray-500',
}

function TablaNovedades({ filas }: { filas: Novedad[] }) {
  if (filas.length === 0) {
    return <p className="text-sm text-gray-400 italic">Sin novedades pendientes en esta categoría.</p>
  }
  return (
    <div className="overflow-x-auto border border-gray-200 rounded-lg">
      <table className="min-w-full text-[13px]">
        <thead className="bg-gray-50 text-gray-500 text-left">
          <tr>
            <th className="px-3 py-2 font-medium">Principio activo</th>
            <th className="px-3 py-2 font-medium">Presentación</th>
            <th className="px-3 py-2 font-medium">CN</th>
            <th className="px-3 py-2 font-medium">Nº registro</th>
            <th className="px-3 py-2 font-medium">Laboratorio</th>
            <th className="px-3 py-2 font-medium">ATC</th>
            <th className="px-3 py-2 font-medium">Detectada</th>
            <th className="px-3 py-2 font-medium">Validación (2)</th>
            <th className="px-3 py-2 font-medium">Estado</th>
            <th className="px-3 py-2 font-medium">FT</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {filas.map((n) => (
            <tr key={n.id} className="hover:bg-gray-50">
              <td className="px-3 py-2 font-medium text-gray-800 capitalize">{n.dci ?? '—'}</td>
              <td className="px-3 py-2 text-gray-600 max-w-[280px] truncate" title={n.nombre_comercial ?? ''}>
                {n.nombre_comercial ?? '—'}
              </td>
              <td className="px-3 py-2 font-mono text-gray-500">{n.codigo_nacional}</td>
              <td className="px-3 py-2 font-mono text-gray-400">{n.nregistro_cima ?? '—'}</td>
              <td className="px-3 py-2 text-gray-500 max-w-[160px] truncate" title={n.laboratorio_titular ?? ''}>
                {n.laboratorio_titular ?? '—'}
              </td>
              <td className="px-3 py-2 font-mono text-gray-400">{n.atc_code ?? '—'}</td>
              <td className="px-3 py-2 text-gray-500">{fmtFecha(n.detectada_en)}</td>
              <td className="px-3 py-2">
                <span className="font-mono text-gray-600">{votosIncluir(n)}/2</span>
              </td>
              <td className="px-3 py-2">
                <span className={`inline-block px-2 py-0.5 rounded border text-[11px] ${estadoBadge[n.estado] ?? 'bg-gray-50 border-gray-200 text-gray-500'}`}>
                  {n.estado}
                </span>
              </td>
              <td className="px-3 py-2">
                {n.ficha_tecnica_url
                  ? <a href={n.ficha_tecnica_url} target="_blank" rel="noopener noreferrer" className="text-sky-600 hover:underline">FT</a>
                  : '—'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default async function NovedadesPage() {
  const { data, error } = await supabase
    .from('cima_novedad')
    .select('*')
    .in('estado', ['pendiente', 'en_revision'])
    .order('detectada_en', { ascending: false })

  const filas: Novedad[] = data ?? []
  const nuevosPa = filas.filter((n) => n.tipo === 'nuevo_principio_activo')
  const nuevasPres = filas.filter((n) => n.tipo === 'nueva_presentacion')

  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      <header className="mb-6">
        <h1 className="text-xl font-semibold text-gray-900">Novedades CIMA pendientes de valorar</h1>
        <p className="mt-1 text-sm text-gray-500 max-w-3xl">
          Detectadas por el barrido de CIMA (ATC L01). <strong>No están incorporadas</strong>: requieren
          doble validación (2 revisores) antes de pasar a la base de datos. Cada fila queda registrada en
          el log de auditoría.
        </p>
      </header>

      {error && (
        <p className="mb-4 text-sm text-red-600">Error al cargar novedades: {error.message}</p>
      )}

      <section className="mb-8">
        <h2 className="text-sm font-semibold text-gray-700 mb-2">
          Principios activos nuevos <span className="text-gray-400 font-normal">({nuevosPa.length})</span>
        </h2>
        <p className="text-xs text-gray-400 mb-2">Fármacos de L01 que aún no existen en la base de datos.</p>
        <TablaNovedades filas={nuevosPa} />
      </section>

      <section>
        <h2 className="text-sm font-semibold text-gray-700 mb-2">
          Presentaciones nuevas <span className="text-gray-400 font-normal">({nuevasPres.length})</span>
        </h2>
        <p className="text-xs text-gray-400 mb-2">Nuevos códigos nacionales de principios activos que ya están en la base de datos.</p>
        <TablaNovedades filas={nuevasPres} />
      </section>
    </main>
  )
}
