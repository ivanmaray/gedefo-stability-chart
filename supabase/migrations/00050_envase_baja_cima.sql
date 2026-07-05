-- ============================================================================
-- 00050_envase_baja_cima.sql
--
-- Detección de BAJAS: envases (CN) que siguen en la base de datos pero que CIMA
-- ya no comercializa (retirada, revocación o no comercializado). El barrido las
-- marca como `baja_pendiente` para que 1 persona confirme la retirada.
--
-- Se marca sobre el propio envase (no una tabla nueva) para no chocar con el
-- codigo_nacional único de cima_novedad (un CN ya incorporado tiene su fila).
-- "Retirar" = comercializado = false (baja blanda, conserva histórico).
-- ============================================================================

ALTER TABLE envase
  ADD COLUMN IF NOT EXISTS baja_pendiente     boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS baja_motivo        text,   -- 'retirada_cima' | 'revocada' | 'no_comercializada'
  ADD COLUMN IF NOT EXISTS baja_detectada_en  timestamptz;

CREATE INDEX IF NOT EXISTS idx_envase_baja_pendiente ON envase(baja_pendiente) WHERE baja_pendiente;

-- Nuevo evento de auditoría para el barrido de bajas.
ALTER TABLE cima_sync_log DROP CONSTRAINT IF EXISTS cima_sync_log_tipo_evento_check;
ALTER TABLE cima_sync_log ADD CONSTRAINT cima_sync_log_tipo_evento_check
  CHECK (tipo_evento IN (
    'sync_ok',
    'cambio_detectado',
    'error',
    'nueva_presentacion',
    'novedad_detectada',
    'barrido_ok',
    'baja_detectada'
  ));
