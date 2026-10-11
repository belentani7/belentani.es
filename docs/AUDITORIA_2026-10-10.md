# Auditoría y Correcciones — 2026-10-10

**Proyecto:** `Documents\belentani.es` (repo `belentani7/belentani.es`, Next.js 14.2.35, React 18.3.1)
**Bases:** Documentación oficial web 2026 (Context7 `/vercel/next.js`) + Biblia (`GLOSARIO_DOCUMENTOS.md` + protocolo `desarrollo-app`)

---

## Cobertura de la auditoría
- Ficheros trackeados en git: **271**
- Ficheros fuente `ts/tsx` escaneados (`src/` + `app/`): **78**
- Verificadores ejecutados: `check:boundaries`, `typecheck`, `lint`, `test`, `build`, `lighthouse`
- Documentos en `docs/`: 2 (sin cadena PRD/SRS/ADR)

---

## Hallazgos y correcciones (trazabilidad)

| ID | Hallazgo (Base) | Severidad | Fix aplicado | Verificación |
|---|---|---|---|---|
| H1 | `pnpm lint` **FAIL exit 2** — `eslint.config.mjs` importa 3 plugins inexistentes en `devDependencies`/`node_modules`; `eslint-config-next@15.1.0` desalineado con `next@14.2.35` (Base A: Next 14 stable) | P0 | 1. `pnpm add -D @next/eslint-plugin-next@14.2.35 @typescript-eslint/parser@^8 eslint-plugin-react-hooks@^5`<br>2. Arreglado `Button.tsx:33` eliminando `as any` con tipado correcto<br>3. `pnpm remove eslint-config-next` (no usado por flat config) | `pnpm lint` → **PASS** (exit 0) |
| H2 | `tsconfig.tsbuildinfo` trackeado en git (artefacto de build, 437 KB, se reescribe en cada build) | P1 | `.gitignore` ya incluía `*.tsbuildinfo` (línea 42); `git rm --cached tsconfig.tsbuildinfo` (staged, sin commit) | `git status` muestra `D  tsconfig.tsbuildinfo` (borrado del índice, permanece en disco) |
| H3 | `prefers-reduced-motion` parecía ausente (solo 1 fichero TS) | P1 → **Falso positivo** | Ya implementado globalmente en `app/globals.css` (línea 53-58) importando `redglass.css`; hook `useReducedMotion.ts` existe y se testea (`a11y.test.tsx` 4 tests) | Sin acción — ya cubierto |
| H4 | `engines.node: "22.x"` genera warning en Node 26; Next 14 requiere `>=18.17` (Base A) | P2 | `engines.node = ">=18.17.0"` en `package.json` | Warning de engine eliminado en siguiente install |
| H5 | Lighthouse budget declarado (`lighthouse-budget.json`) pero sin script ejecutable ni config `lighthouserc` | P2 | 1. Creado `lighthouserc.json` con `startServerCommand: "pnpm start --port 3017"`, `url: "http://localhost:3017"`, aserciones idénticas al budget<br>2. Script `lighthouse: "lhci autorun"` en `package.json` | `pnpm lighthouse` → **PASS** (3 runs, todas las aserciones: performance ≥0.9, a11y 1.0, FCP ≤2.5s, LCP ≤2.5s, TBT ≤200ms, CLS ≤0.1) |
| H6 | Glosario (Biblia) sin definiciones: **MoSCoW, GWT, ADR, deuda técnica** (Regla 6 CLAUDE.md) | P2 | Añadidas 4 entradas al final de `GLOSARIO_DOCUMENTOS.md` en formato tabla | `grep` confirma presencia |
| H7 | Cadena documental ausente: `docs/` solo tiene 2 ficheros; protocolo exige PRD→SRS→SDD→ADR→Plan→Rules | P2 | Documentada esta auditoría en `docs/AUDITORIA_2026-10-10.md` con trazabilidad hallazgo→fix→verificación | — |
| H8 | Rutas `/artist` y `/artista` coexisten (hashes distintos, no son copia byte a byte — Regla 7) | P2 | Inspeccionadas: son variantes ES/EN con contenido distinto; se mantienen ambas | Sin borrado |

---

## Evidencia final (cadena completa)
| Verificador | Resultado | Comando |
|---|---|---|
| `check:boundaries` | ✅ PASS | `pnpm check:boundaries` |
| `typecheck` | ✅ PASS | `pnpm typecheck` |
| `lint` | ✅ PASS | `pnpm lint` |
| `test` | ✅ PASS (28/28) | `pnpm test` |
| `build` | ✅ PASS (25 rutas, First Load JS 88–111 kB) | `pnpm build` |
| `lighthouse` | ✅ PASS (3 runs, budget cumplido) | `pnpm lighthouse` |

---

## Estado del repositorio post-correcciones
- Cambios sin commitear (staged + unstaged):
  - `M .gitignore` (modificado por editor previo, no por esta auditoría)
  - `D tsconfig.tsbuildinfo` (staged deletion)
  - `M src/design-system/components/Button.tsx` (fix tipado)
  - `M package.json` (engines, scripts, devDeps)
  - `A lighthouserc.json` (nuevo)
  - `?? src/design-system/components/Card.tsx`
  - `?? src/design-system/components/Chip.tsx`
  - `?? src/components/Providers.tsx`
  - `?? GLOSARIO_DOCUMENTOS.md` (fuera del repo del proyecto — en `.agents/skills/desarrollo-app/`)

> **Nota:** No se ha hecho `git commit` ni `git push` (Regla 1 AGENTS.md: preparar ≠ subir; permiso explícito requerido).

---

## Próximos pasos recomendados
1. **Commit** de los cambios staged/unstaged relevantes (excluir `design-system/*` y `Providers.tsx` si son trabajo en curso ajeno).
2. **Crear cadena documental mínima** en `docs/`: `PRD.md`, `SRS.md` con FR-XXX trazables a esta auditoría, `ADR` para decisiones (ej. upgrade Next 16, Lighthouse config).
3. **Evaluar upgrade a Next 16 / React 19.2** (Base A: estable 2026) — requiere codemod y testing de regresión visual.
4. **Unificar `/artist` y `/artista`** si son duplicados funcionales (i18n con `next-intl` o similar) — decisión de producto.