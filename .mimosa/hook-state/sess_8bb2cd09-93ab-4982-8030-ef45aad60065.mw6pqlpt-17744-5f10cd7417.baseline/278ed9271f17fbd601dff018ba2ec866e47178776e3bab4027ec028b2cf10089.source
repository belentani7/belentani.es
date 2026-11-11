'use client';

import Link from 'next/link';
import { FormEvent, useEffect, useRef, useState } from 'react';
import {
  NOIACORE_CAPABILITIES,
  NOIACORE_COMMANDS,
  NOIACORE_DESCRIPTION,
  NOIACORE_OFFERS,
  NOIACORE_SIGNAL_MATRIX,
  NOIACORE_SOURCES,
  NOIACORE_TAGLINE,
} from '@/lib/noiacore-consultancy';
import styles from './NoiacoreConsultancy.module.css';

interface TerminalLine {
  readonly kind: 'system' | 'user' | 'core';
  readonly text: string;
}

export interface NoiacoreConsultancyProps {
  readonly entry?: 'consultoria' | 'agency' | 'noiacore';
}

const initialLines: readonly TerminalLine[] = [
  { kind: 'system', text: 'NOIACORE terminal iniciado. Modo consultoria / SaaS / noir.' },
  { kind: 'core', text: 'Escribe help, status, saas, noir, caballo, repos, voz o contacto.' },
];

function resolveCommand(rawCommand: string): readonly string[] {
  const command = rawCommand.trim().toLowerCase();
  if (!command || command === 'help' || command === 'ayuda' || command === '?') {
    return [
      'Comandos: ' + NOIACORE_COMMANDS.join(' · '),
      'La terminal responde con memoria curada de NOIACORE, repos fuente y oferta comercial.',
    ];
  }
  if (command === 'status') {
    return [
      'Estado: consultoria activada como frontend publico de autoridad.',
      'Ruta: memoria NOIACORE → interfaz noir → terminal → SaaS launchpad → contacto.',
    ];
  }
  if (command === 'noiacore' || command === 'core') {
    return [
      NOIACORE_DESCRIPTION,
      NOIACORE_TAGLINE,
    ];
  }
  if (command === 'saas' || command === 'plasma') {
    return [
      'SaaS Plasma se usa como paquete de producto: auditoria, blueprint y sprint de construccion.',
      'La promesa comercial queda clara: convertir sistemas internos en una plataforma vendible.',
    ];
  }
  if (command === 'noir' || command === 'glass') {
    return [
      'Lenguaje visual: negro absoluto, vidrio rojo, luz al 3%, grano cinematografico, terminal y brillo de diamante.',
      'El repositorio de iconos noir se toma como referencia visual; la pagina publica usa lenguaje propio: cinematic noir glass.',
    ];
  }
  if (command === 'repos') {
    return NOIACORE_SOURCES.map((source) => source.name + ': ' + source.role + '.');
  }
  if (command === 'caballo' || command === 'horse' || command === 'stallion') {
    return [
      'BLACK STALLION: fuerza soberana, elegancia oscura, control silencioso.',
      'La marca usa una silueta procedural para evitar exponer una foto privada sin verificacion final.',
    ];
  }
  if (command === 'brief' || command.startsWith('brief ')) {
    const target = command.replace('brief', '').trim();
    const match = NOIACORE_SIGNAL_MATRIX.find((item) =>
      item.phase.includes(target) || item.claim.toLowerCase().includes(target) || item.command.endsWith(target)
    ) ?? NOIACORE_SIGNAL_MATRIX[0];
    return [
      match.phase.toUpperCase(),
      'Claim: ' + match.claim,
      'Proof: ' + match.proof,
      'Output: ' + match.output,
    ];
  }
  if (command === 'matriz' || command === 'matrix') {
    return NOIACORE_SIGNAL_MATRIX.map((item) => item.phase + ' -> ' + item.output);
  }
  if (command === 'pack' || command === 'paquete') {
    return NOIACORE_OFFERS.map((offer) => offer.title + ': ' + offer.deliverable);
  }
  if (command === 'judas') {
    return [
      'Easter egg: la obra no se separa de la empresa; se convierte en lenguaje de mando.',
      'JUDAS aporta mito, NOIACORE aporta arquitectura, Belentani firma la maquina.',
    ];
  }
  if (command === 'lambda' || command === 'Λ') {
    return [
      'Λ = el core invisible. No adorna: ordena, filtra y ejecuta.',
      'Cuando el simbolo aparece, la terminal entra en modo de decision.',
    ];
  }
  if (command === 'contacto' || command === 'contact') {
    return [
      'Contacto publico: belentani7studio@proton.me',
      'Canal social publico: @belentani_',
    ];
  }
  if (command === 'voz' || command === 'voice') {
    return [
      'Intentando activar una voz del navegador que no sea Microsoft.',
      'Si el navegador no ofrece una voz compatible, la terminal queda en modo texto.',
    ];
  }
  return [
    'Comando no reconocido: ' + rawCommand,
    'Prueba help para ver rutas de mando disponibles.',
  ];
}

function speakWithoutMicrosoft(message: string): boolean {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return false;
  const synth = window.speechSynthesis;
  const voices = synth.getVoices().filter((voice) => !/microsoft/i.test(voice.name));
  const preferred =
    voices.find((voice) => /es|spanish|espanol|español|google|monica|paulina|jorge|diego/i.test(voice.lang + ' ' + voice.name)) ??
    voices[0];
  if (!preferred) return false;
  const utterance = new SpeechSynthesisUtterance(message);
  utterance.voice = preferred;
  utterance.lang = preferred.lang || 'es-ES';
  utterance.rate = 0.86;
  utterance.pitch = 0.72;
  synth.cancel();
  synth.speak(utterance);
  return true;
}

function BlackStallionMark() {
  return (
    <svg className={styles.horseSvg} viewBox="0 0 900 540" role="img" aria-labelledby="black-stallion-title">
      <title id="black-stallion-title">Caballo negro translúcido sobre luz roja noir</title>
      <defs>
        <radialGradient id="horseGlow" cx="52%" cy="43%" r="62%">
          <stop offset="0%" stopColor="#ff385d" stopOpacity="0.72" />
          <stop offset="42%" stopColor="#7a0e1a" stopOpacity="0.32" />
          <stop offset="100%" stopColor="#020104" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="horseBody" x1="18%" x2="86%" y1="18%" y2="84%">
          <stop offset="0%" stopColor="#2f3035" />
          <stop offset="36%" stopColor="#09090d" />
          <stop offset="70%" stopColor="#000" />
          <stop offset="100%" stopColor="#3a0b14" />
        </linearGradient>
        <linearGradient id="horseEdge" x1="0%" x2="100%" y1="0%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.78" />
          <stop offset="42%" stopColor="#ff4166" stopOpacity="0.62" />
          <stop offset="100%" stopColor="#d4af37" stopOpacity="0.5" />
        </linearGradient>
        <filter id="horseShadow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="7" result="blur" />
          <feColorMatrix in="blur" type="matrix" values="1 0 0 0 0.95 0 0.08 0 0 0.02 0 0 0.08 0 0.12 0 0 0 0.62 0" />
          <feBlend in="SourceGraphic" mode="screen" />
        </filter>
      </defs>
      <rect width="900" height="540" fill="url(#horseGlow)" opacity="0.42" />
      <path className={styles.horseMist} d="M93 389 C190 333 268 374 353 346 C493 300 595 295 794 336" />
      <g filter="url(#horseShadow)">
        <path className={styles.horseBody} d="M186 318 C246 220 345 186 478 201 C595 214 677 184 737 106 C750 90 783 105 779 131 C770 186 739 239 688 275 C644 306 596 325 536 331 C465 339 413 324 353 342 C291 361 238 367 186 318 Z" />
        <path className={styles.horseBody} d="M682 129 C711 74 759 50 806 42 C817 40 823 54 816 63 C791 92 785 123 789 159 C793 198 782 236 744 265 C715 285 684 276 682 246 C678 204 661 167 682 129 Z" />
        <path className={styles.horseMane} d="M682 128 C647 154 633 197 642 238 C606 212 591 172 600 130 C621 146 649 146 682 128 Z" />
        <path className={styles.horseLeg} d="M330 332 C305 378 290 421 281 488 C279 504 250 505 252 486 C259 417 273 367 298 326 Z" />
        <path className={styles.horseLeg} d="M424 330 C435 384 447 426 459 489 C462 506 433 511 428 493 C412 430 397 382 383 328 Z" />
        <path className={styles.horseLeg} d="M574 324 C604 370 625 416 642 487 C646 504 617 511 611 493 C592 430 568 381 533 328 Z" />
        <path className={styles.horseLeg} d="M636 302 C674 344 710 393 739 467 C746 484 719 496 710 479 C681 421 647 373 602 322 Z" />
        <path className={styles.horseTail} d="M190 315 C114 301 74 248 51 187 C100 214 148 221 211 224 C185 249 177 281 190 315 Z" />
        <path className={styles.horseEye} d="M759 104 C767 102 773 106 776 113 C767 118 759 116 754 110 C755 107 757 105 759 104 Z" />
      </g>
      <path className={styles.horseLine} d="M176 320 C276 220 382 188 506 209 C606 226 690 190 756 93" />
      <path className={styles.horseLineThin} d="M93 389 C217 346 280 374 382 336 C505 291 631 296 794 336" />
    </svg>
  );
}

export default function NoiacoreConsultancy({ entry = 'consultoria' }: NoiacoreConsultancyProps) {
  const [lines, setLines] = useState<readonly TerminalLine[]>(initialLines);
  const [value, setValue] = useState('');
  const logRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let animation: { revert: () => void } | undefined;
    let cancelled = false;
    void Promise.all([import('gsap'), import('gsap/ScrollTrigger')]).then(([{ gsap }, { ScrollTrigger }]) => {
      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger);
      animation = gsap.context(() => {
        gsap.utils.toArray<HTMLElement>('[data-noia-reveal]').forEach((element) => {
          gsap.fromTo(element, { autoAlpha: 0.28, y: 38 }, {
            autoAlpha: 1,
            y: 0,
            duration: 0.9,
            ease: 'power3.out',
            scrollTrigger: { trigger: element, start: 'top 88%', once: true },
          });
        });
      });
    });
    return () => {
      cancelled = true;
      animation?.revert();
    };
  }, []);

  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight, behavior: 'smooth' });
  }, [lines]);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const command = value.trim();
    if (!command) return;
    setValue('');
    if (command.toLowerCase() === 'clear') {
      setLines(initialLines);
      return;
    }
    const response = resolveCommand(command);
    const next: TerminalLine[] = [
      { kind: 'user', text: 'pedro@noiacore $ ' + command },
      ...response.map((text) => ({ kind: 'core' as const, text })),
    ];
    if (command.toLowerCase() === 'voz' || command.toLowerCase() === 'voice') {
      const spoken = speakWithoutMicrosoft(NOIACORE_TAGLINE + '. NOIACORE consultoria activada.');
      next.push({
        kind: 'system',
        text: spoken ? 'Voz no Microsoft activada desde el navegador.' : 'No hay voz compatible disponible en este navegador.',
      });
    }
    setLines((current) => [...current, ...next]);
  }

  return (
    <main className={styles.page}>
      <div className={styles.ambient} aria-hidden="true">
        <span className={styles.orbOne} />
        <span className={styles.orbTwo} />
        <span className={styles.gridOverlay} />
      </div>

      <header className={styles.header}>
        <Link href="/" className={styles.brand} aria-label="Volver al universo Belentani">
          <span className={styles.brandMark}>Λ</span>
          <span>NOIACORE</span>
        </Link>
        <nav className={styles.nav} aria-label="Navegacion NOIACORE">
          <Link href="/galaxia">Galaxia</Link>
          <a href="#terminal">Terminal</a>
          <a href="#repos">Repos</a>
          <a href="mailto:belentani7studio@proton.me">Contacto</a>
        </nav>
      </header>

      <section className={styles.hero} aria-labelledby="noiacore-title">
        <div className={styles.heroCopy}>
          <p className={styles.eyebrow}><span className={styles.live} /> CONSULTORIA IA · SAAS · NOIR SYSTEMS</p>
          <h1 id="noiacore-title">NOIACORE construye sistemas inteligentes con autoridad visual.</h1>
          <p className={styles.lead}>{NOIACORE_DESCRIPTION}</p>
          <p className={styles.tagline}>{NOIACORE_TAGLINE}</p>
          <div className={styles.heroActions}>
            <a className={styles.primary} href="#terminal">Abrir terminal <span aria-hidden="true">↗</span></a>
            <a className={styles.secondary} href="mailto:belentani7studio@proton.me">Solicitar audit <span aria-hidden="true">↗</span></a>
          </div>
          <div className={styles.proofGrid} aria-label="Resumen de contexto recuperado">
            <span><strong>481</strong> repos en ecosistema</span>
            <span><strong>NOIACORE</strong> HTML real localizado</span>
            <span><strong>SaaS</strong> Plasma como empaquetado</span>
            <span><strong>Noir</strong> glass y terminal</span>
          </div>
        </div>

        <aside className={styles.horsePanel} aria-label="Arquetipo caballo negro">
          <span className={styles.horseTopline}>BLACK STALLION / SOVEREIGN FORCE</span>
          <div className={styles.horseFrame}>
            <BlackStallionMark />
          </div>
          <div className={styles.horseStats}>
            <span>Fuerza controlada</span>
            <span>Lujo oscuro</span>
            <span>Rim light rojo</span>
          </div>
        </aside>
      </section>

      <section className={styles.section} data-noia-reveal>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionLabel}>DESCRIPCION / 001</span>
          <h2>Consultoria que se convierte en plataforma.</h2>
        </div>
        <div className={styles.manifesto}>
          <p>NOIACORE no vende decoracion de IA. Diseña el sistema entero: diagnostico, arquitectura, agentes, consola, marca, evidencia y primer producto vendible.</p>
          <p>La pagina toma el HTML real de NOIACORE, el terminal del observador, el lenguaje noir glass, SaaS Plasma y el arquetipo del caballo negro para crear una presencia que denota notoriedad antes de que el usuario lea la oferta.</p>
        </div>
      </section>

      <section className={styles.section} data-noia-reveal>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionLabel}>CAPACIDADES / 002</span>
          <h2>Cuatro brazos de ejecucion.</h2>
        </div>
        <div className={styles.capabilityGrid}>
          {NOIACORE_CAPABILITIES.map((item) => (
            <article className={styles.capabilityCard} key={item.number}>
              <span className={styles.cardNumber}>{item.number}</span>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              <ul className={styles.tags} aria-label={'Tags de ' + item.title}>
                {item.tags.map((tag) => <li key={tag}>{tag}</li>)}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.section} data-noia-reveal>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionLabel}>SAAS / 003</span>
          <h2>Oferta clara para vender y construir.</h2>
        </div>
        <div className={styles.offerGrid}>
          {NOIACORE_OFFERS.map((offer, index) => (
            <article className={styles.offerCard} key={offer.title}>
              <span>{String(index + 1).padStart(2, '0')}</span>
              <h3>{offer.title}</h3>
              <strong>{offer.subtitle}</strong>
              <p>{offer.deliverable}</p>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.section} data-noia-reveal>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionLabel}>NOTORIEDAD / 004</span>
          <h2>Una maquina que explica por que impone presencia.</h2>
        </div>
        <div className={styles.signalMatrix}>
          {NOIACORE_SIGNAL_MATRIX.map((signal) => (
            <article className={styles.signalCard} key={signal.phase}>
              <span>{signal.phase}</span>
              <h3>{signal.claim}</h3>
              <p>{signal.proof}</p>
              <strong>{signal.output}</strong>
              <code>{signal.command}</code>
            </article>
          ))}
        </div>
      </section>

      <section id="terminal" className={styles.terminalSection} data-noia-reveal aria-labelledby="terminal-title">
        <div className={styles.sectionHeader}>
          <span className={styles.sectionLabel}>TERMINAL / 004</span>
          <h2 id="terminal-title">Una consola comercial con memoria de repos.</h2>
        </div>
        <div className={styles.terminalShell}>
          <div className={styles.terminalTop}>
            <span>NOIACORE OBSERVER</span>
            <span>{entry.toUpperCase()} MODE</span>
          </div>
          <div className={styles.terminalLog} ref={logRef} role="log" aria-live="polite">
            {lines.map((line, index) => (
              <p key={index} className={line.kind === 'user' ? styles.lineUser : line.kind === 'system' ? styles.lineSystem : styles.lineCore}>
                {line.text}
              </p>
            ))}
          </div>
          <form className={styles.prompt} onSubmit={submit}>
            <label htmlFor="noiacore-command">Comando NOIACORE</label>
            <span aria-hidden="true">λ</span>
            <input
              id="noiacore-command"
              value={value}
              onChange={(event) => setValue(event.currentTarget.value)}
              placeholder="help / matriz / brief system / pack / caballo / repos / voz"
              autoComplete="off"
            />
            <button type="submit">RUN</button>
          </form>
        </div>
      </section>

      <section id="repos" className={styles.section} data-noia-reveal>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionLabel}>REPOS FUENTE / 005</span>
          <h2>Uso trazado de la familia.</h2>
        </div>
        <div className={styles.sourceGrid}>
          {NOIACORE_SOURCES.map((source) => (
            <article className={styles.sourceCard} key={source.name}>
              <span className={source.status === 'embedded' ? styles.statusEmbedded : source.status === 'candidate' ? styles.statusCandidate : styles.statusReference}>
                {source.status}
              </span>
              <h3>{source.name}</h3>
              <strong>{source.role}</strong>
              <p>{source.evidence}</p>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.stallionDoctrine} data-noia-reveal>
        <span>BLACK STALLION DOCTRINE</span>
        <p>Caballo negro, fondo negro, vidrio rojo, mirada baja. La marca entra como presencia soberana: no grita, domina la sala.</p>
      </section>

      <section className={styles.cta} data-noia-reveal>
        <p>NOIACORE / BELENTANI AGENCY</p>
        <h2>Deja que la maquina haga visible lo que tu empresa todavia no sabe ordenar.</h2>
        <a href="mailto:belentani7studio@proton.me">Activar consultoria <span aria-hidden="true">↗</span></a>
      </section>

      <footer className={styles.footer}>
        <Link href="/">Belentani Universe</Link>
        <Link href="/galaxia">Galaxia navegable</Link>
        <a href="https://www.instagram.com/belentani_">@belentani_</a>
      </footer>
    </main>
  );
}
