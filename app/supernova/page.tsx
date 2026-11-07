import type { Metadata } from 'next';
import Link from 'next/link';
import { SupernovaScene } from '@/components/voyage/SupernovaScene';
import styles from '../lore/lore.module.css';

export const metadata: Metadata = {
  title: 'La Supernova — Estrella que muere para dar luz · BELENTANI',
  description: 'Antes de la deuda impagable, hubo una estrella que colapsó. Su luz no se apagó: se convirtió en la clave que abre el candado. La muerte de una estrella es el nacimiento de la voz.',
  alternates: { canonical: '/supernova' },
  openGraph: {
    title: 'BELENTANI — La Supernova',
    description: 'La muerte de una estrella es el nacimiento de la voz. Estación 04 del canon Judas.',
    url: 'https://belentani.es/supernova',
    type: 'website',
  },
};

export default function SupernovaPage() {
  return (
    <main className={styles.page} id="contenido">
      <a className={styles.skip} href="#supernova">Saltar a la supernova</a>
      <div className={styles.stars} aria-hidden="true" />
      <header className={styles.topbar}>
        <Link href="/" className={styles.logo} aria-label="BELENTANI — Inicio">B<span>7</span> / BELENTANI</Link>
        <nav aria-label="Navegación de la obra" className={styles.navigation}>
          <Link href="/">GALAXIA</Link>
          <Link href="/lore">LORE</Link>
          <Link href="/artista">ARTISTA</Link>
          <Link href="/musica">MÚSICA</Link>
        </nav>
      </header>

      <section className={styles.hero} aria-labelledby="supernova-title">
        <div className={styles.orb} aria-hidden="true"><div className={styles.halo} /><div className={styles.core}>SN</div></div>
        <div className={styles.heroCopy}>
          <p className={styles.eyebrow}>BELENTANI / THE JUDAS EXPERIENCE · ESTACIÓN 04</p>
          <h1 id="supernova-title">LA SUPERNOVA<br /><em>ESTRELLA QUE MUERE PARA DAR LUZ</em></h1>
          <p className={styles.lead}>Antes de la deuda impagable, hubo una estrella que colapsó. Su luz no se apagó: se convirtió en la clave que abre el candado. La muerte de una estrella es el nacimiento de la voz. El antihéroe no nace de la calma: nace de la explosión.</p>
          <div className={styles.actions}>
            <a href="#escena" className={styles.primary}>VER LA SUPERNOVA <span aria-hidden="true">↘</span></a>
            <Link href="/lore" className={styles.secondary}>VOLVER AL LORE <span aria-hidden="true">↗</span></Link>
          </div>
          <p className={styles.signal}>UNIVERSO ARTÍSTICO · EXPERIENCIA NAVEGABLE · SIN REGISTRO</p>
        </div>
        <span className={styles.vertical} aria-hidden="true">LA MUERTE DE UNA ESTRELLA ES EL NACIMIENTO DE LA VOZ</span>
      </section>

      <section id="escena" className={styles.lab} aria-labelledby="supernova-scene-title">
        <div>
          <p className={styles.eyebrow}>ESCENA 04 / SUPERNOVA</p>
          <h2 id="supernova-scene-title">COLAPSO ESTELAR · NACIMIENTO DE LA VOZ</h2>
          <p>Una estrella masiva agota su combustible. El núcleo de hierro colapsa. La explosión expulsa capas externas a 10 000 km/s. En el remanente queda una estrella de neutrones o un agujero negro. La luz viaja durante siglos hasta que alguien la ve.</p>
        </div>
        <SupernovaScene />
      </section>

      <section className={styles.bridge} aria-labelledby="bridge-title">
        <p className={styles.eyebrow}>EL ARCO JUDAS</p>
        <h2 id="bridge-title">DE LA SUPERNOVA A LA DEUDA</h2>
        <div className={styles.bridgeLinks}>
          <Link href="/lore#espejo">01 · El Espejo <span aria-hidden="true">↗</span></Link>
          <Link href="/lore#llave">02 · La Llave <span aria-hidden="true">↗</span></Link>
          <Link href="/lore#supernova">03 · La Supernova <span aria-hidden="true">↗</span></Link>
          <Link href="/lore#voz">04 · La Voz <span aria-hidden="true">↗</span></Link>
          <a href="https://open.spotify.com/artist/2bU5Ir70YHHuUnq2f3WCYl" target="_blank" rel="noopener noreferrer">BELENTANI en Spotify <span aria-hidden="true">↗</span></a>
        </div>
      </section>
      <footer className={styles.footer}><Link href="/">B7 / BELENTANI</Link><span>OBRA ORIGINAL · SÃO PAULO ↔ BARCELONA</span><a href="#contenido">VOLVER ARRIBA ↑</a></footer>
    </main>
  );
}
