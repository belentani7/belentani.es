# Belentani: The Experience

Artist universe. Judas Era is Canon 0.

The main entry is an interactive Three.js galaxy with four narrative chapters:
Genesis, Traicion, La deuda and Redencion. The original Judas Experience remains
the historical reference at https://judas-experience-13898.buildaispace.app/.

## Run

Requires Node >= 18.17 (engines in package.json) and pnpm pinned via
`packageManager` (pnpm@10.17.1 — `corepack enable` resolves it).

```sh
pnpm install --frozen-lockfile
pnpm dev
```

## Verify

```sh
pnpm check:boundaries
pnpm typecheck
pnpm test
pnpm build
pnpm start --port 3017
node scripts/verify-experience.mjs
```

The visual check uses locally installed Google Chrome. It checks desktop/mobile,
canvas pixels, motion, chapter changes, reset and horizontal overflow.

## Public Scope

Artist, music links, narrative, curated visual assets and contact channels.
NoiaCore, education, consulting and Duck are independent projects.
Private audio, masters, stems and sessions are excluded from Git and the build.

## Archive

Historical source projects and raw captures are preserved outside the public
release. The local rotation has a CSV manifest. No project history is rewritten.
The canonical release preserves its own existing Git history and does not import
the local historical repository's audio-containing history.

## Costs

The main experience does not call a model API. No paid generation, API credits,
subscription upgrades or routing services are required to browse it.

## State

See RESUMEN_EJECUCION.md and PENDIENTES.md for verified results and remaining work.


## Uso

Instala dependencias y ejecuta el proyecto:

```powershell
# Dependencias
npm install

# Desarrollo
npm run dev

# Pruebas
npm test

# Construcción de producción
npm run build
```

Consulta `package.json` para la lista completa de scripts disponibles.

<!-- repo-forge:readme:inicio -->
## Qué es

**Belentani** — casa artística (marca musical).

Un lugar donde el trabajo se ve terminado, con su relato y sus créditos, no una maqueta que promete.

## Estado medido

| Dato | Valor |
|---|---|
| Lenguajes | HTML, JSON, TypeScript, YAML, CSS, Python |
| Archivos / líneas | 782 / 294624 |
| Páginas HTML | 380 |
| Tests detectados | 25 |
| Cumplimiento de reglas | 36/37 (97.3%) |

Todo lo anterior se midió en disco el 2026-11-10; no es una estimación.

## Uso

```bash
npm install
npm run dev
```

## Estructura

```
__pycache__/
_universo_assets/
app/
app-web-nextjs/
assets/
banco-recursos-galacticos/
brand/
data/
docs/
institucion/
```

## Diseño de plataforma

- Obra
- Escucha
- Directo
- Prensa
- Entidad

La ficha completa —máximo potencial, marca, fases de monetización y recursos— vive en
[`plataforma/FICHA.md`](plataforma/FICHA.md). Los tokens de marca están en
[`brand/tokens.css`](brand/tokens.css).

## Reglas del proyecto

Este repositorio sigue el catálogo oficial del ecosistema (`GH-*`, `WEB-*`, `ACC-*`,
`SEO-*`, `COH-*`, `DEV-*`). El gate se ejecuta con:

```bash
python scripts/doctor.py
```

## Licencia

MIT. Ver [`LICENSE`](LICENSE).
<!-- repo-forge:readme:fin -->
<!-- repo-forge:readme:fin -->
<!-- repo-forge:readme:fin -->
<!-- repo-forge:readme:fin -->

## Producto

Oferta, precio y cobro: [`producto/OFERTA.md`](producto/OFERTA.md) · [`producto/precios.json`](producto/precios.json) · [`producto/landing.html`](producto/landing.html)
