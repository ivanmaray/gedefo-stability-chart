-- ============================================================
-- 00036_estabilidad_stabilis_real.sql
--
-- Reemplaza los datos de estabilidad semilla (aproximados) por
-- los datos reales de Stabilis 4.0 con sus referencias primarias.
-- Fuente consultada: www.stabilis.org, abril 2026.
-- ============================================================

-- ── 1. ELIMINAR ENTRADAS FALSAS ───────────────────────────────
DELETE FROM estabilidad
WHERE referencia_id IN (
  'a1000000-0000-0000-0000-000000000004',
  'a1000000-0000-0000-0000-000000000005',
  'a1000000-0000-0000-0000-000000000006'
);

-- Eliminar las referencias genéricas de Stabilis (reemplazadas por refs primarias)
DELETE FROM referencia WHERE id IN (
  'a1000000-0000-0000-0000-000000000004',
  'a1000000-0000-0000-0000-000000000005',
  'a1000000-0000-0000-0000-000000000006'
);

-- ── 2. REFERENCIAS PRIMARIAS ──────────────────────────────────

-- Ref 3670: Sewell & Massimini 2014 (cisplatino PO, 28d)
INSERT INTO referencia (id, tipo_fuente, autores, titulo, revista, anio, url, fecha_consulta) VALUES
('b1000000-0000-0000-0000-000000003670', 'pubmed',
 'Sewell G, Massimini M',
 'Studies on the stability and compatibility of cytotoxic drug infusion with the Tevadaptor system',
 'European Journal of Oncology Pharmacy', 2014,
 'https://www.stabilis.org/Bibliographie.php?IdBiblio=3670', '2026-04-16');

-- Ref 4137: Patel & Sewell 2018 (cisplatino PO 25°C, 21d)
INSERT INTO referencia (id, tipo_fuente, autores, titulo, revista, anio, url, fecha_consulta) VALUES
('b1000000-0000-0000-0000-000000004137', 'pubmed',
 'Patel T, Sewell G',
 'Short Report: Extended Stability Studies on Bortezomib Injection and Infusions of Cisplatin and Pemetrexed (all Accord Healthcare)',
 'Newsletter Stabilis', 2018,
 'https://www.stabilis.org/Bibliographie.php?IdBiblio=4137', '2026-04-16');

-- Ref 3183: Sewell G 2010 (cisplatino PVC, 28d)
INSERT INTO referencia (id, tipo_fuente, autores, titulo, revista, anio, url, fecha_consulta) VALUES
('b1000000-0000-0000-0000-000000003183', 'pubmed',
 'Sewell G',
 'Physical and chemical stability of cisplatin infusions in PVC containers',
 'European Journal of Oncology Pharmacy', 2010,
 'https://www.stabilis.org/Bibliographie.php?IdBiblio=3183', '2026-04-16');

-- Ref 149: Rochard et al. 1992 (cisplatino EVA)
INSERT INTO referencia (id, tipo_fuente, autores, titulo, revista, anio, doi, url, fecha_consulta) VALUES
('b1000000-0000-0000-0000-000000000149', 'pubmed',
 'Rochard E, Barthes D, Courtois P',
 'Stability of cisplatin in ethylene vinylacetate portable infusion-pump reservoirs',
 'J Clin Pharm Ther', 1992,
 '10.1111/j.1365-2710.1992.tb01310.x',
 'https://www.stabilis.org/Bibliographie.php?IdBiblio=149', '2026-04-16');

-- Ref 4989: Dr. Reddy's 2023 (ciclofosfamida PO, datos fabricante)
INSERT INTO referencia (id, tipo_fuente, autores, titulo, revista, anio, url, fecha_consulta, notas) VALUES
('b1000000-0000-0000-0000-000000004989', 'pubmed',
 'Dr. Reddy''s Laboratories',
 'Extended dilution stability study report of cyclophosphamide concentrate for solution for infusion at room temperature and refrigerated condition (2-8°C)',
 'Personal communication', 2023,
 'https://www.stabilis.org/Bibliographie.php?IdBiblio=4989', '2026-04-16',
 'Datos del fabricante. Comunicación personal julio 2025.');

-- Ref 172: Beijnen et al. 1992 (ciclofosfamida PVC/vidrio)
INSERT INTO referencia (id, tipo_fuente, autores, titulo, revista, anio, url, fecha_consulta) VALUES
('b1000000-0000-0000-0000-000000000172', 'pubmed',
 'Beijnen JH, van Gijn R, Challa EE, Kaijser GP, Underberg WJM',
 'Chemical stability of two sterile, parenteral formulations of cyclophosphamide (Endoxan) after reconstitution and dilution in commonly used infusion fluids',
 'J Parenter Sci Technol', 1992,
 'https://www.stabilis.org/Bibliographie.php?IdBiblio=172', '2026-04-16');

-- Ref 40: Dine et al. 1994 (ciclofosfamida PVC, 30d)
INSERT INTO referencia (id, tipo_fuente, autores, titulo, revista, anio, url, fecha_consulta) VALUES
('b1000000-0000-0000-0000-000000000040', 'pubmed',
 'Dine T, Lebegue S, Benaji B, Gressier B, Segard V, Goudaliez F, Luyckx M, Brunet C, Mallevais ML, Kablan J, Cazin M, Cazin JC',
 'Stability and compatibility studies of four cytostatic agents (fluorouracil, dacarbazine, cyclophosphamide and ifosfamide) with PVC infusion bags',
 'Pharm Sci Communications', 1994,
 'https://www.stabilis.org/Bibliographie.php?IdBiblio=40', '2026-04-16');

-- Ref 686: Wood et al. 1990 (doxorubicina jeringa/bolsa)
INSERT INTO referencia (id, tipo_fuente, autores, titulo, revista, anio, doi, url, fecha_consulta) VALUES
('b1000000-0000-0000-0000-000000000686', 'pubmed',
 'Wood MJ, Irwin WJ, Scott DK',
 'Stability of doxorubicin, daunorubicin and epirubicin in plastic syringes and minibags',
 'J Clin Pharm Ther', 1990,
 '10.1111/j.1365-2710.1990.tb00386.x',
 'https://www.stabilis.org/Bibliographie.php?IdBiblio=686', '2026-04-16');

-- Ref 142: Rochard et al. 1992 (doxorubicina EVA)
INSERT INTO referencia (id, tipo_fuente, autores, titulo, revista, anio, url, fecha_consulta) VALUES
('b1000000-0000-0000-0000-000000000142', 'pubmed',
 'Rochard EB, Barthes DMC, Courtois PY',
 'Stability of fluorouracil, cytarabine, or doxorubicin hydrochloride in ethylene vinylacetate portable infusion-pump reservoirs',
 'Am J Hosp Pharm', 1992,
 'https://www.stabilis.org/Bibliographie.php?IdBiblio=142', '2026-04-16');

-- Ref 740: Hoffman et al. 1979 (doxorubicina vidrio)
INSERT INTO referencia (id, tipo_fuente, autores, titulo, revista, anio, url, fecha_consulta) VALUES
('b1000000-0000-0000-0000-000000000740', 'pubmed',
 'Hoffman DM, Grossano DD, Damin LA, Woodcock TM',
 'Stability of refrigerated and frozen solutions of doxorubicin hydrochloride',
 'Am J Hosp Pharm', 1979,
 'https://www.stabilis.org/Bibliographie.php?IdBiblio=740', '2026-04-16');

-- Ref 681: Walker et al. 1991 (doxorubicina jeringas/vidrio)
INSERT INTO referencia (id, tipo_fuente, autores, titulo, revista, anio, url, fecha_consulta) VALUES
('b1000000-0000-0000-0000-000000000681', 'pubmed',
 'Walker S, Lau D, DeAngelis C, Iazetta J, Coons C',
 'Doxorubicin stability in syringes and glass vials and evaluation of chemical contamination',
 'Canadian Journal of Hospital Pharmacy', 1991,
 'https://www.stabilis.org/Bibliographie.php?IdBiblio=681', '2026-04-16');

-- Ref 2256: Ebewe Pharma 2007 (doxorubicina, datos fabricante)
INSERT INTO referencia (id, tipo_fuente, autores, titulo, revista, anio, url, fecha_consulta, notas) VALUES
('b1000000-0000-0000-0000-000000002256', 'pubmed',
 'Ebewe Pharma',
 'Stability of doxorubicin ''Ebewe'' infusion solutions',
 'Ebewe Pharma (laboratory data)', 2007,
 'https://www.stabilis.org/Bibliographie.php?IdBiblio=2256', '2026-04-16',
 'Datos del fabricante.');

-- ── 3. ENTRADAS DE ESTABILIDAD REALES ────────────────────────
-- Todas a nivel PA (presentacion_comercial_id = null), tipo fisicoquímica

-- ── CISPLATINO ────────────────────────────────────────────────

-- PO · SF 0,9% · 0,5 mg/mL · 2-8°C · 28d · luz (ref 3670, nivel A+)
INSERT INTO estabilidad (principio_activo_id, diluyente, concentracion_mg_ml, envase,
  temperatura_celsius, proteccion_luz, tipo_estabilidad, tiempo_horas,
  nivel_evidencia, referencia_id)
VALUES ('b1000000-0000-0000-0000-000000000001',
  'SF 0,9%', 0.5, 'poliolefina', 4, true, 'fisicoquimica', 672, 'A+',
  'b1000000-0000-0000-0000-000000003670');

-- PO · SF 0,9% · 0,06 mg/mL · 25°C · 21d · luz (ref 4137, nivel A+)
INSERT INTO estabilidad (principio_activo_id, diluyente, concentracion_mg_ml, envase,
  temperatura_celsius, proteccion_luz, tipo_estabilidad, tiempo_horas,
  nivel_evidencia, referencia_id)
VALUES ('b1000000-0000-0000-0000-000000000001',
  'SF 0,9%', 0.06, 'poliolefina', 25, true, 'fisicoquimica', 504, 'A+',
  'b1000000-0000-0000-0000-000000004137');

-- PVC · SF 0,9% · 0,1 mg/mL · 25°C · 28d · luz (ref 3183)
INSERT INTO estabilidad (principio_activo_id, diluyente, concentracion_mg_ml, envase,
  temperatura_celsius, proteccion_luz, tipo_estabilidad, tiempo_horas,
  referencia_id)
VALUES ('b1000000-0000-0000-0000-000000000001',
  'SF 0,9%', 0.1, 'pvc', 25, true, 'fisicoquimica', 672,
  'b1000000-0000-0000-0000-000000003183');

-- PVC · SF 0,9% · 0,4 mg/mL · 25°C · 28d · luz (ref 3183)
INSERT INTO estabilidad (principio_activo_id, diluyente, concentracion_mg_ml, envase,
  temperatura_celsius, proteccion_luz, tipo_estabilidad, tiempo_horas,
  referencia_id)
VALUES ('b1000000-0000-0000-0000-000000000001',
  'SF 0,9%', 0.4, 'pvc', 25, true, 'fisicoquimica', 672,
  'b1000000-0000-0000-0000-000000003183');

-- EVA · SF 0,9% · 0,5 mg/mL · 22°C · 28d · luz (ref 149)
INSERT INTO estabilidad (principio_activo_id, diluyente, concentracion_mg_ml, envase,
  temperatura_celsius, proteccion_luz, tipo_estabilidad, tiempo_horas,
  referencia_id)
VALUES ('b1000000-0000-0000-0000-000000000001',
  'SF 0,9%', 0.5, 'eva', 22, true, 'fisicoquimica', 672,
  'b1000000-0000-0000-0000-000000000149');

-- EVA · SF 0,9% · 0,9 mg/mL · 35°C · 28d · luz (ref 149)
INSERT INTO estabilidad (principio_activo_id, diluyente, concentracion_mg_ml, envase,
  temperatura_celsius, proteccion_luz, tipo_estabilidad, tiempo_horas,
  referencia_id)
VALUES ('b1000000-0000-0000-0000-000000000001',
  'SF 0,9%', 0.9, 'eva', 35, true, 'fisicoquimica', 672,
  'b1000000-0000-0000-0000-000000000149');

-- ── CICLOFOSFAMIDA ────────────────────────────────────────────

-- PO · SF 0,9% · 20 mg/mL · 2-8°C · 6d · luz (ref 4989)
INSERT INTO estabilidad (principio_activo_id, diluyente, concentracion_mg_ml, envase,
  temperatura_celsius, proteccion_luz, tipo_estabilidad, tiempo_horas,
  referencia_id)
VALUES ('b1000000-0000-0000-0000-000000000002',
  'SF 0,9%', 20, 'poliolefina', 4, true, 'fisicoquimica', 144,
  'b1000000-0000-0000-0000-000000004989');

-- PO · SF 0,9% · 20 mg/mL · 25°C · 24h · luz (ref 4989)
INSERT INTO estabilidad (principio_activo_id, diluyente, concentracion_mg_ml, envase,
  temperatura_celsius, proteccion_luz, tipo_estabilidad, tiempo_horas,
  referencia_id)
VALUES ('b1000000-0000-0000-0000-000000000002',
  'SF 0,9%', 20, 'poliolefina', 25, true, 'fisicoquimica', 24,
  'b1000000-0000-0000-0000-000000004989');

-- PO · SF 0,9% · 2 mg/mL · 2-8°C · 5d · luz (ref 4989)
INSERT INTO estabilidad (principio_activo_id, diluyente, concentracion_mg_ml, envase,
  temperatura_celsius, proteccion_luz, tipo_estabilidad, tiempo_horas,
  referencia_id)
VALUES ('b1000000-0000-0000-0000-000000000002',
  'SF 0,9%', 2, 'poliolefina', 4, true, 'fisicoquimica', 120,
  'b1000000-0000-0000-0000-000000004989');

-- PO · SF 0,9% · 2 mg/mL · 25°C · 60h · luz (ref 4989)
INSERT INTO estabilidad (principio_activo_id, diluyente, concentracion_mg_ml, envase,
  temperatura_celsius, proteccion_luz, tipo_estabilidad, tiempo_horas,
  referencia_id)
VALUES ('b1000000-0000-0000-0000-000000000002',
  'SF 0,9%', 2, 'poliolefina', 25, true, 'fisicoquimica', 60,
  'b1000000-0000-0000-0000-000000004989');

-- PVC · SF 0,9% · 1 mg/mL · 4°C · 7d · luz (ref 172)
INSERT INTO estabilidad (principio_activo_id, diluyente, concentracion_mg_ml, envase,
  temperatura_celsius, proteccion_luz, tipo_estabilidad, tiempo_horas,
  referencia_id)
VALUES ('b1000000-0000-0000-0000-000000000002',
  'SF 0,9%', 1, 'pvc', 4, true, 'fisicoquimica', 168,
  'b1000000-0000-0000-0000-000000000172');

-- PVC · SF 0,9% · 1 mg/mL · 25°C · 7d · luz (ref 172)
INSERT INTO estabilidad (principio_activo_id, diluyente, concentracion_mg_ml, envase,
  temperatura_celsius, proteccion_luz, tipo_estabilidad, tiempo_horas,
  referencia_id)
VALUES ('b1000000-0000-0000-0000-000000000002',
  'SF 0,9%', 1, 'pvc', 25, true, 'fisicoquimica', 168,
  'b1000000-0000-0000-0000-000000000172');

-- PVC · SF 0,9% · 10 mg/mL · 4°C · 30d · luz (ref 40)
INSERT INTO estabilidad (principio_activo_id, diluyente, concentracion_mg_ml, envase,
  temperatura_celsius, proteccion_luz, tipo_estabilidad, tiempo_horas,
  referencia_id)
VALUES ('b1000000-0000-0000-0000-000000000002',
  'SF 0,9%', 10, 'pvc', 4, true, 'fisicoquimica', 720,
  'b1000000-0000-0000-0000-000000000040');

-- ── DOXORUBICINA ──────────────────────────────────────────────

-- Vidrio · API · 2 mg/mL · 4°C · 180d · luz (ref 740)
INSERT INTO estabilidad (principio_activo_id, diluyente, concentracion_mg_ml, envase,
  temperatura_celsius, proteccion_luz, tipo_estabilidad, tiempo_horas,
  referencia_id)
VALUES ('b1000000-0000-0000-0000-000000000003',
  'API', 2, 'vidrio', 4, true, 'fisicoquimica', 4320,
  'b1000000-0000-0000-0000-000000000740');

-- PVC · SF 0,9% · 0,1 mg/mL · 4°C · 43d · luz (ref 686)
INSERT INTO estabilidad (principio_activo_id, diluyente, concentracion_mg_ml, envase,
  temperatura_celsius, proteccion_luz, tipo_estabilidad, tiempo_horas,
  nivel_evidencia, referencia_id)
VALUES ('b1000000-0000-0000-0000-000000000003',
  'SF 0,9%', 0.1, 'pvc', 4, true, 'fisicoquimica', 1032, 'C',
  'b1000000-0000-0000-0000-000000000686');

-- PVC · SF 0,9% · 0,1-1 mg/mL · 2-8°C · 28d · luz (ref 2256, fabricante)
INSERT INTO estabilidad (principio_activo_id, diluyente, concentracion_mg_ml, envase,
  temperatura_celsius, proteccion_luz, tipo_estabilidad, tiempo_horas,
  notas_cualitativas, referencia_id)
VALUES ('b1000000-0000-0000-0000-000000000003',
  'SF 0,9%', 0.1, 'pvc', 4, true, 'fisicoquimica', 672,
  'Rango de concentración 0,1-1 mg/mL según ficha Ebewe. Datos de fabricante.',
  'b1000000-0000-0000-0000-000000002256');

-- PVC · SF 0,9% · 0,1 mg/mL · 20-25°C · 4d · sin luz (ref 2256, fabricante)
INSERT INTO estabilidad (principio_activo_id, diluyente, concentracion_mg_ml, envase,
  temperatura_celsius, proteccion_luz, tipo_estabilidad, tiempo_horas,
  referencia_id)
VALUES ('b1000000-0000-0000-0000-000000000003',
  'SF 0,9%', 0.1, 'pvc', 25, false, 'fisicoquimica', 96,
  'b1000000-0000-0000-0000-000000002256');

-- EVA · SF 0,9% · 0,5 mg/mL · 22°C · 14d · luz (ref 142)
INSERT INTO estabilidad (principio_activo_id, diluyente, concentracion_mg_ml, envase,
  temperatura_celsius, proteccion_luz, tipo_estabilidad, tiempo_horas,
  referencia_id)
VALUES ('b1000000-0000-0000-0000-000000000003',
  'SF 0,9%', 0.5, 'eva', 22, true, 'fisicoquimica', 336,
  'b1000000-0000-0000-0000-000000000142');

-- EVA · SF 0,9% · 0,5 mg/mL · 4°C · 14d · luz (ref 142)
INSERT INTO estabilidad (principio_activo_id, diluyente, concentracion_mg_ml, envase,
  temperatura_celsius, proteccion_luz, tipo_estabilidad, tiempo_horas,
  referencia_id)
VALUES ('b1000000-0000-0000-0000-000000000003',
  'SF 0,9%', 0.5, 'eva', 4, true, 'fisicoquimica', 336,
  'b1000000-0000-0000-0000-000000000142');

-- Jeringa PP · SF 0,9% · 1-2 mg/mL · 4°C · 124d · luz (ref 681)
INSERT INTO estabilidad (principio_activo_id, diluyente, concentracion_mg_ml, envase,
  temperatura_celsius, proteccion_luz, tipo_estabilidad, tiempo_horas,
  nivel_evidencia, referencia_id)
VALUES ('b1000000-0000-0000-0000-000000000003',
  'SF 0,9%', 2, 'jeringa_pp', 4, true, 'fisicoquimica', 2976, 'C',
  'b1000000-0000-0000-0000-000000000681');

-- Jeringa PP · SF 0,9% · 1-2 mg/mL · 23°C · 124d · luz (ref 681)
INSERT INTO estabilidad (principio_activo_id, diluyente, concentracion_mg_ml, envase,
  temperatura_celsius, proteccion_luz, tipo_estabilidad, tiempo_horas,
  nivel_evidencia, referencia_id)
VALUES ('b1000000-0000-0000-0000-000000000003',
  'SF 0,9%', 2, 'jeringa_pp', 23, true, 'fisicoquimica', 2976, 'C',
  'b1000000-0000-0000-0000-000000000681');
