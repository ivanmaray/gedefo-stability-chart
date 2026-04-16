-- ============================================================
-- 00013_tabla_compatibilidad_diluente.sql
--
-- Nueva tabla: compatibilidad_diluente
-- Registra la compatibilidad fisicoquímica de un principio
-- activo con los diluyentes/vehículos habituales en farmacia
-- hospitalaria (SF, SG5%, lactato Ringer, agua estéril, etc.)
-- ============================================================

CREATE TABLE compatibilidad_diluente (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  principio_activo_id uuid NOT NULL REFERENCES principio_activo(id) ON DELETE CASCADE,
  diluente            text NOT NULL,
  resultado           text NOT NULL CHECK (resultado IN ('compatible','incompatible','condicional')),
  condiciones         text,    -- Detalle si condicional, o restricción relevante
  mecanismo           text,    -- Por qué es incompatible/condicional
  referencia_id       uuid REFERENCES referencia(id) ON DELETE SET NULL,
  created_at          timestamptz NOT NULL DEFAULT now(),
  updated_at          timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER set_updated_at_compatibilidad_diluente
  BEFORE UPDATE ON compatibilidad_diluente
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

CREATE INDEX idx_compat_diluente_pa ON compatibilidad_diluente(principio_activo_id);

ALTER TABLE compatibilidad_diluente DISABLE ROW LEVEL SECURITY;

-- ============================================================
-- DATOS SEED
-- Fuente: fichas técnicas CIMA y Stabilis 4.0
-- ============================================================

-- CISPLATINO
INSERT INTO compatibilidad_diluente (principio_activo_id, diluente, resultado, condiciones, mecanismo, referencia_id) VALUES
  ('b1000000-0000-0000-0000-000000000001', 'SF 0,9%',
   'compatible', null,
   'El cloruro sódico aporta los iones Cl⁻ necesarios para mantener la estabilidad del complejo de platino.',
   'a1000000-0000-0000-0000-000000000001'),

  ('b1000000-0000-0000-0000-000000000001', 'SG 5%',
   'incompatible',
   'No usar como diluyente único. Si es imprescindible, añadir NaCl para alcanzar al menos 0,2% de cloruro.',
   'En ausencia de Cl⁻ el cisplatino sufre reacción de acuación (sustitución del ligando cloruro por agua), generando especies hidratadas más reactivas y tóxicas, con pérdida de actividad y aumento de nefrotoxicidad.',
   'a1000000-0000-0000-0000-000000000001'),

  ('b1000000-0000-0000-0000-000000000001', 'SF 0,45%',
   'compatible', null,
   'Aporta suficiente concentración de Cl⁻ para estabilidad. Usado en protocolos de hidratación hipotónica.',
   'a1000000-0000-0000-0000-000000000001'),

  ('b1000000-0000-0000-0000-000000000001', 'Agua para preparaciones inyectables (API)',
   'incompatible',
   'No usar como diluyente.',
   'Ausencia total de Cl⁻. Misma problemática que SG 5% pero más grave.',
   'a1000000-0000-0000-0000-000000000001'),

  ('b1000000-0000-0000-0000-000000000001', 'Lactato de Ringer',
   'incompatible',
   'No usar.',
   'Contiene lactato que puede reaccionar con el platino y precipitar.',
   'a1000000-0000-0000-0000-000000000004');

-- CICLOFOSFAMIDA
INSERT INTO compatibilidad_diluente (principio_activo_id, diluente, resultado, condiciones, mecanismo, referencia_id) VALUES
  ('b1000000-0000-0000-0000-000000000002', 'SF 0,9%',
   'compatible', null, null,
   'a1000000-0000-0000-0000-000000000002'),

  ('b1000000-0000-0000-0000-000000000002', 'SG 5%',
   'compatible', null, null,
   'a1000000-0000-0000-0000-000000000002'),

  ('b1000000-0000-0000-0000-000000000002', 'Agua para preparaciones inyectables (API)',
   'compatible',
   'Solo para reconstitución del polvo. No para administración directa sin dilución posterior.',
   null,
   'a1000000-0000-0000-0000-000000000002');

-- DOXORRUBICINA
INSERT INTO compatibilidad_diluente (principio_activo_id, diluente, resultado, condiciones, mecanismo, referencia_id) VALUES
  ('b1000000-0000-0000-0000-000000000003', 'SF 0,9%',
   'compatible',
   'Diluyente de elección. Mayor estabilidad que con SG 5%.',
   null,
   'a1000000-0000-0000-0000-000000000003'),

  ('b1000000-0000-0000-0000-000000000003', 'SG 5%',
   'condicional',
   'Aceptable si no hay alternativa. Menor estabilidad que en SF. Usar en las primeras 24h.',
   'El pH ligeramente ácido del SG 5% puede afectar la estabilidad de la antraciclina a largo plazo.',
   'a1000000-0000-0000-0000-000000000006'),

  ('b1000000-0000-0000-0000-000000000003', 'Soluciones alcalinas (pH > 7)',
   'incompatible',
   'No mezclar con bicarbonato, fosfatos ni otras soluciones de pH básico.',
   'La doxorrubicina se hidroliza e inactiva en medio alcalino. Puede producir precipitación y cambio de color.',
   'a1000000-0000-0000-0000-000000000003'),

  ('b1000000-0000-0000-0000-000000000003', 'Heparina',
   'incompatible',
   'No mezclar ni administrar simultáneamente por la misma vía.',
   'Forma un precipitado insoluble por interacción entre la carga positiva de la doxorrubicina y la carga negativa de la heparina.',
   'a1000000-0000-0000-0000-000000000006');
