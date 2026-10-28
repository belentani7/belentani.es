import Link from 'next/link';

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
    <main className="mx-auto max-w-5xl px-6 py-20">
      <p className="font-mono text-xs tracking-[.32em] text-gold">BELENTANI · MÚSICA</p>
      <h1 className="mt-4 font-display text-4xl font-black tracking-[-.06em] md:text-6xl">Música</h1>
      <p className="mt-6 max-w-2xl text-xl leading-8 text-mute">
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

      <section className="mt-16 border-t border-border pt-10">
        <h2 className="font-display text-3xl font-black tracking-[-.04em]">Judas Era</h2>
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

      <section className="mt-16 border-t border-border pt-10">
        <h2 className="font-display text-3xl font-black tracking-[-.04em]">Herramientas y proyectos interactivos</h2>
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
