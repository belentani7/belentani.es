'use client';

export const dynamic = 'force-dynamic';

import { default as dynamicImport } from 'next/dynamic';

const VoyageCinema = dynamicImport(() => import('@/components/voyage/VoyageCinema'), {
  ssr: false,
  loading: () => <main style={{ minHeight: '100svh', background: '#030008', color: '#ff174d', display: 'grid', placeItems: 'center' }}>BELENTANI</main>,
});

export default function ViajeClasico() {
  return <VoyageCinema />;
}
