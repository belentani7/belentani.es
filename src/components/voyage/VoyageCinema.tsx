'use client';

import { FormEvent, useCallback, useEffect, useRef, useState } from 'react';
import {
  ORBIT_PLACES,
  VOYAGE_PLACES,
  findPlace,
  nextPlace,
  prevPlace,
} from '@/lib/voyage-places';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useVoiceNarrator } from '@/hooks/useVoiceNarrator';
import styles from './VoyageCinema.module.css';

type LogRole = 'sys' | 'user' | 'ok' | 'err';

interface LogLine {
  id: string;
  role: LogRole;
  text: string;
}

let seq = 0;
const lid = () => `L${++seq}`;

/**
 * Un cielo compartido + planetas HTML en órbita.
 * Cristal / diamante · consola máquina · sin menús ni «versiones».
 */
export default function VoyageCinema() {
  const reduced = useReducedMotion();
  const voice = useVoiceNarrator('es');
  const [placeId, setPlaceId] = useState('viaje3d');
  const [orbit, setOrbit] = useState(false);
  const [consoleOpen, setConsoleOpen] = useState(false);
  const [warping, setWarping] = useState(false);
  const [cmd, setCmd] = useState('');
  const [log, setLog] = useState<LogLine[]>([
    { id: 'boot', role: 'sys', text: 'BELENTANI_OS online · un solo universo · HELP' },
  ]);
  const inputRef = useRef<HTMLInputElement>(null);
  const warpTimerRef = useRef<number>();
  const place = VOYAGE_PLACES.find((p) => p.id === placeId) ?? VOYAGE_PLACES[0];
  const index = ORBIT_PLACES.findIndex((p) => p.id === placeId);

  const push = useCallback((role: LogRole, text: string) => {
    setLog((prev) => [...prev.slice(-40), { id: lid(), role, text }]);
  }, []);

  const travelTo = useCallback(
    (id: string) => {
      const target = findPlace(id) || VOYAGE_PLACES.find((p) => p.id === id);
      if (!target?.url) return;
      window.clearTimeout(warpTimerRef.current);
      setWarping(!reduced);
      setPlaceId(target.id);
      if (typeof window !== 'undefined') {
        const url = new URL(window.location.href);
        url.searchParams.set('lugar', target.id);
        window.history.replaceState({}, '', url);
      }
      if (!reduced) warpTimerRef.current = window.setTimeout(() => setWarping(false), 900);
    },
    [reduced]
  );

  useEffect(() => () => window.clearTimeout(warpTimerRef.current), []);

  useEffect(() => {
    const q = new URLSearchParams(window.location.search).get('lugar');
    if (q && VOYAGE_PLACES.some((p) => p.id === q)) setPlaceId(q);
  }, []);

  const goNext = useCallback(() => {
    travelTo(nextPlace(placeId).id);
  }, [placeId, travelTo]);

  const goPrev = useCallback(() => {
    travelTo(prevPlace(placeId).id);
  }, [placeId, travelTo]);

  useEffect(() => {
    if (!orbit || reduced) return;
    const t = window.setInterval(goNext, 32000);
    return () => window.clearInterval(t);
  }, [orbit, reduced, goNext]);

  const narrate = useCallback(() => {
    push('sys', 'solicitando narración…');
    void voice.speak(`${place.title}. ${place.tagline}.`).then((played) => {
      push(played ? 'ok' : 'sys', played ? 'narración terminada' : 'voz no disponible o detenida · puedes seguir explorando');
    });
  }, [voice, place, push]);

  const run = useCallback(
    (raw: string) => {
      const line = raw.trim();
      if (!line) return;
      push('user', `› ${line}`);
      const [head, ...rest] = line.toLowerCase().split(/\s+/);
      const arg = rest.join(' ');

      if (head === 'help' || head === '?' || head === 'ayuda') {
        push(
          'sys',
          [
            'COMANDOS DE LA MÁQUINA',
            '  ORBIT on|off     — tránsito continuo',
            '  WARP <planeta>   — salto',
            '  NEXT / PREV      — órbita manual',
            '  LIST             — planetas del cielo',
            '  SPEAK / STOP     — voz',
            '  CLEAR            — limpiar',
          ].join('\n')
        );
        return;
      }
      if (head === 'clear' || head === 'cls') {
        setLog([]);
        push('sys', 'consola limpia');
        return;
      }
      if (head === 'list' || head === 'ls' || head === 'planetas') {
        ORBIT_PLACES.forEach((p, i) =>
          push('sys', `${String(i + 1).padStart(2, '0')}  ${p.id.padEnd(14)} ${p.title}`)
        );
        return;
      }
      if (head === 'orbit') {
        if (arg === 'off' || arg === '0' || arg === 'stop') {
          setOrbit(false);
          push('ok', 'órbita detenida');
        } else {
          setOrbit(true);
          push('ok', 'órbita activa · mismo cielo');
        }
        return;
      }
      if (head === 'next' || head === 'siguiente') {
        goNext();
        push('ok', 'warp → siguiente');
        return;
      }
      if (head === 'prev' || head === 'anterior') {
        goPrev();
        push('ok', 'warp → anterior');
        return;
      }
      if (head === 'warp' || head === 'goto' || head === 'ir' || head === 'jump') {
        const hit = findPlace(arg);
        if (!hit?.url) {
          push('err', `planeta desconocido: ${arg || '?'}. LIST`);
          return;
        }
        travelTo(hit.id);
        push('ok', `WARP → ${hit.title}`);
        return;
      }
      if (head === 'speak' || head === 'narrar' || head === 'habla') {
        narrate();
        return;
      }
      if (head === 'stop' || head === 'silencio') {
        voice.stop();
        push('sys', 'silencio');
        return;
      }
      const hit = findPlace(line);
      if (hit?.url) {
        travelTo(hit.id);
        push('ok', `WARP → ${hit.title}`);
        return;
      }
      push('err', 'comando desconocido. HELP');
    },
    [goNext, goPrev, narrate, push, travelTo, voice]
  );

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    run(cmd);
    setCmd('');
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey || target?.closest('input, textarea, select, button, a, [contenteditable="true"]')) return;
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        goNext();
      }
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        goPrev();
      }
      if (e.key === 'o') {
        e.preventDefault();
        setOrbit((v) => !v);
      }
      if (e.key === '/') {
        e.preventDefault();
        setConsoleOpen(true);
        window.setTimeout(() => inputRef.current?.focus(), 0);
      }
      if (e.key.toLowerCase() === 'n') {
        e.preventDefault();
        narrate();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [goNext, goPrev, narrate]);

  return (
    <main className={styles.voyage} data-testid="voyage-cinema">
      {place.url && (
        <div className={`${styles.planetLayer} ${warping ? styles.warpFlash : ''}`}>
          <iframe
            key={place.url}
            className={styles.world}
            src={place.url}
            title={place.title}
            allow="fullscreen; autoplay"
            referrerPolicy="no-referrer"
            onFocus={() => setOrbit(false)}
          />
        </div>
      )}

      <header className={styles.mark}>
        <h1>BELENTANI</h1>
        {consoleOpen && <p>
          {String(Math.max(index, 0) + 1).padStart(2, '0')}/{String(ORBIT_PLACES.length).padStart(2, '0')} ·{' '}
          {place.title}
          {orbit && !reduced ? ' · ÓRBITA' : ' · PAUSA'}
        </p>}
      </header>

      <button type="button" className={styles.consoleToggle} aria-expanded={consoleOpen} aria-controls="voyage-console" onClick={() => setConsoleOpen(v => !v)}>
        {consoleOpen ? 'Cerrar máquina' : 'Máquina'}
      </button>
      {consoleOpen && <section id="voyage-console" className={styles.machine} aria-label="Consola de la máquina">
        <div className={styles.crystalFace} aria-hidden />
        <div className={styles.log} role="log" aria-live="polite">
          {log.slice(-6).map((l) => (
            <pre key={l.id} className={styles[l.role]}>
              {l.text}
            </pre>
          ))}
        </div>
        <form className={styles.cmdRow} onSubmit={onSubmit}>
          <span className={styles.prompt} aria-hidden>
            ›
          </span>
          <input
            ref={inputRef}
            className={styles.cmd}
            value={cmd}
            onChange={(e) => setCmd(e.target.value)}
            onFocus={() => setOrbit(false)}
            placeholder="WARP judas · ORBIT on · LIST · HELP"
            aria-label="Comando de la máquina"
            autoComplete="off"
            spellCheck={false}
          />
          <button type="submit" className={styles.enter}>
            ENTER
          </button>
        </form>
        <nav className={styles.controls} aria-label="Viajar por el universo">
          <button type="button" onClick={() => { setOrbit(false); goPrev(); }}>Anterior</button>
          <button type="button" aria-pressed={orbit && !reduced} disabled={reduced} onClick={() => setOrbit((v) => !v)}>
            {reduced ? 'Modo tranquilo' : orbit ? 'Pausar viaje' : 'Continuar viaje'}
          </button>
          <button type="button" onClick={() => { setOrbit(false); goNext(); }}>Siguiente</button>
        </nav>
        <div className={styles.orbitRing} aria-hidden>
          {ORBIT_PLACES.map((p) => (
            <span
              key={p.id}
              className={p.id === placeId ? styles.facetOn : styles.facet}
              style={{ ['--a' as string]: p.accent }}
            />
          ))}
        </div>
      </section>}
    </main>
  );
}
