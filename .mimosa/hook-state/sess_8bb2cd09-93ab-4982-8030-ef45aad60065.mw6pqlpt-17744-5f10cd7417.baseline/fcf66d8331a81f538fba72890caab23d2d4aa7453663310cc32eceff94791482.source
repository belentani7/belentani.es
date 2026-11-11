'use client';

import { FormEvent, useEffect, useRef, useState } from 'react';
import type { MythLang } from '@/lib/mythos';
import { BOOT_LINES, MYTH_PULSE, MYTH_STATIONS, stationById } from '@/lib/mythos';
import { WORLD_NODES, worldHref, isExternalWorld } from '@/lib/worlds-atlas';
import styles from './LivingTerminal.module.css';

export interface LivingTerminalProps {
  lang: MythLang;
  onNavigateStation: (id: string) => void;
  onOpenWorld: (id: string) => void;
  onSpeak: (text: string) => void;
  onStopSpeak: () => void;
  reducedMotion?: boolean;
}

type LogRole = 'sys' | 'user' | 'myth' | 'blood';

interface LogLine {
  id: string;
  role: LogRole;
  text: string;
}

let lineSeq = 0;
function lid() {
  lineSeq += 1;
  return `L${lineSeq}-${Date.now()}`;
}

export function LivingTerminal({
  lang,
  onNavigateStation,
  onOpenWorld,
  onSpeak,
  onStopSpeak,
  reducedMotion,
}: LivingTerminalProps) {
  const [lines, setLines] = useState<LogLine[]>([]);
  const [booted, setBooted] = useState(false);
  const [input, setInput] = useState('');
  const logRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const push = (role: LogRole, text: string) => {
    setLines((prev) => [...prev.slice(-120), { id: lid(), role, text }]);
  };

  useEffect(() => {
    if (booted) return;
    const boot = BOOT_LINES[lang];
    let i = 0;
    const tick = () => {
      if (i >= boot.length) {
        setBooted(true);
        push('blood', MYTH_PULSE.romance[lang]);
        return;
      }
      push('sys', boot[i]);
      i += 1;
      window.setTimeout(tick, reducedMotion ? 0 : 280);
    };
    tick();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang]);

  useEffect(() => {
    const el = logRef.current;
    if (!el) return;
    if (typeof el.scrollTo === 'function') {
      el.scrollTo({ top: el.scrollHeight, behavior: reducedMotion ? 'auto' : 'smooth' });
    } else {
      el.scrollTop = el.scrollHeight;
    }
  }, [lines, reducedMotion]);

  const run = (raw: string) => {
    const cmd = raw.trim();
    if (!cmd) return;
    push('user', `› ${cmd}`);
    const lower = cmd.toLowerCase();
    const [head, ...rest] = lower.split(/\s+/);
    const arg = rest.join(' ');

    if (head === 'help' || head === '?' || head === 'ayuda' || head === 'ajuda') {
      push(
        'sys',
        [
          'COMANDOS VIVOS',
          '  MYTH / MITO [id]   — estación del romance',
          '  SPEAK / FALA       — narrar estación actual',
          '  STOP              — silenciar narrador',
          '  ATLAS / MUNDOS    — listar mundos',
          '  WARP <id>         — saltar a un mundo',
          '  KISS / BESO       — el núcleo del romance',
          '  BLOOD / SANGUE    — pulso de la máquina',
          '  CLEAR             — limpiar log',
          '  LANG es|en|pt     — (usa controles de voz arriba)',
        ].join('\n')
      );
      return;
    }

    if (head === 'clear' || head === 'cls') {
      setLines([]);
      push('sys', 'Log limpio. La memoria del beso permanece.');
      return;
    }

    if (head === 'kiss' || head === 'beso' || head === 'beijo') {
      const text = MYTH_PULSE.romance[lang];
      push('myth', text);
      onSpeak(text);
      onNavigateStation('traicion');
      return;
    }

    if (head === 'blood' || head === 'sangue' || head === 'sangre') {
      const text = MYTH_PULSE.machine[lang];
      push('blood', text);
      onSpeak(text);
      return;
    }

    if (head === 'stop' || head === 'silence' || head === 'silencio') {
      onStopSpeak();
      push('sys', 'Narrador en silencio.');
      return;
    }

    if (head === 'atlas' || head === 'mundos' || head === 'worlds') {
      WORLD_NODES.forEach((w) => {
        push('sys', `${w.id.padEnd(18)} · ${w.name} · ${w.role}`);
      });
      return;
    }

    if (head === 'warp' || head === 'jump' || head === 'ir') {
      const id = arg || rest[0];
      const world = WORLD_NODES.find((w) => w.id === id || w.name.toLowerCase().includes(id));
      if (!world) {
        push('sys', `Mundo no encontrado: ${id}. Usa ATLAS.`);
        return;
      }
      push('blood', `WARP → ${world.name}`);
      onOpenWorld(world.id);
      return;
    }

    if (head === 'myth' || head === 'mito' || head === 'station' || head === 'estacion') {
      const id = arg || 'traicion';
      const st = stationById(id) || MYTH_STATIONS.find((s) => s.title[lang].toLowerCase().includes(id));
      if (!st) {
        push('sys', `Estación desconocida. Ids: ${MYTH_STATIONS.map((s) => s.id).join(', ')}`);
        return;
      }
      push('myth', `${st.symbol} ${st.title[lang]}\n${st.body[lang]}`);
      onNavigateStation(st.id);
      onSpeak(st.speak[lang]);
      return;
    }

    if (head === 'speak' || head === 'fala' || head === 'habla' || head === 'narrar') {
      const st = stationById(arg) || MYTH_STATIONS[3];
      onSpeak(st.speak[lang]);
      push('sys', `Narrando: ${st.title[lang]}`);
      return;
    }

    // free text → myth response
    push('myth', MYTH_PULSE.romance[lang]);
    onSpeak(MYTH_PULSE.romance[lang]);
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    run(input);
    setInput('');
  };

  return (
    <section className={styles.term} aria-label="Terminal vivo JUDAS_OS">
      <header className={styles.head}>
        <span className={styles.dots} aria-hidden>
          <i /><i /><i />
        </span>
        <span className={styles.title}>JUDAS_OS · TERMINAL VIVO</span>
        <span className={styles.pulse} aria-hidden />
      </header>
      <div ref={logRef} className={styles.log} role="log" aria-live="polite">
        {lines.map((line) => (
          <pre key={line.id} className={styles[line.role]}>{line.text}</pre>
        ))}
      </div>
      <form className={styles.form} onSubmit={onSubmit}>
        <span className={styles.prompt} aria-hidden>›</span>
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className={styles.input}
          placeholder="KISS · MYTH traicion · WARP judas-web · HELP"
          aria-label="Comando del terminal"
          autoComplete="off"
          spellCheck={false}
        />
        <button type="submit" className={styles.go}>ENTER</button>
      </form>
      <div className={styles.quick}>
        {['KISS', 'MYTH traicion', 'BLOOD', 'ATLAS', 'SPEAK', 'HELP'].map((q) => (
          <button key={q} type="button" onClick={() => run(q)}>{q}</button>
        ))}
      </div>
    </section>
  );
}

export function openWorldById(id: string) {
  const world = WORLD_NODES.find((w) => w.id === id);
  if (!world) return;
  const href = worldHref(world);
  if (isExternalWorld(world)) {
    window.open(href, '_blank', 'noopener,noreferrer');
  } else {
    window.location.href = href;
  }
}
