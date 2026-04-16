-- ============================================================
-- 00010_clasificacion_tisular_sefh.sql
--
-- Actualiza clasificacion_tisular con la nomenclatura exacta
-- de la Tabla 1 de la monografía SEFH/GEDEFO 2020:
--   vesicante | irritante_alto_riesgo | irritante_bajo_riesgo | no_irritante
--
-- Correcciones respecto al seed:
--   cisplatino:     irritante → irritante_alto_riesgo
--   ciclofosfamida: irritante → no_irritante  (era incorrecto)
--   doxorrubicina:  vesicante → vesicante      (correcto, sin cambio)
-- ============================================================

-- 1. Eliminar el CHECK constraint antiguo
ALTER TABLE administracion
  DROP CONSTRAINT IF EXISTS administracion_clasificacion_tisular_check;

-- 2. Migrar datos existentes antes de añadir el nuevo constraint
UPDATE administracion SET clasificacion_tisular = 'irritante_alto_riesgo'
  WHERE clasificacion_tisular = 'irritante'
    AND principio_activo_id = 'b1000000-0000-0000-0000-000000000001';

UPDATE administracion SET clasificacion_tisular = 'no_irritante'
  WHERE principio_activo_id = 'b1000000-0000-0000-0000-000000000002';

-- 3. Nuevo CHECK constraint con nomenclatura SEFH/GEDEFO 2020
ALTER TABLE administracion
  ADD CONSTRAINT administracion_clasificacion_tisular_check
  CHECK (clasificacion_tisular IN (
    'vesicante',
    'irritante_alto_riesgo',
    'irritante_bajo_riesgo',
    'no_irritante'
  ));

-- 4. Actualizar procedimiento ciclofosfamida:
--    no irritante → no hay tratamiento específico de extravasación,
--    solo medidas generales básicas
UPDATE administracion SET
  procedimiento_extravasacion = 'Ciclofosfamida está clasificada como NO IRRITANTE (Tabla 1, SEFH/GEDEFO 2020): no produce daño tisular significativo en caso de extravasación.

MEDIDAS GENERALES de precaución:
1. Detener la infusión. Desconectar equipo pero NO retirar la cánula.
2. Aspirar líquido residual con jeringa de 10 mL.
3. Retirar la vía periférica. Informar al equipo.
4. Marcar el área con rotulador indeleble. NO aplicar presión manual.
5. Mantener extremidad elevada.
6. Vigilancia: si aparece eritema, induración o dolor persistente, valorar individualmente.
7. Documentar en HC. Informar al paciente.

No existe antídoto ni tratamiento farmacológico específico recomendado.'
WHERE principio_activo_id = 'b1000000-0000-0000-0000-000000000002';
