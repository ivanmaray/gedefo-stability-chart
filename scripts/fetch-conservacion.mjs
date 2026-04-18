#!/usr/bin/env node
/**
 * Fetches section 6.4 of the Ficha Técnica from CIMA for all presentations
 * and generates a SQL migration to populate temperatura_conservacion and
 * proteccion_luz_almacenamiento.
 *
 * Usage: node scripts/fetch-conservacion.mjs
 */

import { readFileSync, writeFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const MIGRATIONS_DIR = join(ROOT, 'supabase', 'migrations')

// Rate limiting
const CONCURRENCY = 5
const DELAY_MS = 200

// ── Extract presentations from migration SQL ─────────────────────────
function extractPresentations() {
  const files = [
    '00002_seed_examples.sql',
    '00042_presentaciones_atcL01.sql',
  ]

  const presentations = []
  const idRegex = /VALUES\s*\('([0-9a-f-]+)'/
  const nregistroRegex = /,\s*'(\d{4,}(?:IP\d*)?)',\s*now\(\)/
  const ftUrlRegex = /'(https:\/\/cima\.aemps\.es\/cima\/pdfs\/ft\/[^']+)'/

  for (const file of files) {
    const path = join(MIGRATIONS_DIR, file)
    let content
    try {
      content = readFileSync(path, 'utf8')
    } catch {
      continue
    }

    for (const line of content.split('\n')) {
      if (!line.startsWith('INSERT INTO presentacion_comercial')) continue

      const idMatch = line.match(idRegex)
      const nrMatch = line.match(nregistroRegex)
      const ftMatch = line.match(ftUrlRegex)

      if (idMatch && nrMatch) {
        presentations.push({
          id: idMatch[1],
          nregistro: nrMatch[1],
          ftUrl: ftMatch ? ftMatch[1] : null,
        })
      }
    }
  }

  // Also check the old-style seed (migration 00002 uses different INSERT format)
  const seed = readFileSync(join(MIGRATIONS_DIR, '00002_seed_examples.sql'), 'utf8')
  const cimaIdRegex = /presentacion_comercial.*?VALUES[\s\S]*?\('(c1[0-9a-f-]+)'[\s\S]*?'(\d+)'/g
  // Already captured above from line-by-line

  return presentations
}

// ── Parse FT section 6.4 ────────────────────────────────────────────
function parseFT64(html) {
  // Extract between "6.4" and "6.5"
  const m = html.match(/6\.4[\s\S]*?conservaci[oó]n([\s\S]*?)(?=6\.5\b)/i)
    ?? html.match(/6\.4([\s\S]*?)6\.5/i)
  if (!m) return { temperatura: null, luz: null }

  const section = m[1].replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').toLowerCase()

  // Temperature — same logic as the proven parseFT64 in sync-cima edge function
  // Priority: 1) nevera  2) congelar (only frozen products)  3) ambiente
  let temperatura = null

  // Nevera: "Conservar en nevera" or "entre 2°C y 8°C"
  if (/nevera|entre\s*2.*8\s*[°ºo]c|2\s*[°ºo]c\s*[–y\-]\s*8\s*[°ºo]c/i.test(section)) {
    temperatura = 'nevera'
  }
  // Congelar: only for truly frozen products (CAR-T etc.)
  // Must say "congelar" without preceding "no" — using word boundary check
  else if (/(?:almacenar|conservar|mantener)\s+(en\s+)?congel|por debajo de\s*-\s*[2-9]\d\s*[°ºo]c/i.test(section) && !/no\s+congel/i.test(section)) {
    temperatura = 'congelar'
  }
  // Ambiente: "no refrigerar", "no conservar a T > 25°C", "no requiere condiciones especiales"
  else if (/no\s+refriger|no conservar.*temperatura superior a (25|30)|temperatura inferior a (25|30)|no requiere condiciones especiales|conservar.*por debajo de (25|30)/i.test(section)) {
    temperatura = 'ambiente'
  }

  // Light
  const luz = /luz|embalaje exterior|envase original|proteg/i.test(section) ? true : false

  return { temperatura, luz }
}

// ── Fetch with rate limiting ────────────────────────────────────────
async function fetchFTHtml(nregistro, ftUrl) {
  // Convert PDF URL to HTML URL
  let url
  if (ftUrl) {
    url = ftUrl.replace('/pdfs/ft/', '/dochtml/ft/').replace('.pdf', '.html')
  } else {
    url = `https://cima.aemps.es/cima/dochtml/ft/${nregistro}/FT_${nregistro}.html`
  }

  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'gedefo-stability-chart/1.0' },
      signal: AbortSignal.timeout(15000),
    })
    if (!res.ok) return null
    return await res.text()
  } catch {
    return null
  }
}

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms))
}

async function processBatch(batch) {
  return Promise.all(batch.map(async (p) => {
    const html = await fetchFTHtml(p.nregistro, p.ftUrl)
    if (!html) return { ...p, temperatura: null, luz: null }
    const result = parseFT64(html)
    return { ...p, ...result }
  }))
}

// ── Main ─────────────────────────────────────────────────────────────
async function main() {
  const presentations = extractPresentations()
  console.log(`Found ${presentations.length} presentations`)

  // Deduplicate by FT URL base (remove IP suffix)
  // Group presentations that share the same base FT
  const ftCache = new Map() // ftKey -> { temperatura, luz }

  const results = []
  let processed = 0

  for (let i = 0; i < presentations.length; i += CONCURRENCY) {
    const batch = presentations.slice(i, i + CONCURRENCY)

    const batchResults = await Promise.all(batch.map(async (p) => {
      // Check cache - same base nregistro shares the same FT
      const baseNr = p.nregistro.replace(/IP\d*$/, '')
      if (ftCache.has(baseNr)) {
        const cached = ftCache.get(baseNr)
        return { ...p, ...cached }
      }

      const html = await fetchFTHtml(p.nregistro, p.ftUrl)
      if (!html) {
        ftCache.set(baseNr, { temperatura: null, luz: null })
        return { ...p, temperatura: null, luz: null }
      }
      const result = parseFT64(html)
      ftCache.set(baseNr, result)
      return { ...p, ...result }
    }))

    results.push(...batchResults)
    processed += batch.length
    process.stdout.write(`\r  ${processed}/${presentations.length} processed, cache: ${ftCache.size} FTs`)
    await sleep(DELAY_MS)
  }

  console.log('\n')

  // Stats
  const withTemp = results.filter(r => r.temperatura !== null)
  const withLuz = results.filter(r => r.luz === true)
  const nevera = results.filter(r => r.temperatura === 'nevera')
  const ambiente = results.filter(r => r.temperatura === 'ambiente')
  const congelar = results.filter(r => r.temperatura === 'congelar')

  console.log(`Results:`)
  console.log(`  - temperatura detected: ${withTemp.length}`)
  console.log(`    nevera: ${nevera.length}, ambiente: ${ambiente.length}, congelar: ${congelar.length}`)
  console.log(`  - proteccion_luz: ${withLuz.length}`)
  console.log(`  - no data: ${results.length - withTemp.length}`)

  // Generate SQL migration
  const lines = [
    '-- 00048_conservacion_ft64.sql — Conservación desde sección 6.4 de FTs CIMA',
    '-- Generado automáticamente via scripts/fetch-conservacion.mjs',
    '',
  ]

  for (const r of results) {
    if (r.temperatura === null && r.luz === null) continue
    const parts = []
    if (r.temperatura !== null) {
      parts.push(`temperatura_conservacion = '${r.temperatura}'`)
    }
    if (r.luz !== null) {
      parts.push(`proteccion_luz_almacenamiento = ${r.luz}`)
    }
    lines.push(`UPDATE presentacion_comercial SET ${parts.join(', ')} WHERE id = '${r.id}';`)
  }

  const migrationPath = join(MIGRATIONS_DIR, '00048_conservacion_ft64.sql')
  writeFileSync(migrationPath, lines.join('\n') + '\n')
  console.log(`\nMigration written to: ${migrationPath}`)
  console.log(`  ${lines.filter(l => l.startsWith('UPDATE')).length} UPDATE statements`)
}

main().catch(console.error)
