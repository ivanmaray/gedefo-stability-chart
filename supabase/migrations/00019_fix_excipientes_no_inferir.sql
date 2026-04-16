-- 00019_fix_excipientes_no_inferir.sql
-- Eliminar flags prohibido_neonatologia inferidos manualmente.
-- CIMA no proporciona ese dato; los flags quedan a false hasta
-- que se implemente una lista curada propia.

UPDATE presentacion_comercial SET
  excipientes = '[
    {"nombre": "Metilparabeno (E 218)", "cantidad": "5,00",   "unidad": "mg", "prohibido_pediatria": false, "prohibido_neonatologia": false},
    {"nombre": "Lactosa",               "cantidad": "250,00", "unidad": "mg", "prohibido_pediatria": false, "prohibido_neonatologia": false}
  ]'::jsonb
WHERE id = 'c1000000-0000-0000-0000-000000000033';
