'use client';
import { ScrollSection, Card, Button, Chip } from '@/design-system';

const catalog = [
  { year: '2024', title: 'JUDAS (Era Ω)', type: 'Álbum conceptual', tracks: 12, duration: '47:32', status: 'Disponible', color: 'border-red/50', stems: true },
  { year: '2023', title: 'NEON', type: 'EP visual', tracks: 5, duration: '18:45', status: 'Disponible', color: 'border-red/50', stems: false },
  { year: '2022', title: 'OMEGA CORE', type: 'Instrumental', tracks: 8, duration: '32:10', status: 'Disponible', color: 'border-gold/50', stems: true },
  { year: '2021', title: 'DUCK SESSIONS', type: 'Beats & instrumentales', tracks: 15, duration: '52:03', status: 'Disponible', color: 'border-cyan/50', stems: false },
  { year: '2020', title: 'PRIMERAS GRABACIONES', type: 'Demo/Archivo', tracks: 6, duration: '21:18', status: 'Archivado', color: 'border-border', stems: false },
];

export default function MusicaPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
      <ScrollSection variant="hero">
        <div className="text-center mb-12">
          <p className="font-mono text-xs tracking-widest uppercase text-gold mb-2">Catálogo</p>
          <h1 className="font-display font-black text-4xl lg:text-5xl tracking-wide text-white mb-4">Música</h1>
          <p className="text-mute font-mono text-sm tracking-widest uppercase">432 Hz · −14 LUFS · Matemática melódica · Stems reales</p>
        </div>

        <div className="flex flex-wrap justify-center gap-3 mb-12">
          <Chip variant="soft">Dark Pop</Chip>
          <Chip variant="soft">R&B</Chip>
          <Chip variant="soft">Electrónica Experimental</Chip>
          <Chip variant="soft">432 Hz</Chip>
          <Chip variant="soft">−14 LUFS</Chip>
          <Chip variant="soft">Stems reales</Chip>
        </div>

        <div className="space-y-6">
          <h2 className="font-display text-2xl text-white mb-4 sr-only">Catálogo de lanzamientos</h2>
          {catalog.map((release, i) => (
            <Card key={i} variant="glass" className={`${release.color} p-6`}>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <Chip variant="soft">{release.year}</Chip>
                    <Chip variant="soft">{release.type}</Chip>
                    {release.stems && <Chip variant="soft" className="text-green border-green/30">Stems disponibles</Chip>}
                    <Chip variant={release.status === 'Archivado' ? 'soft' : 'progress'} progress={release.status === 'Disponible' ? 100 : 0}>
                      {release.status}
                    </Chip>
                  </div>
                  <h3 className="font-display text-2xl text-white mb-1">{release.title}</h3>
                  <p className="text-mute font-mono text-sm">{release.tracks} tracks · {release.duration}</p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <Button asChild variant="primary"><a href="https://open.spotify.com/artist/2bU5Ir70YHHuUnq2f3WCYl" target="_blank" rel="noopener noreferrer">Spotify</a></Button>
                  <Button asChild variant="gold"><a href="https://music.apple.com/artist/belentani/1522171354" target="_blank" rel="noopener noreferrer">Apple Music</a></Button>
                  <Button asChild variant="ghost"><a href="https://www.youtube.com/@belentani" target="_blank" rel="noopener noreferrer">YouTube</a></Button>
                  <Button asChild variant="ghost"><a href="https://soundcloud.com/belentani" target="_blank" rel="noopener noreferrer">SoundCloud</a></Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <ScrollSection variant="lore">
          <h2 className="font-display text-2xl text-white mb-4">Stems & Archivo (JUDAS)</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card variant="panel" p-5>
              <h3 className="font-display text-lg text-white mb-2">JUDAS_master_FINAL.wav</h3>
              <p className="text-mute text-sm mb-3">Master final −14.0 LUFS · true peak −3.3 dBTP · 432 Hz · 24-bit/48kHz</p>
              <div className="flex flex-wrap gap-2">
                <Chip variant="soft">Master</Chip>
                <Chip variant="soft">432 Hz</Chip>
                <Chip variant="soft">−14 LUFS</Chip>
              </div>
            </Card>
            <Card variant="panel" p-5>
              <h3 className="font-display text-lg text-white mb-2">Stems disponibles</h3>
              <p className="text-mute text-sm mb-3">Violín, coros (hi/lo), mixes A/B, instrumental</p>
              <div className="flex flex-wrap gap-2">
                <Chip variant="soft">Violín</Chip>
                <Chip variant="soft">Coros</Chip>
                <Chip variant="soft">Mix A</Chip>
                <Chip variant="soft">Mix B</Chip>
                <Chip variant="soft">Instrumental</Chip>
              </div>
            </Card>
          </div>
        </ScrollSection>

        <ScrollSection variant="lore">
          <h2 className="font-display text-2xl text-white mb-4">Enlaces de streaming</h2>
          <div className="flex flex-wrap justify-center gap-3">
            <Button asChild variant="ghost"><a href="https://open.spotify.com/artist/2bU5Ir70YHHuUnq2f3WCYl" target="_blank" rel="noopener noreferrer">Spotify</a></Button>
            <Button asChild variant="ghost"><a href="https://music.apple.com/artist/belentani/1522171354" target="_blank" rel="noopener noreferrer">Apple Music</a></Button>
            <Button asChild variant="ghost"><a href="https://www.youtube.com/@belentani" target="_blank" rel="noopener noreferrer">YouTube</a></Button>
            <Button asChild variant="ghost"><a href="https://soundcloud.com/belentani" target="_blank" rel="noopener noreferrer">SoundCloud</a></Button>
            <Button asChild variant="ghost"><a href="https://bandcamp.com" target="_blank" rel="noopener noreferrer">Bandcamp</a></Button>
          </div>
        </ScrollSection>
      </ScrollSection>
    </div>
  );
}