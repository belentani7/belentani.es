# DESIGN DOC: Belentani Unified Hub — Galaxy Map + JUDAS Era Deep-Dive

**Status:** Draft
**Created:** 2026-10-04
**Author:** Pedro Belentani + AI Assistant
**Stack:** Next.js 15 App Router + React 19 + R3F (Three.js 0.160.0 pinned) + GSAP 3.12 + Tailwind v4 + TypeScript 5.6
**Deployment:** Vercel (Edge for marketing, Node.js for AI server actions)

---

## 1. ARCHITECTURE OVERVIEW

### 1.1 Route Groups (Next.js 15 App Router)

```
app/
├── (marketing)/           # SSR/ISR — SEO-critical, fast TTFB
│   ├── layout.tsx         # Shared marketing shell (header, footer, fonts)
│   ├── page.tsx           # Landing: hero + artist statement + music preview
│   ├── artista/           # Bio, press, contact, booking
│   ├── prensa/            # Press kit, assets, media
│   └── musica/            # Catalog, streaming links, stems info
├── (immersive)/           # CSR only — WebGL heavy, dynamic imports
│   ├── layout.tsx         # Immersive shell (galaxy map provider, audio context)
│   ├── galaxia/           # Galaxy map shell — central hub
│   │   ├── page.tsx       # GalaxyMap (R3F) + DockPanel + HUD
│   │   └── components/    # GalaxyMap, Ship, Node, Route, DockPanel, HUD
│   ├── judas/             # JUDAS ERA — deep chapter routes
│   │   ├── page.tsx       # Era overview + chapter index
│   │   ├── [capitulo]/    # Dynamic chapter routes
│   │   │   ├── page.tsx   # Chapter shell (R3F canvas + GSAP scroll narrative)
│   │   │   └── components/# Chapter-specific scenes
│   │   └── components/    # Shared JUDAS components
│   ├── omega/             # Gallery card → belentani.es
│   ├── neon/              # Gallery card → belentani-es-neon
│   └── duck/              # Gallery card → duck-hub
├── api/                   # Server Actions for AI services
│   ├── ai/
│   │   ├── lore-chat/     # JUDAS narrator chat
│   │   ├── lyric-analysis/# Melodic math analysis
│   │   └── prompt-opt/    # Cinematic prompt optimization
│   └── health/            # Health check
├── globals.css            # Tailwind v4 + design tokens + global styles
├── layout.tsx             # Root layout (providers, fonts, metadata)
└── page.tsx               # Redirect to (marketing)/ or (immersive)/galaxia
```

### 1.2 Rendering Strategy

| Route Group | Rendering | Purpose |
|-------------|-----------|---------|
| `(marketing)` | SSR + ISR (revalidate: 3600) | SEO, fast TTFB, shareable URLs |
| `(immersive)` | CSR only (`'use client'` at layout) | WebGL, audio, heavy interactions |
| `api/ai/*` | Server Actions (Node.js runtime) | Secure AI calls, rate limiting |

### 1.3 Two-Layer Visual Architecture

```
┌─────────────────────────────────────────────────────────────┐
│  LAYER 1: REACT / GSAP / TAILWIND (ALL UI)                 │
│  ├── Navigation, HUD, Dock, Modals, Forms, Typography      │
│  ├── ScrollTrigger narratives (marketing pages)            │
│  ├── FLIP transitions (world entry/exit)                   │
│  ├── Design System: tokens, components, patterns           │
│  └── State: Zustand (UI), React Query (server data)        │
├─────────────────────────────────────────────────────────────┤
│  LAYER 2: R3F / THREE.JS (IMMERSIVE CANVASES)              │
│  ├── GalaxyMap: starfield, ship, nodes, routes (SVG/Canvas)│
│  ├── JUDAS Chapters: procedural planet, diamond, key, etc. │
│  ├── Post-processing: Bloom, DOF, Chromatic Aberration     │
│  ├── Audio-reactive: Web Audio API → shader uniforms       │
│  └── Performance: LOD, instancing, frustum culling         │
└─────────────────────────────────────────────────────────────┘
```

**Integration Pattern:** R3F canvases mounted via `<Canvas>` inside Suspense boundaries. React UI overlays via `Dom` portal or absolute-positioned HTML over canvas. GSAP controls both layers via shared timeline refs.

---

## 2. WORLD SYSTEM & NAVIGATION

### 2.1 Galaxy Map (Central Hub)

**Route:** `/galaxia` (immersive shell entry point)

**Visual Metaphor:** Living star map. Central star = **Belentani (Main Artist)**. Orbiting nodes = **Eras** (JUDAS, OMEGA, NEON, etc.). Separate orbit = **DUCK** (distinct artist persona).

**Data Model (from `UNIVERSO_GALAXIAS.json` + `UNIVERSO-ARTISTICO.md`):**

```typescript
interface GalaxySystem {
  id: string;                    // 'belentani' | 'judas' | 'omega' | 'neon' | 'duck'
  name: string;                  // Display name
  kind: 'artist' | 'era' | 'duck';
  tag: string;                   // Short tag: 'ERA JUDAS' | 'ECOSISTEMA' | 'ARTISTA'
  blurb: string;                 // One-line description
  color: string;                 // Node color (hex)
  position: { x: number; y: number }; // 0-100 normalized
  size: number;                  // Visual weight
  panel: 'nucleo' | 'judas' | 'omega' | 'neon' | 'duck'; // Dock panel type
  url?: string;                  // External URL for gallery cards
  chapters?: Chapter[];          // Only for deep eras (JUDAS)
}

interface Chapter {
  id: string;                    // 'genesis' | 'traicion' | 'deuda' | 'redencion' | 'biblia-musica' | 'qwen-perfil'
  name: string;
  symbol: string;                // Visual symbol
  lore: string;                  // Narrative text
  audio?: string;                // Audio asset path
  scene: 'planet' | 'diamond' | 'key' | 'machine' | 'biblia' | 'cognition'; // R3F scene type
}
```

**Interaction:**
- Keyboard: ←/→ cycle nodes, Enter = travel, Esc = close dock
- Mouse: Click node = travel, hover = preview
- Ship animates along **Canvas paths** (GSAP MotionPathPlugin) — not SVG (performance)
- Travel flash (radial gradient) on arrival
- Dock panel slides in with context: lore, actions (Enter Chapter / Visit External)

### 2.2 JUDAS Era — Deep Chapter Routes

**Route Pattern:** `/judas/[capitulo]` where `capitulo ∈ {genesis, traicion, deuda, redencion, biblia-musica, qwen-perfil}`

**Chapter Structure (from `LORE_UNIFICADO-WEB-GALACTICO-2026-09-20.md` + `lore-canon/belentani-universo-SKILL.md`):**

| Chapter | Scene Type | Core Visual | Narrative Beat |
|---------|------------|-------------|----------------|
| `genesis` | Planet formation | Procedural planet + accretion disk | "Antes del nombre hubo un cuerpo sin voz" |
| `traicion` | Diamond IOR 2.417 | Faceted diamond, caustics, PBR gold | "El narrador se revela antihéroe" |
| `deuda` | Golden key (partial lock) | Key + chain, particles | "Alguien queda con una deuda impagable" |
| `redencion` | Organic machine | Gears + organic growth, bioluminescence | "La herida cerrada como blasón" |
| `biblia-musica` | Melodic math UI | Interactive notation, frequency viz | "Genealogía: Denniz PoP → Max Martin → Belentani" |
| `qwen-perfil` | Cognition visualization | Neural network, thought streams | "Perfil musical desde stems reales" |

**Each Chapter Page:**
- R3F canvas (full viewport) with scene specific to chapter
- GSAP ScrollTrigger narrative overlay (HTML over canvas)
- Audio player (stems from `judas-experience-web/assets/audio/`)
- Chapter navigation (prev/next, index)
- Reduced motion: static scene + instant text

### 2.3 Gallery Cards (Omega, Neon, Duck)

**Component:** `<WorldGalleryCard />` — reusable for non-deep worlds

**Props:**
```typescript
interface GalleryCardProps {
  system: GalaxySystem;  // omega | neon | duck
  heroMedia: 'image' | 'video' | 'webgl-preview';
  metrics: { label: string; value: string }[]; // e.g., "6 Eras", "432 Hz", "10/10"
  cta: { label: string; href: string; external: boolean };
}
```

**Visual:** Hero media (video/image/**static WebGL thumbnail** — pre-rendered PNG from chapter scene), title, tag, 3 metrics, CTA button. Hover = subtle parallax + border glow.

---

## 3. DESIGN SYSTEM (EXTRACTED FROM BELENTANI.ES + JUDAS-EXPERIENCE-WEB)

### 3.1 Design Tokens (`@/design-system/tokens.ts`)

```typescript
export const tokens = {
  colors: {
    void: '#030008',
    voidElevated: '#0a0205',
    ink: '#f2e8ef',
    mute: '#9a8a96',
    red: '#ff073a',
    redDim: '#7a0e1e',
    blood: '#8a0303',
    gold: '#d4af37',
    goldDim: '#8a6d1f',
    cyan: '#4de8e0',
    green: '#39ff8a',
    glass: 'rgba(12,4,18,.72)',
    glassEdge: 'rgba(255,7,58,.28)',
    goldEdge: 'rgba(212,175,55,.28)',
  },
  fonts: {
    display: '"Orbitron", "Share Tech Mono", ui-monospace, monospace',
    body: '"Rajdhani", "Share Tech Mono", system-ui, sans-serif',
    mono: '"Share Tech Mono", ui-monospace, Consolas, monospace',
  },
  spacing: { xs: '4px', sm: '8px', md: '16px', lg: '24px', xl: '32px', xxl: '48px' },
  radii: { sm: '8px', md: '12px', lg: '16px', full: '9999px' },
  shadows: {
    glowRed: '0 0 24px rgba(255,7,58,.35), inset 0 0 12px rgba(255,7,58,.12)',
    glowGold: '0 0 24px rgba(212,175,55,.35)',
    elevation: '0 20px 52px -30px #000, 0 0 38px -24px rgba(255,7,58,.5)',
  },
  motion: {
    fast: '150ms ease-out',
    base: '250ms ease-out',
    slow: '400ms ease-out',
    spring: 'cubic-bezier(.22,1,.36,1)',
  },
  breakpoints: { sm: '640px', md: '768px', lg: '1024px', xl: '1280px', '2xl': '1536px' },
  zIndex: { hud: 10, dock: 20, modal: 100, toast: 200, boot: 300 },
} as const;
```

### 3.2 Core Components (`@/design-system/components/`)

| Component | Purpose | Variants |
|-----------|---------|----------|
| `Button` | Primary actions | `primary` (red), `gold`, `ghost`, `chip` |
| `Card` | Content containers | `glass`, `redglass`, `panel`, `record` |
| `Chip` | Status/tags | `default`, `action`, `soft`, `progress` |
| `Modal` | Overlays | `default`, `terminal`, `tarot`, `forge` |
| `Terminal` | Log/console UI | `syslog`, `input`, `quick-commands` |
| `AudioPlayer` | Fixed bottom-right | `ambient`, `chapter`, `stem` |
| `GalaxyNode` | Map nodes | `artist`, `era`, `duck`, `warp` |
| `DockPanel` | Context drawer | `panel`, `warp`, `local` |
| `ScrollSection` | GSAP narrative | `hero`, `journey`, `catalog`, `lore` |

### 3.3 Red Glass / Gold Glass Patterns (from belentani.es)

```css
.ng-redglass {
  border-color: var(--glass-edge) !important;
  background: linear-gradient(145deg, rgba(255,7,58,.09), transparent 45%),
              linear-gradient(190deg, rgba(255,255,255,.055), transparent 34%),
              var(--glass) !important;
  backdrop-filter: blur(18px) saturate(1.35);
  box-shadow: inset 0 1px 0 rgba(255,255,255,.2),
              inset 0 -1px 0 rgba(255,7,58,.28),
              -1px 0 0 rgba(77,232,224,.22),
              1px 0 0 rgba(212,175,55,.18),
              0 20px 52px -30px #000,
              0 0 38px -24px rgba(255,7,58,.5);
}
```

---

## 4. JUDAS ERA — CHAPTER TECHNICAL SPEC

### 4.1 Chapter: Genesis — Procedural Planet Formation

**R3F Scene:** `GenesisScene`
- **Planet:** `BatchedMesh` for terrain chunks, procedural noise (simplex) for elevation
- **Atmosphere:** `threejs-atmosphere-aerial-perspective` — Rayleigh/Mie scattering, LUT-based transmittance
- **Accretion Disk:** `threejs-particles-trails-and-effects` — particle ring, GPU instanced
- **Camera:** Chase rig (`threejs-camera-controls-and-rigs`) — orbital, zoom to surface
- **Post:** `UnrealBloomPass` + custom atmosphere shader

**GSAP Narrative:** ScrollTrigger timeline — scroll down = camera descends from orbit → surface → mirror pool

### 4.2 Chapter: Traición — Diamond IOR 2.417

**R3F Scene:** `DiamondScene`
- **Geometry:** Procedural faceted diamond (custom BufferGeometry, 57+ facets)
- **Material:** `MeshPhysicalMaterial` with `ior: 2.417`, `dispersion: 0.044`, `thickness: 2.0`
- **Caustics:** `threejs-water-optics` — photon mapping approximation via screen-space caustics
- **Environment:** `RoomEnvironment` + custom HDR (golden hour)
- **Animation:** Slow rotation + facet highlight sweep (GSAP → material uniforms)

**GSAP Narrative:** Horizontal scroll = rotate diamond, reveal facets, caustics dance

### 4.3 Chapter: Deuda — Golden Key + Chain

**R3F Scene:** `KeyScene`
- **Key:** Procedural (SweepGeometry from profile), PBR gold (`threejs-procedural-materials`)
- **Chain:** `InstancedMesh` links, physics simulation (position-based dynamics in compute shader)
- **Particles:** Dust motes in volumetric light (`threejs-volumetric-clouds` adapted)
- **Symbolism:** Key partially inserted in lock (silhouette only, no institution names)

### 4.4 Chapter: Redención — Organic Machine

**R3F Scene:** `MachineScene`
- **Structure:** `threejs-procedural-architecture` — gear profiles, organic growth via SDF
- **Materials:** Subsurface scattering (skin-like) + metallic gears (`threejs-materials`)
- **Animation:** `threejs-procedural-motion-systems` — gear rotation drives organic bloom
- **Lighting:** `threejs-lighting` — volumetric god rays through gear teeth

### 4.5 Chapter: Biblia Música — Melodic Math Interactive

**R3F Scene:** `BibliaScene` (minimal 3D, mostly UI)
- **Visualization:** `threejs-shaders` — frequency domain, note lattice, syllable mapping
- **Data:** From `catalogo-artista.js` + stem analysis (Qwen profile)
- **Interaction:** Click measure → hear stem, see notation, adjust parameters

### 4.6 Chapter: Qwen Perfil — Cognition Visualization

**R3F Scene:** `CognitionScene`
- **Visualization:** Neural network graph (nodes = concepts, edges = associations)
- **Layout:** Force-directed via `d3-force` (CPU, precomputed at build) + manual positioning for key concepts; positions baked into JSON
- **Animation:** Thought propagation as particle flow along edges (GPU instanced particles)
- **Data:** From `qwen-perfil` analysis (stems → archetypes → language switching)

---

## 5. AI SERVICES INTEGRATION

### 5.1 Architecture

```
Client (React) → Server Action (Next.js) → OpenRouter API (free models)
                                    ↘ Local Fallback (Ollama/Web Worker)
```

### 5.2 Server Actions (`app/api/ai/*/actions.ts`)

```typescript
// app/api/ai/lore-chat/actions.ts
'use server';
import { createOpenRouter } from '@/lib/openrouter';
import { systemPrompts } from '@/lib/lore-prompts';

export async function loreChat(messages: Message[], context: 'judas' | 'biblia' | 'qwen') {
  const openrouter = createOpenRouter(); // Reads OPENROUTER_API_KEY from env
  const model = 'nvidia/nemotron-3-ultra-550b-a55b:free'; // Verified working 2026-10-03
  
  const systemPrompt = systemPrompts[context]; // Defined in @/lib/lore-prompts.ts
  
  const stream = await openrouter.chat.completions.create({
    model,
    messages: [{ role: 'system', content: systemPrompt }, ...messages],
    stream: true,
    max_tokens: 2048,
    temperature: 0.7,
  });
  
  // Return ReadableStream for React useStreamableValue / AI SDK
  return new Response(stream.toReadableStream(), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
```

### 5.3 Free Models Verified (2026-10-03)

| Model | Context | Use Case | Status |
|-------|---------|----------|--------|
| `nvidia/nemotron-3-ultra-550b-a55b:free` | 1M | Lore chat, complex reasoning | ✅ Working |
| `nvidia/nemotron-3-super-120b-a12b:free` | 1M | Faster responses | ✅ Working |
| `cohere/north-mini-code:free` | 32K | Code generation | ✅ Working |
| `liquid/lfm-2.5-2.6b:free` | 32K | Lightweight chat | ✅ Working |

**Blocked (429 pool exhausted):** `gemma-4-*`, `qwen/qwen3.8-27b:free`

### 5.4 Local Fallback Strategy

- **Ollama** (if running locally): `llama3.2:3b`, `nemotron3:8b` via Web Worker (`@/lib/ollama-worker.ts`)
- **Static Fallbacks:** Pre-written responses in `@/lib/ai-fallbacks.ts` per feature:
  - `lore-chat`: 5 canonical JUDAS narrator responses (from lore-canon)
  - `lyric-analysis`: Template with melodic math rules (from `lore-canon/belentani-universo-SKILL.md`)
  - `prompt-opt`: Cinematic prompt templates (from `cinematic-prompt-formatter` repo)
- **DeepSeek Key:** ONLY in `Desktop/deep.txt` → read by `aider-deep.cmd` → NEVER in repo, NEVER in build, NEVER in Vercel env

### 5.5 Rate Limiting

- Upstash Redis (free tier: 10K req/day)
- 10 req/min per IP per endpoint
- Return 429 with `Retry-After` header

---

## 6. PERFORMANCE BUDGETS & VERIFICATION

### 6.1 Bundle Budgets (Lighthouse CI)

| Route Group | JS (gz) | CSS (gz) | Total (gz) | LCP | TBT | CLS |
|-------------|---------|----------|------------|-----|-----|-----|
| `(marketing)` | < 150 KB | < 30 KB | < 200 KB | < 2.5s | < 200ms | < 0.1 |
| `(immersive)/galaxia` | < 300 KB | < 40 KB | < 400 KB | < 3.5s | < 300ms | < 0.1 |
| `(immersive)/judas/*` | < 500 KB | < 50 KB | < 600 KB | < 4.0s | < 500ms | < 0.1 |

### 6.2 Verification Strategy

- **Unit:** Vitest + React Testing Library (design system, utils, AI actions)
- **Integration:** Playwright (marketing pages, galaxy map navigation, chapter flow)
- **Visual:** `threejs-visual-validation` — fixed-view contracts, seed sweeps, GPU budgets
- **Accessibility:** axe-core (WCAG 2.1 AA) in CI
- **Performance:** Lighthouse CI on every PR (budgets above)

### 6.3 Three.js Visual Validation (from `threejs-visual-validation` skill)

- Fixed camera positions per chapter (reproducible renders)
- Field/pass diagnostics (depth, normal, motion vectors)
- No-post baselines (raw beauty pass)
- Seed sweeps for procedural content
- Camera-scale tests (mobile vs desktop)
- Temporal stability (10-frame sequences)
- GPU budget tracking (draw calls, triangles, texture memory)

---

## 7. ACCESSIBILITY & REDUCED MOTION

### 7.1 Commitments

- **WCAG 2.1 AA** minimum
- `prefers-reduced-motion: reduce` → disable ALL animations/transitions
- Keyboard navigation for ALL interactive elements (galaxy map, chapters, dock)
- ARIA labels for canvas elements (via `<canvas aria-label="">` + hidden descriptive text)
- Focus visible: `outline: 2px solid var(--cyan); outline-offset: 3px`
- Color contrast: 4.5:1 minimum (ink/void, gold/void, red/void all pass)

### 7.2 Reduced Motion Implementation

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
  .ship { transition: none; }
  .route { stroke-dasharray: none; }
  .travel-flash { display: none; }
  /* R3F: disable render loop animation, show static frame */
}
```

---

## 8. CONTENT SOURCES & ASSET PIPELINE

### 8.1 Content Sources (Verified, No Invention)

| Content | Source File | Location |
|---------|-------------|----------|
| Artist bio/facts | `UNIVERSO-ARTISTICO.md`, `INDICE-MAESTRO.md` | Documents |
| Lore chapters | `LORE_UNIFICADO-WEB-GALACTICO-2026-09-20.md` | `judas-experience-web` |
| Bible/melodic math | `lore-canon/belentani-universo-SKILL.md` | `belentani.es` |
| Qwen profile | `UNIVERSO-ARTISTICO.md` + stem analysis | `judas-experience-web` |
| Music catalog | `catalogo-artista.js` | `belentani.es/app-web-nextjs/...` |
| Galaxy systems | `UNIVERSO_GALAXIAS.json` | `belentani.es` |
| Audio stems | `assets/audio/sessions/*.mp3` | `judas-experience-web` |
| Key art | `assets/judas-key-art-planeta-diamante.png` | `judas-experience-web` |
| Hero video | `assets/media/judas-hero.mp4` | `belentani-omega-immersive-portal` |

### 8.2 Asset Pipeline

- **Images:** Sharp → WebP/AVIF, multiple widths (400, 800, 1200, 1920)
- **Video:** FFmpeg → H.264 (MP4) + VP9 (WebM), poster frames
- **Audio:** MP3 (128kbps) + Opus (96kbps), Web Audio API decoding
- **3D Assets:** GLTF/GLB (Draco compressed), procedural where possible
- **Fonts:** Self-hosted (Orbitron, Rajdhani, Share Tech Mono), `preload` + `font-display: swap`
- **Three.js Version:** Pinned to `three@0.160.0` (r160) — matches R3F peer dependency
- **Error Boundaries:** React Error Boundary per route group + R3F `<Canvas>` fallback UI
- **Font Loading:** `next/font` with `variable: '--font-orbitron'` etc., preload in root layout

---

## 9. DEPLOYMENT & CI/CD

### 9.1 Vercel Configuration

```json
// vercel.json
{
  "framework": "nextjs",
  "buildCommand": "pnpm build",
  "devCommand": "pnpm dev",
  "installCommand": "pnpm install",
  "regions": ["mad1"],
  "functions": {
    "app/api/ai/**/*.ts": {
      "maxDuration": 30,
      "runtime": "nodejs20.x"
    }
  },
  "headers": [
    { "source": "/(.*)", "headers": [{ "key": "X-Content-Type-Options", "value": "nosniff" }] },
    { "source": "/assets/(.*)", "headers": [{ "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }] }
  ]
}
```

### 9.2 Environment Variables (Vercel Project Settings)

| Variable | Source | Scope |
|----------|--------|-------|
| `OPENROUTER_API_KEY` | Vercel Encrypted Env | Server Actions only |
| `UPSTASH_REDIS_REST_URL` | Vercel Encrypted Env | Rate limiting |
| `UPSTASH_REDIS_REST_TOKEN` | Vercel Encrypted Env | Rate limiting |
| `NEXT_PUBLIC_SITE_URL` | Vercel System | Client + Server |

**NEVER in repo:** `.env`, `.env.local`, `.env.production`, any `*credential*`, `*secret*`, `DEUDAFIX*`

### 9.3 CI Pipeline (GitHub Actions)

```yaml
# .github/workflows/ci.yml
jobs:
  lint-typecheck: { runs: [eslint, tsc --noEmit, stylelint] }
  test: { runs: [vitest, playwright --project=chromium] }
  visual: { runs: [threejs-visual-validation] }
  a11y: { runs: [axe-core] }
  lighthouse: { runs: [lighthouse-ci --budget] }
  build: { needs: [lint-typecheck, test, visual, a11y], runs: [next build] }
  deploy-preview: { needs: build, runs: [vercel deploy --prebuilt] }
  deploy-production: { needs: deploy-preview, runs: [vercel deploy --prebuilt --prod] }
```

---

## 10. TRACEABILITY MATRIX (PRD → SRS → DESIGN → TESTS)

| PRD Goal | SRS Requirement | Design Component | Test |
|----------|-----------------|------------------|------|
| Unified artist hub | FR-001: Galaxy map with 4 worlds | `GalaxyMap`, `WorldGalleryCard` | E2E: navigate all 4 |
| JUDAS era deep-dive | FR-002: 6 chapters with R3F scenes | `JudasChapterPage`, 6 scene components | Visual: seed sweep per chapter |
| Immersive visuals | NFR-001: WebGL hero + post-processing | `EffectComposer`, custom shaders | Visual: no-post baseline |
| Real AI services | FR-003: Lore chat, lyric analysis | Server Actions + OpenRouter | Integration: mocked API |
| Design system | FR-004: Consistent tokens/components | `@/design-system/*` | Unit: token usage, snapshot |
| Performance | NFR-002: LCP < 2.5s (marketing) | Dynamic imports, ISR | Lighthouse CI budget |
| Accessibility | NFR-003: WCAG 2.1 AA | Reduced motion, ARIA, focus | axe-core CI |

---

## 11. OPEN QUESTIONS & RISKS

| ID | Question/Risk | Owner | Target Date |
|----|---------------|-------|-------------|
| OQ-001 | OpenRouter free tier stability (429s observed) | Dev | 2026-10-07 |
| OQ-002 | R3F + Next.js 15 hydration boundary issues | Dev | 2026-10-07 |
| OQ-003 | Audio context policy (autoplay blocked) | Dev | 2026-10-07 |
| OQ-004 | Three.js vendor bundle size (1.4MB core) | Dev | 2026-10-07 |
| RSK-001 | Vercel deployment protection on preview URLs | Dev | 2026-10-07 |
| RSK-002 | Mobile WebGL performance (GalaxyMap + JUDAS) | Dev | 2026-10-10 |

---

## 12. CHANGELOG

| Date | Author | Change |
|------|--------|--------|
| 2026-10-04 | Pedro + AI | Initial design doc (Approach C selected) |