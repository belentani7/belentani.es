# PRODUCT.md — belentani.es

## Product
**belentani.es** — Universo artístico de BELENTANI: artista y compositor de São Paulo afincado en Barcelona. Música pop alternativa, R&B y electrónica experimental, más el universo narrativo JUDAS. Sitio inmersivo (Next.js 15 + React 19 + Tailwind 4) con galaxia navegable, lore stations, experiencia 3D y portal profesional.

## Mode
**Experience** (home/galaxia: el artefacto lidera, la interfaz recede) + **Persuade** (landing: comunicar valor profesional del artista) + **Operate** (lab, AI lab, voz, consultoría).

## Audience
Visitantes que descubren al artista por primera vez, profesionales de la música, y seguidores del universo JUDAS. Multilingüe desde el día 1 (es, en, ca, fr, it, pt, de, nl, ja).

## Stack
Next.js 15 (App Router) + React 19 + Tailwind 4 + Three.js / React Three Fiber + Zustand + PostHog (analytics). Tests: vitest (44/54). Build: next build. Typecheck: tsc --noEmit.

## Current state
- Typecheck: ✅ exit 0
- Tests: ✅ 44 tests, 14 files, exit 0
- Build: ✅ 45 páginas estáticas + SSG dinámicas, exit 0
- Seguridad: ✅ sin leaks (guard.py)
- i18n: ❌ ausente (todo el copy en español)
- PRODUCT.md / DESIGN.md: ❌ ausentes
- PostHog: ✅ integrado (sesión previa), pendiente API key de usuario

## Gaps to close (this plan)
1. i18n completo (9 idiomas) en layout, páginas y componentes
2. PRODUCT.md + DESIGN.md (sistema de diseño documentado)
3. Pulido de diseño según craft-floor
4. Más contenido funcional más allá del README
5. Verificación final: typecheck + tests + build + seguridad en verde
