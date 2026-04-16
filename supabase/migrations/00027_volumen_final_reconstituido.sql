-- Añade volumen_final_reconstituido_ml a condicion_preparacion.
-- Distingue entre el volumen AÑADIDO (volumen_ml_minimo/maximo)
-- y el volumen FINAL en el vial tras reconstitución (polvo ocupa volumen).

ALTER TABLE condicion_preparacion
  ADD COLUMN IF NOT EXISTS volumen_final_reconstituido_ml numeric;

-- Genoxal 200mg: añadir 10 mL SF → vol final ~10,26 mL (desplazamiento ciclofosfamida ~0,26 mL/200mg)
UPDATE condicion_preparacion SET volumen_final_reconstituido_ml = 10.26
WHERE presentacion_comercial_id = 'c1000000-0000-0000-0000-000000000003'
  AND tipo = 'reconstitucion';

-- Genoxal 1000mg: añadir 50 mL SF → vol final ~51,3 mL
UPDATE condicion_preparacion SET volumen_final_reconstituido_ml = 51.3
WHERE presentacion_comercial_id = 'c1000000-0000-0000-0000-000000000004'
  AND tipo = 'reconstitucion';

-- Ciclofosfamida Seacross 500mg: añadir 25 mL → vol final ~25,65 mL
UPDATE condicion_preparacion SET volumen_final_reconstituido_ml = 25.65
WHERE presentacion_comercial_id = 'c1000000-0000-0000-0000-000000000023'
  AND tipo = 'reconstitucion';

-- Farmiblastina 50mg polvo: añadir 25 mL → vol final 25 mL (FT no especifica desplazamiento)
UPDATE condicion_preparacion SET volumen_final_reconstituido_ml = 25
WHERE presentacion_comercial_id = 'c1000000-0000-0000-0000-000000000033'
  AND tipo = 'reconstitucion';
