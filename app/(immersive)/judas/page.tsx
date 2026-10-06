'use client';
import Link from 'next/link';
import { judasChapters } from '@/lib/judas-data';
import { ScrollSection, Card, Button, Chip } from '@/design-system';

export default function JudasEraPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
      <ScrollSection variant="hero">
        <div className="text-center mb-12">
          <p className="font-mono text-xs tracking-widest uppercase text-gold mb-2">Era JUDAS</p>
          <h1 className="font-display font-black text-4xl lg:text-5xl tracking-wide text-white mb-4">La obra narrativa</h1>
          <p className="text-mute font-mono text-sm tracking-widest uppercase">6 capítulos inmersivos · Stems reales · 432 Hz · −14 LUFS</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {judasChapters.map((chapter) => (
            <Card key={chapter.id} variant="redglass" className="p-6 text-center group">
              <div className="text-4xl mb-3">{chapter.symbol}</div>
              <h3 className="font-display text-xl text-white mb-2">{chapter.name}</h3>
              <p className="text-mute text-sm mb-4 line-clamp-3">{chapter.lore}</p>
              <Button asChild variant="primary" className="w-full"><Link href={`/judas/${chapter.id}`}>Entrar al capítulo →</Link></Button>
            </Card>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-border text-center">
          <p className="font-mono text-xs tracking-widest uppercase text-gold mb-4">Navegación por teclado en cada capítulo</p>
          <div className="flex flex-wrap justify-center gap-3 text-mute text-sm">
            <kbd className="px-2 py-1 bg-voidElevated border border-border rounded">←/→</kbd> Capítulo anterior/siguiente
            <kbd className="px-2 py-1 bg-voidElevated border border-border rounded">Espacio</kbd> Play/Pausa audio
            <kbd className="px-2 py-1 bg-voidElevated border border-border rounded">Esc</kbd> Volver a galaxia
          </div>
        </div>
      </ScrollSection>
    </div>
  );
}