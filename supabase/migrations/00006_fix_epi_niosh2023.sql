-- ============================================================
-- 00006_fix_epi_niosh2023.sql
--
-- Corrección del EPI en matriz_riesgo basada en la Tabla de
-- Control Approaches del documento NIOSH "Managing Hazardous
-- Drug Exposures: Information for Healthcare Settings" (2023,
-- DHHS Pub. 2023-130).
--
-- Para preparación de soluciones IV desde vial (compounding)
-- en cabina BSC clase II/III o CACI, el EPI recomendado es:
--   1. Doble guante quimioterapia ASTM (chemotherapy-rated)
--   2. Bata impermeable de un solo uso (cierre trasero, manga larga
--      con puño ajustado de polietileno, polipropileno u otro
--      laminado — NO bata de tela ni scrubs)
--   3. Cubrecabeza
--   4. Cubrezapatos
--   5. Gafas de protección (recomendado siempre; obligatorio
--      si se trabaja fuera de cabina o riesgo de salpicadura)
--   6. Mascarilla FFP2 / N95 (obligatorio fuera de cabina o
--      si se sospecha aerosol; recomendado dentro de cabina
--      como buena práctica)
--
-- Nota: cubrecabeza y cubrezapatos estaban ausentes del seed
-- inicial. Se añaden ahora.
-- ============================================================

UPDATE matriz_riesgo SET
  epi_requerido = ARRAY[
    'guantes_qt_dobles',
    'bata_impermeable_uso_unico',
    'cubrecabeza',
    'cubrezapatos',
    'gafas_proteccion',
    'mascarilla_ffp2_n95_si_fuera_cabina'
  ],
  nivel_contencion = 'CSB-II clase II/III o CACI',
  notas = 'EPI según NIOSH Managing Hazardous Drug Exposures 2023 (Pub. 2023-130), Tabla Cap. 8: "Compounding — Preparation of intravenous solutions by withdrawing or mixing from a vial". Gafas y FFP2/N95 obligatorios fuera de cabina; recomendados dentro como buena práctica adicional. Bata debe ser impermeable de un solo uso (polietileno, polipropileno u otro laminado) — NO bata de tela, bata de laboratorio ni scrubs.'
WHERE principio_activo_id IN (
  'b1000000-0000-0000-0000-000000000001',
  'b1000000-0000-0000-0000-000000000002',
  'b1000000-0000-0000-0000-000000000003'
);
