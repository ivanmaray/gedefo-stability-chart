# Borrador de correo al equipo — subsanaciones GEDEFO-Chart (autocontenido)

**Para:** Bea Bernárdez; Elena Fernández; Lola Macía; Pilar González
**Asunto:** RE: 02 - GT GEDEFO: subsanaciones GEDEFO-Chart — propuesta de respuesta (antes del 5 julio)

---

Hola a todas/os:

¡Enhorabuena! Lo importante ya está: **el proyecto ha entrado en financiación**. Las 6 subsanaciones son de forma y de encaje presupuestario, no cuestionan el fondo del proyecto, y son asumibles de sobra antes del **5 de julio**.

Os dejo aquí mismo la **propuesta de respuesta punto por punto** (sin adjunto, para que lo podáis leer del tirón). Marco en 🟡 los dos que conviene que veamos en grupo (los que señaló Elena).

## Presupuesto aprobado

| Partida | Importe |
|---|---|
| Personal/honorarios | 0,00 € |
| Infraestructura técnica (hasta) | 2.000,00 € |
| Traducción | 700,00 € |
| Open Access | 2.500,00 € |
| **Total** | **5.200,00 €** |

*(La partida de traducción + Open Access se activa tras la 1ª publicación en Farmacia Hospitalaria.)*

## 1. Eliminación del medical writer

Se acepta la baja de la partida y la adecuación del presupuesto; la redacción de los manuscritos la asume el equipo. El presupuesto final queda en **5.200 €** (0 € personal). *(Pendiente: confirmar el importe exacto que figuraba como medical writer en la solicitud original para reflejar la baja en el cuadro.)*

## 2. 🟡 Modelo de desarrollo — A VALIDAR EN GRUPO

Propuesta: dejarlo claro como **desarrollo propio del equipo investigador (in-house)**, no proveedor externo ni SEFH. El desarrollo lo aporta el equipo **en especie** (no se imputa al presupuesto); los 2.000 € son **solo infraestructura en la nube y dominio**, no horas de desarrollo. Se construye sobre tecnologías estándar y código abierto (sin dependencia de un único proveedor). Es lo más sólido ante el tribunal y refuerza la sostenibilidad. **¿Lo confirmamos así?**

## 3. Desglose de los 2.000 € de infraestructura

Es íntegramente coste operativo de la plataforma en la nube (no horas de desarrollo), dimensionado para hasta 24 meses:

| Bloque funcional | Fase | Importe |
|---|---|---|
| Base de datos relacional + API REST pública | 0–1 | 600 € |
| Backend de sincronización con CIMA (tarea programada) | 0–2 | 100 € |
| Frontend público y despliegue web (+ CDN) | 0–1 | 480 € |
| Dominio, DNS y certificados | 0 | 60 € |
| Exportación de datos + API documentada (CSV/JSON) | 1 | 120 € |
| Compatibilidad en Y y adaptadores a bombas/aplicativos | 2 | 140 € |
| Puesta en producción, copias de seguridad, monitorización, accesibilidad | 0 | 300 € |
| Contingencia (picos de tráfico, excesos de cómputo CIMA) | — | 200 € |
| **Total** | | **2.000 €** |

## 4. Plan de sostenibilidad

Coste recurrente bajo (~550–600 €/año: alojamiento + dominio). Mantenimiento a cargo del **Grupo GEDEFO** con un coordinador-validador designado; propongo que la **SEFH aloje el dominio/infraestructura como activo del grupo**. La actualización de contenidos va por un **flujo de validación por pares** ya incorporado al diseño (borrador → revisión → validado, con dos revisores y fecha de próxima revisión), y la parte regulatoria se actualiza **automáticamente desde CIMA**. Al ser código abierto, cualquier miembro puede asumir el mantenimiento.

## 5. 🟡 Proceso Delphi — A VALIDAR EN GRUPO

Propuesta: **Delphi puntual** para (a) consensuar la metodología/estructura de ficha y (b) validar las fichas del proyecto piloto. La incorporación y actualización de nuevos fármacos **NO** irá por nuevas rondas Delphi, sino por el procedimiento de gobernanza (revisión por pares) del punto 4. Un Delphi continuo sería caro e insostenible. **¿Os parece bien?**

## 6. Coherencia difusión ↔ presupuesto

Plan de difusión en **dos fases**: (1) publicación primaria obligatoria en **Farmacia Hospitalaria** (sin coste); (2) publicación complementaria en **revista internacional** de prestigio en acceso abierto, citando el trabajo previo y firmando como Grupo de Trabajo SEFH — esto justifica las partidas de **traducción (700 €)** y **Open Access (2.500 €)**. Difusión adicional en congresos (SEFH, GEDEFO) sin coste. Así memoria y presupuesto quedan alineados.

## Anexo — Soporte metodológico SEFH

El proyecto contará con el servicio de soporte a la investigación de la SEFH (0 €, asumido por la FEFH): asesoramiento metodológico en el diseño/análisis del Delphi y en la estrategia de publicación, concentrado al inicio (diseño del Delphi) y al final (análisis y redacción). El proyecto **no implica intervención sobre pacientes**, por lo que no se prevén tasas de CEIm.

---

**Lo que necesito de vosotras/os:**

- Visto bueno (o matices) a los puntos **2 y 5**.
- El **importe exacto** del medical writer en la solicitud original.

Como a Elena le pilla de vacaciones, si queréis dejo yo montada la versión final del Anexo 4 + presupuesto para que solo haya que revisarla y enviarla a Raquel antes del 5 de julio. Decidme.

Un abrazo,
Iván
