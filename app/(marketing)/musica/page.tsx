import Link from 'next/link';
export default function MusicaPage() {
  return <section className="max-w-4xl mx-auto px-6 py-20">
    <p className="text-gold">BELENTANI</p><h1 className="font-display text-4xl my-6">Música</h1>
    <p className="text-xl leading-relaxed max-w-2xl">Pop alternativo, R&B y electrónica experimental. La voz como origen; Judas Era como universo narrativo.</p>
    <div className="flex flex-wrap gap-8 my-12"><a href="https://open.spotify.com/artist/2bU5Ir70YHHuUnq2f3WCYl" target="_blank" rel="noopener noreferrer">Spotify ↗</a><a href="https://www.youtube.com/@belentani" target="_blank" rel="noopener noreferrer">YouTube ↗</a></div>
    <div className="border-t border-border pt-10"><h2 className="text-3xl mb-4">Judas Era</h2><p className="text-xl mb-6">Génesis, traición, deuda y redención. Cuatro estaciones de una misma voz.</p><Link href="/judas-era">Entrar en la era</Link></div>
  </section>;
}
