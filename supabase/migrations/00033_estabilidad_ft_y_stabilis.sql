-- ============================================================
-- 00033_estabilidad_ft_y_stabilis.sql
--
-- 1. Stabilis: mover entradas a nivel PA (presentacion_id → null)
-- 2. FT: añadir entradas por presentación con datos de sección 6.3
-- 3. Añadir referencias FT que faltaban
-- ============================================================

-- ── 1. REFERENCIAS FT faltantes ───────────────────────────────
INSERT INTO referencia (id, tipo_fuente, titulo, url, fecha_consulta) VALUES
  ('a4000000-0000-0000-0000-000000000001', 'ficha_tecnica',
   'Ficha técnica Cisplatino Pharmacia 1 mg/mL - AEMPS/CIMA',
   'https://cima.aemps.es/cima/pdfs/ft/62107/FT_62107.pdf', '2026-04-16'),
  ('a4000000-0000-0000-0000-000000000002', 'ficha_tecnica',
   'Ficha técnica Cisplatino Hikma 1 mg/mL - AEMPS/CIMA',
   'https://cima.aemps.es/cima/pdfs/ft/86466/FT_86466.pdf', '2026-04-16'),
  ('a4000000-0000-0000-0000-000000000003', 'ficha_tecnica',
   'Ficha técnica Ciclofosfamida Dr. Reddys 500 mg/mL - AEMPS/CIMA',
   'https://cima.aemps.es/cima/pdfs/ft/86548/FT_86548.pdf', '2026-04-16'),
  ('a4000000-0000-0000-0000-000000000004', 'ficha_tecnica',
   'Ficha técnica Farmiblastina 2 mg/mL - AEMPS/CIMA',
   'https://cima.aemps.es/cima/pdfs/ft/59739/FT_59739.pdf', '2026-04-16'),
  ('a4000000-0000-0000-0000-000000000005', 'ficha_tecnica',
   'Ficha técnica Doxorubicina Aurovitas 2 mg/mL - AEMPS/CIMA',
   'https://cima.aemps.es/cima/pdfs/ft/75345/FT_75345.pdf', '2026-04-16');

-- ── 2. STABILIS → nivel PA (null presentacion_id) ─────────────
UPDATE estabilidad SET presentacion_comercial_id = null
WHERE referencia_id IN (
  'a1000000-0000-0000-0000-000000000004',  -- Stabilis cisplatino
  'a1000000-0000-0000-0000-000000000005',  -- Stabilis ciclofosfamida
  'a1000000-0000-0000-0000-000000000006'   -- Stabilis doxorubicina
);

-- ── 3. ESTABILIDAD DESDE FT ────────────────────────────────────

-- CISPLATINO PHARMACIA: 24h a 20-25°C, proteger luz, NO nevera
-- FT: "estable durante 24 horas a temperatura ambiente de 20-25°C.
--      La solución diluida debe protegerse de la luz.
--      No conservar las soluciones diluidas en la nevera o el congelador."
INSERT INTO estabilidad (principio_activo_id, presentacion_comercial_id,
  temperatura_celsius, proteccion_luz, tipo_estabilidad, tiempo_horas,
  notas_cualitativas, referencia_id)
VALUES (
  'b1000000-0000-0000-0000-000000000001',
  'c1000000-0000-0000-0000-000000000011',  -- Pharmacia
  25, true, 'fisicoquimica', 24,
  'No conservar en nevera ni congelador una vez diluido.',
  'a4000000-0000-0000-0000-000000000001'
);

-- CISPLATINO ACCORD: 24h a 20-25°C (mismo texto que Pharmacia)
INSERT INTO estabilidad (principio_activo_id, presentacion_comercial_id,
  temperatura_celsius, proteccion_luz, tipo_estabilidad, tiempo_horas,
  notas_cualitativas, referencia_id)
VALUES (
  'b1000000-0000-0000-0000-000000000001',
  'c1000000-0000-0000-0000-000000000001',  -- Accord
  25, true, 'fisicoquimica', 24,
  'No conservar en nevera ni congelador una vez diluido.',
  'a1000000-0000-0000-0000-000000000001'
);

-- CISPLATINO HIKMA: 48h a 15-25°C, proteger luz
INSERT INTO estabilidad (principio_activo_id, presentacion_comercial_id,
  temperatura_celsius, proteccion_luz, tipo_estabilidad, tiempo_horas,
  referencia_id)
VALUES (
  'b1000000-0000-0000-0000-000000000001',
  'c1000000-0000-0000-0000-000000000013',  -- Hikma
  25, true, 'fisicoquimica', 48,
  'a4000000-0000-0000-0000-000000000002'
);

-- GENOXAL 200mg: 24h a ≤8°C (reconstituida + diluida)
INSERT INTO estabilidad (principio_activo_id, presentacion_comercial_id,
  temperatura_celsius, proteccion_luz, tipo_estabilidad, tiempo_horas,
  notas_cualitativas, referencia_id)
VALUES (
  'b1000000-0000-0000-0000-000000000002',
  'c1000000-0000-0000-0000-000000000003',  -- Genoxal 200mg
  8, false, 'fisicoquimica', 24,
  'Válido tanto para solución reconstituida como para la diluida.',
  'a1000000-0000-0000-0000-000000000002'
);

-- GENOXAL 1000mg: misma FT, mismas condiciones
INSERT INTO estabilidad (principio_activo_id, presentacion_comercial_id,
  temperatura_celsius, proteccion_luz, tipo_estabilidad, tiempo_horas,
  notas_cualitativas, referencia_id)
VALUES (
  'b1000000-0000-0000-0000-000000000002',
  'c1000000-0000-0000-0000-000000000004',  -- Genoxal 1000mg
  8, false, 'fisicoquimica', 24,
  'Válido tanto para solución reconstituida como para la diluida.',
  'a2000000-0000-0000-0000-000000000004'
);

-- CICLOFOSFAMIDA DR. REDDYS: 24h a 2-8°C
INSERT INTO estabilidad (principio_activo_id, presentacion_comercial_id,
  temperatura_celsius, proteccion_luz, tipo_estabilidad, tiempo_horas,
  notas_cualitativas, referencia_id)
VALUES (
  'b1000000-0000-0000-0000-000000000002',
  'c1000000-0000-0000-0000-000000000020',  -- Dr. Reddys
  4, false, 'fisicoquimica', 24,
  'Salvo que la dilución se haya realizado en condiciones asépticas controladas y validadas.',
  'a4000000-0000-0000-0000-000000000003'
);
