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
  motion: { fast: '150ms ease-out', base: '250ms ease-out', slow: '400ms ease-out', spring: 'cubic-bezier(.22,1,.36,1)' },
  breakpoints: { sm: '640px', md: '768px', lg: '1024px', xl: '1280px', '2xl': '1536px' },
  zIndex: { hud: 10, dock: 20, modal: 100, toast: 200, boot: 300 },
} as const;

export type Tokens = typeof tokens;