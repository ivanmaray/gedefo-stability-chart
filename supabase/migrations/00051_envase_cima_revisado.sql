-- ============================================================================
-- 00051_envase_cima_revisado.sql
--
-- Marca de "última revisión contra CIMA" por envase, para que el proceso de
-- ACTUALIZAR EXISTENTES (bajas + problema de suministro) recorra todo el
-- catálogo por lotes: se procesan los envases con cima_revisado_en más antiguo
-- (o null) primero, y se actualiza la marca tras revisarlos. Así cicla por
-- todos en sucesivas ejecuciones en vez de repetir siempre el primer lote.
-- ============================================================================

ALTER TABLE envase
  ADD COLUMN IF NOT EXISTS cima_revisado_en timestamptz;

CREATE INDEX IF NOT EXISTS idx_envase_cima_revisado ON envase(cima_revisado_en NULLS FIRST);
