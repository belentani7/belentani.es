import type { Metadata } from 'next';
import Link from 'next/link';
import styles from './archive.module.css';

export const metadata: Metadata = {
  title: 'Archivo vivo de BELENTANI | Canciones, escenarios y mundos',
  description: 'Un recorrido por la música publicada y los universos en creación de BELENTANI. Ediciones anteriores preservadas; obras inéditas identificadas como tales.',
  alternates: { canonical: '/archivo' },
};

const works = [
  {
    year: '2020', kind: 'SINGLE PUBLICADO', title: 'Beautiful Skies',
    text: 'Una de las primeras coordenadas discográficas. La obra sigue siendo parte de la historia; no queda sustituida por los mundos posteriores.',
    href: '/musica', action: 'Explorar la discografía', status: 'published',
  },
  {
    year: '2023', kind: 'CANCIÓN PUBLICADA', title: 'Therapist / Terapeuta',
    text: 'Una nueva etapa de escritura personal. El catálogo escucha también lo que precede a JUDAS.',
    href: '/musica', action: 'Escuchar la obra', status: 'published',
  },
  {
    year: '2024', kind: 'ACTUACIÓN', title: 'Pride Barcelona',
    text: 'El encuentro entre voz y escenario. El registro distingue las actuaciones de los lanzamientos de estudio.',
    href: '/artista', action: 'Conocer al artista', status: 'live',
  },
  {
    year: '2026', kind: 'ERA NARRATIVA', title: 'JUDAS',
    text: 'Música, memoria, imagen y mundo digital. Una era de creación que no borra las anteriores.',
    href: '/judas-era', action: 'Entrar en JUDAS', status: 'project',
  },
  {
    year: '2026', kind: 'CUADERNO DE CREACIÓN', title: 'Cassandra',
    text: 'Una pieza concebida entre pop y elementos flamencos. Se conserva aquí como obra en desarrollo, no como lanzamiento confirmado.',
    href: '/studio-creativo', action: 'Explorar el estudio', status: 'draft',
  },
  {
    year: '2026', kind: 'CUADERNO DE CREACIÓN', title: 'O Avesso do Mar',
    text: 'Escritura en portugués y realismo mágico. Las versiones del texto pertenecen al archivo creativo hasta tener edición pública verificada.',
    href: '/studio-creativo', action: 'Explorar el estudio', status: 'draft',
  },
] as const;

export default function ArchivePage() {
  return (
    <main className={styles.page}>
      <a className={styles.skip} href="#obras">Saltar al archivo</a>
      <header className={styles.top}>
        <Link href="/" className={styles.return}>← BELENTANI OS</Link>
        <span>ARCHIVE DRIVE / 03.5</span>
        <Link href="/musica" className={styles.topMusic}>MÚSICA</Link>
      </header>

      <section className={styles.hero}>
        <p className={styles.eyebrow}>UNA VIDA / MUCHAS EDICIONES</p>
        <h1>La memoria también <em>tiene sonido.</em></h1>
        <p>Un archivo ordenado por obra, no por carpetas de código. Las canciones publicadas, los escenarios y los proyectos en creación conservan su propia identidad. Aquí una idea no se anuncia como lanzamiento hasta que lo sea.</p>
        <div className={styles.heroLinks}>
          <Link href="/musica">Escuchar la discografía</Link>
          <Link href="/lore">Atravesar el relato</Link>
        </div>
      </section>

      <section id="obras" className={styles.collection} aria-labelledby="archive-heading">
        <div className={styles.sectionTop}>
          <p>CATÁLOGO / EDICIÓN DOCUMENTADA</p>
          <h2 id="archive-heading">Obra y proceso</h2>
          <span>{works.length} entradas seleccionadas</span>
        </div>
        <div className={styles.works}>
          {works.map((work, index) => (
            <article className={styles.work} key={work.title} data-status={work.status}>
              <div className={styles.workMeta}>
                <span>{String(index + 1).padStart(2, '0')} / {work.year}</span>
                <span>{work.kind}</span>
              </div>
              <div className={styles.workBody}>
                <h3>{work.title}</h3>
                <p>{work.text}</p>
                <Link href={work.href}>{work.action} <span aria-hidden="true">↗</span></Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <aside className={styles.closing}>
        <p>THE ARCHIVE IS NOT THE ARTIST.</p>
        <h2>El artista continúa.</h2>
        <p>El código conserva versiones. La música es la obra. Para escuchar, vuelve al repertorio; para viajar, entra en los mundos.</p>
        <div>
          <Link href="/musica">Música</Link>
          <Link href="/galaxia">Mundos</Link>
          <Link href="/">Ordenador</Link>
        </div>
      </aside>
      <footer className={styles.footer}>BELENTANI / ARCHIVO VIVO / PUBLICADO ≠ EN DESARROLLO</footer>
    </main>
  );
}
