-- ============================================================
-- 00032_diluyentes_ft.sql
--
-- 1. Ciclofosfamida: diluyentes adicionales de FT Genoxal
--    "glucosa, glucosalina, NaCl+KCl, glucosa+KCl, Ringer"
-- 2. Cisplatino: mezcla SF 0,9% + SG 5% (1:1) — aparece
--    explícitamente en sección 6.6 FT Pharmacia/Accord/Hikma
-- ============================================================

-- ── CICLOFOSFAMIDA ─────────────────────────────────────────
INSERT INTO compatibilidad_diluente
  (principio_activo_id, diluente, resultado, condiciones, referencia_id)
VALUES
  ('b1000000-0000-0000-0000-000000000002',
   'SG 5% + SF 0,9% (glucosalina)', 'compatible', null,
   'a1000000-0000-0000-0000-000000000002'),

  ('b1000000-0000-0000-0000-000000000002',
   'SF 0,9% + KCl', 'compatible', null,
   'a1000000-0000-0000-0000-000000000002'),

  ('b1000000-0000-0000-0000-000000000002',
   'SG 5% + KCl', 'compatible', null,
   'a1000000-0000-0000-0000-000000000002'),

  ('b1000000-0000-0000-0000-000000000002',
   'Ringer', 'compatible', null,
   'a1000000-0000-0000-0000-000000000002');

-- ── CISPLATINO ─────────────────────────────────────────────
INSERT INTO compatibilidad_diluente
  (principio_activo_id, diluente, resultado, condiciones, referencia_id)
VALUES
  ('b1000000-0000-0000-0000-000000000001',
   'SF 0,9% + SG 5% (1:1)', 'compatible',
   'Mezcla a partes iguales. Concentraciones finales: NaCl 0,45% + glucosa 2,5%.',
   'a1000000-0000-0000-0000-000000000001');
