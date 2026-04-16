-- Eliminar principios activos que no son L01.
-- El seed 00039 incluyó L02, L03 y L04 por error.
DELETE FROM principio_activo
WHERE atc_code NOT LIKE 'L01%'
  AND id NOT IN (
    -- Conservar los 3 originales aunque su ATC sea L01 (ya los cubre el LIKE)
    'b1000000-0000-0000-0000-000000000001',
    'b1000000-0000-0000-0000-000000000002',
    'b1000000-0000-0000-0000-000000000003'
  );
