'use client';
import { Button, Card, Chip, ScrollSection } from '@/design-system';
import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
      {/* Hero */}
      <section className="text-center py-16 lg:py-24">
        <div className="mb-8">
          <h1 className="font-display font-black text-5xl lg:text-7xl tracking-wide text-white mb-6" style={{ textShadow: '0 0 30px rgba(255,7,58,.55)' }}>
            BELENTANI <span className="text-red">Ω</span>
          </h1>
          <p className="text-mute font-mono text-sm tracking-widest uppercase mb-8">Artista alternativo · São Paulo → Barcelona</p>
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            <Chip variant="soft">Dark Pop</Chip>
            <Chip variant="soft">R&B</Chip>
            <Chip variant="soft">Electrónica Experimental</Chip>
            <Chip variant="soft">432 Hz</Chip>
            <Chip variant="soft">−14 LUFS</Chip>
          </div>
        </div>
        <div className="flex flex-wrap justify-center gap-4">
          <Button asChild variant="primary"><Link href="/galaxia">Entrar a la Galaxia</Link></Button>
          <Button asChild variant="gold"><Link href="/artista">Ver Perfil Artista</Link></Button>
          <Button asChild variant="ghost"><Link href="/musica">Escuchar Música</Link></Button>
        </div>
      </section>

      {/* Artist Statement */}
      <ScrollSection variant="hero">
        <div className="max-w-3xl mx-auto ng-redglass p-6 lg:p-10 rounded-xl">
          <p className="font-mono text-xs tracking-widest uppercase text-gold mb-4">Declaración de artista</p>
          <p className="text-ink leading-relaxed mb-4">
            Mi obra conecta música, imagen y experiencias digitales. Nací en São Paulo, crecí en Barcelona.
            El universo JUDAS / OMEGA es un relato de origen sin voz, traición asumida, deuda impagable y redención como blasón.
            La frecuencia es 432 Hz. La matemática melódica viene de Denniz PoP → Max Martin → Andreas Carlsson → Lady Gaga / The Weeknd → Belentani.
          </p>
          <div className="flex flex-wrap justify-center gap-3 mt-6">
            <Button asChild variant="ghost"><Link href="https://open.spotify.com/artist/2bU5Ir70YHHuUnq2f3WCYl" target="_blank" rel="noopener noreferrer">Spotify</Link></Button>
            <Button asChild variant="ghost"><Link href="https://music.apple.com/artist/belentani/1522171354" target="_blank" rel="noopener noreferrer">Apple Music</Link></Button>
            <Button asChild variant="ghost"><Link href="https://www.youtube.com/@belentani" target="_blank" rel="noopener noreferrer">YouTube</Link></Button>
            <Button asChild variant="ghost"><Link href="https://soundcloud.com/belentani" target="_blank" rel="noopener noreferrer">SoundCloud</Link></Button>
          </div>
        </div>
      </ScrollSection>

      {/* Music Preview */}
      <ScrollSection variant="catalog">
        <div className="mb-8">
          <p className="font-mono text-xs tracking-widest uppercase text-gold mb-2">Catálogo</p>
          <h2 className="font-display text-3xl tracking-tight text-white">Lanzamientos recientes</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { year: '2024', title: 'JUDAS (Era Ω)', era: 'Álbum conceptual · 12 tracks', color: 'border-red/50' },
            { year: '2023', title: 'NEON', era: 'EP visual · 5 tracks', color: 'border-red/50' },
            { year: '2022', title: 'OMEGA CORE', era: 'Instrumental · 8 tracks', color: 'border-gold/50' },
            { year: '2021', title: 'DUCK SESSIONS', era: 'Beats & instrumentales', color: 'border-cyan/50' },
          ].map((release, i) => (
            <Card key={i} variant="glass" className={release.color} p-5>
              <p className="font-mono text-xs tracking-widest uppercase text-gold mb-1">{release.year}</p>
              <h3 className="font-display text-lg text-white mb-1">{release.title}</h3>
              <p className="text-mute text-sm">{release.era}</p>
            </Card>
          ))}
        </div>
        <div className="text-center mt-8">
          <Button asChild variant="gold"><Link href="/musica">Ver catálogo completo →</Link></Button>
        </div>
      </ScrollSection>

      {/* Worlds Preview */}
      <ScrollSection variant="lore">
        <div className="mb-8">
          <p className="font-mono text-xs tracking-widest uppercase text-gold mb-2">Universos</p>
          <h2 className="font-display text-3xl tracking-tight text-white">Explora los mundos</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card variant="redglass" p-6 className="text-center">
            <p className="font-mono text-xs tracking-widest uppercase text-gold mb-2">ERA JUDAS</p>
            <h3 className="font-display text-xl text-white mb-2">La obra narrativa</h3>
            <p className="text-mute text-sm mb-4">6 capítulos inmersivos: génesis, traición, deuda, redención, biblia música, cognición.</p>
            <Button asChild variant="primary"><Link href="/judas/genesis">Entrar a JUDAS →</Link></Button>
          </Card>
          <Card variant="redglass" p-6 className="text-center">
            <p className="font-mono text-xs tracking-widest uppercase text-gold mb-2">ECOSISTEMA OMEGA</p>
            <h3 className="font-display text-xl text-white mb-2">Música + Código + Tech</h3>
            <p className="text-mute text-sm mb-4">Portal inmersivo 3D, plantilla reutilizable, escaparate de versiones.</p>
            <Button asChild variant="gold"><Link href="https://belentani.es" target="_blank" rel="noopener noreferrer">Visitar Omega ↗</Link></Button>
          </Card>
          <Card variant="redglass" p-6 className="text-center">
            <p className="font-mono text-xs tracking-widest uppercase text-cyan mb-2">ARTISTA DUCK</p>
            <h3 className="font-display text-xl text-white mb-2">Producción musical</h3>
            <p className="text-mute text-sm mb-4">Beats, catálogo, reproductor, Studio OS. Aracaju, Brasil.</p>
            <Button asChild variant="gold"><Link href="https://belentani7.github.io/duck-hub/" target="_blank" rel="noopener noreferrer">Visitar Duck ↗</Link></Button>
          </Card>
        </div>
      </ScrollSection>
    </div>
  );
}