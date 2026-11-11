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

## Scripts

| Script | Que hace |
|---|---|
| prebuild | Ejecuta las comprobaciones de límites y de la pila del renderizador mediante Node |
| check:boundaries | Ejecuta la comprobación de límites mediante Node |
| dev | Inicia el servidor de desarrollo de Next.js |
| build | Compila la aplicación para producción con Next.js |
| start | Inicia el servidor de producción de Next.js |
| lint | Ejecuta ESLint en todo el proyecto |
| typecheck | Ejecuta la comprobación de tipos de TypeScript sin emitir archivos |
| test | Ejecuta las pruebas unitarias una vez con Vitest |
| test:watch | Ejecuta las pruebas unitarias en modo interactivo/vigilancia con Vitest |
| test:e2e | Ejecuta las pruebas end-to-end con Playwright |
| test:visual | Ejecuta la validación visual mediante el script de Node |
| audit:machine | Ejecuta la auditoría de la máquina consciente mediante Node |
| voice:prep | Ejecuta la preparación de clonación de voz mediante Node |
| lighthouse | Ejecuta las auditorías de rendimiento y accesibilidad con LHCI |
| format | Formatea todos los archivos del proyecto utilizando Prettier |
| assets:download | Descarga los recursos externos mediante un script de Node |
| assets:process | Procesa los recursos mediante un script de Node |
| assets | Descarga y procesa los recursos ejecutando los scripts correspondientes en secuencia con pnpm |
| check:renderer | Comprueba la pila del renderizador ejecutando el script y sus pruebas nativas con Node |
