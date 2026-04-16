-- ============================================================
-- 00021_fix_reconstitucion_desde_ft.sql
--
-- Corrige y completa los datos de reconstitución según sección
-- 6.6 de cada ficha técnica AEMPS (consultada 2026-04-16).
--
-- Cambios:
--   1. Genoxal (Baxter): SF 0,9% ÚNICAMENTE (no API).
--      La FT dice explícitamente "cloruro sódico al 0,9%".
--      Se desvincula de la presentación concreta → aplica a
--      todas las presentaciones de ciclofosfamida Baxter.
--   2. Ciclofosfamida Seacross: nueva entrada, API o SF 0,9%.
--   3. Farmiblastina 50 mg polvo: nueva entrada, SF o API, 2 mg/mL.
-- ============================================================

-- ──────────────────────────────────────────────────────────────
-- 1. Corregir entrada Genoxal
--    · diluyente: solo SF 0,9%
--    · ampliar a todas las presentaciones Baxter (presentacion_id → null)
--      pero acotar con notas por vial
-- ──────────────────────────────────────────────────────────────
UPDATE condicion_preparacion SET
  diluyente                    = 'SF 0,9%',
  concentracion_final_minima   = 20,
  concentracion_final_maxima   = 20,
  presentacion_comercial_id    = null,
  notas = 'Reconstituir con SF 0,9% estéril únicamente (FT Genoxal). '
          'Vial 200 mg → añadir 10 mL → 20 mg/mL. '
          'Vial 1.000 mg → añadir 50 mL → 20 mg/mL. '
          'Agitar hasta disolución completa (hasta 3 min). '
          'La solución reconstituida debe diluirse antes de administrar.'
WHERE id = 'dba5677d-cb1d-4a3d-94e5-4b31a9139a61';

-- ──────────────────────────────────────────────────────────────
-- 2. Ciclofosfamida Seacross: API o SF 0,9%, 20 mg/mL
--    (FT Seacross: "agua para preparaciones inyectables o
--     cloruro sódico 9 mg/ml 0,9%")
-- ──────────────────────────────────────────────────────────────
INSERT INTO condicion_preparacion (
  principio_activo_id,
  presentacion_comercial_id,
  tipo,
  diluyente,
  concentracion_final_minima,
  concentracion_final_maxima,
  notas
) VALUES (
  'b1000000-0000-0000-0000-000000000002',
  'c1000000-0000-0000-0000-000000000023',  -- Seacross 500 mg
  'reconstitucion',
  'API o SF 0,9%',
  20,
  20,
  'Vial 500 mg → añadir 25 mL → 20 mg/mL. '
  'La solución reconstituida debe diluirse antes de administrar.'
);

-- ──────────────────────────────────────────────────────────────
-- 3. Farmiblastina 50 mg polvo (nreg 56172)
--    FT: "reconstituirse con 25 ml de solución fisiológica
--         salina estéril o agua destilada" → 2 mg/mL
--    Conservar reconstituida protegida de luz; estabilidad
--    post-reconstitución: 24 h a <25°C o 48 h en nevera.
-- ──────────────────────────────────────────────────────────────
INSERT INTO condicion_preparacion (
  principio_activo_id,
  presentacion_comercial_id,
  tipo,
  diluyente,
  concentracion_final_minima,
  concentracion_final_maxima,
  proteccion_luz,
  notas
) VALUES (
  'b1000000-0000-0000-0000-000000000003',
  'c1000000-0000-0000-0000-000000000033',  -- Farmiblastina 50 mg polvo
  'reconstitucion',
  'SF 0,9% o API',
  2,
  2,
  true,
  'Añadir 25 mL de SF 0,9% estéril o agua destilada al vial de 50 mg → 2 mg/mL. '
  'No usar soluciones bacteriostáticas. '
  'Conservar reconstituida protegida de luz: estable 24 h a <25°C o 48 h en nevera (2-8°C).'
);
