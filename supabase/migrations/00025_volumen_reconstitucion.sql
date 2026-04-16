-- Popula volumen_ml_minimo/maximo para las entradas de reconstitución.
-- Genoxal (genérica): cubre vial 200mg (10mL) y 1000mg (50mL) → rango 10-50
-- Seacross 500mg:  25 mL
-- Farmiblastina 50mg polvo: 25 mL

UPDATE condicion_preparacion SET
  volumen_ml_minimo = 10,
  volumen_ml_maximo = 50
WHERE id = 'dba5677d-cb1d-4a3d-94e5-4b31a9139a61'; -- ciclofosfamida genérica

UPDATE condicion_preparacion SET
  volumen_ml_minimo = 25,
  volumen_ml_maximo = 25
WHERE id = 'f40b8804-4206-412a-ba23-7e1163fcb6b7'; -- Seacross 500mg

UPDATE condicion_preparacion SET
  volumen_ml_minimo = 25,
  volumen_ml_maximo = 25
WHERE id = '86b81761-682a-4923-9a8d-3501eeff5bad'; -- Farmiblastina 50mg polvo
