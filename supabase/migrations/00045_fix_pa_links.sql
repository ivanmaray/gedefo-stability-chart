-- Corrige presentaciones vinculadas al PA incorrecto por búsqueda amplia de practiv1.

UPDATE presentacion_comercial SET principio_activo_id = '5e5e8c5e-3a5d-482a-9324-15cf7027676c' WHERE id = '12297c26-59d1-4305-9ab3-608182b489c0'; -- 1181308001: 'daunorubicina' → 'daunorubicina + citarabina'
UPDATE presentacion_comercial SET principio_activo_id = '57655142-4182-4f12-befe-2c8f55f4183d' WHERE id = 'c5e4dbad-ec61-4031-ab83-0076b9014f56'; -- 1201497002: 'trastuzumab' → 'pertuzumab + trastuzumab'
UPDATE presentacion_comercial SET principio_activo_id = '57655142-4182-4f12-befe-2c8f55f4183d' WHERE id = 'a6fbb830-9e71-4f13-95db-9e2c3f0dfde0'; -- 1201497001: 'trastuzumab' → 'pertuzumab + trastuzumab'
UPDATE presentacion_comercial SET principio_activo_id = '03f0f75c-bbdc-4de1-9bfc-1209fe8e03e3' WHERE id = '112b3e37-6d52-4c47-92c6-91abc037d1c9'; -- 113885002: 'trastuzumab' → 'trastuzumab emtansina'
UPDATE presentacion_comercial SET principio_activo_id = '03f0f75c-bbdc-4de1-9bfc-1209fe8e03e3' WHERE id = '01af4a39-f6ba-434a-8753-c061fc63eba6'; -- 113885001: 'trastuzumab' → 'trastuzumab emtansina'
UPDATE presentacion_comercial SET principio_activo_id = '9d1237b2-b163-4d36-b724-ab70c20d31f4' WHERE id = 'd0bcb4df-1adc-4583-947a-71cc0edecb32'; -- 1201508001: 'trastuzumab' → 'trastuzumab deruxtecán'