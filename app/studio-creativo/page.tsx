'use client';

import Link from 'next/link';
import { useMemo, useRef, useState } from 'react';
import styles from './page.module.css';

type Palette = 'carmesi' | 'oro' | 'aurora';
const PALETTES: Record<Palette, { light: string; mid: string; haze: string; label: string }> = {
  carmesi: { light: '#ff365d', mid: '#ff073a', haze: '#7d103c', label: 'Carmesí JUDAS' },
  oro: { light: '#ffe7af', mid: '#db9a52', haze: '#874627', label: 'Oro escénico' },
  aurora: { light: '#e4d9ff', mid: '#7de4d6', haze: '#36346c', label: 'Aurora nocturna' },
};
type Star = { x: number; y: number; r: number; opacity: number };
type Orbit = { cx: number; cy: number; r: number; angle: number; opacity: number };

function seededRandom(seed: number) {
  let value = seed >>> 0;
  return () => {
    value = (Math.imul(value, 1664525) + 1013904223) >>> 0;
    return value / 4294967296;
  };
}
export function createGalaxy(seed: number, stars: number, complexity: number) {
  const random = seededRandom(seed);
  const points: Star[] = Array.from({ length: stars }, () => ({
    x: Math.round(random() * 1600), y: Math.round(random() * 1600),
    r: Number((.4 + random() * 2.2).toFixed(2)),
    opacity: Number((.28 + random() * .7).toFixed(2)),
  }));
  const orbits: Orbit[] = Array.from({ length: complexity }, (_, i) => ({
    cx: 800 + (random() - .5) * 340,
    cy: 790 + (random() - .5) * 280,
    r: 130 + i * 54 + random() * 80,
    angle: random() * 180,
    opacity: .15 + random() * .35,
  }));
  return { points, orbits };
}

function downloadFile(href: string, filename: string) {
  const anchor = document.createElement('a');
  anchor.href = href;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
}

export default function StudioCreativo() {
  const [seed, setSeed] = useState(20261028);
  const [density, setDensity] = useState(210);
  const [complexity, setComplexity] = useState(7);
  const [palette, setPalette] = useState<Palette>('carmesi');
  const [feedback, setFeedback] = useState('Motor local preparado · tu obra se genera en este navegador.');
  const [generation, setGeneration] = useState(1);
  const svgRef = useRef<SVGSVGElement>(null);
  const colors = PALETTES[palette];
  const scene = useMemo(() => createGalaxy(seed, density, complexity), [seed, density, complexity]);

  const regenerate = () => {
    setSeed((current) => ((Math.imul(current, 1664525) + 1013904223) >>> 0));
    setGeneration((current) => current + 1);
    setFeedback('Nueva composición generada; el patrón anterior no se ha reutilizado.');
  };
  const serialize = () => {
    if (!svgRef.current) return null;
    const clone = svgRef.current.cloneNode(true) as SVGSVGElement;
    clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    clone.setAttribute('width', '1600');
    clone.setAttribute('height', '1600');
    return new XMLSerializer().serializeToString(clone);
  };
  const exportArtwork = (format: 'svg' | 'png') => {
    const xml = serialize();
    if (!xml) { setFeedback('No se ha podido preparar la imagen.'); return; }
    const url = URL.createObjectURL(new Blob([xml], { type: 'image/svg+xml;charset=utf-8' }));
    const filename = `belentani-cosmos-${seed}`;
    if (format === 'svg') {
      downloadFile(url, filename + '.svg');
      window.setTimeout(() => URL.revokeObjectURL(url), 1500);
      setFeedback('SVG vectorial exportado · 1600 × 1600.');
      return;
    }
    const image = new Image();
    image.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 1600; canvas.height = 1600;
      const context = canvas.getContext('2d');
      if (!context) { setFeedback('PNG no disponible en este navegador. Utiliza SVG.'); URL.revokeObjectURL(url); return; }
      context.drawImage(image, 0, 0, 1600, 1600);
      downloadFile(canvas.toDataURL('image/png'), filename + '.png');
      URL.revokeObjectURL(url);
      setFeedback('PNG 1600 × 1600 exportado.');
    };
    image.onerror = () => { URL.revokeObjectURL(url); setFeedback('No se pudo rasterizar; exporta como SVG.'); };
    image.src = url;
  };
  const copyRecipe = async () => {
    const recipe = `BELENTANI COSMOS // semilla ${seed} // paleta ${colors.label} // estrellas ${density} // órbitas ${complexity}. Arte galáctico procedural reproducible; luces difusas, negro profundo y movimiento orbital.`;
    try { await navigator.clipboard.writeText(recipe); setFeedback('Receta reproducible copiada al portapapeles.'); }
    catch { setFeedback('Copia no disponible en este navegador. Puedes anotar la semilla y los parámetros.'); }
  };

  return (
    <main className={styles.studio}>
      <div className={styles.ambient} aria-hidden="true" />
      <header className={styles.header}>
        <Link href="/" className={styles.logo}>B<span>7</span> / COSMOS LAB</Link>
        <nav aria-label="Navegación del estudio">
          <Link href="/">Galaxia</Link>
          <Link href="/artista">Artista</Link>
          <Link href="/musica">Música</Link>
        </nav>
      </header>
      <section className={styles.hero} aria-labelledby="studio-title">
        <p className={styles.kicker}>BELENTANI · LABORATORIO CREATIVO / 01</p>
        <h1 id="studio-title">CREA TU<br /><em>PROPIO COSMOS.</em></h1>
        <p>Un generador artístico real, interactivo y reproducible. Controla el universo en directo y exporta tu creación. Procesamiento local, sin registro, sin claves y sin simular una IA remota.</p>
      </section>
      <section className={styles.workspace} aria-label="Editor generativo">
        <div className={styles.artPanel}>
          <div className={styles.artHeader}><span>LIENZO / 1600 × 1600</span><span className={styles.live}>● GENERACIÓN {generation}</span></div>
          <svg ref={svgRef} role="img" aria-label="Galaxia procedural generada a partir de los controles" viewBox="0 0 1600 1600" xmlns="http://www.w3.org/2000/svg" className={styles.artwork}>
            <defs>
              <radialGradient id="cosmos-bg" cx="50%" cy="47%" r="74%">
                <stop offset="0%" stopColor="#1f0b19" /><stop offset="58%" stopColor="#08040f" /><stop offset="100%" stopColor="#020106" />
              </radialGradient>
              <radialGradient id="cosmos-halo"><stop offset="0%" stopColor={colors.mid} stopOpacity=".8"/><stop offset="35%" stopColor={colors.haze} stopOpacity=".35"/><stop offset="100%" stopColor={colors.haze} stopOpacity="0"/></radialGradient>
              <radialGradient id="cosmos-core"><stop offset="0%" stopColor="#fffaf4"/><stop offset="18%" stopColor={colors.light}/><stop offset="52%" stopColor={colors.mid}/><stop offset="100%" stopColor={colors.haze} stopOpacity="0"/></radialGradient>
              <filter id="cosmos-glow"><feGaussianBlur stdDeviation="13"/></filter>
            </defs>
            <rect width="1600" height="1600" fill="url(#cosmos-bg)"/>
            <ellipse cx="810" cy="805" rx="780" ry="520" fill="url(#cosmos-halo)" transform="rotate(-24 810 805)"/>
            <ellipse cx="750" cy="850" rx="700" ry="240" fill="url(#cosmos-halo)" transform="rotate(46 750 850)" opacity=".7"/>
            {scene.points.map((star, i) => <circle key={i} cx={star.x} cy={star.y} r={star.r} opacity={star.opacity} fill={i % 9 === 0 ? colors.light : '#f8f3f5'} />)}
            {scene.orbits.map((orbit, i) => <ellipse key={i} cx={orbit.cx} cy={orbit.cy} rx={orbit.r * 1.28} ry={orbit.r * .42} fill="none" stroke={i % 2 ? colors.light : colors.mid} strokeWidth={i % 3 ? '1.4' : '3'} strokeOpacity={orbit.opacity} transform={`rotate(${orbit.angle} ${orbit.cx} ${orbit.cy})`} />)}
            <circle cx="800" cy="795" r="175" fill={colors.mid} opacity=".35" filter="url(#cosmos-glow)" />
            <circle cx="800" cy="795" r="225" fill="url(#cosmos-core)" />
            <circle cx="800" cy="795" r="45" fill="#fff5f6" opacity=".91"/>
            <text x="800" y="1515" fill="#ffffff" fontFamily="Arial, sans-serif" letterSpacing="15" fontSize="29" textAnchor="middle">BELENTANI / COSMOS</text>
            <text x="800" y="1558" fill={colors.light} fontFamily="monospace" letterSpacing="7" fontSize="17" textAnchor="middle">SEED {seed}</text>
          </svg>
          <p className={styles.artNote}>Composición original generada matemáticamente; cada cambio actualiza la obra.</p>
        </div>
        <div className={styles.controls}>
          <span className={styles.overline}>SISTEMA REACTIVO / PARÁMETROS</span>
          <h2>Diseña la atmósfera.</h2>
          <p>Los controles transforman la pieza en tiempo real. La semilla permite reproducir el resultado.</p>
          <fieldset className={styles.palettes}>
            <legend>Temperatura cromática</legend>
            {(Object.keys(PALETTES) as Palette[]).map((key) => (
              <button key={key} type="button" className={palette === key ? styles.chosen : ''} onClick={() => { setPalette(key); setFeedback('Paleta actualizada en directo.'); }} aria-pressed={palette === key}>
                <span style={{ background: PALETTES[key].mid }} />{PALETTES[key].label}
              </button>
            ))}
          </fieldset>
          <label className={styles.controlLine} htmlFor="cosmos-stars">Densidad de estrellas <output>{density}</output></label>
          <input id="cosmos-stars" type="range" min="40" max="560" step="10" value={density} onChange={(e) => setDensity(Number(e.target.value))} />
          <label className={styles.controlLine} htmlFor="cosmos-rings">Complejidad orbital <output>{complexity}</output></label>
          <input id="cosmos-rings" type="range" min="1" max="16" step="1" value={complexity} onChange={(e) => setComplexity(Number(e.target.value))} />
          <label className={styles.controlLine} htmlFor="cosmos-seed">Semilla creativa <output>{seed}</output></label>
          <input id="cosmos-seed" type="number" min="0" max="4294967295" step="1" value={seed} onChange={(e) => setSeed(Math.max(0, Math.min(4294967295, Number(e.target.value) || 0)))} />
          <div className={styles.actions}>
            <button type="button" className={styles.primary} onClick={regenerate}>✦ GENERAR OTRA</button>
            <button type="button" onClick={() => exportArtwork('png')}>EXPORTAR PNG</button>
            <button type="button" onClick={() => exportArtwork('svg')}>EXPORTAR SVG</button>
            <button type="button" onClick={copyRecipe}>COPIAR RECETA</button>
          </div>
          <p className={styles.status} role="status" aria-live="polite">{feedback}</p>
          <p className={styles.disclaimer}>Interfaz reactiva: detecta tus elecciones y transforma el arte. No se presenta como una conciencia real ni como un modelo de IA conectado.</p>
        </div>
      </section>
      <footer className={styles.footer}><span>SÃO PAULO ↔ BARCELONA · BELENTANI</span><Link href="/judas">EXPLORAR JUDAS ↗</Link></footer>
    </main>
  );
}
