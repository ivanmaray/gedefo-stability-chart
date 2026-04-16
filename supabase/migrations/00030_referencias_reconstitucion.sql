-- Añade referencias FT para Farmiblastina 50mg y Ciclofosfamida Seacross,
-- y las vincula a sus entradas de reconstitución.

INSERT INTO referencia (id, tipo_fuente, titulo, url, fecha_consulta) VALUES
  (
    'a3000000-0000-0000-0000-000000000001',
    'ficha_tecnica',
    'Ficha técnica Farmiblastina 50 mg polvo para solución inyectable - AEMPS/CIMA',
    'https://cima.aemps.es/cima/pdfs/ft/56172/FT_56172.pdf',
    '2026-04-16'
  ),
  (
    'a3000000-0000-0000-0000-000000000002',
    'ficha_tecnica',
    'Ficha técnica Ciclofosfamida Seacross 500 mg polvo para solución inyectable y para perfusión EFG - AEMPS/CIMA',
    'https://cima.aemps.es/cima/pdfs/ft/90200/FT_90200.pdf',
    '2026-04-16'
  );

-- Vincular entradas de reconstitución a sus FTs
UPDATE condicion_preparacion SET referencia_id = 'a3000000-0000-0000-0000-000000000001'
  WHERE id = '86b81761-682a-4923-9a8d-3501eeff5bad'; -- Farmiblastina 50mg

UPDATE condicion_preparacion SET referencia_id = 'a3000000-0000-0000-0000-000000000002'
  WHERE id = 'f40b8804-4206-412a-ba23-7e1163fcb6b7'; -- Ciclofosfamida Seacross

-- Genoxal 1000mg también debería apuntar a su propia FT, no a la del 200mg
UPDATE condicion_preparacion SET referencia_id = 'a2000000-0000-0000-0000-000000000004'
  WHERE id = 'b2aace67-e103-4160-a68b-71c66b852f07'; -- Genoxal 1000mg
