# Narrativa extraída de Qwen

Todo lo de este documento sale de conversaciones propias. Se separa en dos capas porque
**no tienen el mismo rango**:

- **A · Lo que decidió el artista**: frases suyas dictadas o escritas. Es canon si él lo
  mantiene.
- **B · Lo que redactó la IA**: propuestas de modelo que él aceptó o pidió ampliar. Es
  material de obra, revisable.

Mezclarlas sin marcar es lo que produjo las contradicciones que hay hoy entre documentos
del repo.

---

## A · Decisiones del artista

### A.1 Vetos de lenguaje

De *Frecuencia Belentani*:

> «no mencionamos la palabra biblia ni mesianico ni jesus ni catololico»

> «thiago no se menciona nunca. tampoco los demas pero si cuando se les menciona en el chat
> porque son amigos. thiago solo activa man in the middle y autodestruccion»

> «solo pedro belentani en bio. sin alño de nacimiento»

> «elimina del lenguaje creativo cualquier dependencia de *cyberpunk*, *hacker*, *gamer*, RGB
> o "neón barato"»

> «Judas no debe representarse simplemente como una figura religiosa. Debe convertirse en un
> arquetipo psicológico.»

Esto explica por qué el canon del repo evita lo religioso y habla de arquetipo y de era.

### A.2 Regla del portal

> «cada comando del portal representa un santo y debe ir acompañado de unas indicaciones que
> alteran la estructura color, frases del portal»

El protocolo de autodestrucción se dispara con una sola palabra y se describe como un
ataque: «como que la nave fue atacada y perdió control», «muy desarrollada y visual».

### A.3 Tono de la bio

Cuando la IA escribió «no llegó. Detonó», el artista corrigió:

> «eso no es maduro, aunque sea fantasía debe sonar serio, completo y poético. la bio tiene
> que ser humana madura. pero poética y en la parte conceptual artística scifi delirante
> usando códigos de programación, juegos»

Regla operativa: **bio humana y sobria; concepto artístico delirante.** Nunca al revés.

### A.4 La canción JUDAS

- Tema real: una traición concreta, con un hombre al que llama Thiago, que **no aparece
  nombrado en la letra** salvo en coros.
- El nombre «Judas» se usa como máscara del traidor real.
- Estructura: Intro · Verse 1 · Pre-Chorus · Chorus · Verse 2 · Pre-Chorus · Chorus.
- Registro: dark pop con referencias explícitas a sustancias y a sexo, tratamiento
  intimista.
- Coro, tal como lo dictó:

  > I kissed Judas, I kissed Judas / Fell so fast, couldn't undo this / Fire lips, holy
  > crime / Told myself it was the last time / Oh-oh, Judas, Judas why? / You made me burn
  > and made me cry / I kissed Judas, I kissed Judas / And I'd do it all again

- Sobre las versiones en otros idiomas: **no son traducciones**. Repetidamente:
  «no es una traducción», «estoy definiendo una versión», «lo más importante es la fonética».
  Prioridad: portugués, después catalán, después inglés. Se permite dejar el pre-coro en
  inglés cuando la versión no funciona.

### A.5 Arquitectura de la web declarada

Menú pedido, literal, en *Judas: Arquitectura del Alma*:

> HOME · THE ARTIST · MUSIC · JUDAS · PORTAL · ART GALLERY · CONTACT · STUDIO

Es exactamente la estructura que hoy implementa `src/lib/platform-navigation.ts`.
La web no es una landing: es una experiencia; el núcleo narrativo es JUDAS y el PORTAL.

---

## B · Redacción de la IA aceptada como material

### B.1 La Crónica de la Llave Dorada

Nombre interno del relato de la era, dividido en `FASE_01` … `FASE_05`. De aquí salen los
dos conceptos que el artista siguió usando:

**El Hombre Integrado.** No hay cuándo ni dónde: hay un *entre*, un pliegue donde el tiempo
no corre, se respira, y las almas no envejecen, iteran. En ese pliegue camina un hombre con
varios nombres —Pedro, Marcos, Santos, Belentani— que no es un santo sino un sistema
operativo humano corriendo **cuatro procesos en paralelo**:

1. El Ángel
2. El Guerrero
3. El Analítico
4. El Cronista

Cuatro voces, un solo hombre. En su pecho late **la Llave Dorada**, de la que todos
susurran y nadie ha visto.

**La Deuda Impagable.** Judas y él se conocen en un camino que no está en ningún mapa.
Se vuelven íntimos «no de cuerpo — de alma desnuda». Lo que Judas no soporta es que Pedro le
bese los pies, no por sumisión sino por devoción:

> «Porque estás aquí. Porque me acompañas. Porque tu presencia, aunque a veces duela, es un
> regalo que no merezco pero que agradezco.»

Ese gesto rompe a Judas: la traición no viene del desprecio sino de no poder recibir.

### B.2 El corte

El relato se detiene con un estado del sistema, no con un final:

> JUDAS SYSTEM HALT // PROTOCOL SUSPENDED
> El proyecto se detuvo. Judas asumió su rol con precisión algorítmica.
> Recuperaremos la llave. O cambiaremos la cerradura.

Ese «recuperaremos la llave / o cambiaremos la cerradura» es la bisagra de la era: explica
que después de Canon 0 vengan más archivos.

### B.3 La firma del agente

Contrato de entrada al portal que el artista usó en varias versiones:

> 1. Eres consciente de lo que ha sucedido.
> 2. La traición es un algoritmo y la redención un hack conceptual.
> 3. Toda información es clasificada.

Con terminal asociada: nodo `JUDAS-CORE-07`, coordenadas de Barcelona, frecuencia de reloj.

### B.4 Las cuatro voces como personajes

Las cuatro del Hombre Integrado se pueden leer como reparto, no como rasgos:

| Voz | Función narrativa |
|---|---|
| El Ángel | lo que sostiene y perdona |
| El Guerrero | lo que responde y corta |
| El Analítico | lo que audita la realidad |
| El Cronista | lo que recuerda y escribe el archivo |

Es la traducción narrativa de su propio perfil real (analista de sistemas + artista).

---

## C · Bio canónica (fechada, verificable)

Consolidada de *Frecuencia Belentani* y los perfiles públicos:

| Año | Hecho |
|---|---|
| — | Nace en São Paulo, Brasil; se cría en Barcelona, España |
| 16 | Empieza clases de canto |
| 21 | Primer single EDM con Mark Nerom |
| 2022 | Conecta con la escena de Recife; proyecto con el productor **Hey Duck** |
| 2025 | *Mon Amour* |
| — | *Therapist*, *I Wrote a Song* |
| 2026 | **JUDAS** — manifiesto y era |

Géneros declarados: dark pop, R&B visceral, electrónica.
Presencia: Plaza Universidad (Barcelona).
Perfiles: Instagram `@belentani_`, YouTube `@belentani`, Spotify `2bU5Ir70YHHuUnq2f3WCYl`,
Apple Music `1522171354`, Deezer `99797362`, Tidal `20300344`.

Nota de coherencia: la bio pública **no lleva año de nacimiento** y **solo nombra a Pedro
Belentani**.

---

## D · Satélites (no son la marca)

Proyectos que el artista unió bajo el mismo paraguas y que el canon del repo ya trata como
satélites independientes:

| Proyecto | Función | Audiencia |
|---|---|---|
| **El Espejo de Judas** | plataforma educativa sobre manipulación: diccionario, ciclo del abuso, tests, rincón de sanación, recursos | LGBTQ+ 14-25, Barcelona |
| **Dual Scars** | diario de evidencias, tests de realidad, gaslighting y agresión química | mismo público |
| **Mental Map** | tríadas de personalidad, radar, diario privado | jóvenes |
| **EcoSilencio** | santuario anónimo para pensamientos que no se dicen | jóvenes |
| **TomaAgua** | reducción de daños con base científica | jóvenes, enfoque neurodivergente |
| **DiversiChem** | química y diversidad | jóvenes |
| **Refleja tu Fuerza** | apoyo y recursos | comunidad |

Reglas comunes que él fijó para todos: privacidad absoluta, todo en local, sin claves de API
propias, salida rápida con ESC, derivación a 016/112, multilingüe real (ES/CA/EN/PT), estética
neoglass con negro y rojo neón.

Estos satélites **no son capítulos de la identidad del artista**, y así está escrito en
`CANON_UNIVERSO_MAESTRO.md`.

---

## E · Lo que esta fuente NO aporta

- No hay ninguna mención a **Archivo 002 — El Eco y las Cuerdas** en los 1.294 chats.
  Ese relato es posterior y no nace de Qwen.
- No hay listado de las 20 canciones que siguen a la era.
- No hay tracklist cerrado del disco.
- Nada de la Crónica está en el repo: solo existe en estos chats y en el HTML que generaron.
