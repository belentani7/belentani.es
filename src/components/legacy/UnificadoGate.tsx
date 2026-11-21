'use client';

import Link from 'next/link';
import { useState } from 'react';
import styles from './UnificadoGate.module.css';

const signatures = [
  { id: 'pedro', name: 'PEDRO', title: 'LA ROCA', color: '#d4af37', description: 'El cuerpo y el ancla. Cuando el sistema tiembla, todavía hay alguien que puede cantar.', href: '/artista' },
  { id: 'marcos', name: 'MARCOS', title: 'EL CRONISTA', color: '#4de8e0', description: 'La memoria observa. El archivo conserva lo ocurrido y deja espacio a lo que sigue siendo pregunta.', href: '/maquina' },
  { id: 'santos', name: 'SANTOS', title: 'LA ANTENA', color: '#a995e9', description: 'La escucha recibe la señal antes de que tenga nombre. El silencio también guarda una frecuencia.', href: '/musica' },
  { id: 'belentani', name: 'BELENTANI', title: 'EL ARTEFACTO', color: '#ff073a', description: 'La herida se convierte en obra. La voz sobrevive a la llave, al espejo y a la máscara de JUDAS.', href: '/judas' },
  { id: 'human', name: 'THE HUMAN', title: 'LA INTERFAZ', color: '#f4f0f2', description: 'El cuerpo y la vida presente. La ficción respira porque su autor y su comunidad siguen aquí.', href: '/galaxia' },
] as const;

export default function UnificadoGate() {
  const [selected, setSelected] = useState<(typeof signatures)[number]['id']>('belentani');
  const [visited, setVisited] = useState<string[]>(['belentani']);
  const active = signatures.find((item) => item.id === selected) ?? signatures[3];

  function select(id: (typeof signatures)[number]['id']) {
    setSelected(id);
    setVisited((current) => current.includes(id) ? current : [...current, id]);
  }

  return <main className={styles.gate} style={{ ['--signature-color' as string]: active.color }}>
    <a className={styles.skip} href="#codice">Saltar al códice</a>
    <div className={styles.grain} aria-hidden="true" />
    <header className={styles.header}>
      <Link href="/" className={styles.brand}>BELENTANI<span> / PUERTA MAESTRA</span></Link>
      <nav aria-label="Rutas del universo">
        <Link href="/judas">JUDAS</Link><Link href="/maquina">MÁQUINA</Link><Link href="/musica">MÚSICA</Link>
      </nav>
    </header>

    <section className={styles.hero} aria-labelledby="gate-title">
      <div className={styles.artifact} aria-hidden="true">
        <div className={styles.orbitA} /><div className={styles.orbitB} />
        <div className={styles.planet} /><div className={styles.diamond} /><div className={styles.key} />
      </div>
      <div className={styles.heroCopy}>
        <p>JUDAS-CORE-07 <span>◇</span> TRANSMISIÓN ABIERTA</p>
        <h1 id="gate-title">LA LLAVE<br /><em>NO ERA LA SALIDA.</em></h1>
        <p>Una ficción de música, memoria y transformación. El planeta, el diamante y la máquina son interfaces de una misma voz.</p>
        <a href="#codice">ACTIVAR EL CÓDICE <span aria-hidden="true">↓</span></a>
      </div>
      <span className={styles.coordinates}>NÚCLEO / ZION / 432 HZ</span>
    </section>

    <section id="codice" className={styles.codex} aria-labelledby="codex-title">
      <div className={styles.intro}>
        <p>PROTOCOLO / 05 FIRMAS</p>
        <h2 id="codex-title">SER MUCHOS PARA<br /><em>SEGUIR SIENDO UNO.</em></h2>
        <span>Explora las cinco funciones del relato. Son capas simbólicas, no identidades biográficas separadas.</span>
      </div>
      <div className={styles.interface}>
        <div className={styles.five} role="group" aria-label="Firmas del códice">
          {signatures.map((item, index) => <button key={item.id} type="button" aria-pressed={selected === item.id} onClick={() => select(item.id)} style={{ ['--local-color' as string]: item.color }}>
            <span>{String(index + 1).padStart(2, '0')} / {item.title}</span><strong>{item.name}</strong><i aria-hidden="true">◇</i>
          </button>)}
        </div>
        <div className={styles.readout} role="status" aria-live="polite">
          <span>FIRMA / {String(signatures.findIndex((item) => item.id === selected) + 1).padStart(2, '0')}</span>
          <div className={styles.emblem} aria-hidden="true">◇</div>
          <h3>{active.name}</h3><p className={styles.role}>{active.title}</p>
          <p>{active.description}</p>
          <Link href={active.href}>ATRAVESAR ESTA PUERTA ↗</Link>
          <small>{visited.length}/05 FIRMAS EXPLORADAS</small>
        </div>
      </div>
    </section>

    <section className={styles.ending} aria-labelledby="ending-title">
      <p>LA CRÓNICA / LA LLAVE DORADA</p>
      <h2 id="ending-title">MI VOZ NADIE<br /><em>ME LA ARREBATA.</em></h2>
      <div><Link href="/judas">ENTRAR EN LOS SEIS CAPÍTULOS ↗</Link><Link href="/maquina">ABRIR EL NÚCLEO ↗</Link><Link href="/">VOLVER AL UNIVERSO ↗</Link></div>
    </section>
  </main>;
}
