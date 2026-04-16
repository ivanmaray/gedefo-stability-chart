-- ============================================================
-- 00016_fix_referencia_ciclofosfamida.sql
--
-- La referencia a1000000-02 tenía título incorrecto (decía Accord)
-- y la URL apuntaba ya al nreg 33411 (Genoxal 200mg Baxter).
-- En migración 00015 se creó a2000000-03 apuntando al mismo sitio
-- → duplicado. Se corrige el registro original y se elimina el duplicado.
-- ============================================================

-- 1. Corregir título y notas de la referencia original
UPDATE referencia SET
  titulo         = 'Ficha técnica Genoxal 200 mg polvo para solución inyectable y para perfusión - AEMPS/CIMA',
  notas          = 'Nreg 33411 - Baxter S.L. Ficha técnica de referencia para ciclofosfamida polvo 200 mg.'
WHERE id = 'a1000000-0000-0000-0000-000000000002';

-- 2. Redirigir los datos que apuntaban al duplicado (a2000000-003)
--    a la referencia corregida (a1000000-002)
UPDATE condicion_preparacion
  SET referencia_id = 'a1000000-0000-0000-0000-000000000002'
  WHERE referencia_id = 'a2000000-0000-0000-0000-000000000003';

UPDATE estabilidad
  SET referencia_id = 'a1000000-0000-0000-0000-000000000002'
  WHERE referencia_id = 'a2000000-0000-0000-0000-000000000003';

UPDATE compatibilidad_material
  SET referencia_id = 'a1000000-0000-0000-0000-000000000002'
  WHERE referencia_id = 'a2000000-0000-0000-0000-000000000003';

UPDATE compatibilidad_diluente
  SET referencia_id = 'a1000000-0000-0000-0000-000000000002'
  WHERE referencia_id = 'a2000000-0000-0000-0000-000000000003';

UPDATE administracion
  SET referencia_id = 'a1000000-0000-0000-0000-000000000002'
  WHERE referencia_id = 'a2000000-0000-0000-0000-000000000003';

UPDATE matriz_riesgo
  SET referencia_id = 'a1000000-0000-0000-0000-000000000002'
  WHERE referencia_id = 'a2000000-0000-0000-0000-000000000003';

-- 3. Eliminar el duplicado
DELETE FROM referencia WHERE id = 'a2000000-0000-0000-0000-000000000003';

-- 4. También hay que corregir las notas del seed original de a1000000-002
--    que decían "CN 746494 - Accord Healthcare" (CN de Accord, no comercializado)
--    Ahora dice la Genoxal correctamente. Ya está hecho arriba.
