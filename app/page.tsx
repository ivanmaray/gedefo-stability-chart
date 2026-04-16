import { supabase } from '@/lib/supabase'
import Tooltip from '@/components/Tooltip'

export const revalidate = 0

const nioshBadge: Record<string, string> = {
  tabla_1: 'bg-red-100 text-red-700',
  tabla_2: 'bg-orange-100 text-orange-700',
}

const tisularBadge: Record<string, { bg: string; label: string }> = {
  vesicante:             { bg: 'bg-red-100 text-red-700',       label: 'Vesicante' },
  irritante_alto_riesgo: { bg: 'bg-orange-100 text-orange-700', label: 'Irritante AR' },
  irritante_bajo_riesgo: { bg: 'bg-yellow-100 text-yellow-700', label: 'Irritante BR' },
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

  // Aplanar a filas por presentación
  const rows = (drugs ?? []).flatMap((drug) => {
    const presentaciones: any[] = (drug as any).presentacion_comercial ?? []
    const condiciones:    any[] = (drug as any).condicion_preparacion ?? []
    const admins:         any[] = (drug as any).administracion ?? []
    const diluentes:      any[] = (drug as any).compatibilidad_diluente ?? []
    const materiales:     any[] = (drug as any).compatibilidad_material ?? []
    const matriz:         any   = ((drug as any).matriz_riesgo ?? [])[0] ?? null

    // Condiciones de dilución (presentacion_id nulo = aplica a todas)
    const condDilucion = condiciones.filter((c: any) => c.tipo === 'dilucion')
    const envaseDilucion = condDilucion[0]?.envase_compatible ?? []
    const luzDilucion    = condDilucion[0]?.proteccion_luz ?? false

    return presentaciones.map((pres: any, idx: number) => {
      // Reconstitución específica de esta presentación (o genérica del PA)
      const reconst = condiciones.filter(
        (c: any) => c.tipo === 'reconstitucion' &&
          (c.presentacion_comercial_id === pres.id || c.presentacion_comercial_id === null)
      )
      return {
        drug,
        pres,
        idx,
        total: presentaciones.length,
        isFirst: idx === 0,
        reconst,
        condDilucion,
        envaseDilucion,
        luzDilucion,
        diluentes,
        materiales,
        admins,
        matriz,
      }
    })
  })

  return (
    <div>
      <div className="mb-5">
        <h1 className="text-2xl font-bold text-gray-900">Stability Chart</h1>
        <p className="text-sm text-gray-500 mt-0.5">{drugs?.length ?? 0} principios activos</p>
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
        <table className="text-xs border-collapse" style={{ minWidth: '1200px', width: '100%' }}>
          <thead>
            <tr className="bg-gray-50 text-gray-500 uppercase tracking-wide text-[10px] border-b border-gray-200">
              {/* Grupo: identificación */}
              <th className="text-left px-3 py-2.5 font-semibold sticky left-0 bg-gray-50 z-10 border-r border-gray-200 w-32">Fármaco</th>
              <th className="text-left px-3 py-2.5 font-semibold w-44 border-r border-gray-100">Presentación</th>

              {/* Grupo: vial reconstituido */}
              <th className="text-left px-3 py-2.5 font-semibold w-32 bg-blue-50/50">Reconst.</th>
              <th className="text-left px-3 py-2.5 font-semibold w-20 bg-blue-50/50">pH / Densidad</th>

              {/* Grupo: dilución */}
              <th className="text-left px-3 py-2.5 font-semibold w-48 bg-green-50/50 border-l border-gray-100">Diluyentes</th>
              <th className="text-left px-3 py-2.5 font-semibold w-32 bg-green-50/50">Envase</th>
              <th className="text-center px-3 py-2.5 font-semibold w-12 bg-green-50/50">Luz</th>

              {/* Grupo: administración */}
              <th className="text-left px-3 py-2.5 font-semibold w-44 border-l border-gray-100">Administración</th>
              <th className="text-left px-3 py-2.5 font-semibold w-28">Cabina / EPI</th>
            </tr>
            {/* Subheader de grupos */}
            <tr className="text-[9px] text-gray-400 border-b border-gray-200 bg-gray-50">
              <td className="px-3 py-1 sticky left-0 bg-gray-50 border-r border-gray-200" />
              <td className="px-3 py-1 border-r border-gray-100" />
              <td className="px-3 py-1 bg-blue-50/50 text-blue-400 font-semibold" colSpan={2}>VIAL RECONSTITUIDO</td>
              <td className="px-3 py-1 bg-green-50/50 text-green-500 font-semibold border-l border-gray-100" colSpan={3}>DILUCIÓN</td>
              <td className="px-3 py-1 border-l border-gray-100" colSpan={2} />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {rows.map(({ drug, pres, idx, total, isFirst, reconst, condDilucion, envaseDilucion, luzDilucion, diluentes, materiales, admins, matriz }) => {
              const envases: any[] = pres.envase ?? []
              const hasPsum = envases.some((e: any) => e.problema_suministro)
              const incompatMat = materiales.filter((m: any) => m.resultado === 'incompatible')

              return (
                <tr
                  key={pres.id}
                  className={`align-top ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/40'} hover:bg-blue-50/20 transition-colors`}
                >
                  {/* ── FÁRMACO (rowspan) ── */}
                  {isFirst && (
                    <td
                      rowSpan={total}
                      className="px-3 py-3 sticky left-0 bg-white z-10 border-r border-gray-200 align-middle"
                    >
                      <p className="font-bold text-gray-900 capitalize text-sm">{drug.dci}</p>
                      {drug.clasificacion_niosh && (
                        <span className={`mt-1 inline-block text-[10px] font-medium px-1.5 py-0.5 rounded ${nioshBadge[drug.clasificacion_niosh]}`}>
                          NIOSH {drug.clasificacion_niosh.replace('_', ' ')}
                        </span>
                      )}
                      {drug.atc_code && (
                        <p className="text-[10px] text-gray-400 font-mono mt-0.5">{drug.atc_code}</p>
                      )}
                    </td>
                  )}

                  {/* ── PRESENTACIÓN ── */}
                  <td className="px-3 py-3 border-r border-gray-100">
                    <Tooltip
                      content={
                        <div className="space-y-2">
                          <p className="font-semibold">{pres.nombre_comercial}</p>
                          {pres.forma_farmaceutica && <p className="text-gray-500">{pres.forma_farmaceutica}</p>}
                          {pres.concentracion_valor != null && (
                            <p>{pres.concentracion_valor} {pres.concentracion_unidad}</p>
                          )}
                          {pres.temperatura_conservacion && (
                            <p>Conservación: {pres.temperatura_conservacion}</p>
                          )}
                          {envases.length > 0 && (
                            <div>
                              <p className="text-gray-400 mb-1 font-medium">Envases:</p>
                              <div className="flex flex-wrap gap-1">
                                {envases.map((e: any) => (
                                  <span key={e.id} className={`font-mono px-1.5 py-0.5 rounded text-[10px] border ${e.problema_suministro ? 'bg-amber-50 border-amber-300 text-amber-800' : 'bg-gray-50 border-gray-200 text-gray-600'}`}>
                                    CN {e.codigo_nacional}{e.volumen_ml ? ` · ${e.volumen_ml} mL` : ''}{e.problema_suministro ? ' ⚠' : ''}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                          {pres.ficha_tecnica_url && (
                            <a href={pres.ficha_tecnica_url} target="_blank" rel="noopener noreferrer"
                              className="text-blue-600 hover:underline block pt-1 border-t border-gray-100">
                              Ficha técnica AEMPS ↗
                            </a>
                          )}
                        </div>
                      }
                    >
                      <div className="cursor-pointer">
                        <span className={`font-medium ${hasPsum ? 'text-amber-700' : 'text-gray-800'}`}>
                          {pres.laboratorio_titular?.split(' ').slice(0, 2).join(' ')}
                          {hasPsum && <span className="ml-1 text-amber-500">⚠</span>}
                        </span>
                        <div className="flex flex-wrap gap-0.5 mt-0.5">
                          {envases.slice(0, 3).map((e: any) => (
                            <span key={e.id} className={`text-[10px] font-mono ${e.problema_suministro ? 'text-amber-600' : 'text-gray-400'}`}>
                              {e.volumen_ml ? `${e.volumen_ml}mL` : pres.concentracion_valor ? `${pres.concentracion_valor}${pres.concentracion_unidad}` : 'vial'}
                            </span>
                          ))}
                          {envases.length > 3 && <span className="text-[10px] text-gray-400">+{envases.length - 3}</span>}
                        </div>
                      </div>
                    </Tooltip>
                  </td>

                  {/* ── RECONSTITUCIÓN ── */}
                  <td className="px-3 py-3 bg-blue-50/20">
                    {reconst.length > 0 ? (
                      <Tooltip
                        content={
                          <div className="space-y-2">
                            {reconst.map((c: any) => (
                              <div key={c.id}>
                                <p className="font-medium">{c.diluyente}</p>
                                {c.concentracion_final_minima != null && (
                                  <p className="text-gray-500">{c.concentracion_final_minima}–{c.concentracion_final_maxima} mg/mL</p>
                                )}
                                {c.envase_compatible?.length > 0 && (
                                  <p className="text-gray-500">Envase: {c.envase_compatible.join(', ')}</p>
                                )}
                                {c.notas && <p className="text-gray-400 mt-1 italic">{c.notas}</p>}
                              </div>
                            ))}
                          </div>
                        }
                      >
                        <div className="cursor-pointer space-y-0.5">
                          <p className="text-blue-700 font-medium">{reconst[0].diluyente}</p>
                          {reconst[0].concentracion_final_minima != null && (
                            <p className="text-gray-500">{reconst[0].concentracion_final_minima}–{reconst[0].concentracion_final_maxima} mg/mL</p>
                          )}
                        </div>
                      </Tooltip>
                    ) : (
                      <span className="text-gray-300 text-[11px]">No procede</span>
                    )}
                  </td>

                  {/* ── pH / DENSIDAD ── */}
                  <td className="px-3 py-3 bg-blue-50/20">
                    <div className="space-y-0.5 text-gray-600">
                      {pres.ph_minimo != null && pres.ph_maximo != null && (
                        <p>pH {pres.ph_minimo}–{pres.ph_maximo}</p>
                      )}
                      {pres.densidad != null && (
                        <p>{pres.densidad} g/mL</p>
                      )}
                      {pres.ph_minimo == null && pres.densidad == null && (
                        <span className="text-gray-300">—</span>
                      )}
                    </div>
                  </td>

                  {/* ── DILUYENTES (rowspan) ── */}
                  {isFirst && (
                    <td rowSpan={total} className="px-3 py-3 bg-green-50/20 border-l border-gray-100 align-top">
                      <div className="flex flex-wrap gap-1">
                        {diluentes.map((d: any) => (
                          <Tooltip
                            key={d.id}
                            content={
                              <div className="space-y-1.5">
                                <p className="font-semibold">{d.diluente}</p>
                                <p className={`font-medium ${d.resultado === 'compatible' ? 'text-green-700' : d.resultado === 'incompatible' ? 'text-red-700' : 'text-yellow-700'}`}>
                                  {d.resultado}
                                </p>
                                {d.condiciones && <p className="text-gray-600">{d.condiciones}</p>}
                                {d.mecanismo && <p className="text-gray-400 italic">{d.mecanismo}</p>}
                              </div>
                            }
                          >
                            <span className={`px-1.5 py-0.5 rounded border text-[11px] cursor-pointer font-mono ${
                              d.resultado === 'compatible'   ? 'bg-green-50 border-green-200 text-green-700' :
                              d.resultado === 'incompatible' ? 'bg-red-50 border-red-200 text-red-600' :
                              'bg-yellow-50 border-yellow-200 text-yellow-700'
                            }`}>
                              {d.resultado === 'compatible' ? '✓' : d.resultado === 'incompatible' ? '✗' : '~'} {d.diluente.replace('para preparaciones inyectables', '').replace('para perfusión', '').trim()}
                            </span>
                          </Tooltip>
                        ))}
                      </div>
                      {/* Materiales incompatibles */}
                      {incompatMat.length > 0 && (
                        <div className="mt-1.5 flex flex-wrap gap-1">
                          {incompatMat.map((m: any) => (
                            <Tooltip key={m.id} content={<p>{m.condiciones ?? m.material}</p>}>
                              <span className="px-1.5 py-0.5 rounded bg-red-50 border border-red-200 text-red-600 text-[11px] cursor-pointer line-through">
                                {m.material}
                              </span>
                            </Tooltip>
                          ))}
                        </div>
                      )}
                    </td>
                  )}

                  {/* ── ENVASE DILUCIÓN (rowspan) ── */}
                  {isFirst && (
                    <td rowSpan={total} className="px-3 py-3 bg-green-50/20 align-top">
                      <div className="flex flex-wrap gap-1">
                        {envaseDilucion.map((e: string) => (
                          <span key={e} className="px-1.5 py-0.5 rounded bg-white border border-gray-200 text-gray-600">
                            {e}
                          </span>
                        ))}
                        {envaseDilucion.length === 0 && <span className="text-gray-300">—</span>}
                      </div>
                    </td>
                  )}

                  {/* ── LUZ DILUCIÓN (rowspan) ── */}
                  {isFirst && (
                    <td rowSpan={total} className="px-3 py-3 bg-green-50/20 text-center align-middle">
                      {luzDilucion
                        ? <span className="text-amber-500 text-base" title="Proteger de la luz">☀</span>
                        : <span className="text-gray-300 text-sm">—</span>
                      }
                    </td>
                  )}

                  {/* ── ADMINISTRACIÓN (rowspan) ── */}
                  {isFirst && (
                    <td rowSpan={total} className="px-3 py-3 border-l border-gray-100 align-top">
                      <div className="space-y-2">
                        {admins.map((a: any) => (
                          <Tooltip
                            key={a.id}
                            wide
                            content={
                              <div className="space-y-2">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="font-semibold uppercase">{a.via}</span>
                                  {a.clasificacion_tisular && (
                                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${tisularBadge[a.clasificacion_tisular]?.bg}`}>
                                      {tisularBadge[a.clasificacion_tisular]?.label}
                                    </span>
                                  )}
                                </div>
                                {a.tiempo_minimo_infusion_min != null && <p>Infusión mínima: <strong>{a.tiempo_minimo_infusion_min} min</strong></p>}
                                {a.velocidad_maxima_ml_h != null && <p>Velocidad máx.: <strong>{a.velocidad_maxima_ml_h} mL/h</strong></p>}
                                {a.concentracion_minima_mg_ml != null && <p>Concentración: <strong>{a.concentracion_minima_mg_ml}–{a.concentracion_maxima_mg_ml} mg/mL</strong></p>}
                                {a.notas && <p className="text-gray-500 text-[11px]">{a.notas}</p>}
                                {a.procedimiento_extravasacion && (
                                  <div className="border-t border-gray-100 pt-2">
                                    <p className="font-semibold text-red-600 mb-1">Protocolo extravasación</p>
                                    <p className="text-gray-600 whitespace-pre-line">{a.procedimiento_extravasacion}</p>
                                  </div>
                                )}
                              </div>
                            }
                          >
                            <div className="cursor-pointer flex items-center gap-1.5 flex-wrap">
                              <span className="font-mono text-gray-700 uppercase text-[11px]">{a.via}</span>
                              {a.clasificacion_tisular && (
                                <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${tisularBadge[a.clasificacion_tisular]?.bg}`}>
                                  {tisularBadge[a.clasificacion_tisular]?.label}
                                </span>
                              )}
                              {a.tiempo_minimo_infusion_min != null && (
                                <span className="text-gray-400 text-[10px]">{a.tiempo_minimo_infusion_min}′</span>
                              )}
                            </div>
                          </Tooltip>
                        ))}
                      </div>
                    </td>
                  )}

                  {/* ── CABINA / EPI (rowspan) ── */}
                  {isFirst && (
                    <td rowSpan={total} className="px-3 py-3 align-top">
                      {matriz ? (
                        <Tooltip
                          content={
                            <div className="space-y-2">
                              {matriz.tipo_cabina && <p><strong>Cabina:</strong> {matriz.tipo_cabina}</p>}
                              {matriz.epi_requerido?.length > 0 && (
                                <div>
                                  <p className="font-semibold mb-1">EPI:</p>
                                  <ul className="list-disc list-inside space-y-0.5 text-gray-600">
                                    {matriz.epi_requerido.map((e: string) => (
                                      <li key={e}>{e.replace(/_/g, ' ')}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                              {matriz.requisitos_sala && <p className="text-gray-500">{matriz.requisitos_sala}</p>}
                              {matriz.gestion_residuos && <p className="text-gray-400 text-[11px] border-t border-gray-100 pt-1 mt-1">{matriz.gestion_residuos}</p>}
                            </div>
                          }
                        >
                          <div className="cursor-pointer">
                            <p className="text-gray-700 font-medium">{matriz.tipo_cabina?.split(' ').slice(0, 2).join(' ')}</p>
                            <p className="text-[10px] text-gray-400 mt-0.5">{matriz.epi_requerido?.length ?? 0} items EPI ▸</p>
                          </div>
                        </Tooltip>
                      ) : (
                        <span className="text-gray-300">—</span>
                      )}
                    </td>
                  )}

                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
