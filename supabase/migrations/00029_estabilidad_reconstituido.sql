-- 1. Nuevo campo: estabilidad del vial reconstituido (texto de FT)
ALTER TABLE condicion_preparacion
  ADD COLUMN IF NOT EXISTS estabilidad_reconstituido text;

-- 2. Limpiar envase_compatible en reconstitución (no aplica — es el propio vial)
UPDATE condicion_preparacion
  SET envase_compatible = null
  WHERE tipo = 'reconstitucion';

-- 3. Poblar estabilidad_reconstituido solo donde la FT lo especifica

-- Genoxal 200mg: FT → "reconstituida como la diluida pueden utilizarse
-- hasta 24 horas después de su reconstitución (no almacenar por encima de 8°C)"
UPDATE condicion_preparacion SET
  estabilidad_reconstituido = '24 h conservando a ≤8 °C (nevera)'
WHERE presentacion_comercial_id = 'c1000000-0000-0000-0000-000000000003'
  AND tipo = 'reconstitucion';

-- Genoxal 1000mg: misma FT
UPDATE condicion_preparacion SET
  estabilidad_reconstituido = '24 h conservando a ≤8 °C (nevera)'
WHERE presentacion_comercial_id = 'c1000000-0000-0000-0000-000000000004'
  AND tipo = 'reconstitucion';

-- Farmiblastina 50mg polvo: FT → "no conservar a >25°C más de 24 h
-- o en nevera (2-8°C) no más de 48 h"
UPDATE condicion_preparacion SET
  estabilidad_reconstituido = '24 h a <25 °C  ó  48 h en nevera (2-8 °C) — proteger de la luz'
WHERE presentacion_comercial_id = 'c1000000-0000-0000-0000-000000000033'
  AND tipo = 'reconstitucion';

-- Seacross y Dr. Reddys: sin dato explícito en FT → null (pendiente)
