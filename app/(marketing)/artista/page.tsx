import Link from 'next/link';
export default function ArtistaPage() {
  return <section className="max-w-4xl mx-auto px-6 py-20">
    <p className="text-gold">SÃO PAULO / BARCELONA</p><h1 className="font-display text-4xl my-6">Belentani</h1>
    <p className="text-2xl leading-relaxed max-w-2xl">Artista y compositor. Una voz entre el pop alternativo, el R&B y la electrónica experimental.</p>
    <div className="border-t border-border mt-12 pt-10"><h2 className="text-3xl mb-5">The Experience</h2><p className="text-xl leading-relaxed max-w-2xl">La música encuentra su reflejo en un universo de imágenes: un espejo en la arena, una llave, luz y sombra. Judas Era es el primer capítulo de esa historia.</p></div>
    <div className="flex gap-8 mt-10"><Link href="/judas-era">Judas Era</Link><Link href="/musica">Música</Link><Link href="/prensa">Contacto</Link></div>
  </section>;
}
