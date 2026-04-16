-- ============================================================
-- 00009_extravasaciones_sefh_gedefo.sql
--
-- Actualiza clasificacion_tisular y procedimiento_extravasacion
-- en la tabla administracion con los datos de la monografía:
-- "Prevención y tratamiento de extravasaciones de fármacos
-- antineoplásicos". SEFH/GEDEFO, 2020. ISBN 978-84-09-23039-6.
-- Tabla 3 (págs. 30-34) y Procedimiento general (págs. 26-28).
-- ============================================================

-- Añadir referencia de la monografía SEFH/GEDEFO
INSERT INTO referencia (id, tipo_fuente, autores, titulo, anio, url, fecha_consulta, notas)
VALUES (
  'a1000000-0000-0000-0000-000000000010',
  'consenso_grupo',
  'Albert Marí MA, Díaz Carrasco MS, Cercós Lletí AC, Conde Estévez D, Esteban Mensua MJ, Gil Lemus MÁ, Jiménez Pulido I, San José Ruiz B. Grupo de Farmacia Oncológica de la SEFH (GEDEFO)',
  'Monografía: Prevención y tratamiento de extravasaciones de fármacos antineoplásicos',
  2020,
  null,
  '2026-04-16',
  'SEFH/GEDEFO 2020. ISBN 978-84-09-23039-6. Depósito legal M-26142-2020. Tabla 3 y Procedimiento general de actuación ante extravasación.'
);

-- ============================================================
-- PROCEDIMIENTO GENERAL (pág. 26-28) aplicable a los 3 fármacos
-- como paso A (medidas iniciales) antes del tratamiento específico
-- ============================================================

-- CISPLATINO
-- Clasificación tisular: irritante (confirmado monografía pág. 21 y Tabla 3)
-- Tratamiento específico Tabla 3:
--   Farmacológico: ninguno de inicio. Si conc > 0,4 mg/mL o vol > 20 mL: DMSO 99% tópico.
--   Físico: FRÍO LOCAL. EVITAR FOTOEXPOSICIÓN. Aplicar frío TRAS DMSO si se usa.
UPDATE administracion SET
  clasificacion_tisular        = 'irritante',
  procedimiento_extravasacion  = 'MEDIDAS INICIALES (aplicar inmediatamente):
1. Detener la infusión. Desconectar equipo pero NO retirar la cánula/aguja.
2. Aspirar líquido residual con jeringa de 10 mL a través de la cánula. Si ampolla SC: jeringa 1 mL + aguja 25G, cambiar aguja entre punciones.
3. Informar al equipo y localizar botiquín de extravasaciones.
4. Retirar la vía periférica. Si vía central: valorar con cirujano.
5. Marcar el área extravasada con rotulador indeleble y medir. NO aplicar presión manual.

TRATAMIENTO ESPECÍFICO (Tabla 3, SEFH/GEDEFO 2020):
— FRÍO LOCAL: aplicar durante la 1ª hora todo lo que tolere el paciente, luego ciclos de 15-20 min, 3-4 veces/día (respetando descanso nocturno) durante 48-72 h. Bolsas de frío seco o suero cerrado refrigerado; no aplicar frío directamente sobre la piel.
— EVITAR FOTOEXPOSICIÓN del área afectada (cisplatino es fotosensibilizante).
— Si concentración > 0,4 mg/mL O volumen extravasado > 20 mL: añadir DMSO 99% tópico. Aplicar 2 gotas por 4 cm² (≈ 1-2 mL ó 20-40 gotas en gasa 7,5 × 7,5 cm); dejar secar al aire, sin vendajes ni presión. 3-4 veces/día durante 7-14 días. Aplicar FRÍO siempre DESPUÉS del DMSO.

MEDIDAS GENERALES:
— Mantener la extremidad elevada 48 h.
— Si queda dosis pendiente, administrar por otra vía (preferiblemente otra extremidad).
— Analgesia si precisa.
— Documentar en HC (fotografía para seguimiento). Informar al paciente por escrito.
— Seguimiento: si aparece ulceración, necrosis o persistencia de síntomas >10 días, valorar interconsulta a cirugía plástica o dermatología.',
  referencia_id = 'a1000000-0000-0000-0000-000000000010'
WHERE principio_activo_id = 'b1000000-0000-0000-0000-000000000001';

-- CICLOFOSFAMIDA
-- Clasificación tisular: irritante (no aparece en Tabla 3 → protocolo general)
-- Tratamiento específico Tabla 3: no descrito → solo medidas generales + frío básico
UPDATE administracion SET
  clasificacion_tisular        = 'irritante',
  procedimiento_extravasacion  = 'MEDIDAS INICIALES (aplicar inmediatamente):
1. Detener la infusión. Desconectar equipo pero NO retirar la cánula/aguja.
2. Aspirar líquido residual con jeringa de 10 mL a través de la cánula.
3. Informar al equipo y localizar botiquín de extravasaciones.
4. Retirar la vía periférica. Si vía central: valorar con cirujano.
5. Marcar el área extravasada con rotulador indeleble y medir. NO aplicar presión manual.

TRATAMIENTO (SEFH/GEDEFO 2020 — protocolo general; ciclofosfamida no figura en Tabla 3):
— FRÍO LOCAL: aplicar durante la 1ª hora todo lo que tolere el paciente como medida de alivio local del eritema. No existe evidencia sólida de uso sistemático; el panel recomienda aplicarlo en ausencia de contraindicación expresa.
— No existe antídoto específico documentado para ciclofosfamida.

MEDIDAS GENERALES:
— Mantener la extremidad elevada 48 h.
— Si queda dosis pendiente, administrar por otra vía (preferiblemente otra extremidad).
— Analgesia si precisa.
— Documentar en HC (fotografía para seguimiento). Informar al paciente por escrito.
— Seguimiento: si aparece ulceración, necrosis o persistencia de síntomas, valorar interconsulta a cirugía plástica.',
  referencia_id = 'a1000000-0000-0000-0000-000000000010'
WHERE principio_activo_id = 'b1000000-0000-0000-0000-000000000002';

-- DOXORRUBICINA
-- Clasificación tisular: vesicante (confirmado Tabla 3 — tiene protocolo con dexrazoxano)
-- Tratamiento específico Tabla 3:
--   1ª línea: DMSO 99% tópico (misma pauta que otras antraciclinas)
--   Alternativa (aprobación comisión farmacia): DEXRAZOXANO IV si extravasación central
--     o periférica grave (gran volumen / solución concentrada).
--   Frío local SIEMPRE. Retirar frío ≥15 min ANTES de administrar dexrazoxano.
--   CONTRAINDICADO aplicar frío y dexrazoxano simultáneamente.
UPDATE administracion SET
  clasificacion_tisular        = 'vesicante',
  procedimiento_extravasacion  = 'MEDIDAS INICIALES (aplicar URGENTEMENTE):
1. Detener la infusión INMEDIATAMENTE. Desconectar equipo pero NO retirar la cánula/aguja.
2. Aspirar líquido residual con jeringa de 10 mL a través de la cánula. Si ampolla SC: jeringa 1 mL + aguja 25G, cambiar aguja entre punciones.
3. Informar al equipo URGENTEMENTE y localizar botiquín de extravasaciones.
4. Retirar la vía periférica. Si vía central: valorar con cirujano para identificar zona extravasada.
5. Marcar el área extravasada con rotulador indeleble y medir. NO aplicar presión manual.

TRATAMIENTO ESPECÍFICO (Tabla 3, SEFH/GEDEFO 2020):
— DMSO 99% TÓPICO (1ª línea): aplicar lo antes posible. 2 gotas por 4 cm² (≈ 1-2 mL ó 20-40 gotas en gasa 7,5 × 7,5 cm); dejar secar al aire, sin vendajes ni presión. 3-4 veces/día durante 7-14 días.
— FRÍO LOCAL: 1ª hora todo lo que tolere, luego 15-20 min 3-4 veces/día (respetando descanso nocturno) durante 48-72 h. Aplicar frío SIEMPRE DESPUÉS del DMSO.
— DEXRAZOXANO IV (alternativa, requiere aprobación de Comisión de Farmacia): valorar si extravasación vía central O vía periférica grave (gran volumen y/o solución concentrada). Administrar en perfusión IV en 1-2 h en el brazo CONTRALATERAL, primera dosis ANTES de 6 h post-extravasación. Días 1 y 2: 1000 mg/m² (dosis máx. 2000 mg); día 3: 500 mg/m² (dosis máx. 1000 mg). RETIRAR EL FRÍO AL MENOS 15 MIN ANTES de administrar dexrazoxano. CONTRAINDICADO usar DMSO y dexrazoxano simultáneamente.

MEDIDAS GENERALES:
— Mantener la extremidad elevada 48 h.
— Si queda dosis pendiente, administrar por otra vía (preferiblemente otra extremidad).
— Analgesia si precisa.
— Documentar en HC (fotografía para seguimiento). Informar al paciente por escrito.
— Seguimiento estrecho: ulceración puede aparecer en 48-96 h y progresar durante semanas. Si necrosis o no mejoría en 10 días: interconsulta urgente a cirugía plástica.',
  referencia_id = 'a1000000-0000-0000-0000-000000000010'
WHERE principio_activo_id = 'b1000000-0000-0000-0000-000000000003';
