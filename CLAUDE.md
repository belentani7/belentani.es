<!-- generated-by: belentani7-finish-kit | date: 2026-11-03 -->
# CLAUDE.md — belentani.es

Este repositorio usa `AGENTS.md` como fuente única de contexto. **Léelo primero.**

- Contexto y reglas: `AGENTS.md`
- Estado y brechas: `.agents/status.md`
- Reglas de Cursor: `.cursor/rules/`
- Planes: `docs/plans/`

## Flujo obligatorio

1. Brainstorm del alcance.
2. Plan escrito con criterios de aceptación.
3. Ejecución paso a paso.
4. Verificación: `vitest run` y `next build`.
5. Registro en `.agents/`.

## Prohibido

- Force-push a `main`/`master`.
- Leer `.env`, `secrets/**`, `*.key`, `*.pem`.
- Editar lockfiles o `migrations/` a mano.
- Borrar archivos sin confirmación.
