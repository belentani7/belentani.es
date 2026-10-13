'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useEffect, useRef, useState, type ChangeEvent } from 'react';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { WORLDS, findWorld, type World } from './worlds';
import styles from './LegacyHub.module.css';

const LegacyScene = dynamic(() => import('./LegacyScene'), { ssr: false });

function supportsWebGL(): boolean {
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

export default function LegacyHub() {
  const [selected, setSelected] = useState<World['id']>('judas');
  const [webgl, setWebgl] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string>();
  const [audioName, setAudioName] = useState('');
  const [audioError, setAudioError] = useState('');
  const audioElement = useRef<HTMLAudioElement>(null);
  const contextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationRef = useRef<number | null>(null);
  const energy = useRef(0);
  const reduced = useReducedMotion();
  const world = findWorld(selected) ?? WORLDS[0];

  useEffect(() => setWebgl(supportsWebGL()), []);
  useEffect(() => () => {
    if (animationRef.current !== null) cancelAnimationFrame(animationRef.current);
    if (contextRef.current) void contextRef.current.close();
  }, []);
  useEffect(() => () => { if (audioUrl) URL.revokeObjectURL(audioUrl); }, [audioUrl]);

  function chooseAudio(event: ChangeEvent<HTMLInputElement>) {
    const file = event.currentTarget.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('audio/') && !/\.(wav|mp3|flac|aif|aiff|ogg|m4a)$/i.test(file.name)) {
      setAudioError('Selecciona un archivo de audio compatible con tu navegador.');
      event.currentTarget.value = '';
      return;
    }
    audioElement.current?.pause();
    energy.current = 0;
    setAudioError('');
    setAudioName(file.name);
    setAudioUrl(URL.createObjectURL(file));
    event.currentTarget.value = '';
  }

  async function connectAudio() {
    const element = audioElement.current;
    if (!element) return;
    try {
      if (!contextRef.current) {
        const context = new AudioContext();
        const analyser = context.createAnalyser();
        analyser.fftSize = 256;
        context.createMediaElementSource(element).connect(analyser);
        analyser.connect(context.destination);
        contextRef.current = context;
        analyserRef.current = analyser;
      }
      await contextRef.current.resume();
      const analyser = analyserRef.current;
      if (!analyser || animationRef.current !== null) return;
      const data = new Uint8Array(analyser.frequencyBinCount);
      const sample = () => {
        analyser.getByteFrequencyData(data);
        const average = data.reduce((sum, value) => sum + value, 0) / data.length;
        energy.current += (Math.min(1, average / 110) - energy.current) * 0.16;
        animationRef.current = requestAnimationFrame(sample);
      };
      sample();
    } catch {
      setAudioError('El motor de audio no está disponible en este navegador.');
    }
  }

  function stopAudioAnalysis() {
    if (animationRef.current !== null) cancelAnimationFrame(animationRef.current);
    animationRef.current = null;
    energy.current = 0;
  }

  return (
    <main className={styles.hub}>
      <a className={styles.skip} href="#worlds">Saltar a los destinos</a>
      <div className={styles.grain} aria-hidden="true" />
      <header className={styles.header}>
        <Link href="/" className={styles.brand} aria-label="Belentani, inicio">B<span>7</span><i>.</i></Link>
        <div className={styles.headerCenter}>BELENTANI <span>/</span> UNIVERSO</div>
        <nav className={styles.topNav} aria-label="Navegación principal">
          <Link href="/judas-era">JUDAS</Link>
          <Link href="/agency">AGENCY</Link>
          <Link href="/duck">DUCK</Link>
          <Link href="/school">SCHOOL</Link>
        </nav>
        <span className={styles.headerIndex}>UNIVERSO / 001</span>
      </header>

      <section className={styles.stage} aria-labelledby="legacy-heading">
        <div className={styles.scene} aria-hidden="true">
          {webgl && <LegacyScene selected={selected} onSelect={setSelected} energy={energy} reduced={reduced} />}
          <div className={styles.sceneVignette} />
        </div>
        <div className={styles.orbitLabel} aria-hidden="true">SYSTEM ONLINE <span>◇</span> B7 / 2026</div>
        <div className={styles.heroCopy}>
          <p className={styles.eyebrow}><span className={styles.live} /> PEDRO BELENTANI · ARTISTA / CREADOR / CONSTRUCTOR</p>
          <h1 id="legacy-heading">ENTRA EN<br /><em>EL UNIVERSO</em><span className={styles.period}>.</span></h1>
          <p className={styles.lead}>Música, sistemas y conocimiento orbitan una misma voluntad. Elige un mundo. Encuentra tu propia ruta.</p>
          <div className={styles.heroActions}>
            <Link href={world.href} className={styles.enter}>ENTRAR EN {world.title} <span aria-hidden="true">↗</span></Link>
            <a href="#worlds" className={styles.explore}>EXPLORAR LOS MUNDOS <span aria-hidden="true">↓</span></a>
          </div>
        </div>
        <div className={styles.signal} role="status" aria-live="polite" aria-label="Mundo seleccionado">
          <span className={styles.signalIndex}>TRANSMISIÓN / 0{WORLDS.findIndex((item) => item.id === selected) + 1}</span>
          <span className={styles.signalTitle}>{world.title}</span>
          <span className={styles.signalDescription}>{world.subtitle}</span>
          <span className={styles.signalTrack} aria-hidden="true"><i style={{ backgroundColor: world.accent }} /></span>
        </div>
        <div className={styles.stageBottom}><span>DESCIENDE PARA NAVEGAR</span><span>SCROLL ↓</span></div>
      </section>

      <section id="worlds" className={styles.worlds} aria-labelledby="worlds-title">
        <div className={styles.worldsHeading}>
          <span className={styles.overline}>MAPA / 004 DESTINOS</span>
          <h2 id="worlds-title">CUATRO MUNDOS.<br /><em>UNA FIRMA.</em></h2>
          <p>Cada órbita tiene su identidad. La puerta está abierta.</p>
        </div>
        <div className={styles.worldGrid}>
          {WORLDS.map((item, index) => (
            <article key={item.id} className={`${styles.worldCard} ${selected === item.id ? styles.active : ''}`} style={{ ['--accent' as string]: item.accent }}>
              <button type="button" className={styles.selectWorld} onClick={() => setSelected(item.id)} aria-pressed={selected === item.id} aria-label={`Seleccionar ${item.title}`}>
                <span className={styles.cardNumber}>0{index + 1} / 04</span>
                <span className={styles.planetGlyph} aria-hidden="true"><i /></span>
                <span className={styles.cardCategory}>{item.category}</span>
                <strong>{item.title}</strong>
                <span className={styles.cardText}>{item.subtitle}</span>
              </button>
              <Link href={item.href} className={styles.cardLink} aria-label={`Entrar en ${item.title}`}>ENTRAR <span aria-hidden="true">↗</span></Link>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.sound} aria-labelledby="sound-title">
        <div><span className={styles.overline}>MOTOR SONORO / LOCAL</span><h2 id="sound-title">EL SONIDO<br /><em>DA FORMA AL VACÍO.</em></h2>
          <p>Selecciona una pista de tu dispositivo para mover la luz del universo con su pulso. El archivo permanece en tu navegador.</p></div>
        <div className={styles.player}>
          <label htmlFor="legacy-audio">CARGAR AUDIO LOCAL <span aria-hidden="true">↗</span></label>
          <input id="legacy-audio" type="file" accept="audio/*" onChange={chooseAudio} />
          {audioName && <p className={styles.filename} title={audioName}>{audioName}</p>}
          {audioUrl ? <audio ref={audioElement} src={audioUrl} controls onPlay={() => void connectAudio()} onPause={stopAudioAnalysis} onEnded={stopAudioAnalysis} preload="none" aria-label="Reproductor de audio local" /> : <span>NINGÚN ARCHIVO CARGADO</span>}
          {audioError && <p role="alert" className={styles.error}>{audioError}</p>}
          <small>El master de JUDAS es privado. Cárgalo aquí solo si tienes permiso de uso. No se envía al servidor.</small>
        </div>
      </section>
      <footer className={styles.footer}><strong>BELENTANI<span>.</span></strong><p>MÚSICA · IA · EDUCACIÓN</p><Link href="/viaje-clasico">EXPLORAR EL VIAJE ORIGINAL ↗</Link></footer>
    </main>
  );
}
