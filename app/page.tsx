import { supabase } from '@/lib/supabase'
import Tooltip from '@/components/Tooltip'
import NioshBadge from '@/components/NioshBadge'

export const revalidate = 0

// ── Símbolos de envase (estilo Stabilis) ──────────────────────
const envaseSimbolo: Record<string, { label: string; cls: string }> = {
  poliolefina:  { label: 'PO',      cls: 'bg-sky-50 border-sky-200 text-sky-700' },
  pvc:          { label: 'PVC',     cls: 'bg-slate-50 border-slate-200 text-slate-600' },
  pvc_dehp:     { label: 'PVC',     cls: 'bg-red-50 border-red-200 text-red-600' },
  vidrio:       { label: 'Vi',      cls: 'bg-cyan-50 border-cyan-200 text-cyan-700' },
  eva:          { label: 'EVA',     cls: 'bg-teal-50 border-teal-200 text-teal-700' },
  aluminio:     { label: 'Al',      cls: 'bg-red-50 border-red-200 text-red-600' },
  filtro_pes:   { label: 'PES',     cls: 'bg-violet-50 border-violet-200 text-violet-600' },
  filtro_nylon: { label: 'NY',      cls: 'bg-violet-50 border-violet-200 text-violet-600' },
  jeringa_pp:   { label: 'Jer-PP',  cls: 'bg-orange-50 border-orange-200 text-orange-600' },
  jeringa_pc:   { label: 'Jer-PC',  cls: 'bg-orange-50 border-orange-200 text-orange-700' },
  polietileno:  { label: 'PE',      cls: 'bg-sky-50 border-sky-200 text-sky-600' },
  polipropileno:{ label: 'PP',      cls: 'bg-indigo-50 border-indigo-200 text-indigo-600' },
}

// ── Símbolos de diluyente (estilo Stabilis) ───────────────────
const diluyenteSimbolo: Record<string, { label: string; cls: string }> = {
  'SF 0,9%':                    { label: 'SF',     cls: 'bg-blue-50 border-blue-200 text-blue-700' },
  'SG 5%':                      { label: 'G5',     cls: 'bg-yellow-50 border-yellow-300 text-yellow-700' },
  'SF 0,45%':                   { label: 'SF½',    cls: 'bg-blue-50 border-blue-100 text-blue-500' },
  'Agua para preparaciones inyectables (API)': { label: 'API', cls: 'bg-cyan-50 border-cyan-200 text-cyan-700' },
  'API o SF 0,9%':              { label: 'API/SF', cls: 'bg-cyan-50 border-cyan-200 text-cyan-700' },
  'SF 0,9% + SG 5% (1:1)':     { label: 'SF+G5',  cls: 'bg-indigo-50 border-indigo-200 text-indigo-700' },
  'SG 5% + SF 0,9% (glucosalina)': { label: 'GS', cls: 'bg-lime-50 border-lime-200 text-lime-700' },
  'SF 0,9% + KCl':              { label: 'SF+K',   cls: 'bg-blue-50 border-blue-200 text-blue-600' },
  'SG 5% + KCl':                { label: 'G5+K',   cls: 'bg-yellow-50 border-yellow-200 text-yellow-600' },
  'Ringer':                     { label: 'RL',     cls: 'bg-green-50 border-green-200 text-green-700' },
  'Soluciones alcalinas (pH > 7)': { label: 'AlK', cls: 'bg-red-50 border-red-200 text-red-600' },
  'Heparina':                   { label: 'Hep',    cls: 'bg-red-50 border-red-200 text-red-600' },
  'Lactato de Ringer':          { label: 'LR',     cls: 'bg-red-50 border-red-200 text-red-600' },
  'SF 0,9% + manitol 1,875%':           { label: 'SF+M',   cls: 'bg-blue-50 border-blue-200 text-blue-700' },
  'SF 0,45% + SG 2,5% + manitol 1,875%': { label: 'SF½+G+M', cls: 'bg-indigo-50 border-indigo-200 text-indigo-700' },
}

function fmtTiempo(horas: number): string {
  if (horas >= 24 && horas % 24 === 0) return `${horas / 24}d`
  if (horas >= 24) return `${Math.round(horas / 24 * 10) / 10}d`
  return `${horas}h`
}

function getDiluyenteSimbolo(nombre: string) {
  if (diluyenteSimbolo[nombre]) return diluyenteSimbolo[nombre]
  // Fallback: primeras 4 letras en gris
  return { label: nombre.slice(0, 4), cls: 'bg-gray-50 border-gray-200 text-gray-600' }
}

function getEnvaseSimbolo(nombre: string) {
  const key = nombre.toLowerCase().replace(/[^a-z_]/g, '')
  return envaseSimbolo[key] ?? { label: nombre.slice(0, 3).toUpperCase(), cls: 'bg-gray-50 border-gray-200 text-gray-600' }
}

const epiLabel: Record<string, { icon: string; label: string }> = {
  guantes_qt_dobles:                   { icon: '🧤', label: 'Guantes QT dobles' },
  guantes_qt:                          { icon: '🧤', label: 'Guantes QT' },
  bata_impermeable_uso_unico:          { icon: '🥼', label: 'Bata impermeable desechable' },
  bata:                                { icon: '🥼', label: 'Bata' },
  cubrecabeza:                         { icon: '🪖', label: 'Cubrecabeza' },
  cubrezapatos:                        { icon: '👟', label: 'Cubrezapatos' },
  gafas_proteccion:                    { icon: '🥽', label: 'Gafas de protección' },
  mascarilla_ffp2_n95_si_fuera_cabina: { icon: '😷', label: 'Mascarilla FFP2/N95 (si fuera de cabina)' },
  mascarilla_ffp2:                     { icon: '😷', label: 'Mascarilla FFP2' },
  mascarilla_quirurgica:               { icon: '😷', label: 'Mascarilla quirúrgica' },
}

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

/** Pie de referencia para incluir al final del contenido de un tooltip */
function RefFooter({ source }: { source: any }) {
  if (!source) return null
  return (
    <div className="mt-2 pt-2 border-t border-gray-100 text-[10px] text-gray-400 space-y-0.5">
      <p className="font-medium text-gray-500">{source.titulo}</p>
      {source.autores && <p>{source.autores}{source.anio ? `, ${source.anio}` : ''}</p>}
      {source.url && (
        <a href={source.url} target="_blank" rel="noopener noreferrer"
          className="text-blue-500 hover:underline block">
          Ver fuente ↗
        </a>
      )}
    </div>
  )
}

export default async function HomePage() {
  const { data: drugs, error } = await supabase
    .from('principio_activo')
    .select(`
      *,
      presentacion_comercial ( *, envase(*) ),
      condicion_preparacion ( *, referencia:referencia_id(titulo, tipo_fuente, url, anio, autores) ),
      administracion ( *, referencia:referencia_id(titulo, tipo_fuente, url, anio, autores), referencia_extravasacion:referencia_extravasacion_id(titulo, tipo_fuente, url, anio, autores) ),
      compatibilidad_diluente ( *, referencia:referencia_id(titulo, tipo_fuente, url, anio, autores) ),
      compatibilidad_material ( *, referencia:referencia_id(titulo, tipo_fuente, url, anio, autores) ),
      estabilidad ( *, referencia:referencia_id(titulo, tipo_fuente, url, anio, autores) ),
      matriz_riesgo ( *, referencia:referencia_id(titulo, tipo_fuente, url, anio, autores) )
    `)
    .order('dci')

  if (error) {
    return (
      <div className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg p-4">
        Error: {error.message}
      </div>
    )
  }

  const PRIMEROS = ['cisplatino', 'ciclofosfamida', 'doxorubicina']

  // Ordenar: primero los 3 con datos completos (en ese orden), luego el resto por DCI
  const drugsSorted = (drugs ?? []).slice().sort((a, b) => {
    const ai = PRIMEROS.indexOf(a.dci ?? '')
    const bi = PRIMEROS.indexOf(b.dci ?? '')
    if (ai !== -1 && bi !== -1) return ai - bi
    if (ai !== -1) return -1
    if (bi !== -1) return 1
    return (a.dci ?? '').localeCompare(b.dci ?? '', 'es')
  })

  // Aplanar a filas por presentación
  const rows = drugsSorted.flatMap((drug) => {
    const presentaciones: any[] = (drug as any).presentacion_comercial ?? []
    const condiciones:    any[] = (drug as any).condicion_preparacion ?? []
    const admins:         any[] = (drug as any).administracion ?? []
    const diluentes:      any[] = (drug as any).compatibilidad_diluente ?? []
    const materiales:     any[] = (drug as any).compatibilidad_material ?? []
    const estabilidades:  any[] = (drug as any).estabilidad ?? []
    const matriz:         any   = ((drug as any).matriz_riesgo ?? [])[0] ?? null

    // Condiciones de dilución (presentacion_id nulo = aplica a todas)
    const condDilucion = condiciones.filter((c: any) => c.tipo === 'dilucion')
    const luzDilucion  = condDilucion[0]?.proteccion_luz ?? false

    const matsCompatibles   = materiales.filter((m: any) => m.resultado === 'compatible')
    const matsIncompat       = materiales.filter((m: any) => m.resultado === 'incompatible')
    const matsCondicional    = materiales.filter((m: any) => m.resultado === 'condicional')

    // PA sin presentaciones → una fila vacía para que aparezca en la tabla
    if (presentaciones.length === 0) {
      return [{
        drug, pres: null, idx: 0, total: 1, isFirst: true,
        reconst: [], condDilucion: [], luzDilucion: false,
        diluentes: [], materiales: [], matsCompatibles: [], matsIncompat: [],
        matsCondicional: [], estabFT: [], estabStabilis: [], admins: [], matriz,
      }]
    }

    return presentaciones.map((pres: any, idx: number) => {
      // Estabilidad: FT (vinculada a esta presentación) + Stabilis (PA, null)
      const estabFT = estabilidades.filter(
        (e: any) => e.presentacion_comercial_id === pres.id
      )
      const estabStabilis = estabilidades.filter(
        (e: any) => e.presentacion_comercial_id === null
      )

      // Reconstitución: específica de esta presentación, o genérica del PA
      // si la presentación es polvo (las genéricas no aplican a concentrados líquidos)
      const esPolvo = /polvo/i.test(pres?.forma_farmaceutica ?? '')
      const reconst = condiciones.filter(
        (c: any) => c.tipo === 'reconstitucion' &&
          (c.presentacion_comercial_id === pres.id ||
           (c.presentacion_comercial_id === null && esPolvo))
      )
      return {
        drug,
        pres,
        idx,
        total: presentaciones.length,
        isFirst: idx === 0,
        reconst,
        condDilucion,
        luzDilucion,
        diluentes,
        materiales,
        matsCompatibles,
        matsIncompat,
        matsCondicional,
        estabFT,
        estabStabilis,
        admins,
        matriz,
      }
    })
  })

  return (
    <div>
      <div className="mb-5">
        <h1 className="text-2xl font-bold text-gray-900">Stability Chart</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          {drugs?.length ?? 0} principios activos
          <span className="mx-1.5 text-gray-300">·</span>
          {(drugs ?? []).reduce((acc, d) => acc + ((d as any).presentacion_comercial?.length ?? 0), 0)} presentaciones comercializadas
        </p>
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
              <th className="text-left px-3 py-2.5 font-semibold w-20 bg-blue-50/50">Densidad</th>

              {/* Grupo: dilución */}
              <th className="text-left px-3 py-2.5 font-semibold w-48 bg-green-50/50 border-l border-gray-100">Diluyentes</th>
              <th className="text-left px-3 py-2.5 font-semibold w-32 bg-green-50/50">Envase</th>

              {/* Grupo: estabilidad */}
              <th className="text-left px-3 py-2.5 font-semibold w-36 border-l border-gray-100">Estab. FT</th>
              <th className="text-left px-3 py-2.5 font-semibold w-40">Estab. Stabilis</th>
              {/* Grupo: administración */}
              <th className="text-left px-3 py-2.5 font-semibold w-44 border-l border-gray-100">Administración</th>
            </tr>
            {/* Subheader de grupos */}
            <tr className="text-[9px] text-gray-400 border-b border-gray-200 bg-gray-50">
              <td className="px-3 py-1 sticky left-0 bg-gray-50 border-r border-gray-200" />
              <td className="px-3 py-1 border-r border-gray-100" />
              <td className="px-3 py-1 bg-blue-50/50 text-blue-400 font-semibold" colSpan={2}>VIAL RECONSTITUIDO</td>
              <td className="px-3 py-1 bg-green-50/50 text-green-500 font-semibold border-l border-gray-100" colSpan={2}>DILUCIÓN</td>
              <td className="px-3 py-1 border-l border-gray-100 text-blue-400 font-semibold text-[9px]">por presentación</td>
              <td className="px-3 py-1 text-purple-400 font-semibold text-[9px]">por PA</td>
              <td className="px-3 py-1 border-l border-gray-100" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {rows.map(({ drug, pres, idx, total, isFirst, reconst, condDilucion, luzDilucion, diluentes, materiales, matsCompatibles, matsIncompat, matsCondicional, estabFT, estabStabilis, admins, matriz }) => {
              const envases: any[] = pres?.envase ?? []
              const hasPsum = envases.some((e: any) => e.problema_suministro)
              const hasConservantes = pres?.con_conservantes ?? false

              return (
                <tr
                  key={pres?.id ?? drug.id}
                  className={`align-top ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/40'} hover:bg-blue-50/20 transition-colors`}
                >
                  {/* ── FÁRMACO (rowspan) ── */}
                  {isFirst && (
                    <td
                      rowSpan={total}
                      className="px-3 py-3 sticky left-0 bg-white z-10 border-r border-gray-200 align-middle"
                    >
                      <p className="font-bold text-gray-900 capitalize text-sm">{drug.dci}</p>
                      {drug.clasificacion_niosh && matriz ? (
                        <NioshBadge
                          clasificacion={drug.clasificacion_niosh}
                          matriz={matriz}
                          epiLabel={epiLabel}
                        />
                      ) : drug.clasificacion_niosh ? (
                        <span className={`mt-1 inline-block text-[10px] font-medium px-1.5 py-0.5 rounded ${nioshBadge[drug.clasificacion_niosh]}`}>
                          NIOSH {drug.clasificacion_niosh.replace('_', ' ')}
                        </span>
                      ) : null}
                      {drug.atc_code && (
                        <p className="text-[10px] text-gray-400 font-mono mt-0.5">{drug.atc_code}</p>
                      )}
                    </td>
                  )}

                  {/* ── PRESENTACIÓN ── */}
                  <td className="px-3 py-3 border-r border-gray-100">
                    {!pres ? <span className="text-gray-300 text-[11px]">Sin datos</span> : <Tooltip
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
                          {pres.estabilidad_vial_abierto && (
                            <p className="text-blue-700">Vial abierto: {pres.estabilidad_vial_abierto}</p>
                          )}
                          {pres.con_conservantes && (
                            <p className="text-amber-700 font-medium">
                              Contiene conservantes
                              {pres.conservantes_detalle && <span className="font-normal text-amber-600"> — {pres.conservantes_detalle}</span>}
                            </p>
                          )}
                          <div>
                            <p className="text-gray-400 mb-1 font-medium">Excipientes:</p>
                            {pres.excipientes?.length > 0 ? (
                              <ul className="space-y-0.5 text-gray-600">
                                {pres.excipientes.map((exc: any, i: number) => (
                                  <li key={i}>
                                    {exc.nombre}
                                    {exc.cantidad && exc.unidad !== '-' ? ` ${exc.cantidad} ${exc.unidad}` : ''}
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              <p className="text-gray-400 italic">Ninguno</p>
                            )}
                          </div>
                          {envases.length > 0 && (
                            <div>
                              <p className="text-gray-400 mb-1 font-medium">Envases:</p>
                              <div className="flex flex-wrap gap-1">
                                {envases.map((e: any) => (
                                  <div key={e.id} className="space-y-0.5">
                                    <span className={`font-mono px-1.5 py-0.5 rounded text-[10px] border ${e.problema_suministro ? 'bg-amber-50 border-amber-300 text-amber-800' : 'bg-gray-50 border-gray-200 text-gray-600'}`}>
                                      CN {e.codigo_nacional}{e.volumen_ml ? ` · ${e.volumen_ml} mL` : ''}{e.problema_suministro ? ' ⚠' : ''}
                                    </span>
                                    {e.problema_suministro && (e.psum_observaciones || e.psum_fecha_inicio) && (
                                      <p className="text-[10px] text-amber-700 pl-0.5">
                                        {e.psum_fecha_inicio && <span className="font-medium">{new Date(e.psum_fecha_inicio).toLocaleDateString('es-ES')} — </span>}
                                        {e.psum_fecha_fin && <span>hasta {new Date(e.psum_fecha_fin).toLocaleDateString('es-ES')} — </span>}
                                        {e.psum_observaciones}
                                      </p>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                          {(pres.nregistro_cima || pres.ficha_tecnica_url) && (
                            <div className="pt-1 border-t border-gray-100 flex flex-col gap-0.5">
                              {pres.nregistro_cima && (
                                <a href={`https://cima.aemps.es/cima/publico/detalle.html?nregistro=${pres.nregistro_cima}`}
                                  target="_blank" rel="noopener noreferrer"
                                  className="text-blue-600 hover:underline">
                                  Ver en CIMA ↗
                                </a>
                              )}
                              {pres.ficha_tecnica_url && (
                                <a href={pres.ficha_tecnica_url} target="_blank" rel="noopener noreferrer"
                                  className="text-blue-600 hover:underline">
                                  Ficha técnica (PDF) ↗
                                </a>
                              )}
                            </div>
                          )}
                        </div>
                      }
                    >
                      <div className="cursor-pointer">
                        <span className={`font-medium ${hasPsum ? 'text-amber-700' : 'text-gray-800'}`}>
                          {pres.nombre_comercial?.replace(/\s+(concentrado|polvo|soluci[oó]n|inyectable|EFG)\b.*/i, '').trim()}
                          {hasPsum && <span className="ml-1 text-amber-500">⚠</span>}
                          {pres.temperatura_conservacion === 'nevera' && (
                            <span className="ml-1 text-blue-400" title="Conservar en nevera (2-8°C)">❄</span>
                          )}
                          {hasConservantes && (
                            <span className="ml-1 text-amber-500" title="Contiene conservantes">C</span>
                          )}
                        </span>
                        {pres.laboratorio_titular && (
                          <p className="text-[10px] text-gray-400 mt-0.5">{pres.laboratorio_titular.split(' ').slice(0, 2).join(' ')}</p>
                        )}
                        <div className="flex flex-wrap gap-0.5 mt-0.5">
                          {envases.slice(0, 3).map((e: any) => (
                            <span key={e.id} className={`text-[10px] font-mono ${e.problema_suministro ? 'text-amber-600' : 'text-gray-400'}`}>
                              {e.volumen_ml ? `${e.volumen_ml}mL` : pres.concentracion_valor ? `${pres.concentracion_valor}${pres.concentracion_unidad}` : 'vial'}
                            </span>
                          ))}
                          {envases.length > 3 && <span className="text-[10px] text-gray-400">+{envases.length - 3}</span>}
                        </div>
                      </div>
                    </Tooltip>}
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
                                {c.volumen_ml_minimo != null && (
                                  <p className="text-gray-500">
                                    Añadir: {c.volumen_ml_minimo === c.volumen_ml_maximo
                                      ? `${c.volumen_ml_minimo} mL`
                                      : `${c.volumen_ml_minimo}–${c.volumen_ml_maximo} mL`}
                                  </p>
                                )}
                                {c.volumen_final_reconstituido_ml != null && (
                                  <p className="text-gray-500">Vol. final: {c.volumen_final_reconstituido_ml} mL</p>
                                )}
                                {c.concentracion_final_minima != null && (
                                  <p className="text-gray-500">
                                    Concentración: {c.concentracion_final_minima === c.concentracion_final_maxima
                                      ? `${c.concentracion_final_minima} mg/mL`
                                      : `${c.concentracion_final_minima}–${c.concentracion_final_maxima} mg/mL`}
                                  </p>
                                )}
                                {c.estabilidad_reconstituido && (
                                  <div className="mt-1 pt-1 border-t border-gray-100">
                                    <p className="text-gray-400 text-[10px] font-medium mb-0.5">Estabilidad reconstituido</p>
                                    <p className="text-gray-600">{c.estabilidad_reconstituido}</p>
                                  </div>
                                )}
                                {c.envase_compatible?.length > 0 && (
                                  <p className="text-gray-500">Envase: {c.envase_compatible.join(', ')}</p>
                                )}
                                {c.notas && <p className="text-gray-400 mt-1 italic">{c.notas}</p>}
                                <RefFooter source={c.referencia} />
                              </div>
                            ))}
                          </div>
                        }
                      >
                        <div className="cursor-pointer space-y-0.5">
                          <p className="text-blue-700 font-medium">{reconst[0].diluyente}</p>
                          {reconst[0].volumen_ml_minimo != null && (
                            <p className="text-gray-500">
                              {reconst[0].volumen_ml_minimo === reconst[0].volumen_ml_maximo
                                ? `${reconst[0].volumen_ml_minimo} mL`
                                : `${reconst[0].volumen_ml_minimo}–${reconst[0].volumen_ml_maximo} mL`}
                              {reconst[0].concentracion_final_minima != null && (
                                <span className="ml-1 text-gray-400">
                                  → {reconst[0].concentracion_final_minima === reconst[0].concentracion_final_maxima
                                    ? `${reconst[0].concentracion_final_minima} mg/mL`
                                    : `${reconst[0].concentracion_final_minima}–${reconst[0].concentracion_final_maxima} mg/mL`}
                                </span>
                              )}
                            </p>
                          )}
                        </div>
                      </Tooltip>
                    ) : (
                      <span className="text-gray-300 text-[11px]">No procede</span>
                    )}
                  </td>

                  {/* ── DENSIDAD ── */}
                  <td className="px-3 py-3 bg-blue-50/20">
                    {pres?.densidad != null
                      ? <span className="text-gray-600">{pres.densidad} g/mL</span>
                      : <span className="text-gray-300">—</span>
                    }
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
                                <RefFooter source={d.referencia} />
                              </div>
                            }
                          >
                            {(() => {
                              const sym = getDiluyenteSimbolo(d.diluente)
                              const incomp = d.resultado === 'incompatible'
                              const cond   = d.resultado === 'condicional'
                              return (
                                <span className={`px-1.5 py-0.5 rounded border text-[11px] cursor-pointer font-mono font-semibold ${incomp ? 'bg-red-50 border-red-200 text-red-600 line-through' : cond ? 'bg-yellow-50 border-yellow-200 text-yellow-700' : sym.cls}`}>
                                  {incomp ? '✗ ' : cond ? '~ ' : ''}{sym.label}
                                </span>
                              )
                            })()}
                          </Tooltip>
                        ))}
                      </div>
                    </td>
                  )}

                  {/* ── ENVASE DILUCIÓN (rowspan) ── */}
                  {isFirst && (
                    <td rowSpan={total} className="px-3 py-3 bg-green-50/20 align-top">
                      {materiales.length === 0
                        ? <span className="text-gray-300 text-[11px]">—</span>
                        : <div className="space-y-1">
                            {/* Compatibles */}
                            <div className="flex flex-wrap gap-1">
                              {matsCompatibles.map((m: any) => (
                                <Tooltip key={m.id} content={
                                  <div className="space-y-1">
                                    <p className="font-medium capitalize">{m.material.replace(/_/g, ' ')}</p>
                                    <p className="text-green-700 font-medium">Compatible</p>
                                    {m.condiciones && <p className="text-gray-500">{m.condiciones}</p>}
                                    <RefFooter source={m.referencia} />
                                  </div>
                                }>
                                  {(() => { const s = getEnvaseSimbolo(m.material); return (
                                    <span className={`px-1.5 py-0.5 rounded border text-[11px] cursor-pointer font-mono font-semibold ${s.cls}`}>{s.label}</span>
                                  )})()}
                                </Tooltip>
                              ))}
                            </div>
                            {/* Condicionales */}
                            {matsCondicional.map((m: any) => (
                              <Tooltip key={m.id} content={
                                <div className="space-y-1">
                                  <p className="font-medium capitalize">{m.material.replace(/_/g, ' ')}</p>
                                  <p className="text-yellow-700 font-medium">Condicional</p>
                                  {m.condiciones && <p className="text-gray-500">{m.condiciones}</p>}
                                  <RefFooter source={m.referencia} />
                                </div>
                              }>
                                {(() => { const s = getEnvaseSimbolo(m.material); return (
                                  <span className={`px-1.5 py-0.5 rounded border text-[11px] cursor-pointer font-mono font-semibold bg-yellow-50 border-yellow-200 text-yellow-700`}>~{s.label}</span>
                                )})()}
                              </Tooltip>
                            ))}
                            {/* Incompatibles */}
                            {matsIncompat.map((m: any) => (
                              <Tooltip key={m.id} content={
                                <div className="space-y-1">
                                  <p className="font-medium capitalize">{m.material.replace(/_/g, ' ')}</p>
                                  <p className="text-red-700 font-medium">Incompatible</p>
                                  {m.condiciones && <p className="text-gray-500">{m.condiciones}</p>}
                                  <RefFooter source={m.referencia} />
                                </div>
                              }>
                                {(() => { const s = getEnvaseSimbolo(m.material); return (
                                  <span className={`px-1.5 py-0.5 rounded border text-[11px] cursor-pointer font-mono font-semibold bg-red-50 border-red-200 text-red-600 line-through`}>{s.label}</span>
                                )})()}
                              </Tooltip>
                            ))}
                          </div>
                      }
                    </td>
                  )}


                  {/* ── ESTABILIDAD FT (por presentación) ── */}
                  <td className="px-3 py-3 border-l border-gray-100 align-top">
                    {estabFT.length === 0
                      ? <span className="text-gray-300 text-[11px]">—</span>
                      : <div className="space-y-0.5">
                          {estabFT.map((e: any) => {
                            const sym    = e.diluyente ? getDiluyenteSimbolo(e.diluyente) : null
                            const envSym = e.envase    ? getEnvaseSimbolo(e.envase)       : null
                            return (
                              <Tooltip key={e.id} wide content={
                                <div className="space-y-1.5">
                                  <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-medium bg-blue-50 text-blue-600">Ficha técnica</span>
                                  {e.diluyente && <p className="text-gray-600">{e.diluyente}</p>}
                                  {e.concentracion_mg_ml != null && <p className="text-gray-500">{e.concentracion_mg_ml} mg/mL</p>}
                                  {e.envase && <p className="text-gray-500">{e.envase}</p>}
                                  <p className="text-gray-600">{e.temperatura_celsius}°C · {e.proteccion_luz ? '☀ proteger luz' : 'sin restricción luz'}</p>
                                  {e.notas_cualitativas && <p className="text-gray-400 italic text-[11px]">{e.notas_cualitativas}</p>}
                                  <RefFooter source={e.referencia} />
                                </div>
                              }>
                                <div className="cursor-pointer flex items-center gap-1 whitespace-nowrap">
                                  {sym && <span className={`px-1 py-0 rounded border text-[10px] font-mono font-semibold ${sym.cls}`}>{sym.label}</span>}
                                  {envSym && <span className={`px-1 py-0 rounded border text-[10px] font-mono font-semibold ${envSym.cls}`}>{envSym.label}</span>}
                                  {e.concentracion_mg_ml != null && <span className="text-[10px] text-gray-500 font-mono">{e.concentracion_mg_ml}mg/mL</span>}
                                  <span className="text-[11px] text-gray-700 font-medium">
                                    {fmtTiempo(e.tiempo_horas)}
                                    <span className="text-gray-400 font-normal"> {e.temperatura_celsius}°C</span>
                                    {e.proteccion_luz && <span className="ml-0.5 text-amber-500">☀</span>}
                                  </span>
                                </div>
                              </Tooltip>
                            )
                          })}
                        </div>
                    }
                  </td>

                  {/* ── ESTABILIDAD STABILIS (por PA, rowspan) ── */}
                  {isFirst && (
                    <td rowSpan={total} className="px-3 py-3 align-top">
                      {estabStabilis.length === 0
                        ? <span className="text-gray-300 text-[11px]">—</span>
                        : <div className="space-y-0.5">
                            {estabStabilis.map((e: any) => {
                              const sym = e.diluyente ? getDiluyenteSimbolo(e.diluyente) : null
                              const envSym = e.envase ? getEnvaseSimbolo(e.envase) : null
                              return (
                                <Tooltip key={e.id} wide content={
                                  <div className="space-y-1.5">
                                    <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-medium bg-purple-50 text-purple-600">Stabilis</span>
                                    {e.diluyente && <p className="text-gray-600">{e.diluyente}</p>}
                                    {e.concentracion_mg_ml != null && <p className="text-gray-500">{e.concentracion_mg_ml} mg/mL</p>}
                                    {e.envase && <p className="text-gray-500">{e.envase}</p>}
                                    <p className="text-gray-600">{e.temperatura_celsius}°C · {e.proteccion_luz ? '☀ proteger luz' : 'sin restricción luz'}</p>
                                    {e.notas_cualitativas && <p className="text-gray-400 italic text-[11px]">{e.notas_cualitativas}</p>}
                                    <RefFooter source={e.referencia} />
                                  </div>
                                }>
                                  <div className="cursor-pointer flex items-center gap-1 whitespace-nowrap">
                                    {sym && <span className={`px-1 py-0 rounded border text-[10px] font-mono font-semibold ${sym.cls}`}>{sym.label}</span>}
                                    {envSym && <span className={`px-1 py-0 rounded border text-[10px] font-mono font-semibold ${envSym.cls}`}>{envSym.label}</span>}
                                    {e.concentracion_mg_ml != null && <span className="text-[10px] text-gray-500 font-mono">{e.concentracion_mg_ml}mg/mL</span>}
                                    <span className="text-[11px] text-gray-700 font-medium">
                                      {fmtTiempo(e.tiempo_horas)}
                                      <span className="text-gray-400 font-normal"> {e.temperatura_celsius}°C</span>
                                      {e.proteccion_luz && <span className="ml-0.5 text-amber-500">☀</span>}
                                    </span>
                                  </div>
                                </Tooltip>
                              )
                            })}
                          </div>
                      }
                    </td>
                  )}

                  {/* ── ADMINISTRACIÓN + EXTRAVASACIÓN (rowspan) ── */}
                  {isFirst && (
                    <td rowSpan={total} className="px-3 py-3 border-l border-gray-100 align-top">
                      <div className="space-y-3">
                        {admins.map((a: any) => (
                          <div key={a.id} className="space-y-1">
                            {/* Vía + tiempo */}
                            <Tooltip wide content={
                              <div className="space-y-2">
                                <p className="font-semibold uppercase">Vía {a.via}</p>
                                {a.tiempo_minimo_infusion_min != null && <p>Infusión mínima: <strong>{a.tiempo_minimo_infusion_min} min</strong></p>}
                                {a.velocidad_maxima_ml_h != null && <p>Velocidad máx.: <strong>{a.velocidad_maxima_ml_h} mL/h</strong></p>}
                                {a.concentracion_minima_mg_ml != null && <p>Conc.: <strong>{a.concentracion_minima_mg_ml}–{a.concentracion_maxima_mg_ml} mg/mL</strong></p>}
                                {a.notas && <p className="text-gray-500 text-[11px]">{a.notas}</p>}
                                <RefFooter source={a.referencia} />
                              </div>
                            }>
                              <div className="cursor-pointer">
                                <span className="font-mono text-gray-700 uppercase text-[11px]">Vía {a.via}</span>
                                {a.tiempo_minimo_infusion_min != null && (
                                  <span className="text-gray-400 text-[10px] ml-1">· mín. {a.tiempo_minimo_infusion_min} min</span>
                                )}
                              </div>
                            </Tooltip>
                            {/* Extravasación */}
                            {a.clasificacion_tisular && (
                              <Tooltip wide content={
                                <div className="space-y-2">
                                  <span className={`inline-block px-2 py-0.5 rounded font-medium text-[11px] ${tisularBadge[a.clasificacion_tisular]?.bg}`}>
                                    {tisularBadge[a.clasificacion_tisular]?.label}
                                  </span>
                                  {a.procedimiento_extravasacion
                                    ? <p className="text-gray-600 whitespace-pre-line text-[11px]">{a.procedimiento_extravasacion}</p>
                                    : <p className="text-gray-400 italic">Sin protocolo específico.</p>
                                  }
                                  <RefFooter source={a.referencia_extravasacion} />
                                </div>
                              }>
                                <div className="cursor-pointer flex items-center gap-1">
                                  <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${tisularBadge[a.clasificacion_tisular]?.bg}`}>
                                    {tisularBadge[a.clasificacion_tisular]?.label}
                                  </span>
                                  {a.procedimiento_extravasacion && (
                                    <span className="text-[10px] text-gray-400">▸</span>
                                  )}
                                </div>
                              </Tooltip>
                            )}
                          </div>
                        ))}
                      </div>
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
