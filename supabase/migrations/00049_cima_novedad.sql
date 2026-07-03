-- ============================================================================
-- 00049_cima_novedad.sql
--
-- Cola de revisión de novedades detectadas en CIMA por el barrido de
-- descubrimiento (Edge Function `descubrir-cima`, por defecto ATC L01).
--
-- Principio de diseño: el barrido NO inserta nada en producción. Deja aquí las
-- novedades candidatas (medicamentos y presentaciones nuevas) para su
-- valoración por DOBLE VALIDACIÓN (2 revisores) antes de incorporarlas.
-- Es el "otro apartado" para valorar la inclusión, con trazabilidad completa.
-- ============================================================================

CREATE TABLE cima_novedad (
  id                      uuid PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Clasificación de la novedad
  tipo                    text NOT NULL
                          CHECK (tipo IN ('nuevo_principio_activo','nueva_presentacion')),

  -- Identificación en CIMA
  codigo_nacional         text NOT NULL,             -- CN de la presentación
  nregistro_cima          text,                      -- nº de registro CIMA
  dci                     text,                       -- principio activo (nombre CIMA)
  atc_code                text,                       -- ATC más específico
  nombre_comercial        text,
  laboratorio_titular     text,
  forma_farmaceutica      text,
  comercializado          boolean,                    -- CIMA: comerc
  ficha_tecnica_url       text,
  cima_datos_raw          jsonb,                      -- respuesta CIMA para auditoría

  -- Enlace a lo que ya existe (solo si el PA ya está en la BD)
  principio_activo_id     uuid REFERENCES principio_activo(id) ON DELETE SET NULL,

  -- Flujo de revisión: DOBLE VALIDACIÓN (2 revisores)
  estado                  text NOT NULL DEFAULT 'pendiente'
                          CHECK (estado IN ('pendiente','en_revision','aceptada','rechazada')),
  revisor_1               text,
  revisor_1_decision      text CHECK (revisor_1_decision IN ('incluir','descartar')),
  revisor_1_fecha         timestamptz,
  revisor_1_nota          text,
  revisor_2               text,
  revisor_2_decision      text CHECK (revisor_2_decision IN ('incluir','descartar')),
  revisor_2_fecha         timestamptz,
  revisor_2_nota          text,

  -- Resultado (si se acepta e incorpora a producción)
  presentacion_creada_id  uuid REFERENCES presentacion_comercial(id) ON DELETE SET NULL,

  -- Trazabilidad del barrido
  barrido_atc             text,                       -- ATC que la detectó (p.ej. 'L01')
  detectada_en            timestamptz NOT NULL DEFAULT now(),

  created_at              timestamptz NOT NULL DEFAULT now(),
  updated_at              timestamptz NOT NULL DEFAULT now(),

  -- Una novedad por CN: re-ejecutar el barrido no duplica ni "re-avisa" de lo
  -- ya detectado (ni de lo ya rechazado).
  CONSTRAINT uq_cima_novedad_cn UNIQUE (codigo_nacional)
);

CREATE INDEX idx_cima_novedad_estado   ON cima_novedad(estado);
CREATE INDEX idx_cima_novedad_tipo     ON cima_novedad(tipo);
CREATE INDEX idx_cima_novedad_nreg     ON cima_novedad(nregistro_cima);
CREATE INDEX idx_cima_novedad_pa       ON cima_novedad(principio_activo_id);

CREATE TRIGGER set_updated_at_cima_novedad
  BEFORE UPDATE ON cima_novedad
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

-- Sin auth todavía: RLS desactivado (coherente con el resto del esquema).
ALTER TABLE cima_novedad DISABLE ROW LEVEL SECURITY;

-- ----------------------------------------------------------------------------
-- Ampliar los tipos de evento de auditoría para el barrido de descubrimiento.
-- ----------------------------------------------------------------------------
ALTER TABLE cima_sync_log DROP CONSTRAINT IF EXISTS cima_sync_log_tipo_evento_check;
ALTER TABLE cima_sync_log ADD CONSTRAINT cima_sync_log_tipo_evento_check
  CHECK (tipo_evento IN (
    'sync_ok',
    'cambio_detectado',
    'error',
    'nueva_presentacion',
    'novedad_detectada',   -- el barrido encoló una novedad para revisión
    'barrido_ok'           -- resumen de una ejecución del barrido
  ));
