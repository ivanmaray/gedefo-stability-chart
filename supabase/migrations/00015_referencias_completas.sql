-- ============================================================
-- 00015_referencias_completas.sql
--
-- 1. Añade referencia_id a tablas que le faltaba
-- 2. Añade referencias NIOSH 2024 y Managing Exposures 2023
-- 3. Añade fichas técnicas Genoxal Baxter (fuente corregida)
-- 4. Rellena referencia_id en todos los datos existentes
-- ============================================================

-- ── 1. AÑADIR referencia_id A TABLAS QUE LO FALTABAN ─────────

ALTER TABLE condicion_preparacion
  ADD COLUMN IF NOT EXISTS referencia_id uuid REFERENCES referencia(id) ON DELETE SET NULL;

ALTER TABLE matriz_riesgo
  ADD COLUMN IF NOT EXISTS referencia_id uuid REFERENCES referencia(id) ON DELETE SET NULL;

-- ── 2. NUEVAS REFERENCIAS ─────────────────────────────────────

INSERT INTO referencia (id, tipo_fuente, autores, titulo, anio, doi, url, fecha_consulta, notas) VALUES

  -- NIOSH 2024 (clasificación hazardous drugs)
  ('a2000000-0000-0000-0000-000000000001',
   'consenso_grupo',
   'Ovesen JL, Sammons D, Connor TH, MacKenzie BA, DeBord DG, Trout DB, O''Callaghan JP, Whittaker C.',
   'NIOSH List of Hazardous Drugs in Healthcare Settings, 2024',
   2024,
   '10.26616/NIOSHPUB2025103',
   null,
   '2026-04-16',
   'DHHS (NIOSH) Publication No. 2025-103. Diciembre 2024. Supersedes 2016-161.'),

  -- NIOSH Managing Exposures 2023 (EPI y controles)
  ('a2000000-0000-0000-0000-000000000002',
   'consenso_grupo',
   'Hodson L, Ovesen J, Couch J, Hirst D, Lawson C, Lentz TJ, MacKenzie B, Mead K.',
   'Managing Hazardous Drug Exposures: Information for Healthcare Settings',
   2023,
   '10.26616/NIOSHPUB2023130',
   null,
   '2026-04-16',
   'DHHS (NIOSH) Publication No. 2023-130. Abril 2023. Fuente de referencia para EPI y controles de ingeniería.'),

  -- Ficha técnica Genoxal 200mg Baxter (nreg 33411)
  ('a2000000-0000-0000-0000-000000000003',
   'ficha_tecnica',
   null,
   'Ficha técnica Genoxal 200 mg polvo para solución inyectable y para perfusión - AEMPS/CIMA',
   null,
   null,
   'https://cima.aemps.es/cima/dochtml/ft/33411/FT_33411.html',
   '2026-04-16',
   'Nreg 33411 - Baxter S.L.'),

  -- Ficha técnica Genoxal 1000mg Baxter (nreg 48972)
  ('a2000000-0000-0000-0000-000000000004',
   'ficha_tecnica',
   null,
   'Ficha técnica Genoxal 1000 mg polvo para solución inyectable y para perfusión - AEMPS/CIMA',
   null,
   null,
   'https://cima.aemps.es/cima/dochtml/ft/48972/FT_48972.html',
   '2026-04-16',
   'Nreg 48972 - Baxter S.L.'),

  -- Ficha técnica Cisplatino Hikma (nreg 86466)
  ('a2000000-0000-0000-0000-000000000005',
   'ficha_tecnica',
   null,
   'Ficha técnica Cisplatino Hikma 1 mg/mL concentrado para solución para perfusión EFG - AEMPS/CIMA',
   null,
   null,
   'https://cima.aemps.es/cima/dochtml/ft/86466/FT_86466.html',
   '2026-04-16',
   'Nreg 86466 - Hikma Farmaceutica (Portugal) S.A.');

-- ── 3. RELLENAR referencia_id EN DATOS EXISTENTES ────────────

-- condicion_preparacion: cisplatino → ficha técnica cisplatino Accord (72609)
UPDATE condicion_preparacion
  SET referencia_id = 'a1000000-0000-0000-0000-000000000001'
  WHERE principio_activo_id = 'b1000000-0000-0000-0000-000000000001';

-- condicion_preparacion: ciclofosfamida → fichas técnicas Genoxal Baxter
UPDATE condicion_preparacion
  SET referencia_id = 'a2000000-0000-0000-0000-000000000003'
  WHERE principio_activo_id = 'b1000000-0000-0000-0000-000000000002'
    AND presentacion_comercial_id = 'c1000000-0000-0000-0000-000000000003'; -- Genoxal 200mg

UPDATE condicion_preparacion
  SET referencia_id = 'a2000000-0000-0000-0000-000000000004'
  WHERE principio_activo_id = 'b1000000-0000-0000-0000-000000000002'
    AND presentacion_comercial_id IS NULL; -- dilucion genérica

-- condicion_preparacion: doxorrubicina → ficha técnica Accord
UPDATE condicion_preparacion
  SET referencia_id = 'a1000000-0000-0000-0000-000000000003'
  WHERE principio_activo_id = 'b1000000-0000-0000-0000-000000000003';

-- matriz_riesgo → NIOSH Managing Exposures 2023
UPDATE matriz_riesgo
  SET referencia_id = 'a2000000-0000-0000-0000-000000000002'
  WHERE principio_activo_id IN (
    'b1000000-0000-0000-0000-000000000001',
    'b1000000-0000-0000-0000-000000000002',
    'b1000000-0000-0000-0000-000000000003'
  );

-- compatibilidad_material: rellena NULL → fuentes stabilis
UPDATE compatibilidad_material
  SET referencia_id = 'a1000000-0000-0000-0000-000000000004'
  WHERE principio_activo_id = 'b1000000-0000-0000-0000-000000000001'
    AND referencia_id IS NULL;

UPDATE compatibilidad_material
  SET referencia_id = 'a1000000-0000-0000-0000-000000000005'
  WHERE principio_activo_id = 'b1000000-0000-0000-0000-000000000002'
    AND referencia_id IS NULL;

UPDATE compatibilidad_material
  SET referencia_id = 'a1000000-0000-0000-0000-000000000006'
  WHERE principio_activo_id = 'b1000000-0000-0000-0000-000000000003'
    AND referencia_id IS NULL;

-- También corrijo la referencia de ciclofosfamida en condicion_preparacion
-- (la a1000000-002 era Accord que no está comercializado — ahora usamos Genoxal)
UPDATE condicion_preparacion
  SET referencia_id = 'a2000000-0000-0000-0000-000000000004'
  WHERE principio_activo_id = 'b1000000-0000-0000-0000-000000000002'
    AND referencia_id = 'a1000000-0000-0000-0000-000000000002';
