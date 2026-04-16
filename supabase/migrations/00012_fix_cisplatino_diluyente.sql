-- El diluyente correcto para cisplatino es SF 0,9% (o SF 0,45%).
-- La condición sobre el cloruro va en notas, no en el campo diluyente.
UPDATE condicion_preparacion SET
  diluyente = 'SF 0,9% (o SF 0,45%)',
  notas     = 'IMPRESCINDIBLE que el diluyente contenga cloruro sódico. NO usar SG 5% solo: la ausencia de Cl⁻ acelera la degradación del cisplatino (sustitución del ligando cloruro). Si se requiere SG 5%, añadir NaCl para alcanzar al menos 0,2% de cloruro. Filtros de nailon o éster de celulosa aceptables; EVITAR cualquier material con aluminio (cataliza la degradación).'
WHERE principio_activo_id = 'b1000000-0000-0000-0000-000000000001'
  AND tipo = 'dilucion';
