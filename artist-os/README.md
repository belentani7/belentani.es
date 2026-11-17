# BELENTANI OS — ordenador como origen de un universo

## Dirección artística

La página principal de esta rama es un ordenador retrofuturista robusto (1995–2005) con metal rubí procedural, pantalla con explorador de contenidos, unidades de audio y mundos, puertos para estudio y visual, y disquete de archivo. Está generado con HTML, CSS y JavaScript; no contiene imágenes usadas como texturas ni bibliotecas externas obligatorias. El pequeño shader WebGL es opcional y tiene un respaldo CSS, también procedural.

## Estructura de páginas públicas

- /index.html dirige al ordenador /artist-os/index.html, **solo en esta rama de trabajo**.
- /legacy-home.html preserva la web anterior.
- /artist-os/catalog.js y catalog.json indexan **386 páginas HTML públicas** del propio repositorio belentani.es, generadas exclusivamente a partir de archivos ya versionados en Git.
- /artist-os/bridge.js crea un botón fijo que permite regresar al ordenador o entrar en otros directorios; está instalado de forma reversible en esas 386 páginas.
- /artist-os/material.css aplica la estética rubí compartida solamente cuando el HTML tiene identidad artística. Las páginas técnicas, institucionales o de academia conservan su apariencia.
- /artist-os/scripts/build-catalog.mjs genera el índice público seguro a partir de `git ls-files` del propio repositorio. No lee Drive ni repositorios privados.
- /artist-os/scripts/link-pages.mjs --dry-run / --apply / --undo permite aplicar o revertir el botón de acceso. Hace backups de los HTML originales fuera del repositorio.

## Dos exploradores privados, fuera de Git

Para explorar los HTML de las demás fuentes sin publicarlos, existen localmente:

- `C:\Users\USER\Documents\00_REPOS\belentani.es\artist-os\private.html` — **2.756 entradas artísticas/candidatas**, incluidas referencias identificadas en Drive.
- `C:\Users\USER\Documents\00_REPOS\belentani.es\artist-os\all-html.html` — **46.823 entradas HTML** del PC y de Drive.

Ambas páginas están excluidas en /artist-os/.gitignore; cargan catálogos del directorio privado `C:\Users\USER\Documents\00_REPOS\_PRIVATE_BELENTANI_OS`. En ellas se puede filtrar por proyecto, por color rojo, por duplicado, buscar y abrir cada HTML del disco desde el ordenador. Los archivos Drive se abren en Drive. El catálogo público no incluye IDs privados de Drive ni rutas de repositorios privados.

La marca «rojo» es una hipótesis de afiliación artística, nunca una instrucción de publicación automática. Algunos prototipos requieren su propio servidor y no funcionan completos como archivos `file:`.

## Estadísticas de la investigación, 17/11/2026

- 404 carpetas de proyectos inspeccionadas.
- 45.266 HTML/HTM locales, además de 4.761 archivos de componentes o páginas de frameworks.
- 1.959 HTML en 83 repositorios cuyo nombre se relaciona con Belentani, Judas, OMEGA u otras familias creativas.
- 1.557 HTML de Drive identificados por búsquedas amplias, pero **no exhaustivas**.
- 2.756 referencias en la vista artística privada y 46.823 en la vista completa.
- 386 enlaces de HTML públicos al ordenador; 372 enlazados en la ampliación y 14 ya enlazados anteriormente.
- Ninguna copia original privada eliminada, movida o publicada.

Informe privado: `_PRIVATE_BELENTANI_OS/INFORME_INVENTARIO_AMPLIADO_2026-11-17.md`.

## Estado de validación

- JS validado con `node --check`.
- Navegación, filtros y diseño responsive comprobados con Playwright en Windows; sin errores de ejecución en el ordenador y los exploradores.
- Los 386 archivos del catálogo público tienen destino existente y script de retorno; verificador: `node artist-os/scripts/verify-public.mjs`.
- Pruebas de páginas de distintos tipos: material artístico activado y material técnico desactivado.
- La escena WebGL pesada `public/omega-living.html` no terminó la navegación de prueba headless dentro del tiempo asignado; requiere verificación en navegador normal.

**Esta rama y PR siguen en borrador. No se ha reemplazado la web pública actual ni se ha fusionado en main.**


## Entrada pública real con Next.js

La raíz de Git contiene 386 HTML históricos, pero no todos corresponden a rutas HTTP publicadas. La nueva integración copia el ordenador a `public/artist-os/` durante `predev`/`prebuild` y genera un catálogo público **reducido a 11 destinos artísticos reales**. El inventario completo, los HTML técnicos y los archivos privados de Drive permanecen separados de la portada pública. `/` abre el ordenador; la galaxia original se conserva en `/atlas`. Los reflejos y cantos cromados de `belentani-artista-unified` se han adaptado a `studio-reflections.css` sin importar la configuración de claves AI del estudio. Comprobación sin escribir: `node scripts/publish-artist-os.mjs --check`. Validación HTTP: `tests/e2e/artist-os-runtime.spec.ts`.


## Instrumento integrado · Sound Lab

Una adaptación funcional y libre de credenciales del motor de WebAudio de Studio (belentani-artista-unified, commit 50dc183) vive en la ruta pública `/artist-os/lab.html`: síntesis original en tres materiales, teclado accesible, secuenciador de ocho pasos y visualizador de audio. No solicita micrófono, no guarda claves ni llama a servicios externos. El catálogo público contiene ahora 12 destinos validados. Las fuentes completas del Studio y su sistema de AI permanecen separados.
