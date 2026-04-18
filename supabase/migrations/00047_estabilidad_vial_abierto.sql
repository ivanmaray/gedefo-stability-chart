-- Estabilidad del vial una vez abierto (concentrados líquidos)
-- o reconstituido (polvos) — dato de la FT sección 6.3.
-- Diferente de la estabilidad del diluido que va en tabla estabilidad.

ALTER TABLE presentacion_comercial
  ADD COLUMN IF NOT EXISTS estabilidad_vial_abierto text;

-- CISPLATINO HIKMA (86466)
-- FT: "Caducidad una vez abierto: usar inmediatamente.
--  Los tiempos y condiciones una vez abierto son responsabilidad del usuario."
UPDATE presentacion_comercial SET
  estabilidad_vial_abierto = 'Usar inmediatamente tras apertura'
WHERE id = 'c1000000-0000-0000-0000-000000000013';

-- CISPLATINO PHARMACIA (62107) — No especifica en FT
-- CISPLATINO ACCORD (72609) — No especifica en FT

-- DOXORUBICINA ACCORD (73266)
-- FT: "Viales abiertos: El producto debe utilizarse inmediatamente después de abrir el vial."
UPDATE presentacion_comercial SET
  estabilidad_vial_abierto = 'Usar inmediatamente tras apertura'
WHERE id = 'c1000000-0000-0000-0000-000000000005';

-- DOXORUBICINA AUROVITAS (75345)
-- FT: "Viales abiertos: estabilidad química y física 28 días a 2-8°C.
--  Los tiempos de conservación del vial abierto y de la solución diluida no son aditivos."
UPDATE presentacion_comercial SET
  estabilidad_vial_abierto = '28 días a 2-8 °C (no aditivo con estabilidad del diluido)'
WHERE id = 'c1000000-0000-0000-0000-000000000034';

-- FARMIBLASTINA 2 mg/mL (59739) — FT no especifica vial abierto
-- FARMIBLASTINA 50 mg polvo (56172) — reconstituido en condicion_preparacion
-- CICLOFOSFAMIDA DR. REDDYS (86548) — FT no especifica
-- GENOXAL (33411, 48972) — reconstituido en condicion_preparacion
-- CICLOFOSFAMIDA SEACROSS (90200) — FT no especifica
