# CLAUDE.md — gedefo-stability-chart

## Qué es este proyecto

Base de datos estructurada, colaborativa y con API pública que recoge la información técnica necesaria para la **preparación y administración segura** de medicamentos oncohematológicos en farmacia hospitalaria española. Es el equivalente español del BC Cancer Stability Chart, pero relacional, integrado con CIMA (AEMPS) y pensado para alimentar bombas inteligentes y aplicativos de prescripción.

**Regla de oro del alcance:** cubre lo que necesita saber quien prepara y quien administra. No entra en lo que necesita saber quien prescribe (indicaciones, dosis por patología, protocolos).

## Stack

| Capa | Tecnología |
|------|-----------|
| Base de datos | Supabase (Postgres) |
| Backend / API | Supabase REST + Edge Functions (Deno/TypeScript) |
| Frontend | Next.js 14+ (App Router) · TypeScript · Tailwind CSS |
| Despliegue frontend | Vercel |
| Gestión de esquema | Supabase CLI · migraciones versionadas en `supabase/migrations/` |
| Sync con CIMA | Edge Function de Supabase (cron) |

## Estructura del repo

```
gedefo-stability-chart/
├── CLAUDE.md                          # Este archivo — contexto maestro
├── README.md                          # Readme público del proyecto
├── .env.local.example                 # Variables de entorno (plantilla)
├── supabase/
│   ├── config.toml                    # Config de Supabase CLI
│   ├── migrations/
│   │   ├── 00001_initial_schema.sql   # Esquema completo
│   │   └── 00002_seed_examples.sql    # Datos de ejemplo (2-3 fármacos)
│   └── functions/
│       └── sync-cima/
│           └── index.ts               # Edge Function de sincronización con CIMA
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx                   # Home: listado de principios activos
│   │   ├── farmaco/
│   │   │   └── [id]/
│   │   │       └── page.tsx           # Detalle: presentaciones + estabilidades
│   │   └── api/                       # Route handlers auxiliares si hacen falta
│   ├── lib/
│   │   ├── supabase.ts                # Cliente Supabase (server + client)
│   │   └── types.ts                   # Tipos TypeScript generados desde el esquema
│   └── components/
│       ├── DrugList.tsx
│       ├── PresentationCard.tsx
│       └── StabilityTable.tsx
├── tailwind.config.ts
├── tsconfig.json
├── next.config.js
└── package.json
```

## Convenciones

- **Naming SQL:** snake_case para todo (tablas, columnas, funciones). Sin prefijos (`tbl_`, `fn_`).
- **Idioma en la BD:** nombres de columna en español cuando es un campo descriptivo (`nombre_comercial`, `laboratorio_titular`), en inglés solo para campos técnicos estandarizados (`ph`, `atc_code`).
- **DCI como clave semántica:** el principio activo se identifica por su Denominación Común Internacional, no por el nombre comercial. La PK técnica de cada tabla es un UUID autogenerado.
- **Código Nacional como enlace a CIMA:** la tabla `presentacion_comercial` tiene un campo `codigo_nacional` único que es la clave de unión con la API de CIMA.
- **TypeScript estricto:** `strict: true` en tsconfig. No `any`.
- **Componentes:** functional components con hooks. Sin class components.
- **Commits:** mensajes en español, prefijo convencional (`feat:`, `fix:`, `schema:`, `seed:`, `docs:`).

## Esquema de base de datos (completo, a máximos)

Este es el esquema completo que debe existir desde la primera migración. Muchas tablas estarán vacías al principio — eso es intencional. El criterio es "modelo ancho, población acotada": diseñar completo para no tener que migrar después, poblar gradualmente.

### Tabla: principio_activo

| Columna | Tipo | Notas |
|---------|------|-------|
| id | uuid PK default gen_random_uuid() | |
| dci | text NOT NULL UNIQUE | Denominación Común Internacional |
| atc_code | text | Código ATC |
| familia_farmacologica | text | |
| sinonimos | text[] | Array de nombres alternativos |
| consideraciones_pediatricas | text | Texto libre |
| consideraciones_neonatales | text | Texto libre |
| clasificacion_niosh | text | 'grupo_1', 'grupo_2', 'grupo_3', null |
| notas_seguridad | text | |
| created_at | timestamptz default now() | |
| updated_at | timestamptz default now() | |

### Tabla: presentacion_comercial

| Columna | Tipo | Notas |
|---------|------|-------|
| id | uuid PK | |
| principio_activo_id | uuid FK → principio_activo.id NOT NULL | |
| codigo_nacional | text UNIQUE | Clave de unión con CIMA |
| nombre_comercial | text NOT NULL | |
| laboratorio_titular | text | |
| forma_farmaceutica | text | |
| concentracion_valor | numeric | Valor numérico |
| concentracion_unidad | text | mg/mL, mg, UI, etc. |
| volumen_envase_ml | numeric | |
| excipientes | jsonb | Array de {nombre, cantidad, unidad, prohibido_pediatria, prohibido_neonatologia} |
| con_conservantes | boolean | |
| conservantes_detalle | text | |
| densidad | numeric | g/mL del vial reconstituido |
| osmolaridad_mosm_l | numeric | |
| ph_minimo | numeric | |
| ph_maximo | numeric | |
| temperatura_conservacion | text | 'nevera', 'ambiente', 'congelar' |
| proteccion_luz_almacenamiento | boolean default false | |
| estabilidad_fuera_nevera_horas | numeric | Horas a temperatura ambiente tras sacar de nevera |
| estado_comercializacion | text | Sincronizado con CIMA |
| ficha_tecnica_url | text | URL a CIMA |
| cima_datos_raw | jsonb | Respuesta completa de CIMA para auditoría |
| cima_last_sync | timestamptz | |
| created_at | timestamptz default now() | |
| updated_at | timestamptz default now() | |

### Tabla: condicion_preparacion

| Columna | Tipo | Notas |
|---------|------|-------|
| id | uuid PK | |
| principio_activo_id | uuid FK NOT NULL | |
| presentacion_comercial_id | uuid FK | Null = aplica a todas las presentaciones |
| tipo | text NOT NULL | 'reconstitucion' o 'dilucion' |
| diluyente | text NOT NULL | SF 0.9%, SG 5%, API, etc. |
| volumen_ml_minimo | numeric | |
| volumen_ml_maximo | numeric | |
| concentracion_final_minima | numeric | mg/mL |
| concentracion_final_maxima | numeric | mg/mL |
| volumen_bolsa_recomendado_ml | text | Puede ser rango: "100-250" |
| overfill_notas | text | |
| envase_compatible | text[] | {'pvc', 'poliolefina', 'eva', 'vidrio'} |
| filtro_requerido | text | Tipo de membrana, null = no requerido |
| filtro_prohibido | boolean default false | |
| proteccion_luz | boolean default false | |
| notas | text | |
| created_at | timestamptz default now() | |
| updated_at | timestamptz default now() | |

### Tabla: estabilidad

| Columna | Tipo | Notas |
|---------|------|-------|
| id | uuid PK | |
| principio_activo_id | uuid FK NOT NULL | |
| presentacion_comercial_id | uuid FK | Null = genérico |
| diluyente | text | |
| concentracion_mg_ml | numeric | |
| envase | text | pvc, poliolefina, eva, vidrio, jeringa_pp, etc. |
| temperatura_celsius | numeric | |
| proteccion_luz | boolean | |
| tipo_estabilidad | text | 'fisicoquimica', 'microbiologica' |
| tiempo_horas | numeric NOT NULL | |
| notas_cualitativas | text | Cambios de color, precipitación, etc. |
| nivel_evidencia | text | |
| referencia_id | uuid FK → referencia.id | |
| created_at | timestamptz default now() | |
| updated_at | timestamptz default now() | |

### Tabla: compatibilidad_material

| Columna | Tipo | Notas |
|---------|------|-------|
| id | uuid PK | |
| principio_activo_id | uuid FK NOT NULL | |
| material | text NOT NULL | 'pvc_dehp', 'poliuretano', 'silicona', 'polietileno', 'eva', 'filtro_pes', 'filtro_nylon', etc. |
| resultado | text NOT NULL | 'compatible', 'incompatible', 'condicional' |
| condiciones | text | Detalle si resultado = condicional |
| referencia_id | uuid FK → referencia.id | |
| created_at | timestamptz default now() | |
| updated_at | timestamptz default now() | |

### Tabla: compatibilidad_y

Estructura preparada, población en fase 2.

| Columna | Tipo | Notas |
|---------|------|-------|
| id | uuid PK | |
| principio_activo_a_id | uuid FK NOT NULL | |
| principio_activo_b_id | uuid FK NOT NULL | |
| diluyente | text | |
| concentracion_a_mg_ml | numeric | |
| concentracion_b_mg_ml | numeric | |
| resultado | text NOT NULL | 'compatible', 'incompatible', 'condicional' |
| condiciones | text | |
| referencia_id | uuid FK → referencia.id | |
| created_at | timestamptz default now() | |
| updated_at | timestamptz default now() | |

### Tabla: matriz_riesgo

| Columna | Tipo | Notas |
|---------|------|-------|
| id | uuid PK | |
| principio_activo_id | uuid FK NOT NULL UNIQUE | |
| clasificacion_niosh | text | grupo_1, grupo_2, grupo_3 |
| nivel_contencion | text | |
| epi_requerido | text[] | Array: {'guantes_qt', 'bata', 'gafas', 'mascarilla_ffp2', ...} |
| tipo_cabina | text | CSB-II, CACI, etc. |
| requisitos_sala | text | |
| gestion_residuos | text | |
| notas | text | |
| created_at | timestamptz default now() | |
| updated_at | timestamptz default now() | |

### Tabla: administracion

| Columna | Tipo | Notas |
|---------|------|-------|
| id | uuid PK | |
| principio_activo_id | uuid FK NOT NULL | |
| via | text NOT NULL | 'iv', 'sc', 'im', 'intratecal', 'oral', etc. |
| velocidad_maxima_ml_h | numeric | |
| tiempo_minimo_infusion_min | numeric | |
| dosis_maxima_administracion | numeric | Límite duro, independiente de indicación |
| dosis_maxima_unidad | text | mg, mg/m2, mg/kg, UI, AUC, etc. |
| concentracion_maxima_mg_ml | numeric | |
| concentracion_minima_mg_ml | numeric | |
| clasificacion_tisular | text | 'vesicante', 'irritante', 'neutro' |
| procedimiento_extravasacion | text | |
| notas | text | |
| referencia_id | uuid FK → referencia.id | |
| created_at | timestamptz default now() | |
| updated_at | timestamptz default now() | |

### Tabla: referencia

| Columna | Tipo | Notas |
|---------|------|-------|
| id | uuid PK | |
| tipo_fuente | text NOT NULL | 'ficha_tecnica', 'stabilis', 'trissel', 'micromedex', 'bc_cancer', 'pubmed', 'consenso_grupo' |
| autores | text | |
| titulo | text NOT NULL | |
| revista | text | |
| anio | integer | |
| doi | text | |
| url | text | |
| fecha_consulta | date | |
| notas | text | |
| created_at | timestamptz default now() | |
| updated_at | timestamptz default now() | |

### Tabla: gobernanza

Metadatos de validación para cualquier registro. Relación polimórfica via tabla + id.

| Columna | Tipo | Notas |
|---------|------|-------|
| id | uuid PK | |
| tabla_origen | text NOT NULL | Nombre de la tabla (ej: 'estabilidad') |
| registro_id | uuid NOT NULL | PK del registro en la tabla origen |
| estado | text NOT NULL default 'borrador' | 'borrador', 'en_revision', 'validado', 'obsoleto' |
| autor | text | |
| revisor_1 | text | |
| revisor_2 | text | |
| coordinador_validador | text | |
| fecha_validacion | timestamptz | |
| fecha_proxima_revision | timestamptz | |
| version | integer default 1 | |
| historial_cambios | jsonb | Array de {fecha, autor, descripcion} |
| created_at | timestamptz default now() | |
| updated_at | timestamptz default now() | |

### Tabla: cima_sync_log

Auditoría de sincronizaciones con CIMA.

| Columna | Tipo | Notas |
|---------|------|-------|
| id | uuid PK | |
| codigo_nacional | text NOT NULL | |
| tipo_evento | text NOT NULL | 'sync_ok', 'cambio_detectado', 'error', 'nueva_presentacion' |
| detalle | jsonb | Diff de cambios o error |
| created_at | timestamptz default now() | |

### Índices importantes

```sql
CREATE INDEX idx_presentacion_principio ON presentacion_comercial(principio_activo_id);
CREATE INDEX idx_presentacion_cn ON presentacion_comercial(codigo_nacional);
CREATE INDEX idx_estabilidad_principio ON estabilidad(principio_activo_id);
CREATE INDEX idx_estabilidad_presentacion ON estabilidad(presentacion_comercial_id);
CREATE INDEX idx_condicion_principio ON condicion_preparacion(principio_activo_id);
CREATE INDEX idx_administracion_principio ON administracion(principio_activo_id);
CREATE INDEX idx_compatibilidad_mat_principio ON compatibilidad_material(principio_activo_id);
CREATE INDEX idx_compatibilidad_y_a ON compatibilidad_y(principio_activo_a_id);
CREATE INDEX idx_compatibilidad_y_b ON compatibilidad_y(principio_activo_b_id);
CREATE INDEX idx_gobernanza_registro ON gobernanza(tabla_origen, registro_id);
CREATE INDEX idx_cima_sync_cn ON cima_sync_log(codigo_nacional);
```

### Trigger updated_at

Crear trigger genérico que actualice `updated_at` en cada UPDATE, y aplicarlo a todas las tablas que tengan ese campo.

### Row Level Security

De momento **desactivar RLS** en todas las tablas. No hay auth todavía. Se activará en fase posterior cuando haya workflow de edición multiusuario.

## Integración con CIMA (AEMPS)

### Endpoint principal

```
GET https://cima.aemps.es/cima/rest/medicamento?cn={codigo_nacional}
```

Devuelve JSON con: nombre, laboratorio, principios activos, excipientes, forma farmacéutica, dosis, vía de administración, estado de autorización, documentos (ficha técnica, prospecto), fotos.

### Endpoint de búsqueda por principio activo

```
GET https://cima.aemps.es/cima/rest/medicamentos?practiv1={nombre_pa}
```

Útil para descubrir todas las presentaciones de un PA.

### Estrategia de sincronización

1. **Sync inicial (manual o batch):** para cada `codigo_nacional` en la tabla `presentacion_comercial`, consultar CIMA, mapear campos y guardar `cima_datos_raw` completo.
2. **Sync periódico (cron):** Edge Function programada (ej. semanal) que recorre las presentaciones existentes, consulta CIMA, compara con `cima_datos_raw` anterior, y si hay diff:
   - Actualiza los campos mapeados.
   - Registra en `cima_sync_log` con `tipo_evento = 'cambio_detectado'` y el diff.
   - Si el cambio afecta a excipientes o composición, marca las estabilidades asociadas para revisión (actualiza su registro de `gobernanza` si existe).
3. **Rate limiting:** CIMA no documenta límites pero ser conservador: 1 request/segundo, con retry exponencial en caso de 429 o 5xx.

### Mapeo CIMA → presentacion_comercial

| Campo CIMA | Columna BD |
|-----------|-----------|
| nombre | nombre_comercial |
| labtitular | laboratorio_titular |
| cn (nregistro) | codigo_nacional |
| formaFarmaceutica.nombre | forma_farmaceutica |
| dosis | concentracion_valor + concentracion_unidad (parsear) |
| excipientes | excipientes (transformar a jsonb) |
| estado.aut | estado_comercializacion |
| docs[tipo=1].url | ficha_tecnica_url |

## Datos seed de ejemplo

Para la migración `00002_seed_examples.sql`, usar estos 3 fármacos como ejemplo inicial. Son frecuentes, bien documentados y cubren casuísticas distintas:

1. **Cisplatino** — múltiples presentaciones, fotosensible, incompatible con aluminio, vesicante. Estabilidades muy estudiadas.
2. **Ciclofosfamida** — reconstitución + dilución, varias vías, conservación relativamente sencilla.
3. **Doxorrubicina** — vesicante clásica, fotosensible, concentraciones y estabilidades muy dependientes de envase.

Para cada uno, incluir:
- 1 entrada en `principio_activo` con datos reales.
- 2-3 entradas en `presentacion_comercial` con códigos nacionales reales de CIMA.
- 2-3 entradas en `estabilidad` con datos reales de Stabilis o ficha técnica.
- 1 entrada en `administracion`.
- 1 entrada en `condicion_preparacion`.
- 1 entrada en `referencia` (ficha técnica AEMPS).

Los datos deben ser reales, no inventados. Consultar CIMA y fuentes de referencia.

## Fase 0 — Alcance del esqueleto inicial

Lo que hay que construir PRIMERO, y nada más:

1. ✅ Migración SQL con todas las tablas del esquema (00001_initial_schema.sql).
2. ✅ Seed con los 3 fármacos de ejemplo (00002_seed_examples.sql).
3. ✅ Edge Function `sync-cima` que, dado un código nacional, consulta CIMA y upsertea `presentacion_comercial`.
4. ✅ Página Next.js `/` que lista principios activos desde Supabase.
5. ✅ Página Next.js `/farmaco/[id]` que muestra detalle: presentaciones comerciales, condiciones de preparación, estabilidades y administración.
6. ✅ Types de TypeScript generados con `supabase gen types typescript`.

Lo que NO hay que hacer todavía:
- ❌ Auth / login / roles.
- ❌ Workflow de validación / gobernanza activa.
- ❌ UI pulida o diseño visual cuidado.
- ❌ Export CSV/JSON (viene en fase 1).
- ❌ Compatibilidad en Y (fase 2).
- ❌ Adaptadores a bombas / aplicativos (fase 2-3).
- ❌ Búsqueda avanzada.
- ❌ Internacionalización.

## Variables de entorno

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxxx
SUPABASE_SERVICE_ROLE_KEY=eyJxxxx  # Solo para Edge Functions y server-side
```

## Comandos útiles

```bash
# Inicializar Supabase local (opcional, para desarrollo)
supabase init
supabase start

# Aplicar migraciones al proyecto remoto
supabase db push

# Generar tipos TypeScript
supabase gen types typescript --project-id <id> > src/lib/types.ts

# Desplegar Edge Function
supabase functions deploy sync-cima

# Desarrollo Next.js
npm run dev
```

## Notas para Claude Code

- Lee SIEMPRE este archivo antes de empezar cualquier tarea.
- Las migraciones SQL van en `supabase/migrations/` con prefijo numérico incremental.
- No ejecutes SQL directamente contra Supabase. Crea archivos de migración.
- Los datos de seed deben ser REALES (códigos nacionales reales de CIMA, estabilidades de fuentes reales).
- Cuando crees componentes React, usa Tailwind para estilos. Sin CSS modules ni styled-components.
- Los tipos de la BD se importan de `src/lib/types.ts`, que se genera con el CLI.
- En caso de duda sobre el modelo de datos, este archivo es la fuente de verdad.
