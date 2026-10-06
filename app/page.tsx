'use client';

import dynamic from 'next/dynamic';

const VoyageCinema = dynamic(() => import('@/components/voyage/VoyageCinema'), {
  ssr: false,
  loading: () => (
    <main
      style={{
        minHeight: '100svh',
        background:
          'radial-gradient(ellipse at 60% 40%, #3a0210 0%, #120008 35%, #030008 70%)',
        color: '#ff073a',
        display: 'grid',
        placeItems: 'center',
        fontFamily: 'ui-monospace, monospace',
        letterSpacing: '0.28em',
        textShadow: '0 0 24px rgba(255,7,58,0.85)',
      }}
    >
      BELENTANI
    </main>
  ),
});

export default function Home() {
  return <VoyageCinema />;
}
