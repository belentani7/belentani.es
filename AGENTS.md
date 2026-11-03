<!-- generated-by: belentani7-finish-kit | date: 2026-11-03 -->
# AGENTS.md — belentani.es

> Contexto operativo para agentes (Claude Code, Cursor, Codex, ZCode, Copilot).
> Fuente única de verdad del repositorio. Si algo no está aquí, se deduce del código; no se inventa.

## 1. Qué es este repositorio

Artist universe. Judas Era is Canon 0.

| Campo | Valor |
|---|---|
| Ruta | `C:\Users\USER\Documents\Proyectos\repos\github\belentani.es` |
| Rama | `main` |
| Remoto | `https://github.com/belentani7/belentani.es.git` |
| Stack | Node.js (pnpm) · TypeScript · next · react · tailwindcss · playwright · vitest |
| Score de finalización | 0/100 (D) |
| Tier | ? |

## 2. Stack

- Node.js (pnpm)
- TypeScript
- next
- react
- tailwindcss
- playwright
- vitest

## 3. Comandos reales

```
text
pnpm install
next build
vitest run
eslint .
```

- Test: `vitest run`
- Build: `next build`

Si un comando no existe, no lo inventes: añádelo al backlog de `.agents/status.md`.

## 4. Mapa del repositorio

```text
_universo_assets/
.agents/
.claude/
.devcontainer/
.git/
.github/
.lighthouseci/
.vscode/
app/
app-web-nextjs/
banco-recursos-galacticos/
docs/
institucion/
lore-canon/
```

## 5. Reglas duras

1. **No force-push** a `main` ni `master`. Nunca `git push --force`.
2. **No editar** `package-lock.json`, `pnpm-lock.yaml`, `yarn.lock` ni `migrations/` a mano.
3. **No leer ni commitear** `.env`, `.env.local`, `secrets/**`, `*.key`, `*.pem`.
4. **No borrar** archivos ni directorios sin confirmación explícita.
5. Todo cambio de comportamiento necesita un test que lo demuestre.
6. Un cambio = un propósito. No mezclar refactor, formato y feature.
7. Si el build o los tests fallan, se arregla antes de añadir nada nuevo.

## 6. Flujo de trabajo (Superpowers)

1. **Brainstorm** — aclarar alcance y criterios de aceptación.
2. **Plan** — escribir el plan en `docs/plans/YYYY-MM-DD-<tema>.md` con pasos verificables.
3. **Execute** — cambios pequeños, un paso del plan cada vez.
4. **Verify** — tests + build + revisión del diff antes de decir "hecho".
5. **Record** — incidente o patrón en `.agents/`.

## 7. Reglas de Cursor

- `.cursor/rules/000-ecosistema.mdc` — siempre activa.
- `.cursor/rules/100-stack.mdc` — se activa por globs del stack.
- `.cursor/rules/200-testing.mdc` — se activa al tocar tests.

## 8. Estado y brechas

- dependencias no instaladas; gates pendientes
- sin .env.example

Próximos pasos:

- Instalar dependencias con pnpm install
- Ejecutar next build y corregir fallos
- Ejecutar vitest run
- Revisar el diff y commitear el kit
- Mantener `.agents/status.md` actualizado

## 9. Memoria

- Estado: `.agents/status.md`
- Incidentes: `.agents/memory/incidents.md`
- Patrones: `.agents/patterns/`
