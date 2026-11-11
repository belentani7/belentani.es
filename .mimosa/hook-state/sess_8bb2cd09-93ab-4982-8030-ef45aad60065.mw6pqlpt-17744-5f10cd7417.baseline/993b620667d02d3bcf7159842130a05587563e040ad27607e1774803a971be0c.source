import Link from 'next/link';
import styles from './NeonEdition.module.css';

const stages = [
  { number: '01', label: 'INPUT', title: 'La señal', body: 'Una fractura atraviesa el sistema. El relato empieza cuando alguien decide escucharla.' },
  { number: '02', label: 'DATA', title: 'El archivo', body: 'La memoria conserva las piezas sin confundir la máscara de JUDAS con la vida del artista.' },
  { number: '03', label: 'OUTPUT', title: 'La voz', body: 'La tensión se convierte en canción, imagen y movimiento. La voz permanece en el centro.' },
  { number: '04', label: 'HACK', title: 'La puerta', body: 'La llave no resuelve la obra. Abre una nueva forma de atravesarla.' },
] as const;

export default function NeonPage() {
  return <main className={styles.neon}>
    <a className={styles.skip} href="#era">Saltar a la era</a>
    <div className={styles.scan} aria-hidden="true" />
    <header className={styles.header}>
      <Link className={styles.brand} href="/">BELENTANI<span> / NEON</span></Link>
      <nav aria-label="Rutas del universo"><Link href="/artista">ARTISTA</Link><Link href="/musica">MÚSICA</Link><Link href="/judas">JUDAS</Link></nav>
    </header>

    <section className={styles.hero} aria-labelledby="neon-title">
      <div className={styles.beacon} aria-hidden="true"><i /><i /><i /></div>
      <div className={styles.heroText}>
        <p>EDICIÓN VISUAL / SEÑAL ROJA</p>
        <h1 id="neon-title">BELENTANI<br /><em>JUDAS ERA</em></h1>
        <div className={styles.heroLine}><span>CRISTAL</span><span>VOZ</span><span>ZION</span></div>
        <p>Una ciencia ficción emocional. El neón, el espejo y la voz comparten el mismo pulso; JUDAS es una máscara dramática y la autoría permanece en el centro.</p>
        <div className={styles.actions}><Link href="/judas">ENTRAR EN JUDAS ↗</Link><a href="#era">LEER LA SEÑAL ↓</a></div>
      </div>
      <span className={styles.corner}>B7 / 2026 · EDICIÓN LIGERA</span>
    </section>

    <section id="era" className={styles.era} aria-labelledby="era-title">
      <span className={styles.kicker}>01 / EL CONCEPTO</span>
      <h2 id="era-title">LA HERIDA SE CONVIERTE<br /><em>EN ARQUITECTURA VIVA.</em></h2>
      <div className={styles.eraCopy}><p>Esta edición condensa la obra en texto, color y recorrido. Permite entrar sin cargar vídeo ni WebGL y conserva la puerta a la experiencia inmersiva.</p><p>La Era JUDAS es ficción simbólica. Sus objetos ordenan una estética de tensión, memoria y poder creativo; no sustituyen al autor.</p></div>
      <ol className={styles.stages}>{stages.map((stage) => <li key={stage.number}><span>{stage.number} / {stage.label}</span><strong>{stage.title}</strong><p>{stage.body}</p></li>)}</ol>
    </section>

    <section className={styles.objects} aria-labelledby="objects-title">
      <span className={styles.kicker}>02 / OBJETOS EN ÓRBITA</span>
      <h2 id="objects-title">TRES FORMAS.<br /><em>UNA MISMA VOZ.</em></h2>
      <div className={styles.objectGrid}>
        <article><div className={styles.orb} aria-hidden="true" /><span>01 / PLANETA</span><h3>El lugar</h3><p>Un mundo alrededor de una canción.</p><Link href="/galaxia">ATRAVESAR LA GALAXIA ↗</Link></article>
        <article><div className={styles.crystal} aria-hidden="true" /><span>02 / DIAMANTE</span><h3>La memoria</h3><p>Lo que parece sólido cambia con la luz.</p><Link href="/judas">VER LOS CAPÍTULOS ↗</Link></article>
        <article><div className={styles.key} aria-hidden="true" /><span>03 / LLAVE</span><h3>La decisión</h3><p>La cerradura se puede rediseñar.</p><Link href="/unificado">ABRIR EL CÓDICE ↗</Link></article>
      </div>
    </section>

    <footer className={styles.footer}><strong>BELENTANI<span>.</span></strong><p>LA VOZ PERMANECE</p><Link href="/">VOLVER AL UNIVERSO ↗</Link></footer>
  </main>;
}
