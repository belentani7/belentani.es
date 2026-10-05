'use client';
import dynamic from 'next/dynamic';
import { Suspense } from 'react';

const GalaxyMap = dynamic(() => import('./components/GalaxyMap').then(m => m.GalaxyMap), { ssr: false });

export default function GalaxiaPage() {
  return (
    <Suspense fallback={<div className="h-screen w-full flex items-center justify-center text-mute font-mono">Cargando galaxia…</div>}>
      <GalaxyMap />
    </Suspense>
  );
}