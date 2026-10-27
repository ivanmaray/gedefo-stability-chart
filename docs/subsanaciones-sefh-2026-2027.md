# Respuesta a subsanaciones — Convocatoria Ayudas a Grupos de Trabajo SEFH 2026/2027

**Proyecto:** GEDEFO-Chart — Creación de una infraestructura compartida de conocimiento operativo para la estandarización de mezclas, estabilidad y soporte informático en Farmacia Oncohematológica.
**Grupo de Trabajo:** GEDEFO (SEFH)
**IP:** Elena Fernández Gabriel (Servicio de Farmacia, CHUAC — A Coruña)
**Equipo:** Iván Maray (HUCA, Oviedo) · Pilar González (CAULE, León) · Lola Macía (H. Cangas de Narcea) · Alicia Domínguez (Sant Pau, Barcelona) · Coord.: Bea Bernárdez
**Fecha límite de envío de subsanaciones:** 5 de julio de 2026
**Destinatario:** raquel.anton@sefh.es

> Documento de trabajo interno para preparar la versión final del modelo de solicitud (Anexo 4) y el presupuesto. Las cifras de infraestructura marcadas como *(propuesta)* deben validarse por el equipo antes del envío.

---

## Resumen del presupuesto aprobado

| Partida | Importe |
|---|---|
| 1. Gastos de personal/honorarios | 0,00 € |
| 2. Infraestructura técnica (hasta) | 2.000,00 € |
| 2. Traducción | 700,00 € |
| 2. Open Access | 2.500,00 € |
| **Total** | **5.200,00 €** |

*(\*) La partida de traducción + Open Access se activa tras la primera publicación en Farmacia Hospitalaria.*

---

## Condiciones específicas de la resolución (se aceptan)

La resolución supedita la ejecución del proyecto a cuatro condiciones, que el equipo **acepta** y sobre las que ya se está trabajando:

1. **Alojamiento en servidores de la SEFH.** La herramienta se alojará en la infraestructura de la SEFH mediante un **subdominio dentro de la web del Grupo de Trabajo GEDEFO**. Esto refuerza el plan de sostenibilidad (Punto 4) y condiciona el desglose de infraestructura (Punto 3).
2. **Reunión previa con informática de la SEFH.** Antes de iniciar el desarrollo en su entorno, se mantendrá una reunión con el equipo técnico de la SEFH para **verificar la compatibilidad** de la plataforma (base de datos PostgreSQL, backend serverless, frontend web) con los sistemas y bases de datos de la Sociedad. El desglose del Punto 3 se ajustará al resultado de esta reunión.
3. **Revisión jurídica.** Conforme avance el proyecto, el Departamento Jurídico de la SEFH incorporará las cláusulas, avisos y condiciones necesarias en materia de **responsabilidad, protección de datos y propiedad intelectual**.
4. **Convenio de cesión SEFH–desarrollador.** Se formalizará un convenio con el desarrollador (**Iván Maray**) para regular la **cesión de la herramienta a la SEFH** y su uso gratuito por todos los socios; la resolución contempla asimismo estudiar una **contraprestación al desarrollador** por dicha cesión. Esta contraprestación es **independiente** del presupuesto de este proyecto (0 € en gastos de personal), que no financia horas de desarrollo.

---

## Punto 1 — Eliminación de la partida de *medical writer*

Se **acepta la eliminación** de la partida correspondiente al *medical writer* y la consiguiente adecuación del presupuesto. La redacción científica de los manuscritos será asumida directamente por el equipo investigador, conforme a la política de la convocatoria.

El presupuesto resultante se ajusta al cuadro aprobado por el Tribunal Evaluador, con un total de **5.200,00 €** y **0 €** en gastos de personal.

> ⚠️ *Pendiente:* confirmar el importe original que figuraba como medical writer en la solicitud, para reflejar la baja exacta en el cuadro presupuestario revisado.

---

## Punto 2 — Modelo de desarrollo del proyecto

> 🟡 **PENDIENTE DE VALIDAR CON GEDEFO** (punto marcado por Elena para hablar con Bea). La redacción siguiente es la propuesta del equipo técnico; debe confirmarse en reunión antes de la versión final.

El desarrollo de la infraestructura tecnológica lo realiza **el propio equipo investigador (desarrollo *in-house*)**. No se contrata a un proveedor externo ni se delega en la SEFH la construcción de la plataforma.

- Miembros del equipo con perfil técnico asumen el **diseño, desarrollo y mantenimiento** de la base de datos relacional, la API pública y la interfaz web, como **aportación en especie** del grupo (no imputada al presupuesto).
- La partida de infraestructura técnica (2.000 €) **no financia trabajo de desarrollo**, sino **exclusivamente los costes de alojamiento en la nube, dominio y herramientas operativas** necesarios para mantener el servicio en producción (ver Punto 3).
- El proyecto se construye sobre **tecnologías estándar y código abierto** (base de datos PostgreSQL gestionada, backend de funciones serverless, frontend web), lo que evita la dependencia de un único proveedor (*vendor lock-in*) y garantiza la portabilidad.

Este modelo asegura **independencia tecnológica, control del equipo sobre el producto y sostenibilidad** (ver Punto 4), y es coherente con el requisito de la convocatoria de que los desarrollos informáticos repercutan en la SEFH sin fines lucrativos.

**Encaje con las condiciones de la resolución.** El desarrollo *in-house* es plenamente compatible con lo previsto en la resolución: (i) la herramienta se **cede a la SEFH** mediante convenio con el desarrollador (Iván Maray) para uso gratuito de todos los socios; (ii) se aloja en la **infraestructura de la SEFH** (subdominio GEDEFO), previa reunión con su informática; y (iii) la eventual **contraprestación al desarrollador** que estudia la SEFH es ajena a este presupuesto —que mantiene **0 € en gastos de personal**— y retribuiría la cesión de la herramienta, no horas imputadas al proyecto.

---

## Punto 3 — Desglose del importe de infraestructura técnica (≤ 2.000 €)

El importe corresponde **íntegramente a costes operativos de la plataforma en la nube** durante el periodo del proyecto (y su mantenimiento), no a horas de desarrollo. Desglose por bloque funcional, fase del proyecto y concepto de coste:

| Bloque funcional | Fase | Concepto de coste | Importe *(propuesta)* |
|---|---|---|---|
| Base de datos relacional + API REST pública (PostgreSQL gestionado + capa REST automática) | Fase 0–1 | Plan de producción gestionado (~25 €/mes) | 600 € |
| Backend de sincronización con CIMA (funciones serverless + tarea programada semanal) | Fase 0–2 | Cómputo de funciones + registro de auditoría | 100 € |
| Frontend público y despliegue web (web pública + CDN) | Fase 0–1 | Plan de hosting de producción (~20 €/mes) | 480 € |
| Dominio, DNS y certificados | Fase 0 | Registro y renovación | 60 € |
| Exportación de datos y API documentada (CSV/JSON, documentación OpenAPI) | Fase 1 | Almacenamiento + ancho de banda | 120 € |
| Módulo de compatibilidad en Y y adaptadores a aplicativos/bombas | Fase 2 | Almacenamiento/cómputo adicional | 140 € |
| Configuración de entorno productivo, copias de seguridad, monitorización y accesibilidad | Fase 0 | Puesta en producción + auditoría | 300 € |
| Contingencia (picos de tráfico tras difusión, excesos de cómputo en sincronización CIMA) | Transversal | Reserva | 200 € |
| **Total** | | | **2.000 €** |

**Correspondencia funcionalidades ↔ fases:**

- **Fase 0 (esqueleto operativo):** base de datos completa, sincronización con CIMA, web pública de consulta (principios activos → presentaciones → estabilidades/preparación/administración). Es el núcleo del **proyecto piloto**.
- **Fase 1 (apertura de datos):** exportación CSV/JSON y API pública documentada para interoperabilidad con otros sistemas.
- **Fase 2 (interoperabilidad avanzada):** compatibilidad en Y y adaptadores para alimentar bombas inteligentes y aplicativos de prescripción/preparación.

> El desglose está dimensionado para una duración de hasta **24 meses** (proyecto + seguimiento). Si la duración financiada es de 12 meses, las partidas de alojamiento recurrente se reducen proporcionalmente y la diferencia se reasigna a contingencia/seguimiento.

> ⚠️ **Sujeto a la reunión con informática de la SEFH.** Este desglose está dimensionado para un despliegue en **nube gestionada** (PostgreSQL + hosting web). Dado que la resolución exige el **alojamiento en servidores de la SEFH** (subdominio GEDEFO), en la reunión técnica previa se verificará qué parte de la infraestructura puede asumir directamente la SEFH. **Si la SEFH aloja la base de datos y/o el frontend**, las partidas de alojamiento recurrente (base de datos ~600 € y frontend ~480 €) **se reducen o se reasignan** a puesta en producción, copias de seguridad, monitorización, accesibilidad y contingencia, manteniendo el tope de **2.000 €**. El importe final se ajustará al modelo de despliegue que se acuerde con su informática.

---

## Punto 4 — Plan de sostenibilidad

La sostenibilidad está garantizada por el **bajo coste recurrente** y por un **modelo de mantenimiento ya incorporado al diseño** de la plataforma:

**1. Coste de mantenimiento bajo y asumible.** Una vez en producción, el coste recurrente de infraestructura es de aproximadamente **550–600 €/año** (alojamiento gestionado + dominio). Al ser el desarrollo *in-house*, no existen costes de licencia ni de mantenimiento por terceros.

**2. Responsable del mantenimiento: el Grupo de Trabajo GEDEFO.** La actualización de contenidos y la supervisión técnica recaen en el grupo, con un **coordinador-validador designado**. En coherencia con la resolución, la plataforma se **aloja en la infraestructura de la SEFH** (subdominio GEDEFO) como **activo del grupo de trabajo**, y su cesión se regula mediante convenio (ver Condiciones específicas), de forma que la plataforma no depende de una persona o centro concreto.

**3. Mantenimiento de contenidos mediante gobernanza estructurada.** El modelo de datos incorpora un **flujo de validación por pares** (estados *borrador → en revisión → validado → obsoleto*, con autor, dos revisores, coordinador-validador y fecha de próxima revisión). Cada ficha tiene trazabilidad y caducidad de revisión, lo que convierte la actualización en un **proceso reglado y distribuido**, no dependiente de financiación recurrente.

**4. Actualización regulatoria automática.** La sincronización programada con **CIMA (AEMPS)** mantiene al día de forma automática los datos de las presentaciones comerciales (estado de comercialización, ficha técnica, composición), registrando los cambios para revisión por el grupo.

**5. Código abierto y portabilidad.** Al basarse en estándares abiertos, cualquier miembro del grupo (presente o futuro) puede asumir el mantenimiento, evitando la dependencia de un único desarrollador o proveedor.

---

## Punto 5 — Naturaleza del proceso Delphi

> 🟡 **PENDIENTE DE VALIDAR CON GEDEFO** (punto marcado por Elena para hablar con Bea). La redacción siguiente es la propuesta del equipo técnico; debe confirmarse en reunión antes de la versión final.

El proceso Delphi es una **actividad puntual** con dos objetivos:

1. **Consensuar la metodología** y la estructura de la ficha de estabilidad/preparación (qué campos, qué fuentes, qué niveles de evidencia, criterios de validación).
2. **Validar el conjunto de fichas del proyecto piloto** incluidas en esta fase.

La **incorporación y actualización continua de nuevos fármacos NO se realizará mediante nuevas rondas Delphi**, sino a través del **procedimiento de gobernanza permanente** descrito en el Punto 4 (autor → revisor 1 → revisor 2 → coordinador-validador, con fecha de próxima revisión). 

Esta distinción es deliberada: un Delphi continuo sería costoso e insostenible, mientras que el flujo de revisión por pares permite mantener y ampliar el contenido de forma ágil, trazable y sin coste recurrente, en coherencia con el plan de sostenibilidad.

---

## Punto 6 — Coherencia entre plan de difusión y presupuesto

El plan de difusión se articula en **dos fases**, lo que justifica las partidas de traducción y Open Access:

**Fase 1 — Publicación primaria (obligatoria).** Primer manuscrito con los resultados del proyecto en la revista **Farmacia Hospitalaria**, órgano de expresión oficial de la SEFH, firmando como Grupo de Trabajo GEDEFO. *Sin coste de publicación.*

**Fase 2 — Publicación complementaria internacional.** Tras la publicación en Farmacia Hospitalaria, publicación complementaria/final en una **revista internacional de prestigio** con acceso abierto, citando el trabajo previo en Farmacia Hospitalaria y firmando como Grupo de Trabajo SEFH. Esta fase justifica las partidas de **traducción (700 €)** y **Open Access (2.500 €)**, conforme a lo previsto en la resolución del Tribunal.

**Difusión adicional sin coste:** comunicaciones en congresos nacionales (SEFH, GEDEFO) y presentación de la plataforma a los servicios de farmacia oncohematológica.

Con esta redacción en dos fases, el plan de difusión de la memoria queda **plenamente alineado** con el presupuesto aprobado.

---

## Anexo — Soporte metodológico de la SEFH

Conforme a lo indicado en la resolución, el proyecto contará con el **servicio de soporte a la investigación de la SEFH** (coste 0 €, asumido por la FEFH). En la memoria se detallará:

- **Funciones:** asesoramiento metodológico en el diseño y análisis del proceso Delphi (selección de panel, rondas, criterios de consenso) y en la estrategia de publicación.
- **Tiempo aproximado:** *(a estimar — p. ej. soporte puntual en fase de diseño del Delphi y en fase de análisis/redacción).*
- **Cronograma:** concentrado en el inicio del proyecto (diseño del Delphi) y en la fase final (análisis y publicación).

> Nota: el proyecto se basa en consenso de expertos (Delphi) y datos técnicos de fuentes documentales; **no implica intervención sobre pacientes**, por lo que no se prevén tasas de CEIm ni partidas asociadas.

---

## Checklist de envío antes del 5 de julio

- [ ] Versión final del **Anexo 4** (modelo de solicitud) con la redacción de los 6 puntos.
- [ ] **Presupuesto** revisado: medical writer eliminado, total 5.200 € (0 € personal).
- [ ] Desglose de infraestructura validado por el equipo.
- [ ] Postura de grupo confirmada en Puntos 2 (in-house) y 5 (Delphi puntual) — consultar con GEDEFO/Bea.
- [ ] Detalle del soporte metodológico SEFH (tiempo/funciones/cronograma, 0 €).
- [ ] **Aceptación expresa** de las 4 condiciones específicas (alojamiento SEFH, reunión con informática, revisión jurídica, convenio de cesión).
- [ ] **Decisión de grupo** sobre la contraprestación al desarrollador (Iván): cómo se plantea en el convenio, al margen del presupuesto del proyecto.
- [ ] Envío a raquel.anton@sefh.es.
