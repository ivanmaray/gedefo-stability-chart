-- Corrección: el color del contenedor para residuos citotóxicos es normativa
-- autonómica y varía por comunidad. Se elimina la referencia al color amarillo
-- y se deja solo el código LER estatal (18 01 08*).

UPDATE matriz_riesgo
SET gestion_residuos = 'Residuo citotóxico (código LER 18 01 08*). Contenedor rígido según normativa autonómica vigente. Gestión por empresa autorizada.'
WHERE principio_activo_id IN (
  'b1000000-0000-0000-0000-000000000001',
  'b1000000-0000-0000-0000-000000000002'
);

UPDATE matriz_riesgo
SET gestion_residuos = 'Residuo citotóxico (código LER 18 01 08*). Contenedor rígido según normativa autonómica vigente. Ojo: orina roja 48h post-administración — gestionar como citotóxico. Gestión por empresa autorizada.'
WHERE principio_activo_id = 'b1000000-0000-0000-0000-000000000003';
