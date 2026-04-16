-- Separa correctamente tipo_cabina y nivel_contencion en matriz_riesgo.
-- tipo_cabina = equipo físico requerido
-- nivel_contencion = clasificación del nivel de riesgo

UPDATE matriz_riesgo SET
  tipo_cabina      = 'CSB clase II o III (BSC) o CACI',
  nivel_contencion = 'contencion_maxima'
WHERE principio_activo_id IN (
  'b1000000-0000-0000-0000-000000000001',
  'b1000000-0000-0000-0000-000000000002',
  'b1000000-0000-0000-0000-000000000003'
);
