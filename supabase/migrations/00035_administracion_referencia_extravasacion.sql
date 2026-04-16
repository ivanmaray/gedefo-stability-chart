-- Separa la referencia de parámetros de administración (FT)
-- de la referencia de extravasación (GEDEFO 2020).
-- referencia_id        → FT (tiempo, velocidad, concentración, notas)
-- referencia_extravasacion_id → monografía extravasaciones GEDEFO

ALTER TABLE administracion
  ADD COLUMN IF NOT EXISTS referencia_extravasacion_id uuid REFERENCES referencia(id);

-- Mover la referencia actual (GEDEFO extravasaciones) al campo específico
UPDATE administracion SET referencia_extravasacion_id = referencia_id;

-- Asignar referencia correcta (FT) para parámetros de administración
UPDATE administracion SET referencia_id = 'a1000000-0000-0000-0000-000000000001'  -- FT Cisplatino Accord
  WHERE principio_activo_id = 'b1000000-0000-0000-0000-000000000001';

UPDATE administracion SET referencia_id = 'a1000000-0000-0000-0000-000000000002'  -- FT Genoxal 200mg
  WHERE principio_activo_id = 'b1000000-0000-0000-0000-000000000002';

UPDATE administracion SET referencia_id = 'a1000000-0000-0000-0000-000000000003'  -- FT Doxorubicina Accord
  WHERE principio_activo_id = 'b1000000-0000-0000-0000-000000000003';
