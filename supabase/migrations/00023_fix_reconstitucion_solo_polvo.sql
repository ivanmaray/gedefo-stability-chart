-- La entrada de reconstitución con presentacion_comercial_id = null
-- se aplica a todas las presentaciones del PA, incluyendo Dr. Reddys
-- que es un concentrado líquido (no necesita reconstitución).
-- Solución: una entrada explícita por cada presentación polvo.

-- Actualizar la entrada existente → Genoxal 200 mg
UPDATE condicion_preparacion SET
  presentacion_comercial_id = 'c1000000-0000-0000-0000-000000000003'
WHERE id = 'dba5677d-cb1d-4a3d-94e5-4b31a9139a61';

-- Nueva entrada → Genoxal 1000 mg (mismas condiciones)
INSERT INTO condicion_preparacion (
  principio_activo_id,
  presentacion_comercial_id,
  tipo,
  diluyente,
  concentracion_final_minima,
  concentracion_final_maxima,
  notas
) VALUES (
  'b1000000-0000-0000-0000-000000000002',
  'c1000000-0000-0000-0000-000000000004',
  'reconstitucion',
  'SF 0,9%',
  20,
  20,
  'Añadir 50 mL de SF 0,9% estéril → 20 mg/mL. Agitar hasta disolución completa (hasta 3 min). La solución reconstituida debe diluirse antes de administrar.'
);
