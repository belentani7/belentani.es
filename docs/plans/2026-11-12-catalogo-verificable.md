# Catálogo y contexto verificables

Problema: doctor falla porque el catálogo generado ya no contiene su esquema esperado y README perdió el enlace a la ficha. La ficha presenta texto mal codificado y una plantilla comercial que no describe el universo artístico del código.

1. Conservar los metadatos recientes y añadir una medición reproducible del commit de partida, con fuente y alcance explícitos.
2. Enlazar la ficha desde README y recuperar su codificación sin borrar el registro previo.
3. Aclarar que las brechas comerciales de la plantilla no son funciones verificadas del producto.
4. Ejecutar doctor, pruebas, TypeScript y build con la versión de pnpm declarada. No modificar la navegación ni relajar gates.

Aceptación: doctor debe pasar; los campos medidos deben identificar el commit de origen; las pruebas de aplicación y el build deben conservar su comportamiento.

## Bloqueo de compilación identificado
El CI del commit de origen falla en Jarvis: no se puede acceder a choices sobre unknown. Se añade readStreamDelta como frontera de validación, con pruebas de texto válido, Unicode, eventos de control y estructuras malformadas. El endpoint conserva el texto del primer choice; los eventos sin texto se ignoran. Se requiere TypeScript estricto, pruebas y build antes de fusionar.

## Resultado local
Instalación con pnpm 10.17.1 y lockfile congelado; TypeScript estricto aprobado; 65 pruebas Vitest y 9 contratos Node aprobados; ESLint con cero errores y cuatro advertencias; Next.js 15.5.28 compilado para producción; doctor 44/44. No se ejecutaron recorridos E2E locales; los ejecuta CI.

## Accesibilidad revelada por Lighthouse
El primer CI completo detectó contraste 2.57:1 en Escuchar y el nombre accesible de B7 no incluía el texto visible. Las reglas globales sin capa anulaban las utilidades de Tailwind (color y espaciado); se llevan a la capa base y se conserva la identidad visible en aria-label. Se añade regresión E2E de contraste y tamaño real, sin reducir el umbral de Lighthouse.
