-- ============================================================
-- 00011_refactor_presentacion_envase.sql
--
-- Refactoriza el modelo de presentaciones para alinearse con
-- la estructura real de CIMA:
--
--   ANTES (plano, un row por CN):
--     presentacion_comercial: nregistro + CN + volumen + psum
--
--   DESPUÉS (jerárquico):
--     presentacion_comercial  → nivel nregistro (lab, nombre, excipientes...)
--     envase                  → nivel CN        (código nacional, volumen, psum)
--
-- ============================================================

-- ============================================================
-- 1. CREAR TABLA envase
-- ============================================================
CREATE TABLE envase (
  id                      uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  presentacion_id         uuid NOT NULL REFERENCES presentacion_comercial(id) ON DELETE CASCADE,
  codigo_nacional         text UNIQUE,
  volumen_ml              numeric,
  comercializado          boolean NOT NULL DEFAULT true,
  problema_suministro     boolean NOT NULL DEFAULT false,
  estado_comercializacion text,
  created_at              timestamptz NOT NULL DEFAULT now(),
  updated_at              timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER set_updated_at_envase
  BEFORE UPDATE ON envase
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

CREATE INDEX idx_envase_presentacion ON envase(presentacion_id);
CREATE INDEX idx_envase_cn ON envase(codigo_nacional);

ALTER TABLE envase DISABLE ROW LEVEL SECURITY;

-- ============================================================
-- 2. AÑADIR nregistro_cima A presentacion_comercial
--    y actualizar nombres (quitar "1 vial de XX mL" del nombre)
-- ============================================================
ALTER TABLE presentacion_comercial
  ADD COLUMN IF NOT EXISTS nregistro_cima text;

-- Actualizar nombres a nivel nregistro (sin volumen)
UPDATE presentacion_comercial SET
  nombre_comercial = 'Cisplatino Accord 1 mg/mL concentrado para solución para perfusión EFG',
  nregistro_cima   = '72609'
WHERE id = 'c1000000-0000-0000-0000-000000000001';

UPDATE presentacion_comercial SET
  nombre_comercial = 'Cisplatino Pharmacia 1 mg/mL concentrado para solución para perfusión EFG',
  nregistro_cima   = '62107'
WHERE id = 'c1000000-0000-0000-0000-000000000011';

UPDATE presentacion_comercial SET
  nombre_comercial = 'Cisplatino Hikma 1 mg/mL concentrado para solución para perfusión EFG',
  nregistro_cima   = '86466'
WHERE id = 'c1000000-0000-0000-0000-000000000013';

UPDATE presentacion_comercial SET
  nombre_comercial = 'Genoxal 200 mg polvo para solución inyectable y para perfusión',
  nregistro_cima   = '33411'
WHERE id = 'c1000000-0000-0000-0000-000000000003';

UPDATE presentacion_comercial SET
  nombre_comercial = 'Genoxal 1000 mg polvo para solución inyectable y para perfusión',
  nregistro_cima   = '48972'
WHERE id = 'c1000000-0000-0000-0000-000000000004';

UPDATE presentacion_comercial SET
  nombre_comercial = 'Ciclofosfamida Dr. Reddys 500 mg/mL concentrado para solución inyectable y para perfusión',
  nregistro_cima   = '86548'
WHERE id = 'c1000000-0000-0000-0000-000000000020';

UPDATE presentacion_comercial SET
  nombre_comercial = 'Ciclofosfamida Seacross 500 mg polvo para solución inyectable y para perfusión EFG',
  nregistro_cima   = '90200'
WHERE id = 'c1000000-0000-0000-0000-000000000023';

UPDATE presentacion_comercial SET
  nombre_comercial = 'Doxorubicina Accord 2 mg/mL concentrado para solución para perfusión EFG',
  nregistro_cima   = '73266'
WHERE id = 'c1000000-0000-0000-0000-000000000005';

UPDATE presentacion_comercial SET
  nombre_comercial = 'Farmiblastina 2 mg/mL concentrado para solución para perfusión',
  nregistro_cima   = '59739'
WHERE id = 'c1000000-0000-0000-0000-000000000032';

UPDATE presentacion_comercial SET
  nombre_comercial = 'Farmiblastina 50 mg polvo para solución inyectable',
  nregistro_cima   = '56172'
WHERE id = 'c1000000-0000-0000-0000-000000000033';

UPDATE presentacion_comercial SET
  nombre_comercial = 'Doxorubicina Aurovitas 2 mg/mL concentrado para solución para perfusión EFG',
  nregistro_cima   = '75345'
WHERE id = 'c1000000-0000-0000-0000-000000000034';

-- ============================================================
-- 3. MIGRAR CNs A tabla envase
-- ============================================================

-- CISPLATINO ACCORD (nreg 72609)
INSERT INTO envase (presentacion_id, codigo_nacional, volumen_ml, comercializado, problema_suministro, estado_comercializacion) VALUES
  ('c1000000-0000-0000-0000-000000000001', '673372', 10,  true, false, 'Autorizado'),
  ('c1000000-0000-0000-0000-000000000001', '683047', 50,  true, false, 'Autorizado'),
  ('c1000000-0000-0000-0000-000000000001', '683048', 100, true, false, 'Autorizado');

-- CISPLATINO PHARMACIA (nreg 62107)
INSERT INTO envase (presentacion_id, codigo_nacional, volumen_ml, comercializado, problema_suministro, estado_comercializacion) VALUES
  ('c1000000-0000-0000-0000-000000000011', '664584', 50,  true, false, 'Autorizado'),
  ('c1000000-0000-0000-0000-000000000011', '664585', 100, true, false, 'Autorizado');

-- CISPLATINO HIKMA (nreg 86466) — PROBLEMA DE SUMINISTRO
INSERT INTO envase (presentacion_id, codigo_nacional, volumen_ml, comercializado, problema_suministro, estado_comercializacion) VALUES
  ('c1000000-0000-0000-0000-000000000013', '732523', 50,  true, true, 'Autorizado'),
  ('c1000000-0000-0000-0000-000000000013', '732524', 100, true, true, 'Autorizado');

-- CICLOFOSFAMIDA GENOXAL 200mg (nreg 33411)
INSERT INTO envase (presentacion_id, codigo_nacional, volumen_ml, comercializado, problema_suministro, estado_comercializacion) VALUES
  ('c1000000-0000-0000-0000-000000000003', '672084', null, true, false, 'Autorizado');

-- CICLOFOSFAMIDA GENOXAL 1000mg (nreg 48972)
INSERT INTO envase (presentacion_id, codigo_nacional, volumen_ml, comercializado, problema_suministro, estado_comercializacion) VALUES
  ('c1000000-0000-0000-0000-000000000004', '700551', null, true, false, 'Autorizado');

-- CICLOFOSFAMIDA DR. REDDYS (nreg 86548)
INSERT INTO envase (presentacion_id, codigo_nacional, volumen_ml, comercializado, problema_suministro, estado_comercializacion) VALUES
  ('c1000000-0000-0000-0000-000000000020', '732777', 1, true, true,  'Autorizado'),
  ('c1000000-0000-0000-0000-000000000020', '732778', 2, true, true,  'Autorizado'),
  ('c1000000-0000-0000-0000-000000000020', '732779', 4, true, false, 'Autorizado');

-- CICLOFOSFAMIDA SEACROSS (nreg 90200)
INSERT INTO envase (presentacion_id, codigo_nacional, volumen_ml, comercializado, problema_suministro, estado_comercializacion) VALUES
  ('c1000000-0000-0000-0000-000000000023', '767136', null, true, false, 'Autorizado');

-- DOXORRUBICINA ACCORD (nreg 73266)
INSERT INTO envase (presentacion_id, codigo_nacional, volumen_ml, comercializado, problema_suministro, estado_comercializacion) VALUES
  ('c1000000-0000-0000-0000-000000000005', '677175', 5,   true, false, 'Autorizado'),
  ('c1000000-0000-0000-0000-000000000005', '677176', 25,  true, false, 'Autorizado'),
  ('c1000000-0000-0000-0000-000000000005', '677177', 100, true, false, 'Autorizado'),
  ('c1000000-0000-0000-0000-000000000005', '702587', 50,  true, true,  'Autorizado');

-- FARMIBLASTINA 2 mg/mL (nreg 59739)
INSERT INTO envase (presentacion_id, codigo_nacional, volumen_ml, comercializado, problema_suministro, estado_comercializacion) VALUES
  ('c1000000-0000-0000-0000-000000000032', '802769', 25, true, false, 'Autorizado');

-- FARMIBLASTINA 50mg polvo (nreg 56172)
INSERT INTO envase (presentacion_id, codigo_nacional, volumen_ml, comercializado, problema_suministro, estado_comercializacion) VALUES
  ('c1000000-0000-0000-0000-000000000033', '958314', null, true, false, 'Autorizado');

-- AUROVITAS (nreg 75345)
INSERT INTO envase (presentacion_id, codigo_nacional, volumen_ml, comercializado, problema_suministro, estado_comercializacion) VALUES
  ('c1000000-0000-0000-0000-000000000034', '687252', 25,  true, false, 'Autorizado'),
  ('c1000000-0000-0000-0000-000000000034', '687255', 100, true, false, 'Autorizado');

-- ============================================================
-- 4. ELIMINAR filas duplicadas (mismo nregistro)
--    Se eliminan DESPUÉS de insertar los envases.
--    Las filas que quedan son las "canónicas" (una por nregistro).
-- ============================================================
DELETE FROM presentacion_comercial WHERE id IN (
  -- Cisplatino Accord duplicados
  'c1000000-0000-0000-0000-000000000002',  -- 100mL
  'c1000000-0000-0000-0000-000000000010',  -- 10mL
  -- Cisplatino Pharmacia duplicado
  'c1000000-0000-0000-0000-000000000012',  -- 100mL
  -- Cisplatino Hikma duplicado
  'c1000000-0000-0000-0000-000000000014',  -- 100mL
  -- Ciclofosfamida Dr. Reddys duplicados
  'c1000000-0000-0000-0000-000000000021',  -- 2mL
  'c1000000-0000-0000-0000-000000000022',  -- 4mL
  -- Doxorrubicina Accord duplicados
  'c1000000-0000-0000-0000-000000000006',  -- 100mL
  'c1000000-0000-0000-0000-000000000030',  -- 5mL
  'c1000000-0000-0000-0000-000000000031',  -- 50mL
  -- Aurovitas duplicado
  'c1000000-0000-0000-0000-000000000035'   -- 100mL
);

-- ============================================================
-- 5. LIMPIAR columnas que se trasladan a envase
-- ============================================================
ALTER TABLE presentacion_comercial
  DROP COLUMN IF EXISTS codigo_nacional,
  DROP COLUMN IF EXISTS volumen_envase_ml,
  DROP COLUMN IF EXISTS problema_suministro,
  DROP COLUMN IF EXISTS estado_comercializacion;
