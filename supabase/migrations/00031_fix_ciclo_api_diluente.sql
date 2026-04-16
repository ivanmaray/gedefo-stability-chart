-- La entrada de API en compatibilidad_diluente para ciclofosfamida
-- no es un diluyente de dilución sino de reconstitución.
-- Ya está recogido en condicion_preparacion. Se elimina aquí.
DELETE FROM compatibilidad_diluente
WHERE id = '0de7763c-e9ae-4a45-a09a-9f0d7794b0f7';
