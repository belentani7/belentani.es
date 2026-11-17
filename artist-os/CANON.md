# BELENTANI — Integración canónica, 17/11/2026

Esta rama es una integración funcional de fuentes, no una copia de todos los repositorios.

## Capas verificadas

1. Entrada: belentani.es / artist-os (ordenador HTML + CSS + JavaScript); `/` redirige a `/artist-os/index.html` en el entorno Next.js real.
2. Materiales: cromo y reflejos tomados de belentani-artista-unified commit 50dc183; adaptación independiente sin imágenes ni acceso a credenciales.
3. Mundos: JUDAS (/judas y /judas-era), OMEGA (/omega-living.html), Galaxia (/galaxia) y Atlas original (/atlas).
4. Música: /musica, incluyendo repertorio real; perfil /artista; galería /galeria; estudio /studio-creativo; lore /lore; prensa /prensa.
5. Archivo técnico: 386 HTML versionados en Git conservados como fuente, pero NO prometidos como 386 URLs en el despliegue Next.js. Inventarios privados locales/Drive sin publicación.

## Riesgos y límites

- Las funciones del Studio que guardan API keys en localStorage no se publicaron.
- No se ha copiado el backend de Visual Engine ni prototipos que requieren servicios secretos.
- El resultado sigue en rama de revisión. No representa un merge a main ni un despliegue.
- Las pruebas automáticas del navegador deben ejecutarse contra un build del último commit.
- Ninguna copia de repositorios privados ni ID de Drive entra en public/artist-os.

## Validar

Usar `node scripts/publish-artist-os.mjs --check`, `pnpm build`, `pnpm test` y `pnpm test:e2e`.
Comprobar manualmente el comportamiento de OMEGA WebGL en máquinas modestas y el contraste real de los materiales antes de fusionar.

## Sound Lab (adaptación funcional)

El controlador WebAudio del Studio original se redujo a síntesis local de tres presets, teclado y secuenciador: `artist-os/lab.js`. Su interfaz está en `lab.html` y `lab.css`, con carga bajo demanda al abrir la unidad de estudio. No se han importado el almacenamiento de tokens en localStorage, proveedor IA, micrófono ni los servicios privados. El manifest público cuenta **12 rutas**, incluida `/artist-os/lab.html`.

## Lighthouse

El informe de la auditoría del 17-11-2026 marcó contraste insuficiente en `.help` y divergencia entre las etiquetas visibles y los nombres accesibles de tres botones físicos. Se ajustó el contraste y se eliminó el aria-label redundante de esos botones: sus nombres accesibles proceden ahora del texto visible. Reejecutar Lighthouse antes de aprobar.

## Archivo editorial (de belentani-webs-historicas a un canon de músico)

Ruta nueva `/archivo`: separa lanzamientos, escenario y obras en estudio. Reutiliza la idea de navegación histórica del archivo de webs de BELENTANI, pero **no copia sus HTML en masa**. Beautiful Skies (2020) y Therapist/Terapeuta (2023) se identifican como publicados; Cassandra y O Avesso do Mar como procesos en desarrollo. Mantiene rutas hacia música, JUDAS y estudio sin presentar bocetos como singles estrenados. El catálogo del ordenador pasa a 13 destinos, exclusivamente públicos.

## OMEGA PENTADA — cinco gemas y navegación guiada

Origen: `belentani-omega-immersive-portal/js/07-portal.js`, cinco gemas, cinco estados e invitación a explorar. El archivo anterior dependía de THREE/GSAP/Tone y almacenaba el progreso en localStorage. La **adaptación segura** usa `artist-os/portal.html`, `portal.css` y `portal.js` con cinco facetas orientadas a obras: Origen→Música, Fuego→JUDAS, Vuelo→OMEGA, Eco→Sound Lab, Memoria→Archivo. El avance solo vive en memoria durante la visita, sin rastreo ni enlaces externos. Solo CSS procedural (sin imágenes), teclado 1–5 y flechas, `prefers-reduced-motion` y alternativa sin JavaScript. Las cinco puertas están abiertas desde el inicio; completar el recorrido no bloquea nada.

El ordenador enlaza la Pentada desde la portada; `scripts/publish-artist-os.mjs` publica sus tres assets y la incorpora al catálogo HTTP público de **14 rutas**. Ningún archivo privado de Drive o PC se importa.

## Recuperación segura del PC desconectado

Se incorpora scripts/sync-pc-git-safe.ps1 para inventario de los repos locales, fetch opcional sin tocar working trees y una vista previa aislada opcional de PR #92. El PC no estaba conectado en esta sesión y **no se ha ejecutado este script en Windows**. Uso y garantía de no sobrescritura en docs/plans/2026-11-17-safe-pc-git-sync.md. El chequeo estático obligatorio en builds es scripts/check-pc-sync-contract.mjs.

## OMEGA COSMOS — Selección de Drive y conversión autónoma

Fuente: BELENTANI_OMEGA_COSMOS_ABRIR.html. Comparación con BELENTANI_BOSQUE_CRISTAL.html (363 KB), dos Bosques de Cristal WebGL de aproximadamente 1,8 MB y OMEGA_MERGED.html (143 KB y varias dependencias externas). La opción autónoma tiene 8 mundos y 50 galaxias con motor Canvas/WebGL empaquetado, y pesa aproximadamente 197 KB.

Ruta nueva /omega-cosmos.html: enlaces relativos corregidos a / y /atlas, almacenamiento sessionStorage efímero y textura SVG reemplazada por un degradado CSS. Fuente Drive original intacta. La auditoría no encontró credenciales, correos, nombres personales sensibles ni URLs de red en el código adaptado.

OMEGA Living sigue en paralelo. PENTADA abre Cosmos desde la gema VUELO. El catálogo contiene 15 destinos HTTP, comprobados por Playwright.
