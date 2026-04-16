import { supabase } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import PresentationCard from '@/components/PresentationCard'
import StabilityTable from '@/components/StabilityTable'

export const revalidate = 0

interface PageProps {
  params: { id: string }
}

const nioshBadge: Record<string, string> = {
  tabla_1: 'bg-red-100 text-red-700 border-red-200',
  tabla_2: 'bg-orange-100 text-orange-700 border-orange-200',
}

export default async function FarmacoPage({ params }: PageProps) {
  const { id } = params

  const [
    { data: pa, error: paError },
    { data: presentaciones },
    { data: estabilidades },
    { data: condiciones },
    { data: administraciones },
    { data: compatibilidades },
    { data: compatDiluentes },
    { data: matrizRiesgo },
  ] = await Promise.all([
    supabase.from('principio_activo').select('*').eq('id', id).single(),
    supabase.from('presentacion_comercial').select('*, envase(*)').eq('principio_activo_id', id).order('nombre_comercial'),
    supabase.from('estabilidad').select('*').eq('principio_activo_id', id).order('temperatura_celsius'),
    supabase.from('condicion_preparacion').select('*').eq('principio_activo_id', id),
    supabase.from('administracion').select('*').eq('principio_activo_id', id),
    supabase.from('compatibilidad_material').select('*').eq('principio_activo_id', id).order('resultado'),
    supabase.from('compatibilidad_diluente').select('*').eq('principio_activo_id', id).order('resultado'),
    supabase.from('matriz_riesgo').select('*').eq('principio_activo_id', id).maybeSingle(),
  ])

  if (paError || !pa) notFound()

  return (
    <div className="space-y-8">
      {/* Cabecera */}
      <div>
        <a href="/" className="text-sm text-blue-600 hover:underline mb-3 inline-block">
          ← Principios activos
        </a>
        <div className="flex items-start gap-3 flex-wrap">
          <h1 className="text-3xl font-bold text-gray-900 capitalize">{pa.dci}</h1>
          {pa.clasificacion_niosh && (
            <span className={`mt-1 text-xs font-medium px-2 py-0.5 rounded-full border ${nioshBadge[pa.clasificacion_niosh]}`}>
              NIOSH 2024 {pa.clasificacion_niosh.replace('_', ' ')}
            </span>
          )}
        </div>
        <div className="flex gap-4 mt-1 text-sm text-gray-500 flex-wrap">
          {pa.atc_code && <span className="font-mono">{pa.atc_code}</span>}
          {pa.familia_farmacologica && <span>{pa.familia_farmacologica}</span>}
        </div>
        {pa.sinonimos && pa.sinonimos.length > 0 && (
          <p className="text-xs text-gray-400 mt-1">
            También: {pa.sinonimos.join(', ')}
          </p>
        )}
      </div>

      {/* Matriz de riesgo */}
      {matrizRiesgo && (
        <Section title="Manipulación segura">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            {matrizRiesgo.tipo_cabina && <InfoRow label="Cabina" value={matrizRiesgo.tipo_cabina} />}
            {matrizRiesgo.epi_requerido && matrizRiesgo.epi_requerido.length > 0 && (
              <InfoRow label="EPI" value={matrizRiesgo.epi_requerido.join(', ')} />
            )}
            {matrizRiesgo.gestion_residuos && <InfoRow label="Residuos" value={matrizRiesgo.gestion_residuos} />}
          </div>
        </Section>
      )}

      {/* Presentaciones */}
      <Section title={`Presentaciones comerciales (${presentaciones?.length ?? 0})`}>
        {presentaciones && presentaciones.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {presentaciones.map((p) => (
              <PresentationCard
                key={p.id}
                presentacion={p}
                envases={(p as any).envase ?? []}
              />
            ))}
          </div>
        ) : (
          <p className="text-xs text-gray-400">Sin presentaciones registradas.</p>
        )}
      </Section>

      {/* Condiciones de preparación */}
      {condiciones && condiciones.length > 0 && (
        <Section title="Condiciones de preparación">
          <div className="space-y-3">
            {condiciones.map((c) => (
              <div key={c.id} className="bg-white rounded-lg border border-gray-200 p-4 text-sm space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium uppercase tracking-wide bg-blue-50 text-blue-700 px-2 py-0.5 rounded">
                    {c.tipo}
                  </span>
                  <span className="font-medium text-gray-800">{c.diluyente}</span>
                </div>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                  {c.concentracion_final_minima != null && c.concentracion_final_maxima != null && (
                    <InfoRow label="Conc. final" value={`${c.concentracion_final_minima} – ${c.concentracion_final_maxima} mg/mL`} />
                  )}
                  {c.volumen_bolsa_recomendado_ml && (
                    <InfoRow label="Bolsa recomendada" value={`${c.volumen_bolsa_recomendado_ml} mL`} />
                  )}
                  {c.envase_compatible && c.envase_compatible.length > 0 && (
                    <InfoRow label="Envases compatibles" value={c.envase_compatible.join(', ')} />
                  )}
                  {c.proteccion_luz && (
                    <InfoRow label="Luz" value="Proteger de la luz" />
                  )}
                </div>
                {c.notas && <p className="text-xs text-gray-500 mt-1">{c.notas}</p>}
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Estabilidades */}
      <Section title="Estabilidad fisicoquímica">
        <StabilityTable estabilidades={estabilidades ?? []} />
      </Section>

      {/* Administración */}
      {administraciones && administraciones.length > 0 && (
        <Section title="Administración">
          {administraciones.map((a) => (
            <div key={a.id} className="bg-white rounded-lg border border-gray-200 p-4 text-sm space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium uppercase bg-green-50 text-green-700 px-2 py-0.5 rounded">
                  Vía {a.via}
                </span>
                {a.clasificacion_tisular && (
                  <span className={`text-xs font-medium px-2 py-0.5 rounded ${
                    a.clasificacion_tisular === 'vesicante'             ? 'bg-red-100 text-red-700' :
                    a.clasificacion_tisular === 'irritante_alto_riesgo' ? 'bg-orange-100 text-orange-700' :
                    a.clasificacion_tisular === 'irritante_bajo_riesgo' ? 'bg-yellow-100 text-yellow-700' :
                    a.clasificacion_tisular === 'no_irritante'          ? 'bg-green-100 text-green-700' :
                    'bg-gray-100 text-gray-600'
                  }`}>
                    {a.clasificacion_tisular.replace(/_/g, ' ')}
                  </span>
                )}
              </div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                {a.tiempo_minimo_infusion_min != null && (
                  <InfoRow label="Infusión mínima" value={`${a.tiempo_minimo_infusion_min} min`} />
                )}
                {a.velocidad_maxima_ml_h != null && (
                  <InfoRow label="Velocidad máx." value={`${a.velocidad_maxima_ml_h} mL/h`} />
                )}
                {a.concentracion_minima_mg_ml != null && a.concentracion_maxima_mg_ml != null && (
                  <InfoRow label="Conc. administración" value={`${a.concentracion_minima_mg_ml} – ${a.concentracion_maxima_mg_ml} mg/mL`} />
                )}
              </div>
              {a.notas && <p className="text-xs text-gray-600">{a.notas}</p>}
              {a.procedimiento_extravasacion && (
                <details className="mt-2">
                  <summary className="text-xs font-medium text-red-600 cursor-pointer hover:text-red-800">
                    Protocolo extravasación
                  </summary>
                  <p className="mt-1 text-xs text-gray-600 pl-3 border-l-2 border-red-200">
                    {a.procedimiento_extravasacion}
                  </p>
                </details>
              )}
            </div>
          ))}
        </Section>
      )}

      {/* Compatibilidad de materiales */}
      {compatibilidades && compatibilidades.length > 0 && (
        <Section title="Compatibilidad de materiales">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {compatibilidades.map((c) => (
              <div
                key={c.id}
                className={`rounded-lg border px-3 py-2 text-xs flex items-start gap-2 ${
                  c.resultado === 'compatible' ? 'bg-green-50 border-green-200' :
                  c.resultado === 'incompatible' ? 'bg-red-50 border-red-200' :
                  'bg-yellow-50 border-yellow-200'
                }`}
              >
                <span className="mt-0.5 shrink-0">
                  {c.resultado === 'compatible' ? '✓' : c.resultado === 'incompatible' ? '✗' : '~'}
                </span>
                <div>
                  <p className="font-medium text-gray-800">{c.material}</p>
                  {c.condiciones && <p className="text-gray-500 mt-0.5">{c.condiciones}</p>}
                </div>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Compatibilidad con diluyentes */}
      {compatDiluentes && compatDiluentes.length > 0 && (
        <Section title="Compatibilidad con diluyentes">
          <div className="space-y-2">
            {compatDiluentes.map((c) => (
              <div
                key={c.id}
                className={`rounded-lg border px-3 py-2.5 text-xs flex items-start gap-2.5 ${
                  c.resultado === 'compatible'   ? 'bg-green-50 border-green-200' :
                  c.resultado === 'incompatible' ? 'bg-red-50 border-red-200' :
                  'bg-yellow-50 border-yellow-200'
                }`}
              >
                <span className="mt-0.5 shrink-0 text-sm">
                  {c.resultado === 'compatible' ? '✓' : c.resultado === 'incompatible' ? '✗' : '~'}
                </span>
                <div className="space-y-0.5">
                  <p className="font-medium text-gray-800">{c.diluente}</p>
                  {c.condiciones && <p className="text-gray-600">{c.condiciones}</p>}
                  {c.mecanismo && <p className="text-gray-400 italic">{c.mecanismo}</p>}
                </div>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Pediatría / neonatos */}
      {(pa.consideraciones_pediatricas || pa.consideraciones_neonatales) && (
        <Section title="Consideraciones especiales">
          <div className="space-y-3 text-sm text-gray-700">
            {pa.consideraciones_pediatricas && (
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Pediatría</p>
                <p>{pa.consideraciones_pediatricas}</p>
              </div>
            )}
            {pa.consideraciones_neonatales && (
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Neonatología</p>
                <p>{pa.consideraciones_neonatales}</p>
              </div>
            )}
          </div>
        </Section>
      )}
    </div>
  )
}

function Section({
  title,
  children,
  color = 'gray',
}: {
  title: string
  children: React.ReactNode
  color?: 'gray' | 'red'
}) {
  return (
    <section>
      <h2 className={`text-sm font-semibold uppercase tracking-wide mb-3 ${color === 'red' ? 'text-red-600' : 'text-gray-500'}`}>
        {title}
      </h2>
      {children}
    </section>
  )
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <>
      <span className="text-gray-400">{label}</span>
      <span className="text-gray-700">{value}</span>
    </>
  )
}
