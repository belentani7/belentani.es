'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { VOYAGE_PLACES } from '@/lib/voyage-places';
import styles from './GalaxyVoyage.module.css';

const VoyageMap = dynamic(() => import('./VoyageMap').then((module) => module.VoyageMap), { ssr: false });

function supportsWebGL() {
  try {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('webgl2') || canvas.getContext('webgl');
    if (!context) return false;
    context.getExtension('WEBGL_lose_context')?.loseContext();
    return true;
  } catch {
    return false;
  }
}

/** Navegación libre y rutas publicables; cada planeta es un destino interno. */
export default function GalaxyVoyage() {
  const [webgl, setWebgl] = useState(false);
  const [selectedId, setSelectedId] = useState(VOYAGE_PLACES[0].id);
  const [focusId, setFocusId] = useState<string | null>(null);
  const [resetToken, setResetToken] = useState(0);
  const selected = VOYAGE_PLACES.find((place) => place.id === selectedId) ?? VOYAGE_PLACES[0];

  useEffect(() => setWebgl(supportsWebGL()), []);
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.altKey || event.ctrlKey || event.metaKey || event.target instanceof HTMLInputElement) return;
      if (event.key === 'Escape') {
        setFocusId(null);
        setResetToken((value) => value + 1);
      }
      if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return;
      event.preventDefault();
      const index = VOYAGE_PLACES.findIndex((place) => place.id === selectedId);
      const next = (index + (event.key === 'ArrowRight' ? 1 : -1) + VOYAGE_PLACES.length) % VOYAGE_PLACES.length;
      setSelectedId(VOYAGE_PLACES[next].id);
      setFocusId(VOYAGE_PLACES[next].id);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [selectedId]);

  const select = (id: string) => {
    setSelectedId(id);
    setFocusId(id);
  };
  const overview = () => {
    setFocusId(null);
    setResetToken((value) => value + 1);
  };

  return (
    <main className={styles.voyage}>
      <a className={styles.skip} href="#destinos">Saltar a la lista de destinos</a>
      <div className={styles.scene} aria-hidden="true">
        {webgl
          ? <VoyageMap places={VOYAGE_PLACES} currentId={selectedId} onSelect={select}
              interactive focusId={focusId} resetToken={resetToken} />
          : <div className={styles.fallback} />}
      </div>
      <div className={styles.vignette} aria-hidden="true" />
      <header className={styles.header}>
        <Link href="/" className={styles.brand}>B<span>7</span>.</Link>
        <span className={styles.headerName}>BELENTANI / ATLAS VIVO</span>
        <Link href="/" className={styles.return}>VOLVER A LA OBRA <span aria-hidden="true">↗</span></Link>
      </header>
      <section className={styles.intro} aria-labelledby="voyage-title">
        <p className={styles.kicker}>01 / UNIVERSO NAVEGABLE · {String(VOYAGE_PLACES.length).padStart(2, '0')} SISTEMAS</p>
        <h1 id="voyage-title">ATRAVIESA<br /><em>LA GALAXIA.</em></h1>
        <p>Un mapa vivo de la obra, la música y los mundos que nacieron a su alrededor. Elige un planeta; la nave irá contigo.</p>
        <div className={styles.actions}>
          <button type="button" onClick={overview}>VISTA GENERAL <span aria-hidden="true">◎</span></button>
          <span>ARRASTRA PARA ORBITAR · RUEDA PARA ACERCAR · FLECHAS PARA VIAJAR</span>
        </div>
      </section>
      <aside className={styles.active} aria-live="polite" style={{ ['--system-color' as string]: selected.accent }}>
        <span className={styles.activeLabel}>TRANSMISIÓN / {String(VOYAGE_PLACES.indexOf(selected) + 1).padStart(2, '0')}</span>
        <strong>{selected.title}</strong>
        <p>{selected.tagline}</p>
        <Link href={selected.url!}>ENTRAR EN ESTE MUNDO <span aria-hidden="true">↗</span></Link>
      </aside>
      <nav id="destinos" className={styles.destinations} aria-label="Sistemas de la galaxia">
        <span className={styles.destinationsHeading}>DESTINOS / SELECCIONA UN PLANETA</span>
        <div className={styles.destinationList}>
          {VOYAGE_PLACES.map((place, index) => (
            <button key={place.id} type="button" aria-pressed={selectedId === place.id}
              onClick={() => select(place.id)} style={{ ['--system-color' as string]: place.accent }}>
              <span>{String(index + 1).padStart(2, '0')}</span><i aria-hidden="true" />{place.title}
            </button>
          ))}
        </div>
      </nav>
      <div className={styles.coordinates} aria-hidden="true">B7 // SÃO PAULO ↔ BARCELONA <span>✦</span> EL LORE MANDA</div>
    </main>
  );
}
