-- ============================================================
-- 00018_cima_sync_datos_reales.sql
--
-- Actualiza presentacion_comercial con datos reales de la API
-- de CIMA (AEMPS) consultada el 2026-04-16:
--   · laboratorio_titular (nombre oficial CIMA)
--   · ficha_tecnica_url
--   · excipientes (jsonb)
--   · con_conservantes / conservantes_detalle
--   · cima_last_sync
--
-- IDs de presentacion_comercial → nregistro:
--   c1000000-...0001 → 72609  Cisplatino Accord
--   c1000000-...0011 → 62107  Cisplatino Pharmacia
--   c1000000-...0013 → 86466  Cisplatino Hikma
--   c1000000-...0003 → 33411  Genoxal 200 mg (Baxter)
--   c1000000-...0004 → 48972  Genoxal 1000 mg (Baxter)
--   c1000000-...0020 → 86548  Ciclofosfamida Dr. Reddys
--   c1000000-...0023 → 90200  Ciclofosfamida Seacross 500 mg
--   c1000000-...0005 → 73266  Doxorubicina Accord
--   c1000000-...0032 → 59739  Farmiblastina 2 mg/mL
--   c1000000-...0033 → 56172  Farmiblastina 50 mg polvo
--   c1000000-...0034 → 75345  Doxorubicina Aurovitas
-- ============================================================

-- ──────────────────────────────────────────────────────────────
-- CISPLATINO ACCORD  (nreg 72609)
-- ──────────────────────────────────────────────────────────────
UPDATE presentacion_comercial SET
  laboratorio_titular  = 'Accord Healthcare S.L.U.',
  ficha_tecnica_url    = 'https://cima.aemps.es/cima/pdfs/ft/72609/FT_72609.pdf',
  excipientes          = '[
    {"nombre": "Cloruro de sodio",      "cantidad": "0,90", "unidad": "mg", "prohibido_pediatria": false, "prohibido_neonatologia": false},
    {"nombre": "Hidróxido de sodio",    "cantidad": "c.s.", "unidad": "-",  "prohibido_pediatria": false, "prohibido_neonatologia": false}
  ]'::jsonb,
  con_conservantes     = false,
  cima_last_sync       = '2026-04-16T00:00:00Z'
WHERE id = 'c1000000-0000-0000-0000-000000000001';

-- ──────────────────────────────────────────────────────────────
-- CISPLATINO PHARMACIA  (nreg 62107)
-- ──────────────────────────────────────────────────────────────
UPDATE presentacion_comercial SET
  laboratorio_titular  = 'Pharmacia Nostrum S.A.',
  ficha_tecnica_url    = 'https://cima.aemps.es/cima/pdfs/ft/62107/FT_62107.pdf',
  excipientes          = '[
    {"nombre": "Hidróxido de sodio",  "cantidad": "c.s.", "unidad": "-",  "prohibido_pediatria": false, "prohibido_neonatologia": false},
    {"nombre": "Cloruro de sodio",    "cantidad": "9",    "unidad": "mg", "prohibido_pediatria": false, "prohibido_neonatologia": false},
    {"nombre": "Manitol (E-421)",     "cantidad": "1",    "unidad": "mg", "prohibido_pediatria": false, "prohibido_neonatologia": false}
  ]'::jsonb,
  con_conservantes     = false,
  cima_last_sync       = '2026-04-16T00:00:00Z'
WHERE id = 'c1000000-0000-0000-0000-000000000011';

-- ──────────────────────────────────────────────────────────────
-- CISPLATINO HIKMA  (nreg 86466)  — psum activo
-- ──────────────────────────────────────────────────────────────
UPDATE presentacion_comercial SET
  laboratorio_titular  = 'Hikma Farmaceutica (Portugal) S.A.',
  ficha_tecnica_url    = 'https://cima.aemps.es/cima/pdfs/ft/86466/FT_86466.pdf',
  excipientes          = '[
    {"nombre": "Cloruro de sodio",    "cantidad": "9",    "unidad": "mg/ml", "prohibido_pediatria": false, "prohibido_neonatologia": false},
    {"nombre": "Hidróxido de sodio",  "cantidad": "c.s.", "unidad": "pH",    "prohibido_pediatria": false, "prohibido_neonatologia": false}
  ]'::jsonb,
  con_conservantes     = false,
  cima_last_sync       = '2026-04-16T00:00:00Z'
WHERE id = 'c1000000-0000-0000-0000-000000000013';

-- ──────────────────────────────────────────────────────────────
-- GENOXAL 200 mg  (nreg 33411, Baxter)
-- ──────────────────────────────────────────────────────────────
UPDATE presentacion_comercial SET
  laboratorio_titular  = 'Baxter S.L.',
  ficha_tecnica_url    = 'https://cima.aemps.es/cima/pdfs/ft/33411/FT_33411.pdf',
  con_conservantes     = false,
  cima_last_sync       = '2026-04-16T00:00:00Z'
WHERE id = 'c1000000-0000-0000-0000-000000000003';

-- ──────────────────────────────────────────────────────────────
-- GENOXAL 1000 mg  (nreg 48972, Baxter)
-- ──────────────────────────────────────────────────────────────
UPDATE presentacion_comercial SET
  laboratorio_titular  = 'Baxter S.L.',
  ficha_tecnica_url    = 'https://cima.aemps.es/cima/pdfs/ft/48972/FT_48972.pdf',
  con_conservantes     = false,
  cima_last_sync       = '2026-04-16T00:00:00Z'
WHERE id = 'c1000000-0000-0000-0000-000000000004';

-- ──────────────────────────────────────────────────────────────
-- CICLOFOSFAMIDA DR. REDDYS  (nreg 86548)  — psum activo
-- ──────────────────────────────────────────────────────────────
UPDATE presentacion_comercial SET
  laboratorio_titular  = 'Dr. Reddy''s Laboratories S.A.',
  ficha_tecnica_url    = 'https://cima.aemps.es/cima/pdfs/ft/86548/FT_86548.pdf',
  excipientes          = '[
    {"nombre": "Alcohol etílico anhidro", "cantidad": "480-530", "unidad": "mg", "prohibido_pediatria": false, "prohibido_neonatologia": false}
  ]'::jsonb,
  con_conservantes     = false,
  cima_last_sync       = '2026-04-16T00:00:00Z'
WHERE id = 'c1000000-0000-0000-0000-000000000020';

-- ──────────────────────────────────────────────────────────────
-- CICLOFOSFAMIDA SEACROSS 500 mg  (nreg 90200)
-- ──────────────────────────────────────────────────────────────
UPDATE presentacion_comercial SET
  laboratorio_titular  = 'Seacross Pharma (Europe) Limited',
  ficha_tecnica_url    = 'https://cima.aemps.es/cima/pdfs/ft/90200/FT_90200.pdf',
  con_conservantes     = false,
  cima_last_sync       = '2026-04-16T00:00:00Z'
WHERE id = 'c1000000-0000-0000-0000-000000000023';

-- ──────────────────────────────────────────────────────────────
-- DOXORUBICINA ACCORD  (nreg 73266)  — psum parcial (50 mL)
-- ──────────────────────────────────────────────────────────────
UPDATE presentacion_comercial SET
  laboratorio_titular  = 'Accord Healthcare S.L.U.',
  ficha_tecnica_url    = 'https://cima.aemps.es/cima/pdfs/ft/73266/FT_73266.pdf',
  excipientes          = '[
    {"nombre": "Cloruro de sodio", "cantidad": "9,0", "unidad": "mg", "prohibido_pediatria": false, "prohibido_neonatologia": false}
  ]'::jsonb,
  con_conservantes     = false,
  cima_last_sync       = '2026-04-16T00:00:00Z'
WHERE id = 'c1000000-0000-0000-0000-000000000005';

-- ──────────────────────────────────────────────────────────────
-- FARMIBLASTINA 2 mg/mL  (nreg 59739, Pfizer)
-- ──────────────────────────────────────────────────────────────
UPDATE presentacion_comercial SET
  laboratorio_titular  = 'Pfizer S.L.',
  ficha_tecnica_url    = 'https://cima.aemps.es/cima/pdfs/ft/59739/FT_59739.pdf',
  con_conservantes     = false,
  cima_last_sync       = '2026-04-16T00:00:00Z'
WHERE id = 'c1000000-0000-0000-0000-000000000032';

-- ──────────────────────────────────────────────────────────────
-- FARMIBLASTINA 50 mg polvo  (nreg 56172, Pfizer)
-- Contiene METILPARABENO → con_conservantes = true,
-- prohibido en neonatología (riesgo de síndrome de gasping)
-- ──────────────────────────────────────────────────────────────
UPDATE presentacion_comercial SET
  laboratorio_titular   = 'Pfizer S.L.',
  ficha_tecnica_url     = 'https://cima.aemps.es/cima/pdfs/ft/56172/FT_56172.pdf',
  excipientes           = '[
    {"nombre": "Metilparabeno (E 218)", "cantidad": "5,00",   "unidad": "mg", "prohibido_pediatria": false, "prohibido_neonatologia": true},
    {"nombre": "Lactosa",               "cantidad": "250,00", "unidad": "mg", "prohibido_pediatria": false, "prohibido_neonatologia": false}
  ]'::jsonb,
  con_conservantes      = true,
  conservantes_detalle  = 'Metilparabeno (E 218) 5 mg/vial — contraindicado en neonatos (síndrome de gasping)',
  cima_last_sync        = '2026-04-16T00:00:00Z'
WHERE id = 'c1000000-0000-0000-0000-000000000033';

-- ──────────────────────────────────────────────────────────────
-- DOXORUBICINA AUROVITAS  (nreg 75345)
-- ──────────────────────────────────────────────────────────────
UPDATE presentacion_comercial SET
  laboratorio_titular  = 'Eugia Pharma (Malta) Limited',
  ficha_tecnica_url    = 'https://cima.aemps.es/cima/pdfs/ft/75345/FT_75345.pdf',
  excipientes          = '[
    {"nombre": "Cloruro de sodio", "cantidad": "9,00", "unidad": "mg", "prohibido_pediatria": false, "prohibido_neonatologia": false}
  ]'::jsonb,
  con_conservantes     = false,
  cima_last_sync       = '2026-04-16T00:00:00Z'
WHERE id = 'c1000000-0000-0000-0000-000000000034';

-- ──────────────────────────────────────────────────────────────
-- ENVASES: actualizar psum según estado actual de CIMA
-- (ya coinciden con los insertados en 00011, pero se
--  actualizan por si cambian en próximas sincronizaciones)
-- ──────────────────────────────────────────────────────────────

-- Cisplatino Hikma: ambos CNs en psum activo
UPDATE envase SET problema_suministro = true  WHERE codigo_nacional IN ('732523', '732524');

-- Ciclofosfamida Dr. Reddys: 1 mL y 2 mL en psum; 4 mL ok
UPDATE envase SET problema_suministro = true  WHERE codigo_nacional IN ('732777', '732778');
UPDATE envase SET problema_suministro = false WHERE codigo_nacional = '732779';

-- Doxorubicina Accord: 50 mL en psum; resto ok
UPDATE envase SET problema_suministro = true  WHERE codigo_nacional = '702587';
UPDATE envase SET problema_suministro = false WHERE codigo_nacional IN ('677175', '677176', '677177');

-- Todo lo demás: sin problema de suministro confirmado
UPDATE envase SET problema_suministro = false WHERE codigo_nacional IN (
  '673372', '683047', '683048',  -- Cisplatino Accord
  '664584', '664585',            -- Cisplatino Pharmacia
  '672084', '700551',            -- Genoxal
  '767136',                      -- Ciclofosfamida Seacross
  '802769', '958314',            -- Farmiblastina
  '687252', '687255'             -- Aurovitas
);
