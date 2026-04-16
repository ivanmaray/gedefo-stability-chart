-- Eliminar estimaciones de volumen final reconstituido.
-- Solo poblar cuando la ficha técnica lo especifique explícitamente.
UPDATE condicion_preparacion SET volumen_final_reconstituido_ml = null
WHERE tipo = 'reconstitucion';
