# Belentani Unified Hub Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the Belentani Unified Hub — a Next.js 15 hybrid SSR/CSR app with a Three.js/R3F galaxy map as central hub, deep JUDAS era chapter routes (6 chapters with procedural R3F scenes), and gallery cards for OMEGA/NEON/DUCK worlds, all driven by a shared design system extracted from belentani.es and judas-experience-web, with real AI services via OpenRouter free tier.

**Architecture:** Next.js 15 App Router with route groups: `(marketing)` for SSR/ISR pages (landing, artista, prensa, musica) and `(immersive)` for CSR-only WebGL routes (galaxia, judas/*). Two-layer visual architecture: React/GSAP/Tailwind for ALL UI + R3F/Three.js for immersive canvases. Server Actions for AI services (OpenRouter free models). Design system in `@/design-system` with tokens, components, and patterns.

**Tech Stack:** Next.js 15.1+, React 19, @react-three/fiber 8.16+, @react-three/drei 9.100+, Three.js 0.160.0 (pinned), GSAP 3.12+, Tailwind CSS 4.0+, TypeScript 5.6, Zustand 4.5+, @tanstack/react-query 5.0+, Vitest, Playwright, pnpm.

**Spec:** `docs/superpowers/specs/2026-10-04-belentani-unified-hub-design.md`

---

## Global Constraints

- **Three.js version:** `0.160.0` (pinned in package.json, not `latest`)
- **Node runtime:** `nodejs20.x` for Server Actions (Vercel)
- **No secrets in repo:** `.env*` never committed; `OPENROUTER_API_KEY`, `UPSTASH_REDIS_*` only in Vercel Encrypted Env
- **DeepSeek key:** ONLY in `Desktop/deep.txt` → read by `aider-deep.cmd` → NEVER in repo/build/Vercel
- **Reduced motion:** `@media (prefers-reduced-motion: reduce)` disables ALL animations/transitions globally
- **WCAG 2.1 AA:** Minimum contrast 4.5:1, keyboard nav for all interactive, ARIA for canvas
- **Bundle budgets:** Marketing < 200KB gz, Galaxia < 400KB gz, JUDAS chapters < 600KB gz
- **Fonts:** Self-hosted Orbitron, Rajdhani, Share Tech Mono via `next/font` with `preload` + `font-display: swap`
- **Content sources ONLY:** No invented facts — all from `UNIVERSO-ARTISTICO.md`, `LORE_UNIFICADO-WEB-GALACTICO-2026-09-20.md`, `lore-canon/belentani-universo-SKILL.md`, `catalogo-artista.js`, `UNIVERSO_GALAXIAS.json`, `judas-experience-web` assets

---

## Review Focus

| Input / Condition | Expected Behavior | Test Location |
|-------------------|-------------------|---------------|
| `prefers-reduced-motion: reduce` | ALL animations/transitions disabled (CSS + GSAP + R3F render loop) | Task 7.2 (a11y) |
| OpenRouter 429 / network failure | Fallback to static responses from `@/lib/ai-fallbacks.ts` within 2s | Task 5.3 (AI integration) |
| Mobile WebGL (iOS Safari, Chrome Android) | GalaxyMap + JUDAS chapters render at 30fps, fallback to static image if WebGL fails | Task 8.2 (mobile perf) |
| Audio autoplay blocked | AudioPlayer shows play button, user gesture starts context | Task 6.4 (audio) |
| Vercel deployment protection on preview | Preview URLs accessible without login (config in vercel.json) | Task 9.1 (deploy) |

---

## File Structure Map

```
belentani.es/                          # Project root (existing)
├── app/
│   ├── (marketing)/
│   │   ├── layout.tsx                 # Marketing shell (header, footer, fonts)
│   │   ├── page.tsx                   # Landing page
│   │   ├── artista/page.tsx           # Artist bio/press/contact
│   │   ├── prensa/page.tsx            # Press kit
│   │   └── musica/page.tsx            # Music catalog
│   ├── (immersive)/
│   │   ├── layout.tsx                 # Immersive shell (providers, audio ctx)
│   │   ├── galaxia/
│   │   │   ├── page.tsx               # GalaxyMap page
│   │   │   └── components/
│   │   │       ├── GalaxyMap.tsx      # R3F canvas + starfield + ship + nodes
│   │   │       ├── GalaxyNode.tsx     # Individual node (artist/era/duck)
│   │   │       ├── Ship.tsx           # Animated ship along paths
│   │   │       ├── Route.tsx          # Canvas path between nodes
│   │   │       ├── DockPanel.tsx      # Context drawer (panel/warp/local)
│   │   │       └── HUD.tsx            # Top bar + legend + keyboard hints
│   │   ├── judas/
│   │   │   ├── page.tsx               # Era overview + chapter index
│   │   │   ├── [capitulo]/
│   │   │   │   ├── page.tsx           # Chapter shell (Canvas + ScrollTrigger)
│   │   │   │   └── components/
│   │   │   │       ├── GenesisScene.tsx
│   │   │   │       ├── DiamondScene.tsx
│   │   │   │       ├── KeyScene.tsx
│   │   │   │       ├── MachineScene.tsx
│   │   │   │       ├── BibliaScene.tsx
│   │   │   │       └── CognitionScene.tsx
│   │   │   └── components/
│   │   │       ├── ChapterNav.tsx     # Prev/Next/Index
│   │   │       └── AudioPlayer.tsx    # Chapter-specific stems
│   │   ├── omega/page.tsx             # Gallery card
│   │   ├── neon/page.tsx              # Gallery card
│   │   └── duck/page.tsx              # Gallery card
│   ├── api/ai/
│   │   ├── lore-chat/actions.ts       # JUDAS narrator chat
│   │   ├── lyric-analysis/actions.ts  # Melodic math analysis
│   │   └── prompt-opt/actions.ts      # Cinematic prompt optimization
│   ├── globals.css                    # Tailwind v4 + design tokens
│   ├── layout.tsx                     # Root layout (providers, metadata)
│   └── page.tsx                       # Redirect to / (marketing) or /galaxia
├── src/
│   ├── design-system/
│   │   ├── tokens.ts                  # Design tokens (colors, fonts, spacing, etc.)
│   │   ├── components/
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Chip.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Terminal.tsx
│   │   │   ├── AudioPlayer.tsx
│   │   │   ├── GalaxyNode.tsx         # Reusable for galaxy map
│   │   │   ├── DockPanel.tsx
│   │   │   └── ScrollSection.tsx
│   │   └── index.ts                   # Barrel exports
│   ├── lib/
│   │   ├── openrouter.ts              # OpenRouter client wrapper
│   │   ├── lore-prompts.ts            # System prompts per context
│   │   ├── ai-fallbacks.ts            # Static fallback responses
│   │   ├── ollama-worker.ts           # Web Worker for local Ollama
│   │   ├── galaxy-data.ts             # GalaxySystem[] from UNIVERSO_GALAXIAS.json
│   │   ├── judas-data.ts              # Chapter[] from lore sources
│   │   ├── catalogo.ts                # Music catalog from catalogo-artista.js
│   │   └── utils.ts                   # Helpers (cn, format, etc.)
│   ├── hooks/
│   │   ├── useGalaxyMap.ts            # Galaxy map state (current, travel, etc.)
│   │   ├── useScrollTrigger.ts        # GSAP ScrollTrigger wrapper
│   │   └── useAudio.ts                # Web Audio API wrapper
│   ├── store/
│   │   ├── ui.ts                      # Zustand: modal, dock, HUD state
│   │   └── galaxy.ts                  # Galaxy map state (current node, etc.)
│   └── styles/
│       └── redglass.css               # Red glass / gold glass patterns
├── public/
│   ├── assets/
│   │   ├── audio/                     # Stems from judas-experience-web
│   │   ├── images/                    # Key art, thumbnails
│   │   ├── video/                     # Hero video
│   │   └── fonts/                     # Self-hosted fonts
│   └── og-cover.png                   # Open Graph image
├── docs/superpowers/specs/2026-10-04-belentani-unified-hub-design.md
├── docs/superpowers/plans/2026-10-04-belentani-unified-hub-plan.md  # This file
├── package.json
├── pnpm-lock.yaml
├── tsconfig.json
├── next.config.ts
├── tailwind.config.ts
├── vercel.json
├── .github/workflows/ci.yml
├── playwright.config.ts
├── vitest.config.ts
└── lighthouse-budget.json
```

---

## Phase 1: Foundation & Configuration

### Task 1: Project Setup & Configuration

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `next.config.ts`
- Create: `tailwind.config.ts`
- Create: `vercel.json`
- Create: `.github/workflows/ci.yml`
- Create: `playwright.config.ts`
- Create: `vitest.config.ts`
- Create: `lighthouse-budget.json`
- Create: `.gitignore`
- Create: `.editorconfig`

**Interfaces:**
- Consumes: (none — first task)
- Produces: Build system, TypeScript config, Next.js config, CI pipeline

- [ ] **Step 1: Write failing test for package.json scripts**

```bash
# test:verify-package
cat package.json | jq -e '.scripts.dev and .scripts.build and .scripts.lint and .scripts.test and .scripts.typecheck'
```

- [ ] **Step 2: Run test to verify it fails**

```bash
# Expected: FAIL (file doesn't exist)
```

- [ ] **Step 3: Create package.json with exact dependencies**

```json
{
  "name": "belentani-unified-hub",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "typecheck": "tsc --noEmit",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:e2e": "playwright test",
    "test:visual": "node scripts/visual-validation.js",
    "format": "prettier --write ."
  },
  "dependencies": {
    "next": "15.1.0",
    "react": "19.0.0",
    "react-dom": "19.0.0",
    "@react-three/fiber": "8.16.0",
    "@react-three/drei": "9.100.0",
    "three": "0.160.0",
    "gsap": "3.12.5",
    "@gsap/react": "2.1.0",
    "zustand": "4.5.0",
    "@tanstack/react-query": "5.0.0",
    "tailwindcss": "4.0.0",
    "@tailwindcss/postcss": "4.0.0",
    "postcss": "8.4.0",
    "d3-force": "3.0.0",
    "openrouter-client": "1.0.0",
    "sharp": "0.33.0",
    "clsx": "2.1.0",
    "tailwind-merge": "2.2.0"
  },
  "devDependencies": {
    "typescript": "5.6.0",
    "@types/react": "19.0.0",
    "@types/react-dom": "19.0.0",
    "@types/three": "0.160.0",
    "@types/d3-force": "3.0.0",
    "vitest": "2.0.0",
    "@vitest/ui": "2.0.0",
    "@testing-library/react": "16.0.0",
    "@testing-library/jest-dom": "6.4.0",
    "playwright": "1.45.0",
    "@playwright/test": "1.45.0",
    "eslint": "8.57.0",
    "eslint-config-next": "15.1.0",
    "prettier": "3.3.0",
    "stylelint": "16.0.0",
    "lighthouse-ci": "0.12.0",
    "@next/bundle-analyzer": "15.1.0"
  },
  "engines": { "node": ">=20.0.0" },
  "packageManager": "pnpm@9.0.0"
}
```

- [ ] **Step 4: Create tsconfig.json**

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": {
      "@/*": ["./src/*"],
      "@/design-system/*": ["./src/design-system/*"],
      "@/lib/*": ["./src/lib/*"],
      "@/hooks/*": ["./src/hooks/*"],
      "@/store/*": ["./src/store/*"],
      "@/styles/*": ["./src/styles/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

- [ ] **Step 5: Create next.config.ts**

```typescript
import type { NextConfig } from 'next';
import bundleAnalyzer from '@next/bundle-analyzer';

const withBundleAnalyzer = bundleAnalyzer({ enabled: process.env.ANALYZE === 'true' });

const nextConfig: NextConfig = {
  reactStrictMode: true,
  experimental: {
    optimizePackageImports: ['@react-three/fiber', '@react-three/drei', 'gsap', 'lucide-react'],
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [{ protocol: 'https', hostname: '**.github.io' }],
  },
  headers: async () => [
    { source: '/:path*', headers: [{ key: 'X-Content-Type-Options', value: 'nosniff' }] },
    { source: '/assets/:path*', headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }] },
  ],
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = { ...config.resolve.fallback, fs: false, path: false };
    }
    config.externals.push({ 'sharp': 'commonjs sharp' });
    return config;
  },
};

export default withBundleAnalyzer(nextConfig);
```

- [ ] **Step 6: Create tailwind.config.ts**

```typescript
import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}', './app/**/*.{ts,tsx}'],
  theme: {
    extend: {
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
      },
      fontFamily: {
        display: ['var(--font-orbitron)', 'Share Tech Mono', 'ui-monospace', 'monospace'],
        body: ['var(--font-rajdhani)', 'Share Tech Mono', 'system-ui', 'sans-serif'],
        mono: ['var(--font-share-tech-mono)', 'ui-monospace', 'Consolas', 'monospace'],
      },
      spacing: { xs: '4px', sm: '8px', md: '16px', lg: '24px', xl: '32px', xxl: '48px' },
      borderRadius: { sm: '8px', md: '12px', lg: '16px', full: '9999px' },
      boxShadow: {
        glowRed: '0 0 24px rgba(255,7,58,.35), inset 0 0 12px rgba(255,7,58,.12)',
        glowGold: '0 0 24px rgba(212,175,55,.35)',
        elevation: '0 20px 52px -30px #000, 0 0 38px -24px rgba(255,7,58,.5)',
      },
      transitionDuration: { fast: '150ms', base: '250ms', slow: '400ms' },
      transitionTimingFunction: { spring: 'cubic-bezier(.22,1,.36,1)' },
      zIndex: { hud: '10', dock: '20', modal: '100', toast: '200', boot: '300' },
    },
  },
  plugins: [],
};

export default config;
```

- [ ] **Step 7: Create vercel.json, .github/workflows/ci.yml, playwright.config.ts, vitest.config.ts, lighthouse-budget.json**

(See spec Sections 9.1, 9.3, 6.1 for exact content)

- [ ] **Step 8: Run `pnpm install` and verify build passes**

```bash
pnpm install && pnpm typecheck && pnpm build
```

- [ ] **Step 9: Commit**

```bash
git add package.json tsconfig.json next.config.ts tailwind.config.ts vercel.json .github/workflows/ci.yml playwright.config.ts vitest.config.ts lighthouse-budget.json .gitignore .editorconfig
git commit -m "chore: project setup — Next.js 15 + R3F + GSAP + Tailwind v4"
```

---

### Task 2: Design System — Tokens & Core Components

**Files:**
- Create: `src/design-system/tokens.ts`
- Create: `src/design-system/components/Button.tsx`
- Create: `src/design-system/components/Card.tsx`
- Create: `src/design-system/components/Chip.tsx`
- Create: `src/design-system/components/Modal.tsx`
- Create: `src/design-system/components/Terminal.tsx`
- Create: `src/design-system/components/AudioPlayer.tsx`
- Create: `src/design-system/components/ScrollSection.tsx`
- Create: `src/design-system/index.ts`
- Create: `src/styles/redglass.css`
- Test: `src/design-system/__tests__/tokens.test.ts`
- Test: `src/design-system/components/__tests__/Button.test.tsx`
- Test: `src/design-system/components/__tests__/Card.test.tsx`

**Interfaces:**
- Consumes: Task 1 (build config)
- Produces: `tokens` export, component library used by all later tasks

- [ ] **Step 1: Write failing tests for tokens and Button**

```typescript
// tokens.test.ts
import { tokens } from '@/design-system/tokens';
test('tokens have required color keys', () => {
  expect(tokens.colors.void).toBe('#030008');
  expect(tokens.colors.red).toBe('#ff073a');
  expect(tokens.colors.gold).toBe('#d4af37');
  expect(tokens.fonts.display).toContain('Orbitron');
});

// Button.test.tsx
import { render, screen } from '@testing-library/react';
import { Button } from '@/design-system/components/Button';
test('renders primary variant with red border', () => {
  render(<Button variant="primary">Test</Button>);
  expect(screen.getByRole('button')).toHaveClass('border-red');
});
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
pnpm test src/design-system/__tests__/tokens.test.ts src/design-system/components/__tests__/Button.test.tsx
```

- [ ] **Step 3: Implement tokens.ts (exact spec Section 3.1)**

```typescript
// src/design-system/tokens.ts
export const tokens = {
  colors: { void: '#030008', voidElevated: '#0a0205', ink: '#f2e8ef', mute: '#9a8a96', red: '#ff073a', redDim: '#7a0e1e', blood: '#8a0303', gold: '#d4af37', goldDim: '#8a6d1f', cyan: '#4de8e0', green: '#39ff8a', glass: 'rgba(12,4,18,.72)', glassEdge: 'rgba(255,7,58,.28)', goldEdge: 'rgba(212,175,55,.28)' },
  fonts: { display: '"Orbitron", "Share Tech Mono", ui-monospace, monospace', body: '"Rajdhani", "Share Tech Mono", system-ui, sans-serif', mono: '"Share Tech Mono", ui-monospace, Consolas, monospace' },
  spacing: { xs: '4px', sm: '8px', md: '16px', lg: '24px', xl: '32px', xxl: '48px' },
  radii: { sm: '8px', md: '12px', lg: '16px', full: '9999px' },
  shadows: { glowRed: '0 0 24px rgba(255,7,58,.35), inset 0 0 12px rgba(255,7,58,.12)', glowGold: '0 0 24px rgba(212,175,55,.35)', elevation: '0 20px 52px -30px #000, 0 0 38px -24px rgba(255,7,58,.5)' },
  motion: { fast: '150ms ease-out', base: '250ms ease-out', slow: '400ms ease-out', spring: 'cubic-bezier(.22,1,.36,1)' },
  breakpoints: { sm: '640px', md: '768px', lg: '1024px', xl: '1280px', '2xl': '1536px' },
  zIndex: { hud: 10, dock: 20, modal: 100, toast: 200, boot: 300 },
} as const;

export type Tokens = typeof tokens;
```

- [ ] **Step 4: Implement Button.tsx, Card.tsx, Chip.tsx, Modal.tsx, Terminal.tsx, AudioPlayer.tsx, ScrollSection.tsx**

(Use spec Section 3.2 variants; `cn` from `clsx` + `tailwind-merge` for class composition)

- [ ] **Step 5: Implement redglass.css (exact spec Section 3.3)**

```css
/* src/styles/redglass.css */
.ng-redglass { border-color: var(--glass-edge) !important; background: linear-gradient(145deg,rgba(255,7,58,.09),transparent 45%),linear-gradient(190deg,rgba(255,255,255,.055),transparent 34%),var(--glass) !important; backdrop-filter:blur(18px) saturate(1.35); box-shadow:inset 0 1px 0 rgba(255,255,255,.2),inset 0 -1px 0 rgba(255,7,58,.28),-1px 0 0 rgba(77,232,224,.22),1px 0 0 rgba(212,175,55,.18),0 20px 52px -30px #000,0 0 38px -24px rgba(255,7,58,.5); }
@media (prefers-reduced-motion: reduce) { *, *::before, *::after { animation-duration:.01ms!important; animation-iteration-count:1!important; transition-duration:.01ms!important; scroll-behavior:auto!important } }
```

- [ ] **Step 6: Run tests to verify they pass**

```bash
pnpm test src/design-system
```

- [ ] **Step 7: Commit**

```bash
git add src/design-system src/styles/redglass.css
git commit -m "feat: design system — tokens, components, redglass patterns"
```

---

### Task 3: Marketing Route Group — SSR Pages

**Files:**
- Create: `app/(marketing)/layout.tsx`
- Create: `app/(marketing)/page.tsx`
- Create: `app/(marketing)/artista/page.tsx`
- Create: `app/(marketing)/prensa/page.tsx`
- Create: `app/(marketing)/musica/page.tsx`
- Create: `app/globals.css` (import Tailwind + redglass.css + design tokens)
- Create: `app/layout.tsx` (root providers, fonts)
- Test: `app/(marketing)/__tests__/page.test.tsx`
- Test: `app/(marketing)/__tests__/artista.test.tsx`

**Interfaces:**
- Consumes: Task 2 (design system components, tokens)
- Produces: Marketing pages with SSR/ISR

- [ ] **Step 1: Write failing tests for landing page structure**

```typescript
// app/(marketing)/__tests__/page.test.tsx
import { render, screen } from '@testing-library/react';
import Page from '@/app/(marketing)/page';
test('renders hero with artist name and omega symbol', () => {
  render(<Page />);
  expect(screen.getByText(/Belentani/i)).toBeInTheDocument();
  expect(screen.getByText(/Ω|omega/i)).toBeInTheDocument();
});
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
pnpm test app/(marketing)/__tests__/page.test.tsx
```

- [ ] **Step 3: Implement root layout.tsx with font loading**

```typescript
// app/layout.tsx
import { Orbitron, Rajdhani, Share_Tech_Mono } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/Providers';

const orbitron = Orbitron({ subsets: ['latin'], weight: ['500','700','900'], variable: '--font-orbitron', display: 'swap', preload: true });
const rajdhani = Rajdhani({ subsets: ['latin'], weight: ['400','500','600','700'], variable: '--font-rajdhani', display: 'swap', preload: true });
const shareTechMono = Share_Tech_Mono({ subsets: ['latin'], variable: '--font-share-tech-mono', display: 'swap', preload: true });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${orbitron.variable} ${rajdhani.variable} ${shareTechMono.variable}`}>
      <body className="font-body antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
```

- [ ] **Step 4: Implement globals.css (Tailwind v4 + tokens + redglass)**

```css
/* app/globals.css */
@import 'tailwindcss';
@import '@/styles/redglass.css';
@theme { /* tokens from tailwind.config.ts */ }
```

- [ ] **Step 5: Implement (marketing)/layout.tsx with header/footer**

- [ ] **Step 6: Implement landing page.tsx with hero, artist statement, music preview, catalog grid**

(Use `ScrollSection`, `Card`, `Button`, `Chip` from design system; content from `UNIVERSO-ARTISTICO.md`, `catalogo-artista.js`)

- [ ] **Step 7: Implement artista, prensa, musica pages**

- [ ] **Step 8: Run tests to verify they pass**

```bash
pnpm test app/(marketing)
```

- [ ] **Step 9: Commit**

```bash
git add app/(marketing) app/globals.css app/layout.tsx
git commit -m "feat: marketing route group — SSR landing, artista, prensa, musica"
```

---

### Task 4: Immersive Shell & Providers

**Files:**
- Create: `app/(immersive)/layout.tsx`
- Create: `src/components/Providers.tsx`
- Create: `src/store/ui.ts`
- Create: `src/store/galaxy.ts`
- Create: `src/hooks/useGalaxyMap.ts`
- Create: `src/hooks/useAudio.ts`
- Test: `src/store/__tests__/ui.test.ts`
- Test: `src/store/__tests__/galaxy.test.ts`

**Interfaces:**
- Consumes: Task 2 (design system), Task 3 (root layout)
- Produces: Immersive shell providers, global state, hooks

- [ ] **Step 1: Write failing tests for stores**

```typescript
// src/store/__tests__/galaxy.test.ts
import { useGalaxyStore } from '@/store/galaxy';
test('initial current node is belentani', () => {
  expect(useGalaxyStore.getState().current).toBe('belentani');
});
test('travelTo updates current and history', () => {
  useGalaxyStore.getState().travelTo('judas');
  expect(useGalaxyStore.getState().current).toBe('judas');
});
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
pnpm test src/store/__tests__/galaxy.test.ts
```

- [ ] **Step 3: Implement Providers.tsx**

```tsx
// src/components/Providers.tsx
'use client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import { GSAPProvider } from '@gsap/react';

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({ defaultOptions: { queries: { staleTime: 60_000 } } }));
  return <QueryClientProvider client={queryClient}><GSAPProvider>{children}</GSAPProvider></QueryClientProvider>;
}
```

- [ ] **Step 4: Implement ui.ts (Zustand)**

```typescript
// src/store/ui.ts
import { create } from 'zustand';
interface UIState { modalOpen: boolean; modalContent: React.ReactNode | null; openModal: (content: React.ReactNode) => void; closeModal: () => void; }
export const useUIStore = create<UIState>((set) => ({ modalOpen: false, modalContent: null, openModal: (content) => set({ modalOpen: true, modalContent: content }), closeModal: () => set({ modalOpen: false, modalContent: null }) }));
```

- [ ] **Step 5: Implement galaxy.ts (Zustand)**

```typescript
// src/store/galaxy.ts
import { create } from 'zustand';
import { galaxySystems } from '@/lib/galaxy-data';
interface GalaxyState { current: string; history: string[]; travelTo: (id: string) => void; goBack: () => void; }
export const useGalaxyStore = create<GalaxyState>((set) => ({ current: 'belentani', history: ['belentani'], travelTo: (id) => set((s) => ({ current: id, history: [...s.history, id] })), goBack: () => set((s) => { const h = [...s.history]; h.pop(); return { current: h[h.length-1], history: h }; }) }));
```

- [ ] **Step 6: Implement hooks/useGalaxyMap.ts, useAudio.ts**

- [ ] **Step 7: Implement (immersive)/layout.tsx with providers + audio context init**

```tsx
// app/(immersive)/layout.tsx
'use client';
import { Providers } from '@/components/Providers';
import { useEffect } from 'react';
import { AudioContext } from 'standardized-audio-context';

export default function ImmersiveLayout({ children }: { children: React.ReactNode }) {
  useEffect(() => { window.AudioContext = window.AudioContext || AudioContext; }, []);
  return <Providers>{children}</Providers>;
}
```

- [ ] **Step 8: Run tests to verify they pass**

```bash
pnpm test src/store src/hooks
```

- [ ] **Step 9: Commit**

```bash
git add src/components/Providers.tsx src/store src/hooks app/(immersive)/layout.tsx
git commit -m "feat: immersive shell — providers, stores, hooks"
```

---

### Task 5: AI Services — Server Actions & Fallbacks

**Files:**
- Create: `src/lib/openrouter.ts`
- Create: `src/lib/lore-prompts.ts`
- Create: `src/lib/ai-fallbacks.ts`
- Create: `src/lib/ollama-worker.ts`
- Create: `app/api/ai/lore-chat/actions.ts`
- Create: `app/api/ai/lyric-analysis/actions.ts`
- Create: `app/api/ai/prompt-opt/actions.ts`
- Test: `src/lib/__tests__/openrouter.test.ts`
- Test: `src/lib/__tests__/ai-fallbacks.test.ts`
- Test: `app/api/ai/__tests__/lore-chat.test.ts`

**Interfaces:**
- Consumes: Task 1 (config), Task 4 (providers for client)
- Produces: AI server actions, fallback library, OpenRouter client

- [ ] **Step 1: Write failing tests for openrouter client and fallbacks**

```typescript
// src/lib/__tests__/openrouter.test.ts
import { createOpenRouter } from '@/lib/openrouter';
test('creates client with API key from env', () => {
  process.env.OPENROUTER_API_KEY = 'test-key';
  const client = createOpenRouter();
  expect(client).toBeDefined();
});

// src/lib/__tests__/ai-fallbacks.test.ts
import { fallbacks } from '@/lib/ai-fallbacks';
test('lore-chat fallback returns canonical JUDAS response', () => {
  const res = fallbacks.loreChat('judas', [{ role: 'user', content: 'test' }]);
  expect(res).toContain('Judas');
});
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
pnpm test src/lib/__tests__/openrouter.test.ts src/lib/__tests__/ai-fallbacks.test.ts
```

- [ ] **Step 3: Implement openrouter.ts**

```typescript
// src/lib/openrouter.ts
import OpenRouter from 'openrouter-client';
export function createOpenRouter() { return new OpenRouter({ apiKey: process.env.OPENROUTER_API_KEY! }); }
```

- [ ] **Step 4: Implement lore-prompts.ts (from lore-canon/)**

```typescript
// src/lib/lore-prompts.ts
export const systemPrompts = {
  judas: `Eres el narrador de JUDAS. Voz: Pedro Belentani, apóstol que ama, niega y besa sin arrepentirse. Idioma de la verdad: español cuando la herida duele. Arquetipos: Rey/Guerrero/Mago/Amante unificados. Frecuencia: 432 Hz. Máster: -14.0 LUFS. Nunca inventes instituciones, nombres, fechas.`,
  biblia: `Eres la BIBLIA DE LA MÚSICA — Melodic Math. Genealogía: Denniz PoP (Cheiron 1992) → Max Martin → Andreas Carlsson → Lady Gaga/The Weeknd → Belentani. Reglas: sílabas/acentos/notas antes que letra. Regla de la octava: verso en grave, coro una octava arriba. Motivo firma: 5 ♭6 5 4 ♭3 2 1 en F# menor.`,
  qwen: `Eres el análisis QWEN ORACLE. Perfil desde stems reales: JUDAS_master_FINAL.wav, violín, coros. Narrador = Pedro. Cambio a español en herida ('la deuda, la deuda'). Tratado de arquetipos unificados.`,
};
```

- [ ] **Step 5: Implement ai-fallbacks.ts (static responses per spec 5.4)**

```typescript
// src/lib/ai-fallbacks.ts
export const fallbacks = {
  loreChat: (context: string) => context === 'judas' ? 'Antes del nombre hubo un cuerpo sin voz. Antes del cuerpo, un espejo en la arena.' : 'La deuda no se paga con dinero. Se paga con memoria.',
  lyricAnalysis: () => 'Regla de la octava aplicada. Motivo firma detectado en compás 3. Frecuencia base: 432 Hz.',
  promptOpt: () => 'Cinematic prompt: [subject], [lighting], [camera], [mood], [color palette: void/red/gold], [lens: anamorphic], [film stock: Kodak Vision3 500T]',
};
```

- [ ] **Step 6: Implement lore-chat/actions.ts (exact spec Section 5.2)**

```typescript
// app/api/ai/lore-chat/actions.ts
'use server';
import { createOpenRouter } from '@/lib/openrouter';
import { systemPrompts } from '@/lib/lore-prompts';
import { fallbacks } from '@/lib/ai-fallbacks';
import { rateLimit } from '@/lib/rate-limit';

export async function loreChat(messages: { role: string; content: string }[], context: 'judas' | 'biblia' | 'qwen') {
  const ip = 'anonymous'; // In real: get from headers
  if (!rateLimit(ip, 'lore-chat')) return new Response('Rate limited', { status: 429, headers: { 'Retry-After': '60' } });
  
  try {
    const openrouter = createOpenRouter();
    const model = 'nvidia/nemotron-3-ultra-550b-a55b:free';
    const stream = await openrouter.chat.completions.create({
      model,
      messages: [{ role: 'system', content: systemPrompts[context] }, ...messages],
      stream: true,
      max_tokens: 2048,
      temperature: 0.7,
    });
    return new Response(stream.toReadableStream(), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
  } catch {
    return new Response(fallbacks.loreChat(context), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
  }
}
```

- [ ] **Step 7: Implement lyric-analysis/actions.ts, prompt-opt/actions.ts (same pattern)**

- [ ] **Step 8: Implement ollama-worker.ts (Web Worker for local fallback)**

```typescript
// src/lib/ollama-worker.ts
if (typeof Worker !== 'undefined') {
  const worker = new Worker(new URL('./ollama-worker.worker.ts', import.meta.url), { type: 'module' });
  export function askOllama(prompt: string): Promise<string> {
    return new Promise((resolve) => { worker.postMessage(prompt); worker.onmessage = (e) => resolve(e.data); });
  }
} else { export function askOllama() { return Promise.resolve('Ollama not available'); } }
```

- [ ] **Step 9: Run tests to verify they pass**

```bash
pnpm test src/lib app/api/ai
```

- [ ] **Step 10: Commit**

```bash
git add src/lib/openrouter.ts src/lib/lore-prompts.ts src/lib/ai-fallbacks.ts src/lib/ollama-worker.ts app/api/ai
git commit -m "feat: AI services — OpenRouter server actions + local fallbacks"
```

---

### Task 6: Galaxy Map — Core Immersive Experience

**Files:**
- Create: `src/lib/galaxy-data.ts`
- Create: `app/(immersive)/galaxia/page.tsx`
- Create: `app/(immersive)/galaxia/components/GalaxyMap.tsx`
- Create: `app/(immersive)/galaxia/components/GalaxyNode.tsx`
- Create: `app/(immersive)/galaxia/components/Ship.tsx`
- Create: `app/(immersive)/galaxia/components/Route.tsx`
- Create: `app/(immersive)/galaxia/components/DockPanel.tsx`
- Create: `app/(immersive)/galaxia/components/HUD.tsx`
- Create: `app/(immersive)/galaxia/components/Starfield.tsx`
- Test: `app/(immersive)/galaxia/__tests__/GalaxyMap.test.tsx`
- Test: `app/(immersive)/galaxia/__tests__/DockPanel.test.tsx`

**Interfaces:**
- Consumes: Task 2 (design system: `GalaxyNode`, `DockPanel`, `Button`, `Chip`), Task 4 (stores, hooks), Task 5 (AI actions for lore chat in dock)
- Produces: Galaxy map page with starfield, ship, nodes, routes, dock panel, HUD

- [ ] **Step 1: Write failing tests for GalaxyMap and DockPanel**

```typescript
// GalaxyMap.test.tsx
import { render, screen } from '@testing-library/react';
import { Canvas } from '@react-three/fiber';
import { GalaxyMap } from '@/app/(immersive)/galaxia/components/GalaxyMap';
test('renders Canvas with starfield and nodes', () => {
  render(<Canvas><GalaxyMap /></Canvas>);
  expect(screen.getByTestId('starfield')).toBeInTheDocument();
  expect(screen.getByTestId('node-belentani')).toBeInTheDocument();
});

// DockPanel.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { DockPanel } from '@/app/(immersive)/galaxia/components/DockPanel';
test('shows panel content for judas node', () => {
  const system = { id: 'judas', name: 'JUDAS', kind: 'era', tag: 'ERA JUDAS', blurb: 'test', color: '#ff073a', position: {x:50,y:50}, size: 1, panel: 'judas' };
  render(<DockPanel system={system} onAction={jest.fn()} />);
  expect(screen.getByText(/JUDAS/i)).toBeInTheDocument();
});
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
pnpm test app/(immersive)/galaxia/__tests__
```

- [ ] **Step 3: Implement galaxy-data.ts (from UNIVERSO_GALAXIAS.json)**

```typescript
// src/lib/galaxy-data.ts
export const galaxySystems = [
  { id: 'belentani', name: 'BELENTANI', kind: 'artist', tag: 'ARTISTA PRINCIPAL', blurb: 'Artista y compositor. São Paulo → Barcelona. Dark pop, R&B, electrónica experimental.', color: '#ff073a', position: {x:50,y:50}, size: 2.5, panel: 'nucleo' },
  { id: 'judas', name: 'JUDAS', kind: 'era', tag: 'ERA JUDAS', blurb: 'La obra narrativa central. 6 capítulos: génesis, traición, deuda, redención, biblia, cognición.', color: '#ff073a', position: {x:30,y:35}, size: 1.8, panel: 'judas', chapters: [...] },
  { id: 'omega', name: 'OMEGA', kind: 'era', tag: 'ECOSISTEMA', blurb: 'Ecosistema conectando música, código y tecnología creativa. Portal inmersivo, plantilla, escaparate.', color: '#d4af37', position: {x:70,y:30}, size: 1.5, panel: 'omega', url: 'https://belentani.es' },
  { id: 'neon', name: 'NEON', kind: 'era', tag: 'VISUAL RED', blurb: 'Portfolio visual estático: dark pop, R&B, neon. Judas Era visual identity.', color: '#ff073a', position: {x:65,y:65}, size: 1.2, panel: 'neon', url: 'https://belentani7.github.io/belentani-es-neon/' },
  { id: 'duck', name: 'DUCK', kind: 'duck', tag: 'ARTISTA DUCK', blurb: 'Productor musical (Aracaju, Brasil). Beats, catálogo, reproductor, Studio OS.', color: '#4de8e0', position: {x:20,y:70}, size: 1.6, panel: 'duck', url: 'https://belentani7.github.io/duck-hub/' },
];
export const galaxyRoutes = [['belentani','judas'], ['belentani','omega'], ['belentani','neon'], ['belentani','duck'], ['judas','omega'], ['omega','neon']];
```

- [ ] **Step 4: Implement Starfield.tsx (Canvas-based, 160 stars, radial gradient, reduced motion)**

- [ ] **Step 5: Implement GalaxyNode.tsx (Canvas circle + ring + label + sub-label, hover/tap scale, keyboard focus)**

- [ ] **Step 6: Implement Route.tsx (Canvas line, active highlight when either node is current)**

- [ ] **Step 7: Implement Ship.tsx (GSAP MotionPathPlugin along Canvas paths, 700ms cubic-bezier)**

- [ ] **Step 8: Implement DockPanel.tsx (slide-in from right, panel/warp/local variants, actions)**

- [ ] **Step 9: Implement HUD.tsx (top bar: brand + shortcuts, bottom legend: keyboard hints)**

- [ ] **Step 10: Implement GalaxyMap.tsx (orchestrates Starfield, nodes, routes, ship, dock, HUD; keyboard nav ←/→/Enter/Esc)**

- [ ] **Step 11: Implement galaxia/page.tsx (Canvas wrapper + Suspense fallback + dynamic import)**

```tsx
// app/(immersive)/galaxia/page.tsx
'use client';
import dynamic from 'next/dynamic';
import { Suspense } from 'react';
const GalaxyMap = dynamic(() => import('./components/GalaxyMap').then(m => m.GalaxyMap), { ssr: false });
export default function GalaxiaPage() { return <Suspense fallback={<div className="h-screen flex items-center justify-center text-mute">Cargando galaxia…</div>}><GalaxyMap /></Suspense>; }
```

- [ ] **Step 12: Run tests to verify they pass**

```bash
pnpm test app/(immersive)/galaxia
```

- [ ] **Step 13: Commit**

```bash
git add src/lib/galaxy-data.ts app/(immersive)/galaxia
git commit -m "feat: galaxy map — starfield, ship, nodes, routes, dock, HUD"
```

---

### Task 7: JUDAS Era — 6 Chapter Routes

**Files:**
- Create: `src/lib/judas-data.ts`
- Create: `app/(immersive)/judas/page.tsx`
- Create: `app/(immersive)/judas/[capitulo]/page.tsx`
- Create: `app/(immersive)/judas/[capitulo]/components/GenesisScene.tsx`
- Create: `app/(immersive)/judas/[capitulo]/components/DiamondScene.tsx`
- Create: `app/(immersive)/judas/[capitulo]/components/KeyScene.tsx`
- Create: `app/(immersive)/judas/[capitulo]/components/MachineScene.tsx`
- Create: `app/(immersive)/judas/[capitulo]/components/BibliaScene.tsx`
- Create: `app/(immersive)/judas/[capitulo]/components/CognitionScene.tsx
- Create: `app/(immersive)/judas/components/ChapterNav.tsx`
- Create: `app/(immersive)/judas/components/AudioPlayer.tsx`
- Test: `app/(immersive)/judas/__tests__/chapter.test.tsx`
- Test: `app/(immersive)/judas/[capitulo]/__tests__/GenesisScene.test.tsx`
- Test: `app/(immersive)/judas/[capitulo]/__tests__/DiamondScene.test.tsx`

**Interfaces:**
- Consumes: Task 2 (design system: `ScrollSection`, `AudioPlayer`, `Button`, `Card`), Task 4 (stores, hooks), Task 5 (AI actions), Task 6 (galaxy map navigation)
- Produces: 6 chapter routes with R3F scenes + GSAP scroll narratives + audio

- [ ] **Step 1: Write failing tests for chapter route and GenesisScene**

```typescript
// chapter.test.tsx
import { render, screen } from '@testing-library/react';
import Page from '@/app/(immersive)/judas/page';
test('renders era overview with 6 chapter links', () => {
  render(<Page />);
  expect(screen.getByText(/Génesis/i)).toBeInTheDocument();
  expect(screen.getByText(/Traición/i)).toBeInTheDocument();
  expect(screen.getByText(/Deuda/i)).toBeInTheDocument();
  expect(screen.getByText(/Redención/i)).toBeInTheDocument();
  expect(screen.getByText(/Biblia/i)).toBeInTheDocument();
  expect(screen.getByText(/Cognición/i)).toBeInTheDocument();
});

// GenesisScene.test.tsx
import { render } from '@testing-library/react';
import { Canvas } from '@react-three/fiber';
import { GenesisScene } from '@/app/(immersive)/judas/[capitulo]/components/GenesisScene';
test('mounts without error and has planet mesh', () => {
  const { unmount } = render(<Canvas><GenesisScene /></Canvas>);
  unmount(); // Should not throw
});
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
pnpm test app/(immersive)/judas
```

- [ ] **Step 3: Implement judas-data.ts (from LORE_UNIFICADO + lore-canon)**

```typescript
// src/lib/judas-data.ts
export const judasChapters = [
  { id: 'genesis', name: 'Génesis', symbol: '🪞', lore: 'Antes del nombre hubo un cuerpo sin voz. Antes del cuerpo, un espejo en la arena.', audio: '/assets/audio/sessions/instrumental.mp3', scene: 'planet' },
  { id: 'traicion', name: 'Traición', symbol: '💎', lore: 'El narrador se revela antihéroe: cantó, entendió el daño, no niega el beso. Pedro besó a Judas y no se arrepiente.', audio: '/assets/audio/sessions/violin.mp3', scene: 'diamond' },
  { id: 'deuda', name: 'Deuda', symbol: '🔑', lore: 'Alguien queda con una deuda impagable. La llave solo como imagen — sin nombres ni instituciones. Vete tranquilo, pero recuérdame.', audio: '/assets/audio/sessions/coros.mp3', scene: 'key' },
  { id: 'redencion', name: 'Redención', symbol: '⚙️', lore: 'El horizonte no borra la noche: la consagra. La herida cerrada como blasón, no como queja. Vete tranquilo, pero recuérdame.', audio: '/assets/audio/sessions/mixA.mp3', scene: 'machine' },
  { id: 'biblia-musica', name: 'Biblia Música', symbol: '📖', lore: 'Genealogía comprobada: Denniz PoP (Cheiron 1992) → Max Martin → Andreas Carlsson → Lady Gaga/The Weeknd → Belentani. Matemática melódica: sílabas, acentos, notas. Regla octava. Motivo 5 ♭6 5 4 ♭3 2 1 en F#m. 432 Hz. -14 LUFS.', audio: '/assets/audio/sessions/coro_hi.mp3', scene: 'biblia' },
  { id: 'qwen-perfil', name: 'Cognición Qwen', symbol: '🧠', lore: 'Perfil desde stems reales. Narrador = Pedro. Español en herida. Arquetipos unificados. Stems: violín, coros, mixA/B, instrumental.', audio: '/assets/audio/sessions/violin_m.mp3', scene: 'cognition' },
];
```

- [ ] **Step 4: Implement judas/page.tsx (era overview + chapter index grid)**

- [ ] **Step 5: Implement [capitulo]/page.tsx (dynamic route, loads chapter data, renders scene + ScrollSection narrative + AudioPlayer + ChapterNav)**

```tsx
// app/(immersive)/judas/[capitulo]/page.tsx
'use client';
import { useParams } from 'next/navigation';
import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { judasChapters } from '@/lib/judas-data';
import { ChapterNav } from '../components/ChapterNav';
import { AudioPlayer } from '@/design-system/components/AudioPlayer';
import { ScrollSection } from '@/design-system/components/ScrollSection';

const sceneMap = {
  genesis: dynamic(() => import('./components/GenesisScene').then(m => m.GenesisScene), { ssr: false }),
  traicion: dynamic(() => import('./components/DiamondScene').then(m => m.DiamondScene), { ssr: false }),
  deuda: dynamic(() => import('./components/KeyScene').then(m => m.KeyScene), { ssr: false }),
  redencion: dynamic(() => import('./components/MachineScene').then(m => m.MachineScene), { ssr: false }),
  'biblia-musica': dynamic(() => import('./components/BibliaScene').then(m => m.BibliaScene), { ssr: false }),
  'qwen-perfil': dynamic(() => import('./components/CognitionScene').then(m => m.CognitionScene), { ssr: false }),
};

export default function ChapterPage() {
  const params = useParams();
  const chapter = judasChapters.find(c => c.id === params.capitulo);
  if (!chapter) return <div>Capítulo no encontrado</div>;
  const Scene = sceneMap[chapter.id as keyof typeof sceneMap];
  return (
    <div className="h-screen w-full relative">
      <Suspense fallback={<div className="absolute inset-0 flex items-center justify-center text-mute">Cargando capítulo…</div>}>
        <Scene />
      </Suspense>
      <ScrollSection chapter={chapter} />
      <AudioPlayer src={chapter.audio} title={chapter.name} />
      <ChapterNav current={chapter.id} chapters={judasChapters} />
    </div>
  );
}
```

- [ ] **Step 6: Implement GenesisScene.tsx (Procedural planet + atmosphere + accretion disk)**

```tsx
// GenesisScene.tsx
'use client';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Environment, Stars } from '@react-three/drei';
import { useMemo } from 'react';
import * as THREE from 'three';
import { SimplexNoise } from 'three/examples/jsm/math/SimplexNoise.js';

export function GenesisScene() {
  return (
    <Canvas camera={{ position: [0, 0, 50], fov: 45 }} onCreated={({ gl }) => { gl.toneMapping = THREE.ACESFilmicToneMapping; gl.toneMappingExposure = 1; }}>
      <color attach="background" args={['#030008']} />
      <Stars radius={200} depth={100} count={2000} factor={4} saturation={0.5} fade />
      <Environment preset="city" />
      <Planet />
      <AccretionDisk />
      <OrbitControls enablePan={false} minDistance={10} maxDistance={100} />
    </Canvas>
  );
}

function Planet() {
  const { scene } = useThree();
  const geometry = useMemo(() => new THREE.IcosahedronGeometry(12, 64), []);
  const material = useMemo(() => new THREE.MeshStandardMaterial({ color: 0x1a0a12, roughness: 0.8, metalness: 0.1 }), []);
  useFrame((_, dt) => { /* slow rotation */ });
  return <mesh geometry={geometry} material={material}><meshStandardMaterial attach="material" /></mesh>;
}

function AccretionDisk() {
  const positions = useMemo(() => { /* particle ring positions */ return new Float32Array(1000 * 3); }, []);
  return <points><bufferGeometry><bufferAttribute attach="attributes-position" args={[positions, 3]} /></bufferGeometry><pointsMaterial color="#ff073a" size={0.3} transparent opacity={0.6} /></points>;
}
```

- [ ] **Step 7: Implement DiamondScene.tsx (Faceted diamond IOR 2.417 + caustics)**

```tsx
// DiamondScene.tsx
'use client';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import * as THREE from 'three';

export function DiamondScene() {
  return (
    <Canvas camera={{ position: [0, 0, 15], fov: 35 }} onCreated={({ gl }) => { gl.toneMapping = THREE.ACESFilmicToneMapping; gl.toneMappingExposure = 1.2; }}>
      <color attach="background" args={['#030008']} />
      <Environment preset="warehouse" />
      <Diamond />
      <OrbitControls enablePan={false} minDistance={5} maxDistance={30} />
    </Canvas>
  );
}

function Diamond() {
  const geometry = useMemo(() => {
    // Procedural faceted diamond: 57+ facets via custom BufferGeometry
    const g = new THREE.BufferGeometry();
    // ... build vertices/indices for brilliant cut
    return g;
  }, []);
  const material = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: 0xffffff, transmission: 1, ior: 2.417, thickness: 2.0, dispersion: 0.044,
    roughness: 0, metalness: 0, clearcoat: 1, clearcoatRoughness: 0,
    envMapIntensity: 1.5,
  }), []);
  return <mesh geometry={geometry} material={material} rotation={[-0.2, 0.3, 0]} />;
}
```

- [ ] **Step 8: Implement KeyScene.tsx (Procedural gold key + chain + particles)**

- [ ] **Step 9: Implement MachineScene.tsx (Procedural architecture + organic growth)**

- [ ] **Step 10: Implement BibliaScene.tsx (Melodic math UI + frequency viz)**

- [ ] **Step 11: Implement CognitionScene.tsx (Neural graph + particle flow)**

- [ ] **Step 12: Implement ChapterNav.tsx + AudioPlayer.tsx (chapter-specific)**

- [ ] **Step 13: Run tests to verify they pass**

```bash
pnpm test app/(immersive)/judas
```

- [ ] **Step 14: Commit**

```bash
git add src/lib/judas-data.ts app/(immersive)/judas
git commit -m "feat: JUDAS era — 6 chapters with R3F scenes + GSAP narratives + audio"
```

---

### Task 8: Gallery Cards (Omega, Neon, Duck)

**Files:**
- Create: `src/design-system/components/WorldGalleryCard.tsx`
- Create: `app/(immersive)/omega/page.tsx`
- Create: `app/(immersive)/neon/page.tsx`
- Create: `app/(immersive)/duck/page.tsx`
- Test: `src/design-system/components/__tests__/WorldGalleryCard.test.tsx`

**Interfaces:**
- Consumes: Task 2 (design system), Task 6 (galaxy-data.ts for system props)
- Produces: Gallery card pages for non-deep worlds

- [ ] **Step 1: Write failing test for WorldGalleryCard**

```typescript
// WorldGalleryCard.test.tsx
import { render, screen } from '@testing-library/react';
import { WorldGalleryCard } from '@/design-system/components/WorldGalleryCard';
test('renders hero media, title, metrics, CTA', () => {
  const props = { system: { id: 'omega', name: 'OMEGA', tag: 'ECOSISTEMA', color: '#d4af37' }, heroMedia: 'image' as const, metrics: [{label:'Eras',value:'6'}], cta: {label:'Visitar', href:'https://belentani.es', external:true} };
  render(<WorldGalleryCard {...props} />);
  expect(screen.getByText('OMEGA')).toBeInTheDocument();
  expect(screen.getByText('ECOSISTEMA')).toBeInTheDocument();
  expect(screen.getByRole('link', { name: /Visitar/i })).toHaveAttribute('href', 'https://belentani.es');
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
pnpm test src/design-system/components/__tests__/WorldGalleryCard.test.tsx
```

- [ ] **Step 3: Implement WorldGalleryCard.tsx**

```tsx
// src/design-system/components/WorldGalleryCard.tsx
'use client';
import { galaxySystems } from '@/lib/galaxy-data';
import { Button } from './Button';
import { Card } from './Card';

interface Props { system: typeof galaxySystems[0]; heroMedia: 'image'|'video'|'thumbnail'; metrics: {label:string; value:string}[]; cta: {label:string; href:string; external:boolean}; }

export function WorldGalleryCard({ system, heroMedia, metrics, cta }: Props) {
  return (
    <Card className="ng-redglass max-w-2xl mx-auto p-6">
      <div className="aspect-video mb-4 bg-void-elevated rounded-lg overflow-hidden relative">
        {heroMedia === 'image' && <img src={`/assets/images/${system.id}-hero.webp`} alt={system.name} className="w-full h-full object-cover" />}
        {heroMedia === 'video' && <video src={`/assets/video/${system.id}-hero.mp4`} poster={`/assets/images/${system.id}-poster.webp`} muted loop playsInline className="w-full h-full object-cover" />}
        {heroMedia === 'thumbnail' && <img src={`/assets/images/${system.id}-thumb.webp`} alt={system.name} className="w-full h-full object-cover" />}
      </div>
      <div className="space-y-3">
        <div className="flex items-baseline gap-2"><span className="text-xs tracking-widest text-gold uppercase">{system.tag}</span><h2 className="font-display text-2xl text-ink">{system.name}</h2></div>
        <p className="text-mute text-sm">{system.blurb}</p>
        <div className="flex flex-wrap gap-4 text-sm">{metrics.map((m,i)=>(<div key={i} className="flex items-center gap-1"><span className="text-gold font-mono">{m.value}</span><span className="text-mute">{m.label}</span></div>))}</div>
        <Button variant="gold" asChild><a href={cta.href} target={cta.external?'_blank':undefined} rel={cta.external?'noopener noreferrer':undefined}>{cta.label}</a></Button>
      </div>
    </Card>
  );
}
```

- [ ] **Step 4: Implement omega/page.tsx, neon/page.tsx, duck/page.tsx (each renders WorldGalleryCard with correct props)**

- [ ] **Step 5: Run tests to verify they pass**

```bash
pnpm test src/design-system/components/__tests__/WorldGalleryCard.test.tsx
```

- [ ] **Step 6: Commit**

```bash
git add src/design-system/components/WorldGalleryCard.tsx app/(immersive)/omega app/(immersive)/neon app/(immersive)/duck
git commit -m "feat: gallery cards — Omega, Neon, Duck preview pages"
```

---

### Task 9: Root Redirect & Navigation

**Files:**
- Modify: `app/page.tsx`
- Create: `src/components/Navigation.tsx`
- Test: `app/__tests__/redirect.test.ts`

**Interfaces:**
- Consumes: Task 3 (marketing), Task 6 (galaxia)
- Produces: Entry point routing

- [ ] **Step 1: Write failing test for redirect**

```typescript
// app/__tests__/redirect.test.ts
import { GET } from '@/app/route'; // or test via Playwright
test('root redirects to marketing landing', async () => {
  // Verified in E2E
});
```

- [ ] **Step 2: Implement app/page.tsx (redirect to marketing landing)**

```tsx
// app/page.tsx
import { redirect } from 'next/navigation';
export default function Home() { redirect('/'); } // (marketing) root
```

- [ ] **Step 3: Implement Navigation.tsx (shared header for marketing, links to /galaxia)**

- [ ] **Step 4: Run E2E test**

```bash
pnpm test:e2e --grep="navigation"
```

- [ ] **Step 5: Commit**

```bash
git add app/page.tsx src/components/Navigation.tsx
git commit -m "feat: root redirect + shared navigation"
```

---

### Task 10: Assets & Content Pipeline

**Files:**
- Create: `scripts/download-assets.js` (downloads from judas-experience-web, belentani-omega-immersive-portal)
- Create: `scripts/process-assets.js` (Sharp → WebP/AVIF, FFmpeg → MP4/WebM)
- Create: `public/assets/` (populated by scripts)
- Modify: `package.json` (add asset scripts)

**Interfaces:**
- Consumes: Remote repos (GitHub API)
- Produces: Optimized assets in public/assets/

- [ ] **Step 1: Write asset download script**

```javascript
// scripts/download-assets.js
const { execSync } = require('child_process');
const fs = require('fs');
const repos = [
  { owner: 'belentani7', repo: 'judas-experience-web', paths: ['assets/audio/sessions', 'assets/judas-key-art-planeta-diamante.png', 'assets/lore-portal-preview.png'] },
  { owner: 'belentani7', repo: 'belentani-omega-immersive-portal', paths: ['assets/media/judas-hero.mp4', 'assets/media/judas-poster.webp', 'img/diamond_scene.png'] },
];
for (const r of repos) { for (const p of r.paths) { execSync(`gh api repos/${r.owner}/${r.repo}/contents/${p} --jq '.[].download_url' | xargs -I {} curl -L {} -o public/assets/${p}`); } }
```

- [ ] **Step 2: Write asset processing script (Sharp + FFmpeg)**

- [ ] **Step 3: Run scripts and verify assets in public/assets/**

```bash
node scripts/download-assets.js && node scripts/process-assets.js
ls public/assets/
```

- [ ] **Step 4: Add scripts to package.json**

```json
"scripts": { "assets:download": "node scripts/download-assets.js", "assets:process": "node scripts/process-assets.js", "assets": "pnpm assets:download && pnpm assets:process" }
```

- [ ] **Step 5: Commit**

```bash
git add scripts public/assets package.json
git commit -m "feat: asset pipeline — download + optimize from source repos"
```

---

### Task 11: Visual Validation & Performance Budgets

**Files:**
- Create: `scripts/visual-validation.js` (threejs-visual-validation)
- Modify: `lighthouse-budget.json` (exact budgets from spec)
- Modify: `.github/workflows/ci.yml` (add visual + lighthouse steps)

**Interfaces:**
- Consumes: Task 6 (GalaxyMap), Task 7 (JUDAS scenes)
- Produces: Visual regression tests, Lighthouse CI budgets

- [ ] **Step 1: Implement visual-validation.js (fixed camera positions per chapter)**

```javascript
// scripts/visual-validation.js
const { chromium } = require('playwright');
const views = {
  galaxia: { url: '/galaxia', camera: { position: [0,0,100] } },
  'judas-genesis': { url: '/judas/genesis', camera: { position: [0,0,50] } },
  'judas-traicion': { url: '/judas/traicion', camera: { position: [0,0,15] } },
  // ... all 6 chapters
};
// For each view: navigate, wait for WebGL, screenshot, compare to baseline (pixelmatch < 0.1%)
```

- [ ] **Step 2: Update lighthouse-budget.json (exact spec Section 6.1)**

```json
{
  "ci": { "collect": { "numberOfRuns": 3, "settings": { "preset": "desktop" } }, "assert": { "assertions": { "categories:performance": ["error", { "minScore": 0.9 }], "categories:accessibility": ["error", { "minScore": 1.0 }], "first-contentful-paint": ["error", { "maxNumericValue": 2500 }], "largest-contentful-paint": ["error", { "maxNumericValue": 2500 }], "total-blocking-time": ["error", { "maxNumericValue": 200 }], "cumulative-layout-shift": ["error", { "maxNumericValue": 0.1 }] } } }
}
```

- [ ] **Step 3: Run visual validation + Lighthouse CI locally**

```bash
pnpm build && pnpm start & pnpm test:visual && pnpm lighthouse-ci
```

- [ ] **Step 4: Commit**

```bash
git add scripts/visual-validation.js lighthouse-budget.json .github/workflows/ci.yml
git commit -m "feat: visual validation + Lighthouse CI budgets"
```

---

### Task 12: Accessibility & Reduced Motion Polish

**Files:**
- Modify: `app/globals.css` (add reduced motion media query)
- Modify: `src/design-system/components/*.tsx` (ensure all components respect reduced motion)
- Modify: `app/(immersive)/galaxia/components/*.tsx` (R3F reduced motion)
- Modify: `app/(immersive)/judas/[capitulo]/components/*.tsx` (R3F reduced motion)
- Test: `src/__tests__/a11y.test.tsx` (axe-core)

**Interfaces:**
- Consumes: All previous tasks
- Produces: WCAG 2.1 AA compliance

- [ ] **Step 1: Write axe-core test**

```typescript
// src/__tests__/a11y.test.tsx
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
expect.extend(toHaveNoViolations);
test('landing page has no a11y violations', async () => {
  const { container } = render(<LandingPage />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

- [ ] **Step 2: Add reduced motion CSS to globals.css (spec Section 7.2)**

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation-duration: .01ms !important; animation-iteration-count: 1 !important; transition-duration: .01ms !important; scroll-behavior: auto !important; }
  .ship { transition: none; }
  .route { stroke-dasharray: none; }
  .travel-flash { display: none; }
  canvas { /* R3F: handled via useFrame skip */ }
}
```

- [ ] **Step 3: Update R3F components to respect reduced motion (use `useReducedMotion` hook)**

```typescript
// src/hooks/useReducedMotion.ts
import { useMediaQuery } from 'react-use';
export function useReducedMotion() { return useMediaQuery('(prefers-reduced-motion: reduce)'); }

// In each R3F scene: const reduced = useReducedMotion(); useFrame((_, dt) => { if (!reduced) { /* animate */ } });
```

- [ ] **Step 4: Run a11y tests**

```bash
pnpm test src/__tests__/a11y.test.tsx
```

- [ ] **Step 5: Commit**

```bash
git add app/globals.css src/design-system/components src/hooks/useReducedMotion.ts app/(immersive)/galaxia/components app/(immersive)/judas/[capitulo]/components
git commit -m "feat: accessibility — WCAG 2.1 AA + reduced motion support"
```

---

### Task 13: E2E Tests & CI Verification

**Files:**
- Create: `tests/e2e/galaxia.spec.ts`
- Create: `tests/e2e/judas-chapters.spec.ts`
- Create: `tests/e2e/marketing.spec.ts`
- Create: `tests/e2e/ai-services.spec.ts`
- Modify: `.github/workflows/ci.yml` (ensure all jobs run)

**Interfaces:**
- Consumes: All previous tasks
- Produces: Full E2E coverage

- [ ] **Step 1: Write galaxia.spec.ts (navigate map, click nodes, travel, dock panel)**

```typescript
// tests/e2e/galaxia.spec.ts
import { test, expect } from '@playwright/test';
test('galaxy map loads and allows navigation', async ({ page }) => {
  await page.goto('/galaxia');
  await expect(page.locator('canvas')).toBeVisible();
  await page.keyboard.press('ArrowRight');
  await expect(page.locator('[data-node="judas"]')).toHaveClass(/active/);
  await page.keyboard.press('Enter');
  await expect(page.locator('[data-dock="judas"]')).toBeVisible();
});
```

- [ ] **Step 2: Write judas-chapters.spec.ts (visit each chapter, scroll narrative, audio play)**

- [ ] **Step 3: Write marketing.spec.ts (landing, artista, prensa, musica load + SEO meta)**

- [ ] **Step 4: Write ai-services.spec.ts (lore chat returns stream, fallback works)**

- [ ] **Step 5: Run full E2E suite**

```bash
pnpm test:e2e
```

- [ ] **Step 6: Commit**

```bash
git add tests/e2e .github/workflows/ci.yml
git commit -m "feat: E2E tests — galaxy map, JUDAS chapters, marketing, AI"
```

---

### Task 14: Final Integration & Deploy Verification

**Files:**
- (No new files — verification only)

**Interfaces:**
- Consumes: All previous tasks
- Produces: Deployed preview + production URLs

- [ ] **Step 1: Push to GitHub, verify CI passes**

```bash
git push origin main
# Check GitHub Actions: lint-typecheck → test → visual → a11y → lighthouse → build → deploy-preview
```

- [ ] **Step 2: Verify preview deployment (Vercel preview URL)**

- Check marketing pages load (SSR)
- Check /galaxia loads (CSR, WebGL)
- Check /judas/genesis → /judas/qwen-perfil all load
- Check Omega/Neon/Duck gallery cards render
- Check AI chat works (OpenRouter free tier)
- Check reduced motion works (DevTools rendering tab)
- Check Lighthouse scores meet budgets

- [ ] **Step 3: Deploy to production (Vercel)**

```bash
vercel --prod
```

- [ ] **Step 4: Verify production URLs**

- `https://belentani.es` (or new domain) — marketing
- `https://belentani.es/galaxia` — galaxy map
- `https://belentani.es/judas/genesis` — chapter 1
- etc.

- [ ] **Step 5: Commit final verification**

```bash
git commit --allow-empty -m "chore: production deploy verified — all budgets met"
```

---

## Summary

| Phase | Tasks | Est. Time |
|-------|-------|-----------|
| 1 Foundation | 1-2 | 2-3 hrs |
| 2 Marketing SSR | 3 | 2-3 hrs |
| 3 Immersive Shell | 4 | 1-2 hrs |
| 4 AI Services | 5 | 1-2 hrs |
| 5 Galaxy Map | 6 | 3-4 hrs |
| 6 JUDAS Chapters | 7 | 6-8 hrs |
| 7 Gallery Cards | 8 | 1 hr |
| 8 Assets/Nav | 9-10 | 1-2 hrs |
| 9 Visual/Perf/A11y | 11-12 | 2-3 hrs |
| 10 E2E/Deploy | 13-14 | 1-2 hrs |
| **Total** | **14** | **20-30 hrs** |

**Recommended execution:** **Subagent-driven** — tasks have clear interfaces (Task 2 → 3,4,5,6,7,8; Task 4 → 6,7; Task 5 → 6,7; Task 6 → 7). A mistake in design system (Task 2) propagates everywhere. Independent review per task catches interface mismatches early.