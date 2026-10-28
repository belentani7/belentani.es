'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { VOYAGE_PLACES } from '@/lib/voyage-places';
import { useReducedMotion } from '@/hooks/useReducedMotion';
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
      if (event.altKey || event.ctrlKey || event.metaKey || (event.target instanceof HTMLElement && event.target.closest('input, textarea, select, button, a, [contenteditable="true"]'))) return;
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
      <ShipTrailCanvas />
      <div className={styles.vignette} aria-hidden="true" />
      <header className={styles.header}>
        <Link href="/artista" className={styles.brand} aria-label="Ir a la página del artista">B<span>7</span>.</Link>
        <span className={styles.headerName}>BELENTANI / ATLAS VIVO</span>
        <nav className={styles.headerLinks} aria-label="Accesos principales"><Link href="/artista">ARTISTA</Link><Link href="/musica">MÚSICA</Link><Link href="/studio-creativo" className={styles.return}>CREAR <span aria-hidden="true">↗</span></Link></nav>
      </header>
      <section className={styles.intro} aria-labelledby="voyage-title">
        <p className={styles.kicker}>01 / UNIVERSO NAVEGABLE · {String(VOYAGE_PLACES.length).padStart(2, '0')} SISTEMAS</p>
        <h1 id="voyage-title">ATRAVIESA<br /><em>LA GALAXIA.</em></h1>
        <p>Belentani: artista y compositor de São Paulo, establecido en Barcelona. Pop oscuro, R&amp;B, electrónica y JUDAS EXPERIENCE. Un universo de música, imagen y mundos creativos que puedes recorrer.</p>
        <div className={styles.actions}>
          <button type="button" onClick={overview}>VISTA GENERAL <span aria-hidden="true">◎</span></button>
          <span>ARRASTRA · ACERCA · SELECCIONA · VIAJA</span>
        </div>
        <div className={styles.portalActions}>
          <Link href="/studio-creativo">✦ ESTUDIO GENERATIVO <span aria-hidden="true">↗</span></Link>
          <Link href="/musica">ESCUCHAR LA OBRA <span aria-hidden="true">↗</span></Link>
          <Link href="/artista">CONOCER AL ARTISTA <span aria-hidden="true">↗</span></Link>
        </div>
      </section>
      <aside className={styles.active} aria-live="polite" style={{ ['--system-color' as string]: selected.accent }}>
        <span className={styles.activeLabel}>TRANSMISIÓN / {String(VOYAGE_PLACES.indexOf(selected) + 1).padStart(2, '0')}</span>
        <strong>{selected.title}</strong>
        <p>{selected.tagline}</p>
        {selected.sourceRepo && <small>{selected.sourceRepo}</small>}
        <Link href={selected.url ?? "/"}>ENTRAR EN ESTE MUNDO <span aria-hidden="true">↗</span></Link>
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
      <div className={styles.reactiveStatus} role="status" aria-live="polite"><span aria-hidden="true">◉</span> SISTEMA REACTIVO · {focusId ? "TRAYECTORIA FIJADA" : "ÓRBITA LIBRE"} · {selected.title}</div>
    </main>
  );
}

interface Trail {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
}

const TRAIL_COLORS = ['#ff073a', '#d4af37', '#4de8e0', '#b9a4ff', '#f4f0f2'];

function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function ShipTrailCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || reduced) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.floor(window.innerWidth * pixelRatio);
      canvas.height = Math.floor(window.innerHeight * pixelRatio);
      canvas.style.width = '100%';
      canvas.style.height = '100%';
      ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    };
    resize();

    const trails: Trail[] = [];
    let seed = 24102026;
    const random = () => {
      seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
      return seed / 4294967296;
    };

    const draw = () => {
      ctx.fillStyle = 'rgba(3, 2, 8, 0.035)';
      ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

      if (random() < 0.045 && trails.length < 28) {
        const angle = -0.35 + random() * 0.95;
        const speed = random() * 2.6 + 1.4;
        trails.push({
          x: -60 + random() * window.innerWidth * 0.18,
          y: random() * window.innerHeight,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 0,
          maxLife: random() * 110 + 70,
          color: TRAIL_COLORS[Math.floor(random() * TRAIL_COLORS.length)],
        });
      }

      for (let i = trails.length - 1; i >= 0; i--) {
        const trail = trails[i];
        const alpha = 1 - trail.life / trail.maxLife;
        const gradient = ctx.createLinearGradient(
          trail.x,
          trail.y,
          trail.x - trail.vx * 38,
          trail.y - trail.vy * 38
        );
        gradient.addColorStop(0, hexToRgba(trail.color, alpha * 0.82));
        gradient.addColorStop(1, 'rgba(0,0,0,0)');

        ctx.strokeStyle = gradient;
        ctx.lineWidth = 1.4 + alpha * 1.7;
        ctx.lineCap = 'round';
        ctx.shadowBlur = 22;
        ctx.shadowColor = trail.color;
        ctx.beginPath();
        ctx.moveTo(trail.x, trail.y);
        ctx.lineTo(trail.x - trail.vx * 42, trail.y - trail.vy * 42);
        ctx.stroke();
        ctx.shadowBlur = 0;

        trail.x += trail.vx;
        trail.y += trail.vy;
        trail.life += 1;

        if (trail.life >= trail.maxLife || trail.x > window.innerWidth + 120 || trail.y < -120 || trail.y > window.innerHeight + 120) {
          trails.splice(i, 1);
        }
      }

      animationRef.current = requestAnimationFrame(draw);
    };

    window.addEventListener('resize', resize);
    animationRef.current = requestAnimationFrame(draw);

    return () => {
      if (animationRef.current !== null) cancelAnimationFrame(animationRef.current);
      window.removeEventListener('resize', resize);
    };
  }, [reduced]);

  return <canvas ref={canvasRef} className={styles.trails} aria-hidden="true" />;
}
