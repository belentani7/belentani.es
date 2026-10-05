'use client';
import { ScrollSection, Card, Button, Chip } from '@/design-system';

export default function PrensaPage() {
  const assets = [
    { label: 'Logo principal (SVG)', href: '#', type: 'vector' },
    { label: 'Logo Ω (SVG)', href: '#', type: 'vector' },
    { label: 'Foto artista — retrato (JPG)', href: '#', type: 'image' },
    { label: 'Foto artista — live (JPG)', href: '#', type: 'image' },
    { label: 'Key art JUDAS — planeta/diamante (PNG)', href: '#', type: 'image' },
    { label: 'Key art OMEGA — portal (PNG)', href: '#', type: 'image' },
    { label: 'Cover JUDAS master (JPG)', href: '#', type: 'image' },
    { label: 'Press kit PDF (ES/EN)', href: '#', type: 'document' },
  ];

  const bio = `Belentani (Pedro Belentani) — artista y compositor brasileño-español. São Paulo → Barcelona.
Dark pop, R&B, electrónica experimental. 432 Hz · −14.0 LUFS.
Universo JUDAS / OMEGA: narrativa de origen sin voz, traición, deuda, redención.
Genealogía melódica: Denniz PoP → Max Martin → Andreas Carlsson → Lady Gaga/The Weeknd → Belentani.
Stems reales: JUDAS_master_FINAL.wav, violín, coros, mixes A/B, instrumental.`;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
      <ScrollSection variant="hero">
        <div className="text-center mb-12">
          <p className="font-mono text-xs tracking-widest uppercase text-gold mb-2">Prensa</p>
          <h1 className="font-display font-black text-4xl lg:text-5xl tracking-wide text-white mb-4">Press Kit</h1>
          <p className="text-mute font-mono text-sm tracking-widest uppercase">Material oficial para medios, programadores y colaboradores</p>
        </div>

        <ScrollSection variant="lore">
          <h2 className="font-display text-2xl text-white mb-4">Biografía oficial (copia/pega)</h2>
          <Card variant="panel" p-6 className="font-mono text-sm text-ink leading-relaxed bg-voidElevated/60 whitespace-pre-wrap">{bio}</Card>
        </ScrollSection>

        <ScrollSection variant="lore">
          <h2 className="font-display text-2xl text-white mb-4">Assets descargables</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {assets.map((a, i) => (
              <Card key={i} variant="glass" p-4 className="flex items-center justify-between border-border hover:border-red/50 transition-colors">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs tracking-widest uppercase text-gold">{a.type.toUpperCase()}</span>
                  <span className="text-ink">{a.label}</span>
                </div>
                <Button variant="ghost" asChild><a href={a.href} target="_blank" rel="noopener noreferrer">Descargar</a></Button>
              </Card>
            ))}
          </div>
        </ScrollSection>

        <ScrollSection variant="lore">
          <h2 className="font-display text-2xl text-white mb-4">Datos técnicos</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card variant="redglass" p-5 className="text-center">
              <p className="font-display text-4xl text-gold font-black mb-1">432 Hz</p>
              <p className="font-mono text-xs tracking-widest uppercase text-mute">Frecuencia de afinación</p>
            </Card>
            <Card variant="redglass" p-5 className="text-center">
              <p className="font-display text-4xl text-red font-black mb-1">−14 LUFS</p>
              <p className="font-mono text-xs tracking-widest uppercase text-mute">Loudness integrado (streaming)</p>
            </Card>
            <Card variant="redglass" p-5 className="text-center">
              <p className="font-display text-4xl text-cyan font-black mb-1">F#m</p>
              <p className="font-mono text-xs tracking-widest uppercase text-mute">Tonalidad principal (motivo firma)</p>
            </Card>
          </div>
        </ScrollSection>

        <ScrollSection variant="lore">
          <h2 className="font-display text-2xl text-white mb-4">Contacto prensa</h2>
          <div className="flex flex-wrap justify-center gap-3">
            <Button asChild variant="primary"><a href="mailto:press@belentani.es">press@belentani.es</a></Button>
            <Button asChild variant="gold"><a href="mailto:booking@belentani.es">booking@belentani.es</a></Button>
            <Button asChild variant="ghost"><a href="/artista">Perfil artista →</a></Button>
          </div>
        </ScrollSection>
      </ScrollSection>
    </div>
  );
}