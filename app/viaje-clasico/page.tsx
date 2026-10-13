'use client';

import dynamic from 'next/dynamic';

const VoyageCinema = dynamic(() => import('@/components/voyage/VoyageCinema'), {
  ssr: false,
  loading: () => <main style={{ minHeight: '100svh', background: '#030008', color: '#ff174d', display: 'grid', placeItems: 'center' }}>BELENTANI</main>,
});

export default function ViajeClasico() {
  return <VoyageCinema />;
}
