# Qwen — índice de los 1.294 chats

## Cifras

- **2.562** conversaciones leídas de dos exports de la misma cuenta.
- **1.294** distintas tras deduplicar por título y tamaño.
- **42,2 M** caracteres de texto.
- Rango: **2025-02-20 → 2026-11-07**.
- Modelos usados en el export: `qwen3.6-plus`, `qwen3.7-plus`, `qwen3.7-max`, `qwen3.8-omax`, `glm-5.2`.

El índice completo, con fechas, número de mensajes y señal narrativa por chat, está en
`chats.csv`.

## Clasificación por tema

| Tema | Chats |
|---|---|
| Otros (consultas sueltas, mezcla) | 680 |
| Web / UX / visual | 188 |
| Sistemas / agentes / infraestructura | 184 |
| Identidad / biografía / voz | 102 |
| **JUDAS / era / mito** | **99** |
| Negocio / legal / documental | 22 |
| Música / audio | 19 |

La clasificación es por título y es orientativa: un chat de "web" contiene a menudo media
narrativa de la era, y uno de "JUDAS" contiene media implementación.

## Dónde está la sustancia

1. **Narrativa de la era** → `NARRATIVA.md`. Sale sobre todo de *Judas: Arquitectura del
   Alma*, *Frecuencia Belentani*, *Judas Era Unveiled*, *Universo Belentani: JUDAS* y
   *Lore Belentani Completa*.
2. **Voz del artista sobre su propia obra** (reglas, vetos, correcciones) → también en
   `NARRATIVA.md`, sección "Reglas declaradas".
3. **Biografía fechada y verificable** → `NARRATIVA.md`, sección "Bio canónica".
4. **Estructura de la web y menú** → `NARRATIVA.md`, sección "Arquitectura declarada".
   Coincide punto por punto con `src/lib/platform-navigation.ts`.
5. **Satélites sociales** (Espejo de Judas, Dual Scars, Mental Map, EcoSilencio, TomaAgua)
   → `NARRATIVA.md`, sección "Satélites".
6. **Material técnico** (prompts maestros de web, agentes, PowerShell, pipelines) →
   se queda en los textos de `BELENTANI_RECUPERADO\qwen-export\texts\`; no se versiona
   porque es ejecución, no canon.

## Conversaciones con más señal

`señal` = recuento de términos narrativos. No mide calidad: mide densidad. *Plan Máximo de
Ejecución Cline* encabeza la lista y es pura operación técnica; *Judas: Arquitectura del
Alma* es la que más canon aporta.

| Título | Inicio | Caracteres | Señal |
|---|---|---|---|
| Plan Máximo de Ejecución Cline | 2026-07-30 | 545.224 | 1407 |
| Relação Abusiva em Decomposição | 2026-04-01 | 476.286 | 1407 |
| Análisis Profundo de Conversaciones Digitales | 2026-03-31 | 239.481 | 937 |
| CV Generación y Gestión | 2026-05-24 | 662.091 | 925 |
| **Judas: Arquitectura del Alma** | 2026-07-14 | 207.510 | 829 |
| Optimización Integral Web LGBT+ | 2026-05-12 | 766.831 | 690 |
| Ecosistema Belentani Omega | 2026-07-17 | 283.500 | 689 |
| Frecuencia Belentani | 2026-06-02 | 146.782 | 626 |
| Perfil Psicológico de Pedro | 2026-05-22 | 486.842 | 610 |
| Análisis Integral de Pedro Belentani | 2026-06-17 | 311.738 | 605 |
| Sci-Fi Neon Space Hacking Art | 2026-06-01 | 160.601 | 590 |
| Perfecting BuildAI Space App | 2026-05-10 | 163.407 | 575 |
| Ecosistema Agente Multi-Stack | 2026-09-04 | 233.242 | 562 |
| Neoglassomorphism Red Code Rain | 2026-09-02 | 93.548 | 490 |
| Guion Cinematográfico Detallado | 2026-10-13 | 82.068 | 478 |
| Análisis Psicológico Profundo | 2026-06-04 | 333.633 | 384 |
| Perfil Profesional y Artístico de Pedro M. S. Belentani | 2026-06-20 | 79.454 | 384 |
| Canciones de Belentani | 2026-06-09 | 95.551 | 380 |
| Belentani 10.00 Website Modules | 2026-08-04 | 426.603 | 375 |
| Judas Era Unveiled | 2026-04-10 | 150.430 | 358 |
| Segunda Oportunidad Deudas Endeudamiento | 2025-12-28 | 406.438 | 339 |
| Judas em Português Cultural | 2026-07-16 | 62.117 | 330 |
| Canciones con alma y criterio | 2026-07-06 | 134.297 | 325 |
| Análisis Técnico Audio Judas | 2026-10-13 | 52.707 | 318 |
| El Espejo de Judas: Guía y Recursos | 2026-05-09 | ~265.000 | 265 |
| Judas Era Belentani | 2026-08-10 | ~247.000 | 247 |
| Judas Transcreación Fonética | 2026-06-28 | ~231.000 | 231 |
| Judas Experience | 2026-09-08 | ~230.000 | 230 |
| Judas Era | 2026-07-10 | — | 200 |
| Universo Belentani: JUDAS | 2026-08-28 | — | 115 |
| Plataforma Espejo de Judas | 2026-05-10 | — | 115 |
| Judas Fuego Sagrado | 2026-06-26 | — | 106 |
| Judas de Fuego | 2026-07-01 | — | 41 |
| Lore Belentani Completa | 2026-08-13 | — | 29 |

## Cómo leer esta fuente

Los chats de Qwen son **material de obra en bruto**, no documentación. Mezclan:

- texto pegado de webs propias y ajenas (BuildAI, Lovable, buscadores) sin marcar;
- HTML completo incrustado en la respuesta del modelo;
- correcciones del artista dictadas por voz, con transcripción imperfecta;
- contenido repetido entre chats gemelos (*Magia del Estudio Belentani* aparece cuatro veces).

Por eso aquí solo se versiona lo que es **decisión de autor**: nombres, reglas, cronología,
letra, estructura. Lo demás se queda como materia prima local.
