-- La lógica de "null = solo polvo" se resuelve en el UI.
-- Revertir las entradas específicas por nregistro → una sola entrada
-- genérica (null) para ciclofosfamida en polvo.

-- Volver a null la entrada de Genoxal 200mg
UPDATE condicion_preparacion SET
  presentacion_comercial_id = null,
  notas = 'Reconstituir con SF 0,9% estéril. '
          'Vial 200 mg → añadir 10 mL → 20 mg/mL. '
          'Vial 1.000 mg → añadir 50 mL → 20 mg/mL. '
          'Agitar hasta disolución completa (hasta 3 min). '
          'La solución reconstituida debe diluirse antes de administrar.'
WHERE id = 'dba5677d-cb1d-4a3d-94e5-4b31a9139a61';

-- Eliminar la entrada duplicada del 1000mg (ya no necesaria)
DELETE FROM condicion_preparacion
WHERE tipo = 'reconstitucion'
  AND principio_activo_id = 'b1000000-0000-0000-0000-000000000002'
  AND presentacion_comercial_id = 'c1000000-0000-0000-0000-000000000004';
