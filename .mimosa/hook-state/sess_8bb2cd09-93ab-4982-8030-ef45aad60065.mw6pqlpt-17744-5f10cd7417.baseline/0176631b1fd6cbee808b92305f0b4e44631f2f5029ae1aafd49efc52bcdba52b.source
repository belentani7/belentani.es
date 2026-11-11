import React from 'react';
import { cleanup, render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { afterEach, test, expect, vi } from 'vitest';
import LandingPage from '../../app/page';
import ArtistaPage from '../../app/(marketing)/artista/page';
import PrensaPage from '../../app/(marketing)/prensa/page';
import MusicaPage from '../../app/(marketing)/musica/page';

expect.extend(toHaveNoViolations);
afterEach(cleanup);

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn(), prefetch: vi.fn() }),
  useParams: () => ({ capitulo: 'genesis' }),
  usePathname: () => '/judas/genesis',
  useSearchParams: () => new URLSearchParams(),
}));

// Mock next/font
vi.mock('next/font/google', () => ({
  Orbitron: () => ({ variable: '--font-orbitron', className: '' }),
  Rajdhani: () => ({ variable: '--font-rajdhani', className: '' }),
  Share_Tech_Mono: () => ({ variable: '--font-share-tech-mono', className: '' }),
}));

// Mock @react-three/fiber
vi.mock('@react-three/fiber', () => ({
  Canvas: ({ children }: { children?: React.ReactNode }) =>
    React.createElement('div', { 'data-testid': 'canvas' }, children),
  useFrame: vi.fn(),
  useThree: () => ({ scene: {}, camera: {}, gl: { toneMapping: 0, toneMappingExposure: 1 } }),
}));

// Mock @react-three/drei
vi.mock('@react-three/drei', () => ({
  OrbitControls: () => null,
  Environment: () => null,
  Stars: () => null,
  Html: ({ children }: { children?: React.ReactNode }) =>
    React.createElement('div', {}, children),
}));

// Mock gsap
vi.mock('gsap', () => ({
  gsap: { to: vi.fn(), from: vi.fn(), timeline: vi.fn(() => ({ to: vi.fn(), add: vi.fn() })) },
  ScrollTrigger: { create: vi.fn(), refresh: vi.fn() },
}));

vi.mock('@gsap/react', () => ({
  useGSAP: vi.fn(),
}));

// Mock zustand
vi.mock('zustand', () => ({
  create: (fn?: (set: unknown, get: unknown) => unknown) => {
    const store: Record<string, unknown> = {};
    const set = (partial: unknown) => {
      const next = typeof partial === 'function' ? (partial as (s: unknown) => unknown)(store) : partial;
      Object.assign(store, next);
    };
    const get = () => store;
    const build = (creator: (set: unknown, get: unknown) => unknown) => {
      Object.assign(store, creator(set, get));
      return () => store;
    };
    return fn ? build(fn) : build;
  },
}));

vi.mock('zustand/middleware', () => ({
  persist: (fn: unknown) => fn,
}));

// Mock @tanstack/react-query
vi.mock('@tanstack/react-query', () => ({
  QueryClient: vi.fn(),
  QueryClientProvider: ({ children }: { children?: React.ReactNode }) =>
    React.createElement(React.Fragment, {}, children),
  useQuery: vi.fn(),
  useMutation: vi.fn(),
}));

// Mock openrouter-client
vi.mock('openrouter-client', () => ({
  __esModule: true,
  default: vi.fn().mockImplementation(() => ({
    chat: { completions: { create: vi.fn() } },
  })),
}));

// Mock d3-force
vi.mock('d3-force', () => ({
  forceSimulation: vi.fn(),
  forceLink: vi.fn(),
  forceManyBody: vi.fn(),
  forceCenter: vi.fn(),
}));

// Global test utilities
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

global.matchMedia = vi.fn().mockImplementation((query: string) => ({
  matches: false,
  media: query,
  onchange: null,
  addListener: vi.fn(),
  removeListener: vi.fn(),
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  dispatchEvent: vi.fn(),
}));

expect.extend(toHaveNoViolations);

test('landing page has no a11y violations', async () => {
  const { container } = render(<LandingPage />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});

test('artista page has no a11y violations', async () => {
  const { container } = render(<ArtistaPage />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});

test('prensa page has no a11y violations', async () => {
  const { container } = render(<PrensaPage />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});

test('musica page has no a11y violations', async () => {
  const { container } = render(<MusicaPage />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
