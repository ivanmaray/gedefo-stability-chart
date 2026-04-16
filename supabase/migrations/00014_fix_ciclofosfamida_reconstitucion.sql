-- Corrige el diluyente de reconstitución de ciclofosfamida:
-- admite tanto API como SF 0,9% según ficha técnica.
UPDATE condicion_preparacion SET
  diluyente = 'API o SF 0,9%',
  notas     = 'Reconstituir con API o SF 0,9%. Para vial 200 mg añadir 10 mL → concentración 20 mg/mL. Para vial 1000 mg añadir 50 mL → 20 mg/mL. Agitar hasta disolución completa (puede tardar 2-3 min). La solución reconstituida debe diluirse antes de administrar.'
WHERE principio_activo_id = 'b1000000-0000-0000-0000-000000000002'
  AND tipo = 'reconstitucion';
