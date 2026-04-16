import { supabase } from '@/lib/supabase'
import Tooltip from '@/components/Tooltip'

export const revalidate = 0

const nioshBadge: Record<string, string> = {
  tabla_1: 'bg-red-100 text-red-700',
  tabla_2: 'bg-orange-100 text-orange-700',
}

const tisularBadge: Record<string, { bg: string; label: string }> = {
  vesicante:             { bg: 'bg-red-100 text-red-700',    label: 'Vesicante' },
  irritante_alto_riesgo: { bg: 'bg-orange-100 text-orange-700', label: 'Irritante A' },
  irritante_bajo_riesgo: { bg: 'bg-yellow-100 text-yellow-700', label: 'Irritante B' },
  no_irritante:          { bg: 'bg-green-100 text-green-700',   label: 'No irritante' },
}

export default async function HomePage() {
  const { data: drugs, error } = await supabase
    .from('principio_activo')
    .select(`
      *,
      presentacion_comercial ( *, envase(*) ),
      condicion_preparacion (*),
      administracion (*),
      compatibilidad_diluente (*),
      compatibilidad_material (*),
      matriz_riesgo (*)
    `)
    .order('dci')

  if (error) {
    return (
      <div className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg p-4">
        Error: {error.message}
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Stability Chart</h1>
        <p className="text-sm text-gray-500 mt-1">{drugs?.length ?? 0} principios activos</p>
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
        <table className="w-full text-xs border-collapse">
          <thead>
            <tr className="bg-gray-50 text-gray-500 uppercase tracking-wide text-[10px] border-b border-gray-200">
              <th className="text-left px-4 py-3 font-semibold sticky left-0 bg-gray-50 z-10 min-w-[140px]">Fármaco</th>
              <th className="text-left px-4 py-3 font-semibold min-w-[200px]">Presentaciones</th>
              <th className="text-left px-4 py-3 font-semibold min-w-[120px]">Reconstitución</th>
              <th className="text-left px-4 py-3 font-semibold min-w-[200px]">Diluyentes</th>
              <th className="text-left px-4 py-3 font-semibold min-w-[140px]">Envase</th>
              <th className="text-center px-4 py-3 font-semibold min-w-[60px]">Luz</th>
              <th className="text-left px-4 py-3 font-semibold min-w-[160px]">Administración</th>
              <th className="text-left px-4 py-3 font-semibold min-w-[120px]">Cabina / EPI</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {(drugs ?? []).map((drug) => {
              const presentaciones = (drug as any).presentacion_comercial ?? []
              const condiciones    = (drug as any).condicion_preparacion ?? []
              const admins         = (drug as any).administracion ?? []
              const diluentes      = (drug as any).compatibilidad_diluente ?? []
              const materiales     = (drug as any).compatibilidad_material ?? []
              const matriz         = (drug as any).matriz_riesgo?.[0] ?? null

              const condReconst  = condiciones.filter((c: any) => c.tipo === 'reconstitucion')
              const condDilucion = condiciones.filter((c: any) => c.tipo === 'dilucion')

              // Envases compatibles de la dilución (o reconstitución si no hay dilución)
              const envases = condDilucion[0]?.envase_compatible
                ?? condReconst[0]?.envase_compatible
                ?? []

              // Protección de luz (dilución o reconstitución)
              const proteccionLuz = condDilucion[0]?.proteccion_luz
                ?? condReconst[0]?.proteccion_luz
                ?? false

              return (
                <tr key={drug.id} className="hover:bg-blue-50/30 transition-colors align-top">

                  {/* FÁRMACO */}
                  <td className="px-4 py-3 sticky left-0 bg-white hover:bg-blue-50/30 z-10 border-r border-gray-100">
                    <p className="font-semibold text-gray-900 capitalize">{drug.dci}</p>
                    {drug.clasificacion_niosh && (
                      <span className={`mt-0.5 inline-block text-[10px] font-medium px-1.5 py-0.5 rounded ${nioshBadge[drug.clasificacion_niosh]}`}>
                        NIOSH {drug.clasificacion_niosh.replace('_', ' ')}
                      </span>
                    )}
                  </td>

                  {/* PRESENTACIONES */}
                  <td className="px-4 py-3">
                    <div className="flex flex-col gap-1">
                      {presentaciones.map((p: any) => {
                        const envs = p.envase ?? []
                        const hasPsum = envs.some((e: any) => e.problema_suministro)
                        return (
                          <Tooltip
                            key={p.id}
                            content={
                              <div className="space-y-2">
                                <p className="font-semibold text-gray-900">{p.nombre_comercial}</p>
                                <p className="text-gray-500">{p.laboratorio_titular}</p>
                                {p.forma_farmaceutica && <p>{p.forma_farmaceutica}</p>}
                                {p.concentracion_valor && (
                                  <p>{p.concentracion_valor} {p.concentracion_unidad}</p>
                                )}
                                {envs.length > 0 && (
                                  <div>
                                    <p className="text-gray-400 mb-1">Envases:</p>
                                    <div className="flex flex-wrap gap-1">
                                      {envs.map((e: any) => (
                                        <span key={e.id} className={`font-mono px-1.5 py-0.5 rounded text-[10px] border ${e.problema_suministro ? 'bg-amber-50 border-amber-200 text-amber-800' : 'bg-gray-50 border-gray-200 text-gray-600'}`}>
                                          CN {e.codigo_nacional}{e.volumen_ml ? ` · ${e.volumen_ml}mL` : ''}{e.problema_suministro ? ' ⚠' : ''}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                )}
                                {p.ficha_tecnica_url && (
                                  <a href={p.ficha_tecnica_url} target="_blank" rel="noopener noreferrer"
                                    className="text-blue-600 hover:underline block mt-1">
                                    Ficha técnica AEMPS ↗
                                  </a>
                                )}
                              </div>
                            }
                          >
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[11px] cursor-pointer hover:shadow-sm transition-shadow ${hasPsum ? 'bg-amber-50 border-amber-200 text-amber-800' : 'bg-white border-gray-200 text-gray-700'}`}>
                              {p.laboratorio_titular?.split(' ')[0]}
                              {hasPsum && <span className="text-amber-500">⚠</span>}
                            </span>
                          </Tooltip>
                        )
                      })}
                    </div>
                  </td>

                  {/* RECONSTITUCIÓN */}
                  <td className="px-4 py-3">
                    {condReconst.length > 0 ? (
                      <Tooltip
                        content={
                          <div className="space-y-2">
                            {condReconst.map((c: any) => (
                              <div key={c.id}>
                                <p className="font-medium">{c.diluyente}</p>
                                {c.concentracion_final_minima != null && (
                                  <p className="text-gray-500">{c.concentracion_final_minima}–{c.concentracion_final_maxima} mg/mL</p>
                                )}
                                {c.notas && <p className="text-gray-400 mt-1">{c.notas}</p>}
                              </div>
                            ))}
                          </div>
                        }
                      >
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 cursor-pointer">
                          {condReconst[0].diluyente.split(' ')[0]}
                          <span className="text-blue-400">▸</span>
                        </span>
                      </Tooltip>
                    ) : (
                      <span className="text-gray-300">—</span>
                    )}
                  </td>

                  {/* DILUYENTES */}
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {diluentes.map((d: any) => (
                        <Tooltip
                          key={d.id}
                          content={
                            <div className="space-y-1">
                              <p className="font-medium">{d.diluente}</p>
                              <p className={d.resultado === 'compatible' ? 'text-green-700' : d.resultado === 'incompatible' ? 'text-red-700' : 'text-yellow-700'}>
                                {d.resultado}
                              </p>
                              {d.condiciones && <p className="text-gray-600">{d.condiciones}</p>}
                              {d.mecanismo && <p className="text-gray-400 italic">{d.mecanismo}</p>}
                            </div>
                          }
                        >
                          <span className={`px-1.5 py-0.5 rounded border text-[11px] cursor-pointer font-mono ${
                            d.resultado === 'compatible'   ? 'bg-green-50 border-green-200 text-green-700' :
                            d.resultado === 'incompatible' ? 'bg-red-50 border-red-200 text-red-700' :
                            'bg-yellow-50 border-yellow-200 text-yellow-700'
                          }`}>
                            {d.resultado === 'compatible' ? '✓' : d.resultado === 'incompatible' ? '✗' : '~'} {d.diluente.split(' ')[0]}
                          </span>
                        </Tooltip>
                      ))}
                    </div>
                  </td>

                  {/* ENVASE */}
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {envases.map((e: string) => (
                        <span key={e} className="px-1.5 py-0.5 rounded bg-gray-100 text-gray-600 border border-gray-200">
                          {e}
                        </span>
                      ))}
                      {/* Materiales incompatibles */}
                      {materiales.filter((m: any) => m.resultado === 'incompatible').map((m: any) => (
                        <Tooltip
                          key={m.id}
                          content={<p>{m.condiciones ?? `${m.material}: incompatible`}</p>}
                        >
                          <span className="px-1.5 py-0.5 rounded bg-red-50 text-red-600 border border-red-200 cursor-pointer line-through">
                            {m.material}
                          </span>
                        </Tooltip>
                      ))}
                    </div>
                  </td>

                  {/* LUZ */}
                  <td className="px-4 py-3 text-center">
                    {proteccionLuz ? (
                      <span className="text-amber-500 text-base" title="Proteger de la luz">☀</span>
                    ) : (
                      <span className="text-gray-300">—</span>
                    )}
                  </td>

                  {/* ADMINISTRACIÓN */}
                  <td className="px-4 py-3">
                    <div className="flex flex-col gap-1">
                      {admins.map((a: any) => (
                        <Tooltip
                          key={a.id}
                          content={
                            <div className="space-y-2">
                              {a.tiempo_minimo_infusion_min != null && (
                                <p>Infusión mínima: <strong>{a.tiempo_minimo_infusion_min} min</strong></p>
                              )}
                              {a.velocidad_maxima_ml_h != null && (
                                <p>Velocidad máx.: <strong>{a.velocidad_maxima_ml_h} mL/h</strong></p>
                              )}
                              {a.concentracion_minima_mg_ml != null && (
                                <p>Conc.: <strong>{a.concentracion_minima_mg_ml}–{a.concentracion_maxima_mg_ml} mg/mL</strong></p>
                              )}
                              {a.notas && <p className="text-gray-500 text-[11px]">{a.notas}</p>}
                              {a.procedimiento_extravasacion && (
                                <div className="border-t border-gray-100 pt-2 mt-2">
                                  <p className="font-medium text-red-600 mb-1">Extravasación</p>
                                  <p className="text-gray-600 whitespace-pre-line line-clamp-6">{a.procedimiento_extravasacion}</p>
                                </div>
                              )}
                            </div>
                          }
                        >
                          <span className="inline-flex items-center gap-1 cursor-pointer">
                            <span className="font-mono text-gray-600 uppercase">{a.via}</span>
                            {a.clasificacion_tisular && (
                              <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${tisularBadge[a.clasificacion_tisular]?.bg}`}>
                                {tisularBadge[a.clasificacion_tisular]?.label}
                              </span>
                            )}
                            {a.tiempo_minimo_infusion_min && (
                              <span className="text-gray-400">{a.tiempo_minimo_infusion_min}min</span>
                            )}
                          </span>
                        </Tooltip>
                      ))}
                    </div>
                  </td>

                  {/* CABINA / EPI */}
                  <td className="px-4 py-3">
                    {matriz ? (
                      <Tooltip
                        content={
                          <div className="space-y-2">
                            {matriz.tipo_cabina && <p><strong>Cabina:</strong> {matriz.tipo_cabina}</p>}
                            {matriz.epi_requerido?.length > 0 && (
                              <div>
                                <p className="font-medium mb-1">EPI:</p>
                                <ul className="list-disc list-inside space-y-0.5 text-gray-600">
                                  {matriz.epi_requerido.map((e: string) => (
                                    <li key={e}>{e.replace(/_/g, ' ')}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            {matriz.gestion_residuos && (
                              <p className="text-gray-500 text-[11px]">{matriz.gestion_residuos}</p>
                            )}
                          </div>
                        }
                      >
                        <span className="text-gray-600 cursor-pointer hover:text-gray-900">
                          {matriz.tipo_cabina?.split(' ')[0] ?? '—'}
                          <span className="text-gray-400 ml-1">▸</span>
                        </span>
                      </Tooltip>
                    ) : (
                      <span className="text-gray-300">—</span>
                    )}
                  </td>

                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
