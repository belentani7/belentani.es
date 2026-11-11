'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './duck.module.css';

export type DuckCatalogTrack = {
  id: string;
  title: string;
  genre: string;
  bpm?: number;
  previewUrl?: string;
  description?: string;
};

export type DuckPortalProps = {
  /** Pass only tracks that are cleared for public display and preview. */
  catalog?: readonly DuckCatalogTrack[];
};

type Track = 'Kick' | 'Snare' | 'Hat' | 'Pulse';
type Pattern = boolean[][];

const TRACKS: readonly Track[] = ['Kick', 'Snare', 'Hat', 'Pulse'];
const TRACK_LABELS: Record<Track, string> = {
  Kick: 'Bombo',
  Snare: 'Caja',
  Hat: 'Hi-hat',
  Pulse: 'Pulso',
};
const STEPS = 16;
const START_PATTERN: Pattern = [
  [true, false, false, false, true, false, false, false, true, false, false, false, true, false, false, false],
  [false, false, false, false, true, false, false, false, false, false, false, false, true, false, false, false],
  [true, false, true, false, true, false, true, false, true, false, true, false, true, false, true, false],
  [true, false, false, true, false, false, true, false, true, false, false, true, false, false, true, false],
];

function canPreview(url: string | undefined): url is string {
  if (!url) return false;
  try {
    const parsed = new URL(url, 'https://duck.invalid');
    if (url.startsWith('/')) return !url.startsWith('//') && parsed.origin === 'https://duck.invalid';
    return /^https?:\/\//i.test(url) && (parsed.protocol === 'https:' || parsed.protocol === 'http:');
  } catch {
    return false;
  }
}

function hit(context: AudioContext, track: Track): void {
  const now = context.currentTime;
  const output = context.createGain();
  output.gain.setValueAtTime(0.0001, now);
  output.gain.exponentialRampToValueAtTime(track === 'Hat' ? 0.12 : 0.22, now + 0.004);
  output.gain.exponentialRampToValueAtTime(0.0001, now + (track === 'Kick' ? 0.32 : 0.13));
  output.connect(context.destination);

  if (track === 'Kick' || track === 'Pulse') {
    const oscillator = context.createOscillator();
    oscillator.type = track === 'Kick' ? 'sine' : 'triangle';
    oscillator.frequency.setValueAtTime(track === 'Kick' ? 150 : 220, now);
    oscillator.frequency.exponentialRampToValueAtTime(track === 'Kick' ? 45 : 110, now + 0.12);
    oscillator.connect(output);
    oscillator.start(now);
    oscillator.stop(now + (track === 'Kick' ? 0.33 : 0.14));
    oscillator.onended = () => {
      oscillator.disconnect();
      output.disconnect();
    };
    return;
  }

  const buffer = context.createBuffer(1, Math.ceil(context.sampleRate * 0.14), context.sampleRate);
  const samples = buffer.getChannelData(0);
  for (let i = 0; i < samples.length; i += 1) samples[i] = Math.random() * 2 - 1;
  const noise = context.createBufferSource();
  noise.buffer = buffer;
  const filter = context.createBiquadFilter();
  filter.type = track === 'Hat' ? 'highpass' : 'bandpass';
  filter.frequency.value = track === 'Hat' ? 7000 : 1900;
  noise.connect(filter);
  filter.connect(output);
  noise.start(now);
  noise.onended = () => {
    noise.disconnect();
    filter.disconnect();
    output.disconnect();
  };
}

function Sequencer() {
  const [pattern, setPattern] = useState<Pattern>(() => START_PATTERN.map((row) => [...row]));
  const [tempo, setTempo] = useState(108);
  const [playing, setPlaying] = useState(false);
  const [step, setStep] = useState(-1);
  const [audioError, setAudioError] = useState('');
  const patternRef = useRef(pattern);
  const audioRef = useRef<AudioContext | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const cursorRef = useRef(0);

  useEffect(() => { patternRef.current = pattern; }, [pattern]);

  useEffect(() => {
    if (!playing || !audioRef.current) return;
    const context = audioRef.current;
    const tick = () => {
      const next = cursorRef.current;
      TRACKS.forEach((track, index) => {
        if (patternRef.current[index][next]) hit(context, track);
      });
      setStep(next);
      cursorRef.current = (next + 1) % STEPS;
    };
    tick();
    timerRef.current = setInterval(tick, 60_000 / tempo / 4);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = null;
    };
  }, [playing, tempo]);

  useEffect(() => () => {
    if (timerRef.current) clearInterval(timerRef.current);
    void audioRef.current?.close();
  }, []);

  async function togglePlayback() {
    if (playing) {
      setPlaying(false);
      setStep(-1);
      return;
    }
    try {
      if (!audioRef.current) audioRef.current = new AudioContext();
      await audioRef.current.resume();
      setAudioError('');
      cursorRef.current = 0;
      setPlaying(true);
    } catch {
      setAudioError('El navegador no ha podido activar el audio. Comprueba los permisos de sonido.');
    }
  }

  function togglePad(lane: number, beat: number) {
    setPattern((current) => current.map((row, index) =>
      index === lane ? row.map((value, column) => column === beat ? !value : value) : row
    ));
  }

  return (
    <section className={styles.lab} id="duck-lab" aria-labelledby="duck-lab-title">
      <div className={styles.sectionHeading}>
        <div><p className={styles.eyebrow}>02 / LABORATORIO</p><h2 id="duck-lab-title">Haz que lata.</h2></div>
        <p>Un ritmo de cuatro pistas creado en tu navegador. Activa el sonido y mueve las celdas.</p>
      </div>
      <div className={styles.console}>
        <div className={styles.consoleTop}>
          <span className={styles.consoleId}>DUCK / 16 STEP MACHINE</span>
          <div className={styles.controls}>
            <label htmlFor="duck-tempo">TEMPO <output>{tempo} BPM</output></label>
            <input id="duck-tempo" type="range" min="60" max="180" step="1" value={tempo}
              onChange={(event) => setTempo(Number(event.target.value))} aria-label="Tempo en BPM" />
            <button type="button" className={styles.play} onClick={togglePlayback}
              aria-label={playing ? 'Detener secuenciador' : 'Reproducir secuenciador'}>
              <span aria-hidden="true">{playing ? '■' : '▶'}</span> {playing ? 'DETENER' : 'REPRODUCIR'}
            </button>
          </div>
        </div>
        <div className={styles.sequenceScroll}>
          <div className={styles.sequence} role="group" aria-label="Patrón de dieciséis pasos">
            <div className={styles.sequenceHead} aria-hidden="true">
              <span>PISTA</span>{Array.from({ length: STEPS }, (_, index) => <span key={index}>{index + 1}</span>)}
            </div>
            {TRACKS.map((track, lane) => (
              <div className={styles.sequenceRow} key={track}>
                <span className={styles.trackName}>{TRACK_LABELS[track]}</span>
                {pattern[lane].map((enabled, beat) => (
                  <button type="button" key={beat} onClick={() => togglePad(lane, beat)}
                    className={`${styles.pad} ${enabled ? styles.padOn : ''} ${step === beat ? styles.padPlaying : ''}`}
                    aria-label={`${TRACK_LABELS[track]}, paso ${beat + 1}`}
                    aria-pressed={enabled} title={`${TRACK_LABELS[track]} · ${beat + 1}`} />
                ))}
              </div>
            ))}
          </div>
        </div>
        <div className={styles.consoleBottom}>
          <span>WEB AUDIO / DEMO LOCAL</span><span>16 PASOS · 4 PISTAS · SIN SUBIR ARCHIVOS</span>
        </div>
        {audioError && <p className={styles.inlineError} role="alert">{audioError}</p>}
      </div>
    </section>
  );
}

function Catalog({ catalog }: { catalog: readonly DuckCatalogTrack[] }) {
  return (
    <section className={styles.catalog} id="duck-catalog" aria-labelledby="duck-catalog-title">
      <div className={styles.sectionHeading}>
        <div><p className={styles.eyebrow}>01 / CATÁLOGO</p><h2 id="duck-catalog-title">Sonido con dirección.</h2></div>
        <p>Instrumentales y producción musical para convertir una intención en una pieza propia.</p>
      </div>
      {catalog.length > 0 ? (
        <div className={styles.catalogGrid}>
          {catalog.map((track, index) => (
            <article className={styles.trackCard} key={track.id}>
              <div className={styles.trackArt} aria-hidden="true"><span>{String(index + 1).padStart(2, '0')}</span><i /></div>
              <div className={styles.trackText}>
                <p className={styles.trackMeta}>{track.genre} {track.bpm ? `· ${track.bpm} BPM` : ''}</p>
                <h3>{track.title}</h3>
                {track.description && <p>{track.description}</p>}
                {canPreview(track.previewUrl) ? (
                  <audio className={styles.preview} controls preload="none" src={track.previewUrl} aria-label={`Escuchar preview de ${track.title}`} />
                ) : <small>Preview disponible cuando el activo esté autorizado.</small>}
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className={styles.catalogEmpty}>
          <div className={styles.record} aria-hidden="true"><i /></div>
          <div><p className={styles.eyebrow}>EDICIÓN CURADA</p><h3>El catálogo público está en preparación.</h3>
            <p>Los beats aparecerán aquí con preview y condiciones de licencia una vez que estén aprobados para publicación.</p>
          </div>
        </div>
      )}
      <div className={styles.serviceLine} aria-label="Áreas de trabajo">
        <span>PRODUCCIÓN</span><span>BEATS</span><span>MEZCLA</span><span>MASTERING</span>
      </div>
    </section>
  );
}

function Delivery() {
  const [file, setFile] = useState<{ name: string; size: string; type: string } | null>(null);
  const [fileError, setFileError] = useState('');

  function inspectFile(selection: File | undefined) {
    setFile(null);
    setFileError('');
    if (!selection) return;
    const extension = selection.name.split('.').pop()?.toLowerCase();
    if (!extension || !['wav', 'flac', 'mp3', 'aiff', 'aif'].includes(extension)) {
      setFileError('Selecciona WAV, FLAC, AIFF o MP3 para una comprobación local de nombre y tamaño.');
      return;
    }
    setFile({ name: selection.name, size: `${(selection.size / 1048576).toFixed(1)} MB`, type: extension.toUpperCase() });
  }

  return (
    <section className={styles.delivery} id="duck-delivery" aria-labelledby="duck-delivery-title">
      <div className={styles.sectionHeading}>
        <div><p className={styles.eyebrow}>03 / ENTREGA</p><h2 id="duck-delivery-title">Cada versión importa.</h2></div>
        <p>Un flujo de trabajo claro: revisión, aprobación y entrega privada de los archivos finales.</p>
      </div>
      <div className={styles.deliveryGrid}>
        <div className={styles.deliverySteps}>
          <div><span>01</span><div><h3>Versión para revisión</h3><p>El cliente escucha y deja observaciones sobre una versión concreta.</p></div></div>
          <div><span>02</span><div><h3>Aprobación</h3><p>Los cambios quedan trazados antes de cerrar la mezcla y el master.</p></div></div>
          <div><span>03</span><div><h3>Entrega protegida</h3><p>Archivos finales y derechos se gestionan en el portal autenticado.</p></div></div>
        </div>
        <div className={styles.filePanel}>
          <p className={styles.consoleId}>COMPROBACIÓN LOCAL / ARCHIVO</p>
          <h3>Prepara tu master.</h3>
          <p>Comprueba aquí el nombre, formato y tamaño antes de llevarlo al flujo privado. No se sube ni se almacena.</p>
          <label className={styles.fileButton} htmlFor="duck-master-file">SELECCIONAR ARCHIVO <span aria-hidden="true">↗</span></label>
          <input id="duck-master-file" type="file" className={styles.visuallyHidden}
            accept="audio/*"
            onChange={(event) => inspectFile(event.currentTarget.files?.[0])} />
          {file && <div className={styles.fileResult} role="status"><span>SELECCIÓN LOCAL</span><strong>{file.name}</strong><small>{file.type} · {file.size}</small></div>}
          {fileError && <p className={styles.inlineError} role="alert">{fileError}</p>}
          <small>La inspección no mide LUFS, true peak ni derechos. La entrega real requiere autenticación.</small>
        </div>
      </div>
    </section>
  );
}

export function DuckPortal({ catalog = [] }: DuckPortalProps) {
  return (
    <main className={styles.portal}>
      <div className={styles.grain} aria-hidden="true" />
      <div className={styles.pageWidth}>
        <header className={styles.topbar}>
          <a className={styles.brand} href="#duck-top" aria-label="DUCK STUDIO, volver al inicio"><span className={styles.brandMark} aria-hidden="true">D<span>.</span></span><span>DUCK <b>STUDIO</b></span></a>
          <nav className={styles.nav} aria-label="Navegación DUCK STUDIO">
            <a href="#duck-catalog">CATÁLOGO</a><a href="#duck-lab">LAB</a><a href="#duck-delivery">ENTREGA</a>
          </nav>
          <span className={styles.topbarTag}>MUSIC / CREATIVE PRODUCTION</span>
        </header>
        <section className={styles.hero} id="duck-top" aria-labelledby="duck-title">
          <div className={styles.heroCopy}>
            <p className={styles.eyebrow}><span className={styles.liveDot} /> TU IDEA, EN OTRA FRECUENCIA</p>
            <h1 id="duck-title">Music starts<br />with <em>intention.</em></h1>
            <p className={styles.heroLead}>Producción musical, beats y experiencias sonoras. De la primera idea al último detalle del master.</p>
            <div className={styles.heroActions}><a className={styles.primaryLink} href="#duck-catalog">EXPLORAR CATÁLOGO <span aria-hidden="true">↗</span></a><a className={styles.secondaryLink} href="#duck-lab">ENTRAR AL LAB <span aria-hidden="true">↓</span></a></div>
          </div>
          <div className={styles.heroVisual} aria-hidden="true">
            <div className={styles.orbit1} /><div className={styles.orbit2} /><div className={styles.orbit3} />
            <div className={styles.heroDisc}><div className={styles.discLabel}>DUCK<br /><small>STUDIO</small></div></div>
            <span className={styles.axisTop}>SIGNAL_001</span><span className={styles.axisBottom}>↓ 01 / 03</span>
          </div>
        </section>
        <div className={styles.marquee} aria-hidden="true"><span>CREATE / REFINE / RELEASE</span><span>◈</span><span>DUCK STUDIO</span><span>◈</span><span>SOUND WITH INTENTION</span></div>
        <Catalog catalog={catalog} />
        <Sequencer />
        <Delivery />
        <footer className={styles.footer}><strong>DUCK STUDIO<span>.</span></strong><span>MUSIC IS THE WORK.</span><a href="#duck-top">VOLVER ARRIBA ↑</a></footer>
      </div>
    </main>
  );
}

export default DuckPortal;
