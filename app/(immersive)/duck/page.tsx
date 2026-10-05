'use client';
import { ScrollSection, Card, Button } from '@/design-system';
import { galaxySystems } from '@/lib/galaxy-data';

export default function DuckPage() {
  const system = galaxySystems.find(s => s.id === 'duck');
  if (!system) return null;

  return (
    <ScrollSection variant="hero" className="h-screen w-full flex items-center justify-center p-8">
      <Card variant="redglass" className="max-w-2xl w-full p-8 text-center">
        <div className="aspect-video mb-6 bg-voidElevated rounded-xl overflow-hidden relative">
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-cyan/20 to-void">
            <span className="font-display text-6xl text-cyan/50">🦆</span>
          </div>
        </div>
        <div className="space-y-4">
          <p className="font-mono text-xs tracking-widest uppercase text-gold">{system.tag}</p>
          <h2 className="font-display text-3xl text-white">{system.name}</h2>
          <p className="text-mute leading-relaxed">{system.blurb}</p>
          <div className="flex flex-wrap justify-center gap-3 mt-4">
            <Button asChild variant="primary"><a href={system.url!} target="_blank" rel="noopener noreferrer">Visitar Duck Hub ↗</a></Button>
            <Button asChild variant="ghost" onClick={() => window.history.back()}>← Volver a Galaxia</Button>
          </div>
        </div>
      </Card>
    </ScrollSection>
  );
}