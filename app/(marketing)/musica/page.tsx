import Link from 'next/link';

const CANCIONES = [
  'Mon Amour',
  'Apaga a Luz',
  'Heart Breaking',
] as const;


const ESTACIONES = [
  { n: '01', nombre: 'Génesis', texto: 'El origen de la voz.' },
  { n: '02', nombre: 'La Invitación', texto: 'La puerta que se abre sola.' },
  { n: '03', nombre: 'El Exceso', texto: 'Demasiado brillo, demasiado ruido.' },
  { n: '04', nombre: 'Traición', texto: 'La traición se convierte en input; la voz queda.' },
  { n: '05', nombre: 'La Deuda', texto: 'Lo que se paga con la propia historia.' },
  { n: '06', nombre: 'Redención', texto: 'El cierre de la era y el inicio de la siguiente.' },
];

const PLATAFORMAS = [
  { nombre: 'Spotify', url: 'https://open.spotify.com/artist/2bU5Ir70YHHuUnq2f3WCYl' },
  { nombre: 'YouTube', url: 'https://www.youtube.com/@belentani' },
];

const HERRAMIENTAS = [
  { nombre: 'Galaxia', ruta: '/galaxia', texto: 'Viaja por el universo de Belentani, planeta a planeta.' },
  { nombre: 'Judas', ruta: '/judas', texto: 'El mito audiovisual completo, capítulo a capítulo.' },
  { nombre: 'Neon', ruta: '/neon', texto: 'La escena neón de la obra.' },
  { nombre: 'Máquina', ruta: '/maquina', texto: 'Un sistema interactivo de la obra.' },
];

export default function MusicaPage() {
  return (
    <main className="relative mx-auto min-h-screen max-w-7xl overflow-hidden bg-[#0a0709] px-6 pb-24 pt-16 text-[#f4eee9] sm:px-10 lg:px-14 lg:pt-24">
      <p className="font-mono text-xs uppercase tracking-[.32em] text-[#ff9aa8]">BELENTANI / OBRA MUSICAL</p>
      <h1 className="mt-5 max-w-4xl font-serif text-[clamp(3.7rem,9vw,7.8rem)] font-normal leading-[.95] tracking-[-.065em]">La voz es el <em className="font-normal text-[#ef7184]">origen.</em></h1>
      <p className="mt-8 max-w-2xl text-xl leading-9 text-[#d5c8cd]">
        Pop oscuro, R&amp;B alternativo y electrónica experimental. La voz es el origen; Judas Era, el universo
        narrativo que la sostiene.
      </p>

      <div className="mt-10 flex flex-wrap gap-4 font-mono text-xs tracking-[.18em]">
        {PLATAFORMAS.map((p) => (
          <a
            key={p.nombre}
            href={p.url}
            target="_blank"
            rel="noopener noreferrer"
            className="border border-red bg-red px-5 py-3 text-void transition hover:border-gold hover:bg-gold"
          >
            {p.nombre.toUpperCase()} ↗
          </a>
        ))}
      </div>


      <section
        aria-labelledby="canciones-publicadas"
        className="relative mt-16 overflow-hidden border-y border-[#9b3944]/40 bg-[linear-gradient(135deg,rgba(80,8,22,.25),rgba(9,7,12,.92)_60%)] px-5 py-12 shadow-[inset_0_1px_rgba(255,255,255,.07)] sm:px-9 lg:mt-24 lg:py-16"
      >
        <div aria-hidden="true" className="pointer-events-none absolute right-0 top-0 h-48 w-48 rounded-full bg-[#ff2244]/10 blur-3xl" />
        <div className="relative grid gap-10 lg:grid-cols-[.72fr_1.28fr] lg:gap-16">
          <div>
            <p className="font-mono text-xs uppercase tracking-[.25em] text-[#ff9aa8]">01 / Música publicada</p>
            <h2 id="canciones-publicadas" className="mt-5 max-w-sm font-serif text-4xl leading-[1.08] tracking-[-.045em] text-[#fff5f0] sm:text-5xl">
              Canciones antes que interfaces.
            </h2>
            <p className="mt-6 max-w-sm text-base leading-8 text-[#cdbfc2]">
              Estas son algunas de las grabaciones de Belentani. Escúchalas desde los perfiles oficiales:
              aquí no se simulan reproductores ni se anuncian canciones inexistentes.
            </p>
          </div>
          <ol className="relative border-t border-white/20">
            {CANCIONES.map((titulo, index) => (
              <li key={titulo} className="group flex min-h-24 items-center gap-5 border-b border-white/15 py-6 sm:gap-8">
                <span className="w-8 shrink-0 font-mono text-xs tabular-nums tracking-widest text-[#ff9aa8]">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <h3 className="font-serif text-2xl leading-tight tracking-[-.02em] text-[#fff5f0] transition-colors group-hover:text-[#ffacb8] sm:text-4xl">
                  {titulo}
                </h3>
                <span aria-hidden="true" className="ml-auto font-mono text-xs text-[#cd9fa4]">BELENTANI</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section aria-labelledby="judas-era-musica" className="mt-20 border-t border-[#76333c]/50 pt-12">
        <h2 id="judas-era-musica" className="font-serif text-4xl font-normal tracking-[-.04em] text-[#fff5f0] sm:text-5xl">Judas Era</h2>
        <p className="mt-3 max-w-2xl text-lg leading-7 text-mute">Seis estaciones de una misma voz.</p>
        <ol className="mt-8 grid gap-4 md:grid-cols-2">
          {ESTACIONES.map((e) => (
            <li key={e.n} className="rounded-2xl border border-red/20 bg-white/[.025] p-5">
              <p className="font-mono text-[10px] tracking-[.26em] text-red">{e.n}</p>
              <h3 className="mt-2 text-xl font-bold">{e.nombre}</h3>
              <p className="mt-2 leading-7 text-mute">{e.texto}</p>
            </li>
          ))}
        </ol>
        <Link
          href="/judas-era"
          className="mt-8 inline-block border border-border px-5 py-3 font-mono text-xs tracking-[.18em] text-red transition hover:border-gold hover:text-gold"
        >
          ENTRAR EN LA ERA ↗
        </Link>
      </section>

      <section aria-labelledby="mundos-interactivos" className="mt-20 border-t border-[#76333c]/50 pt-12">
        <h2 id="mundos-interactivos" className="font-serif text-4xl font-normal tracking-[-.04em] text-[#fff5f0] sm:text-5xl">Mundos interactivos</h2>
        <p className="mt-3 max-w-2xl text-lg leading-7 text-mute">
          La obra también vive en la web: escenas y sistemas que puedes recorrer.
        </p>
        <ul className="mt-8 grid gap-4 md:grid-cols-2">
          {HERRAMIENTAS.map((h) => (
            <li key={h.ruta}>
              <Link
                href={h.ruta}
                className="block rounded-2xl border border-gold/25 bg-white/[.025] p-5 transition hover:border-gold"
              >
                <p className="font-mono text-[10px] tracking-[.26em] text-gold">{h.nombre.toUpperCase()} ↗</p>
                <p className="mt-2 leading-7 text-mute">{h.texto}</p>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
