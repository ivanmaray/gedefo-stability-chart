import type { Database } from '@/lib/types'

type Presentacion = Database['public']['Tables']['presentacion_comercial']['Row']
type Envase = Database['public']['Tables']['envase']['Row']

const tempLabel: Record<string, string> = {
  nevera: 'Nevera (2-8°C)',
  ambiente: 'Temperatura ambiente',
  congelar: 'Congelar',
}

export default function PresentationCard({
  presentacion,
  envases,
}: {
  presentacion: Presentacion
  envases: Envase[]
}) {
  const hayPsum = envases.some((e) => e.problema_suministro)

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
      {/* Cabecera */}
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <p className="font-semibold text-gray-900 text-sm">{presentacion.nombre_comercial}</p>
            {hayPsum && (
              <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200 shrink-0">
                ⚠ Problema suministro
              </span>
            )}
          </div>
          {presentacion.laboratorio_titular && (
            <p className="text-xs text-gray-500 mt-0.5">{presentacion.laboratorio_titular}</p>
          )}
        </div>
        {presentacion.nregistro_cima && (
          <span className="text-xs font-mono bg-gray-100 text-gray-500 px-2 py-0.5 rounded shrink-0">
            Nreg {presentacion.nregistro_cima}
          </span>
        )}
      </div>

      {/* Propiedades */}
      <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs">
        {presentacion.forma_farmaceutica && (
          <Row label="Forma" value={presentacion.forma_farmaceutica} />
        )}
        {presentacion.concentracion_valor != null && (
          <Row
            label="Concentración"
            value={`${presentacion.concentracion_valor} ${presentacion.concentracion_unidad ?? ''}`}
          />
        )}
        {presentacion.temperatura_conservacion && (
          <Row label="Conservación" value={tempLabel[presentacion.temperatura_conservacion] ?? presentacion.temperatura_conservacion} />
        )}
        {presentacion.ph_minimo != null && presentacion.ph_maximo != null && (
          <Row label="pH" value={`${presentacion.ph_minimo} – ${presentacion.ph_maximo}`} />
        )}
        {presentacion.proteccion_luz_almacenamiento && (
          <Row label="Luz" value="Proteger de la luz" />
        )}
      </div>

      {/* Envases / CNs */}
      {envases.length > 0 && (
        <div className="mt-3">
          <p className="text-xs text-gray-400 mb-1.5">Envases</p>
          <div className="flex flex-wrap gap-1.5">
            {envases.map((e) => (
              <span
                key={e.id}
                className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded border font-mono ${
                  e.problema_suministro
                    ? 'bg-amber-50 border-amber-200 text-amber-800'
                    : 'bg-gray-50 border-gray-200 text-gray-600'
                }`}
              >
                CN {e.codigo_nacional}
                {e.volumen_ml != null && <span className="text-gray-400">· {e.volumen_ml} mL</span>}
                {e.problema_suministro && <span title="Problema de suministro">⚠</span>}
              </span>
            ))}
          </div>
        </div>
      )}

      {presentacion.ficha_tecnica_url && (
        <a
          href={presentacion.ficha_tecnica_url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-flex items-center gap-1 text-xs text-blue-600 hover:underline"
        >
          Ficha técnica AEMPS
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
      )}
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <>
      <span className="text-gray-400">{label}</span>
      <span className="text-gray-700">{value}</span>
    </>
  )
}
