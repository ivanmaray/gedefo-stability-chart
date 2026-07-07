// Normaliza texto de CIMA al formato de la casa.
//
// CIMA devuelve nombre comercial y excipientes en MAYÚSCULAS y SIN acentos
// (la forma farmacéutica sí trae acentos). Este módulo pasa a minúsculas con
// acentos, dejando el vocabulario farmacéutico en minúscula y —opcionalmente—
// los nombres propios (marca, fármaco) con inicial en mayúscula.
//
// Los acentos no se pueden inferir solos ("SOLUCION" no sabe que va "solución"),
// por eso el diccionario ACENTOS cubre el vocabulario farmacéutico habitual.

const ACENTOS: Record<string, string> = {
  // formas / presentación
  solucion: 'solución', soluciones: 'soluciones', perfusion: 'perfusión', perfusiones: 'perfusiones',
  inyeccion: 'inyección', inyectable: 'inyectable', inyectables: 'inyectables',
  suspension: 'suspensión', emulsion: 'emulsión', dispersion: 'dispersión',
  capsula: 'cápsula', capsulas: 'cápsulas', comprimido: 'comprimido', comprimidos: 'comprimidos',
  liofilizado: 'liofilizado', concentrado: 'concentrado', disolvente: 'disolvente', polvo: 'polvo',
  granulado: 'granulado', pelicula: 'película', recubierto: 'recubierto', jeringa: 'jeringa',
  precargada: 'precargada', vial: 'vial', viales: 'viales',
  // excipientes / química
  hidroxido: 'hidróxido', sodico: 'sódico', sodica: 'sódica', potasico: 'potásico', potasica: 'potásica',
  acido: 'ácido', clorhidrico: 'clorhídrico', fosforico: 'fosfórico', citrico: 'cítrico', lactico: 'láctico',
  fosfato: 'fosfato', edetato: 'edetato', trometamol: 'trometamol', manitol: 'manitol', sacarosa: 'sacarosa',
  glucosa: 'glucosa', lactosa: 'lactosa', polisorbato: 'polisorbato', macrogol: 'macrogol',
  preparaciones: 'preparaciones', anhidro: 'anhidro', anhidra: 'anhidra',
  dihidrato: 'dihidrato', monohidrato: 'monohidrato', nitrogeno: 'nitrógeno', administracion: 'administración',
}

// Acrónimos / vías que se mantienen tal cual.
const MANTENER = new Set(['EFG', 'IV', 'SC', 'IM', 'UI', 'CAR-T', 'ADN', 'ARN', 'BCG'])
const PREPOSICIONES = new Set(['de', 'del', 'la', 'el', 'los', 'las', 'y', 'con', 'en', 'para', 'a', 'e', 'o', 'u'])

function esCodigo(t: string): boolean {
  return /\d/.test(t) || t.includes('/')
}
function fixUnidad(t: string): string {
  return t.replace(/\bml\b/g, 'mL').replace(/\bmg\/ml\b/gi, 'mg/mL').replace(/\bui\b/gi, 'UI')
}

export function formatearTextoCima(
  raw: string | null | undefined,
  opts: { nombresPropios?: boolean } = {},
): string | null {
  if (!raw) return raw ?? null
  const tokens = raw.trim().split(/\s+/)
  const out = tokens.map((tok) => {
    if (MANTENER.has(tok.toUpperCase())) return tok.toUpperCase()
    if (esCodigo(tok)) return fixUnidad(tok.toLowerCase())
    const lower = tok.toLowerCase()
    if (ACENTOS[lower]) return ACENTOS[lower] // vocabulario farmacéutico → minúscula + acento
    if (opts.nombresPropios && !PREPOSICIONES.has(lower)) {
      return lower.charAt(0).toUpperCase() + lower.slice(1)
    }
    return lower
  })
  const s = out.join(' ').replace(/\(e([-\s]?\d)/gi, '(E$1') // (e 524) → (E 524)
  return s.charAt(0).toUpperCase() + s.slice(1)
}
