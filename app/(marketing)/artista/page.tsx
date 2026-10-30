import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Biografía de Belentani | Artista y compositor",
  description: "Belentani, artista y compositor nacido en São Paulo y basado en Barcelona. Descubre su música, identidad artística y el universo narrativo JUDAS.",
  alternates: { canonical: "/artista" },
  openGraph: {
    title: "Biografía de Belentani | Artista y compositor",
    description: "Belentani, artista y compositor nacido en São Paulo y basado en Barcelona. Descubre su música, identidad artística y el universo narrativo JUDAS.",
    type: 'website',
    locale: 'es_ES',
    siteName: 'Belentani: The Experience',
    url: "/artista",
    images: [{ url: '/media/artist/pedro-2024-portrait.jpg', alt: 'Retrato artístico de BELENTANI' }],
  },
};

import Image from 'next/image';
import Link from 'next/link';

const selectedSongs = ['Mon Amour', 'Apaga a Luz', 'Heart Breaking'] as const;

const listeningLinks = [
  { title: 'Spotify', url: 'https://open.spotify.com/artist/2bU5Ir70YHHuUnq2f3WCYl' },
  { title: 'YouTube', url: 'https://www.youtube.com/@belentani' },
] as const;

/**
 * Editorial artist profile. The music and the person lead; interactive worlds
 * stay secondary. Keep claims and platform destinations verifiable.
 */
export default function ArtistaPage() {
  return (
    <main className="min-h-screen bg-[#11100f] text-[#f2eee8]">
      <section className="relative overflow-hidden border-b border-[#71665b]/35" aria-labelledby="artist-name">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_0%_0%,rgba(121,80,56,.15),transparent_55%)]" />
        <div className="relative mx-auto grid max-w-7xl items-stretch lg:grid-cols-[1.05fr_.95fr]">
          <div className="flex flex-col justify-center px-6 pb-16 pt-14 sm:px-10 lg:py-28 lg:pl-14 lg:pr-12">
            <p className="text-xs font-semibold uppercase tracking-[.3em] text-[#d6bca0]">
              Música independiente / São Paulo — Barcelona
            </p>
            <h1 id="artist-name" className="mt-10 font-serif text-[clamp(4.5rem,11vw,9rem)] font-normal leading-[.85] tracking-[-.075em] text-[#f6f0e8]">
              Belentani<span className="text-[#c39b79]">.</span>
            </h1>
            <p className="mt-10 max-w-xl font-serif text-[clamp(1.6rem,3vw,2.5rem)] leading-[1.18] text-[#e4d8c9]">
              La voz como origen. La música como lugar donde quedarse.
            </p>
            <p className="mt-7 max-w-lg text-lg leading-8 text-[#c6c0b8]">
              Artista y compositor nacido en São Paulo, basado en Barcelona.
              Pop alternativo, R&amp;B y electrónica experimental en un proyecto
              donde cada canción puede abrir una nueva historia.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Link href="/musica" className="inline-flex min-h-12 items-center border border-[#dec5a6] bg-[#dec5a6] px-6 text-sm font-semibold uppercase tracking-[.12em] text-[#17120e] transition-colors hover:bg-[#f4e6d1] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f4e6d1]">
                Escuchar la música <span className="ml-4" aria-hidden="true">↗</span>
              </Link>
              <Link href="/judas-era" className="inline-flex min-h-12 items-center border-b border-[#aa9786] px-2 text-sm font-semibold uppercase tracking-[.12em] text-[#e7dfd5] transition-colors hover:text-white">
                Descubrir JUDAS <span className="ml-3" aria-hidden="true">↗</span>
              </Link>
            </div>
          </div>
          <figure className="relative min-h-[420px] border-t border-[#71665b]/35 lg:min-h-[720px] lg:border-l lg:border-t-0">
            <Image
              src="/media/artist/pedro-2024-portrait.jpg"
              alt="Retrato artístico de Belentani"
              fill
              priority
              sizes="(max-width: 1023px) 100vw, 48vw"
              className="object-cover object-center"
            />
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#11100f]/75 via-transparent to-[#11100f]/10" />
            <figcaption className="absolute bottom-7 left-7 right-7 border-t border-white/45 pt-4 text-xs uppercase tracking-[.24em] text-white sm:left-10 sm:right-10">
              Belentani / Artist portrait
            </figcaption>
          </figure>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-12 border-b border-[#71665b]/35 px-6 py-20 sm:px-10 lg:grid-cols-[.6fr_1.4fr] lg:px-14 lg:py-28" aria-labelledby="obra-title">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[.25em] text-[#c6a789]">01 / La obra</p>
          <h2 id="obra-title" className="mt-4 max-w-sm font-serif text-5xl leading-[1.03] tracking-tight sm:text-6xl">
            Una historia contada con la voz.
          </h2>
        </div>
        <div className="max-w-2xl">
          <p className="font-serif text-2xl leading-[1.4] text-[#e7dfd5] sm:text-3xl">
            JUDAS EXPERIENCE es un universo narrativo construido alrededor de
            la voz, la traición, el deseo, la deuda y la redención.
          </p>
          <p className="mt-7 text-lg leading-8 text-[#bfb7ad]">
            Música e imagen se encuentran para desarrollar una obra que
            continúa más allá de la canción. Las experiencias interactivas
            acompañan el relato; no sustituyen a la música.
          </p>
          <div className="mt-9 flex flex-wrap gap-x-8 gap-y-4">
            <Link href="/judas-era" className="text-sm font-semibold uppercase tracking-[.12em] text-[#e8c7aa] underline decoration-[#88715b] underline-offset-8 hover:text-white">Explorar Judas Era ↗</Link>
            <Link href="/galaxia" className="text-sm font-semibold uppercase tracking-[.12em] text-[#e8c7aa] underline decoration-[#88715b] underline-offset-8 hover:text-white">Visitar la galaxia ↗</Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20 sm:px-10 lg:px-14 lg:py-28" aria-labelledby="catalogo-title">
        <div className="flex flex-wrap items-end justify-between gap-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[.25em] text-[#c6a789]">02 / Selección musical</p>
            <h2 id="catalogo-title" className="mt-4 font-serif text-5xl tracking-tight sm:text-6xl">La música primero.</h2>
          </div>
          <Link href="/musica" className="text-sm font-semibold uppercase tracking-[.12em] text-[#e8c7aa] underline decoration-[#88715b] underline-offset-8 hover:text-white">
            Ver la sección de música ↗
          </Link>
        </div>
        <ol className="mt-12 border-t border-[#71665b]/55">
          {selectedSongs.map((song, index) => (
            <li key={song} className="flex flex-wrap items-center justify-between gap-4 border-b border-[#71665b]/35 py-7">
              <div className="flex items-center gap-6 sm:gap-10">
                <span className="w-8 text-sm tabular-nums text-[#c6a789]">{String(index + 1).padStart(2, '0')}</span>
                <h3 className="font-serif text-2xl leading-tight text-[#f2eee8] sm:text-4xl">{song}</h3>
              </div>
              <span className="text-xs uppercase tracking-[.16em] text-[#bfb7ad]">Belentani</span>
            </li>
          ))}
        </ol>
        <p className="mt-6 max-w-2xl text-sm leading-7 text-[#bfb7ad]">
          Selección de canciones. Para escuchar las grabaciones, consulta los perfiles oficiales.
        </p>
        <div className="mt-8 flex flex-wrap gap-6">
          {listeningLinks.map((platform) => (
            <a key={platform.title} href={platform.url} target="_blank" rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center border-b border-[#bda68f] text-sm font-semibold uppercase tracking-[.16em] text-[#e8d3be] hover:text-white">
              {platform.title} <span className="ml-4" aria-hidden="true">↗</span>
            </a>
          ))}
        </div>
      </section>

      <section className="border-t border-[#71665b]/35 bg-[#1c1916]" aria-labelledby="contact-title">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 px-6 py-16 sm:px-10 lg:flex-row lg:items-end lg:justify-between lg:px-14 lg:py-20">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[.25em] text-[#c6a789]">03 / Contacto y prensa</p>
            <h2 id="contact-title" className="mt-4 max-w-2xl font-serif text-4xl leading-tight tracking-tight sm:text-5xl">
              Conocer la obra. Compartir la conversación.
            </h2>
          </div>
          <Link href="/prensa" className="inline-flex min-h-12 shrink-0 items-center self-start border border-[#dec5a6] px-6 text-sm font-semibold uppercase tracking-[.12em] text-[#f1e5d7] hover:bg-[#dec5a6] hover:text-[#17120e] lg:self-auto">
            Prensa y contacto <span className="ml-6" aria-hidden="true">↗</span>
          </Link>
        </div>
      </section>
    </main>
  );
}
