'use client';
import { useParams } from 'next/navigation';
import { Suspense, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { judasChapters } from '@/lib/judas-data';
import { ScrollSection, AudioPlayer, Button } from '@/design-system';
import { useGalaxyStore } from '@/store/galaxy';

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
  const { travelTo } = useGalaxyStore();

  if (!chapter) return <div className="h-screen flex items-center justify-center text-mute">Capítulo no encontrado</div>;

  const Scene = sceneMap[chapter.id as keyof typeof sceneMap];

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') travelTo('judas');
      const idx = judasChapters.findIndex(c => c.id === chapter.id);
      if (e.key === 'ArrowRight' && idx < judasChapters.length - 1) window.location.href = `/judas/${judasChapters[idx + 1].id}`;
      if (e.key === 'ArrowLeft' && idx > 0) window.location.href = `/judas/${judasChapters[idx - 1].id}`;
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [chapter.id, travelTo]);

  return (
    <div className="h-screen w-full relative bg-void">
      <Suspense fallback={<div className="absolute inset-0 flex items-center justify-center text-mute font-mono">Cargando capítulo…</div>}>
        <Scene />
      </Suspense>

      {/* Narrative Overlay */}
      <ScrollSection chapter={chapter} variant="journey" className="absolute inset-0 pointer-events-none z-[10]">
        <div className="h-full w-full flex flex-col justify-between p-6 lg:p-10 pointer-events-auto">
          <div className="max-w-2xl">
            <p className="font-mono text-xs tracking-widest uppercase text-gold mb-2">{chapter.symbol} {chapter.id.toUpperCase()}</p>
            <h2 className="font-display text-3xl lg:text-4xl tracking-tight text-white mb-4">{chapter.name}</h2>
            <p className="text-mute leading-relaxed text-base lg:text-lg">{chapter.lore}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <AudioPlayer src={chapter.audio || ''} title={chapter.name} variant="chapter" />
            <Button variant="ghost" onClick={() => travelTo('judas')}>← Volver a JUDAS</Button>
          </div>
        </div>
      </ScrollSection>

      {/* Chapter Navigation */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 z-[15] pointer-events-auto">
        <Button variant="ghost" onClick={() => {
          const idx = judasChapters.findIndex(c => c.id === chapter.id);
          if (idx > 0) window.location.href = `/judas/${judasChapters[idx - 1].id}`;
        }} disabled={chapter.id === 'genesis'}>
          ← Anterior
        </Button>
        <span className="font-mono text-xs tracking-widest uppercase text-gold px-4">
          {judasChapters.findIndex(c => c.id === chapter.id) + 1} / {judasChapters.length}
        </span>
        <Button variant="ghost" onClick={() => {
          const idx = judasChapters.findIndex(c => c.id === chapter.id);
          if (idx < judasChapters.length - 1) window.location.href = `/judas/${judasChapters[idx + 1].id}`;
        }} disabled={chapter.id === 'qwen-perfil'}>
          Siguiente →
        </Button>
      </div>
    </div>
  );
}