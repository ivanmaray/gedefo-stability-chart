export const metadata = {
  title: 'Proyecto GEDEFO — Stability Chart',
}

export default function ProyectoPage() {
  return (
    <div className="max-w-4xl mx-auto">
      {/* Cabecera */}
      <div className="mb-8">
        <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Convocatoria Ayudas Grupos de Trabajo SEFH 2026-2027 · Anexo 4</p>
        <h1 className="text-2xl font-bold text-gray-900">
          Desarrollo de una base de datos colaborativa de estabilidad y preparación de medicamentos oncohematológicos para farmacia hospitalaria: GEDEFO Stability Chart
        </h1>
        <p className="text-sm text-gray-500 mt-2">Categoría: Otros proyectos — Desarrollo y consolidación de tecnologías y procesos</p>
      </div>

      {/* Contenido */}
      <div className="space-y-8 text-sm text-gray-700 leading-relaxed">

        {/* 1. JUSTIFICACIÓN */}
        <section>
          <h2 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-1 mb-3">1. Justificación</h2>
          <div className="space-y-3">
            <p>
              La preparación segura de medicamentos oncohematológicos en los Servicios de Farmacia hospitalaria requiere acceso a información técnica actualizada sobre estabilidad fisicoquímica, compatibilidad con materiales y diluyentes, condiciones de reconstitución, administración y manipulación segura. Actualmente, esta información se encuentra dispersa en múltiples fuentes (fichas técnicas de la AEMPS, Stabilis, Trissel, Micromedex, publicaciones individuales) sin una herramienta unificada adaptada al contexto español.
            </p>
            <p>
              El equivalente internacional de referencia es el <strong>BC Cancer Stability Chart</strong> (Columbia Británica, Canadá), que recoge en una tabla única los datos de estabilidad necesarios para la preparación. Sin embargo, este recurso no contempla las presentaciones comerciales autorizadas en España, no integra los datos de la AEMPS (CIMA), ni refleja la clasificación NIOSH adaptada a la normativa europea de manipulación de citostáticos.
            </p>
            <p>
              Además, la información que manejan los Servicios de Farmacia para la preparación de citostáticos suele estar en documentos internos (tablas Excel, protocolos locales) que se duplican en cada hospital sin un estándar común. Esto genera ineficiencia, riesgo de datos desactualizados y dificulta la armonización de prácticas entre centros.
            </p>
            <p>
              El grupo GEDEFO (Grupo Español para el Desarrollo de la Farmacia Oncológica) de la SEFH se encuentra en una posición única para abordar este problema: agrupa a farmacéuticos oncológicos de múltiples centros con experiencia directa en la preparación y validación de estos tratamientos.
            </p>
          </div>
        </section>

        {/* 2. OBJETIVOS */}
        <section>
          <h2 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-1 mb-3">2. Objetivos</h2>

          <h3 className="font-semibold text-gray-800 mt-4 mb-2">Objetivo principal</h3>
          <p>
            Diseñar, desarrollar y validar una base de datos estructurada, colaborativa y de acceso público que recoja la información técnica necesaria para la <strong>preparación y administración segura</strong> de medicamentos oncohematológicos en farmacia hospitalaria española.
          </p>

          <h3 className="font-semibold text-gray-800 mt-4 mb-2">Objetivos específicos</h3>
          <ol className="list-decimal list-inside space-y-2 pl-2">
            <li>Construir un esquema de datos relacional que integre: principio activo, presentaciones comerciales (vinculadas a CIMA/AEMPS), condiciones de reconstitución y dilución, estabilidad fisicoquímica (ficha técnica + Stabilis), compatibilidad con diluyentes y materiales, datos de administración, clasificación NIOSH y gestión de residuos.</li>
            <li>Sincronizar automáticamente con la API pública de CIMA (AEMPS) los datos regulatorios de cada presentación: nombre comercial, laboratorio titular, excipientes, estado de comercialización y problemas de suministro.</li>
            <li>Desarrollar una interfaz web pública tipo "Stability Chart" que presente esta información de forma compacta, visual y consultable en el punto de preparación.</li>
            <li>Establecer un flujo de gobernanza (validación por pares, trazabilidad de fuentes, versionado) que garantice la calidad y actualización de los datos.</li>
            <li>Poblar la base de datos con los principios activos del grupo ATC L01 (antineoplásicos) autorizados y comercializados en España con al menos una vía parenteral.</li>
            <li>Diseñar la capa de interoperabilidad (API REST pública + exportaciones estandarizadas) que permita la integración con bombas de infusión inteligentes, sistemas de prescripción electrónica y software de preparación de citostáticos.</li>
            <li>Evaluar la utilidad percibida y el impacto en la práctica mediante un estudio multicéntrico en los centros participantes.</li>
          </ol>
        </section>

        {/* 3. METODOLOGÍA */}
        <section>
          <h2 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-1 mb-3">3. Metodología y plan de trabajo</h2>

          <h3 className="font-semibold text-gray-800 mt-4 mb-2">3.1 Arquitectura tecnológica</h3>
          <div className="bg-gray-50 rounded-lg p-4 text-xs font-mono space-y-1 mb-3">
            <p>Base de datos: <strong>Supabase (PostgreSQL)</strong> con API REST pública</p>
            <p>Backend: <strong>Supabase Edge Functions</strong> (sincronización con CIMA)</p>
            <p>Frontend: <strong>Next.js + Tailwind CSS</strong> (webapp responsive)</p>
            <p>Despliegue: <strong>Vercel</strong> (acceso público sin coste de infraestructura)</p>
            <p>Código: <strong>Open source</strong> — sin ánimo de lucro, repercute en la SEFH</p>
          </div>

          <h3 className="font-semibold text-gray-800 mt-4 mb-2">3.2 Fuentes de datos</h3>
          <ul className="list-disc list-inside space-y-1 pl-2">
            <li><strong>CIMA (AEMPS)</strong>: API REST pública — presentaciones comerciales, excipientes, estado de comercialización, fichas técnicas (secciones 6.3, 6.4, 6.6), problemas de suministro.</li>
            <li><strong>Stabilis 4.0</strong>: datos de estabilidad fisicoquímica con referencias primarias (artículos originales).</li>
            <li><strong>Fichas técnicas (AEMPS)</strong>: condiciones de conservación, reconstitución, dilución, estabilidad post-preparación.</li>
            <li><strong>NIOSH 2024</strong>: clasificación de peligrosidad, EPI requerido, tipo de cabina.</li>
            <li><strong>Monografía SEFH/GEDEFO 2020</strong>: procedimientos de extravasación, clasificación tisular.</li>
          </ul>

          <h3 className="font-semibold text-gray-800 mt-4 mb-2">3.3 Fases del proyecto</h3>

          <div className="space-y-4">
            <div className="border-l-4 border-blue-400 pl-4">
              <p className="font-semibold text-blue-700">Fase 0 — Esqueleto (completada)</p>
              <p className="text-gray-500">Esquema de base de datos completo, seed con 3 fármacos de referencia (cisplatino, ciclofosfamida, doxorubicina), integración con API CIMA, webapp funcional con tabla tipo Stability Chart.</p>
            </div>

            <div className="border-l-4 border-green-400 pl-4">
              <p className="font-semibold text-green-700">Fase 1 — Población ATC L01 (ago–oct 2026)</p>
              <ul className="text-gray-600 list-disc list-inside space-y-0.5 text-xs mt-1">
                <li>Poblar presentaciones comerciales desde CIMA para los ~118 principios activos L01 parenterales.</li>
                <li>Parsear secciones 6.3/6.4/6.6 de fichas técnicas para conservación, reconstitución y estabilidad post-dilución.</li>
                <li>Cargar datos de estabilidad desde Stabilis con referencias primarias completas.</li>
                <li>Completar clasificación NIOSH, EPI y gestión de residuos.</li>
                <li>Distribución del trabajo de poblado entre centros participantes.</li>
              </ul>
            </div>

            <div className="border-l-4 border-yellow-400 pl-4">
              <p className="font-semibold text-yellow-700">Fase 2 — Validación y gobernanza (nov 2026–ene 2027)</p>
              <ul className="text-gray-600 list-disc list-inside space-y-0.5 text-xs mt-1">
                <li>Revisión cruzada por pares de los datos de cada fármaco entre centros.</li>
                <li>Implementación del sistema de gobernanza (estado borrador → en revisión → validado).</li>
                <li>Auditoría de trazabilidad de fuentes.</li>
                <li>Sincronización periódica automatizada con CIMA (cron semanal).</li>
              </ul>
            </div>

            <div className="border-l-4 border-purple-400 pl-4">
              <p className="font-semibold text-purple-700">Fase 3 — Evaluación multicéntrica (feb–jun 2027)</p>
              <ul className="text-gray-600 list-disc list-inside space-y-0.5 text-xs mt-1">
                <li>Despliegue en los Servicios de Farmacia de los centros participantes.</li>
                <li>Recogida de datos de uso y satisfacción (encuesta validada).</li>
                <li>Comparación con la situación basal (tiempo de consulta, errores detectados).</li>
                <li>Evaluación de la compatibilidad con sistemas de prescripción/preparación existentes.</li>
                <li>Redacción de manuscrito para Farmacia Hospitalaria.</li>
              </ul>
            </div>
          </div>
        </section>

        {/* 3.4 INTEROPERABILIDAD */}
        <section>
          <h2 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-1 mb-3">3.4 Interoperabilidad: bombas inteligentes, prescripción y preparación</h2>
          <div className="space-y-3">
            <p>
              Uno de los valores diferenciales del proyecto es que la base de datos no es solo una herramienta de consulta, sino una <strong>fuente de datos estructurada y consumible por máquinas</strong>. Esto permite su integración directa con los sistemas que intervienen en el circuito del medicamento oncológico:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3">
              <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                <p className="font-semibold text-gray-800 text-xs mb-1">Bombas de infusión inteligentes</p>
                <p className="text-xs text-gray-600">
                  Las bibliotecas de fármacos de bombas como Alaris (BD), Volumat (Fresenius) o Plum 360 (ICU Medical) requieren datos de concentración, velocidad máxima y tiempo mínimo de infusión. La API puede alimentar estas bibliotecas directamente o generar ficheros de importación en los formatos requeridos por cada fabricante.
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                <p className="font-semibold text-gray-800 text-xs mb-1">Prescripción electrónica</p>
                <p className="text-xs text-gray-600">
                  Sistemas como Farmis, Silicon, Oncofarm o módulos oncológicos de SAP/Cerner pueden consumir la API para validar automáticamente la compatibilidad diluyente-envase, verificar concentraciones y alertar de interacciones con materiales.
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                <p className="font-semibold text-gray-800 text-xs mb-1">Software de preparación</p>
                <p className="text-xs text-gray-600">
                  Herramientas de trazabilidad en sala blanca (Kiro, Pharmaself, etc.) pueden importar datos de estabilidad para calcular caducidades asignadas, volúmenes de reconstitución y condiciones de conservación de las preparaciones.
                </p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 mt-3">
              <p className="font-semibold text-gray-800 text-xs mb-2">Formatos de salida previstos</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-green-400" />
                  <span className="text-gray-600"><strong>API REST</strong> (JSON)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-400" />
                  <span className="text-gray-600"><strong>CSV/Excel</strong> export</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-purple-400" />
                  <span className="text-gray-600"><strong>FHIR</strong> (estándar HL7)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-orange-400" />
                  <span className="text-gray-600"><strong>XML/propietario</strong> por fabricante</span>
                </div>
              </div>
            </div>

            <p className="text-xs text-gray-500 mt-2">
              La API REST pública ya está operativa (Supabase REST). Los formatos de exportación específicos para bombas y sistemas de prescripción se desarrollarán en colaboración con los fabricantes interesados. En la reunión del Comité Coordinador de GEDEFO (abril 2026) se valoró que los proveedores de bombas podrían tener interés en la financiación complementaria del proyecto.
            </p>
          </div>
        </section>

        {/* 4. CENTROS PARTICIPANTES */}
        <section>
          <h2 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-1 mb-3">4. Centros participantes</h2>
          <div className="overflow-hidden rounded-lg border border-gray-200">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                <tr>
                  <th className="text-left px-4 py-2">Centro</th>
                  <th className="text-left px-4 py-2">Investigador</th>
                  <th className="text-left px-4 py-2">Rol</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <tr><td className="px-4 py-2">CHUAC (Coruña)</td><td className="px-4 py-2">Elena Fernández</td><td className="px-4 py-2">Ideación del proyecto</td></tr>
                <tr className="bg-gray-50/50"><td className="px-4 py-2">HUCA (Oviedo)</td><td className="px-4 py-2">Iván Maray</td><td className="px-4 py-2">Desarrollo tecnológico, datos</td></tr>
                <tr><td className="px-4 py-2">CAULE (León)</td><td className="px-4 py-2">Pilar González</td><td className="px-4 py-2">Poblado de datos, validación</td></tr>
                <tr className="bg-gray-50/50"><td className="px-4 py-2">Hospital de Cangas de Narcea</td><td className="px-4 py-2">Lola Macía</td><td className="px-4 py-2">Poblado de datos, validación</td></tr>
                <tr><td className="px-4 py-2">Hospital de Sant Pau (Barcelona)</td><td className="px-4 py-2">Alicia Domínguez</td><td className="px-4 py-2">Colaboradora (residente GEDEFO)</td></tr>
              </tbody>
            </table>
          </div>
          <p className="text-xs text-gray-400 mt-2">IP a determinar entre los investigadores socios de la SEFH. Los residentes no pueden figurar como IP (base 2 de la convocatoria).</p>
        </section>

        {/* 5. CRONOGRAMA */}
        <section>
          <h2 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-1 mb-3">5. Cronograma</h2>
          <div className="overflow-hidden rounded-lg border border-gray-200">
            <table className="w-full text-xs">
              <thead className="bg-gray-50 text-gray-500 uppercase">
                <tr>
                  <th className="text-left px-4 py-2">Actividad</th>
                  <th className="text-center px-2 py-2">Ago</th>
                  <th className="text-center px-2 py-2">Sep</th>
                  <th className="text-center px-2 py-2">Oct</th>
                  <th className="text-center px-2 py-2">Nov</th>
                  <th className="text-center px-2 py-2">Dic</th>
                  <th className="text-center px-2 py-2">Ene</th>
                  <th className="text-center px-2 py-2">Feb</th>
                  <th className="text-center px-2 py-2">Mar</th>
                  <th className="text-center px-2 py-2">Abr</th>
                  <th className="text-center px-2 py-2">May</th>
                  <th className="text-center px-2 py-2">Jun</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {[
                  { label: 'Fase 1: Poblado ATC L01', months: [1,1,1,0,0,0,0,0,0,0,0], color: 'bg-blue-200' },
                  { label: 'Parseo automático FTs', months: [1,1,0,0,0,0,0,0,0,0,0], color: 'bg-blue-100' },
                  { label: 'Carga datos Stabilis', months: [0,1,1,0,0,0,0,0,0,0,0], color: 'bg-blue-100' },
                  { label: 'Fase 2: Validación cruzada', months: [0,0,0,1,1,1,0,0,0,0,0], color: 'bg-yellow-200' },
                  { label: 'Gobernanza y auditoría', months: [0,0,0,0,1,1,0,0,0,0,0], color: 'bg-yellow-100' },
                  { label: 'API + exportaciones bombas/PEA', months: [0,0,1,1,1,0,0,0,0,0,0], color: 'bg-green-200' },
                  { label: 'Fase 3: Evaluación multicéntrica', months: [0,0,0,0,0,0,1,1,1,1,1], color: 'bg-purple-200' },
                  { label: 'Manuscrito Farm Hosp', months: [0,0,0,0,0,0,0,0,1,1,1], color: 'bg-purple-100' },
                ].map(({ label, months, color }) => (
                  <tr key={label}>
                    <td className="px-4 py-1.5 text-gray-700">{label}</td>
                    {months.map((m, i) => (
                      <td key={i} className="px-1 py-1.5 text-center">
                        {m ? <div className={`h-3 rounded ${color}`} /> : null}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-gray-400 mt-2">Agosto 2026 – Junio 2027 (11 meses). Informe de estado: 31 enero 2027. Informe final: 30 septiembre 2027.</p>
        </section>

        {/* 6. PRESUPUESTO */}
        <section>
          <h2 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-1 mb-3">6. Presupuesto estimado</h2>
          <div className="overflow-hidden rounded-lg border border-gray-200">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                <tr>
                  <th className="text-left px-4 py-2">Concepto</th>
                  <th className="text-right px-4 py-2">Importe</th>
                  <th className="text-left px-4 py-2">Justificación</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <tr><td className="px-4 py-2">Infraestructura (Supabase, Vercel)</td><td className="text-right px-4 py-2">0 €</td><td className="px-4 py-2 text-gray-400">Planes gratuitos suficientes para el proyecto</td></tr>
                <tr className="bg-gray-50/50"><td className="px-4 py-2">Licencia Stabilis institucional</td><td className="text-right px-4 py-2">A consultar</td><td className="px-4 py-2 text-gray-400">Acceso a datos de estabilidad con referencias primarias</td></tr>
                <tr><td className="px-4 py-2">Reuniones presenciales del grupo (2)</td><td className="text-right px-4 py-2">A determinar</td><td className="px-4 py-2 text-gray-400">Desplazamientos y dietas de los investigadores</td></tr>
                <tr className="bg-gray-50/50"><td className="px-4 py-2">Publicación Open Access</td><td className="text-right px-4 py-2">A determinar</td><td className="px-4 py-2 text-gray-400">Si se publica en revista internacional indexada</td></tr>
                <tr><td className="px-4 py-2">Asistencia a congreso (presentación resultados)</td><td className="text-right px-4 py-2">A determinar</td><td className="px-4 py-2 text-gray-400">Inscripción y desplazamiento</td></tr>
              </tbody>
              <tfoot className="bg-gray-50 font-semibold">
                <tr><td className="px-4 py-2">Total</td><td className="text-right px-4 py-2" colSpan={2}>Pendiente de definir con el grupo</td></tr>
              </tfoot>
            </table>
          </div>
          <p className="text-xs text-gray-400 mt-2">El desarrollo informático no tiene coste (herramientas open source, infraestructura gratuita). El presupuesto se destina a actividades del equipo investigador y difusión de resultados.</p>
        </section>

        {/* 7. RESULTADOS ESPERADOS */}
        <section>
          <h2 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-1 mb-3">7. Resultados esperados y difusión</h2>
          <ul className="list-disc list-inside space-y-2 pl-2">
            <li>Base de datos pública con los ~118 principios activos L01 parenterales, sus presentaciones comerciales, datos de estabilidad y preparación.</li>
            <li>Webapp de acceso libre para consulta en el punto de preparación.</li>
            <li>API REST pública que permita la integración con sistemas de prescripción electrónica y bombas inteligentes.</li>
            <li>Publicación en Farmacia Hospitalaria con los resultados de la evaluación multicéntrica.</li>
            <li>Presentación de resultados en congreso SEFH.</li>
            <li>Modelo replicable para otros grupos terapéuticos (antinfecciosos, soporte, etc.).</li>
          </ul>
        </section>

        {/* ESTADO ACTUAL */}
        <section className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <h2 className="text-lg font-semibold text-blue-900 mb-2">Estado actual del prototipo</h2>
          <p className="text-blue-800 mb-2">El prototipo funcional ya incluye:</p>
          <ul className="list-disc list-inside space-y-1 pl-2 text-blue-700 text-xs">
            <li>118 principios activos ATC L01 parenterales cargados desde CIMA.</li>
            <li>324 presentaciones comercializadas con excipientes, FT y estado de suministro.</li>
            <li>3 fármacos completos (cisplatino, ciclofosfamida, doxorubicina) con datos de Stabilis, FT, NIOSH, extravasaciones y administración.</li>
            <li>Sincronización automática con API de CIMA (excipientes, problemas de suministro, fichas técnicas).</li>
            <li>Parser automático de sección 6.4 de FT para conservación del vial sin abrir.</li>
            <li>Interfaz web tipo Stability Chart con tooltips interactivos y simbología tipo Stabilis.</li>
          </ul>
          <p className="text-blue-600 mt-3 text-xs font-medium">
            <a href="/" className="underline hover:text-blue-800">Ver Stability Chart →</a>
          </p>
        </section>

      </div>
    </div>
  )
}
