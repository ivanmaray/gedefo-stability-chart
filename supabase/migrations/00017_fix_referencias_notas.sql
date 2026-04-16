-- ============================================================
-- 00017_fix_referencias_notas.sql
-- Corrige notas con CNs ficticios y añade URLs a referencias NIOSH
-- ============================================================

-- Cisplatino Accord: el CN 603411 era ficticio del seed inicial
UPDATE referencia SET
  notas = 'Nreg 72609 - Accord Healthcare S.L.U. Ficha técnica de referencia para cisplatino 1 mg/mL.'
WHERE id = 'a1000000-0000-0000-0000-000000000001';

-- Doxorrubicina Accord: el CN 637912 era ficticio del seed inicial
UPDATE referencia SET
  notas = 'Nreg 73266 - Accord Healthcare S.L.U. Ficha técnica de referencia para doxorrubicina 2 mg/mL.'
WHERE id = 'a1000000-0000-0000-0000-000000000003';

-- NIOSH 2024: añadir URL desde DOI
UPDATE referencia SET
  url = 'https://doi.org/10.26616/NIOSHPUB2025103'
WHERE id = 'a2000000-0000-0000-0000-000000000001';

-- NIOSH Managing Exposures 2023: añadir URL desde DOI
UPDATE referencia SET
  url = 'https://doi.org/10.26616/NIOSHPUB2023130'
WHERE id = 'a2000000-0000-0000-0000-000000000002';

-- Monografía SEFH/GEDEFO 2020: no tiene DOI ni URL pública conocida,
-- pero sí tiene ISBN. Dejamos notas clarificadas.
UPDATE referencia SET
  notas = 'SEFH/GEDEFO 2020. ISBN 978-84-09-23039-6. Depósito legal M-26142-2020. Disponible bajo petición a SEFH (sefh@sefh.es). Tabla 3 y Procedimiento general de actuación ante extravasación.'
WHERE id = 'a1000000-0000-0000-0000-000000000010';

-- También corregimos el seed 00002 en la BD (no solo el archivo)
-- Las referencias de Stabilis no tienen URL específica por fármaco,
-- pero podemos mejorar las notas
UPDATE referencia SET
  notas = 'Stabilis Online (www.stabilis.org), consultado abril 2026. Base de datos de estabilidad de medicamentos de uso hospitalario.'
WHERE id IN (
  'a1000000-0000-0000-0000-000000000004',
  'a1000000-0000-0000-0000-000000000005',
  'a1000000-0000-0000-0000-000000000006'
);
