import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Belentani para prensa | Biografía y enlaces oficiales",
  description: "Biografía, contexto musical, obra seleccionada y canales oficiales de Belentani para medios, colaboradores y oyentes.",
  alternates: { canonical: "/prensa" },
  openGraph: {
    title: "Belentani para prensa | Biografía y enlaces oficiales",
    description: "Biografía, contexto musical, obra seleccionada y canales oficiales de Belentani para medios, colaboradores y oyentes.",
    type: 'website',
    locale: 'es_ES',
    siteName: 'Belentani: The Experience',
    url: "/prensa",
    images: [{ url: '/media/artist/pedro-2024-portrait.jpg', alt: 'Retrato artístico de BELENTANI' }],
  },
};

import Link from 'next/link';

const officialProfiles = [
  { label: 'Instagram', url: 'https://www.instagram.com/belentani_/' },
  { label: 'Spotify', url: 'https://open.spotify.com/artist/2bU5Ir70YHHuUnq2f3WCYl' },
  { label: 'YouTube', url: 'https://www.youtube.com/@belentani' },
] as const;

export default function PrensaPage() {
  return (
    <main className="min-h-screen bg-[#11100f] text-[#f2eee8]">
      <section className="border-b border-[#71665b]/35">
        <div className="mx-auto max-w-6xl px-6 pb-16 pt-20 sm:px-10 lg:pb-24 lg:pt-28">
          <p className="text-xs font-semibold uppercase tracking-[.25em] text-[#c6a789]">
            Belentani / Información para prensa
          </p>
          <h1 className="mt-8 font-serif text-[clamp(3.5rem,8vw,7rem)] leading-[.96] tracking-[-.06em]">
            Una obra hecha<br /><em className="font-normal text-[#d6bca0]">para ser escuchada.</em>
          </h1>
          <p className="mt-9 max-w-3xl text-xl leading-9 text-[#d7cfc5]">
            Información biográfica, contexto artístico y canales oficiales
            de Belentani para medios, colaboradores y oyentes.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-12 border-b border-[#71665b]/35 px-6 py-16 sm:px-10 lg:grid-cols-[.55fr_1.45fr] lg:py-24" aria-labelledby="bio-title">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[.25em] text-[#c6a789]">01 / Biografía</p>
          <h2 id="bio-title" className="mt-4 font-serif text-4xl sm:text-5xl">Belentani</h2>
        </div>
        <div className="max-w-3xl space-y-6 text-lg leading-9 text-[#d7cfc5]">
          <p>
            Belentani es un artista y compositor nacido en São Paulo y basado en Barcelona.
            Su música atraviesa el pop alternativo, el R&amp;B y la electrónica experimental.
          </p>
          <p>
            Su trabajo conecta composición, voz y narrativa visual. JUDAS EXPERIENCE
            desarrolla ese lenguaje como un universo artístico en el que las canciones,
            las imágenes y los espacios interactivos forman partes de una misma historia.
          </p>
          <p className="border-l-2 border-[#c6a789] pl-6 font-serif text-2xl leading-[1.4] text-[#f2eee8]">
            La tecnología amplía el escenario; la música permanece en el centro.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-12 border-b border-[#71665b]/35 px-6 py-16 sm:px-10 lg:grid-cols-[.55fr_1.45fr] lg:py-24" aria-labelledby="obra-prensa-title">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[.25em] text-[#c6a789]">02 / Obra seleccionada</p>
          <h2 id="obra-prensa-title" className="mt-4 font-serif text-4xl sm:text-5xl">Música y relato</h2>
        </div>
        <div>
          <p className="max-w-2xl text-lg leading-9 text-[#d7cfc5]">
            Entre sus canciones figuran <cite className="not-italic text-[#f2eee8]">Mon Amour</cite>,
            <cite className="not-italic text-[#f2eee8]"> Apaga a Luz</cite> y
            <cite className="not-italic text-[#f2eee8]"> Heart Breaking</cite>.
            JUDAS ERA explora el deseo, la traición, la deuda y la redención
            mediante una narrativa audiovisual.
          </p>
          <div className="mt-9 flex flex-wrap gap-8">
            <Link href="/musica" className="text-sm font-semibold uppercase tracking-[.12em] text-[#e8c7aa] underline decoration-[#88715b] underline-offset-8 hover:text-white">Explorar la música ↗</Link>
            <Link href="/judas-era" className="text-sm font-semibold uppercase tracking-[.12em] text-[#e8c7aa] underline decoration-[#88715b] underline-offset-8 hover:text-white">Conocer Judas Era ↗</Link>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-12 px-6 py-16 sm:px-10 lg:grid-cols-[.55fr_1.45fr] lg:py-24" aria-labelledby="contact-press-title">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[.25em] text-[#c6a789]">03 / Enlaces y contacto</p>
          <h2 id="contact-press-title" className="mt-4 font-serif text-4xl sm:text-5xl">Canales oficiales</h2>
        </div>
        <div>
          <p className="max-w-2xl text-lg leading-9 text-[#d7cfc5]">
            Encuentra la música y las publicaciones del artista en sus perfiles.
            Para consultas artísticas, utiliza su canal público de Instagram.
          </p>
          <ul className="mt-9 divide-y divide-[#71665b]/40 border-y border-[#71665b]/40">
            {officialProfiles.map((profile) => (
              <li key={profile.label}>
                <a href={profile.url} target="_blank" rel="noopener noreferrer"
                  className="flex min-h-16 items-center justify-between gap-4 py-4 font-serif text-2xl text-[#f2eee8] transition-colors hover:text-[#e8c7aa]">
                  {profile.label} <span className="text-sm" aria-hidden="true">↗</span>
                </a>
              </li>
            ))}
          </ul>
          <p className="mt-7 text-sm leading-7 text-[#bfb7ad]">
            Esta página contiene información pública verificada. No se ofrecen
            archivos de prensa, fotografías de licencia desconocida ni datos de contacto privados.
          </p>
        </div>
      </section>
    </main>
  );
}
