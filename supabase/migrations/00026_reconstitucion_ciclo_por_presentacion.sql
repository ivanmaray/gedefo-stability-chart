-- La entrada genérica de ciclofosfamida polvo muestra 10–50 mL porque
-- cubre dos viales distintos. Se reemplaza por una entrada por nregistro.

-- Eliminar la entrada genérica
DELETE FROM condicion_preparacion
WHERE id = 'dba5677d-cb1d-4a3d-94e5-4b31a9139a61';

-- Genoxal 200 mg (nreg 33411) → 10 mL → 20 mg/mL
INSERT INTO condicion_preparacion (
  principio_activo_id, presentacion_comercial_id, tipo,
  diluyente, volumen_ml_minimo, volumen_ml_maximo,
  concentracion_final_minima, concentracion_final_maxima,
  envase_compatible, proteccion_luz, notas, referencia_id
) VALUES (
  'b1000000-0000-0000-0000-000000000002',
  'c1000000-0000-0000-0000-000000000003',
  'reconstitucion',
  'SF 0,9%', 10, 10, 20, 20,
  ARRAY['poliolefina','vidrio','pvc'],
  false,
  'Añadir 10 mL de SF 0,9% estéril → 20 mg/mL. Agitar hasta disolución completa (hasta 3 min). Diluir antes de administrar.',
  'a1000000-0000-0000-0000-000000000002'
);

-- Genoxal 1000 mg (nreg 48972) → 50 mL → 20 mg/mL
INSERT INTO condicion_preparacion (
  principio_activo_id, presentacion_comercial_id, tipo,
  diluyente, volumen_ml_minimo, volumen_ml_maximo,
  concentracion_final_minima, concentracion_final_maxima,
  envase_compatible, proteccion_luz, notas, referencia_id
) VALUES (
  'b1000000-0000-0000-0000-000000000002',
  'c1000000-0000-0000-0000-000000000004',
  'reconstitucion',
  'SF 0,9%', 50, 50, 20, 20,
  ARRAY['poliolefina','vidrio','pvc'],
  false,
  'Añadir 50 mL de SF 0,9% estéril → 20 mg/mL. Agitar hasta disolución completa (hasta 3 min). Diluir antes de administrar.',
  'a1000000-0000-0000-0000-000000000002'
);
