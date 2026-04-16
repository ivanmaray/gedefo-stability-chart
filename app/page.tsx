import { supabase } from '@/lib/supabase'
import DrugList from '@/components/DrugList'

export const revalidate = 60

export default async function HomePage() {
  const { data: drugs, error } = await supabase
    .from('principio_activo')
    .select('*')
    .order('dci', { ascending: true })

  if (error) {
    return (
      <div className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg p-4">
        Error al cargar datos: {error.message}
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Principios activos</h1>
        <p className="text-sm text-gray-500 mt-1">
          {drugs?.length ?? 0} fármaco{drugs?.length !== 1 ? 's' : ''} registrado{drugs?.length !== 1 ? 's' : ''}
        </p>
      </div>
      <DrugList drugs={drugs ?? []} />
    </div>
  )
}
