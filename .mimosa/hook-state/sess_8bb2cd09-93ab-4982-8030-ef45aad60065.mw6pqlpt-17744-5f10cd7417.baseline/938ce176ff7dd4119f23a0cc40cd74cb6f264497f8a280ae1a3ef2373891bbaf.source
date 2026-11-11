'use client';

import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import styles from './BelentaniHero.module.css';

const Cosmos = dynamic(() => import('../canvas/CanonCosmos'), { ssr: false });

/**
 * Primera viewport = una composición.
 * Marca arriba. Galaxia dominante. Una frase. Dos CTAs.
 * Sin dashboard, sin estaciones, sin terminal en la cara.
 */
export default function BelentaniHero() {
  const reduced = useReducedMotion();
  const [webgl, setWebgl] = useState(false);

  useEffect(() => {
    try {
      const c = document.createElement('canvas');
      setWebgl(Boolean(c.getContext('webgl2') || c.getContext('webgl')));
    } catch {
      setWebgl(false);
    }
  }, []);

  return (
    <main className={styles.page} data-testid="belentani-hero">
      <div className={styles.sky} aria-hidden>
        {webgl && !reduced ? (
          <div className={styles.cosmos}>
            <Cosmos calm={false} chapter={0} />
          </div>
        ) : (
          <div className={styles.fallback} />
        )}
        <div className={styles.scrim} />
      </div>

      <header className={styles.top}>
        <p className={styles.mark}>BELENTANI</p>
        <nav aria-label="Principal">
          <Link href="/musica">Música</Link>
          <Link href="/artista">Artista</Link>
          <Link href="/prensa">Contacto</Link>
        </nav>
      </header>

      <section className={styles.hero} aria-label="Belentani">
        <h1 className={styles.brand}>BELENTANI</h1>
        <p className={styles.line}>
          Artista y compositor. São Paulo → Barcelona.
          <br />
          Una voz. Un espejo. Una galaxia.
        </p>
        <div className={styles.ctas}>
          <Link className={styles.primary} href="/galaxia">
            Entrar en la galaxia
          </Link>
          <Link className={styles.ghost} href="/musica">
            Escuchar
          </Link>
        </div>
      </section>

      <footer className={styles.foot}>
        <span>Pop alternativo · R&amp;B · electrónica experimental</span>
        <Link href="/maquina">Archivo / máquina</Link>
      </footer>
    </main>
  );
}
