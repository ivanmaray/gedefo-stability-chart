import { getNovedadesPendientes, getBajasPendientes } from '@/lib/queries'
import type { Database } from '@/lib/types'
import RevisionPanel, { type BajaItem } from './RevisionPanel'

export const revalidate = 0

type Novedad = Database['public']['Tables']['cima_novedad']['Row']

export default async function RevisionPage() {
  let novedades: Novedad[] = []
  let bajas: BajaItem[] = []
  let error: { message: string } | null = null
  try {
    const [nov, bj] = await Promise.all([getNovedadesPendientes(true), getBajasPendientes()])
    novedades = nov as Novedad[]
    bajas = bj
  } catch (e: any) {
    error = { message: e?.message ?? 'Error al cargar novedades' }
  }

  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      <header className="mb-6">
        <h1 className="text-xl font-semibold text-gray-900">Confirmar novedades CIMA</h1>
        <p className="mt-1 text-sm text-gray-500 max-w-3xl">
          Fase inicial: con la confirmación de <strong>1 persona</strong>, la novedad se
          <strong> incorpora directamente</strong> a la base de datos (se crea la presentación y su envase;
          si el principio activo es nuevo, se crea automáticamente con su ATC). Los campos clínicos
          (estabilidad, preparación) se rellenan y validan después. <strong>Descartar</strong> la rechaza.
          Todo queda en el log de auditoría.
        </p>
      </header>

      {error && <p className="mb-4 text-sm text-red-600">Error al cargar novedades: {error.message}</p>}

      <RevisionPanel novedades={novedades} bajas={bajas} />
    </main>
  )
}
