# Belentani.es — contexto de trabajo para Cursor

**Objetivo:** dar una entrada clara al universo artístico de Belentani, unir las experiencias web de mayor valor y hacer comprensibles tanto la obra como su dimensión profesional. Este documento resume fuentes locales; no es una auditoría de todas las webs ni autorización para publicar.

## Identidad y valor, según las fuentes del proyecto
- El catálogo local presenta a Belentani como artista y compositor, nacido en São Paulo y basado en Barcelona; géneros: pop alternativo, R&B y electrónica experimental. Ver `app-web-nextjs/belentani7.github.io/catalogo-artista.js`.
- La propuesta artística combina voz, música, imagen y experiencias digitales alrededor del universo JUDAS/OMEGA. El centro editorial es el lore y la obra; el 3D y el software los amplifican.
- El arco narrativo y la simbología canónica están resumidos en `lore-canon/belentani-universo-SKILL.md`. Mantener el episodio de la llave abstracto y sin datos identificables.
- Hay enlaces oficiales de Spotify, Apple Music, YouTube, SoundCloud e Instagram en el catálogo local. El catálogo distingue obras principales, colaboraciones, archivo y una entrada marcada `withdraw`; esa entrada no debe mostrarse como obra destacada. El código no demuestra que se haya retirado de las plataformas.
- Para reforzar valor profesional sin inventar méritos: priorizar una biografía breve, selección curada de obra, créditos/roles verificables, enlaces oficiales, explicación concisa de la práctica interdisciplinaria y vías de contacto solo si están confirmadas. Evitar métricas, premios, clientes y credenciales no comprobables.

## Arquitectura existente
- `app-web-nextjs/belentani7.github.io/index.html`: shell estático actual y punto de entrada más claro para la experiencia editorial; contiene secciones de lore, música, mundos y archivo.
- `universo-lore.js`: seis estaciones narrativas y destinos enlazados; revisar su correspondencia exacta con el canon antes de tratarla como definitiva.
- `catalogo-artista.js`: datos del artista, lanzamientos y mundos; fuente de datos local, no verificación externa actual.
- `unificado/index.html`: experiencia inmersiva local descrita como galaxia Three.js + GSAP. `unificado/README.md` dice que se genera desde `construir_unificado.py`; revisar primero el generador y sus destinos de salida para evitar sobrescrituras.
- `banco-recursos-galacticos/COMO_UNIR.md`: propone shell + banco + lore + mundos; recomienda enlazar sitios como capítulos y portar solo 1–2 efectos, no copiar demos completas.
- `banco-recursos-galacticos/inventario.json` y `inventario.md`: snapshot fechado 2026-10-01 con 403 archivos indexados (310 efectos, 76 assets, 8 herramientas, 6 datos y 3 códigos) y 18 demos Ciclona. Requiere refresco/validación antes de usar como inventario actual.
- `espacio-3d/INVENTARIO.md`: señala límites de licencia y descarga de recursos externos. Verificar licencia individual antes de reutilizar cualquier modelo o textura.
- `repositorios_planetas_galaxias.txt`: candidatos de mundos: 3d-portfolio, omega-immersive-portal, judas-era-omega, judas-web, fullstack-20 y belent-cad. Es una lista local, no prueba de estado, titularidad actual del código ni disponibilidad de cada web.

## Dirección recomendada
**Una puerta principal; varios capítulos, no varias marcas compitiendo.** Consolidar navegación e identidad en el shell existente, con un recorrido inicial corto: (1) declaración artística y entrada al relato, (2) una selección de música, (3) pocos mundos inmersivos curados, (4) archivo/contexto, y (5) una salida profesional/contacto verificable. Mantener atelier/herramientas separados del canon musical salvo vínculo editorial intencional.

Firma visual sugerida: editorial oscuro, rojo vidrio y oro viejo, espejo/desierto como motivo; una única escena galáctica o transición narrativa destacada. En pantallas pequeñas o dispositivos limitados, degradar a CSS/imagen estática. Sin audio automático, cámara o ubicación sin acción explícita; respetar movimiento reducido, teclado, contraste y carga rápida.

## Prioridades operativas
1. Entender la rama y los cambios locales antes de tocar archivos; el repositorio del shell puede contener cambios previos compartidos.
2. Comparar `index.html`, `universo-lore.js` y `catalogo-artista.js` con el canon y eliminar contradicciones mediante cambios pequeños, no una reescritura masiva.
3. Crear una tabla de mundos: ID, propósito, aporte único, estado/enlace verificado, solapamiento y decisión (principal, satélite o archivo). No cerrar/eliminar proyectos en esta fase.
4. Elegir un efecto de `Ciclona/` solo tras revisar dependencias, licencia, peso y fallback; no importar demos completas.
5. Validar estática/build y accesibilidad; publicar únicamente con autorización separada.

## Límites
El alcance leído hasta ahora es la carpeta `Desktop/belentani.es`. No incluye todo el Escritorio, G:, Documents, otras webs locales ni servicios privados. No acceder a expedientes, correo, claves, exportaciones privadas ni datos ajenos al proyecto. No inferir qué significa “todo el trabajo de todas las webs con más valor” como permiso para escanear el disco: ampliar por carpetas de proyecto explícitamente autorizadas y de forma acotada.
