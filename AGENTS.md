# Instrucciones del proyecto — BELENTANI artist universe

## Alcance y verificación
- Lee README.md y los scripts de package.json antes de modificar código. Respeta las instrucciones más específicas que existan en subdirectorios.
- Limita cada cambio al producto o ruta solicitada; conserva canon narrativo, identidad visual y medios originales.
- Tras cambios de código, ejecuta pnpm typecheck, pnpm test y pnpm build cuando las dependencias estén disponibles; informa qué se ejecutó y qué falló. No afirmes que un despliegue está verificado sin abrirlo.
- No añadas claves, tokens, medios privados ni datos personales. Usa .env.example para documentar variables sin valores secretos.

## Frontend
- Prioriza HTML semántico, navegación por teclado, estados de foco visibles, texto alternativo útil, contraste legible y controles accesibles. La información y las acciones principales deben existir en el DOM fuera de canvas.
- Respeta prefers-reduced-motion y ofrece controles para pausar animaciones largas. Prueba móvil, escritorio y conexiones lentas; carga de forma diferida efectos y medios que no sean esenciales para la primera vista.
- Mide antes de optimizar: revisa peso de JavaScript, imágenes, interacción y estabilidad visual en dispositivos representativos. Mantén el contenido esencial disponible sin efectos 3D.
- Reutiliza componentes y estilos existentes; no insertes una segunda pila de render ni un framework nuevo sin necesidad demostrada.

## WebGL y React Three Fiber, solo en rutas 3D
- Detecta soporte de WebGL y ofrece una alternativa visual y de navegación cuando no haya contexto, se pierda o el dispositivo sea limitado.
- Detén el bucle de render cuando la escena esté oculta o no cambie; libera geometrías, materiales, texturas y listeners al desmontar. Gestiona la pérdida y recuperación del contexto.
- Ajusta resolución interna, DPR, tamaño de texturas y complejidad de escena según mediciones; agrupa draw calls y evita trabajo GPU innecesario.
- La escena debe tener equivalente accesible en HTML; una interacción importante nunca dependerá solo de hover, arrastre o color.

## GitHub y revisión
- Mantén los permisos de Actions mínimos y no expongas secretos en logs ni en PR de forks.
- Para cambios visuales incluye capturas o descripción de rutas afectadas y comprobación de teclado, movimiento reducido y fallback.
- No declares que un repositorio es duplicado por nombre, ni borres historial o archivos originales sin comprobar referencias y procedencia.

Referencias oficiales: https://cursor.com/docs/rules · https://learn.microsoft.com/en-us/microsoft-edge/accessibility/design · https://learn.microsoft.com/en-us/microsoft-edge/devtools/speed/get-started · https://docs.github.com/en/actions/reference/security/secure-use · https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/WebGL_best_practices
