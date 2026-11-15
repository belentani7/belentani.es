# PROMPT MAESTRO — PERFIL GIT (belentani7)

Copia este documento entero como instrucción a un agente con acceso a GitHub (API o CLI)
y ejecútalo por pasadas. Cada pasada termina con verificación, no con una promesa.

---

## 0 · Invariantes

1. **Nada se afirma sin evidencia.** Cada frase del perfil enlaza a repo, test o medición.
   Lo que no se puede comprobar se marca `unverified` o se borra.
2. **No se inventan descripciones.** Si no se ha leído el repo, no se describe.
3. **Nada destructivo sin permiso explícito**: borrar, archivar, cambiar visibilidad,
   renombrar o forzar push. Se propone, no se ejecuta.
4. **Lo privado sigue privado.** Casos legales, credenciales, datos de terceros y audios
   no aparecen en ningún repo público ni en el README de perfil.
5. **Un cambio por pasada, verificado.** Si falla, se reporta el fallo, no se maquilla.

## 1 · Diagnóstico (siempre primero)

Ejecuta y guarda salida real:

- `GET /user` → login, bio, blog, company, location, hireable, repos públicos y privados.
- `GET /user/repos?per_page=100&sort=pushed` paginado hasta vaciar → inventario completo.
- Para cada repo público, anota: `description`, `homepage`, `topics`, `default_branch`,
  `license`, `size`, `pushed_at`, `open_issues`, `fork`, `archived`.

Clasifica cada repo público en una de estas cinco:

| Clase | Criterio | Acción |
|---|---|---|
| **A · Escaparate** | público, propósito claro, experiencia recorrible, README con cómo ejecutar y verificar | se enlaza en el README de perfil |
| **B · Herramienta** | público, sirve a otros aunque no sea bonito | descripción técnica precisa + topics |
| **C · Archivo** | histórico, sin mantenimiento | `archived: true` (con permiso) y fuera del escaparate |
| **D · Vacío / ruido** | 0 bytes, sin descripción, sin propósito | archivar o borrar (con permiso) |
| **E · Fork** | fork sin cambios propios | ocultar del escaparate; no se lista como trabajo propio |

**Umbral de escaparate:** máximo 6 sistemas. Más de seis deja de ser un perfil y pasa a ser
un índice.

## 2 · Reparaciones de metadatos (mecánicas, sin criterio)

Para cada repo público:

1. `description`: una frase, qué hace, para quién, sin adjetivos vacíos. Máx. 160 caracteres.
   Prohibido: «Repositorio de trabajo local», «proyecto del ecosistema», «recuperado desde
   copia local verificada».
2. `topics`: entre 4 y 8, en minúsculas, en inglés técnico (`webgl`, `cli`, `evaluation`),
   no en español genérico (`proyecto`, `sitio`, `pack`).
3. `homepage`: solo si la URL responde HTTP 200 y corresponde a ese repo. Nunca una URL
   supuesta.
4. `default_branch`: si el nombre es un resto de trabajo (`fix/ui-tailwind-format-y-aider-gitignore`,
   `duck`, `release/v3.8.54`), se renombra a `main` y se actualiza la rama por defecto.
5. `license`: si falta, se añade MIT salvo que el contenido sea de cliente.

## 3 · README de perfil (`belentani7/belentani7`)

Estructura obligatoria, en este orden:

1. **Identidad en dos líneas**: nombre, rol real, stack, ciudad.
2. **Promesa**: qué problema resuelve, en una frase, sin «apasionado».
3. **Start here**: tabla de 3–6 sistemas. Columnas: número, sistema, qué demuestra, estado
   (live / medido / repo). Cada fila enlaza al repo.
4. **Cómo verifico**: los gates reales (CI, scripts, mediciones) y su comando.
5. **Stack**: solo lo que se ha usado de verdad en repos públicos.
6. **Contacto**: web + ciudad. Sin email si no es público.

Reglas de estilo:

- Nada de widgets de terceros, contadores de visitas ni badges que no se actualicen.
- Ninguna imagen sin `alt`.
- Cero emojis decorativos; como mucho un separador `·`.
- Inglés para el perfil público; español solo si se declara versión bilingüe.
- Fecha de actualización al pie.

## 4 · Repos de escaparate: estándar mínimo

Cada repo de clase A necesita:

- README con: qué es, por qué existe, cómo se ejecuta, cómo se verifica, qué NO hace.
- Un comando único de verificación que devuelve código de salida distinto de cero al fallar.
- CI que ejecute ese comando en cada push.
- Licencia declarada.
- Captura o demo enlazada, servida desde el propio repo (nada de hotlinks).
- Issues abiertas: o se etiquetan, o se cierran. Un repo de escaparate con 27 issues
  abiertas y sin etiquetas transmite abandono.

## 5 · Orden de ejecución

1. Diagnóstico completo y tabla de clases. **No modificar nada todavía.**
2. Reparar metadatos de los repos A y B (descripción, topics, homepage, rama por defecto).
3. Reescribir el README de perfil con solo los A verificados.
4. Reparar READMEs de los A que no cumplan el estándar de la sección 4.
5. Proponer (sin ejecutar) el archivado de C y D y el ocultado de E.
6. Releer el perfil por API y confirmar que cada enlace del README responde 200.

## 6 · Verificación final (obligatoria)

Devuelve, con salida real:

- Tabla antes/después: repos públicos, con descripción, con topics, con licencia, con rama `main`.
- Lista de enlaces del README de perfil con su código HTTP.
- Enumeración de lo NO hecho y por qué (permisos, falta de verificación, decisión pendiente).

Si algo no se pudo comprobar: `NO VERIFICADO` y el motivo. Nunca «debería funcionar».

## 7 · Estado conocido (2026-11-15, tras la pasada de ampliación)

Hecho y verificado en esta sesión:

- README de perfil reescrito; 8/8 enlaces internos y 7/7 externos en 200.
- `omega-web`: descripción, homepage, 7 topics y LICENSE MIT añadida.
- `belentani_Omega`: **archivado** (era un repo público de 0 bytes).
- 11 repos privados con descripción real leída de su propio README y topics técnicos.
- Topics basura sustituidos en `keyrotor`, `hbo-noir-icons`, `ivy-la-vie`, `fazluiz3d-ecosystem`.

Tercera pasada (homepages y ramas):

- 17 homepages públicas comprobadas con curl. Una muerta (`fazluiz3d-ecosystem` → 404): no se
  limpió a secas, se sustituyó por su demo real en Pages (200). `kepler` y `belentani-judas-web`
  tenían demo viva sin enlazar: ahora la enlazan.
- 5 conjuntos de topics más limpiados (`assurance-pvcu`, `qr-pro-enterprise`, `opendesign`,
  `Steven-renovation`, `music-os-pedro-belentani`).
- Rama por defecto `fix/ui-tailwind-format-y-aider-gitignore` corregida en **5 de 6** repos:
  `main` creada en el mismo commit y default cambiado (`belentaniexperience`,
  `aurea3d-premium-archivo`, `belentani-conscious-machine`, `belentani-ecosystem-control`,
  `belentani-studio-motion`).
- `belentani-os`: `main` existe y **divergió de verdad**, no solo desfasada: `main` tiene sus
  commits de auditoría (d086ddc y anteriores) que la otra rama no tiene, y esa rama tiene 5
  commits nuevos (MIT, limpieza, resolver-todo, tailwind) que `main` no tiene. No se toca:
  requiere una fusión con criterio, no un `force`.

Quinta pasada (barrido de los 58 públicos):

- Auditoría completa con `curl` + `python` sobre `users/belentani7/repos`: licencia, longitud de
  descripción, homepage, topics y estado de archivo. Huecos: 3 sin descripción, 8 sin topics,
  10 sin licencia reconocida (la mayoría `NOASSERTION`: hay fichero, GitHub no lo identifica).
- Corregidas 5 descripciones, dos de ellas porque **filtraban notas internas al perfil público**:
  `Cruzando-el-charco` y `open-school` decían literalmente "recuperado desde copia local
  verificada". También `aprende-brasil`, `belentani-omega-immersive-portal` y
  `BELENTANI-JUDAS-ERA-FULLSTACK`.
- 7 conjuntos de topics nuevos, incluido `OmniRoute` (fork de Diego Souza).
- `belentani-omega-immersive-portal` ganó homepage: la demo Vercel responde 200.

Sexta pasada (perfil publicado de verdad):

- Descubrimiento: la reescritura del README del perfil **nunca llegó a GitHub**. Estaba
  modificada y sin commitear en el clon local; el remoto seguía sirviendo la tabla antigua.
  Publicada por API (commit 3586b308, 6.209 bytes, 8 secciones).
- Añadidos dos sistemas verificados con demo en 200: `Cruzando-el-charco` (07) y `open-school` (08).
- Los 8 enlaces internos del README comprobados uno a uno: todos 200.
- Clon local sincronizado con fast-forward (el único cambio perdido era la fecha del pie).

Séptima pasada (referencia medida contra repos famosos):

- Benchmark con 8 repos de referencia (three.js, next.js, react-three-fiber, awesome, public-apis,
  fastapi, ollama, shadcn-ui): descripción media 73 caracteres y **11,9 topics de media**.
- Los repos de belentani7 estaban en 5-6 topics: la mitad de superficie de búsqueda.
- 14 conjuntos de topics reescritos para llegar a 8, incluidos los que tenían relleno que nadie
  busca: `prometedora`, `descubres`, `interes`, `privado` (en un repo público), `negocio`.
- 6 descripciones sustituidas porque filtraban metadatos internos o cortaban una frase a medias:
  `safe-exec`, `premium-factory-api`, `mimo_patch`, `trama-trans-bcn`, `belentani7.github.io`,
  `cuidar-conecta-marcia` (esta última solo decía su propio nombre).
- Homepages comprobadas: la de `belentani7.github.io` (`belentani7githubio.vercel.app`) responde 200
  aunque el nombre parezca roto.

Octava pasada (tres familias: API, MCP y assets de front-end):

- Vocabulario medido en repos de referencia por familia:
  - MCP: `mcp`, `mcp-server`, `mcp-client` (modelcontextprotocol/python-sdk); `ai`, `mcp`
    (awesome-mcp-servers). modelcontextprotocol/servers no tiene ni un topic.
  - API: `api`, `rest`, `rest-api`, `openapi`, `json`, `async`, `pydantic`, `sse`, `websockets`
    (fastapi); `http-client`, `api-testing`, `rest-api` (hoppscotch).
  - Assets: `icons`, `svg`, `svg-icons`, `iconset`, `icon-pack` (lucide, tabler); `ui-components`,
    `components`, `design-system`, `figma` (shadcn).
- Aplicado solo donde el código lo sostiene: 5 conjuntos de topics.
- **No aplicado y por qué**: `meta-skill` y `skills-registry` no mencionan MCP ni una vez, y
  `belentani-forge` solo lo nombra como plantilla que sabe generar. Etiquetarlos `mcp-server`
  habría sido mentir para ganar búsqueda.
- Familia API: tras revisar cuatro repos, solo `qr-pro-enterprise` expone una API (Express);
  los demás no tienen endpoints, así que no se les pone vocabulario de API.

Novena pasada (sesión de estudio de front-end y aplicación masiva):

- Estudiados 26 repos de referencia; vocabulario dominante: `react` (10), `javascript` (7),
  `css` (6), `components` (5), `ui`/`vue` (4).
- 31 repos actualizados con una regla verificable: topic del lenguaje que GitHub declara +
  `web` solo si hay demo desplegada.
- 9 repos descartados del plan automático porque GitHub marca `HTML` en CLIs que no son web
  (`keyrotor`, `safe-exec`, `neural-git-tui`, `skills-registry`, `agent-linux`, `open-manus`,
  `gpu-cost-optimizer`, `OmniRoute`, `secure-t`).
- Media de topics: 6,4 → 7,39. Repos con 8 o más: 13 → 26 de 57. Sin topics de relleno.
- Estudio completo en `archivo-fuentes/estudio-frontend-2026-11-16.md`.

Décima pasada (convención superpowers aplicada):

- Referencia: `obra/superpowers` (318k estrellas) — `skills/<nombre>/SKILL.md` con frontmatter
  `name` + `description` ("Use when…"), manifests por harness y un `plugin.json` por ecosistema.
- Hallazgo: `skills-registry` documentaba en su README `registry.json`, `cli/`, `skills/`,
  `SCHEMA.md` y "23+ skills". **Los cuatro ficheros daban 404** y no hay ni una skill dentro.
  Un registro vacío que se anuncia como catálogo.
- Creado `registry.json` con **una** entrada verificada (`meta-skill`, cuyo SKILL.md existe y se
  abre en 200) y `SCHEMA.md` con el contrato y el estado real. No se inventaron 23 skills.
- `meta-skill` ya cumplía el formato exacto de superpowers: frontmatter `name` + `description`
  con "Use first to classify…". No se tocó.
- El README de skills-registry sigue diciendo "23+": corregirlo exige reescribir el fichero
  entero por API y no compensa el riesgo de corromperlo. Queda anotado.

Pendiente y por qué:
- Forks públicos (`OmniRoute`, `ace-step-ui`): solo se ocultan desde la web.
- Repos pinned: solo desde la web.
- Alcance: 0 estrellas y 1 seguidor. El perfil ya está a nivel; lo que falta es difusión.

---

### Diagnóstico de partida

Medido en esta sesión, para no repetir trabajo:

- Cuenta `belentani7` · Pedro Belentani · L'Hospitalet de Llobregat · empresa Noiacore ·
  web `https://belentani.es` · hireable: sí.
- **58 repos públicos, 267 privados.**
- Perfil ya construido sobre evidencia: `belentani7/belentani7` (README 4,8 KB),
  `scripts/profile_evidence.py` con 9 comprobaciones y CI por push.
- Escaparate actual: `belentani.es`, `meta-skill`, `secure-t`, `gpu-cost-optimizer`,
  `kepler`, `profile-lint`. Más `github-profile-proof`.
- **Problemas abiertos detectados:**
  - `omega-web`: público, sin descripción, sin topics, sin licencia.
  - `belentani_Omega`: público, 0 bytes, sin descripción, rama por defecto `duck`.
  - Varios repos privados con descripción «Repositorio de trabajo local».
  - Varios repos con rama por defecto `fix/ui-tailwind-format-y-aider-gitignore`.
  - Forks públicos (`OmniRoute`, `ace-step-ui`) que no aportan trabajo propio.
  - 0 estrellas y 1 seguidor: el perfil no tiene alcance, solo contenido. Sin difusión,
    el mejor README del mundo no se lee.
