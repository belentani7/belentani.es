import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Belentani: artista y compositor',
  description: 'Conoce la obra musical y visual de Belentani: pop alternativo, R&B, electrónica experimental y el universo artístico Judas Era.',
  alternates: { canonical: '/artista' },
  openGraph: {
    type: 'website',
    url: '/artista',
    title: 'Belentani: artista y compositor',
    description: 'Música, imagen y experiencias interactivas de Belentani.',
    locale: 'es_ES',
    siteName: 'Belentani: The Experience',
    images: [{ url: '/media/artist/pedro-2024-portrait.jpg', width: 1368, height: 2048, alt: 'Retrato artístico de Belentani' }],
  },
};

import Image from 'next/image';
import Link from 'next/link';

export default function ArtistaPage() {
  return (
    <main className="min-h-screen bg-void text-ink">
      <section className="mx-auto grid max-w-7xl gap-10 px-6 py-16 lg:grid-cols-[0.92fr_1.08fr] lg:px-10 lg:py-24">
        <div className="relative overflow-hidden rounded-[2rem] border border-red/30 bg-voidElevated shadow-elevation">
          <div className="absolute inset-0 z-10 bg-[radial-gradient(circle_at_48%_18%,rgba(255,7,58,.22),transparent_28%),linear-gradient(180deg,transparent_48%,rgba(3,0,8,.85))]" />
          <Image
            src="/media/artist/pedro-2024-portrait.jpg"
            alt="Pedro Belentani, retrato artístico"
            width={1368}
            height={2048}
            priority
            className="min-h-[560px] w-full object-cover object-center"
            sizes="(max-width: 1024px) 100vw, 44vw"
          />
          <div className="absolute bottom-0 left-0 right-0 z-20 p-6">
            <p className="font-mono text-xs tracking-[.32em] text-gold">SÃO PAULO / BARCELONA</p>
            <h1 className="mt-3 font-display text-5xl font-black tracking-[-.08em] text-white md:text-7xl">BELENTANI</h1>
          </div>
        </div>

        <div className="flex flex-col justify-center">
          <p className="font-mono text-xs tracking-[.32em] text-red">ARTISTA · COMPOSITOR · CONSTRUCTOR DE MUNDOS</p>
          <h2 className="mt-5 max-w-3xl font-display text-4xl font-black leading-[.98] tracking-[-.06em] md:text-6xl">
            Una voz entre el pop oscuro, el R&B alternativo y la electrónica experimental.
          </h2>
          <p className="mt-7 max-w-2xl text-xl leading-8 text-mute">
            Pedro Belentani nació en São Paulo y vive en Barcelona. Su obra une música, imagen y sistemas
            interactivos: canciones como arquitectura emocional, interfaces como escenario, y el universo JUDAS
            como primer gran capítulo narrativo.
          </p>
          <div className="mt-8 grid gap-3 border-y border-border py-6 font-mono text-sm text-mute sm:grid-cols-3">
            <div><span className="block text-gold">ORIGEN</span>São Paulo</div>
            <div><span className="block text-gold">BASE</span>Barcelona</div>
            <div><span className="block text-gold">SONIDO</span>Dark pop · R&B · electrónica</div>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <article className="rounded-2xl border border-red/20 bg-white/[.025] p-5">
              <p className="font-mono text-[10px] tracking-[.26em] text-red">JUDAS ERA</p>
              <p className="mt-3 text-lg leading-7 text-mute">
                Un mito audiovisual de espejo, llave, diamante y máquina. La traición se convierte en input; la voz queda.
              </p>
            </article>
            <article className="rounded-2xl border border-gold/25 bg-white/[.025] p-5">
              <p className="font-mono text-[10px] tracking-[.26em] text-gold">GALAXIA</p>
              <p className="mt-3 text-lg leading-7 text-mute">
                Cada proyecto orbita una misma obra: música, IA, educación y mundos visuales conectados.
              </p>
            </article>
          </div>
          <div className="mt-9 flex flex-wrap gap-4 font-mono text-xs tracking-[.18em]">
            <Link className="border border-red bg-red px-5 py-3 text-void transition hover:bg-gold hover:border-gold" href="/galaxia">PILOTAR GALAXIA ↗</Link>
            <Link className="border border-border px-5 py-3 text-red transition hover:border-gold hover:text-gold" href="/musica">ESCUCHAR MÚSICA ↗</Link>
            <Link className="border border-border px-5 py-3 text-red transition hover:border-gold hover:text-gold" href="/judas">ENTRAR EN JUDAS ↗</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
