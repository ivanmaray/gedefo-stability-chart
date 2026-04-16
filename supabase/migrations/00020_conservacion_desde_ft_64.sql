-- ============================================================
-- 00020_conservacion_desde_ft_64.sql
--
-- Datos de temperatura_conservacion y proteccion_luz_almacenamiento
-- extraídos de la sección 6.4 de cada ficha técnica AEMPS (2026-04-16).
-- ============================================================

-- CISPLATINO PHARMACIA (62107)
-- "Conservar por debajo de 25°C. No refrigerar o congelar.
--  Conservar el vial en el embalaje exterior para protegerlo de la luz."
UPDATE presentacion_comercial SET
  temperatura_conservacion       = 'ambiente',
  proteccion_luz_almacenamiento  = true
WHERE id = 'c1000000-0000-0000-0000-000000000011';

-- CISPLATINO ACCORD (72609)
-- "No refrigerar o congelar. Conservar en embalaje exterior para protegerlo de la luz."
UPDATE presentacion_comercial SET
  temperatura_conservacion       = 'ambiente',
  proteccion_luz_almacenamiento  = true
WHERE id = 'c1000000-0000-0000-0000-000000000001';

-- CISPLATINO HIKMA (86466)
-- "No conservar a temperatura superior a 25°C. No refrigerar o congelar.
--  Conservar el vial en el embalaje exterior para protegerlo de la luz."
UPDATE presentacion_comercial SET
  temperatura_conservacion       = 'ambiente',
  proteccion_luz_almacenamiento  = true
WHERE id = 'c1000000-0000-0000-0000-000000000013';

-- GENOXAL 200 mg (33411)
-- "No conservar a temperatura superior a 25°C.
--  Conservar en el envase original para protegerlo de la luz."
UPDATE presentacion_comercial SET
  temperatura_conservacion       = 'ambiente',
  proteccion_luz_almacenamiento  = true
WHERE id = 'c1000000-0000-0000-0000-000000000003';

-- GENOXAL 1000 mg (48972)
-- Idéntico a 200 mg
UPDATE presentacion_comercial SET
  temperatura_conservacion       = 'ambiente',
  proteccion_luz_almacenamiento  = true
WHERE id = 'c1000000-0000-0000-0000-000000000004';

-- CICLOFOSFAMIDA DR. REDDYS (86548)
-- "Conservar en nevera (entre 2°C y 8°C)."
UPDATE presentacion_comercial SET
  temperatura_conservacion       = 'nevera',
  proteccion_luz_almacenamiento  = false
WHERE id = 'c1000000-0000-0000-0000-000000000020';

-- CICLOFOSFAMIDA SEACROSS 500 mg (90200)
-- "No conservar a temperatura superior a 25°C."
UPDATE presentacion_comercial SET
  temperatura_conservacion       = 'ambiente',
  proteccion_luz_almacenamiento  = false
WHERE id = 'c1000000-0000-0000-0000-000000000023';

-- DOXORUBICINA ACCORD (73266)
-- "Conservar en nevera (entre 2°C y 8°C).
--  Mantener el vial en el embalaje exterior para protegerlo de la luz."
UPDATE presentacion_comercial SET
  temperatura_conservacion       = 'nevera',
  proteccion_luz_almacenamiento  = true
WHERE id = 'c1000000-0000-0000-0000-000000000005';

-- FARMIBLASTINA 2 mg/mL (59739)
-- "Conservar en nevera (entre 2°C y 8°C).
--  Conservar en el embalaje exterior para protegerlo de la luz."
UPDATE presentacion_comercial SET
  temperatura_conservacion       = 'nevera',
  proteccion_luz_almacenamiento  = true
WHERE id = 'c1000000-0000-0000-0000-000000000032';

-- FARMIBLASTINA 50 mg polvo (56172)
-- "No requiere condiciones especiales de conservación."
-- Nota: la solución reconstituida sí requiere protección de luz,
-- pero eso es postconstiución (sección 6.3), no el vial sin abrir.
UPDATE presentacion_comercial SET
  temperatura_conservacion       = 'ambiente',
  proteccion_luz_almacenamiento  = false
WHERE id = 'c1000000-0000-0000-0000-000000000033';

-- DOXORUBICINA AUROVITAS (75345)
-- "Conservar en nevera (entre 2°C y 8°C).
--  Conservar el vial en el embalaje exterior para protegerlo de la luz."
UPDATE presentacion_comercial SET
  temperatura_conservacion       = 'nevera',
  proteccion_luz_almacenamiento  = true
WHERE id = 'c1000000-0000-0000-0000-000000000034';
