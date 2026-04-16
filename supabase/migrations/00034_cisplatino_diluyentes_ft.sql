-- Diluyentes de cisplatino que faltaban según FT Accord (sección 6.6):
-- · SF 0,9% + manitol 1,875%
-- · SF 0,45% + SG 2,5% + manitol 1,875%

INSERT INTO compatibilidad_diluente
  (principio_activo_id, diluente, resultado, condiciones, referencia_id)
VALUES
  (
    'b1000000-0000-0000-0000-000000000001',
    'SF 0,9% + manitol 1,875%',
    'compatible',
    'Aporta Cl⁻ necesario para estabilidad del complejo de platino.',
    'a1000000-0000-0000-0000-000000000001'
  ),
  (
    'b1000000-0000-0000-0000-000000000001',
    'SF 0,45% + SG 2,5% + manitol 1,875%',
    'compatible',
    'Concentraciones finales equivalentes a mezcla SF/SG (1:1) con manitol.',
    'a1000000-0000-0000-0000-000000000001'
  );
