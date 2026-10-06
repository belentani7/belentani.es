'use client';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { Component, useEffect, useState, type ReactNode } from 'react';
import { useExperienceStore } from '@/store/experienceStore';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import styles from './JudasEraShell.module.css';

const Cosmos = dynamic(() => import('../canvas/CanonCosmos'), { ssr: false });
const chapters = [
  { title: 'Génesis', symbol: '01', line: 'Antes del nombre, la voz.', text: 'Antes del nombre hubo un cuerpo sin voz. Antes del cuerpo, un espejo en la arena.' },
  { title: 'Traición', symbol: '02', line: 'El espejo devuelve la mirada.', text: 'Aprendió a cantar y entendió el daño que llevaba. El narrador deja de esconderse: el antihéroe también era él.' },
  { title: 'La deuda', symbol: '03', line: 'Hay puertas que no se olvidan.', text: 'Una llave, un lugar vacío y la promesa de volver. Queda una deuda que ninguna despedida consigue cerrar.' },
  { title: 'Redención', symbol: '04', line: 'Vete tranquilo, pero recuérdame.', text: 'La herida no desaparece. Cambia la forma de llevarla. El final no absuelve: deja una voz.' },
];
class SceneBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() { return this.state.failed ? null : this.props.children; }
}

export default function JudasEraShell() {
  const state = useExperienceStore();
  const reduced = useReducedMotion();
  const [chapter, setChapter] = useState(0);
  const [paused, setPaused] = useState(false);
  const [webgl, setWebgl] = useState(false);
  useEffect(() => {
    const canvas = document.createElement('canvas');
    try { setWebgl(Boolean(canvas.getContext('webgl2') || canvas.getContext('webgl'))); } catch { setWebgl(false); }
  }, []);
  const select = (index: number) => { setChapter(index); state.travelTo('judas-era', 'judas-canon'); };
  return <main className={styles.shell}>
    <section className={styles.stage} aria-label="Judas Era">
      <div className={styles.cosmos} aria-label="Galaxia de Judas" role="img">
        {webgl && <SceneBoundary><Cosmos calm={reduced || paused} chapter={chapter} /></SceneBoundary>}
      </div>
      <header className={styles.header}>
        <Link className={styles.brand} href="/">BELENTANI<span>THE EXPERIENCE</span></Link>
        <nav aria-label="Universo artístico"><Link href="/">Máquina</Link><Link href="/artist">Artista</Link><Link href="/musica">Música</Link><Link href="/prensa">Contacto</Link></nav>
      </header>
      <div className={styles.coordinates}><span>ERA: JUDAS / CANON 0</span><span>SYSTEM: {state.currentSystem.toUpperCase()}</span></div>
      {!state.isImmersiveMode && <div className={styles.title}><p>Belentani: The Experience</p><h1>JUDAS ERA</h1><p>Una voz. Un espejo. Una deuda.</p></div>}
      <div className={styles.controls}>
        <button title={paused ? 'Reanudar movimiento' : 'Pausar movimiento'} aria-label={paused ? 'Reanudar movimiento' : 'Pausar movimiento'} aria-pressed={paused} onClick={() => setPaused(!paused)}>{paused ? '▷' : 'Ⅱ'}</button>
        <button title="Modo inmersivo" aria-label="Modo inmersivo" aria-pressed={state.isImmersiveMode} onClick={state.toggleImmersiveMode}>⛶</button>
        <button title="Reset to Canon 0" aria-label="Reset to Canon 0" onClick={() => { state.resetToCanon(); setChapter(0); }}>↺</button>
      </div>
      <div className={styles.bottom}>
        <div className={styles.chapterIntro} aria-live="polite"><span>CAPÍTULO {chapters[chapter].symbol}</span><h2>{chapters[chapter].line}</h2></div>
        <nav className={styles.chapters} aria-label="Capítulos de Judas">
          {chapters.map((item, index) => <button key={item.symbol} aria-pressed={chapter === index} onClick={() => select(index)}><span>{item.symbol}</span>{item.title}</button>)}
        </nav>
      </div>
    </section>
    <section className={styles.story} aria-live="polite">
      <p>JUDAS / {chapters[chapter].symbol}</p><div><h2>{chapters[chapter].title}</h2><p>{chapters[chapter].text}</p>
      <div className={styles.storyActions}><button disabled={chapter === 0} onClick={() => select(chapter - 1)}>Anterior</button><button disabled={chapter === chapters.length - 1} onClick={() => select(chapter + 1)}>Siguiente capítulo</button></div></div>
    </section>
    <footer className={styles.footer}><span>Belentani · São Paulo / Barcelona</span><a href="https://judas-experience-13898.buildaispace.app/" target="_blank" rel="noopener noreferrer">Judas Experience · Archivo original ↗</a></footer>
  </main>;
}
