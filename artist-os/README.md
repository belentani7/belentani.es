# BELENTANI OS — ordenador artístico 1995–2005

## Propósito

Un ordenador retrofuturista robusto construido mediante HTML, CSS, JavaScript y un shader WebGL opcional. La textura no utiliza imágenes, PNG, JPG, SVG, dependencias externas ni imágenes de respaldo. La versión sin WebGL sigue utilizando CSS procedural.

La metáfora organiza las obras:
- Monitor = buscador y explorador de páginas.
- Unidad de audio = música.
- Unidad óptica = mundos narrativos.
- Puertos = visual y estudio.
- Disquete = archivo y versiones históricas.
- Teclado 1–6 = navegación por categorías (botones interactivos y teclas numéricas).
- Encendido = suspender/reanudar la pantalla.

## Entrada y preservación

La **rama de trabajo** usa el root /index.html como puerta de entrada a /artist-os/index.html. La antigua portada se conserva **completa** y accesible en /legacy-home.html. Las otras 13 páginas artísticas HTML del repo principal incorporan un acceso discreto al ordenador, aislado mediante Shadow DOM. Las 14 páginas originales, incluida legacy-home, comparten la capa procedural /artist-os/material.css: reflejos de rubí, títulos cromados, bordes y textura ligera. Sin imágenes.

La rama de trabajo NO está fusionada en main y NO está desplegada en producción.

## Privacidad y catálogos

- /artist-os/catalog.js y catalog.json contienen SOLO las 14 páginas HTML propias del repositorio público belentani.es. No contienen información de Drive, de repositorios privados ni direcciones privadas.
- /artist-os/scripts/build-catalog.mjs es el generador público seguro y contiene únicamente una lista de HTML públicos seleccionados.
- El índice de investigación completo (413 candidatos en esta revisión) se almacena exclusivamente fuera del repositorio en:
  C:\Users\USER\Documents\00_REPOS\_PRIVATE_BELENTANI_OS
- Su generador separado es build-private-catalog.mjs, también fuera de Git; incluye referencias a repositorios privados y archivos de Drive, así que NO debe publicarse.
- /artist-os/private.html es el explorador local completo y está excluido de Git mediante .gitignore; se abre únicamente en el equipo autorizado.
- En la vista privada, las entradas HTML se abren como archivos locales reales desde los otros repositorios, en pestaña aparte para conservar el ordenador como referencia. Algunos HTML históricos que dependen de servidores o servicios externos pueden necesitar su propio entorno de ejecución.\n- Los HTML que utilizan rojo son **candidatos a clasificar**, no material autorizado automáticamente para su publicación. Antes de integrar una edición se revisan contenido, licencias, secretos y estado de accesibilidad.

## Navegación reversible

/artist-os/bridge.js integra navegación entre las páginas sin alterar sus estilos. El integrador /artist-os/scripts/link-pages.mjs admite --dry-run, --apply y --undo. Se guardan copias originales fuera de Git en C:\Users\USER\Documents\00_REPOS\_SNAPSHOTS\BELENTANI_OS_20261117\belentani.es antes de insertar un script.

## Pruebas

- Validación de JavaScript con node --check.
- Test de navegación Playwright en Chromium: selección de directorios, búsqueda, filtro de rojo, pantalla apagada/encendida, enlaces.
- Vuelta desde antigua portada y páginas HTML a BELENTANI OS.
- Pruebas móviles y de pantalla estrecha: 390 y 320 píxeles, sin scroll horizontal.
- Catálogo público verificado sin enlaces a Drive o repositorios privados; índice local completo carga correctamente.
- Animación GPU real pendiente de verificar en el equipo de producción; existe respaldo CSS procedural.

## Estado

Implementación y pruebas locales y rama GitHub de trabajo. Falta revisión artística, integración selectiva de más HTML y aprobación de la publicación/merge. No borrar el historial de trabajo ni sustituir todas las páginas automáticamente.
