-- Estabilidad post-dilución desde FT para presentaciones de doxorubicina.
-- Fuente: sección 6.3 fichas técnicas CIMA, consultadas 2026-04-16.

-- DOXORUBICINA ACCORD (nreg 73266)
-- FT: "soluciones de perfusión preparadas: normalmente no deben superarse
--      las 24 horas, y la temperatura debe oscilar entre 2°C y 8°C"
INSERT INTO estabilidad (
  principio_activo_id, presentacion_comercial_id,
  temperatura_celsius, proteccion_luz, tipo_estabilidad, tiempo_horas,
  notas_cualitativas, referencia_id
) VALUES (
  'b1000000-0000-0000-0000-000000000003',
  'c1000000-0000-0000-0000-000000000005',
  4, true, 'fisicoquimica', 24,
  'Viales abiertos: usar inmediatamente. Solución preparada: no superar 24h a 2-8°C.',
  'a1000000-0000-0000-0000-000000000003'
);

-- DOXORUBICINA AUROVITAS (nreg 75345)
-- FT: "normalmente no deberían superar las 24 horas a 2°C a 8°C
--      salvo que la dilución haya tenido lugar bajo condiciones asépticas
--      controladas y validadas"
-- También: "viales abiertos: estabilidad química y física 28 días a 2-8°C"
INSERT INTO estabilidad (
  principio_activo_id, presentacion_comercial_id,
  temperatura_celsius, proteccion_luz, tipo_estabilidad, tiempo_horas,
  notas_cualitativas, referencia_id
) VALUES (
  'b1000000-0000-0000-0000-000000000003',
  'c1000000-0000-0000-0000-000000000034',
  4, true, 'fisicoquimica', 24,
  'Solución preparada: no superar 24h a 2-8°C salvo dilución en condiciones asépticas controladas y validadas. Vial abierto sin diluir: estable 28 días a 2-8°C.',
  'a4000000-0000-0000-0000-000000000005'
);

-- FARMIBLASTINA 2 mg/mL (nreg 59739): sin dato explícito en FT → no se añade entrada.
