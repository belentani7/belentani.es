# belentani.es — Etapa 2 del ecosistema (ciclo completo aplicado)

## Objetivo
Aplicar i18n (9 idiomas), diseño craft-floor y verificación completa a belentani.es (Next.js 15 + React 19 + Tailwind 4).

## Stack
Next.js 15 (App Router) + React 19 + Tailwind 4 + Three.js/R3F + Zustand + PostHog. Tests: vitest. Build: next build. Typecheck: tsc --noEmit.

## Archivos creados
| Archivo | Responsabilidad |
|---------|-----------------|
| `PRODUCT.md` | Contexto de producto: modo, audiencia, stack, estado, gaps |
| `DESIGN.md` | Sistema de diseño: dirección, tokens, craft-floor bans, superficies, i18n |
| `src/lib/i18n.tsx` | Fábrica `createI18n`, `I18nProvider`, `useTranslation`, 9 idiomas |
| `src/components/I18nProvider.tsx` | Provider de cliente que envuelve el layout |
| `src/locales/index.ts` | Re-exporta los 9 JSON de idioma |
| `src/locales/{en,es,ca,fr,it,pt,de,nl,ja}.json` | 34 claves de traducción cada uno |

## Archivos modificados
| Archivo | Cambio |
|---------|--------|
| `app/layout.tsx` | Importa y envuelve con `BelentaniI18nProvider` |
| `app/page.tsx` | Server Component: solo exporta `metadata`, renderiza `HomeClient` |
| `app/home-client.tsx` | Client Component con `useTranslation` y claves `t()` |

## Verificación (exit codes reales)
| Comando | Resultado |
|---------|-----------|
| `pnpm run typecheck` | exit 0 |
| `pnpm run test` | 44 tests, 14 files, exit 0 |
| `pnpm run build` | 45 páginas, exit 0 |
| `guard.py --path belentani.es` | árbol limpio (solo placeholders de docs y `.next/` no tracked) |

## Tareas pendientes (siguientes pasadas)
- Aplicar `t()` a las páginas restantes: /musica, /lore, /galaxia, /lab, /school, /agency, /consultoria, /judas, etc.
- Añadir más claves de traducción a los 9 JSONs según se vayan traduciendo las páginas.
- Pulido de diseño craft-floor en cada página.

## Alcance "ecosistema entero por etapas"
- Etapa 1: secure-t — completada (i18n 6 páginas, 289 claves × 9 idiomas, todo verde).
- Etapa 2: belentani.es — completada (i18n layout + home, 34 claves × 9 idiomas, todo verde).
- Siguiente: elegir el siguiente repo del ecosistema (premium-factory-api, elracodepatricia-backend, organizacion-html5, red-starfield-frontend, etc.).

## Sin commitear
Ningún cambio ha sido commiteado ni pusheado (requiere autorización explícita del usuario).
