# Despliegue de GEDEFO-Chart en el servidor de la SEFH

Runbook para publicar la app (ya migrada a PostgreSQL directo) en el servidor
de la SEFH gestionado por ESM (Plesk Obsidian, Ubuntu 24.04).

> Rama de despliegue: **`gedefochartsefh`**. `main` se mantiene como la versión
> viva en Vercel+Supabase hasta el cambio final.

## Estado (lo que ya está hecho)

- **Servidor:** `82.223.77.45` · Ubuntu 24.04 · Plesk Obsidian 18 · Node 24/26 (vía Plesk).
- **PostgreSQL 16** instalado y activo. BD `gedefo_chart` + rol `gedefo` creados.
  Cadena de conexión guardada en `~/gedefo_db_url.txt` (solo lectura del usuario).
- **Datos migrados** desde Supabase y verificados (14 tablas cuadran).
- **App migrada** a `pg` (modo `output: 'standalone'`), build OK, probada en local.

## Variables de entorno (en el servidor)

La app solo necesita una variable:

```
DATABASE_URL=postgresql://gedefo:<password>@localhost:5432/gedefo_chart
```

El valor exacto está en `~/gedefo_db_url.txt`. Se configura en **Plesk → Node.js →
Variables de entorno** (o en un `.env` en la carpeta de la app). Añadir también
`NODE_ENV=production`.

## Build y arranque

El proyecto usa **Next.js standalone**. Tras `npm run build` se genera
`.next/standalone/server.js`, autocontenido. **Ojo:** standalone NO copia los
estáticos; hay que copiarlos tras cada build:

```bash
npm ci
npm run build
cp -r .next/static .next/standalone/.next/static
cp -r public       .next/standalone/public
# arranque:
PORT=3000 DATABASE_URL=... node .next/standalone/server.js
```

## Opción A — Node gestionado por Plesk (Passenger)

1. Crear el subdominio (p. ej. `gedefo-stability-chart.sefh.es`) + certificado SSL
   desde Plesk.
2. **Git** (Plesk → Git): clonar `https://github.com/ivanmaray/gedefo-stability-chart.git`,
   rama `gedefochartsefh`, con acción de despliegue:
   `npm ci && npm run build && cp -r .next/static .next/standalone/.next/static && cp -r public .next/standalone/public`
3. **Node.js** (Plesk → Node.js): Application Startup File = `.next/standalone/server.js`,
   versión de Node 20+ (24 vale), variables de entorno con `DATABASE_URL` y `NODE_ENV`.
4. Plesk (nginx/Passenger) proxya el subdominio al proceso Node.

## Opción B — Proceso propio + proxy (si Passenger da guerra)

1. Correr el standalone como servicio `systemd` escuchando en `127.0.0.1:3000`.
2. En Plesk, configurar el subdominio como **proxy inverso** a `http://127.0.0.1:3000`.
3. Actualizaciones: `git pull` + build + copiar estáticos + `systemctl restart`.

(Decidiremos A o B con ESM según lo que prefieran; ambos funcionan.)

## Sincronización con CIMA (sustituye a la Edge Function)

Antes la hacía una función de Supabase por cron. Ahora es un endpoint Node
(`/api/actualizar`). Programar en **Plesk → Tareas programadas** (semanal):

```bash
curl -s -X POST https://<subdominio>/api/actualizar -H 'Content-Type: application/json' -d '{}'
```

(El barrido de altas `/api/barrido` se seguirá lanzando a mano desde la pestaña
Novedades, como hasta ahora.)

## Copias de seguridad

Volcado diario de la BD (cron):

```bash
pg_dump "$(cat ~/gedefo_db_url.txt)" --no-owner --no-privileges -f ~/backups/gedefo_chart_$(date +%F).sql
```

## Checklist del cambio final (cutover)

- [ ] App desplegada y accesible en el subdominio con SSL.
- [ ] `DATABASE_URL` apuntando al Postgres local del servidor.
- [ ] **Re-sincronizar** los datos de última hora desde Supabase (volcado fresco →
      restaurar), porque la app de Vercel habrá seguido recibiendo cambios.
- [ ] Cron de `/api/actualizar` activo.
- [ ] Copias de seguridad programadas.
- [ ] Borrar del servidor `~/supabase_url.txt` y **resetear la contraseña de
      Supabase** (estuvo en correo/chat).
- [ ] Comunicar la nueva URL; apagar/retirar el despliegue de Vercel cuando proceda.
