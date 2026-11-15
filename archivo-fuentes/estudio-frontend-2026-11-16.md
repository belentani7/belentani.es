# Sesión de estudio: front-end de referencia → aplicación al perfil

Fecha: 2026-11-16. Fuente: API de GitHub (topics reales de cada repositorio).

## Qué se estudió

26 repositorios de referencia del ecosistema front-end, agrupados por lo que representan:

| Familia | Repos |
|---|---|
| Frameworks y shells | `facebook/react`, `vuejs/core`, `sveltejs/svelte`, `angular/angular`, `solidjs/solid`, `preactjs/preact`, `qwikdev/qwik`, `lit/lit` |
| Meta-frameworks | `vercel/next.js`, `nuxt/nuxt`, `withastro/astro`, `remix-run/remix` |
| Build y estilos | `vitejs/vite`, `tailwindlabs/tailwindcss`, `twbs/bootstrap`, `styled-components/styled-components`, `emotion-js/emotion` |
| UI y accesibilidad | `shadcn-ui/ui`, `radix-ui/primitives`, `tailwindlabs/headlessui` |
| Movimiento y canvas | `motiondivision/motion`, `juliangarnier/anime` |
| Iconografía | `lucide-icons/lucide`, `tabler/tabler-icons` |
| Utilidades web | `bigskysoftware/htmx`, `alpinejs/alpine`, `hoppscotch/hoppscotch` |

## Vocabulario más repetido

| Topic | Apariciones |
|---|---|
| `react` | 10 |
| `javascript` | 7 |
| `css` | 6 |
| `components` | 5 |
| `ui`, `vue` | 4 |
| `tailwindcss`, `web`, `svg` | 3 |
| `frontend`, `declarative`, `css-framework` | 2 |

Hallazgos incómodos, que también son parte del estudio:

- `vuejs/core`, `alpinejs/alpine` y `modelcontextprotocol/servers` **no tienen ningún topic**.
- `gsap/gsap` y `astro/astro` (ruta antigua) responden 404 al endpoint de topics.
- Es decir: tener 100.000 estrellas no implica tener el perfil ordenado. El vocabulario
  anterior describe la norma, no una ley.

## Qué se aplicó

Regla única: **solo se añade lo que el propio repositorio demuestra**.

1. El topic del lenguaje declarado por GitHub (`javascript`, `typescript`, `html`), cuando
   faltaba.
2. `web` únicamente si el repo tiene demo desplegada (`has_pages` o `homepage`).

Resultado: 31 repos actualizados, de 57 públicos no archivados.

## Qué se rechazó y por qué

El plan automático proponía 40 repos. Se descartaron 9 porque GitHub detecta `HTML` como
lenguaje principal en proyectos que no son web:

- `keyrotor` (CLI Python), `safe-exec` (CLI Python), `neural-git-tui` (TUI), `skills-registry`
  (CLI), `agent-linux` (devcontainer), `open-manus` (instalador), `gpu-cost-optimizer` (ML),
  `OmniRoute` (gateway), `secure-t` (campus, aunque sea web no tenía la etiqueta clara).

Poner `html` ahí habría sido exactamente el relleno que la pasada anterior limpió
(`prometedora`, `descubres`, `interes`).

## Verificación

- Los 31 conjuntos se leyeron de vuelta por API: coinciden con lo escrito.
- Media de topics del perfil antes de la sesión: 6,4. Después: ver medición posterior.
- Cero topics de relleno: la lista de palabras basura sigue vacía.
