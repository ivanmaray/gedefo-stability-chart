-- ============================================================
-- 00005_fix_presentaciones_reales.sql
--
-- 1. Añade columna problema_suministro (sincronizada desde CIMA psum)
-- 2. Corrige CNs y URLs de fichas técnicas (los del seed 00002 eran ficticios)
-- 3. Añade presentaciones reales con datos de CIMA (abril 2026)
--
-- Fuente: CIMA API https://cima.aemps.es/cima/rest/
-- ============================================================

-- 1. Nueva columna problema_suministro
ALTER TABLE presentacion_comercial
  ADD COLUMN IF NOT EXISTS problema_suministro boolean NOT NULL DEFAULT false;

-- ============================================================
-- 2. CORREGIR presentaciones existentes del seed 00002
--    Los CNs y URLs originales eran ficticios.
--    Se mantienen los mismos UUIDs para no romper FKs
--    en estabilidad y condicion_preparacion.
-- ============================================================

-- Cisplatino Accord 50mL (c1 → CN real: 683047, nreg 72609)
UPDATE presentacion_comercial SET
  codigo_nacional         = '683047',
  nombre_comercial        = 'Cisplatino Accord 1 mg/mL concentrado para solución para perfusión, 1 vial de 50 mL',
  laboratorio_titular     = 'Accord Healthcare S.L.U.',
  forma_farmaceutica      = 'Concentrado para solución para perfusión',
  concentracion_valor     = 1,
  concentracion_unidad    = 'mg/mL',
  volumen_envase_ml       = 50,
  ficha_tecnica_url       = 'https://cima.aemps.es/cima/dochtml/ft/72609/FT_72609.html',
  problema_suministro     = false
WHERE id = 'c1000000-0000-0000-0000-000000000001';

-- Cisplatino Accord 100mL (c2 → CN real: 683048, nreg 72609)
UPDATE presentacion_comercial SET
  codigo_nacional         = '683048',
  nombre_comercial        = 'Cisplatino Accord 1 mg/mL concentrado para solución para perfusión, 1 vial de 100 mL',
  laboratorio_titular     = 'Accord Healthcare S.L.U.',
  forma_farmaceutica      = 'Concentrado para solución para perfusión',
  concentracion_valor     = 1,
  concentracion_unidad    = 'mg/mL',
  volumen_envase_ml       = 100,
  ficha_tecnica_url       = 'https://cima.aemps.es/cima/dochtml/ft/72609/FT_72609.html',
  problema_suministro     = false
WHERE id = 'c1000000-0000-0000-0000-000000000002';

-- Ciclofosfamida: los del seed usaban Accord que NO está comercializado.
-- Se corrigen a Genoxal (Baxter), la presentación más usada en España.
-- c3: Genoxal 200mg Baxter (CN real: 672084, nreg 33411)
UPDATE presentacion_comercial SET
  codigo_nacional         = '672084',
  nombre_comercial        = 'Genoxal 200 mg polvo para solución inyectable y para perfusión, 1 vial',
  laboratorio_titular     = 'Baxter S.L.',
  forma_farmaceutica      = 'Polvo para solución inyectable y para perfusión',
  concentracion_valor     = 200,
  concentracion_unidad    = 'mg',
  volumen_envase_ml       = null,
  ficha_tecnica_url       = 'https://cima.aemps.es/cima/dochtml/ft/33411/FT_33411.html',
  problema_suministro     = false
WHERE id = 'c1000000-0000-0000-0000-000000000003';

-- c4: Genoxal 1000mg Baxter (CN real: 700551, nreg 48972)
UPDATE presentacion_comercial SET
  codigo_nacional         = '700551',
  nombre_comercial        = 'Genoxal 1000 mg polvo para solución inyectable y para perfusión, 1 vial',
  laboratorio_titular     = 'Baxter S.L.',
  forma_farmaceutica      = 'Polvo para solución inyectable y para perfusión',
  concentracion_valor     = 1000,
  concentracion_unidad    = 'mg',
  volumen_envase_ml       = null,
  ficha_tecnica_url       = 'https://cima.aemps.es/cima/dochtml/ft/48972/FT_48972.html',
  problema_suministro     = false
WHERE id = 'c1000000-0000-0000-0000-000000000004';

-- Doxorrubicina Accord 25mL (c5 → CN real: 677176, nreg 73266)
UPDATE presentacion_comercial SET
  codigo_nacional         = '677176',
  nombre_comercial        = 'Doxorubicina Accord 2 mg/mL concentrado para solución para perfusión, 1 vial de 25 mL',
  laboratorio_titular     = 'Accord Healthcare S.L.U.',
  forma_farmaceutica      = 'Concentrado para solución para perfusión',
  concentracion_valor     = 2,
  concentracion_unidad    = 'mg/mL',
  volumen_envase_ml       = 25,
  ficha_tecnica_url       = 'https://cima.aemps.es/cima/dochtml/ft/73266/FT_73266.html',
  problema_suministro     = false
WHERE id = 'c1000000-0000-0000-0000-000000000005';

-- Doxorrubicina Accord 100mL (c6 → CN real: 677177, nreg 73266)
UPDATE presentacion_comercial SET
  codigo_nacional         = '677177',
  nombre_comercial        = 'Doxorubicina Accord 2 mg/mL concentrado para solución para perfusión, 1 vial de 100 mL',
  laboratorio_titular     = 'Accord Healthcare S.L.U.',
  forma_farmaceutica      = 'Concentrado para solución para perfusión',
  concentracion_valor     = 2,
  concentracion_unidad    = 'mg/mL',
  volumen_envase_ml       = 100,
  ficha_tecnica_url       = 'https://cima.aemps.es/cima/dochtml/ft/73266/FT_73266.html',
  problema_suministro     = false
WHERE id = 'c1000000-0000-0000-0000-000000000006';

-- ============================================================
-- 3. INSERTAR presentaciones adicionales reales
-- ============================================================

-- CISPLATINO — presentaciones adicionales

-- Accord 10mL (CN 673372)
INSERT INTO presentacion_comercial
  (id, principio_activo_id, codigo_nacional, nombre_comercial, laboratorio_titular,
   forma_farmaceutica, concentracion_valor, concentracion_unidad, volumen_envase_ml,
   temperatura_conservacion, proteccion_luz_almacenamiento, ficha_tecnica_url, problema_suministro,
   estado_comercializacion, con_conservantes)
VALUES
  ('c1000000-0000-0000-0000-000000000010',
   'b1000000-0000-0000-0000-000000000001', '673372',
   'Cisplatino Accord 1 mg/mL concentrado para solución para perfusión, 1 vial de 10 mL',
   'Accord Healthcare S.L.U.', 'Concentrado para solución para perfusión',
   1, 'mg/mL', 10, 'nevera', true,
   'https://cima.aemps.es/cima/dochtml/ft/72609/FT_72609.html', false,
   'Autorizado', false),

-- Pharmacia/Pfizer 50mL (CN 664584)
  ('c1000000-0000-0000-0000-000000000011',
   'b1000000-0000-0000-0000-000000000001', '664584',
   'Cisplatino Pharmacia 1 mg/mL concentrado para solución para perfusión, 1 vial de 50 mL',
   'Pharmacia Nostrum S.A. (comerc. Pfizer S.L.)', 'Concentrado para solución para perfusión',
   1, 'mg/mL', 50, 'nevera', true,
   'https://cima.aemps.es/cima/dochtml/ft/62107/FT_62107.html', false,
   'Autorizado', false),

-- Pharmacia/Pfizer 100mL (CN 664585)
  ('c1000000-0000-0000-0000-000000000012',
   'b1000000-0000-0000-0000-000000000001', '664585',
   'Cisplatino Pharmacia 1 mg/mL concentrado para solución para perfusión, 1 vial de 100 mL',
   'Pharmacia Nostrum S.A. (comerc. Pfizer S.L.)', 'Concentrado para solución para perfusión',
   1, 'mg/mL', 100, 'nevera', true,
   'https://cima.aemps.es/cima/dochtml/ft/62107/FT_62107.html', false,
   'Autorizado', false),

-- Hikma 50mL (CN 732523) — PROBLEMA DE SUMINISTRO
  ('c1000000-0000-0000-0000-000000000013',
   'b1000000-0000-0000-0000-000000000001', '732523',
   'Cisplatino Hikma 1 mg/mL concentrado para solución para perfusión, 1 vial de 50 mL',
   'Hikma Farmaceutica (Portugal) S.A. (comerc. Hikma España S.L.U.)',
   'Concentrado para solución para perfusión',
   1, 'mg/mL', 50, 'nevera', true,
   'https://cima.aemps.es/cima/dochtml/ft/86466/FT_86466.html', true,
   'Autorizado', false),

-- Hikma 100mL (CN 732524) — PROBLEMA DE SUMINISTRO
  ('c1000000-0000-0000-0000-000000000014',
   'b1000000-0000-0000-0000-000000000001', '732524',
   'Cisplatino Hikma 1 mg/mL concentrado para solución para perfusión, 1 vial de 100 mL',
   'Hikma Farmaceutica (Portugal) S.A. (comerc. Hikma España S.L.U.)',
   'Concentrado para solución para perfusión',
   1, 'mg/mL', 100, 'nevera', true,
   'https://cima.aemps.es/cima/dochtml/ft/86466/FT_86466.html', true,
   'Autorizado', false);

-- CICLOFOSFAMIDA — presentaciones adicionales

INSERT INTO presentacion_comercial
  (id, principio_activo_id, codigo_nacional, nombre_comercial, laboratorio_titular,
   forma_farmaceutica, concentracion_valor, concentracion_unidad, volumen_envase_ml,
   temperatura_conservacion, proteccion_luz_almacenamiento, ficha_tecnica_url, problema_suministro,
   estado_comercializacion, con_conservantes)
VALUES
-- Dr. Reddys 500mg/mL 1mL (CN 732777) — PROBLEMA DE SUMINISTRO
  ('c1000000-0000-0000-0000-000000000020',
   'b1000000-0000-0000-0000-000000000002', '732777',
   'Ciclofosfamida Dr. Reddys 500 mg/mL concentrado para solución inyectable y para perfusión, 1 vial de 1 mL',
   'Reddy Pharma Iberia S.A.', 'Concentrado para solución inyectable y para perfusión',
   500, 'mg/mL', 1, 'ambiente', false,
   'https://cima.aemps.es/cima/dochtml/ft/86548/FT_86548.html', true,
   'Autorizado', false),

-- Dr. Reddys 500mg/mL 2mL (CN 732778) — PROBLEMA DE SUMINISTRO
  ('c1000000-0000-0000-0000-000000000021',
   'b1000000-0000-0000-0000-000000000002', '732778',
   'Ciclofosfamida Dr. Reddys 500 mg/mL concentrado para solución inyectable y para perfusión, 1 vial de 2 mL',
   'Reddy Pharma Iberia S.A.', 'Concentrado para solución inyectable y para perfusión',
   500, 'mg/mL', 2, 'ambiente', false,
   'https://cima.aemps.es/cima/dochtml/ft/86548/FT_86548.html', true,
   'Autorizado', false),

-- Dr. Reddys 500mg/mL 4mL (CN 732779)
  ('c1000000-0000-0000-0000-000000000022',
   'b1000000-0000-0000-0000-000000000002', '732779',
   'Ciclofosfamida Dr. Reddys 500 mg/mL concentrado para solución inyectable y para perfusión, 1 vial de 4 mL',
   'Reddy Pharma Iberia S.A.', 'Concentrado para solución inyectable y para perfusión',
   500, 'mg/mL', 4, 'ambiente', false,
   'https://cima.aemps.es/cima/dochtml/ft/86548/FT_86548.html', false,
   'Autorizado', false),

-- Seacross 500mg (CN 767136)
  ('c1000000-0000-0000-0000-000000000023',
   'b1000000-0000-0000-0000-000000000002', '767136',
   'Ciclofosfamida Seacross 500 mg polvo para solución inyectable y para perfusión, 1 vial',
   'Seacross Pharma (Europe) Limited', 'Polvo para solución inyectable y para perfusión',
   500, 'mg', null, 'ambiente', false,
   'https://cima.aemps.es/cima/dochtml/ft/90200/FT_90200.html', false,
   'Autorizado', false);

-- DOXORRUBICINA — presentaciones adicionales

INSERT INTO presentacion_comercial
  (id, principio_activo_id, codigo_nacional, nombre_comercial, laboratorio_titular,
   forma_farmaceutica, concentracion_valor, concentracion_unidad, volumen_envase_ml,
   temperatura_conservacion, proteccion_luz_almacenamiento, ph_minimo, ph_maximo,
   ficha_tecnica_url, problema_suministro, estado_comercializacion, con_conservantes)
VALUES
-- Accord 5mL (CN 677175)
  ('c1000000-0000-0000-0000-000000000030',
   'b1000000-0000-0000-0000-000000000003', '677175',
   'Doxorubicina Accord 2 mg/mL concentrado para solución para perfusión, 1 vial de 5 mL',
   'Accord Healthcare S.L.U.', 'Concentrado para solución para perfusión',
   2, 'mg/mL', 5, 'nevera', true, 2.5, 4.5,
   'https://cima.aemps.es/cima/dochtml/ft/73266/FT_73266.html', false,
   'Autorizado', false),

-- Accord 50mL (CN 702587) — PROBLEMA DE SUMINISTRO
  ('c1000000-0000-0000-0000-000000000031',
   'b1000000-0000-0000-0000-000000000003', '702587',
   'Doxorubicina Accord 2 mg/mL concentrado para solución para perfusión, 1 vial de 50 mL',
   'Accord Healthcare S.L.U.', 'Concentrado para solución para perfusión',
   2, 'mg/mL', 50, 'nevera', true, 2.5, 4.5,
   'https://cima.aemps.es/cima/dochtml/ft/73266/FT_73266.html', true,
   'Autorizado', false),

-- Farmiblastina 2mg/mL 25mL Pfizer (CN 802769)
  ('c1000000-0000-0000-0000-000000000032',
   'b1000000-0000-0000-0000-000000000003', '802769',
   'Farmiblastina 2 mg/mL concentrado para solución para perfusión, 1 vial de 25 mL',
   'Pfizer S.L.', 'Concentrado para solución para perfusión',
   2, 'mg/mL', 25, 'nevera', true, 2.5, 4.5,
   'https://cima.aemps.es/cima/dochtml/ft/59739/FT_59739.html', false,
   'Autorizado', false),

-- Farmiblastina 50mg polvo Pfizer (CN 958314)
  ('c1000000-0000-0000-0000-000000000033',
   'b1000000-0000-0000-0000-000000000003', '958314',
   'Farmiblastina 50 mg polvo para solución inyectable, 1 vial',
   'Pfizer S.L.', 'Polvo para solución inyectable',
   50, 'mg', null, 'nevera', true, null, null,
   'https://cima.aemps.es/cima/dochtml/ft/56172/FT_56172.html', false,
   'Autorizado', false),

-- Aurovitas 25mL (CN 687252)
  ('c1000000-0000-0000-0000-000000000034',
   'b1000000-0000-0000-0000-000000000003', '687252',
   'Doxorubicina Aurovitas 2 mg/mL concentrado para solución para perfusión, 1 vial de 25 mL',
   'Eugia Pharma (Malta) Limited', 'Concentrado para solución para perfusión',
   2, 'mg/mL', 25, 'nevera', true, 2.5, 4.5,
   'https://cima.aemps.es/cima/dochtml/ft/75345/FT_75345.html', false,
   'Autorizado', false),

-- Aurovitas 100mL (CN 687255)
  ('c1000000-0000-0000-0000-000000000035',
   'b1000000-0000-0000-0000-000000000003', '687255',
   'Doxorubicina Aurovitas 2 mg/mL concentrado para solución para perfusión, 1 vial de 100 mL',
   'Eugia Pharma (Malta) Limited', 'Concentrado para solución para perfusión',
   2, 'mg/mL', 100, 'nevera', true, 2.5, 4.5,
   'https://cima.aemps.es/cima/dochtml/ft/75345/FT_75345.html', false,
   'Autorizado', false);

-- ============================================================
-- 4. Actualizar referencias con URLs reales de fichas técnicas
-- ============================================================
UPDATE referencia SET
  url = 'https://cima.aemps.es/cima/dochtml/ft/72609/FT_72609.html'
WHERE id = 'a1000000-0000-0000-0000-000000000001';

UPDATE referencia SET
  url = 'https://cima.aemps.es/cima/dochtml/ft/33411/FT_33411.html'
WHERE id = 'a1000000-0000-0000-0000-000000000002';

UPDATE referencia SET
  url = 'https://cima.aemps.es/cima/dochtml/ft/73266/FT_73266.html'
WHERE id = 'a1000000-0000-0000-0000-000000000003';
