-- Eliminar inferencia sobre neonatología del campo conservantes_detalle.
UPDATE presentacion_comercial SET
  conservantes_detalle = 'Metilparabeno (E 218) 5 mg/vial'
WHERE id = 'c1000000-0000-0000-0000-000000000033';
