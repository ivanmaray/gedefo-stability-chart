-- ============================================================
-- 00004_niosh_2024_clasificacion.sql
-- Actualización nomenclatura NIOSH: grupo_1/2/3 → tabla_1/tabla_2
--
-- NIOSH 2024 (DHHS Pub. 2025-103, diciembre 2024) elimina la
-- clasificación por grupos del 2016 y reorganiza en:
--   Tabla 1: fármacos con MSHI y/o carcinógenos conocidos/probables
--            según NTP/IARC (Group 1 o 2A). Incluye la mayoría de
--            citotóxicos antineoplásticos.
--   Tabla 2: resto de fármacos peligrosos (sin MSHI, no carcinógenos
--            NTP/IARC 1 o 2A, o solo hazard reproductivo/del desarrollo).
--
-- Equivalencia orientativa 2016 → 2024:
--   grupo_1 → tabla_1  (antineoplásicos con alta evidencia carcinógena)
--   grupo_2 → tabla_1 o tabla_2 según carcinogenicidad IARC/NTP
--   grupo_3 → tabla_2  (solo hazard reproductivo)
-- ============================================================

-- 1. Eliminar constraints antiguos
ALTER TABLE principio_activo
  DROP CONSTRAINT IF EXISTS principio_activo_clasificacion_niosh_check;

ALTER TABLE matriz_riesgo
  DROP CONSTRAINT IF EXISTS matriz_riesgo_clasificacion_niosh_check;

-- 2. Migrar datos ANTES de añadir los nuevos constraints
UPDATE principio_activo
SET clasificacion_niosh = 'tabla_1'
WHERE clasificacion_niosh = 'grupo_1';

UPDATE principio_activo
SET clasificacion_niosh = 'tabla_2'
WHERE clasificacion_niosh IN ('grupo_2', 'grupo_3');

UPDATE matriz_riesgo
SET clasificacion_niosh = 'tabla_1'
WHERE clasificacion_niosh = 'grupo_1';

UPDATE matriz_riesgo
SET clasificacion_niosh = 'tabla_2'
WHERE clasificacion_niosh IN ('grupo_2', 'grupo_3');

-- 3. Añadir los nuevos CHECK constraints con nomenclatura NIOSH 2024
ALTER TABLE principio_activo
  ADD CONSTRAINT principio_activo_clasificacion_niosh_check
  CHECK (clasificacion_niosh IN ('tabla_1', 'tabla_2'));

ALTER TABLE matriz_riesgo
  ADD CONSTRAINT matriz_riesgo_clasificacion_niosh_check
  CHECK (clasificacion_niosh IN ('tabla_1', 'tabla_2'));
