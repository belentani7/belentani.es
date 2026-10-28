import Image from 'next/image';
import Link from 'next/link';

export default function ArtistaPage() {
  return (
    <main className="relative isolate min-h-screen overflow-hidden bg-[#030207] text-ink">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 opacity-95" style={{background:"radial-gradient(ellipse at 72% 10%,rgba(255,0,59,.25),transparent 40%),radial-gradient(ellipse at 10% 35%,rgba(225,238,255,.13),transparent 38%),radial-gradient(ellipse at 70% 80%,rgba(255,16,76,.18),transparent 40%)"}} />
      <section className="mx-auto grid max-w-7xl gap-10 px-6 py-16 lg:grid-cols-[0.92fr_1.08fr] lg:px-10 lg:py-24">
        <div className="hud-glass relative overflow-hidden rounded-[2rem] border border-[#ff1744]/60 bg-black/50 shadow-[0_0_80px_rgba(255,0,54,.23)]">
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
            <article className="hud-glass rounded-2xl border border-[#ff1744]/30 bg-black/40 p-5">
              <p className="font-mono text-[10px] tracking-[.26em] text-red">JUDAS ERA</p>
              <p className="mt-3 text-lg leading-7 text-mute">
                Un mito audiovisual de espejo, llave, diamante y máquina. La traición se convierte en input; la voz queda.
              </p>
            </article>
            <article className="hud-glass rounded-2xl border border-white/20 bg-black/40 p-5">
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

      <section className="relative mx-auto max-w-7xl px-6 pb-16 lg:px-10" aria-labelledby="ecosistema-titulo">
        <div className="hud-glass rounded-[2rem] border border-[#ff1a4e]/35 bg-black/55 p-6 md:p-10">
          <p className="font-mono text-xs uppercase tracking-[.32em] text-[#ff6685]">TRANSMISIÓN / ESTACIÓN CENTRAL</p>
          <h2 id="ecosistema-titulo" className="mt-3 font-display text-3xl font-black tracking-tight md:text-5xl">EL UNIVERSO ESTÁ <span className="text-[#ff365d]">VIVO.</span></h2>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-[#d7ced5]">
            De São Paulo a Barcelona: música independiente, voz, movimiento y narrativa audiovisual.
            Desde el primer sencillo hasta JUDAS EXPERIENCE, cada canción abre una habitación del mismo cosmos.
            Las interfaces son instrumentos: experimenta, crea y transforma el universo sin instalar nada.
          </p>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {[
              {title:'PILOTAR LA GALAXIA',caption:'Planetas navegables · cámara orbital · viaje inmersivo',url:'/galaxia',number:'01'},
              {title:'LABORATORIO VIVO',caption:'Herramientas de texto, imagen, código y prompts; resultados utilizables',url:'/lab',number:'02'},
              {title:'EL UNIVERSO JUDAS',caption:'Mundos narrativos · símbolos · experiencias interactivas',url:'/judas',number:'03'},
            ].map((experience) => (
              <Link key={experience.url} href={experience.url}
                className="group relative block min-h-52 overflow-hidden rounded-2xl border border-[#ff365d]/45 bg-gradient-to-br from-[#2b0612]/70 via-black/65 to-[#090812] p-6 shadow-[inset_0_1px_0_rgba(255,255,255,.16)] transition duration-300 hover:-translate-y-1 hover:border-[#ff456a] hover:shadow-[0_0_35px_rgba(255,0,64,.3)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ffe0e9]">
                <span className="font-mono text-xs tracking-[.28em] text-[#ff6b89]">{experience.number} / ENTRAR ↗</span>
                <h3 className="mt-5 font-display text-xl font-bold text-white">{experience.title}</h3>
                <p className="mt-3 text-base leading-6 text-[#d3c4ca]">{experience.caption}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-24 lg:px-10" aria-labelledby="sonidos-titulo">
        <div className="grid items-start gap-8 md:grid-cols-[.8fr_1.2fr]">
          <div>
            <p className="font-mono text-xs tracking-[.32em] text-[#ff6382]">CATÁLOGO / VOZ</p>
            <h2 id="sonidos-titulo" className="mt-3 font-display text-3xl font-black md:text-5xl">LA MÚSICA ES<br />LA PUERTA.</h2>
            <p className="mt-5 max-w-lg text-lg text-[#d0c4cd]">
              Pop oscuro, R&amp;B, electrónica y experimentación vocal. Escucha las canciones en los canales oficiales.
            </p>
            <Link href="/musica" className="mt-7 inline-flex min-h-12 items-center rounded-xl border border-[#ff365d] bg-[#ff1744]/15 px-6 font-mono text-xs tracking-widest text-white transition hover:bg-[#ff1744]/25">EXPLORAR LA MÚSICA ↗</Link>
          </div>
          <ul className="grid gap-3 sm:grid-cols-2">
            {['Mon Amour', 'Apaga a Luz', 'Heart Breaking', 'Mon Amour (Remix 404 API Key not found)'].map((song, index) => (
              <li key={song} className="hud-glass rounded-2xl border border-white/15 bg-black/55 p-5">
                <span className="font-mono text-xs tracking-widest text-[#ff6889]">{String(index+1).padStart(2,'0')} / BELENTANI</span>
                <h3 className="mt-3 text-lg font-bold text-white">{song}</h3>
                <a className="mt-4 inline-block font-mono text-xs text-[#ff9db3] underline underline-offset-4 hover:text-white" href="https://open.spotify.com/artist/2bU5Ir70YHHuUnq2f3WCYl" target="_blank" rel="noopener noreferrer" aria-label={"Abrir el perfil musical oficial para escuchar "+song}>ESCUCHAR EN SPOTIFY ↗</a>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}
