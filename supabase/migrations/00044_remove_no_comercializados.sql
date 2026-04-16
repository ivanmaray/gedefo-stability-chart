-- 1. Borrar envases no comercializados (los 3 originales los conservamos aunque no estén)
--    Excepto los que tienen psum=true (problema suministro temporal — siguen siendo válidos)
DELETE FROM envase
WHERE comercializado = false
  AND problema_suministro = false
  AND presentacion_id NOT IN (
    SELECT id FROM presentacion_comercial
    WHERE id IN (
      'c1000000-0000-0000-0000-000000000001',
      'c1000000-0000-0000-0000-000000000003',
      'c1000000-0000-0000-0000-000000000004',
      'c1000000-0000-0000-0000-000000000005',
      'c1000000-0000-0000-0000-000000000011',
      'c1000000-0000-0000-0000-000000000013',
      'c1000000-0000-0000-0000-000000000020',
      'c1000000-0000-0000-0000-000000000023',
      'c1000000-0000-0000-0000-000000000032',
      'c1000000-0000-0000-0000-000000000033',
      'c1000000-0000-0000-0000-000000000034'
    )
  );

-- 2. Borrar presentaciones que han quedado sin ningún envase
--    (excepto las 3 originales que pueden estar sin envase por diseño)
DELETE FROM presentacion_comercial
WHERE id NOT IN (
    'c1000000-0000-0000-0000-000000000001',
    'c1000000-0000-0000-0000-000000000003',
    'c1000000-0000-0000-0000-000000000004',
    'c1000000-0000-0000-0000-000000000005',
    'c1000000-0000-0000-0000-000000000011',
    'c1000000-0000-0000-0000-000000000013',
    'c1000000-0000-0000-0000-000000000020',
    'c1000000-0000-0000-0000-000000000023',
    'c1000000-0000-0000-0000-000000000032',
    'c1000000-0000-0000-0000-000000000033',
    'c1000000-0000-0000-0000-000000000034'
  )
  AND NOT EXISTS (
    SELECT 1 FROM envase WHERE presentacion_id = presentacion_comercial.id
  );
