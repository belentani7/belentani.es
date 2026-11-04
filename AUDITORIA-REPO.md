<!-- generated-by: belentani7-audit | date: 2026-11-03 -->
# Auditoría — belentani.es

**Score:** 87/100 (A) · **Tier:** A · **Prioridad:** P0  
**Estado:** activo · **Stack:** next;react;react-dom;tailwindcss;typescript;vitest;playwright  
**Rama:** `main` · **Remoto:** `https://github.com/belentani7/belentani.es.git`  
**Último commit:** 2026-11-01T05:22:07+01:00 · chore: ignorar repos absorbidos y artefactos locales

## Situación

- LOC: **252.307** · archivos: **780** · disco: **30.14 MB**
- Commits: **212** · sin commitear: **3** · modificados: **0**
- Tests: **sí** (27 archivos) · CI: **sí** · Docker: **sí**
- Cursor rules: **no** · `CLAUDE.md`: **no** · hooks válidos: **no**

## Brechas

- Sin `.env.example`: las variables no están documentadas.
- Sin `.cursor/rules`: Cursor no recibe instrucciones del repo.
- Sin `CLAUDE.md`: Claude Code no encuentra el contrato.
- `.claude/settings.json` con `param([string]);`: los hooks no se ejecutan.
- 3 archivos sin commitear en el árbol.

## Comandos para arreglarlo

```powershell
pnpm install --frozen-lockfile
pnpm dev
pnpm build
pnpm test
pnpm lint
pnpm typecheck
npx impeccable detect .
```

> Ejecutar desde la raíz del repositorio. Si un comando no existe en el proyecto, se añade al backlog en vez de inventarlo.

## Kit de cierre (15 minutos)

1. Respaldar `AGENTS.md`, `CLAUDE.md` y `.claude/settings.json` en `.agents/backup-20261103/`.
2. Copiar las plantillas de `DELIVERY/ecosistema-belentani7-2026-11-02/kit/templates/`.
3. Verificar el hook: `'{"tool_input":{"command":"git push --force"}}' | pwsh -File .claude/hooks/guard.ps1 bash` debe salir con código 2.
4. Ejecutar build y tests; pegar la salida en `.agents/status.md`.
5. Commit: `git add AGENTS.md CLAUDE.md .cursor .cursorignore .claude .agents .github/workflows/ci.yml .env.example && git commit -m "chore(agent-context): verified repo contract"`.

## Siguiente nivel

1. Ampliar cobertura a la ruta de negocio principal y a los errores.
2. Añadir gate de accesibilidad y presupuesto de rendimiento al CI.
3. Añadir `.cursor/rules` (000 ecosistema + 100 stack).
4. Añadir `CLAUDE.md` puntero a `AGENTS.md`.
5. Sustituir los hooks por `guard.ps1` y probar el exit 2.
6. Commitear los 3 archivos pendientes tras revisar el diff.
7. Cerrar con presupuesto de rendimiento (LCP < 2,5 s) y WCAG AA verificado.

## Referencias

- Auditoría global: `DELIVERY/ecosistema-belentani7-2026-11-02/INFORME-ECOSISTEMA-BELENTANI7.html`
- Inventario: `datos/inventario-428-repos.csv` · Cola: `datos/cola-finalizacion.csv`
- Kit: `kit/README.md` · Guía Cursor: `CURSOR-DESARROLLO.md`
