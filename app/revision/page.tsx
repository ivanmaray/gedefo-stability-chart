import { supabase } from '@/lib/supabase'
import type { Database } from '@/lib/types'
import RevisionPanel from './RevisionPanel'

export const revalidate = 0

type Novedad = Database['public']['Tables']['cima_novedad']['Row']

export default async function RevisionPage() {
  const { data, error } = await supabase
    .from('cima_novedad')
    .select('*')
    .in('estado', ['pendiente', 'en_revision'])
    .order('detectada_en', { ascending: true })

  const novedades: Novedad[] = data ?? []

  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      <header className="mb-6">
        <h1 className="text-xl font-semibold text-gray-900">Revisión de novedades CIMA</h1>
        <p className="mt-1 text-sm text-gray-500 max-w-3xl">
          Doble validación: cada novedad necesita el visto bueno de <strong>2 revisores distintos</strong>.
          Si ambos marcan <strong>Incluir</strong>, se incorpora a la base de datos (las presentaciones nuevas
          se crean automáticamente; un principio activo nuevo se marca aceptado para alta manual de ficha).
          Si alguno marca <strong>Descartar</strong>, se rechaza. Todo queda en el log de auditoría.
        </p>
      </header>

      {error && <p className="mb-4 text-sm text-red-600">Error al cargar: {error.message}</p>}

      <RevisionPanel novedades={novedades} />
    </main>
  )
}
