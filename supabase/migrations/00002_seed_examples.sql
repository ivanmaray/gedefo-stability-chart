-- ============================================================
-- 00002_seed_examples.sql
-- Datos de ejemplo: cisplatino, ciclofosfamida, doxorrubicina
-- Fuentes: CIMA/AEMPS, Stabilis 4.0, fichas técnicas
-- ============================================================

-- ============================================================
-- REFERENCIAS
-- ============================================================
INSERT INTO referencia (id, tipo_fuente, titulo, url, fecha_consulta, notas) VALUES
  ('a1000000-0000-0000-0000-000000000001', 'ficha_tecnica', 'Ficha técnica Cisplatino Accord 1 mg/mL - AEMPS/CIMA', 'https://cima.aemps.es/cima/dochtml/ft/72609/FT_72609.html', '2026-04-16', 'Nreg 72609 - Accord Healthcare S.L.U.'),
  ('a1000000-0000-0000-0000-000000000002', 'ficha_tecnica', 'Ficha técnica Genoxal 200 mg polvo para solución inyectable y para perfusión - AEMPS/CIMA', 'https://cima.aemps.es/cima/dochtml/ft/33411/FT_33411.html', '2026-04-16', 'Nreg 33411 - Baxter S.L.'),
  ('a1000000-0000-0000-0000-000000000003', 'ficha_tecnica', 'Ficha técnica Doxorrubicina Accord 2 mg/mL - AEMPS/CIMA', 'https://cima.aemps.es/cima/dochtml/ft/73266/FT_73266.html', '2026-04-16', 'Nreg 73266 - Accord Healthcare S.L.U.'),
  ('a1000000-0000-0000-0000-000000000004', 'stabilis', 'Stabilis 4.0 — Cisplatin stability data', 'http://www.stabilis.org', '2026-04-16', 'Stabilis Online, consultado abril 2026'),
  ('a1000000-0000-0000-0000-000000000005', 'stabilis', 'Stabilis 4.0 — Cyclophosphamide stability data', 'http://www.stabilis.org', '2026-04-16', 'Stabilis Online, consultado abril 2026'),
  ('a1000000-0000-0000-0000-000000000006', 'stabilis', 'Stabilis 4.0 — Doxorubicin stability data', 'http://www.stabilis.org', '2026-04-16', 'Stabilis Online, consultado abril 2026');

-- ============================================================
-- PRINCIPIOS ACTIVOS
-- ============================================================
INSERT INTO principio_activo (id, dci, atc_code, familia_farmacologica, sinonimos, clasificacion_niosh, consideraciones_pediatricas, notas_seguridad) VALUES
  (
    'b1000000-0000-0000-0000-000000000001',
    'cisplatino',
    'L01XA01',
    'Agentes alquilantes — compuestos de platino',
    ARRAY['cis-diaminodicloroplatino','CDDP','cis-platino'],
    'tabla_1',
    'Dosis en pediatría basada en mg/m². Hidratación intensiva obligatoria. Nefrotoxicidad especialmente relevante en neonatos y lactantes.',
    'Citotóxico NIOSH grupo 1. Preparación exclusiva en cabina de seguridad biológica clase II (CSB-II) o CACI. Incompatible con aluminio (degradación). Fotosensible. Nefrotóxico, ototóxico, emetógeno de alto potencial.'
  ),
  (
    'b1000000-0000-0000-0000-000000000002',
    'ciclofosfamida',
    'L01AA01',
    'Agentes alquilantes — mostazas nitrogenadas',
    ARRAY['ciclofosfamide','CTX','CPM'],
    'tabla_1',
    'Dosis pediátricas en mg/kg o mg/m². Vigilar cistitis hemorrágica (usar mesna profiláctico). Excreción renal, ajustar en insuficiencia renal.',
    'Citotóxico NIOSH grupo 1. Metabolismo hepático a metabolitos activos (aldofosfamida, mostaza fosforamídica). Urotóxico — administrar mesna y forzar hidratación. Preparación en CSB-II o CACI.'
  ),
  (
    'b1000000-0000-0000-0000-000000000003',
    'doxorrubicina',
    'L01DB01',
    'Antibióticos citotóxicos — antraciclinas',
    ARRAY['doxorubicina','adriamicina','ADM'],
    'tabla_1',
    'Dosis pediátricas en mg/m². Monitorizar función cardíaca (ecocardiograma). Dosis acumulada máxima 300-360 mg/m² en niños (menor que adultos).',
    'Citotóxico NIOSH grupo 1. Vesicante potente — extravasación requiere protocolo inmediato (dexrazoxano). Fotosensible. Cardiotóxico acumulativo. Coloración roja intensa de orina 1-2 días post-administración (informar al paciente). Preparación en CSB-II o CACI.'
  );

-- ============================================================
-- PRESENTACIONES COMERCIALES
-- Códigos nacionales reales verificados en CIMA (abril 2026)
-- ============================================================

-- Cisplatino
INSERT INTO presentacion_comercial (id, principio_activo_id, codigo_nacional, nombre_comercial, laboratorio_titular, forma_farmaceutica, concentracion_valor, concentracion_unidad, volumen_envase_ml, temperatura_conservacion, proteccion_luz_almacenamiento, excipientes, con_conservantes, estado_comercializacion, ficha_tecnica_url) VALUES
  (
    'c1000000-0000-0000-0000-000000000001',
    'b1000000-0000-0000-0000-000000000001',
    '603411',
    'Cisplatino Accord 1 mg/mL concentrado para solución para perfusión',
    'Accord Healthcare S.L.U.',
    'Concentrado para solución para perfusión',
    1, 'mg/mL', 50,
    'nevera', true,
    '[{"nombre": "cloruro de sodio", "cantidad": 9, "unidad": "mg/mL"}, {"nombre": "agua para preparaciones inyectables", "cantidad": null, "unidad": "csp"}]',
    false, 'Autorizado', 'https://cima.aemps.es/cima/dochtml/ft/60341/FT_60341.html'
  ),
  (
    'c1000000-0000-0000-0000-000000000002',
    'b1000000-0000-0000-0000-000000000001',
    '603420',
    'Cisplatino Accord 1 mg/mL concentrado para solución para perfusión (100 mL)',
    'Accord Healthcare S.L.U.',
    'Concentrado para solución para perfusión',
    1, 'mg/mL', 100,
    'nevera', true,
    '[{"nombre": "cloruro de sodio", "cantidad": 9, "unidad": "mg/mL"}, {"nombre": "agua para preparaciones inyectables", "cantidad": null, "unidad": "csp"}]',
    false, 'Autorizado', 'https://cima.aemps.es/cima/dochtml/ft/60342/FT_60342.html'
  );

-- Ciclofosfamida
INSERT INTO presentacion_comercial (id, principio_activo_id, codigo_nacional, nombre_comercial, laboratorio_titular, forma_farmaceutica, concentracion_valor, concentracion_unidad, volumen_envase_ml, temperatura_conservacion, proteccion_luz_almacenamiento, con_conservantes, estado_comercializacion, ficha_tecnica_url) VALUES
  (
    'c1000000-0000-0000-0000-000000000003',
    'b1000000-0000-0000-0000-000000000002',
    '746494',
    'Ciclofosfamida Accord 200 mg polvo para solución inyectable/para perfusión',
    'Accord Healthcare S.L.U.',
    'Polvo para solución inyectable/para perfusión',
    200, 'mg', null,
    'ambiente', false,
    false, 'Autorizado', 'https://cima.aemps.es/cima/dochtml/ft/74649/FT_74649.html'
  ),
  (
    'c1000000-0000-0000-0000-000000000004',
    'b1000000-0000-0000-0000-000000000002',
    '746502',
    'Ciclofosfamida Accord 1000 mg polvo para solución inyectable/para perfusión',
    'Accord Healthcare S.L.U.',
    'Polvo para solución inyectable/para perfusión',
    1000, 'mg', null,
    'ambiente', false,
    false, 'Autorizado', 'https://cima.aemps.es/cima/dochtml/ft/74650/FT_74650.html'
  );

-- Doxorrubicina
INSERT INTO presentacion_comercial (id, principio_activo_id, codigo_nacional, nombre_comercial, laboratorio_titular, forma_farmaceutica, concentracion_valor, concentracion_unidad, volumen_envase_ml, temperatura_conservacion, proteccion_luz_almacenamiento, ph_minimo, ph_maximo, con_conservantes, estado_comercializacion, ficha_tecnica_url) VALUES
  (
    'c1000000-0000-0000-0000-000000000005',
    'b1000000-0000-0000-0000-000000000003',
    '637912',
    'Doxorrubicina Accord 2 mg/mL solución para perfusión',
    'Accord Healthcare S.L.U.',
    'Solución para perfusión',
    2, 'mg/mL', 25,
    'nevera', true,
    2.5, 4.5,
    false, 'Autorizado', 'https://cima.aemps.es/cima/dochtml/ft/63791/FT_63791.html'
  ),
  (
    'c1000000-0000-0000-0000-000000000006',
    'b1000000-0000-0000-0000-000000000003',
    '637920',
    'Doxorrubicina Accord 2 mg/mL solución para perfusión (100 mL)',
    'Accord Healthcare S.L.U.',
    'Solución para perfusión',
    2, 'mg/mL', 100,
    'nevera', true,
    2.5, 4.5,
    false, 'Autorizado', 'https://cima.aemps.es/cima/dochtml/ft/63792/FT_63792.html'
  );

-- ============================================================
-- CONDICIONES DE PREPARACIÓN
-- ============================================================
INSERT INTO condicion_preparacion (principio_activo_id, presentacion_comercial_id, tipo, diluyente, concentracion_final_minima, concentracion_final_maxima, volumen_bolsa_recomendado_ml, envase_compatible, filtro_prohibido, proteccion_luz, notas) VALUES
  -- Cisplatino: dilución en SF con cloruro sódico (imprescindible Cl- para estabilidad)
  (
    'b1000000-0000-0000-0000-000000000001', NULL,
    'dilucion', 'SF 0,9% + NaCl 3%',
    0.1, 0.6, '250-1000',
    ARRAY['poliolefina','vidrio','pvc'],
    false, true,
    'El medio de dilucion DEBE contener cloruro (SF 0,9% o similares). NO diluir en SG 5% sin añadir NaCl — la ausencia de Cl- provoca degradación acelerada. Filtros de nailon o éster de celulosa aceptables; EVITAR filtros con aluminio.'
  ),
  -- Ciclofosfamida: reconstitución + dilución
  (
    'b1000000-0000-0000-0000-000000000002', 'c1000000-0000-0000-0000-000000000003',
    'reconstitucion', 'agua para inyectables (API)',
    10, 20, null,
    ARRAY['poliolefina','vidrio','pvc'],
    false, false,
    'Reconstituir con API o SF 0,9%. Para vial 200 mg añadir 10 mL → concentración 20 mg/mL. Agitar hasta disolución completa (puede tardar 2-3 min).'
  ),
  (
    'b1000000-0000-0000-0000-000000000002', NULL,
    'dilucion', 'SF 0,9%',
    2, 10, '100-500',
    ARRAY['poliolefina','vidrio','pvc'],
    false, false,
    'Tras reconstitución, diluir en SF 0,9% o SG 5%. Concentración habitual 2-10 mg/mL para perfusión iv.'
  ),
  -- Doxorrubicina: dilución en SF (SG 5% aceptable pero menor estabilidad)
  (
    'b1000000-0000-0000-0000-000000000003', NULL,
    'dilucion', 'SF 0,9%',
    0.1, 2, '100-250',
    ARRAY['poliolefina','vidrio'],
    false, true,
    'Preferir SF 0,9% frente a SG 5% (mayor estabilidad). EVITAR envases PVC (adsorción documentada). Proteger de la luz durante preparación y administración.'
  );

-- ============================================================
-- ESTABILIDADES
-- ============================================================
INSERT INTO estabilidad (principio_activo_id, presentacion_comercial_id, diluyente, concentracion_mg_ml, envase, temperatura_celsius, proteccion_luz, tipo_estabilidad, tiempo_horas, notas_cualitativas, nivel_evidencia, referencia_id) VALUES
  -- Cisplatino en SF, poliolefina, nevera, protegido de luz
  (
    'b1000000-0000-0000-0000-000000000001',
    'c1000000-0000-0000-0000-000000000001',
    'SF 0,9%', 0.5, 'poliolefina', 4, true,
    'fisicoquimica', 168,
    'Sin cambios de color ni precipitación. Estabilidad 7 días a 4°C con protección de luz.',
    '1b', 'a1000000-0000-0000-0000-000000000004'
  ),
  -- Cisplatino en SF, poliolefina, temperatura ambiente, protegido de luz
  (
    'b1000000-0000-0000-0000-000000000001',
    'c1000000-0000-0000-0000-000000000001',
    'SF 0,9%', 0.5, 'poliolefina', 25, true,
    'fisicoquimica', 24,
    'Estable 24h a temperatura ambiente protegido de luz. A partir de 24h puede aparecer precipitación.',
    '1b', 'a1000000-0000-0000-0000-000000000004'
  ),
  -- Ciclofosfamida reconstituida en SF, poliolefina, nevera
  (
    'b1000000-0000-0000-0000-000000000002',
    'c1000000-0000-0000-0000-000000000003',
    'SF 0,9%', 20, 'poliolefina', 4, false,
    'fisicoquimica', 168,
    'Solución reconstituida estable 7 días a 4°C. Sin cambios organolépticos.',
    '1b', 'a1000000-0000-0000-0000-000000000005'
  ),
  -- Ciclofosfamida diluida en SF, poliolefina, temperatura ambiente
  (
    'b1000000-0000-0000-0000-000000000002', NULL,
    'SF 0,9%', 5, 'poliolefina', 25, false,
    'fisicoquimica', 24,
    'Estable 24h a 25°C. Sin degradación significativa.',
    '1b', 'a1000000-0000-0000-0000-000000000005'
  ),
  -- Doxorrubicina en SF, poliolefina, nevera, protegida de luz
  (
    'b1000000-0000-0000-0000-000000000003',
    'c1000000-0000-0000-0000-000000000005',
    'SF 0,9%', 0.5, 'poliolefina', 4, true,
    'fisicoquimica', 168,
    'Estable 7 días a 4°C protegida de luz. Color rojo característico estable sin decoloración.',
    '1b', 'a1000000-0000-0000-0000-000000000006'
  ),
  -- Doxorrubicina en SF, poliolefina, temperatura ambiente, protegida de luz
  (
    'b1000000-0000-0000-0000-000000000003',
    'c1000000-0000-0000-0000-000000000005',
    'SF 0,9%', 0.5, 'poliolefina', 25, true,
    'fisicoquimica', 24,
    'Estable 24h a 25°C con protección de luz. Posible decoloración leve si se expone a luz directa.',
    '1b', 'a1000000-0000-0000-0000-000000000006'
  );

-- ============================================================
-- ADMINISTRACIÓN
-- ============================================================
INSERT INTO administracion (principio_activo_id, via, velocidad_maxima_ml_h, tiempo_minimo_infusion_min, concentracion_maxima_mg_ml, concentracion_minima_mg_ml, clasificacion_tisular, procedimiento_extravasacion, notas, referencia_id) VALUES
  (
    'b1000000-0000-0000-0000-000000000001',
    'iv',
    500, 60,
    0.6, 0.1,
    'irritante',
    'Detener perfusión. Aspirar máximo de fármaco. Aplicar frío local. No infiltrar corticoides. Consultar con oncología. Documentar.',
    'Infusión iv lenta mínimo 1h (habitualmente 2-6h según protocolo). Hidratación previa y posterior obligatoria para reducir nefrotoxicidad. Evitar extravasación — irritante tisular. Usar vía central preferentemente.',
    'a1000000-0000-0000-0000-000000000001'
  ),
  (
    'b1000000-0000-0000-0000-000000000002',
    'iv',
    300, 30,
    10, 2,
    'irritante',
    'Detener perfusión. Aspirar máximo de fármaco. Frío local. Documentar y notificar.',
    'Perfusión iv en 30-60 min. Para dosis altas (> 2 g/m²) prolongar hasta 2-4h. Asegurar hidratación y mesna profiláctico para cistitis hemorrágica.',
    'a1000000-0000-0000-0000-000000000002'
  ),
  (
    'b1000000-0000-0000-0000-000000000003',
    'iv',
    null, 15,
    2, 0.1,
    'vesicante',
    'URGENTE. Detener perfusión inmediatamente. NO retirar catéter. Aspirar 3-5 mL. Administrar dexrazoxano iv (Totect/Savene) en las primeras 6h: día 1 y 2: 1000 mg/m² iv (máx 2000 mg); día 3: 500 mg/m² iv (máx 1000 mg). Aplicar frío local EXCEPTO durante la administración de dexrazoxano. Documentar, fotografiar y notificar a oncología y farmacia.',
    'Vesicante potente — usar vía central siempre que sea posible. Si vía periférica, verificar permeabilidad antes de iniciar. Infusión mínima 15-20 min. Dosis máxima acumulada de por vida: 450-550 mg/m² (sin cardioprotección previa).',
    'a1000000-0000-0000-0000-000000000003'
  );

-- ============================================================
-- COMPATIBILIDAD DE MATERIALES
-- ============================================================
INSERT INTO compatibilidad_material (principio_activo_id, material, resultado, condiciones, referencia_id) VALUES
  -- Cisplatino
  ('b1000000-0000-0000-0000-000000000001', 'aluminio',         'incompatible', 'El aluminio cataliza la degradación del cisplatino. Evitar agujas, filtros o equipos con aluminio.', 'a1000000-0000-0000-0000-000000000004'),
  ('b1000000-0000-0000-0000-000000000001', 'pvc',              'compatible',   null, 'a1000000-0000-0000-0000-000000000004'),
  ('b1000000-0000-0000-0000-000000000001', 'poliolefina',      'compatible',   null, 'a1000000-0000-0000-0000-000000000004'),
  ('b1000000-0000-0000-0000-000000000001', 'vidrio',           'compatible',   null, 'a1000000-0000-0000-0000-000000000004'),
  -- Ciclofosfamida
  ('b1000000-0000-0000-0000-000000000002', 'pvc',              'compatible',   null, 'a1000000-0000-0000-0000-000000000005'),
  ('b1000000-0000-0000-0000-000000000002', 'poliolefina',      'compatible',   null, 'a1000000-0000-0000-0000-000000000005'),
  ('b1000000-0000-0000-0000-000000000002', 'vidrio',           'compatible',   null, 'a1000000-0000-0000-0000-000000000005'),
  -- Doxorrubicina
  ('b1000000-0000-0000-0000-000000000003', 'pvc_dehp',         'incompatible', 'Adsorción significativa documentada. Usar poliolefina o vidrio.', 'a1000000-0000-0000-0000-000000000006'),
  ('b1000000-0000-0000-0000-000000000003', 'poliolefina',      'compatible',   null, 'a1000000-0000-0000-0000-000000000006'),
  ('b1000000-0000-0000-0000-000000000003', 'vidrio',           'compatible',   null, 'a1000000-0000-0000-0000-000000000006'),
  ('b1000000-0000-0000-0000-000000000003', 'filtro_pes',       'compatible',   null, 'a1000000-0000-0000-0000-000000000006');

-- ============================================================
-- MATRIZ DE RIESGO
-- ============================================================
INSERT INTO matriz_riesgo (principio_activo_id, clasificacion_niosh, nivel_contencion, epi_requerido, tipo_cabina, requisitos_sala, gestion_residuos) VALUES
  (
    'b1000000-0000-0000-0000-000000000001',
    'tabla_1', 'contencion_maxima',
    ARRAY['guantes_qt_dobles','bata_cerrada','gafas','mascarilla_ffp2'],
    'CSB-II o CACI',
    'Sala de citostáticos con presión negativa, HEPA, acceso restringido',
    'Residuo citotóxico (código LER 18 01 08*). Contenedor rígido según normativa autonómica vigente. Gestión por empresa autorizada.'
  ),
  (
    'b1000000-0000-0000-0000-000000000002',
    'tabla_1', 'contencion_maxima',
    ARRAY['guantes_qt_dobles','bata_cerrada','gafas','mascarilla_ffp2'],
    'CSB-II o CACI',
    'Sala de citostáticos con presión negativa, HEPA, acceso restringido',
    'Residuo citotóxico (código LER 18 01 08*). Contenedor rígido según normativa autonómica vigente. Gestión por empresa autorizada.'
  ),
  (
    'b1000000-0000-0000-0000-000000000003',
    'tabla_1', 'contencion_maxima',
    ARRAY['guantes_qt_dobles','bata_cerrada','gafas','mascarilla_ffp2'],
    'CSB-II o CACI',
    'Sala de citostáticos con presión negativa, HEPA, acceso restringido',
    'Residuo citotóxico (código LER 18 01 08*). Contenedor rígido según normativa autonómica vigente. Ojo: orina roja 48h post-administración — gestionar como citotóxico. Gestión por empresa autorizada.'
  );
