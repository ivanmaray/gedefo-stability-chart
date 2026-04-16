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

  const condReconst = condiciones?.filter((c) => c.tipo === 'reconstitucion') ?? []
  const condDilucion = condiciones?.filter((c) => c.tipo === 'dilucion') ?? []

  return (
    <div className="space-y-10">

      {/* ── CABECERA ── */}
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
          <p className="text-xs text-gray-400 mt-1">También: {pa.sinonimos.join(', ')}</p>
        )}
      </div>

      {/* ── 1. EL VIAL ── */}
      <Block step="1" title="El vial">
        <Section title={`Presentaciones (${presentaciones?.length ?? 0})`}>
          {presentaciones && presentaciones.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {presentaciones.map((p) => (
                <PresentationCard key={p.id} presentacion={p} envases={(p as any).envase ?? []} />
              ))}
            </div>
          ) : (
            <p className="text-xs text-gray-400">Sin presentaciones registradas.</p>
          )}
        </Section>

        {/* Compatibilidad de materiales (del vial/equipo) */}
        {compatibilidades && compatibilidades.length > 0 && (
          <Section title="Compatibilidad de materiales y equipos">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {compatibilidades.map((c) => (
                <CompatChip key={c.id} resultado={c.resultado} label={c.material} detalle={c.condiciones} />
              ))}
            </div>
          </Section>
        )}

        {/* Manipulación segura */}
        {matrizRiesgo && (
          <Section title="Manipulación segura">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 text-sm">
              {matrizRiesgo.tipo_cabina && <InfoRow label="Cabina" value={matrizRiesgo.tipo_cabina} />}
              {matrizRiesgo.epi_requerido && matrizRiesgo.epi_requerido.length > 0 && (
                <InfoRow label="EPI" value={matrizRiesgo.epi_requerido.join(', ')} />
              )}
              {matrizRiesgo.requisitos_sala && <InfoRow label="Sala" value={matrizRiesgo.requisitos_sala} />}
              {matrizRiesgo.gestion_residuos && <InfoRow label="Residuos" value={matrizRiesgo.gestion_residuos} />}
            </div>
          </Section>
        )}
      </Block>

      {/* ── 2. RECONSTITUCIÓN (solo si procede) ── */}
      {condReconst.length > 0 && (
        <Block step="2" title="Reconstitución">
          {condReconst.map((c) => (
            <div key={c.id} className="bg-white rounded-lg border border-gray-200 p-4 text-sm space-y-3">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-medium text-gray-800">{c.diluyente}</span>
                {c.concentracion_final_minima != null && c.concentracion_final_maxima != null && (
                  <span className="text-xs text-gray-500">
                    → {c.concentracion_final_minima}–{c.concentracion_final_maxima} mg/mL
                  </span>
                )}
              </div>
              <div className="grid grid-cols-2 gap-x-8 gap-y-1.5 text-xs">
                {c.envase_compatible && c.envase_compatible.length > 0 && (
                  <InfoRow label="Envases" value={c.envase_compatible.join(', ')} />
                )}
                {c.proteccion_luz && <InfoRow label="Luz" value="Proteger de la luz" />}
              </div>

              {/* Estabilidad del reconstituido */}
              {(() => {
                const estReconst = estabilidades?.filter(
                  (e) => e.presentacion_comercial_id != null && e.concentracion_mg_ml != null &&
                    c.concentracion_final_maxima != null &&
                    e.concentracion_mg_ml >= (c.concentracion_final_minima ?? 0) &&
                    e.concentracion_mg_ml <= (c.concentracion_final_maxima ?? Infinity)
                ) ?? []
                return estReconst.length > 0 ? (
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wide mb-1.5">Estabilidad tras reconstitución</p>
                    <StabilityTable estabilidades={estReconst} />
                  </div>
                ) : null
              })()}

              {c.notas && <p className="text-xs text-gray-500">{c.notas}</p>}
            </div>
          ))}
        </Block>
      )}

      {/* ── 3. DILUCIÓN ── */}
      <Block step={condReconst.length > 0 ? '3' : '2'} title="Dilución">

        {/* Diluyentes compatibles */}
        {compatDiluentes && compatDiluentes.length > 0 && (
          <Section title="Diluyentes">
            <div className="space-y-1.5">
              {compatDiluentes.map((c) => (
                <div
                  key={c.id}
                  className={`rounded-lg border px-3 py-2 text-xs flex items-start gap-2.5 ${
                    c.resultado === 'compatible'   ? 'bg-green-50 border-green-200' :
                    c.resultado === 'incompatible' ? 'bg-red-50 border-red-200' :
                    'bg-yellow-50 border-yellow-200'
                  }`}
                >
                  <span className="shrink-0 mt-0.5">
                    {c.resultado === 'compatible' ? '✓' : c.resultado === 'incompatible' ? '✗' : '~'}
                  </span>
                  <div>
                    <span className="font-medium text-gray-800">{c.diluente}</span>
                    {c.condiciones && <span className="text-gray-500 ml-2">{c.condiciones}</span>}
                    {c.mecanismo && <p className="text-gray-400 italic mt-0.5">{c.mecanismo}</p>}
                  </div>
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* Condiciones de dilución */}
        {condDilucion.length > 0 && (
          <Section title="Condiciones">
            {condDilucion.map((c) => (
              <div key={c.id} className="bg-white rounded-lg border border-gray-200 p-4 text-sm space-y-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-medium text-gray-800">{c.diluyente}</span>
                  {c.concentracion_final_minima != null && c.concentracion_final_maxima != null && (
                    <span className="text-xs text-gray-500">
                      {c.concentracion_final_minima}–{c.concentracion_final_maxima} mg/mL
                    </span>
                  )}
                  {c.volumen_bolsa_recomendado_ml && (
                    <span className="text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">
                      {c.volumen_bolsa_recomendado_ml} mL
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-x-8 gap-y-1 text-xs">
                  {c.envase_compatible && c.envase_compatible.length > 0 && (
                    <InfoRow label="Envases" value={c.envase_compatible.join(', ')} />
                  )}
                  {c.filtro_requerido && <InfoRow label="Filtro" value={c.filtro_requerido} />}
                  {c.proteccion_luz && <InfoRow label="Luz" value="Proteger de la luz" />}
                </div>
                {c.notas && <p className="text-xs text-gray-500">{c.notas}</p>}
              </div>
            ))}
          </Section>
        )}

        {/* Estabilidad de la solución diluida */}
        <Section title="Estabilidad">
          <StabilityTable estabilidades={estabilidades ?? []} />
        </Section>
      </Block>

      {/* ── 4. ADMINISTRACIÓN ── */}
      {administraciones && administraciones.length > 0 && (
        <Block step={condReconst.length > 0 ? '4' : '3'} title="Administración">
          {administraciones.map((a) => (
            <div key={a.id} className="bg-white rounded-lg border border-gray-200 p-4 text-sm space-y-3">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-semibold uppercase bg-blue-50 text-blue-700 px-2 py-0.5 rounded">
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
              <div className="grid grid-cols-2 gap-x-8 gap-y-1.5 text-xs">
                {a.tiempo_minimo_infusion_min != null && (
                  <InfoRow label="Infusión mínima" value={`${a.tiempo_minimo_infusion_min} min`} />
                )}
                {a.velocidad_maxima_ml_h != null && (
                  <InfoRow label="Velocidad máx." value={`${a.velocidad_maxima_ml_h} mL/h`} />
                )}
                {a.concentracion_minima_mg_ml != null && a.concentracion_maxima_mg_ml != null && (
                  <InfoRow label="Concentración" value={`${a.concentracion_minima_mg_ml}–${a.concentracion_maxima_mg_ml} mg/mL`} />
                )}
              </div>
              {a.notas && <p className="text-xs text-gray-600">{a.notas}</p>}
              {a.procedimiento_extravasacion && (
                <details className="mt-1">
                  <summary className="text-xs font-medium text-red-600 cursor-pointer hover:text-red-800 select-none">
                    Protocolo extravasación ▸
                  </summary>
                  <div className="mt-2 text-xs text-gray-600 pl-3 border-l-2 border-red-200 space-y-1 whitespace-pre-line">
                    {a.procedimiento_extravasacion}
                  </div>
                </details>
              )}
            </div>
          ))}
        </Block>
      )}

      {/* ── CONSIDERACIONES ESPECIALES ── */}
      {(pa.consideraciones_pediatricas || pa.consideraciones_neonatales) && (
        <Block step="" title="Consideraciones especiales">
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
        </Block>
      )}

    </div>
  )
}

/** Bloque numerado con línea lateral */
function Block({ step, title, children }: { step: string; title: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-4">
      {step ? (
        <div className="flex flex-col items-center shrink-0">
          <div className="w-8 h-8 rounded-full bg-blue-600 text-white text-sm font-bold flex items-center justify-center shrink-0">
            {step}
          </div>
          <div className="w-px flex-1 bg-gray-200 mt-1" />
        </div>
      ) : (
        <div className="w-8 shrink-0" />
      )}
      <div className="flex-1 pb-4 space-y-5">
        <h2 className="text-lg font-semibold text-gray-900 mt-1">{title}</h2>
        {children}
      </div>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">{title}</h3>
      {children}
    </div>
  )
}

function CompatChip({ resultado, label, detalle }: { resultado: string; label: string; detalle?: string | null }) {
  return (
    <div className={`rounded-lg border px-3 py-2 text-xs flex items-start gap-2 ${
      resultado === 'compatible'   ? 'bg-green-50 border-green-200' :
      resultado === 'incompatible' ? 'bg-red-50 border-red-200' :
      'bg-yellow-50 border-yellow-200'
    }`}>
      <span className="mt-0.5 shrink-0">
        {resultado === 'compatible' ? '✓' : resultado === 'incompatible' ? '✗' : '~'}
      </span>
      <div>
        <p className="font-medium text-gray-800">{label}</p>
        {detalle && <p className="text-gray-500 mt-0.5">{detalle}</p>}
      </div>
    </div>
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
