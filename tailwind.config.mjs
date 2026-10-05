/** @type {import('tailwindcss').Config} */
const config = {
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