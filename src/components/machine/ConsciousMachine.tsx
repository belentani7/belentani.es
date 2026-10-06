'use client';

import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useCallback, useMemo, useState } from 'react';
import { LivingTerminal, openWorldById } from './LivingTerminal';
import { useVoiceNarrator } from '@/hooks/useVoiceNarrator';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import {
  MYTH_PULSE,
  MYTH_STATIONS,
  type MythLang,
  stationById,
} from '@/lib/mythos';
import { WORLD_NODES, worldsForStation, worldHref, isExternalWorld } from '@/lib/worlds-atlas';
import styles from './ConsciousMachine.module.css';

const Cosmos = dynamic(() => import('../canvas/CanonCosmos'), { ssr: false });

const LANGS: { id: MythLang; label: string }[] = [
  { id: 'es', label: 'ES' },
  { id: 'en', label: 'EN' },
  { id: 'pt', label: 'PT-BR' },
];

type Mode = 'mythos' | 'atlas' | 'era';

export default function ConsciousMachine() {
  const reduced = useReducedMotion();
  const voice = useVoiceNarrator('es');
  const [stationId, setStationId] = useState('traicion');
  const [mode, setMode] = useState<Mode>('mythos');
  const [paused, setPaused] = useState(false);
  const [webgl, setWebgl] = useState(true);

  const station = useMemo(() => stationById(stationId) ?? MYTH_STATIONS[3], [stationId]);
  const chapterIndex = Math.max(0, MYTH_STATIONS.findIndex((s) => s.id === stationId));
  const linkedWorlds = useMemo(() => worldsForStation(stationId), [stationId]);

  const onNavigateStation = useCallback(
    (id: string) => {
      setStationId(id);
      setMode('mythos');
    },
    []
  );

  const onOpenWorld = useCallback((id: string) => {
    openWorldById(id);
  }, []);

  const narrateCurrent = () => {
    void voice.speak(station.speak[voice.lang]);
  };

  return (
    <main className={styles.machine} data-testid="conscious-machine">
      <div className={styles.void} aria-hidden>
        {webgl && !reduced && (
          <div className={styles.cosmos}>
            <Cosmos calm={paused} chapter={Math.min(chapterIndex, 3)} />
          </div>
        )}
        <div className={styles.bloodVeins} />
        <div className={styles.vignette} />
      </div>

      <header className={styles.topbar}>
        <Link href="/" className={styles.brand}>
          BELENTANI
          <span>MÁQUINA CONSCIENTE · JUDAS_OS</span>
        </Link>
        <nav className={styles.nav} aria-label="Navegación principal">
          <Link href="/artista">Artista</Link>
          <Link href="/musica">Música</Link>
          <Link href="/judas">Era</Link>
          <Link href="/prensa">Contacto</Link>
        </nav>
        <div className={styles.voiceDock} role="group" aria-label="Narrador">
          {LANGS.map((l) => (
            <button
              key={l.id}
              type="button"
              aria-pressed={voice.lang === l.id}
              onClick={() => voice.setLang(l.id)}
            >
              {l.label}
            </button>
          ))}
          <button
            type="button"
            className={styles.speakBtn}
            aria-pressed={voice.speaking}
            onClick={() => (voice.speaking ? voice.stop() : narrateCurrent())}
            title={voice.supported ? 'Narrar estación' : 'Voz no disponible en este navegador'}
          >
            {voice.speaking ? '■ STOP' : '▶ NARRA'}
          </button>
        </div>
      </header>

      <div className={styles.modesRow}>
        <div className={styles.modes} role="tablist" aria-label="Modos de la máquina">
          {(
            [
              ['mythos', 'MITO'],
              ['atlas', 'ATLAS'],
              ['era', 'ERA 3D'],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              role="tab"
              id={`mode-tab-${id}`}
              aria-controls={`mode-panel-${id}`}
              aria-selected={mode === id}
              tabIndex={mode === id ? 0 : -1}
              onClick={() => setMode(id)}
            >
              {label}
            </button>
          ))}
        </div>
        <div className={styles.modeTools}>
          <button type="button" className={styles.iconBtn} aria-pressed={paused} onClick={() => setPaused((p) => !p)} title="Pausar atmósfera">
            {paused ? '▷' : 'Ⅱ'}
          </button>
          <button type="button" className={styles.iconBtn} aria-pressed={!webgl} onClick={() => setWebgl((w) => !w)} title="Alternar WebGL">
            GL
          </button>
        </div>
      </div>

      <div className={styles.grid}>
        <aside className={styles.stations} aria-label="Estaciones del romance">
          <p className={styles.kicker}>ROMANCE · PEDRO ↔ JUDAS</p>
          {MYTH_STATIONS.map((s) => (
            <button
              key={s.id}
              type="button"
              className={styles.station}
              aria-pressed={stationId === s.id}
              onClick={() => {
                setStationId(s.id);
                setMode('mythos');
                void voice.speak(s.speak[voice.lang]);
              }}
            >
              <span>{s.symbol}</span>
              <div>
                <strong>{s.title[voice.lang]}</strong>
                <em>{s.tag[voice.lang]}</em>
              </div>
            </button>
          ))}
        </aside>

        <section className={styles.stage} aria-live="polite" id={`mode-panel-${mode}`} role="tabpanel" aria-labelledby={`mode-tab-${mode}`}>
          {mode === 'mythos' && (
            <article className={`${styles.panel} ng-redglass`}>
              <p className={styles.kicker}>ESTACIÓN {station.symbol}</p>
              <h1>{station.title[voice.lang]}</h1>
              <p className={styles.lead}>{station.body[voice.lang]}</p>
              <p className={styles.bloodLine}>{MYTH_PULSE.romance[voice.lang]}</p>
              <div className={styles.actions}>
                <button type="button" onClick={narrateCurrent}>Narrar</button>
                <button
                  type="button"
                  disabled={chapterIndex === 0}
                  onClick={() => {
                    const prev = MYTH_STATIONS[chapterIndex - 1];
                    if (prev) setStationId(prev.id);
                  }}
                >
                  Anterior
                </button>
                <button
                  type="button"
                  disabled={chapterIndex >= MYTH_STATIONS.length - 1}
                  onClick={() => {
                    const next = MYTH_STATIONS[chapterIndex + 1];
                    if (next) setStationId(next.id);
                  }}
                >
                  Siguiente
                </button>
              </div>
              {linkedWorlds.length > 0 && (
                <div className={styles.linked}>
                  <p className={styles.kicker}>MUNDOS DE ESTA ESTACIÓN</p>
                  <ul>
                    {linkedWorlds.map((w) => {
                      const href = worldHref(w);
                      const external = isExternalWorld(w);
                      return (
                        <li key={w.id}>
                          {external ? (
                            <a href={href} target="_blank" rel="noopener noreferrer" style={{ color: w.accent }}>
                              {w.name} ↗
                            </a>
                          ) : (
                            <Link href={href} style={{ color: w.accent }}>{w.name}</Link>
                          )}
                          <span>{w.role}</span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
            </article>
          )}

          {mode === 'atlas' && (
            <article className={`${styles.panel} ng-redglass`}>
              <p className={styles.kicker}>ATLAS · SIN ROMPER LAS WEBS</p>
              <h1>Una galaxia. Muchos cuerpos.</h1>
              <p className={styles.lead}>
                Cada mundo conserva su URL y su identidad. Esta máquina los ata al mito — no los fusiona a martillazos.
              </p>
              <div className={styles.atlas}>
                {WORLD_NODES.map((w) => {
                  const href = worldHref(w);
                  const external = isExternalWorld(w);
                  return (
                    <a
                      key={w.id}
                      className={styles.worldCard}
                      href={href}
                      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                      style={{ ['--accent' as string]: w.accent }}
                    >
                      <span className={styles.worldKind}>{w.kind}</span>
                      <strong>{w.name}</strong>
                      <em>{w.role}</em>
                      <p>{w.blurb}</p>
                    </a>
                  );
                })}
              </div>
            </article>
          )}

          {mode === 'era' && (
            <article className={`${styles.panel} ng-redglass`}>
              <p className={styles.kicker}>ERA JUDAS · ESCENA CANÓNICA</p>
              <h1>Entrar en la escena 3D</h1>
              <p className={styles.lead}>
                La capa cinematográfica local sigue intacta. Aquí solo hay un puente — no un reemplazo.
              </p>
              <div className={styles.actions}>
                <Link className={styles.cta} href="/galaxia">Abrir Judas Era Shell</Link>
                <Link className={styles.ctaGhost} href="/judas">Capítulos /judas</Link>
                <a className={styles.ctaGhost} href="/unificado/" target="_blank" rel="noopener noreferrer">
                  Unificado local ↗
                </a>
              </div>
            </article>
          )}
        </section>

        <div className={styles.terminalCol}>
          <LivingTerminal
            lang={voice.lang}
            onNavigateStation={onNavigateStation}
            onOpenWorld={onOpenWorld}
            onSpeak={(t) => void voice.speak(t)}
            onStopSpeak={voice.stop}
            reducedMotion={reduced}
          />
          <p className={styles.machineWhisper}>{MYTH_PULSE.machine[voice.lang]}</p>
        </div>
      </div>

      <footer className={styles.foot}>
        <span>Belentani · São Paulo / Barcelona · 432 Hz</span>
        <span>Vidrio rojo · sangre neón · código consciente</span>
        <span>
          Voz: {voice.supported ? (voice.mode === 'natural' ? 'NATURAL' : 'BROWSER') : 'N/A'}
          {voice.naturalReady ? ' · ElevenLabs listo' : ' · sin endpoint'}
        </span>
      </footer>
    </main>
  );
}
