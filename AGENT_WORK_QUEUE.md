# Cola de trabajo activa

Lee `AGENTS.md` antes de actuar. Esta cola resume peticiones del usuario
recuperadas de las sesiones locales el 2026-10-08.

## Ya terminado en esta rama de trabajo

- La web compila en producción con `pnpm build`.
- `robots.txt` y `sitemap.xml` exponen solo rutas artísticas públicas.
- Las páginas y capítulos de Judas que no existen devuelven 404 con enlaces de recuperación.
- El inicio tiene título semántico y datos estructurados `MusicGroup` con los perfiles Spotify y YouTube ya enlazados en la web.

## Prioridad 1 — validar y preservar la experiencia web

1. Ejecutar cambios pequeños sobre una sola ruta cada vez.
2. No integrar por arrastre demos de `_clones`, `Ciclona`, `_satellites`, `_private_audio_no_web` ni archivos de archivo.
3. Antes de afirmar que una pantalla está lista, ejecutar su build y comprobar la ruta servida.
4. Mantener contenido legible, navegación por teclado, foco visible, contraste y `prefers-reduced-motion`.

## Prioridad 2 — The Judas Experience

1. Trabajar sobre copias, nunca sobre los WAV de origen.
2. Medir audio antes de procesarlo y conservar comparación A/B con fecha, formato, LUFS y true peak.
3. No afirmar conversión vocal ni usar una voz ajena como voz de Pedro sin una referencia de voz identificada y autorización del material.
4. El primer entregable es una muestra corta verificable de Judas; no un lote de 20–50 canciones.

## Prioridad 3 — Google Drive y Gmail

1. Usar los conectores ya autorizados y mantener trazabilidad de toda modificación.
2. Clasificar Drive por contenido y hash antes de mover duplicados; no borrar ni publicar materiales privados.
3. En Gmail, distinguir siempre `SENT` de `DRAFT`; no enviar mensajes sin contenido y destinatario confirmados.

## Prioridad 4 — repositorios y despliegues

1. No hacer `git add`, commit, push, deploy ni cambios de DNS desde esta cola.
2. Revisar un repositorio por propósito y contenido, no por similitud de nombres.
3. Aplicar cambios solo al repositorio canónico que contiene la función activa.

## Uso de proveedores y agentes

- Usar credenciales configuradas por el entorno sin imprimir, copiar ni guardar valores de claves.
- No usar Alibaba/Qwen/Bailian.
- Elegir un proveedor para una tarea concreta y registrar el resultado; no lanzar todas las claves contra la misma tarea.
- No detener procesos existentes de Codex, OpenClaw, Kilo, MiMo o servidores sin identificar primero su propósito.

## Mandato recuperado del usuario — 8 de octubre de 2026

- Continuar las tareas pendientes entre sesiones y dejar una salida verificable, no solo análisis.
- Aprovechar las herramientas, conectores y proveedores ya configurados, sin revelar ni duplicar claves y sin usar Alibaba/Qwen/Bailian.
- Coordinar a los agentes mediante esta cola: no interrumpir procesos ajenos ni asumir que una sesión activa acepta órdenes fuera de su ámbito.
- Usar investigación externa solo para decisiones concretas; seleccionar dependencias y repositorios por licencia, mantenimiento, compatibilidad y evidencia, no por cantidad.
- Mantener Drive, Gmail, audio, web y repositorios separados: no publicar, enviar, desplegar, confirmar cambios ni borrar sin la autorización específica que exige `AGENTS.md`.
