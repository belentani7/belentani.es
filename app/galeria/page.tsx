import type { Metadata } from 'next';
import Link from 'next/link';
import { VOYAGE_PLACES } from '@/lib/voyage-places';

export const metadata: Metadata = {
  title: 'Galería | Mundos y escenas de Belentani',
  description: 'Las escenas navegables del universo Belentani: planeta, diamante, llave, nave, portal y archivo del relato.',
  alternates: { canonical: '/galeria' },
  openGraph: {
    title: 'Galería | Mundos y escenas de Belentani',
    description: 'Las escenas navegables del universo Belentani, reunidas en un solo índice.',
    type: 'website',
    locale: 'es_ES',
    siteName: 'Belentani: The Experience',
    url: '/galeria',
    images: [{ url: '/media/artist/pedro-2024-portrait.jpg', alt: 'Retrato artístico de BELENTANI' }],
  },
};

/** Escenas que se pueden visitar. El orden es el de la obra, no el del catálogo. */
const WORLD_IDS = [
  'viaje3d',
  'visual-engine',
  'planet-scene',
  'starfield',
  'diamante',
  'nave',
  'portal3d',
  'portfolio3d',
  'supernova',
  'expanded',
  'judas-web',
  'nucleo',
] as const;

const worlds = WORLD_IDS.map((id) => VOYAGE_PLACES.find((place) => place.id === id)).filter(
  (place): place is (typeof VOYAGE_PLACES)[number] => Boolean(place?.url),
);

const chapters = [
  { id: 'espejo', number: '01', title: 'El espejo', note: 'Identidad / reflejo' },
  { id: 'llave', number: '02', title: 'La llave', note: 'Acceso / elección' },
  { id: 'supernova', number: '03', title: 'La supernova', note: 'Colapso / renacimiento' },
  { id: 'voz', number: '04', title: 'La voz', note: 'Música / memoria' },
] as const;

export default function GaleriaPage() {
  return (
    <main className="min-h-screen bg-[#11100f] text-[#f2eee8]">
      <section className="border-b border-[#71665b]/35">
        <div className="mx-auto max-w-7xl px-6 pb-16 pt-16 sm:px-10 lg:pb-20 lg:pt-24">
          <p className="text-xs font-semibold uppercase tracking-[.3em] text-[#c6a789]">
            Galería / {String(worlds.length).padStart(2, '0')} mundos · {chapters.length} capítulos
          </p>
          <h1 className="mt-8 max-w-4xl font-serif text-[clamp(3.2rem,8vw,7rem)] leading-[.92] tracking-[-.06em]">
            La obra se mira<br /><em className="font-normal text-[#d6bca0]">antes de explicarse.</em>
          </h1>
          <p className="mt-9 max-w-2xl text-lg leading-8 text-[#c6c0b8]">
            Cada entrada abre una escena real del universo: planetas procedurales, material físico,
            campo de estrellas y los símbolos del relato. No son maquetas: son las páginas que
            recorren la obra.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16 sm:px-10 lg:py-24" aria-labelledby="mundos-title">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[.25em] text-[#c6a789]">01 / Mundos</p>
            <h2 id="mundos-title" className="mt-4 font-serif text-4xl tracking-tight sm:text-5xl">
              Escenas navegables.
            </h2>
          </div>
          <Link
            href="/galaxia"
            className="text-sm font-semibold uppercase tracking-[.12em] text-[#e8c7aa] underline decoration-[#88715b] underline-offset-8 hover:text-white"
          >
            Abrir el portal 3D ↗
          </Link>
        </div>

        <ol className="mt-12 grid gap-px overflow-hidden border border-[#71665b]/40 bg-[#71665b]/30 sm:grid-cols-2 lg:grid-cols-3">
          {worlds.map((world, index) => (
            <li key={world.id} className="bg-[#11100f]">
              <Link
                href={world.url!}
                className="group flex h-full min-h-44 flex-col justify-between gap-8 p-7 transition-colors hover:bg-[#1a1714] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#c6a789]"
              >
                <div className="flex items-start justify-between gap-4">
                  <span className="text-xs tabular-nums tracking-[.2em] text-[#c6a789]">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span
                    aria-hidden="true"
                    className="h-2.5 w-2.5 rounded-full ring-1 ring-white/25"
                    style={{ backgroundColor: world.accent, boxShadow: `0 0 18px ${world.accent}66` }}
                  />
                </div>
                <div>
                  <h3 className="font-serif text-2xl leading-tight text-[#f6f0e8] group-hover:text-white">
                    {world.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-[#bfb7ad]">{world.tagline}</p>
                </div>
              </Link>
            </li>
          ))}
        </ol>
      </section>

      <section className="border-y border-[#71665b]/35 bg-[#171412]" aria-labelledby="capitulos-title">
        <div className="mx-auto max-w-7xl px-6 py-16 sm:px-10 lg:py-24">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[.25em] text-[#c6a789]">02 / Archivo</p>
              <h2 id="capitulos-title" className="mt-4 font-serif text-4xl tracking-tight sm:text-5xl">
                Cuatro capítulos.
              </h2>
            </div>
            <Link
              href="/lore"
              className="text-sm font-semibold uppercase tracking-[.12em] text-[#e8c7aa] underline decoration-[#88715b] underline-offset-8 hover:text-white"
            >
              Entrar en el lore ↗
            </Link>
          </div>

          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {chapters.map((chapter) => (
              <li key={chapter.id}>
                <Link
                  href={`/lore#${chapter.id}`}
                  className="group flex h-full flex-col justify-between gap-5 border border-[#71665b]/45 p-6 transition-colors hover:border-[#c6a789] hover:bg-[#1f1b18]"
                >
                  <span className="text-xs uppercase tracking-[.24em] text-[#c6a789]">{chapter.number}</span>
                  <span className="font-serif text-2xl leading-tight group-hover:text-white">{chapter.title}</span>
                  <span className="text-[.68rem] uppercase tracking-[.18em] text-[#a49b91]">{chapter.note}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16 sm:px-10 lg:py-20" aria-labelledby="seguir-title">
        <div className="flex flex-col gap-8 border border-[#71665b]/45 p-8 sm:flex-row sm:items-end sm:justify-between lg:p-12">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[.25em] text-[#c6a789]">03 / Seguir</p>
            <h2 id="seguir-title" className="mt-4 max-w-2xl font-serif text-4xl leading-tight tracking-tight sm:text-5xl">
              La imagen abre la puerta. La música la cruza.
            </h2>
          </div>
          <div className="flex flex-wrap gap-6">
            <Link
              href="/musica"
              className="inline-flex min-h-12 items-center border border-[#dec5a6] bg-[#dec5a6] px-6 text-sm font-semibold uppercase tracking-[.12em] text-[#17120e] transition-colors hover:bg-[#f4e6d1]"
            >
              Escuchar <span className="ml-4" aria-hidden="true">↗</span>
            </Link>
            <Link
              href="/judas"
              className="inline-flex min-h-12 items-center border-b border-[#aa9786] px-2 text-sm font-semibold uppercase tracking-[.12em] text-[#e7dfd5] hover:text-white"
            >
              Ver Judas <span className="ml-3" aria-hidden="true">↗</span>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
