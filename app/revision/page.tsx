import { supabase } from '@/lib/supabase'
import type { Database } from '@/lib/types'
import RevisionPanel, { type BajaItem } from './RevisionPanel'

export const revalidate = 0

type Novedad = Database['public']['Tables']['cima_novedad']['Row']

export default async function RevisionPage() {
  const [novRes, bajaRes] = await Promise.all([
    supabase
      .from('cima_novedad')
      .select('*')
      .in('estado', ['pendiente', 'en_revision'])
      .order('detectada_en', { ascending: true }),
    supabase
      .from('envase')
      .select('id, codigo_nacional, baja_motivo, presentacion_comercial(nombre_comercial, principio_activo(dci, atc_code))')
      .eq('baja_pendiente', true),
  ])

  const novedades: Novedad[] = novRes.data ?? []
  const bajas: BajaItem[] = (bajaRes.data ?? []).map((e) => {
    const pres = Array.isArray(e.presentacion_comercial) ? e.presentacion_comercial[0] : e.presentacion_comercial
    const pa = pres && (Array.isArray(pres.principio_activo) ? pres.principio_activo[0] : pres.principio_activo)
    return {
      envaseId: e.id,
      codigo_nacional: e.codigo_nacional,
      motivo: e.baja_motivo,
      dci: pa?.dci ?? null,
      nombre_comercial: pres?.nombre_comercial ?? null,
      atc_code: pa?.atc_code ?? null,
    }
  })

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

      {novRes.error && <p className="mb-4 text-sm text-red-600">Error al cargar novedades: {novRes.error.message}</p>}

      <RevisionPanel novedades={novedades} bajas={bajas} />
    </main>
  )
}
