'use client';
import { ScrollSection, Card, Button } from '@/design-system';

export default function ArtistaPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
      <ScrollSection variant="hero">
        <div className="text-center mb-12">
          <p className="font-mono text-xs tracking-widest uppercase text-gold mb-2">Artista</p>
          <h1 className="font-display font-black text-4xl lg:text-5xl tracking-wide text-white mb-4">BELENTANI</h1>
          <p className="text-mute font-mono text-sm tracking-widest uppercase">São Paulo → Barcelona · Dark pop, R&B, electrónica experimental</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <ScrollSection variant="lore">
            <h2 className="font-display text-2xl text-white mb-4">Biografía</h2>
            <div className="prose prose-invert max-w-none text-mute leading-relaxed">
              <p>Pedro Belentani, conocido artísticamente como Belentani, es un artista y compositor brasileño-español nacido en São Paulo y criado en Barcelona. Su obra transita entre el dark pop, el R&B contemporáneo y la electrónica experimental, construyendo un universo sonoro y visual coherente bajo la frecuencia de 432 Hz y un máster a −14.0 LUFS.</p>
              <p>La genealogía melódica de su música se rastrea hasta Denniz PoP (Cheiron Studios, 1992) → Max Martin → Andreas Carlsson → Lady Gaga / The Weeknd → Belentani, aplicando la "matemática melódica": sílabas, acentos y notas ajustados antes que la letra; la regla de la octava (verso en registro grave, coro una octava arriba); y el motivo firma 5 ♭6 5 4 ♭3 2 1 en Fa sostenido menor.</p>
              <p>El universo narrativo JUDAS / OMEGA articula un arco de origen sin voz, traición asumida, deuda impagable y redención como blasón. No hay instituciones, nombres ni fechas: solo símbolos — espejo en el desierto, plumas blancas y negras, libros contrastados, cadena y llave entreabierta, cruz y sombra, oro viejo con negro, violeta y rojo.</p>
            </div>
          </ScrollSection>

          <ScrollSection variant="lore">
            <h2 className="font-display text-2xl text-white mb-4">Prensa & Contacto</h2>
            <div className="space-y-4">
              <Card variant="redglass" p-5>
                <h3 className="font-display text-lg text-white mb-2">Booking & Management</h3>
                <p className="text-mute text-sm mb-3">Disponible para conciertos, festivales, sincronización y colaboraciones.</p>
                <Button asChild variant="primary"><a href="mailto:booking@belentani.es">booking@belentani.es</a></Button>
              </Card>
              <Card variant="redglass" p-5>
                <h3 className="font-display text-lg text-white mb-2">Prensa & Entrevistas</h3>
                <p className="text-mute text-sm mb-3">Material de prensa, fotos en alta resolución y dossier disponible.</p>
                <Button asChild variant="gold"><a href="mailto:press@belentani.es">press@belentani.es</a></Button>
              </Card>
              <Card variant="redglass" p-5>
                <h3 className="font-display text-lg text-white mb-2">Colaboraciones Técnicas</h3>
                <p className="text-mute text-sm mb-3">AI Systems, Trust & Safety, Creative Tech, WebGL/Three.js, GSAP.</p>
                <Button asChild variant="ghost"><a href="https://github.com/belentani7" target="_blank" rel="noopener noreferrer">GitHub →</a></Button>
              </Card>
            </div>
          </ScrollSection>
        </div>

        <ScrollSection variant="lore">
          <h2 className="font-display text-2xl text-white mb-4">Enlaces oficiales</h2>
          <div className="flex flex-wrap justify-center gap-3">
            <Button asChild variant="ghost"><a href="https://open.spotify.com/artist/2bU5Ir70YHHuUnq2f3WCYl" target="_blank" rel="noopener noreferrer">Spotify</a></Button>
            <Button asChild variant="ghost"><a href="https://music.apple.com/artist/belentani/1522171354" target="_blank" rel="noopener noreferrer">Apple Music</a></Button>
            <Button asChild variant="ghost"><a href="https://www.youtube.com/@belentani" target="_blank" rel="noopener noreferrer">YouTube</a></Button>
            <Button asChild variant="ghost"><a href="https://soundcloud.com/belentani" target="_blank" rel="noopener noreferrer">SoundCloud</a></Button>
            <Button asChild variant="ghost"><a href="https://www.instagram.com/belentani_/" target="_blank" rel="noopener noreferrer">Instagram</a></Button>
            <Button asChild variant="ghost"><a href="https://github.com/belentani7" target="_blank" rel="noopener noreferrer">GitHub</a></Button>
          </div>
        </ScrollSection>
      </ScrollSection>
    </div>
  );
}