import type { Metadata } from 'next';
import Link from 'next/link';
import LoreEngine from './LoreEngine';
import styles from './lore.module.css';

export const metadata: Metadata = {
  title: 'JUDAS / El archivo vivo — BELENTANI',
  description: 'Entra en el universo narrativo de BELENTANI: música, espejo, llave, memoria y laboratorio de escenas original.',
  alternates: { canonical: '/lore' },
  openGraph: {
    title: 'BELENTANI — JUDAS / El archivo vivo',
    description: 'La música es una puerta. El relato continúa al otro lado.',
    url: 'https://belentani.es/lore',
    type: 'website',
  },
};

const chapters = [
  { number: '01', id: 'espejo', title: 'EL ESPEJO', eyebrow: 'IDENTIDAD / REFLEJO', text: 'Una imagen no siempre revela a quien la mira. En JUDAS, el reflejo es una pregunta abierta sobre identidad, deseo y representación.', detail: '¿Quién escribe la imagen que vemos?' },
  { number: '02', id: 'llave', title: 'LA LLAVE', eyebrow: 'ACCESO / ELECCIÓN', text: 'La llave no promete una respuesta automática: permite abrir una puerta y aceptar lo que cambia al cruzarla.', detail: 'No todos los umbrales conducen al mismo mundo.' },
  { number: '03', id: 'voz', title: 'LA VOZ', eyebrow: 'MÚSICA / MEMORIA', text: 'La voz atraviesa el universo: canciones, atmósferas y personajes conectan escenarios sin borrar sus contradicciones.', detail: 'La obra se escucha antes de explicarse.' },
] as const;

export default function LorePage() {
  return (
    <main className={styles.page} id="contenido">
      <a className={styles.skip} href="#capitulos">Saltar al relato</a>
      <div className={styles.stars} aria-hidden="true" />
      <header className={styles.topbar}>
        <Link href="/" className={styles.logo} aria-label="BELENTANI — Inicio">B<span>7</span> / BELENTANI</Link>
        <nav aria-label="Navegación de la obra" className={styles.navigation}>
          <Link href="/">GALAXIA</Link>
          <Link href="/artista">ARTISTA</Link>
          <Link href="/musica">MÚSICA</Link>
          <Link href="/studio-creativo">ESTUDIO</Link>
        </nav>
      </header>

      <section className={styles.hero} aria-labelledby="lore-title">
        <div className={styles.orb} aria-hidden="true"><div className={styles.halo} /><div className={styles.core}>VII</div></div>
        <div className={styles.heroCopy}>
          <p className={styles.eyebrow}>BELENTANI / THE JUDAS EXPERIENCE · ARCHIVO 001</p>
          <h1 id="lore-title">NO SIGAS<br />LA LUZ.<br /><em>ATRAVIÉSALA.</em></h1>
          <p className={styles.lead}>Un universo musical que se puede recorrer. El espejo, la llave y la voz son entradas a una narrativa abierta: São Paulo, Barcelona y una historia que continúa en cada canción.</p>
          <div className={styles.actions}>
            <a href="#capitulos" className={styles.primary}>ENTRAR EN EL LORE <span aria-hidden="true">↘</span></a>
            <Link href="/musica" className={styles.secondary}>ESCUCHAR LA OBRA <span aria-hidden="true">↗</span></Link>
          </div>
          <p className={styles.signal}>UNIVERSO ARTÍSTICO · EXPERIENCIA NAVEGABLE · SIN REGISTRO</p>
        </div>
        <span className={styles.vertical} aria-hidden="true">EL RELATO NO TERMINA EN LA PANTALLA</span>
      </section>

      <section id="capitulos" className={styles.chapters} aria-labelledby="chapters-title">
        <div className={styles.sectionHeading}><p className={styles.eyebrow}>SECUENCIA / 01—03</p><h2 id="chapters-title">Tres símbolos.<br /><em>Infinitas lecturas.</em></h2></div>
        <div className={styles.cards}>
          {chapters.map((chapter) => (
            <article className={styles.card} key={chapter.id} id={chapter.id}>
              <span className={styles.num}>{chapter.number} / JUDAS</span>
              <p className={styles.overline}>{chapter.eyebrow}</p>
              <h3>{chapter.title}</h3><p>{chapter.text}</p>
              <div className={styles.footnote}>{chapter.detail}</div>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.lab} id="laboratorio" aria-labelledby="lab-title">
        <div><p className={styles.eyebrow}>LABORATORIO / LOCAL FIRST</p><h2 id="lab-title">EL LORE RESPONDE<br />A TU IMAGINACIÓN.</h2><p>Combina un símbolo y una intención para recibir una escena original. Este instrumento es generativo y procedural; no envía tus ideas a servidores de IA.</p></div>
        <LoreEngine />
      </section>

      <section className={styles.bridge} aria-labelledby="bridge-title">
        <p className={styles.eyebrow}>UN ARTISTA · DISTINTOS PORTALES</p>
        <h2 id="bridge-title">LA MISMA VOZ.<br /><em>OTROS MUNDOS.</em></h2>
        <div className={styles.bridgeLinks}>
          <Link href="/">Explorar la galaxia <span aria-hidden="true">↗</span></Link>
          <Link href="/studio-creativo">Abrir el estudio creativo <span aria-hidden="true">↗</span></Link>
          <a href="https://judas-experience-v3.vercel.app" target="_blank" rel="noopener noreferrer">JUDAS EXPERIENCE · portal externo <span aria-hidden="true">↗</span></a>
          <a href="https://open.spotify.com/artist/2bU5Ir70YHHuUnq2f3WCYl" target="_blank" rel="noopener noreferrer">BELENTANI en Spotify <span aria-hidden="true">↗</span></a>
        </div>
      </section>
      <footer className={styles.footer}><Link href="/">B7 / BELENTANI</Link><span>OBRA ORIGINAL · SÃO PAULO ↔ BARCELONA</span><a href="#contenido">VOLVER ARRIBA ↑</a></footer>
    </main>
  );
}
