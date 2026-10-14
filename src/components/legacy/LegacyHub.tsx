'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useEffect, useRef, useState, type ChangeEvent } from 'react';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { judasChapters } from '@/lib/judas-data';
import { ARCHETYPES, type ArchetypeId } from '@/lib/archetypes';
import { VOYAGE_PLACES } from '@/lib/voyage-places';
import { WORLDS, findWorld, type World } from './worlds';
import styles from './LegacyHub.module.css';

const LegacyScene = dynamic(() => import('./LegacyScene'), { ssr: false });
const VoyageMap = dynamic(() => import('@/components/voyage/VoyageMap').then((module) => module.VoyageMap), { ssr: false });
const ArchetypeDiamonds = dynamic(() => import('./ArchetypeDiamonds'), { ssr: false });
const NaveCompanion = dynamic(() => import('./NaveCompanion'), { ssr: false });
const ARTIST_PLACES = VOYAGE_PLACES.filter((place) => place.kind === 'warp' && place.url);

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
  const [mode, setMode] = useState<'artist' | 'ecosystem'>('artist');
  const [selectedPlace, setSelectedPlace] = useState('viaje3d');
  const [archetype, setArchetype] = useState<ArchetypeId>('belentani');
  const [visitedArchetypes, setVisitedArchetypes] = useState<ArchetypeId[]>(['belentani']);
  const [webgl, setWebgl] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string>();
  const [audioName, setAudioName] = useState('');
  const [audioError, setAudioError] = useState('');
  const audioElement = useRef<HTMLAudioElement>(null);
  const contextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationRef = useRef<number | null>(null);
  const energy = useRef(0);
  const sceneRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const world = findWorld(selected) ?? WORLDS[0];
  const place = ARTIST_PLACES.find((item) => item.id === selectedPlace) ?? ARTIST_PLACES[0];
  const destination = mode === 'artist' ? place : world;

  useEffect(() => setWebgl(supportsWebGL()), []);
  useEffect(() => {
    if (reduced) return;
    let animation: { revert: () => void } | undefined;
    let cancelled = false;
    void Promise.all([import('gsap'), import('gsap/ScrollTrigger')]).then(([{ gsap }, { ScrollTrigger }]) => {
      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger);
      animation = gsap.context(() => {
        gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((element) => {
          gsap.fromTo(element, { autoAlpha: .3, y: 34 }, {
            autoAlpha: 1, y: 0, duration: .95, ease: 'power2.out',
            scrollTrigger: { trigger: element, start: 'top 92%', once: true },
          });
        });
      });
    });
    return () => { cancelled = true; animation?.revert(); };
  }, [reduced]);
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
    if (sceneRef.current) sceneRef.current.style.filter = '';
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
        if (sceneRef.current) sceneRef.current.style.filter = `brightness(${1 + energy.current * 0.26})`;
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
    if (sceneRef.current) sceneRef.current.style.filter = '';
  }

  function selectArchetype(id: ArchetypeId) {
    setArchetype(id);
    setVisitedArchetypes((current) => current.includes(id) ? current : [...current, id]);
  }

  return (
    <main className={styles.hub}>
      <a className={styles.skip} href="#constelacion">Saltar a los planetas</a>
      <div className={styles.grain} aria-hidden="true" />
      <header className={styles.header}>
        <Link href="/" className={styles.brand} aria-label="Belentani, inicio">B<span>7</span><i>.</i></Link>
        <div className={styles.headerCenter}>BELENTANI <span>/</span> MÁQUINA VIVA</div>
        <nav className={styles.topNav} aria-label="Navegación principal">
          <Link href="/galaxia">GALAXIA</Link>
          <a href="#constelacion">PLANETAS</a>
          <a href="#firmas">DIAMANTES</a>
          <Link href="/judas">JUDAS</Link>
          <Link href="/artista">ARTISTA</Link>
          <Link href="/maquina">MÁQUINA</Link>
          <Link href="/consultoria">NOIACORE</Link>
          <Link href="/agency">AGENCY</Link>
          <Link href="/duck">DUCK</Link>
          <Link href="/school">SCHOOL</Link>
        </nav>
        <span className={styles.headerIndex}>UNIVERSO / 001</span>
      </header>

      <section className={styles.stage} aria-labelledby="legacy-heading">
        <div className={styles.scene} ref={sceneRef} aria-hidden="true">
          {webgl && (mode === 'artist'
            ? <VoyageMap places={ARTIST_PLACES} currentId={place.id} onSelect={setSelectedPlace} />
            : <LegacyScene selected={selected} onSelect={setSelected} energy={energy} reduced={reduced} />)}
          <div className={styles.sceneVignette} />
        </div>
        <div className={styles.orbitLabel} aria-hidden="true">SYSTEM ONLINE <span>◇</span> B7 / 2026</div>
        <div className={styles.heroCopy}>
          <p className={styles.eyebrow}><span className={styles.live} /> PEDRO BELENTANI · ARTISTA / CREADOR / CONSTRUCTOR</p>
          <h1 id="legacy-heading">LA OBRA<br /><em>SIGUE VIVA</em><span className={styles.period}>.</span></h1>
          <p className={styles.lead}>Un planeta, una llave, un diamante, una voz. Pilota la galaxia de JUDAS y atraviesa las puertas del universo BELENTANI.</p>
          <div className={styles.heroActions}>
            <Link href={mode === 'artist' ? place.url! : world.href} className={styles.enter}>ENTRAR EN {destination.title} <span aria-hidden="true">↗</span></Link>
            <Link href="/galaxia" className={styles.explore}>PILOTAR LA GALAXIA <span aria-hidden="true">↗</span></Link>
          </div>
        </div>
        <div className={styles.modeSwitch} role="group" aria-label="Elegir mapa del universo">
          <button type="button" aria-pressed={mode === 'artist'} onClick={() => setMode('artist')}>01 / OBRA</button>
          <button type="button" aria-pressed={mode === 'ecosystem'} onClick={() => setMode('ecosystem')}>02 / ECOSISTEMA</button>
        </div>
        <div className={styles.signal} role="status" aria-live="polite" aria-label="Mundo seleccionado">
          <span className={styles.signalIndex}>TRANSMISIÓN / {mode === 'artist' ? 'OBRA' : 'ECOSISTEMA'}</span>
          <span className={styles.signalTitle}>{destination.title}</span>
          <span className={styles.signalDescription}>{mode === 'artist' ? place.tagline : world.subtitle}</span>
          <span className={styles.signalTrack} aria-hidden="true"><i style={{ backgroundColor: destination.accent }} /></span>
        </div>
        <div className={styles.stageBottom}><span>DESCIENDE PARA NAVEGAR</span><span>SCROLL ↓</span></div>
      </section>

      <section id="constelacion" className={styles.constellation} aria-labelledby="constellation-title">
        <div className={styles.constellationIntro}>
          <span className={styles.overline}>CÓDICE / PLANETAS CON RUTA PROPIA</span>
          <h2 id="constellation-title">UN UNIVERSO.<br /><em>MUCHAS PUERTAS.</em></h2>
          <p>La obra se despliega en escenas, capítulos y archivos. Elige un nodo en el cielo o desde esta lista: cada puerta conserva su voz.</p>
        </div>
        <div className={styles.planetList}>
          {ARTIST_PLACES.map((item, index) => (
            <article className={styles.planetEntry} key={item.id} style={{ ['--accent' as string]: item.accent }}>
              <button type="button" aria-pressed={selectedPlace === item.id && mode === 'artist'} onClick={() => { setSelectedPlace(item.id); setMode('artist'); }} aria-label={`Enfocar ${item.title} en el mapa`}>
                <span className={styles.planetNumber}>{String(index + 1).padStart(2, '0')}</span>
                <span className={styles.planetDot} aria-hidden="true" />
                <strong>{item.title}</strong>
                <span>{item.tagline}</span>
              </button>
              <Link href={item.url!} aria-label={`Entrar en ${item.title}`}>ENTRAR ↗</Link>
            </article>
          ))}
        </div>
        <div className={styles.loreStatement}>
          <p className={styles.overline}>ARCHIVO / LA LLAVE DORADA</p>
          <blockquote>La llave es metal.<br /><em>Mi voz nadie me la arrebata.</em></blockquote>
          <p>JUDAS es una ficción simbólica: el planeta, el espejo y la máquina cambian de forma; la voz atraviesa todos los mundos.</p>
          <Link href="/maquina">ABRIR LA MÁQUINA ↗</Link>
        </div>
      </section>

      <section className={styles.chronicle} aria-labelledby="chronicle-title">
        <div className={styles.chronicleHeader}>
          <span className={styles.overline}>JUDAS / LA CRÓNICA</span>
          <h2 id="chronicle-title">SEIS CAPÍTULOS.<br /><em>UNA VOZ.</em></h2>
          <p>Del espejo a la máquina. La historia se recorre como obra audiovisual, con dos anexos para volver al proceso.</p>
        </div>
        <ol className={styles.chapterList}>
          {judasChapters.filter((chapter) => chapter.kind === 'chapter').map((chapter, index) => (
            <li key={chapter.id}>
              <Link href={`/judas/${chapter.id}`}>
                <span>{String(index + 1).padStart(2, '0')}</span>
                <span aria-hidden="true">{chapter.symbol}</span>
                <strong>{chapter.name}</strong>
                <small>{chapter.lore}</small>
                <b aria-hidden="true">↗</b>
              </Link>
            </li>
          ))}
        </ol>
        <Link className={styles.chronicleLink} href="/judas">ENTRAR EN LA OBRA COMPLETA / 2 ANEXOS ↗</Link>
      </section>

      <section id="firmas" className={styles.signatures} aria-labelledby="signatures-title">
        <span className={styles.overline}>PUERTA MAESTRA / CINCO FIRMAS</span>
        <h2 id="signatures-title" data-reveal>SER MUCHOS PARA<br /><em>SEGUIR SIENDO UNO.</em></h2>
        <p className={styles.gemLead}>Cinco diamantes, cinco colores, cinco funciones de una sola obra. Toca una gema; NAVE te dejará una pista. Al explorar las cinco se abre la sexta variable.</p>
        <div className={styles.gemTheatre} aria-label="Diamantes de los cinco arquetipos">
          {webgl ? <ArchetypeDiamonds activeId={archetype} reduced={reduced} onSelect={selectArchetype} /> : <div className={styles.gemFallback} aria-hidden="true">◇ ◇ ◇ ◇ ◇</div>}
          <div className={styles.gemCaption} style={{ ['--gem-color' as string]: ARCHETYPES.find((item) => item.id === archetype)?.color }} role="status" aria-live="polite">
            <span>GEMA / {String(ARCHETYPES.findIndex((item) => item.id === archetype) + 1).padStart(2, '0')} · {visitedArchetypes.length}/05 EXPLORADAS</span>
            <strong>{ARCHETYPES.find((item) => item.id === archetype)?.name}</strong>
            <p>{ARCHETYPES.find((item) => item.id === archetype)?.copy}</p>
            {visitedArchetypes.length === ARCHETYPES.length && <Link href="/unificado">LA SEXTA VARIABLE ERES TÚ ↗</Link>}
          </div>
        </div>
        <div className={styles.signatureGrid}>
          {ARCHETYPES.map((signature, index) => (
            <div key={signature.id} style={{ ['--gem-color' as string]: signature.color }} data-reveal>
              <button type="button" onClick={() => selectArchetype(signature.id)} aria-pressed={archetype === signature.id} aria-label={`Enfocar diamante de ${signature.name}`}><i aria-hidden="true">◇</i><span>{String(index + 1).padStart(2, '0')} / {signature.role}</span></button>
              <strong>{signature.name}</strong>
              <p>{signature.copy}</p>
              <Link href={signature.href}>SEGUIR FIRMA ↗</Link>
            </div>
          ))}
        </div>
        <p className={styles.signaturesNote}>Las firmas son funciones del relato, no personas distintas. La sexta variable es quien atraviesa la obra.</p>
      </section>

      <section id="worlds" className={styles.worlds} aria-labelledby="worlds-title">
        <div className={styles.worldsHeading}>
          <span className={styles.overline}>ECOSISTEMA / 004 DESTINOS</span>
          <h2 id="worlds-title">LA OBRA TAMBIÉN<br /><em>CONSTRUYE MUNDOS.</em></h2>
          <p>Del sonido al estudio, de los sistemas a la educación: cuatro puertas con identidad propia.</p>
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
      <NaveCompanion archetypeId={archetype} unlocked={visitedArchetypes.length === ARCHETYPES.length} />
    </main>
  );
}
