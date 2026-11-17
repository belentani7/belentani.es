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
