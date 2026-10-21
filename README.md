# Belentani: The Experience

Artist universe. Judas Era is Canon 0.

The main entry is an interactive Three.js galaxy with four narrative chapters:
Genesis, Traicion, La deuda and Redencion. The original Judas Experience remains
the historical reference at https://judas-experience-13898.buildaispace.app/.

## Run

Requires Node 20 or newer and pnpm 9.

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
