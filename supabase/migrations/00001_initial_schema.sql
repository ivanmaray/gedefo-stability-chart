-- ============================================================
-- 00001_initial_schema.sql
-- Esquema completo gedefo-stability-chart
-- ============================================================

-- Extensión para UUIDs
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- FUNCIÓN GENÉRICA updated_at
-- ============================================================
CREATE OR REPLACE FUNCTION trigger_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================================
-- TABLA: referencia
-- (Se crea antes porque otras tablas la referencian)
-- ============================================================
CREATE TABLE referencia (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tipo_fuente       text NOT NULL CHECK (tipo_fuente IN ('ficha_tecnica','stabilis','trissel','micromedex','bc_cancer','pubmed','consenso_grupo')),
  autores           text,
  titulo            text NOT NULL,
  revista           text,
  anio              integer,
  doi               text,
  url               text,
  fecha_consulta    date,
  notas             text,
  created_at        timestamptz NOT NULL DEFAULT now(),
  updated_at        timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER set_updated_at_referencia
  BEFORE UPDATE ON referencia
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

-- ============================================================
-- TABLA: principio_activo
-- ============================================================
CREATE TABLE principio_activo (
  id                          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  dci                         text NOT NULL UNIQUE,
  atc_code                    text,
  familia_farmacologica       text,
  sinonimos                   text[],
  consideraciones_pediatricas text,
  consideraciones_neonatales  text,
  clasificacion_niosh         text CHECK (clasificacion_niosh IN ('grupo_1','grupo_2','grupo_3')),
  notas_seguridad             text,
  created_at                  timestamptz NOT NULL DEFAULT now(),
  updated_at                  timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER set_updated_at_principio_activo
  BEFORE UPDATE ON principio_activo
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

-- ============================================================
-- TABLA: presentacion_comercial
-- ============================================================
CREATE TABLE presentacion_comercial (
  id                              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  principio_activo_id             uuid NOT NULL REFERENCES principio_activo(id) ON DELETE CASCADE,
  codigo_nacional                 text UNIQUE,
  nombre_comercial                text NOT NULL,
  laboratorio_titular             text,
  forma_farmaceutica              text,
  concentracion_valor             numeric,
  concentracion_unidad            text,
  volumen_envase_ml               numeric,
  excipientes                     jsonb,
  con_conservantes                boolean,
  conservantes_detalle            text,
  densidad                        numeric,
  osmolaridad_mosm_l              numeric,
  ph_minimo                       numeric,
  ph_maximo                       numeric,
  temperatura_conservacion        text CHECK (temperatura_conservacion IN ('nevera','ambiente','congelar')),
  proteccion_luz_almacenamiento   boolean NOT NULL DEFAULT false,
  estabilidad_fuera_nevera_horas  numeric,
  estado_comercializacion         text,
  ficha_tecnica_url               text,
  cima_datos_raw                  jsonb,
  cima_last_sync                  timestamptz,
  created_at                      timestamptz NOT NULL DEFAULT now(),
  updated_at                      timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER set_updated_at_presentacion_comercial
  BEFORE UPDATE ON presentacion_comercial
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

-- ============================================================
-- TABLA: condicion_preparacion
-- ============================================================
CREATE TABLE condicion_preparacion (
  id                            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  principio_activo_id           uuid NOT NULL REFERENCES principio_activo(id) ON DELETE CASCADE,
  presentacion_comercial_id     uuid REFERENCES presentacion_comercial(id) ON DELETE SET NULL,
  tipo                          text NOT NULL CHECK (tipo IN ('reconstitucion','dilucion')),
  diluyente                     text NOT NULL,
  volumen_ml_minimo             numeric,
  volumen_ml_maximo             numeric,
  concentracion_final_minima    numeric,
  concentracion_final_maxima    numeric,
  volumen_bolsa_recomendado_ml  text,
  overfill_notas                text,
  envase_compatible             text[],
  filtro_requerido              text,
  filtro_prohibido              boolean NOT NULL DEFAULT false,
  proteccion_luz                boolean NOT NULL DEFAULT false,
  notas                         text,
  created_at                    timestamptz NOT NULL DEFAULT now(),
  updated_at                    timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER set_updated_at_condicion_preparacion
  BEFORE UPDATE ON condicion_preparacion
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

-- ============================================================
-- TABLA: estabilidad
-- ============================================================
CREATE TABLE estabilidad (
  id                        uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  principio_activo_id       uuid NOT NULL REFERENCES principio_activo(id) ON DELETE CASCADE,
  presentacion_comercial_id uuid REFERENCES presentacion_comercial(id) ON DELETE SET NULL,
  diluyente                 text,
  concentracion_mg_ml       numeric,
  envase                    text,
  temperatura_celsius       numeric,
  proteccion_luz            boolean,
  tipo_estabilidad          text CHECK (tipo_estabilidad IN ('fisicoquimica','microbiologica')),
  tiempo_horas              numeric NOT NULL,
  notas_cualitativas        text,
  nivel_evidencia           text,
  referencia_id             uuid REFERENCES referencia(id) ON DELETE SET NULL,
  created_at                timestamptz NOT NULL DEFAULT now(),
  updated_at                timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER set_updated_at_estabilidad
  BEFORE UPDATE ON estabilidad
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

-- ============================================================
-- TABLA: compatibilidad_material
-- ============================================================
CREATE TABLE compatibilidad_material (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  principio_activo_id uuid NOT NULL REFERENCES principio_activo(id) ON DELETE CASCADE,
  material            text NOT NULL,
  resultado           text NOT NULL CHECK (resultado IN ('compatible','incompatible','condicional')),
  condiciones         text,
  referencia_id       uuid REFERENCES referencia(id) ON DELETE SET NULL,
  created_at          timestamptz NOT NULL DEFAULT now(),
  updated_at          timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER set_updated_at_compatibilidad_material
  BEFORE UPDATE ON compatibilidad_material
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

-- ============================================================
-- TABLA: compatibilidad_y
-- ============================================================
CREATE TABLE compatibilidad_y (
  id                       uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  principio_activo_a_id    uuid NOT NULL REFERENCES principio_activo(id) ON DELETE CASCADE,
  principio_activo_b_id    uuid NOT NULL REFERENCES principio_activo(id) ON DELETE CASCADE,
  diluyente                text,
  concentracion_a_mg_ml    numeric,
  concentracion_b_mg_ml    numeric,
  resultado                text NOT NULL CHECK (resultado IN ('compatible','incompatible','condicional')),
  condiciones              text,
  referencia_id            uuid REFERENCES referencia(id) ON DELETE SET NULL,
  created_at               timestamptz NOT NULL DEFAULT now(),
  updated_at               timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER set_updated_at_compatibilidad_y
  BEFORE UPDATE ON compatibilidad_y
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

-- ============================================================
-- TABLA: matriz_riesgo
-- ============================================================
CREATE TABLE matriz_riesgo (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  principio_activo_id uuid NOT NULL UNIQUE REFERENCES principio_activo(id) ON DELETE CASCADE,
  clasificacion_niosh text CHECK (clasificacion_niosh IN ('grupo_1','grupo_2','grupo_3')),
  nivel_contencion    text,
  epi_requerido       text[],
  tipo_cabina         text,
  requisitos_sala     text,
  gestion_residuos    text,
  notas               text,
  created_at          timestamptz NOT NULL DEFAULT now(),
  updated_at          timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER set_updated_at_matriz_riesgo
  BEFORE UPDATE ON matriz_riesgo
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

-- ============================================================
-- TABLA: administracion
-- ============================================================
CREATE TABLE administracion (
  id                          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  principio_activo_id         uuid NOT NULL REFERENCES principio_activo(id) ON DELETE CASCADE,
  via                         text NOT NULL,
  velocidad_maxima_ml_h       numeric,
  tiempo_minimo_infusion_min  numeric,
  dosis_maxima_administracion numeric,
  dosis_maxima_unidad         text,
  concentracion_maxima_mg_ml  numeric,
  concentracion_minima_mg_ml  numeric,
  clasificacion_tisular       text CHECK (clasificacion_tisular IN ('vesicante','irritante','neutro')),
  procedimiento_extravasacion text,
  notas                       text,
  referencia_id               uuid REFERENCES referencia(id) ON DELETE SET NULL,
  created_at                  timestamptz NOT NULL DEFAULT now(),
  updated_at                  timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER set_updated_at_administracion
  BEFORE UPDATE ON administracion
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

-- ============================================================
-- TABLA: gobernanza
-- ============================================================
CREATE TABLE gobernanza (
  id                      uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tabla_origen            text NOT NULL,
  registro_id             uuid NOT NULL,
  estado                  text NOT NULL DEFAULT 'borrador' CHECK (estado IN ('borrador','en_revision','validado','obsoleto')),
  autor                   text,
  revisor_1               text,
  revisor_2               text,
  coordinador_validador   text,
  fecha_validacion        timestamptz,
  fecha_proxima_revision  timestamptz,
  version                 integer NOT NULL DEFAULT 1,
  historial_cambios       jsonb,
  created_at              timestamptz NOT NULL DEFAULT now(),
  updated_at              timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER set_updated_at_gobernanza
  BEFORE UPDATE ON gobernanza
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

-- ============================================================
-- TABLA: cima_sync_log
-- ============================================================
CREATE TABLE cima_sync_log (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  codigo_nacional text NOT NULL,
  tipo_evento     text NOT NULL CHECK (tipo_evento IN ('sync_ok','cambio_detectado','error','nueva_presentacion')),
  detalle         jsonb,
  created_at      timestamptz NOT NULL DEFAULT now()
);

-- ============================================================
-- ÍNDICES
-- ============================================================
CREATE INDEX idx_presentacion_principio      ON presentacion_comercial(principio_activo_id);
CREATE INDEX idx_presentacion_cn             ON presentacion_comercial(codigo_nacional);
CREATE INDEX idx_estabilidad_principio       ON estabilidad(principio_activo_id);
CREATE INDEX idx_estabilidad_presentacion    ON estabilidad(presentacion_comercial_id);
CREATE INDEX idx_condicion_principio         ON condicion_preparacion(principio_activo_id);
CREATE INDEX idx_administracion_principio    ON administracion(principio_activo_id);
CREATE INDEX idx_compatibilidad_mat_principio ON compatibilidad_material(principio_activo_id);
CREATE INDEX idx_compatibilidad_y_a          ON compatibilidad_y(principio_activo_a_id);
CREATE INDEX idx_compatibilidad_y_b          ON compatibilidad_y(principio_activo_b_id);
CREATE INDEX idx_gobernanza_registro         ON gobernanza(tabla_origen, registro_id);
CREATE INDEX idx_cima_sync_cn                ON cima_sync_log(codigo_nacional);

-- ============================================================
-- ROW LEVEL SECURITY — desactivado (fase 0)
-- ============================================================
ALTER TABLE principio_activo         DISABLE ROW LEVEL SECURITY;
ALTER TABLE presentacion_comercial   DISABLE ROW LEVEL SECURITY;
ALTER TABLE condicion_preparacion    DISABLE ROW LEVEL SECURITY;
ALTER TABLE estabilidad              DISABLE ROW LEVEL SECURITY;
ALTER TABLE compatibilidad_material  DISABLE ROW LEVEL SECURITY;
ALTER TABLE compatibilidad_y         DISABLE ROW LEVEL SECURITY;
ALTER TABLE matriz_riesgo            DISABLE ROW LEVEL SECURITY;
ALTER TABLE administracion           DISABLE ROW LEVEL SECURITY;
ALTER TABLE referencia               DISABLE ROW LEVEL SECURITY;
ALTER TABLE gobernanza               DISABLE ROW LEVEL SECURITY;
ALTER TABLE cima_sync_log            DISABLE ROW LEVEL SECURITY;
