// ============================================================================
// BelentaniUniverse.jsx
// ----------------------------------------------------------------------------
// Universo procedural React (fichero unico, sin dependencias externas).
//   - 6.000 estrellas en 5 capas parallax con parpadeo individual
//   - Galaxia espiral con nucleo y disco terroso
//   - Nebulosas terrosas con luz liquida (mezcla aditiva + gradientes)
//   - Aurora, polvo bokeh, constelaciones procedurales, lluvia de meteoros
//   - Agujero negro con anillo de acrecion y lente gravitacional
//   - Capa WebGL de fondo (nebula + microestrellas animada)
//   - Fanfarria de trompetas 100% sintetizada con Web Audio API
//   - "BELENTANI" en neon rojo cyberpunk: aparece UNA sola vez, sin otro texto
// Uso: import BelentaniUniverse from "./BelentaniUniverse.jsx";
//      <BelentaniUniverse />  (clic en el punto para arrancar audio+render)
// Camara bloqueada en tripode: sin pan, tilt ni zoom. Solo pulso interno.
// ============================================================================
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

/* ============================================================================
   1. CONFIGURACION GLOBAL
   ========================================================================== */

const TAU = Math.PI * 2;

const CONFIG = {
  // Estrellas
  STAR_COUNT: 6000,
  STAR_LAYERS: 5,
  STAR_GLOW_MAX: 2.4,
  STAR_DRIFT_BASE: 0.004,

  // Galaxia
  GALAXY_STARS: 2400,
  GALAXY_ARMS: 4,
  GALAXY_TURNS: 2.4,
  GALAXY_SPREAD: 0.55,
  GALAXY_CORE_GLOW: 0.9,

  // Nebulosas y luz liquida
  NEBULA_BLOBS: 16,
  NEBULA_PULSE: 0.22,
  LIQUID_WARPS: 6,

  // Polvo bokeh
  DUST_COUNT: 220,
  DUST_MAX_R: 90,

  // Aurora
  AURORA_BANDS: 5,
  AURORA_AMP: 0.05,

  // Estrellas fugaces y meteoros
  SHOOTING_CHANCE: 0.010,
  SHOOTING_MAX: 14,
  METEOR_SHOWER_EVERY: 52000,
  METEOR_SHOWER_DURATION: 9000,
  METEOR_SHOWER_RATE: 0.35,

  // Constelaciones
  CONSTELLATION_COUNT: 8,
  CONSTELLATION_MIN: 4,
  CONSTELLATION_MAX: 8,
  CONSTELLATION_MAX_DIST: 0.09,
  CONSTELLATION_FADE: 9000,

  // Planetas y singularidad
  PLANET_COUNT: 2,
  SINGULARITY_GLOW: 1.0,

  // Post-proceso
  GRAIN_TILES: 4,
  GRAIN_ALPHA: 0.035,
  SCANLINE_ALPHA: 0.028,
  VIGNETTE_STRENGTH: 0.42,

  // Calidad adaptativa
  FPS_TARGET: 50,
  FPS_SAMPLE_WINDOW: 90,

  // Tiempos del espectaculo
  FANFARE_AT: 9000,
  TITLE_DURATION: 7200,
  TITLE_FONT: "'Orbitron', 'Arial Black', sans-serif",

  // WebGL
  WEBGL_DPR_CAP: 1.5,

  // Paleta terrosa: siena, ocre, umber, arcilla, arena, tierra quemada
  EARTH_TONES: [
    [138, 84, 44],
    [160, 108, 57],
    [101, 67, 33],
    [184, 134, 72],
    [92, 58, 36],
    [145, 95, 60],
    [172, 120, 66],
    [120, 74, 40],
  ],
  EARTH_DEEP: [64, 38, 22],
  EARTH_HIGHLIGHT: [226, 178, 110],

  // Tintes de estrella (blancos calidos y dorados, coherentes con la tierra)
  STAR_TINTS: [
    [255, 244, 224],
    [255, 220, 180],
    [230, 200, 160],
    [255, 235, 210],
    [255, 210, 170],
  ],

  // Clases espectrales estelares (O B A F G K M) -> tinte aproximado
  SPECTRAL: [
    [155, 176, 255],
    [170, 191, 255],
    [202, 215, 255],
    [248, 247, 255],
    [255, 244, 234],
    [255, 210, 160],
    [255, 170, 120],
  ],
  SPECTRAL_WEIGHTS: [0.02, 0.05, 0.12, 0.18, 0.25, 0.25, 0.13],

  // Fanfarria (Hz): Do-Do-Mi-Sol-Do agudo, triunfal
  FANFARE: [
    { f: 261.63, t: 0.0, d: 0.32 },
    { f: 261.63, t: 0.42, d: 0.32 },
    { f: 329.63, t: 0.86, d: 0.26 },
    { f: 392.0, t: 1.14, d: 0.5 },
    { f: 523.25, t: 1.72, d: 1.7, harmony: [329.63, 392.0] },
    { f: 392.0, t: 3.62, d: 0.4 },
    { f: 523.25, t: 4.1, d: 2.4, harmony: [329.63, 392.0, 783.99] },
  ],
  FANFARE_MASTER: 0.34,
  FANFARE_VIBRATO_HZ: 5.4,
  FANFARE_VIBRATO_DEPTH: 0.006,
  FANFARE_ATTACK: 0.045,
  FANFARE_RELEASE: 0.22,
  REVERB_DELAY: 0.21,
  REVERB_FEEDBACK: 0.34,
  REVERB_WET: 0.26,
  DRONE_GAIN: 0.045,
};

/* ============================================================================
   2. UTILIDADES MATEMATICAS
   ========================================================================== */

const clamp = (v, lo, hi) => (v < lo ? lo : v > hi ? hi : v);
const clamp01 = (v) => clamp(v, 0, 1);
const lerp = (a, b, t) => a + (b - a) * t;
const invlerp = (a, b, v) => (b === a ? 0 : (v - a) / (b - a));
const smoothstep = (a, b, v) => {
  const t = clamp01(invlerp(a, b, v));
  return t * t * (3 - 2 * t);
};
const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);
const easeInOutQuad = (t) =>
  t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
const easeOutBack = (t) => {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
};
const damp = (cur, target, lambda, dt) => lerp(cur, target, 1 - Math.exp(-lambda * dt));

function gauss(rng) {
  let u = 0;
  let v = 0;
  while (u === 0) u = rng();
  while (v === 0) v = rng();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(TAU * v);
}

class Vec2 {
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }
  set(x, y) {
    this.x = x;
    this.y = y;
    return this;
  }
  copy(v) {
    this.x = v.x;
    this.y = v.y;
    return this;
  }
  clone() {
    return new Vec2(this.x, this.y);
  }
  add(v) {
    this.x += v.x;
    this.y += v.y;
    return this;
  }
  sub(v) {
    this.x -= v.x;
    this.y -= v.y;
    return this;
  }
  mul(s) {
    this.x *= s;
    this.y *= s;
    return this;
  }
  len() {
    return Math.hypot(this.x, this.y);
  }
  dist(v) {
    return Math.hypot(this.x - v.x, this.y - v.y);
  }
  norm() {
    const l = this.len() || 1;
    this.x /= l;
    this.y /= l;
    return this;
  }
  rotate(a) {
    const c = Math.cos(a);
    const s = Math.sin(a);
    const x = this.x * c - this.y * s;
    const y = this.x * s + this.y * c;
    this.x = x;
    this.y = y;
    return this;
  }
  lerpTo(v, t) {
    this.x = lerp(this.x, v.x, t);
    this.y = lerp(this.y, v.y, t);
    return this;
  }
}

class Vec3 {
  constructor(x = 0, y = 0, z = 0) {
    this.x = x;
    this.y = y;
    this.z = z;
  }
  set(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
    return this;
  }
  clone() {
    return new Vec3(this.x, this.y, this.z);
  }
  add(v) {
    this.x += v.x;
    this.y += v.y;
    this.z += v.z;
    return this;
  }
  mul(s) {
    this.x *= s;
    this.y *= s;
    this.z *= s;
    return this;
  }
  dot(v) {
    return this.x * v.x + this.y * v.y + this.z * v.z;
  }
  len() {
    return Math.hypot(this.x, this.y, this.z);
  }
  norm() {
    const l = this.len() || 1;
    this.x /= l;
    this.y /= l;
    this.z /= l;
    return this;
  }
}

class Mat3 {
  constructor() {
    this.m = new Float64Array(9);
    this.identity();
  }
  identity() {
    const m = this.m;
    m[0] = 1; m[1] = 0; m[2] = 0;
    m[3] = 0; m[4] = 1; m[5] = 0;
    m[6] = 0; m[7] = 0; m[8] = 1;
    return this;
  }
  rotation(a) {
    const c = Math.cos(a);
    const s = Math.sin(a);
    const m = this.m;
    m[0] = c; m[1] = -s; m[2] = 0;
    m[3] = s; m[4] = c; m[5] = 0;
    m[6] = 0; m[7] = 0; m[8] = 1;
    return this;
  }
  scale(sx, sy) {
    const m = this.m;
    m[0] = sx; m[1] = 0; m[2] = 0;
    m[3] = 0; m[4] = sy; m[5] = 0;
    m[6] = 0; m[7] = 0; m[8] = 1;
    return this;
  }
  mulVec(v) {
    const m = this.m;
    return new Vec2(
      m[0] * v.x + m[1] * v.y + m[2],
      m[3] * v.x + m[4] * v.y + m[5]
    );
  }
}

function dist2(ax, ay, bx, by) {
  const dx = ax - bx;
  const dy = ay - by;
  return dx * dx + dy * dy;
}

function pointInEllipse(px, py, cx, cy, rx, ry, rot) {
  const c = Math.cos(-rot);
  const s = Math.sin(-rot);
  const dx = px - cx;
  const dy = py - cy;
  const lx = dx * c - dy * s;
  const ly = dx * s + dy * c;
  return (lx * lx) / (rx * rx) + (ly * ly) / (ry * ry) <= 1;
}

function quadraticBezier(p0, p1, p2, t) {
  const a = (1 - t) * (1 - t);
  const b = 2 * (1 - t) * t;
  const c = t * t;
  return new Vec2(
    a * p0.x + b * p1.x + c * p2.x,
    a * p0.y + b * p1.y + c * p2.y
  );
}

function cubicBezier(p0, p1, p2, p3, t) {
  const a = Math.pow(1 - t, 3);
  const b = 3 * Math.pow(1 - t, 2) * t;
  const c = 3 * (1 - t) * t * t;
  const d = t * t * t;
  return new Vec2(
    a * p0.x + b * p1.x + c * p2.x + d * p3.x,
    a * p0.y + b * p1.y + c * p2.y + d * p3.y
  );
}

function sampleCubicBezier(p0, p1, p2, p3, steps) {
  const out = [];
  for (let i = 0; i <= steps; i++) {
    out.push(cubicBezier(p0, p1, p2, p3, i / steps));
  }
  return out;
}

/* ============================================================================
   3. GENERADORES ALEATORIOS Y RUIDO
   ========================================================================== */

function mulberry32(seed) {
  let a = seed >>> 0;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function xorshift128(seed) {
  let x = (seed ^ 0x12345678) >>> 0 || 1;
  let y = (seed ^ 0x9e3779b9) >>> 0 || 1;
  let z = (seed ^ 0xbb67ae85) >>> 0 || 1;
  let w = (seed ^ 0x01234567) >>> 0 || 1;
  return function () {
    const t = x ^ (x << 11);
    x = y; y = z; z = w;
    w = (w ^ (w >>> 19) ^ (t ^ (t >>> 8))) >>> 0;
    return w / 4294967296;
  };
}

function makeLCG(seed) {
  let state = seed >>> 0 || 1;
  return function () {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    return state / 4294967296;
  };
}

function hashString(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function hash2(x, y) {
  let h = Math.imul(x | 0, 374761393) + Math.imul(y | 0, 668265263);
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}

function valueNoise2D(x, y) {
  const xi = Math.floor(x);
  const yi = Math.floor(y);
  const xf = x - xi;
  const yf = y - yi;
  const u = xf * xf * (3 - 2 * xf);
  const v = yf * yf * (3 - 2 * yf);
  const a = hash2(xi, yi);
  const b = hash2(xi + 1, yi);
  const c = hash2(xi, yi + 1);
  const d = hash2(xi + 1, yi + 1);
  return lerp(lerp(a, b, u), lerp(c, d, u), v);
}

function fbm2D(x, y, octaves = 4, lacunarity = 2.03, gain = 0.5) {
  let sum = 0;
  let amp = 0.5;
  let freq = 1;
  let norm = 0;
  for (let i = 0; i < octaves; i++) {
    sum += amp * valueNoise2D(x * freq, y * freq);
    norm += amp;
    amp *= gain;
    freq *= lacunarity;
  }
  return sum / norm;
}

function ridgedNoise2D(x, y, octaves = 4) {
  let sum = 0;
  let amp = 0.5;
  let freq = 1;
  let norm = 0;
  for (let i = 0; i < octaves; i++) {
    const n = 1 - Math.abs(valueNoise2D(x * freq, y * freq) * 2 - 1);
    sum += amp * n * n;
    norm += amp;
    amp *= 0.5;
    freq *= 2.11;
  }
  return sum / norm;
}

function turbulence2D(x, y, octaves = 3) {
  let sum = 0;
  let amp = 1;
  let freq = 1;
  for (let i = 0; i < octaves; i++) {
    sum += amp * valueNoise2D(x * freq, y * freq);
    amp *= 0.5;
    freq *= 2.7;
  }
  return sum;
}

function domainWarp2D(x, y, t) {
  const wx = fbm2D(x + t * 0.05, y - t * 0.03, 3);
  const wy = fbm2D(x - t * 0.04, y + t * 0.06, 3);
  return { x: x + wx * 2.2, y: y + wy * 2.2 };
}

function pickWeighted(rng, items, weights) {
  let total = 0;
  for (let i = 0; i < weights.length; i++) total += weights[i];
  let r = rng() * total;
  for (let i = 0; i < items.length; i++) {
    r -= weights[i];
    if (r <= 0) return items[i];
  }
  return items[items.length - 1];
}

function pick(rng, arr) {
  return arr[(rng() * arr.length) | 0];
}

/* ============================================================================
   4. COLORES
   ========================================================================== */

const clampByte = (v) => clamp(Math.round(v), 0, 255);

function rgbString(c) {
  return `rgb(${clampByte(c[0])},${clampByte(c[1])},${clampByte(c[2])})`;
}

function rgbaString(c, a) {
  return `rgba(${clampByte(c[0])},${clampByte(c[1])},${clampByte(c[2])},${clamp01(a)})`;
}

function hexToRgb(hex) {
  const h = hex.replace("#", "");
  const v = parseInt(h.length === 3 ? h.split("").map((ch) => ch + ch).join("") : h, 16);
  return [(v >> 16) & 255, (v >> 8) & 255, v & 255];
}

function rgbToHsl(c) {
  const r = c[0] / 255;
  const g = c[1] / 255;
  const b = c[2] / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  if (max === min) return [0, 0, l];
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h = 0;
  if (max === r) h = ((g - b) / d + (g < b ? 6 : 0));
  else if (max === g) h = ((b - r) / d + 2);
  else h = ((r - g) / d + 4);
  return [h / 6, s, l];
}

function hslToRgb(h, s, l) {
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  const f = (t) => {
    let x = t;
    if (x < 0) x += 1;
    if (x > 1) x -= 1;
    if (x < 1 / 6) return p + (q - p) * 6 * x;
    if (x < 1 / 2) return q;
    if (x < 2 / 3) return p + (q - p) * (2 / 3 - x) * 6;
    return p;
  };
  if (s === 0) {
    const v = Math.round(l * 255);
    return [v, v, v];
  }
  return [Math.round(f(h + 1 / 3) * 255), Math.round(f(h) * 255), Math.round(f(h - 1 / 3) * 255)];
}

function mixRgb(a, b, t) {
  return [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)];
}

function mixRgbHsl(a, b, t) {
  const ha = rgbToHsl(a);
  const hb = rgbToHsl(b);
  return hslToRgb(lerp(ha[0], hb[0], t), lerp(ha[1], hb[1], t), lerp(ha[2], hb[2], t));
}

function shade(c, f) {
  return [clampByte(c[0] * f), clampByte(c[1] * f), clampByte(c[2] * f)];
}

function lighten(c, amt) {
  return mixRgb(c, [255, 255, 255], amt);
}

function darken(c, amt) {
  return mixRgb(c, [0, 0, 0], amt);
}

function luminance(c) {
  return (0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]) / 255;
}

function spectralColor(cls, rng) {
  const base = CONFIG.SPECTRAL[cls] || CONFIG.SPECTRAL[4];
  const jitter = () => (rng() - 0.5) * 24;
  return [
    clampByte(base[0] + jitter()),
    clampByte(base[1] + jitter()),
    clampByte(base[2] + jitter()),
  ];
}

function earthToneAt(t) {
  const n = CONFIG.EARTH_TONES.length - 1;
  const i = clamp(Math.floor(t * n), 0, n - 1);
  const f = t * n - i;
  return mixRgb(CONFIG.EARTH_TONES[i], CONFIG.EARTH_TONES[i + 1], f);
}

function earthLiquid(t) {
  const base = earthToneAt(t);
  const glow = CONFIG.EARTH_HIGHLIGHT;
  return mixRgb(base, glow, 0.25 + 0.25 * Math.sin(t * TAU));
}

function backgroundGradientStops() {
  return [
    { p: 0, c: [8, 5, 3] },
    { p: 0.45, c: [18, 11, 6] },
    { p: 0.75, c: [12, 8, 5] },
    { p: 1, c: [6, 4, 3] },
  ];
}

function drawVerticalGradient(ctx, w, h, stops) {
  const g = ctx.createLinearGradient(0, 0, 0, h);
  for (const s of stops) g.addColorStop(s.p, rgbString(s.c));
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);
}

/* ============================================================================
   5. MOTOR DE ESTRELLAS
   ========================================================================== */

function starLayerSize(layer) {
  return 0.35 + layer * 0.5;
}

function starLayerAlpha(layer) {
  return 0.35 + layer * 0.16;
}

function starLayerSpeed(layer) {
  return (layer + 1) * CONFIG.STAR_DRIFT_BASE;
}

function createStar(rng, w, h) {
  const layer = (rng() * CONFIG.STAR_LAYERS) | 0;
  const spectral = pickWeighted(rng, [0, 1, 2, 3, 4, 5, 6], CONFIG.SPECTRAL_WEIGHTS);
  const tint = spectralColor(spectral, rng);
  const size = (0.28 + rng() * 0.55) + layer * 0.42;
  return {
    x: rng() * w,
    y: rng() * h,
    layer,
    size,
    tint,
    baseAlpha: starLayerAlpha(layer) * (0.55 + rng() * 0.45),
    twinkleSpeed: 0.4 + rng() * 2.6,
    twinklePhase: rng() * TAU,
    driftX: (rng() - 0.5) * 2 * starLayerSpeed(layer),
    driftY: (rng() - 0.5) * 2 * starLayerSpeed(layer) * 0.4,
    glow: size > CONFIG.STAR_GLOW_MAX,
    flare: size > 2.9,
    wobble: rng() * TAU,
    wobbleSpeed: 0.1 + rng() * 0.5,
  };
}

function createStarField(rng, w, h, count) {
  const stars = new Array(count);
  for (let i = 0; i < count; i++) stars[i] = createStar(rng, w, h);
  return stars;
}

function respawnStar(rng, s, w, h, fromEdge) {
  if (fromEdge === "top") {
    s.x = rng() * w;
    s.y = -4;
  } else if (fromEdge === "bottom") {
    s.x = rng() * w;
    s.y = h + 4;
  } else if (fromEdge === "left") {
    s.x = -4;
    s.y = rng() * h;
  } else if (fromEdge === "right") {
    s.x = w + 4;
    s.y = rng() * h;
  } else {
    s.x = rng() * w;
    s.y = rng() * h;
  }
}

function updateStar(rng, s, dt, w, h) {
  s.wobble += s.wobbleSpeed * dt;
  const wx = Math.sin(s.wobble) * 0.006;
  const wy = Math.cos(s.wobble * 0.9) * 0.004;
  s.x += (s.driftX + wx) * dt * 60;
  s.y += (s.driftY + wy) * dt * 60;
  if (s.y > h + 6) respawnStar(rng, s, w, h, "top");
  else if (s.y < -6) respawnStar(rng, s, w, h, "bottom");
  if (s.x > w + 6) respawnStar(rng, s, w, h, "left");
  else if (s.x < -6) respawnStar(rng, s, w, h, "right");
}

function starTwinkle(s, t) {
  const tw = 0.5 + 0.5 * Math.sin(t * s.twinkleSpeed + s.twinklePhase);
  return s.baseAlpha * (0.35 + 0.65 * tw);
}

function drawStarCore(ctx, s, alpha) {
  ctx.fillStyle = rgbaString(s.tint, alpha);
  ctx.beginPath();
  ctx.arc(s.x, s.y, s.size, 0, TAU);
  ctx.fill();
}

function drawStarGlow(ctx, s, alpha) {
  const r = s.size * 5.5;
  if (r < 1) return;
  const g = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, r);
  g.addColorStop(0, rgbaString(s.tint, alpha * 0.55));
  g.addColorStop(0.35, rgbaString(s.tint, alpha * 0.18));
  g.addColorStop(1, rgbaString(s.tint, 0));
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(s.x, s.y, r, 0, TAU);
  ctx.fill();
}

function drawStarSpikes(ctx, s, alpha) {
  const len = s.size * 9;
  if (len < 4) return;
  const a = alpha * 0.5;
  const grad = ctx.createLinearGradient(s.x - len, s.y, s.x + len, s.y);
  grad.addColorStop(0, rgbaString(s.tint, 0));
  grad.addColorStop(0.5, rgbaString(s.tint, a));
  grad.addColorStop(1, rgbaString(s.tint, 0));
  ctx.strokeStyle = grad;
  ctx.lineWidth = s.size * 0.5;
  ctx.beginPath();
  ctx.moveTo(s.x - len, s.y);
  ctx.lineTo(s.x + len, s.y);
  ctx.stroke();
  const grad2 = ctx.createLinearGradient(s.x, s.y - len, s.x, s.y + len);
  grad2.addColorStop(0, rgbaString(s.tint, 0));
  grad2.addColorStop(0.5, rgbaString(s.tint, a * 0.8));
  grad2.addColorStop(1, rgbaString(s.tint, 0));
  ctx.strokeStyle = grad2;
  ctx.beginPath();
  ctx.moveTo(s.x, s.y - len);
  ctx.lineTo(s.x, s.y + len);
  ctx.stroke();
}

function drawStarField(ctx, rng, stars, t, dt, w, h, quality) {
  const glowBudget = quality >= 2 ? 1 : quality === 1 ? 0.55 : 0.25;
  let glowCount = 0;
  const maxGlows = Math.floor(stars.length * 0.12 * glowBudget);
  for (let i = 0; i < stars.length; i++) {
    const s = stars[i];
    updateStar(rng, s, dt, w, h);
    const alpha = starTwinkle(s, t);
    if (s.glow && glowCount < maxGlows) {
      drawStarGlow(ctx, s, alpha);
      glowCount++;
    }
    drawStarCore(ctx, s, alpha);
    if (s.flare && quality >= 1) {
      drawStarSpikes(ctx, s, alpha);
    }
  }
}

/* ============================================================================
   6. GALAXIA ESPIRAL
   ========================================================================== */

function createGalaxy(rng, w, h) {
  const cx = w * 0.5;
  const cy = h * 0.44;
  const maxR = Math.min(w, h) * 0.42;
  const stars = [];
  for (let i = 0; i < CONFIG.GALAXY_STARS; i++) {
    const arm = (rng() * CONFIG.GALAXY_ARMS) | 0;
    const t = Math.pow(rng(), 0.72);
    const angle =
      (arm * TAU) / CONFIG.GALAXY_ARMS +
      t * TAU * CONFIG.GALAXY_TURNS +
      gauss(rng) * CONFIG.GALAXY_SPREAD * (1 - t * 0.6);
    const radius = t * maxR * (1 + gauss(rng) * 0.12);
    const x = cx + Math.cos(angle) * radius;
    const y = cy + Math.sin(angle) * radius * 0.62;
    if (x < -20 || x > w + 20 || y < -20 || y > h + 20) continue;
    const layer = clamp(Math.floor(radius / maxR * CONFIG.STAR_LAYERS), 0, CONFIG.STAR_LAYERS - 1);
    stars.push({
      x,
      y,
      layer,
      size: 0.3 + rng() * (1.1 - t * 0.7),
      tint: mixRgb(CONFIG.STAR_TINTS[1], CONFIG.EARTH_TONES[4], t * 0.7),
      alpha: (0.25 + (1 - t) * 0.75) * (0.5 + rng() * 0.5),
      twinkleSpeed: 0.3 + rng() * 2.2,
      twinklePhase: rng() * TAU,
    });
  }
  return { cx, cy, maxR, stars };
}

function drawGalaxyCore(ctx, g, t) {
  const r = g.maxR * 0.55;
  const pulse = 1 + 0.06 * Math.sin(t * 0.4);
  const grad = ctx.createRadialGradient(g.cx, g.cy, 0, g.cx, g.cy, r * pulse);
  grad.addColorStop(0, rgbaString(CONFIG.EARTH_HIGHLIGHT, 0.5 * CONFIG.GALAXY_CORE_GLOW));
  grad.addColorStop(0.25, rgbaString(CONFIG.EARTH_TONES[1], 0.28 * CONFIG.GALAXY_CORE_GLOW));
  grad.addColorStop(0.6, rgbaString(CONFIG.EARTH_TONES[2], 0.12 * CONFIG.GALAXY_CORE_GLOW));
  grad.addColorStop(1, rgbaString(CONFIG.EARTH_TONES[2], 0));
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(g.cx, g.cy, r * pulse, 0, TAU);
  ctx.fill();
}

function drawGalaxy(ctx, g, t, quality) {
  drawGalaxyCore(ctx, g, t);
  const dense = quality >= 1;
  for (let i = 0; i < g.stars.length; i++) {
    const s = g.stars[i];
    if (!dense && i % 3 !== 0) continue;
    const tw = 0.5 + 0.5 * Math.sin(t * s.twinkleSpeed + s.twinklePhase);
    const alpha = s.alpha * (0.45 + 0.55 * tw);
    ctx.fillStyle = rgbaString(s.tint, alpha);
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.size, 0, TAU);
    ctx.fill();
  }
}

/* ============================================================================
   7. NEBULOSAS TERROSAS Y LUZ LIQUIDA
   ========================================================================== */

function createNebula(rng, w, h) {
  const color = pick(rng, CONFIG.EARTH_TONES);
  return {
    x: rng() * w,
    y: rng() * h,
    r: (0.1 + rng() * 0.24) * Math.min(w, h),
    color,
    accent: mixRgb(color, CONFIG.EARTH_HIGHLIGHT, 0.45),
    alpha: 0.045 + rng() * 0.075,
    pulseSpeed: 0.08 + rng() * 0.3,
    phase: rng() * TAU,
    driftX: (rng() - 0.5) * 0.12,
    driftY: (rng() - 0.5) * 0.08,
    warpSeed: rng() * 1000,
    lobes: 2 + (rng() * 3) | 0,
    lobeOffsets: Array.from({ length: 6 }, () => ({
      dx: (rng() - 0.5) * 0.5,
      dy: (rng() - 0.5) * 0.5,
      rf: 0.35 + rng() * 0.5,
    })),
  };
}

function createNebulaField(rng, w, h) {
  const nebulas = [];
  for (let i = 0; i < CONFIG.NEBULA_BLOBS; i++) {
    nebulas.push(createNebula(rng, w, h));
  }
  return nebulas;
}

function updateNebula(n, dt, w, h) {
  n.x += n.driftX * dt * 10;
  n.y += n.driftY * dt * 10;
  if (n.x < -n.r) n.x = w + n.r;
  if (n.x > w + n.r) n.x = -n.r;
  if (n.y < -n.r) n.y = h + n.r;
  if (n.y > h + n.r) n.y = -n.r;
  n.phase += n.pulseSpeed * dt;
}

function drawNebulaLobes(ctx, n, t) {
  const pulse = 1 + CONFIG.NEBULA_PULSE * Math.sin(n.phase);
  const baseAlpha = n.alpha * pulse;
  for (let i = 0; i < n.lobes; i++) {
    const lobe = n.lobeOffsets[i % n.lobeOffsets.length];
    const lx = n.x + lobe.dx * n.r * 0.9;
    const ly = n.y + lobe.dy * n.r * 0.9;
    const lr = n.r * lobe.rf * pulse;
    const color = i % 2 === 0 ? n.color : n.accent;
    const g = ctx.createRadialGradient(lx, ly, 0, lx, ly, lr);
    g.addColorStop(0, rgbaString(color, baseAlpha));
    g.addColorStop(0.45, rgbaString(color, baseAlpha * 0.42));
    g.addColorStop(1, rgbaString(color, 0));
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(lx, ly, lr, 0, TAU);
    ctx.fill();
  }
}

function drawNebulaField(ctx, nebulas, t, dt, w, h) {
  ctx.globalCompositeOperation = "lighter";
  for (let i = 0; i < nebulas.length; i++) {
    const n = nebulas[i];
    updateNebula(n, dt, w, h);
    drawNebulaLobes(ctx, n, t);
  }
  ctx.globalCompositeOperation = "source-over";
}

function createLiquidWarp(rng, w, h) {
  return {
    x: rng() * w,
    y: rng() * h,
    r: (0.05 + rng() * 0.1) * Math.min(w, h),
    vx: (rng() - 0.5) * 0.25,
    vy: (rng() - 0.5) * 0.2,
    seed: rng() * 500,
    color: pick(rng, CONFIG.EARTH_TONES),
    alpha: 0.05 + rng() * 0.05,
  };
}

function updateLiquidWarp(warp, dt, w, h, t) {
  const n = domainWarp2D(warp.seed, t * 0.08);
  warp.x += (warp.vx + (n.x - 0.5) * 0.3) * dt * 10;
  warp.y += (warp.vy + (n.y - 0.5) * 0.3) * dt * 10;
  if (warp.x < -warp.r * 2) warp.x = w + warp.r;
  if (warp.x > w + warp.r * 2) warp.x = -warp.r;
  if (warp.y < -warp.r * 2) warp.y = h + warp.r;
  if (warp.y > h + warp.r * 2) warp.y = -warp.r;
}

function drawLiquidWarp(ctx, warp, t) {
  const r = warp.r * (1 + 0.3 * Math.sin(t * 0.5 + warp.seed));
  const g = ctx.createRadialGradient(warp.x, warp.y, 0, warp.x, warp.y, r);
  g.addColorStop(0, rgbaString(warp.color, warp.alpha));
  g.addColorStop(0.5, rgbaString(warp.color, warp.alpha * 0.35));
  g.addColorStop(1, rgbaString(warp.color, 0));
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(warp.x, warp.y, r, 0, TAU);
  ctx.fill();
}

function drawLiquidLight(ctx, warps, t, dt, w, h) {
  ctx.globalCompositeOperation = "lighter";
  for (let i = 0; i < warps.length; i++) {
    const warp = warps[i];
    updateLiquidWarp(warp, dt, w, h, t);
    drawLiquidWarp(ctx, warp, t);
  }
  ctx.globalCompositeOperation = "source-over";
}

function createLiquidLightField(rng, w, h) {
  const warps = [];
  for (let i = 0; i < CONFIG.LIQUID_WARPS; i++) {
    warps.push(createLiquidWarp(rng, w, h));
  }
  return warps;
}

function drawLiquidMeniscus(ctx, w, h, t) {
  ctx.globalCompositeOperation = "lighter";
  const bands = 3;
  for (let b = 0; b < bands; b++) {
    const yBase = h * (0.2 + b * 0.3);
    ctx.beginPath();
    for (let x = 0; x <= w; x += Math.max(8, w / 120)) {
      const y =
        yBase +
        Math.sin(x * 0.004 + t * 0.25 + b * 2.1) * h * 0.035 +
        Math.sin(x * 0.011 - t * 0.17 + b) * h * 0.018;
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.strokeStyle = rgbaString(CONFIG.EARTH_HIGHLIGHT, 0.035);
    ctx.lineWidth = 1.2;
    ctx.stroke();
  }
  ctx.globalCompositeOperation = "source-over";
}

/* ============================================================================
   8. POLVO BOKEH (primer plano)
   ========================================================================== */

function createDust(rng, w, h) {
  return {
    x: rng() * w,
    y: rng() * h,
    r: 6 + rng() * (CONFIG.DUST_MAX_R - 6),
    vx: (rng() - 0.5) * 0.16,
    vy: (rng() - 0.5) * 0.12 - 0.03,
    alpha: 0.012 + rng() * 0.03,
    color: mixRgb(pick(rng, CONFIG.EARTH_TONES), [255, 244, 224], 0.5),
    phase: rng() * TAU,
    phaseSpeed: 0.15 + rng() * 0.4,
    blur: 0.5 + rng() * 0.5,
  };
}

function createDustField(rng, w, h) {
  const dust = [];
  for (let i = 0; i < CONFIG.DUST_COUNT; i++) dust.push(createDust(rng, w, h));
  return dust;
}

function updateDust(d, dt, w, h) {
  d.x += d.vx * dt * 10;
  d.y += d.vy * dt * 10;
  d.phase += d.phaseSpeed * dt;
  if (d.y < -d.r * 2) { d.y = h + d.r; d.x = Math.random() * w; }
  if (d.x < -d.r * 2) d.x = w + d.r;
  if (d.x > w + d.r * 2) d.x = -d.r;
}

function drawDust(ctx, d) {
  const alpha = d.alpha * (0.7 + 0.3 * Math.sin(d.phase));
  const r = d.r * d.blur;
  const g = ctx.createRadialGradient(d.x, d.y, 0, d.x, d.y, r);
  g.addColorStop(0, rgbaString(d.color, alpha));
  g.addColorStop(0.5, rgbaString(d.color, alpha * 0.35));
  g.addColorStop(1, rgbaString(d.color, 0));
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(d.x, d.y, r, 0, TAU);
  ctx.fill();
}

function drawDustField(ctx, dust, dt, w, h, quality) {
  const step = quality >= 1 ? 1 : 2;
  for (let i = 0; i < dust.length; i += step) {
    const d = dust[i];
    updateDust(d, dt, w, h);
    drawDust(ctx, d);
  }
}

/* ============================================================================
   9. AURORA TERROSA
   ========================================================================== */

function createAuroraBand(rng, w, h, index) {
  const yBase = h * (0.12 + index * 0.13);
  return {
    yBase,
    amp: h * (CONFIG.AURORA_AMP * (0.7 + rng() * 0.6)),
    freq: 0.0022 + rng() * 0.003,
    speed: 0.12 + rng() * 0.22,
    phase: rng() * TAU,
    thickness: h * (0.05 + rng() * 0.06),
    color: index % 2 === 0
      ? mixRgb([74, 124, 78], CONFIG.EARTH_TONES[1], 0.45)
      : mixRgb(CONFIG.EARTH_TONES[3], CONFIG.EARTH_HIGHLIGHT, 0.5),
    alpha: 0.05 + rng() * 0.06,
    segments: 90,
    wobbleSeed: rng() * 100,
  };
}

function createAuroraField(rng, w, h) {
  const bands = [];
  for (let i = 0; i < CONFIG.AURORA_BANDS; i++) {
    bands.push(createAuroraBand(rng, w, h, i));
  }
  return bands;
}

function auroraY(band, x, t) {
  const w1 = Math.sin(x * band.freq + t * band.speed + band.phase);
  const w2 = Math.sin(x * band.freq * 2.7 - t * band.speed * 0.7 + band.wobbleSeed);
  const w3 = Math.sin(x * band.freq * 0.5 + t * band.speed * 1.4);
  return band.yBase + w1 * band.amp + w2 * band.amp * 0.35 + w3 * band.amp * 0.2;
}

function drawAuroraBand(ctx, band, w, t) {
  const steps = band.segments;
  const top = [];
  for (let i = 0; i <= steps; i++) {
    const x = (i / steps) * w;
    top.push([x, auroraY(band, x, t)]);
  }
  const grad = ctx.createLinearGradient(0, band.yBase - band.thickness, 0, band.yBase + band.thickness * 2.2);
  grad.addColorStop(0, rgbaString(band.color, 0));
  grad.addColorStop(0.35, rgbaString(band.color, band.alpha));
  grad.addColorStop(0.7, rgbaString(band.color, band.alpha * 0.45));
  grad.addColorStop(1, rgbaString(band.color, 0));
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.moveTo(top[0][0], top[0][1]);
  for (let i = 1; i < top.length; i++) ctx.lineTo(top[i][0], top[i][1]);
  for (let i = top.length - 1; i >= 0; i--) {
    ctx.lineTo(top[i][0], top[i][1] + band.thickness * (1 + 0.4 * Math.sin(i * 0.4 + t)));
  }
  ctx.closePath();
  ctx.fill();
}

function drawAuroraField(ctx, bands, w, t, quality) {
  ctx.globalCompositeOperation = "lighter";
  const step = quality >= 1 ? 1 : 2;
  for (let i = 0; i < bands.length; i += step) {
    drawAuroraBand(ctx, bands[i], w, t);
  }
  ctx.globalCompositeOperation = "source-over";
}

/* ============================================================================
   10. ESTRELLAS FUGACES Y LLUVIAS DE METEOROS
   ========================================================================== */

function createShootingStar(rng, w, h, burst) {
  const fromTop = rng() < 0.7;
  const x = rng() * w;
  const y = fromTop ? rng() * h * 0.35 : h * 0.1 + rng() * h * 0.4;
  const speed = (6 + rng() * 9) * (burst ? 1.5 : 1);
  const angle = Math.atan2(h * 0.25 + rng() * h * 0.2, w * (0.25 + rng() * 0.35));
  const dir = rng() < 0.5 ? 1 : -1;
  return {
    x,
    y,
    vx: Math.cos(angle) * speed * dir,
    vy: Math.abs(Math.sin(angle)) * speed,
    life: 1,
    decay: 0.012 + rng() * 0.02,
    width: 1 + rng() * 1.6,
    tint: mixRgb(pick(rng, CONFIG.STAR_TINTS), [255, 230, 190], 0.5),
    trail: 9 + rng() * 8,
  };
}

function updateShootingStar(ss, dt, w, h) {
  ss.x += ss.vx * dt * 60;
  ss.y += ss.vy * dt * 60;
  ss.life -= ss.decay * dt * 60;
}

function drawShootingStar(ctx, ss) {
  const a = clamp01(ss.life);
  const tx = ss.x - ss.vx * ss.trail * 0.9;
  const ty = ss.y - ss.vy * ss.trail * 0.9;
  const grad = ctx.createLinearGradient(ss.x, ss.y, tx, ty);
  grad.addColorStop(0, rgbaString(ss.tint, a));
  grad.addColorStop(0.4, rgbaString(ss.tint, a * 0.5));
  grad.addColorStop(1, rgbaString(ss.tint, 0));
  ctx.strokeStyle = grad;
  ctx.lineWidth = ss.width;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(ss.x, ss.y);
  ctx.lineTo(tx, ty);
  ctx.stroke();
  const head = ctx.createRadialGradient(ss.x, ss.y, 0, ss.x, ss.y, ss.width * 5);
  head.addColorStop(0, rgbaString(ss.tint, a * 0.8));
  head.addColorStop(1, rgbaString(ss.tint, 0));
  ctx.fillStyle = head;
  ctx.beginPath();
  ctx.arc(ss.x, ss.y, ss.width * 5, 0, TAU);
  ctx.fill();
}

function createMeteorShower(rng) {
  return {
    nextAt: CONFIG.METEOR_SHOWER_EVERY + rng() * CONFIG.METEOR_SHOWER_EVERY * 0.5,
    until: 0,
    active: false,
  };
}

function updateMeteorShower(shower, t, rng, shooting, w, h) {
  if (!shower.active && t * 1000 >= shower.nextAt) {
    shower.active = true;
    shower.until = t * 1000 + CONFIG.METEOR_SHOWER_DURATION;
  }
  if (shower.active) {
    if (rng() < CONFIG.METEOR_SHOWER_RATE) {
      shooting.push(createShootingStar(rng, w, h, true));
    }
    if (t * 1000 >= shower.until) {
      shower.active = false;
      shower.nextAt = t * 1000 + CONFIG.METEOR_SHOWER_EVERY + rng() * CONFIG.METEOR_SHOWER_EVERY * 0.6;
    }
  }
}

function drawShootingStars(ctx, rng, shooting, dt, t, w, h) {
  if (shooting.length < CONFIG.SHOOTING_MAX && rng() < CONFIG.SHOOTING_CHANCE) {
    shooting.push(createShootingStar(rng, w, h, false));
  }
  for (let i = shooting.length - 1; i >= 0; i--) {
    const ss = shooting[i];
    updateShootingStar(ss, dt, w, h);
    if (ss.life <= 0 || ss.x > w + 80 || ss.y > h + 80 || ss.x < -80) {
      shooting.splice(i, 1);
      continue;
    }
    drawShootingStar(ctx, ss);
  }
}

/* ============================================================================
   11. CONSTELACIONES PROCEDURALES
   ========================================================================== */

function buildConstellations(rng, stars, w, h) {
  const bright = stars.filter((s) => s.size > 1.35);
  const used = new Set();
  const constellations = [];
  let attempts = 0;
  while (constellations.length < CONFIG.CONSTELLATION_COUNT && attempts < 200) {
    attempts++;
    const seedIdx = (rng() * bright.length) | 0;
    const seed = bright[seedIdx];
    if (!seed || used.has(seed)) continue;
    const chain = [seed];
    used.add(seed);
    const targetLen = CONFIG.CONSTELLATION_MIN + (rng() * (CONFIG.CONSTELLATION_MAX - CONFIG.CONSTELLATION_MIN + 1)) | 0;
    let current = seed;
    while (chain.length < targetLen) {
      let best = null;
      let bestD = Infinity;
      for (let i = 0; i < bright.length; i++) {
        const cand = bright[i];
        if (used.has(cand)) continue;
        const d = current.dist(cand);
        if (d < bestD && d < CONFIG.CONSTELLATION_MAX_DIST * Math.max(w, h)) {
          bestD = d;
          best = cand;
        }
      }
      if (!best) break;
      chain.push(best);
      used.add(best);
      current = best;
    }
    if (chain.length >= CONFIG.CONSTELLATION_MIN) {
      constellations.push({
        stars: chain,
        phase: rng() * TAU,
        fadeSpeed: 0.15 + rng() * 0.25,
        hue: pick(rng, CONFIG.EARTH_TONES),
      });
    }
  }
  return constellations;
}

function constellationAlpha(c, t) {
  const cyc = (Math.sin(t * c.fadeSpeed + c.phase) + 1) / 2;
  return 0.06 + 0.16 * cyc;
}

function drawConstellation(ctx, c, t) {
  const alpha = constellationAlpha(c, t);
  ctx.strokeStyle = rgbaString(c.hue, alpha);
  ctx.lineWidth = 0.7;
  ctx.beginPath();
  ctx.moveTo(c.stars[0].x, c.stars[0].y);
  for (let i = 1; i < c.stars.length; i++) {
    ctx.lineTo(c.stars[i].x, c.stars[i].y);
  }
  ctx.stroke();
  for (let i = 0; i < c.stars.length; i++) {
    const s = c.stars[i];
    const g = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.size * 7);
    g.addColorStop(0, rgbaString(c.hue, alpha * 0.8));
    g.addColorStop(1, rgbaString(c.hue, 0));
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.size * 7, 0, TAU);
    ctx.fill();
  }
}

function drawConstellations(ctx, constellations, t, quality) {
  if (quality < 1) return;
  for (let i = 0; i < constellations.length; i++) {
    drawConstellation(ctx, constellations[i], t);
  }
}

/* ============================================================================
   12. PLANETAS Y SINGULARIDAD
   ========================================================================== */

function createPlanet(rng, w, h, index) {
  const r = (0.03 + rng() * 0.045) * Math.min(w, h);
  const x = w * (index === 0 ? 0.16 : 0.82) + (rng() - 0.5) * w * 0.05;
  const y = h * (index === 0 ? 0.72 : 0.24) + (rng() - 0.5) * h * 0.06;
  return {
    x,
    y,
    r,
    color: pick(rng, CONFIG.EARTH_TONES),
    dark: [18, 10, 6],
    light: CONFIG.EARTH_HIGHLIGHT,
    ring: index === 1,
    ringTilt: 0.4 + rng() * 0.3,
    ringAlpha: 0.16 + rng() * 0.1,
    phase: rng() * TAU,
    shimmer: 0.1 + rng() * 0.2,
  };
}

function createPlanetField(rng, w, h) {
  const planets = [];
  for (let i = 0; i < CONFIG.PLANET_COUNT; i++) {
    planets.push(createPlanet(rng, w, h, i));
  }
  return planets;
}

function drawPlanet(ctx, p, t, surface) {
  if (surface) {
    drawGasGiantSurface(ctx, p, surface, t);
  } else {
    const shimmer = 0.5 + 0.5 * Math.sin(t * p.shimmer + p.phase);
    const lightX = p.x - p.r * 0.45;
    const lightY = p.y - p.r * 0.45;
    const g = ctx.createRadialGradient(lightX, lightY, p.r * 0.1, p.x, p.y, p.r);
    g.addColorStop(0, rgbaString(mixRgb(p.color, p.light, 0.55 * shimmer + 0.2), 0.95));
    g.addColorStop(0.55, rgbaString(p.color, 0.9));
    g.addColorStop(0.85, rgbaString(mixRgb(p.color, p.dark, 0.6), 0.95));
    g.addColorStop(1, rgbaString(p.dark, 1));
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, TAU);
    ctx.fill();
  }
  if (p.ring) {
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.ringTilt);
    ctx.scale(1, 0.32);
    ctx.strokeStyle = rgbaString(mixRgb(p.color, p.light, 0.5), p.ringAlpha);
    ctx.lineWidth = p.r * 0.09;
    ctx.beginPath();
    ctx.arc(0, 0, p.r * 1.65, 0, TAU);
    ctx.stroke();
    ctx.strokeStyle = rgbaString(p.light, p.ringAlpha * 0.5);
    ctx.lineWidth = p.r * 0.04;
    ctx.beginPath();
    ctx.arc(0, 0, p.r * 1.95, 0, TAU);
    ctx.stroke();
    ctx.restore();
  }
  const atmo = ctx.createRadialGradient(p.x, p.y, p.r * 0.9, p.x, p.y, p.r * 1.35);
  atmo.addColorStop(0, rgbaString(p.light, 0.12));
  atmo.addColorStop(1, rgbaString(p.light, 0));
  ctx.fillStyle = atmo;
  ctx.beginPath();
  ctx.arc(p.x, p.y, p.r * 1.35, 0, TAU);
  ctx.fill();
}

function drawPlanets(ctx, planets, t, quality, surfaces) {
  const step = quality >= 1 ? 1 : 2;
  for (let i = 0; i < planets.length; i += step) {
    drawPlanet(ctx, planets[i], t, surfaces ? surfaces[i] : null);
  }
}

function createSingularity(w, h) {
  return {
    x: w * 0.5,
    y: h * 0.44,
    r: Math.min(w, h) * 0.045,
    phase: 0,
  };
}

function drawSingularity(ctx, s, t) {
  const pulse = 1 + 0.08 * Math.sin(t * 0.7 + s.phase);
  const R = s.r * pulse;
  const glowR = R * 9;
  const acc = ctx.createRadialGradient(s.x, s.y, R * 0.8, s.x, s.y, glowR);
  acc.addColorStop(0, rgbaString(CONFIG.EARTH_HIGHLIGHT, 0.5 * CONFIG.SINGULARITY_GLOW));
  acc.addColorStop(0.22, rgbaString(CONFIG.EARTH_TONES[3], 0.3 * CONFIG.SINGULARITY_GLOW));
  acc.addColorStop(0.5, rgbaString(CONFIG.EARTH_TONES[2], 0.12 * CONFIG.SINGULARITY_GLOW));
  acc.addColorStop(1, rgbaString(CONFIG.EARTH_TONES[2], 0));
  ctx.globalCompositeOperation = "lighter";
  ctx.fillStyle = acc;
  ctx.beginPath();
  ctx.arc(s.x, s.y, glowR, 0, TAU);
  ctx.fill();
  const photon = ctx.createRadialGradient(s.x, s.y, R * 1.35, s.x, s.y, R * 1.75);
  photon.addColorStop(0, rgbaString([255, 240, 220], 0));
  photon.addColorStop(0.5, rgbaString([255, 240, 220], 0.55));
  photon.addColorStop(1, rgbaString([255, 240, 220], 0));
  ctx.fillStyle = photon;
  ctx.beginPath();
  ctx.arc(s.x, s.y, R * 1.75, 0, TAU);
  ctx.fill();
  ctx.globalCompositeOperation = "source-over";
  ctx.fillStyle = "#000000";
  ctx.beginPath();
  ctx.arc(s.x, s.y, R, 0, TAU);
  ctx.fill();
  ctx.strokeStyle = rgbaString(CONFIG.EARTH_HIGHLIGHT, 0.5);
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(s.x, s.y, R * 1.02, 0, TAU);
  ctx.stroke();
}

/* ============================================================================
   13. LENTE DE LUZ (lens flare)
   ========================================================================== */

function drawLensFlare(ctx, s, w, h) {
  const cx = w * 0.5;
  const cy = h * 0.5;
  const dx = cx - s.x;
  const dy = cy - s.y;
  const alpha = 0.1 * clamp01((s.size - 2.5) / 1.5);
  if (alpha <= 0.001) return;
  const elements = [
    { t: 0.3, r: s.size * 2.2, a: 0.5 },
    { t: 0.55, r: s.size * 1.1, a: 0.8 },
    { t: 0.78, r: s.size * 3.4, a: 0.25 },
    { t: 1.0, r: s.size * 1.6, a: 0.5 },
    { t: 1.25, r: s.size * 2.8, a: 0.2 },
  ];
  for (const el of elements) {
    const fx = s.x + dx * el.t;
    const fy = s.y + dy * el.t;
    if (fx < -el.r || fx > w + el.r || fy < -el.r || fy > h + el.r) continue;
    const g = ctx.createRadialGradient(fx, fy, 0, fx, fy, el.r);
    g.addColorStop(0, rgbaString(s.tint, alpha * el.a));
    g.addColorStop(1, rgbaString(s.tint, 0));
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(fx, fy, el.r, 0, TAU);
    ctx.fill();
  }
}

function drawLensFlares(ctx, stars, w, h, quality) {
  if (quality < 1) return;
  for (let i = 0; i < stars.length; i++) {
    const s = stars[i];
    if (s.flare) drawLensFlare(ctx, s, w, h);
  }
}

/* ============================================================================
   14. POST-PROCESO (viñeta, grano, scanlines, aberracion)
   ========================================================================== */

function createGrainTile(rng, size) {
  const tile = document.createElement("canvas");
  tile.width = size;
  tile.height = size;
  const tctx = tile.getContext("2d");
  const img = tctx.createImageData(size, size);
  for (let i = 0; i < img.data.length; i += 4) {
    const v = (rng() * 255) | 0;
    img.data[i] = v;
    img.data[i + 1] = v;
    img.data[i + 2] = v;
    img.data[i + 3] = 255;
  }
  tctx.putImageData(img, 0, 0);
  return tile;
}

function createGrainTiles(rng, size, count) {
  const tiles = [];
  for (let i = 0; i < count; i++) tiles.push(createGrainTile(rng, size));
  return tiles;
}

function drawGrain(ctx, tiles, w, h, quality) {
  if (quality < 1) return;
  const tile = tiles[(Math.random() * tiles.length) | 0];
  ctx.globalAlpha = CONFIG.GRAIN_ALPHA;
  const pattern = ctx.createPattern(tile, "repeat");
  if (pattern) {
    ctx.save();
    ctx.translate(-(Math.random() * tile.width), -(Math.random() * tile.height));
    ctx.fillStyle = pattern;
    ctx.fillRect(0, 0, w + tile.width, h + tile.height);
    ctx.restore();
  }
  ctx.globalAlpha = 1;
}

function drawScanlines(ctx, w, h, quality) {
  if (quality < 1) return;
  ctx.fillStyle = `rgba(0,0,0,${CONFIG.SCANLINE_ALPHA})`;
  const gap = 3;
  for (let y = 0; y < h; y += gap) {
    ctx.fillRect(0, y, w, 1);
  }
}

function drawVignette(ctx, w, h) {
  const g = ctx.createRadialGradient(
    w * 0.5, h * 0.5, Math.min(w, h) * 0.35,
    w * 0.5, h * 0.5, Math.max(w, h) * 0.75
  );
  g.addColorStop(0, "rgba(0,0,0,0)");
  g.addColorStop(1, `rgba(0,0,0,${CONFIG.VIGNETTE_STRENGTH})`);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);
}

function drawLiquidSheen(ctx, w, h, t) {
  ctx.globalCompositeOperation = "lighter";
  const g = ctx.createLinearGradient(0, 0, w, h);
  const a = 0.02 + 0.014 * Math.sin(t * 0.3);
  g.addColorStop(0, rgbaString(CONFIG.EARTH_HIGHLIGHT, a));
  g.addColorStop(0.5, rgbaString(CONFIG.EARTH_TONES[0], 0));
  g.addColorStop(1, rgbaString(CONFIG.EARTH_TONES[3], a * 0.8));
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);
  ctx.globalCompositeOperation = "source-over";
}

function drawChromaticFrame(ctx, w, h, t) {
  ctx.globalCompositeOperation = "lighter";
  const shift = 1.5 + Math.sin(t * 0.2) * 0.8;
  ctx.fillStyle = "rgba(255,60,40,0.012)";
  ctx.fillRect(shift, 0, w, h);
  ctx.fillStyle = "rgba(60,120,255,0.012)";
  ctx.fillRect(-shift, 0, w, h);
  ctx.globalCompositeOperation = "source-over";
}

function updateQuality(fpsSamples, dt) {
  const fps = 1 / Math.max(dt, 1e-4);
  fpsSamples.push(fps);
  if (fpsSamples.length > CONFIG.FPS_SAMPLE_WINDOW) fpsSamples.shift();
  if (fpsSamples.length < CONFIG.FPS_SAMPLE_WINDOW) return 1;
  let sum = 0;
  for (let i = 0; i < fpsSamples.length; i++) sum += fpsSamples[i];
  const avg = sum / fpsSamples.length;
  if (avg < CONFIG.FPS_TARGET - 12) return 0;
  if (avg < CONFIG.FPS_TARGET - 3) return 1;
  return 2;
}

/* ============================================================================
   15. CAPA WEBGL (fondo: nebulosa + microestrellas animada)
   ========================================================================== */

const WEBGL_VERT = [
  "attribute vec2 aPos;",
  "void main() {",
  "  gl_Position = vec4(aPos, 0.0, 1.0);",
  "}",
].join("\n");

const WEBGL_FRAG = [
  "precision highp float;",
  "uniform vec2 uRes;",
  "uniform float uTime;",
  "uniform float uSeed;",
  "float hash(vec2 p) {",
  "  p = fract(p * vec2(123.34, 456.21));",
  "  p += dot(p, p + 45.32);",
  "  return fract(p.x * p.y);",
  "}",
  "float noise(vec2 p) {",
  "  vec2 i = floor(p);",
  "  vec2 f = fract(p);",
  "  f = f * f * (3.0 - 2.0 * f);",
  "  float a = hash(i);",
  "  float b = hash(i + vec2(1.0, 0.0));",
  "  float c = hash(i + vec2(0.0, 1.0));",
  "  float d = hash(i + vec2(1.0, 1.0));",
  "  return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);",
  "}",
  "float fbm(vec2 p) {",
  "  float v = 0.0;",
  "  float a = 0.5;",
  "  for (int i = 0; i < 5; i++) {",
  "    v += a * noise(p);",
  "    p *= 2.03;",
  "    a *= 0.5;",
  "  }",
  "  return v;",
  "}",
  "vec3 earthTone(float t) {",
  "  vec3 c0 = vec3(0.541, 0.329, 0.173);",
  "  vec3 c1 = vec3(0.627, 0.424, 0.224);",
  "  vec3 c2 = vec3(0.396, 0.263, 0.129);",
  "  vec3 c3 = vec3(0.722, 0.525, 0.282);",
  "  vec3 c4 = vec3(0.361, 0.227, 0.141);",
  "  vec3 c5 = vec3(0.569, 0.373, 0.235);",
  "  vec3 c6 = vec3(0.675, 0.471, 0.259);",
  "  vec3 c7 = vec3(0.471, 0.290, 0.157);",
  "  vec3 pal = c0;",
  "  pal = mix(pal, c1, smoothstep(0.0, 0.14, t));",
  "  pal = mix(pal, c2, smoothstep(0.14, 0.28, t));",
  "  pal = mix(pal, c3, smoothstep(0.28, 0.42, t));",
  "  pal = mix(pal, c4, smoothstep(0.42, 0.56, t));",
  "  pal = mix(pal, c5, smoothstep(0.56, 0.70, t));",
  "  pal = mix(pal, c6, smoothstep(0.70, 0.85, t));",
  "  pal = mix(pal, c7, smoothstep(0.85, 1.0, t));",
  "  return pal;",
  "}",
  "void main() {",
  "  vec2 uv = gl_FragCoord.xy / uRes;",
  "  vec2 p = uv * vec2(3.0, 1.8);",
  "  float t = uTime * 0.02;",
  "  vec2 warp = vec2(",
  "    fbm(p * 1.4 + vec2(t * 0.7, -t * 0.4) + uSeed),",
  "    fbm(p * 1.4 + vec2(-t * 0.5, t * 0.6) + uSeed * 1.7)",
  "  );",
  "  float n = fbm(p + warp * 1.8 + vec2(uSeed, uSeed * 0.6));",
  "  float n2 = fbm(p * 2.7 - warp + vec2(uSeed * 2.3, 0.0));",
  "  vec3 deep = vec3(0.024, 0.016, 0.010);",
  "  vec3 mid = vec3(0.055, 0.036, 0.020);",
  "  vec3 col = mix(deep, mid, uv.y);",
  "  vec3 tone = earthTone(n);",
  "  col += tone * smoothstep(0.42, 0.85, n) * 0.34;",
  "  col += earthTone(n2) * smoothstep(0.5, 0.9, n2) * 0.16;",
  "  float glow = smoothstep(0.62, 1.0, n * n2 * 2.0);",
  "  col += vec3(0.89, 0.70, 0.43) * glow * 0.22;",
  "  vec2 grid = uv * vec2(140.0, 70.0);",
  "  vec2 cell = floor(grid);",
  "  vec2 fpos = fract(grid);",
  "  float h = hash(cell + uSeed);",
  "  vec2 starPos = vec2(hash(cell + 7.13 + uSeed), hash(cell + 3.71 + uSeed));",
  "  float d = length(fpos - starPos);",
  "  float tw = 0.55 + 0.45 * sin(uTime * (0.6 + h * 2.4) + h * 40.0);",
  "  float star = smoothstep(0.09, 0.0, d) * tw;",
  "  col += vec3(1.0, 0.94, 0.84) * star * 0.85;",
  "  col += vec3(1.0, 0.82, 0.60) * star * star * 0.5;",
  "  float micro = smoothstep(0.05, 0.0, d) * (1.0 - tw) * 0.25;",
  "  col += vec3(0.95, 0.88, 0.78) * micro;",
  "  float vig = smoothstep(0.0, 0.35, uv.x) * smoothstep(1.0, 0.65, uv.x)",
  "            * smoothstep(0.0, 0.35, uv.y) * smoothstep(1.0, 0.65, uv.y);",
  "  col *= 0.72 + 0.28 * vig;",
  "  gl_FragColor = vec4(col, 1.0);",
  "}",
].join("\n");

function compileShader(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const info = gl.getShaderInfoLog(shader);
    gl.deleteShader(shader);
    throw new Error("Shader compile failed: " + info);
  }
  return shader;
}

function linkProgram(gl, vs, fs) {
  const program = gl.createProgram();
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const info = gl.getProgramInfoLog(program);
    gl.deleteProgram(program);
    throw new Error("Program link failed: " + info);
  }
  return program;
}

function createWebGLLayer(canvas, seed) {
  const gl = canvas.getContext("webgl", {
    alpha: false,
    antialias: false,
    depth: false,
    stencil: false,
    preserveDrawingBuffer: false,
  });
  if (!gl) return null;
  let program;
  try {
    const vs = compileShader(gl, gl.VERTEX_SHADER, WEBGL_VERT);
    const fs = compileShader(gl, gl.FRAGMENT_SHADER, WEBGL_FRAG);
    program = linkProgram(gl, vs, fs);
  } catch (err) {
    return null;
  }
  const vbo = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
  const verts = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);
  gl.bufferData(gl.ARRAY_BUFFER, verts, gl.STATIC_DRAW);
  const aPos = gl.getAttribLocation(program, "aPos");
  gl.enableVertexAttribArray(aPos);
  gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);
  const uRes = gl.getUniformLocation(program, "uRes");
  const uTime = gl.getUniformLocation(program, "uTime");
  const uSeed = gl.getUniformLocation(program, "uSeed");
  gl.useProgram(program);
  gl.uniform1f(uSeed, seed % 100);
  let w = 0;
  let h = 0;
  function resize(cw, ch) {
    const dpr = Math.min(window.devicePixelRatio || 1, CONFIG.WEBGL_DPR_CAP);
    w = Math.max(1, Math.floor(cw * dpr));
    h = Math.max(1, Math.floor(ch * dpr));
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
      gl.viewport(0, 0, w, h);
      gl.uniform2f(uRes, w, h);
    }
  }
  function render(time) {
    gl.uniform1f(uTime, time);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }
  function dispose() {
    gl.deleteBuffer(vbo);
    gl.deleteProgram(program);
  }
  return { resize, render, dispose, gl };
}

/* ============================================================================
   16. MOTOR DE AUDIO (fanfarria de trompetas sintetizada)
   ========================================================================== */

class AudioEngine {
  constructor() {
    this.ctx = null;
    this.master = null;
    this.verbSend = null;
    this.verbReturn = null;
    this.droneNodes = [];
    this.closed = false;
  }

  init() {
    if (this.ctx) return true;
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return false;
    this.ctx = new AC();
    this.master = this.ctx.createGain();
    this.master.gain.value = CONFIG.FANFARE_MASTER;
    const comp = this.ctx.createDynamicsCompressor();
    comp.threshold.value = -18;
    comp.knee.value = 22;
    comp.ratio.value = 8;
    comp.attack.value = 0.004;
    comp.release.value = 0.18;
    this.master.connect(comp);
    comp.connect(this.ctx.destination);
    const delay = this.ctx.createDelay(1.0);
    delay.delayTime.value = CONFIG.REVERB_DELAY;
    const fb = this.ctx.createGain();
    fb.gain.value = CONFIG.REVERB_FEEDBACK;
    const wet = this.ctx.createGain();
    wet.gain.value = CONFIG.REVERB_WET;
    delay.connect(fb);
    fb.connect(delay);
    delay.connect(wet);
    wet.connect(this.master);
    this.verbSend = this.ctx.createGain();
    this.verbSend.gain.value = 1;
    this.verbSend.connect(delay);
    this.verbReturn = this.ctx.createGain();
    this.verbReturn.gain.value = 0.6;
    this.verbReturn.connect(this.master);
    return true;
  }

  resume() {
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  createBrassVoice(freq, startTime, duration) {
    const ctx = this.ctx;
    const osc = ctx.createOscillator();
    osc.type = "sawtooth";
    osc.frequency.value = freq;
    const osc2 = ctx.createOscillator();
    osc2.type = "sawtooth";
    osc2.frequency.value = freq * 1.006;
    const osc3 = ctx.createOscillator();
    osc3.type = "square";
    osc3.frequency.value = freq * 0.5;
    const mix3 = ctx.createGain();
    mix3.gain.value = 0.18;
    const vibrato = ctx.createOscillator();
    vibrato.type = "sine";
    vibrato.frequency.value = CONFIG.FANFARE_VIBRATO_HZ;
    const vibDepth = ctx.createGain();
    vibDepth.gain.value = freq * CONFIG.FANFARE_VIBRATO_DEPTH;
    const vibDelay = ctx.createGain();
    vibDelay.gain.value = 0;
    vibDelay.gain.setValueAtTime(0, startTime);
    vibDelay.gain.linearRampToValueAtTime(1, startTime + duration * 0.4);
    vibrato.connect(vibDepth);
    vibDepth.connect(vibDelay);
    vibDelay.connect(osc.frequency);
    vibDelay.connect(osc2.frequency);
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(750, startTime);
    filter.frequency.linearRampToValueAtTime(2900, startTime + CONFIG.FANFARE_ATTACK * 2.2);
    filter.frequency.linearRampToValueAtTime(2100, startTime + duration * 0.5);
    filter.frequency.linearRampToValueAtTime(900, startTime + duration);
    filter.Q.value = 1.1;
    const env = ctx.createGain();
    env.gain.setValueAtTime(0, startTime);
    env.gain.linearRampToValueAtTime(0.95, startTime + CONFIG.FANFARE_ATTACK);
    env.gain.setValueAtTime(0.88, startTime + duration * 0.55);
    env.gain.setValueAtTime(0.6, startTime + duration * 0.8);
    env.gain.exponentialRampToValueAtTime(0.001, startTime + duration + CONFIG.FANFARE_RELEASE);
    const pan = ctx.createStereoPanner ? ctx.createStereoPanner() : null;
    if (pan) pan.pan.value = (Math.random() - 0.5) * 0.25;
    osc.connect(filter);
    osc2.connect(filter);
    osc3.connect(mix3);
    mix3.connect(filter);
    filter.connect(env);
    if (pan) {
      env.connect(pan);
      pan.connect(this.master);
      pan.connect(this.verbSend);
    } else {
      env.connect(this.master);
      env.connect(this.verbSend);
    }
    osc.start(startTime);
    osc2.start(startTime);
    osc3.start(startTime);
    vibrato.start(startTime);
    osc.stop(startTime + duration + CONFIG.FANFARE_RELEASE + 0.1);
    osc2.stop(startTime + duration + CONFIG.FANFARE_RELEASE + 0.1);
    osc3.stop(startTime + duration + CONFIG.FANFARE_RELEASE + 0.1);
    vibrato.stop(startTime + duration + CONFIG.FANFARE_RELEASE + 0.1);
  }

  playFanfare() {
    if (!this.ctx) return;
    this.resume();
    const now = this.ctx.currentTime + 0.05;
    for (const note of CONFIG.FANFARE) {
      this.createBrassVoice(note.f, now + note.t, note.d);
      if (note.harmony) {
        for (const h of note.harmony) {
          this.createBrassVoice(h, now + note.t, note.d * 0.92);
        }
      }
    }
    this.startDrone(now);
  }

  startDrone(startTime) {
    if (!this.ctx) return;
    const ctx = this.ctx;
    const droneGain = ctx.createGain();
    droneGain.gain.value = 0;
    droneGain.gain.setValueAtTime(0, startTime);
    droneGain.gain.linearRampToValueAtTime(CONFIG.DRONE_GAIN, startTime + 2.5);
    droneGain.gain.linearRampToValueAtTime(0, startTime + 14);
    const freqs = [65.41, 98.0, 130.81];
    for (const f of freqs) {
      const osc = ctx.createOscillator();
      osc.type = "sine";
      osc.frequency.value = f;
      const trem = ctx.createOscillator();
      trem.type = "sine";
      trem.frequency.value = 0.14 + f * 0.0004;
      const tremGain = ctx.createGain();
      tremGain.gain.value = CONFIG.DRONE_GAIN * 0.35;
      const env = ctx.createGain();
      env.gain.value = 0.6;
      trem.connect(tremGain);
      tremGain.connect(env.gain);
      osc.connect(env);
      env.connect(droneGain);
      osc.start(startTime);
      osc.stop(startTime + 14.5);
      trem.start(startTime);
      trem.stop(startTime + 14.5);
      this.droneNodes.push(osc, trem);
    }
    droneGain.connect(this.master);
    droneGain.connect(this.verbSend);
  }

  close() {
    this.closed = true;
    const ctx = this.ctx;
    if (ctx) {
      this.ctx = null;
      const t = ctx.currentTime;
      this.master.gain.cancelScheduledValues(t);
      this.master.gain.setValueAtTime(this.master.gain.value, t);
      this.master.gain.linearRampToValueAtTime(0, t + 0.4);
      setTimeout(() => {
        if (this.closed) ctx.close();
      }, 600);
    }
  }
}

function isAudioSupported() {
  return Boolean(window.AudioContext || window.webkitAudioContext);
}

/* ============================================================================
   17. TITULO NEON ROJO CYBERPUNK (aparece una sola vez)
   ========================================================================== */

function NeonTitle() {
  return (
    <h1 className="bu-title" aria-hidden="true">
      BELENTANI
    </h1>
  );
}

/* ============================================================================
   18. HOOKS
   ========================================================================== */

function useStableSeed(seed) {
  return useMemo(() => (seed == null ? 1337 : seed >>> 0), [seed]);
}

function useAnimationLoop(active) {
  const loopRef = useRef(null);
  const rafRef = useRef(0);
  const lastRef = useRef(0);
  const setLoop = useCallback((fn) => {
    loopRef.current = fn;
  }, []);
  useEffect(() => {
    if (!active) return undefined;
    lastRef.current = performance.now();
    const tick = (now) => {
      const dt = clamp((now - lastRef.current) / 1000, 0, 0.1);
      lastRef.current = now;
      if (loopRef.current) loopRef.current(dt, now / 1000);
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [active]);
  return setLoop;
}

function useResize(active, onResize) {
  const cbRef = useRef(onResize);
  cbRef.current = onResize;
  useEffect(() => {
    if (!active) return undefined;
    let timer = 0;
    const handle = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(() => cbRef.current(), 120);
    };
    window.addEventListener("resize", handle);
    return () => {
      window.removeEventListener("resize", handle);
      window.clearTimeout(timer);
    };
  }, [active]);
}

function useVisibilityPause(active, onPause, onResume) {
  const pauseRef = useRef(onPause);
  const resumeRef = useRef(onResume);
  pauseRef.current = onPause;
  resumeRef.current = onResume;
  useEffect(() => {
    if (!active) return undefined;
    const handle = () => {
      if (document.hidden) pauseRef.current();
      else resumeRef.current();
    };
    document.addEventListener("visibilitychange", handle);
    return () => document.removeEventListener("visibilitychange", handle);
  }, [active]);
}

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    if (mq.addEventListener) mq.addEventListener("change", update);
    else if (mq.addListener) mq.addListener(update);
    return () => {
      if (mq.removeEventListener) mq.removeEventListener("change", update);
      else if (mq.removeListener) mq.removeListener(update);
    };
  }, []);
  return reduced;
}

/* ============================================================================
   19. MOTOR DEL UNIVERSO (orquesta todas las capas)
   ========================================================================== */

function createUniverseEngine(canvas, webglCanvas, seed) {
  const ctx = canvas.getContext("2d");
  const rng = mulberry32(seed);
  const jitterRng = mulberry32(seed ^ 0x9e3779b9);
  const audio = new AudioEngine();
  const events = createEventBus();
  let W = 0;
  let H = 0;
  let stars = [];
  let galaxy = null;
  let nebulas = [];
  let warps = [];
  let dust = [];
  let aurora = [];
  let constellations = [];
  let planets = [];
  let planetSurfaces = [];
  let singularity = null;
  let shooting = [];
  let meteorShower = null;
  let grainTiles = [];
  let webgl = null;
  let catalogStars = [];
  let realConstellations = [];
  let meteorRadiants = [];
  let evolution = [];
  let milkyWay = [];
  let clusters = null;
  let filaments = [];
  let supernovaScheduler = null;
  let comets = [];
  let cometScheduler = null;
  let cosmicRays = [];
  let horizon = null;
  let lake = null;
  let lakeSparkles = [];
  let moonSystems = [];
  let moonCraters = [];
  let binaries = [];
  let variables = [];
  let transits = [];
  let stellarStream = null;
  let bulge = null;
  let pulsar = null;
  let remnant = null;
  let noctilucent = [];
  let embers = [];
  let satellites = [];
  let fpsGraph = null;
  let t = 0;
  let running = false;
  let rafId = 0;
  let lastNow = 0;
  let fpsSamples = [];
  let quality = 2;
  let onFrame = null;
  let titleVisible = false;
  let titleRevealT = -1;

  function buildScene() {
    stars = createStarField(rng, W, H, CONFIG.STAR_COUNT);
    galaxy = createGalaxy(rng, W, H);
    nebulas = createNebulaField(rng, W, H);
    warps = createLiquidLightField(rng, W, H);
    dust = createDustField(rng, W, H);
    aurora = createAuroraField(rng, W, H);
    constellations = buildConstellations(rng, stars, W, H);
    planets = createPlanetField(rng, W, H);
    planetSurfaces = planets.map((p) => createGasGiantSurface(rng, p));
    singularity = createSingularity(W, H);
    meteorShower = createMeteorShower(rng);
    grainTiles = createGrainTiles(jitterRng, 128, CONFIG.GRAIN_TILES);
    catalogStars = buildStarCatalog(rng, W, H);
    realConstellations = buildRealConstellations(catalogStars);
    meteorRadiants = buildMeteorRadiants(rng, W, H);
    evolution = createEvolutionField(rng, catalogStars);
    milkyWay = buildMilkyWay(rng, W, H);
    clusters = createClusterField(rng, W, H);
    filaments = createNebulaFilaments(rng, nebulas, W, H);
    supernovaScheduler = createSupernovaScheduler(rng);
    cometScheduler = createCometScheduler(rng);
    cosmicRays = createCosmicRayField(rng, W, H, CONFIG.COSMIC_RAYS);
    horizon = createHorizonField(rng, W, H);
    lake = createLake(rng, W, H);
    lakeSparkles = createLakeSparkles(rng, W, H, lake);
    moonSystems = createMoonSystem(rng, planets);
    moonCraters = moonSystems.map((sys) => sys.moons.map((m) => createMoonCraters(rng, m)));
    binaries = createBinaryField(rng, catalogStars);
    variables = createVariableField(rng, catalogStars);
    transits = createTransitField(rng, catalogStars);
    stellarStream = createStellarStream(rng, W, H);
    bulge = createGalacticBulge(rng, W, H);
    pulsar = createPulsar(rng, W, H);
    remnant = createSupernovaRemnant(rng, W, H);
    noctilucent = createNoctilucentField(rng, W, H);
    embers = createEmberField(rng, W, H);
    satellites = createSatelliteField(rng, W, H);
    if (!fpsGraph) fpsGraph = createFpsGraph(256, 64);
  }

  function resize() {
    const parent = canvas.parentElement;
    if (!parent) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = parent.clientWidth;
    H = parent.clientHeight;
    canvas.width = Math.floor(W * dpr);
    canvas.height = Math.floor(H * dpr);
    canvas.style.width = W + "px";
    canvas.style.height = H + "px";
    canvas._buDpr = dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    if (webglCanvas) {
      if (!webgl) webgl = createWebGLLayer(webglCanvas, seed);
      if (webgl) webgl.resize(W, H);
    }
    buildScene();
  }

  function drawFrame(dt, time) {
    t = time;
    const tMs = t * 1000;
    if (webgl) webgl.render(t);
    ctx.clearRect(0, 0, W, H);
    if (!webgl) drawVerticalGradient(ctx, W, H, backgroundGradientStops());
    drawZodiacalLight(ctx, W, H, t);
    drawAirglow(ctx, W, H, t);
    drawLiquidSheen(ctx, W, H, t);
    drawChromaticFrame(ctx, W, H, t);
    drawAuroraField(ctx, aurora, W, t, quality);
    drawNoctilucent(ctx, noctilucent, W, t, quality);
    drawMilkyWay(ctx, milkyWay, t, quality);
    drawGalacticBulge(ctx, bulge, t, quality);
    drawStellarStream(ctx, stellarStream, t, quality);
    drawNebulaField(ctx, nebulas, t, dt, W, H);
    drawFilaments(ctx, filaments, t, quality);
    drawLiquidLight(ctx, warps, t, dt, W, H);
    drawLiquidMeniscus(ctx, W, H, t);
    drawClusterField(ctx, clusters, t, quality);
    drawGalaxy(ctx, galaxy, t, quality);
    if (singularity) drawSingularity(ctx, singularity, t);
    if (remnant) drawSupernovaRemnant(ctx, remnant, t, quality);
    drawConstellations(ctx, constellations, t, quality);
    drawRealConstellations(ctx, realConstellations, t, quality);
    drawMeteorRadiants(ctx, meteorRadiants, t, quality);
    drawStarCatalog(ctx, rng, catalogStars, t, dt, W, H, quality);
    drawBinaryField(ctx, binaries, t, quality);
    drawVariableField(ctx, variables, t, quality);
    drawTransitField(ctx, transits, t, quality);
    drawEvolutionField(ctx, evolution, t, tMs, quality);
    drawStarField(ctx, rng, stars, t, dt, W, H, quality);
    drawLensFlares(ctx, stars, W, H, quality);
    if (pulsar) drawPulsar(ctx, pulsar, W, H, t, quality);
    drawSupernovaLayer(ctx, supernovaScheduler, t);
    drawComets(ctx, comets, t, quality);
    drawCosmicRays(ctx, rng, cosmicRays, dt, W, H, quality);
    drawSatelliteField(ctx, satellites, dt, t, W, H, quality);
    ctx.globalCompositeOperation = "lighter";
    drawShootingStars(ctx, rng, shooting, dt, t, W, H);
    ctx.globalCompositeOperation = "source-over";
    if (
      quality >= 1 &&
      shooting.length < CONFIG.SHOOTING_MAX &&
      jitterRng() < CONFIG.RADIANT_METEOR_CHANCE
    ) {
      shooting.push(spawnRadiantMeteor(jitterRng, W, H, meteorRadiants));
    }
    updateMeteorShower(meteorShower, t, jitterRng, shooting, W, H);
    updateSupernovas(supernovaScheduler, t, jitterRng, W, H, events);
    updateComets(cometScheduler, t, jitterRng, W, H, comets, events);
    drawPlanets(ctx, planets, t, quality, planetSurfaces);
    drawMoonSystems(ctx, moonSystems, t, dt, quality, moonCraters);
    drawHorizonField(ctx, horizon, W, H, t);
    drawObservatory(ctx, jitterRng, W, H, horizon.near.baseY);
    drawForestSilhouette(ctx, jitterRng, W, H, horizon.near.baseY);
    drawLightPollutionDome(ctx, W, H, t);
    drawLake(ctx, lake, lakeSparkles, W, H, t);
    if (titleVisible) drawTitleReflection(ctx, W, H, t, titleAlpha());
    drawEmberField(ctx, embers, dt, W, H, t, quality);
    drawDustField(ctx, dust, dt, W, H, quality);
    drawGrain(ctx, grainTiles, W, H, quality);
    drawScanlines(ctx, W, H, quality);
    drawVignette(ctx, W, H);
    const fps = 1 / Math.max(dt, 1e-4);
    if (fpsGraph) fpsGraph.push(fps);
    quality = updateQuality(fpsSamples, dt);
    if (onFrame) onFrame(t, quality);
  }

  function frame(now) {
    if (!running) return;
    const dt = clamp((now - lastNow) / 1000, 0, 0.1);
    lastNow = now;
    drawFrame(dt, now / 1000);
    rafId = requestAnimationFrame(frame);
  }

  function start() {
    if (running) return;
    running = true;
    lastNow = performance.now();
    rafId = requestAnimationFrame(frame);
  }

  function stop() {
    running = false;
    cancelAnimationFrame(rafId);
  }

  function playFanfare() {
    if (audio.init()) audio.playFanfare();
  }

  function playOpening(revealMs) {
    if (audio.init()) audio.playOpeningScore(revealMs);
  }

  function playReveal() {
    if (audio.init()) {
      audio.playFanfare();
      audio.playPercussion();
      audio.playImpact();
      audio.playLetterPlucks(9);
      audio.playShimmer(4.5);
    }
  }

  function closeAudio() {
    audio.close();
  }

  function setTitleVisible(v) {
    titleVisible = Boolean(v);
    if (titleVisible) titleRevealT = t;
  }

  function titleAlpha() {
    if (!titleVisible || titleRevealT < 0) return 0;
    return smoothstep(0, 0.9, t - titleRevealT);
  }

  resize();

  return {
    start,
    stop,
    resize,
    renderFrame: drawFrame,
    playFanfare,
    playOpening,
    playReveal,
    closeAudio,
    setTitleVisible,
    dispose() {
      stop();
      if (webgl) webgl.dispose();
      closeAudio();
      if (events) events.clear();
    },
    set onFrame(fn) { onFrame = fn; },
    get time() { return t; },
    get isRunning() { return running; },
    get audioSupported() { return isAudioSupported(); },
    get starCount() { return stars.length; },
    get quality() { return quality; },
    get seed() { return seed; },
    get events() { return events; },
    get titleVisible() { return titleVisible; },
    get fps() {
      if (!fpsSamples.length) return 0;
      let sum = 0;
      for (let i = 0; i < fpsSamples.length; i++) sum += fpsSamples[i];
      return sum / fpsSamples.length;
    },
  };
}

/* ============================================================================
   20. COMPONENTE PRINCIPAL
   ========================================================================== */

function BelentaniUniverseInner({ seed, fanfareAt, titleDuration, onReveal }) {
  const stableSeed = useStableSeed(seed);
  const reducedMotion = useReducedMotion();
  const webglRef = useRef(null);
  const canvasRef = useRef(null);
  const engineRef = useRef(null);
  const startedRef = useRef(false);
  const [started, setStarted] = useState(false);
  const [showTitle, setShowTitle] = useState(false);
  const timersRef = useRef([]);
  const revealAt = fanfareAt == null ? CONFIG.FANFARE_AT : fanfareAt;
  const titleFor = titleDuration == null ? CONFIG.TITLE_DURATION : titleDuration;

  useResize(started && !reducedMotion, () => {
    if (engineRef.current) engineRef.current.resize();
  });

  useVisibilityPause(started && !reducedMotion, () => {
    if (engineRef.current) engineRef.current.stop();
  }, () => {
    if (engineRef.current) engineRef.current.start();
  });

  const start = useCallback(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    setStarted(true);
  }, []);

  useEffect(() => {
    if (!started) return undefined;
    const engine = createUniverseEngine(
      canvasRef.current,
      reducedMotion ? null : webglRef.current,
      stableSeed
    );
    engineRef.current = engine;
    if (reducedMotion) {
      engine.renderFrame(0.016, 1.0);
    } else {
      engine.start();
    }
    engine.playOpening(revealAt);
    const t1 = window.setTimeout(() => {
      setShowTitle(true);
      engine.setTitleVisible(true);
      if (onReveal) onReveal();
      const t2 = window.setTimeout(() => {
        setShowTitle(false);
        engine.setTitleVisible(false);
      }, titleFor);
      timersRef.current.push(t2);
    }, revealAt);
    timersRef.current.push(t1);
    return () => {
      timersRef.current.forEach((id) => window.clearTimeout(id));
      timersRef.current = [];
      engine.dispose();
      engineRef.current = null;
    };
  }, [started, reducedMotion, stableSeed, revealAt, titleFor, onReveal]);

  return (
    <div className="bu-root">
      <canvas ref={webglRef} className="bu-webgl" aria-hidden="true" />
      <canvas ref={canvasRef} className="bu-canvas" aria-hidden="true" />
      {!started && (
        <div
          className="bu-gate"
          onClick={start}
          role="button"
          tabIndex={0}
          aria-label="Iniciar el universo"
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              start();
            }
          }}
        >
          <div className="bu-gate-ring" />
          <div className="bu-gate-dot" />
        </div>
      )}
      {showTitle && <NeonTitleLetters />}
    </div>
  );
}

function BelentaniUniverse(props) {
  const {
    seed = 1337,
    fanfareAt,
    titleDuration,
    onReveal,
  } = props || {};
  return (
    <BelentaniUniverseInner
      seed={seed}
      fanfareAt={fanfareAt}
      titleDuration={titleDuration}
      onReveal={onReveal}
    />
  );
}

/* ============================================================================
   21. ESTILOS (sin texto: solo el punto de inicio y el nombre)
   ========================================================================== */

const BU_CSS = `
.bu-root {
  position: fixed;
  inset: 0;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: #080503;
  contain: strict;
}
.bu-webgl,
.bu-canvas {
  position: absolute;
  inset: 0;
  display: block;
  width: 100%;
  height: 100%;
}
.bu-webgl { z-index: 1; }
.bu-canvas { z-index: 2; }
.bu-gate {
  position: absolute;
  inset: 0;
  z-index: 3;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  background: radial-gradient(ellipse at center, rgba(20,12,6,0.25) 0%, rgba(8,5,3,0.72) 100%);
  -webkit-tap-highlight-color: transparent;
  outline: none;
}
.bu-gate:focus-visible {
  box-shadow: inset 0 0 0 2px rgba(255,42,42,0.55);
}
.bu-gate-ring {
  position: absolute;
  width: 120px;
  height: 120px;
  border-radius: 50%;
  border: 1px solid rgba(255,190,120,0.18);
  animation: buRing 3.2s ease-in-out infinite;
}
.bu-gate-dot {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: rgba(255,205,150,0.95);
  box-shadow:
    0 0 18px 6px rgba(255,190,120,0.55),
    0 0 60px 22px rgba(200,110,50,0.28),
    0 0 140px 60px rgba(140,70,30,0.14);
  animation: buBreathe 2.6s ease-in-out infinite;
}
@keyframes buBreathe {
  0%, 100% { transform: scale(0.82); opacity: 0.62; }
  50% { transform: scale(1.35); opacity: 1; }
}
@keyframes buRing {
  0%, 100% { transform: scale(0.9); opacity: 0.35; }
  50% { transform: scale(1.25); opacity: 0.7; }
}
.bu-title {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 4;
  margin: 0;
  padding: 0;
  font-family: 'Orbitron', 'Arial Black', sans-serif;
  font-weight: 900;
  font-size: clamp(2.6rem, 11vw, 10rem);
  letter-spacing: 0.18em;
  text-indent: 0.18em;
  color: #ff2a2a;
  white-space: nowrap;
  user-select: none;
  pointer-events: none;
  text-shadow:
    0 0 6px #ff1133,
    0 0 18px #ff1133,
    0 0 42px #ff0022,
    0 0 90px #cc0022,
    0 0 160px #880011,
    0 0 260px #550008;
  animation:
    buNeonPulse 1.15s ease-in-out infinite,
    buTitleEnter 1.7s cubic-bezier(0.19, 1, 0.22, 1) both,
    buGlitch 3.7s steps(1) infinite;
}
.bu-title-letters { animation: none; }
.bu-letter {
  display: inline-block;
  color: #ff2a2a;
  text-shadow:
    0 0 6px #ff1133,
    0 0 18px #ff1133,
    0 0 42px #ff0022,
    0 0 90px #cc0022,
    0 0 160px #880011,
    0 0 260px #550008;
  animation:
    buNeonPulse 1.15s ease-in-out infinite,
    buLetterEnter 1.7s cubic-bezier(0.19, 1, 0.22, 1) both,
    buLetterGlitch 3.7s steps(1) infinite;
}
@keyframes buTitleEnter {
  0% {
    transform: translate(-50%, -50%) scale(3.4);
    opacity: 0;
    filter: blur(34px) brightness(2.4);
  }
  38% {
    opacity: 1;
    filter: blur(8px) brightness(1.5);
  }
  100% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 1;
    filter: blur(0) brightness(1);
  }
}
@keyframes buLetterEnter {
  0% {
    transform: scale(3.2) translateY(14px);
    opacity: 0;
    filter: blur(26px) brightness(2.6);
  }
  38% {
    opacity: 1;
    filter: blur(7px) brightness(1.55);
  }
  100% {
    transform: scale(1) translateY(0);
    opacity: 1;
    filter: blur(0) brightness(1);
  }
}
@keyframes buNeonPulse {
  0%, 100% {
    text-shadow:
      0 0 7px #ff1133,
      0 0 22px #ff1133,
      0 0 48px #ff0022,
      0 0 96px #cc0022,
      0 0 170px #880011,
      0 0 280px #550008;
    opacity: 1;
  }
  50% {
    text-shadow:
      0 0 4px #ff3355,
      0 0 12px #ff1133,
      0 0 28px #ff0022,
      0 0 58px #cc0022,
      0 0 100px #880011,
      0 0 160px #550008;
    opacity: 0.84;
  }
}
@keyframes buGlitch {
  0%, 92.9%, 100% { transform: translate(-50%, -50%) scale(1); }
  93% { transform: translate(calc(-50% + 5px), -50%) skewX(4deg) scale(1); }
  94.5% { transform: translate(calc(-50% - 5px), -50%) skewX(-4deg) scale(1.02); }
  96% { transform: translate(-50%, calc(-50% + 3px)) scale(1); }
  97.2% { transform: translate(calc(-50% + 2px), calc(-50% - 2px)) skewX(2deg) scale(1); }
}
@keyframes buLetterGlitch {
  0%, 92.9%, 100% { transform: scale(1) translateY(0); }
  93% { transform: skewX(5deg) translateY(-1px); }
  94.5% { transform: scale(1.04) translateY(-2px) skewX(-5deg); }
  96% { transform: translateY(1px); }
  97.2% { transform: skewX(2deg); }
}
@media (prefers-reduced-motion: reduce) {
  .bu-title, .bu-title-letters .bu-letter { animation: none; opacity: 0.95; }
  .bu-gate-dot, .bu-gate-ring { animation: none; }
}
`;

const BelentaniUniverseComponent = Object.assign(BelentaniUniverse, {
  NeonTitle,
  NeonTitleLetters,
  AudioEngine,
  CONFIG,
});

export default BelentaniUniverseComponent;
export {
  BelentaniUniverse,
  NeonTitle,
  NeonTitleLetters,
  AudioEngine,
  CONFIG,
  createUniverseEngine,
  createEventBus,
};

export const BU_STYLE = BU_CSS;

/* ============================================================================
   22. CIENCIA DE COLOR Y ATMOSFERA
   ========================================================================== */

function kelvinToRgb(kelvin) {
  const t = clamp(kelvin, 1000, 40000) / 100;
  let r;
  let g;
  let b;
  if (t <= 66) {
    r = 255;
    g = 99.4708025861 * Math.log(t) - 161.1195681661;
  } else {
    r = 329.698727446 * Math.pow(t - 60, -0.1332047592);
    g = 288.1221695283 * Math.pow(t - 60, -0.0755148492);
  }
  if (t >= 66) {
    b = 255;
  } else if (t <= 19) {
    b = 0;
  } else {
    b = 138.5177312231 * Math.log(t - 10) - 305.0447927307;
  }
  return [clampByte(r), clampByte(g), clampByte(b)];
}

function spectralClassToKelvin(cls) {
  const table = { O: 40000, B: 20000, A: 9000, F: 7000, G: 5500, K: 4000, M: 3000 };
  return table[cls] || 6000;
}

function magnitudeToFlux(mag) {
  return Math.pow(10, -0.4 * mag);
}

function magnitudeToRadius(mag, maxRadius) {
  const flux = magnitudeToFlux(mag);
  const ref = magnitudeToFlux(1.0);
  return maxRadius * Math.pow(flux / ref, 0.35);
}

function airmass(altitudeDeg) {
  const z = clamp(90 - altitudeDeg, 0, 89.9) * (Math.PI / 180);
  return 1 / (Math.cos(z) + 0.50572 * Math.pow(96.07995 - (90 - altitudeDeg), -1.6364));
}

function extinctionCoefficient(altitudeDeg) {
  return 0.12 * airmass(altitudeDeg);
}

function applyAtmosphericExtinction(color, mag, altitudeDeg) {
  const k = extinctionCoefficient(altitudeDeg);
  const dim = Math.pow(10, -0.4 * k);
  const redden = clamp01(k * 0.55);
  const dimmed = shade(color, dim);
  return {
    color: mixRgb(dimmed, [255, 140, 80], redden * 0.5),
    magnitude: mag + k,
    alpha: clamp01(1 - k * 0.5),
  };
}

function chromaticScintillation(t, x, y, w, h) {
  const nx = x / w;
  const ny = y / h;
  const base = fbm2D(nx * 40 + t * 3.1, ny * 40 - t * 2.3, 3);
  const shift = (base - 0.5) * 18;
  return {
    rShift: shift,
    bShift: -shift,
    intensity: 0.5 + base * 0.5,
  };
}

function atmosphericRefraction(altitudeDeg) {
  if (altitudeDeg > 85) return 0;
  const z = clamp(90 - altitudeDeg, 0, 90) * (Math.PI / 180);
  const tanZ = Math.tan(z);
  return (
    (1.02 / Math.tan((90 - altitudeDeg + 10.3 / (90 - altitudeDeg + 5.11)) * (Math.PI / 180))) / 60
  ) * (tanZ > 0 ? 1 : 0);
}

function skyBackgroundAt(altitudeDeg, t) {
  const a = clamp01(altitudeDeg / 90);
  const base = mixRgb([10, 7, 5], [22, 14, 8], a);
  const shimmer = 0.5 + 0.5 * Math.sin(t * 0.4 + altitudeDeg * 0.1);
  return mixRgb(base, CONFIG.EARTH_TONES[1], 0.04 * shimmer * a);
}

/* ============================================================================
   23. CATALOGO DE ESTRELLAS REALES (coordenadas aproximadas)
   ========================================================================== */

const SPECTRAL_INDEX = { O: 0, B: 1, A: 2, F: 3, G: 4, K: 5, M: 6 };

const BRIGHT_STAR_CATALOG = [
  ["Sirius", 6.75, -16.72, -1.46, "A"],
  ["Canopus", 6.40, -52.70, -0.74, "A"],
  ["Arcturus", 14.26, 19.18, -0.05, "K"],
  ["Vega", 18.62, 38.78, 0.03, "A"],
  ["Capella", 5.28, 45.99, 0.08, "G"],
  ["Rigel", 5.24, -8.20, 0.13, "B"],
  ["Procyon", 7.66, 5.22, 0.34, "F"],
  ["Betelgeuse", 5.92, 7.41, 0.42, "M"],
  ["Achernar", 1.63, -57.24, 0.46, "B"],
  ["Hadar", 14.06, -60.37, 0.61, "B"],
  ["Altair", 19.85, 8.87, 0.76, "A"],
  ["Acrux", 12.44, -63.10, 0.76, "B"],
  ["Aldebaran", 4.60, 16.51, 0.86, "K"],
  ["Antares", 16.49, -26.43, 0.96, "M"],
  ["Spica", 13.42, -11.16, 0.97, "B"],
  ["Pollux", 7.76, 28.03, 1.14, "K"],
  ["Fomalhaut", 22.96, -29.62, 1.16, "A"],
  ["Deneb", 20.69, 45.28, 1.25, "A"],
  ["Mimosa", 12.80, -59.69, 1.25, "B"],
  ["Regulus", 10.14, 11.97, 1.35, "B"],
  ["Adhara", 6.98, -28.97, 1.50, "B"],
  ["Castor", 7.58, 31.89, 1.58, "A"],
  ["Gacrux", 12.52, -57.11, 1.63, "M"],
  ["Bellatrix", 5.42, 6.35, 1.64, "B"],
  ["Elnath", 5.44, 28.61, 1.65, "B"],
  ["Miaplacidus", 9.22, -69.71, 1.68, "A"],
  ["Alnilam", 5.68, -1.20, 1.69, "B"],
  ["Alnair", 22.14, -46.96, 1.74, "B"],
  ["Alnitak", 5.68, -1.94, 1.77, "O"],
  ["Alioth", 12.90, 55.96, 1.77, "A"],
  ["Dubhe", 11.06, 61.75, 1.79, "K"],
  ["Mirfak", 3.40, 49.86, 1.79, "F"],
  ["Wezen", 7.14, -26.39, 1.83, "F"],
  ["Sargas", 17.62, -42.99, 1.87, "F"],
  ["Kaus Australis", 18.40, -34.38, 1.85, "B"],
  ["Avior", 8.40, -59.51, 1.86, "K"],
  ["Alkaid", 13.79, 49.31, 1.86, "B"],
  ["Megrez", 12.25, 57.03, 3.31, "A"],
  ["Delta Cygni", 19.75, 45.13, 2.87, "B"],
  ["Menkalinan", 5.99, 44.95, 1.90, "A"],
  ["Atria", 16.81, -69.03, 1.91, "K"],
  ["Alhena", 6.63, 16.40, 1.92, "A"],
  ["Peacock", 20.43, -56.74, 1.94, "B"],
  ["Alsephina", 8.73, -54.71, 1.96, "A"],
  ["Mirzam", 6.38, -17.96, 1.98, "B"],
  ["Alphard", 8.43, 5.19, 1.98, "K"],
  ["Polaris", 2.53, 89.26, 1.98, "F"],
  ["Hamal", 2.12, 23.46, 2.00, "K"],
  ["Nekkar", 15.03, 21.19, 2.08, "G"],
  ["Algieba", 10.33, 19.84, 2.08, "K"],
  ["Rasalhague", 17.58, 12.56, 2.08, "A"],
  ["Kochab", 14.85, 74.16, 2.08, "K"],
  ["Saiph", 5.80, -9.67, 2.09, "B"],
  ["Denebola", 11.77, 14.57, 2.11, "A"],
  ["Algol", 3.14, 40.96, 2.12, "B"],
  ["Almach", 2.06, 42.33, 2.10, "K"],
  ["Diphda", 0.73, -17.99, 2.04, "K"],
  ["Nunki", 18.92, -26.30, 2.05, "B"],
  ["Menkent", 14.06, -36.38, 2.06, "K"],
  ["Mirach", 1.11, 35.62, 2.07, "M"],
  ["Alpheratz", 0.14, 29.09, 2.07, "B"],
  ["Mintaka", 5.53, -0.30, 2.23, "O"],
  ["Mizar", 13.42, 54.93, 2.23, "A"],
  ["Schedar", 0.67, 56.54, 2.24, "K"],
  ["Sadr", 20.37, 40.26, 2.23, "F"],
  ["Caph", 0.15, 59.15, 2.27, "F"],
  ["Shaula", 17.56, -37.10, 1.62, "B"],
  ["Larawag", 16.84, -34.29, 2.29, "K"],
  ["Mahasim", 5.99, 37.21, 2.62, "A"],
  ["Almaaz", 5.03, 43.82, 2.99, "F"],
  ["Aludra", 7.00, -29.30, 2.39, "B"],
  ["Merak", 11.02, 56.38, 2.37, "A"],
  ["Phecda", 11.90, 53.69, 2.44, "A"],
  ["Navi", 0.95, 60.72, 2.47, "B"],
  ["Seginus", 15.07, 38.31, 3.04, "A"],
  ["Albireo", 19.51, 27.96, 3.05, "K"],
  ["Gienah Cygni", 20.77, 33.97, 2.48, "K"],
  ["Ruchbah", 1.43, 60.24, 2.68, "A"],
  ["Segin", 1.91, 63.67, 3.38, "B"],
  ["Menkar", 0.44, 4.20, 2.54, "K"],
  ["Zaurak", 3.88, -13.25, 2.87, "M"],
  ["Cursa", 5.23, -5.04, 2.79, "A"],
  ["Tarazed", 19.77, 10.36, 2.72, "K"],
  ["Alshain", 19.51, 6.41, 3.71, "G"],
  ["Sadalmelik", 22.10, -0.32, 2.94, "G"],
  ["Sadalsuud", 21.53, -5.57, 2.91, "G"],
  ["Dabih", 20.55, -14.77, 2.82, "A"],
  ["Deneb Algedi", 21.86, -16.13, 2.84, "A"],
  ["Nashira", 21.67, -16.67, 3.69, "A"],
  ["Algedi", 21.74, -9.88, 3.69, "G"],
  ["Sheratan", 1.91, 20.81, 2.64, "A"],
  ["Mesarthim", 1.88, 19.29, 3.88, "A"],
  ["Tarf", 8.30, 9.16, 3.53, "K"],
  ["Mebsuta", 6.74, 25.13, 2.97, "G"],
  ["Propus", 6.27, 22.51, 3.31, "M"],
  ["Tejat", 6.38, 22.83, 2.87, "M"],
  ["Alzirr", 6.74, 12.90, 3.35, "F"],
  ["Wasat", 7.34, 21.98, 3.53, "F"],
  ["Gomeisa", 7.58, 8.26, 2.90, "B"],
  ["Furud", 7.28, -30.23, 3.02, "B"],
  ["Phact", 5.68, -33.99, 2.65, "B"],
  ["Na'ir al Saif", 5.59, -5.91, 2.77, "O"],
  ["Hyadum I", 4.33, 15.63, 3.65, "K"],
  ["Hassaleh", 4.93, 33.16, 2.69, "K"],
  ["Haedus", 5.37, 43.39, 3.18, "B"],
  ["Gamma Persei", 3.07, 53.42, 2.93, "G"],
  ["Delta Andromedae", 0.43, 30.86, 3.28, "A"],
  ["Mothallah", 1.94, 29.57, 3.42, "F"],
  ["Beta Trianguli", 2.10, 34.98, 3.00, "A"],
  ["Alrescha", 2.03, 2.77, 3.82, "A"],
  ["Gamma Piscium", 0.49, 19.41, 3.70, "G"],
  ["Eta Piscium", 1.75, 15.35, 3.62, "G"],
  ["Zubeneschamali", 15.28, -9.38, 2.61, "B"],
  ["Zubenelgenubi", 14.85, -16.04, 2.75, "A"],
  ["Porrima", 11.57, -1.45, 2.74, "F"],
  ["Minelauva", 12.95, 3.41, 3.39, "M"],
  ["Vindemiatrix", 13.10, 10.96, 2.83, "G"],
  ["Heze", 13.52, -0.62, 3.38, "A"],
  ["Zavijava", 11.82, 1.45, 3.60, "G"],
  ["Chertan", 10.77, 15.43, 3.32, "A"],
  ["Adhafera", 10.28, 23.42, 3.33, "F"],
  ["Nusakan", 15.47, 29.11, 3.66, "F"],
  ["Muphrid", 13.90, 18.40, 2.68, "G"],
  ["Izar", 14.75, 27.07, 2.37, "K"],
  ["Pherkad", 15.35, 71.83, 3.05, "A"],
  ["Yildun", 17.73, 86.59, 4.36, "A"],
  ["Alderamin", 21.19, 62.59, 2.44, "A"],
  ["Alfirk", 21.49, 70.40, 3.23, "B"],
  ["Errai", 23.39, 77.64, 3.21, "K"],
  ["Alphecca", 15.58, 26.71, 2.23, "A"],
  ["Alpha Tucanae", 0.19, -60.18, 2.87, "K"],
  ["Alpha Hydri", 2.32, -61.56, 2.86, "F"],
  ["Beta Hydri", 0.39, -77.16, 2.82, "G"],
  ["Gamma Hydri", 0.45, -74.52, 3.24, "M"],
  ["Beta Pavonis", 20.74, -66.16, 3.42, "A"],
  ["Gamma Pavonis", 21.34, -65.42, 4.21, "F"],
  ["Alpha Lupi", 14.85, -46.03, 2.30, "B"],
  ["Beta Lupi", 15.26, -43.03, 2.68, "B"],
  ["Gamma Lupi", 15.49, -41.18, 2.80, "B"],
  ["Eta Lupi", 15.89, -38.47, 3.41, "B"],
  ["Alpha Muscae", 12.62, -69.30, 2.69, "B"],
  ["Beta Muscae", 12.92, -68.85, 3.05, "B"],
  ["Gamma Muscae", 12.68, -72.12, 3.87, "B"],
  ["Delta Muscae", 12.97, -71.31, 3.61, "K"],
  ["Alpha Chamaeleontis", 8.20, -76.88, 4.07, "F"],
  ["Alpha Apodis", 14.81, -79.27, 3.83, "K"],
  ["Beta Apodis", 15.70, -79.42, 4.24, "K"],
  ["Gamma Apodis", 15.24, -75.59, 3.86, "K"],
  ["Alpha Volantis", 7.44, -71.87, 4.00, "A"],
  ["Beta Volantis", 7.30, -71.12, 3.77, "K"],
  ["Gamma Volantis", 7.36, -70.72, 3.77, "F"],
  ["Alpha Doradus", 5.60, -55.03, 3.27, "A"],
  ["Beta Doradus", 5.66, -62.56, 3.76, "F"],
  ["Gamma Doradus", 5.74, -51.90, 4.25, "F"],
  ["Zeta Doradus", 5.60, -57.29, 4.71, "F"],
  ["Alpha Pictoris", 5.52, -61.94, 3.27, "A"],
  ["Beta Pictoris", 5.98, -51.00, 3.85, "A"],
  ["Epsilon Carinae", 8.40, -59.51, 1.86, "K"],
  ["Iota Carinae", 9.53, -59.32, 2.21, "A"],
  ["Upsilon Carinae", 9.60, -65.04, 2.97, "A"],
  ["Theta Carinae", 9.65, -64.03, 2.74, "B"],
  ["Omega Carinae", 9.95, -70.03, 3.29, "B"],
  ["PP Carinae", 9.60, -61.94, 3.30, "B"],
  ["V337 Carinae", 9.94, -61.00, 3.36, "K"],
  ["l Carinae", 10.40, -62.00, 3.69, "G"],
  ["AG Carinae", 10.70, -60.30, 3.80, "B"],
  ["HR 3220", 8.53, -52.52, 4.75, "F"],
  ["x Carinae", 8.70, -58.00, 4.04, "K"],
  ["p Carinae", 9.40, -59.94, 3.80, "A"],
  ["q Carinae", 9.50, -64.00, 4.49, "K"],
  ["a Carinae", 9.90, -69.00, 3.87, "K"],
  ["l Carinae B", 12.40, -70.00, 4.90, "A"],
];

function buildStarCatalog(rng, w, h) {
  const stars = [];
  for (let i = 0; i < BRIGHT_STAR_CATALOG.length; i++) {
    const entry = BRIGHT_STAR_CATALOG[i];
    const name = entry[0];
    const raH = entry[1];
    const dec = entry[2];
    const mag = entry[3];
    const cls = entry[4];
    const raFrac = raH / 24;
    const x = raFrac * w;
    const y = ((90 - dec) / 180) * h * 0.92;
    if (y < -20 || y > h + 20) continue;
    const kelvin = spectralClassToKelvin(cls);
    const tint = kelvinToRgb(kelvin);
    const alt = 90 - Math.abs(dec);
    const corrected = applyAtmosphericExtinction(tint, mag, alt);
    const radius = magnitudeToRadius(corrected.magnitude, 3.2);
    stars.push({
      name,
      x,
      y,
      raH,
      dec,
      mag: corrected.magnitude,
      cls,
      kelvin,
      tint: corrected.color,
      size: clamp(radius, 0.5, 3.2),
      alpha: corrected.alpha * clamp01(magnitudeToFlux(mag) * 6),
      twinkleSpeed: 0.3 + rng() * 1.8,
      twinklePhase: rng() * TAU,
      flare: corrected.magnitude < 1.2,
    });
  }
  return stars;
}

function drawStarCatalog(ctx, rng, catalog, t, dt, w, h, quality) {
  const scint = quality >= 1;
  for (let i = 0; i < catalog.length; i++) {
    const s = catalog[i];
    const tw = 0.5 + 0.5 * Math.sin(t * s.twinkleSpeed + s.twinklePhase);
    let alpha = s.alpha * (0.5 + 0.5 * tw);
    let tint = s.tint;
    if (scint) {
      const sc = chromaticScintillation(t, s.x, s.y, w, h);
      alpha *= sc.intensity;
      tint = [
        clampByte(s.tint[0] + sc.rShift * 3),
        s.tint[1],
        clampByte(s.tint[2] + sc.bShift * 3),
      ];
    }
    drawStarGlow(ctx, { x: s.x, y: s.y, size: s.size, tint }, alpha);
    drawStarCore(ctx, { x: s.x, y: s.y, size: s.size, tint }, alpha);
    if (s.flare && quality >= 1) {
      drawStarSpikes(ctx, { x: s.x, y: s.y, size: s.size, tint }, alpha);
    }
  }
}

/* ============================================================================
   24. BANDA DE LA VIA LACTEA
   ========================================================================== */

function buildMilkyWay(rng, w, h) {
  const band = [];
  const inclination = 0.35;
  const offset = h * 0.08;
  for (let i = 0; i < 5200; i++) {
    const t = rng();
    const x = t * w;
    const centerY = h * 0.5 + Math.sin(t * TAU * 1.3 + 0.6) * h * 0.16 * inclination + offset;
    const spread = h * 0.055 * (0.6 + 0.4 * Math.sin(t * TAU * 0.7));
    const y = centerY + gauss(rng) * spread;
    if (y < -10 || y > h + 10) continue;
    const density = 0.5 + 0.5 * Math.sin(t * TAU * 2.2 + 1.1);
    const darkLane = Math.exp(-Math.pow((y - centerY) / (spread * 0.35), 2));
    band.push({
      x,
      y,
      size: 0.2 + rng() * 0.7,
      tint: mixRgb(
        pick(rng, CONFIG.STAR_TINTS),
        pick(rng, CONFIG.EARTH_TONES),
        0.35
      ),
      alpha: (0.06 + rng() * 0.16) * density,
      dark: darkLane * (0.4 + rng() * 0.6),
      twinkleSpeed: 0.2 + rng() * 1.4,
      twinklePhase: rng() * TAU,
    });
  }
  return band;
}

function drawMilkyWay(ctx, milkyWay, t, quality) {
  const step = quality >= 1 ? 1 : 3;
  ctx.globalCompositeOperation = "lighter";
  for (let i = 0; i < milkyWay.length; i += step) {
    const s = milkyWay[i];
    const tw = 0.5 + 0.5 * Math.sin(t * s.twinkleSpeed + s.twinklePhase);
    const alpha = s.alpha * (0.4 + 0.6 * tw) * (1 - s.dark * 0.55);
    ctx.fillStyle = rgbaString(s.tint, alpha);
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.size, 0, TAU);
    ctx.fill();
  }
  ctx.globalCompositeOperation = "source-over";
}

/* ============================================================================
   25. CUMULOS ESTELARES
   ========================================================================== */

function createGlobularCluster(rng, cx, cy) {
  const count = 260 + (rng() * 220) | 0;
  const radius = (0.02 + rng() * 0.03) * Math.min(cx * 2, 800);
  const stars = [];
  for (let i = 0; i < count; i++) {
    const r = Math.pow(rng(), 2.2) * radius;
    const a = rng() * TAU;
    stars.push({
      x: cx + Math.cos(a) * r,
      y: cy + Math.sin(a) * r * 0.85,
      size: 0.25 + rng() * 0.6,
      tint: mixRgb([255, 240, 220], [255, 200, 150], rng()),
      alpha: 0.25 + rng() * 0.5,
      twinkleSpeed: 0.5 + rng() * 2,
      twinklePhase: rng() * TAU,
    });
  }
  return { cx, cy, radius, stars, coreGlow: 0.25 + rng() * 0.2 };
}

function createOpenCluster(rng, cx, cy) {
  const count = 18 + (rng() * 30) | 0;
  const radius = (0.02 + rng() * 0.04) * 600;
  const stars = [];
  for (let i = 0; i < count; i++) {
    const a = rng() * TAU;
    const r = Math.pow(rng(), 0.8) * radius;
    stars.push({
      x: cx + Math.cos(a) * r,
      y: cy + Math.sin(a) * r,
      size: 0.4 + rng() * 1.1,
      tint: pick(rng, CONFIG.STAR_TINTS),
      alpha: 0.3 + rng() * 0.5,
      twinkleSpeed: 0.4 + rng() * 2.2,
      twinklePhase: rng() * TAU,
    });
  }
  return { cx, cy, radius, stars, coreGlow: 0.08 + rng() * 0.08 };
}

function createClusterField(rng, w, h) {
  const globulars = [];
  const opens = [];
  for (let i = 0; i < 3; i++) {
    globulars.push(
      createGlobularCluster(rng, rng() * w, rng() * h * 0.7)
    );
  }
  for (let i = 0; i < 4; i++) {
    opens.push(
      createOpenCluster(rng, rng() * w, rng() * h * 0.6)
    );
  }
  return { globulars, opens };
}

function drawCluster(ctx, cluster, t, isGlobular) {
  const g = ctx.createRadialGradient(
    cluster.cx, cluster.cy, 0,
    cluster.cx, cluster.cy, cluster.radius * 1.4
  );
  g.addColorStop(0, rgbaString(CONFIG.EARTH_HIGHLIGHT, cluster.coreGlow));
  g.addColorStop(1, rgbaString(CONFIG.EARTH_HIGHLIGHT, 0));
  ctx.globalCompositeOperation = "lighter";
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(cluster.cx, cluster.cy, cluster.radius * 1.4, 0, TAU);
  ctx.fill();
  for (let i = 0; i < cluster.stars.length; i++) {
    const s = cluster.stars[i];
    const tw = 0.5 + 0.5 * Math.sin(t * s.twinkleSpeed + s.twinklePhase);
    const alpha = s.alpha * (0.45 + 0.55 * tw);
    ctx.fillStyle = rgbaString(s.tint, alpha);
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.size, 0, TAU);
    ctx.fill();
  }
  ctx.globalCompositeOperation = "source-over";
}

function drawClusterField(ctx, clusters, t, quality) {
  if (quality < 1) return;
  for (let i = 0; i < clusters.globulars.length; i++) {
    drawCluster(ctx, clusters.globulars[i], t, true);
  }
  for (let i = 0; i < clusters.opens.length; i++) {
    drawCluster(ctx, clusters.opens[i], t, false);
  }
}

/* ============================================================================
   26. SUPERNOVAS (eventos raros)
   ========================================================================== */

function createSupernovaScheduler(rng) {
  return {
    nextAt: 14000 + rng() * 20000,
    active: null,
    history: [],
  };
}

function spawnSupernova(rng, w, h) {
  return {
    x: w * (0.15 + rng() * 0.7),
    y: h * (0.1 + rng() * 0.5),
    startT: null,
    duration: 5200 + rng() * 3000,
    peakAlpha: 0.85 + rng() * 0.15,
    tint: mixRgb([255, 250, 240], pick(rng, CONFIG.STAR_TINTS), 0.35),
    rings: 5,
  };
}

function updateSupernovas(scheduler, t, rng, w, h, events) {
  if (!scheduler.active && t * 1000 >= scheduler.nextAt) {
    scheduler.active = spawnSupernova(rng, w, h);
    scheduler.active.startT = t;
    scheduler.history.push(scheduler.active);
    if (events) events.emit("supernova", scheduler.active);
  }
  if (scheduler.active) {
    const age = (t - scheduler.active.startT) * 1000;
    if (age >= scheduler.active.duration) {
      scheduler.active = null;
      scheduler.nextAt = t * 1000 + 16000 + rng() * 26000;
    }
  }
}

function drawSupernova(ctx, sn, t) {
  const age = clamp01((t - sn.startT) * 1000 / sn.duration);
  const attack = smoothstep(0, 0.06, age);
  const decay = 1 - smoothstep(0.06, 1, age);
  const alpha = sn.peakAlpha * attack * decay;
  const r = lerp(6, 260, easeOutCubic(age));
  ctx.globalCompositeOperation = "lighter";
  const core = ctx.createRadialGradient(sn.x, sn.y, 0, sn.x, sn.y, r * 0.35);
  core.addColorStop(0, rgbaString(sn.tint, alpha));
  core.addColorStop(0.5, rgbaString(sn.tint, alpha * 0.4));
  core.addColorStop(1, rgbaString(sn.tint, 0));
  ctx.fillStyle = core;
  ctx.beginPath();
  ctx.arc(sn.x, sn.y, r * 0.35, 0, TAU);
  ctx.fill();
  for (let i = 0; i < sn.rings; i++) {
    const ringAge = clamp01(age * 1.4 - i * 0.12);
    if (ringAge <= 0 || ringAge >= 1) continue;
    const rr = lerp(10, 320, easeOutCubic(ringAge));
    const ringAlpha = alpha * (1 - ringAge) * 0.5;
    ctx.strokeStyle = rgbaString(sn.tint, ringAlpha);
    ctx.lineWidth = 1.5 + (1 - ringAge) * 2;
    ctx.beginPath();
    ctx.arc(sn.x, sn.y, rr, 0, TAU);
    ctx.stroke();
  }
  ctx.globalCompositeOperation = "source-over";
}

function drawSupernovaLayer(ctx, scheduler, t) {
  if (scheduler.active) drawSupernova(ctx, scheduler.active, t);
}

/* ============================================================================
   27. COMETAS
   ========================================================================== */

function createComet(rng, w, h) {
  const fromLeft = rng() < 0.5;
  const speed = 2.2 + rng() * 2.6;
  return {
    x: fromLeft ? -120 : w + 120,
    y: h * (0.08 + rng() * 0.3),
    vx: (fromLeft ? 1 : -1) * speed,
    vy: speed * (0.25 + rng() * 0.35),
    comaR: 14 + rng() * 22,
    tailLen: 160 + rng() * 220,
    tint: mixRgb([210, 235, 255], [255, 230, 190], 0.4),
    alpha: 0.5 + rng() * 0.3,
    phase: rng() * TAU,
    ionFlicker: 4 + rng() * 5,
  };
}

function updateComet(c, dt, w, h) {
  c.x += c.vx * dt * 60;
  c.y += c.vy * dt * 60;
  c.phase += dt * 2;
}

function cometAlive(c, w) {
  return c.x > -c.tailLen - 200 && c.x < w + c.tailLen + 200;
}

function drawComet(ctx, c, t) {
  const flicker = 0.7 + 0.3 * Math.sin(t * c.ionFlicker + c.phase);
  const tx = c.x - c.vx * 60 * c.tailLen * 0.09;
  const ty = c.y - c.vy * 60 * c.tailLen * 0.09;
  ctx.globalCompositeOperation = "lighter";
  const ionTail = ctx.createLinearGradient(c.x, c.y, tx, ty);
  ionTail.addColorStop(0, rgbaString([180, 220, 255], c.alpha * 0.5 * flicker));
  ionTail.addColorStop(0.4, rgbaString([150, 200, 255], c.alpha * 0.22 * flicker));
  ionTail.addColorStop(1, rgbaString([150, 200, 255], 0));
  ctx.strokeStyle = ionTail;
  ctx.lineWidth = c.comaR * 0.5;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(c.x, c.y);
  ctx.lineTo(tx, ty);
  ctx.stroke();
  const dustTail = ctx.createLinearGradient(
    c.x, c.y,
    c.x - c.vx * 40 * c.tailLen * 0.06 - 30,
    c.y - c.vy * 40 * c.tailLen * 0.06 + 24
  );
  dustTail.addColorStop(0, rgbaString([255, 220, 170], c.alpha * 0.4));
  dustTail.addColorStop(1, rgbaString([255, 220, 170], 0));
  ctx.strokeStyle = dustTail;
  ctx.lineWidth = c.comaR * 0.8;
  ctx.beginPath();
  ctx.moveTo(c.x, c.y);
  ctx.lineTo(c.x - c.vx * 40 * c.tailLen * 0.06 - 30, c.y - c.vy * 40 * c.tailLen * 0.06 + 24);
  ctx.stroke();
  const coma = ctx.createRadialGradient(c.x, c.y, 0, c.x, c.y, c.comaR);
  coma.addColorStop(0, rgbaString([255, 255, 250], c.alpha * 0.9));
  coma.addColorStop(0.4, rgbaString(c.tint, c.alpha * 0.5));
  coma.addColorStop(1, rgbaString(c.tint, 0));
  ctx.fillStyle = coma;
  ctx.beginPath();
  ctx.arc(c.x, c.y, c.comaR, 0, TAU);
  ctx.fill();
  const nucleus = ctx.createRadialGradient(c.x, c.y, 0, c.x, c.y, c.comaR * 0.22);
  nucleus.addColorStop(0, rgbaString([255, 255, 255], c.alpha));
  nucleus.addColorStop(1, rgbaString([255, 255, 255], 0));
  ctx.fillStyle = nucleus;
  ctx.beginPath();
  ctx.arc(c.x, c.y, c.comaR * 0.22, 0, TAU);
  ctx.fill();
  ctx.globalCompositeOperation = "source-over";
}

function createCometScheduler(rng) {
  return {
    nextAt: 9000 + rng() * 14000,
    active: null,
  };
}

function updateComets(scheduler, t, rng, w, h, comets, events) {
  if (!scheduler.active && t * 1000 >= scheduler.nextAt) {
    scheduler.active = createComet(rng, w, h);
    comets.push(scheduler.active);
    if (events) events.emit("comet", scheduler.active);
  }
  for (let i = comets.length - 1; i >= 0; i--) {
    const c = comets[i];
    updateComet(c, dtZero(), w, h);
    if (!cometAlive(c, w)) {
      comets.splice(i, 1);
    }
  }
  if (scheduler.active && !comets.includes(scheduler.active)) {
    scheduler.active = null;
    scheduler.nextAt = t * 1000 + 14000 + rng() * 20000;
  }
}

function dtZero() {
  return 1 / 60;
}

function drawComets(ctx, comets, t, quality) {
  if (quality < 1) return;
  for (let i = 0; i < comets.length; i++) {
    drawComet(ctx, comets[i], t);
  }
}

/* ============================================================================
   28. RAYOS COSMICOS
   ========================================================================== */

function createCosmicRay(rng, w, h) {
  const vertical = rng() < 0.35;
  const speed = 14 + rng() * 18;
  return {
    x: rng() * w,
    y: rng() * h,
    vx: vertical ? (rng() - 0.5) * speed * 0.2 : (rng() < 0.5 ? -1 : 1) * speed,
    vy: vertical ? (rng() < 0.5 ? -1 : 1) * speed : (rng() - 0.5) * speed * 0.2,
    life: 0.5 + rng() * 0.8,
    width: 0.6 + rng() * 0.9,
    tint: pick(rng, CONFIG.STAR_TINTS),
  };
}

function updateCosmicRay(r, dt, w, h) {
  r.x += r.vx * dt * 60;
  r.y += r.vy * dt * 60;
  r.life -= dt;
}

function drawCosmicRay(ctx, r) {
  const a = clamp01(r.life);
  const len = 14 + a * 22;
  const dir = new Vec2(r.vx, r.vy).norm();
  const tx = r.x - dir.x * len;
  const ty = r.y - dir.y * len;
  const grad = ctx.createLinearGradient(r.x, r.y, tx, ty);
  grad.addColorStop(0, rgbaString(r.tint, a * 0.7));
  grad.addColorStop(1, rgbaString(r.tint, 0));
  ctx.strokeStyle = grad;
  ctx.lineWidth = r.width;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(r.x, r.y);
  ctx.lineTo(tx, ty);
  ctx.stroke();
}

function createCosmicRayField(rng, w, h, count) {
  const rays = [];
  for (let i = 0; i < count; i++) rays.push(createCosmicRay(rng, w, h));
  return rays;
}

function drawCosmicRays(ctx, rng, rays, dt, w, h, quality) {
  if (quality < 1) return;
  for (let i = rays.length - 1; i >= 0; i--) {
    const r = rays[i];
    updateCosmicRay(r, dt, w, h);
    if (r.life <= 0 || r.x < -60 || r.x > w + 60 || r.y < -60 || r.y > h + 60) {
      if (rng() < 0.4) rays[i] = createCosmicRay(rng, w, h);
      else rays.splice(i, 1);
      continue;
    }
    drawCosmicRay(ctx, r);
  }
}

/* ============================================================================
   29. LUZ ZODIACAL Y AIRGLOW
   ========================================================================== */

function drawZodiacalLight(ctx, w, h, t) {
  ctx.globalCompositeOperation = "lighter";
  const apexX = w * 0.3;
  const apexY = h * 0.18;
  const g = ctx.createRadialGradient(apexX, apexY, 0, apexX, apexY, w * 0.5);
  const a = 0.05 + 0.012 * Math.sin(t * 0.11);
  g.addColorStop(0, rgbaString(CONFIG.EARTH_HIGHLIGHT, a));
  g.addColorStop(0.5, rgbaString(CONFIG.EARTH_TONES[1], a * 0.4));
  g.addColorStop(1, rgbaString(CONFIG.EARTH_TONES[1], 0));
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.ellipse(apexX, apexY, w * 0.5, h * 0.42, -0.5, 0, TAU);
  ctx.fill();
  ctx.globalCompositeOperation = "source-over";
}

function drawAirglow(ctx, w, h, t) {
  ctx.globalCompositeOperation = "lighter";
  const bands = 3;
  for (let b = 0; b < bands; b++) {
    const yBase = h * (0.35 + b * 0.16);
    const g = ctx.createLinearGradient(0, yBase - h * 0.06, 0, yBase + h * 0.06);
    const a = 0.028 + 0.012 * Math.sin(t * 0.17 + b * 2.1);
    const color = b === 1 ? [86, 142, 92] : CONFIG.EARTH_TONES[1];
    g.addColorStop(0, rgbaString(color, 0));
    g.addColorStop(0.5, rgbaString(color, a));
    g.addColorStop(1, rgbaString(color, 0));
    ctx.fillStyle = g;
    ctx.fillRect(0, yBase - h * 0.06, w, h * 0.12);
  }
  ctx.globalCompositeOperation = "source-over";
}

/* ============================================================================
   30. HORIZONTE TERROSO (silueta de montañas)
   ========================================================================== */

function createHorizonRidge(rng, w, h, baseY, roughness, seedOffset) {
  const points = [];
  const steps = 220;
  const f1 = 2.2 + rng() * 1.4;
  const f2 = 5.5 + rng() * 2.5;
  const f3 = 11 + rng() * 5;
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const n =
      fbm2D(t * f1 + seedOffset, seedOffset * 0.7, 4) * 0.65 +
      fbm2D(t * f2 + seedOffset * 2, seedOffset, 3) * 0.25 +
      fbm2D(t * f3, seedOffset * 3, 2) * 0.1;
    const ridge = Math.pow(1 - Math.abs(n * 2 - 1), 1.4);
    const y = baseY - ridge * h * roughness;
    points.push(new Vec2(t * w, y));
  }
  return { points, baseY, roughness };
}

function createHorizonField(rng, w, h) {
  const farBase = h * 0.78;
  const nearBase = h * 0.88;
  return {
    far: createHorizonRidge(rng, w, h, farBase, 0.10, 3.7),
    near: createHorizonRidge(rng, w, h, nearBase, 0.07, 9.2),
    hazeColor: CONFIG.EARTH_TONES[1],
    hazeAlpha: 0.16,
  };
}

function drawHorizonRidge(ctx, ridge, w, h, fillColor) {
  ctx.beginPath();
  ctx.moveTo(0, h);
  ctx.lineTo(0, ridge.points[0].y);
  for (let i = 1; i < ridge.points.length; i++) {
    ctx.lineTo(ridge.points[i].x, ridge.points[i].y);
  }
  ctx.lineTo(w, h);
  ctx.closePath();
  ctx.fillStyle = fillColor;
  ctx.fill();
}

function drawHorizonField(ctx, horizon, w, h, t) {
  const haze = ctx.createLinearGradient(0, h * 0.55, 0, h * 0.9);
  haze.addColorStop(0, rgbaString(horizon.hazeColor, 0));
  haze.addColorStop(0.75, rgbaString(horizon.hazeColor, horizon.hazeAlpha * (0.8 + 0.2 * Math.sin(t * 0.09))));
  haze.addColorStop(1, rgbaString(horizon.hazeColor, horizon.hazeAlpha * 1.4));
  ctx.fillStyle = haze;
  ctx.fillRect(0, h * 0.55, w, h * 0.35);
  drawHorizonRidge(ctx, horizon.far, w, h, rgbString(shade(CONFIG.EARTH_TONES[4], 1.35)));
  drawHorizonRidge(ctx, horizon.near, w, h, rgbString(shade(CONFIG.EARTH_DEEP, 0.9)));
}

/* ============================================================================
   31. REFLEJO EN AGUA (brillo de luz liquida)
   ========================================================================== */

function createLake(rng, w, h) {
  const y0 = h * 0.9;
  return {
    y0,
    rippleSeed: rng() * 100,
    rippleFreq: 0.018 + rng() * 0.012,
    rippleSpeed: 0.5 + rng() * 0.4,
    shimmerSeed: rng() * 100,
    reflectivity: 0.32 + rng() * 0.14,
    depthColor: shade(CONFIG.EARTH_DEEP, 0.55),
    sparkles: [],
    sparkleCount: 260,
  };
}

function createLakeSparkles(rng, w, h, lake) {
  const sparkles = [];
  for (let i = 0; i < lake.sparkleCount; i++) {
    sparkles.push({
      x: rng() * w,
      y: lake.y0 + rng() * (h - lake.y0) * 0.95,
      phase: rng() * TAU,
      speed: 0.8 + rng() * 2.4,
      size: 0.6 + rng() * 1.8,
      alpha: 0.1 + rng() * 0.35,
    });
  }
  return sparkles;
}

function lakeRippleX(lake, x, y, t) {
  const n = fbm2D(x * lake.rippleFreq + lake.rippleSeed, y * 0.05 + t * lake.rippleSpeed, 3);
  return (n - 0.5) * 7;
}

function lakeRippleY(lake, x, y, t) {
  const n = fbm2D(x * 0.04 - t * lake.rippleSpeed * 0.7, y * lake.rippleFreq + lake.rippleSeed, 3);
  return (n - 0.5) * 3.5;
}

function drawLakeBase(ctx, lake, w, h, t) {
  const g = ctx.createLinearGradient(0, lake.y0, 0, h);
  g.addColorStop(0, rgbaString(lake.depthColor, 0.95));
  g.addColorStop(0.4, rgbaString(shade(lake.depthColor, 0.8), 0.98));
  g.addColorStop(1, rgbString(shade(lake.depthColor, 0.5)));
  ctx.fillStyle = g;
  ctx.fillRect(0, lake.y0, w, h - lake.y0);
  ctx.globalCompositeOperation = "lighter";
  for (let i = 0; i < 26; i++) {
    const y = lake.y0 + (i / 26) * (h - lake.y0);
    const wob = Math.sin(t * 0.6 + i * 0.7) * w * 0.01;
    ctx.beginPath();
    ctx.moveTo(0, y + wob);
    for (let x = 0; x <= w; x += Math.max(10, w / 90)) {
      const ry = y + lakeRippleY(lake, x, y, t);
      ctx.lineTo(x, ry);
    }
    ctx.strokeStyle = rgbaString(CONFIG.EARTH_HIGHLIGHT, 0.028 + 0.014 * Math.sin(t * 0.4 + i));
    ctx.lineWidth = 1;
    ctx.stroke();
  }
  ctx.globalCompositeOperation = "source-over";
}

function drawLakeReflection(ctx, lake, w, h, t) {
  const depth = h - lake.y0;
  ctx.save();
  ctx.beginPath();
  ctx.rect(0, lake.y0, w, depth);
  ctx.clip();
  ctx.translate(0, lake.y0 * 2 + depth * 0.12);
  ctx.scale(1, -0.82);
  ctx.globalAlpha = lake.reflectivity;
  ctx.globalCompositeOperation = "lighter";
  const refl = ctx.createLinearGradient(0, 0, 0, -depth / 0.82);
  refl.addColorStop(0, rgbaString(CONFIG.EARTH_HIGHLIGHT, 0.12));
  refl.addColorStop(0.5, rgbaString(CONFIG.EARTH_TONES[1], 0.05));
  refl.addColorStop(1, rgbaString(CONFIG.EARTH_TONES[1], 0));
  ctx.fillStyle = refl;
  ctx.fillRect(0, 0, w, depth / 0.82);
  ctx.globalCompositeOperation = "source-over";
  ctx.globalAlpha = 1;
  ctx.restore();
}

function drawLakeSparkles(ctx, lake, sparkles, t) {
  ctx.globalCompositeOperation = "lighter";
  for (let i = 0; i < sparkles.length; i++) {
    const s = sparkles[i];
    const tw = Math.pow(0.5 + 0.5 * Math.sin(t * s.speed + s.phase), 3);
    const alpha = s.alpha * tw;
    if (alpha < 0.004) continue;
    const g = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.size * 4);
    g.addColorStop(0, rgbaString(CONFIG.EARTH_HIGHLIGHT, alpha));
    g.addColorStop(1, rgbaString(CONFIG.EARTH_HIGHLIGHT, 0));
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.size * 4, 0, TAU);
    ctx.fill();
  }
  ctx.globalCompositeOperation = "source-over";
}

function drawLake(ctx, lake, sparkles, w, h, t) {
  drawLakeBase(ctx, lake, w, h, t);
  drawLakeReflection(ctx, lake, w, h, t);
  drawLakeSparkles(ctx, lake, sparkles, t);
}

/* ============================================================================
   32. LUNAS EN ORBITA KEPLERIANA
   ========================================================================== */

function createMoon(rng, planet, index) {
  const orbitR = planet.r * (1.9 + index * 0.9 + rng() * 0.4);
  const period = 6 + rng() * 14;
  const size = planet.r * (0.1 + rng() * 0.09);
  return {
    orbitR,
    period,
    phase: rng() * TAU,
    size,
    tint: mixRgb(pick(rng, CONFIG.EARTH_TONES), [230, 220, 205], 0.5),
    dark: shade(CONFIG.EARTH_DEEP, 0.8),
    light: CONFIG.EARTH_HIGHLIGHT,
    tilt: (rng() - 0.5) * 0.6,
    trail: [],
    trailMax: 42,
  };
}

function createMoonSystem(rng, planets) {
  const systems = [];
  for (let i = 0; i < planets.length; i++) {
    const moonCount = 1 + (rng() * 2) | 0;
    const moons = [];
    for (let m = 0; m < moonCount; m++) {
      moons.push(createMoon(rng, planets[i], m));
    }
    systems.push({ planet: planets[i], moons });
  }
  return systems;
}

function moonPosition(moon, planet, t) {
  const a = moon.phase + (t / moon.period) * TAU;
  const x = planet.x + Math.cos(a) * moon.orbitR;
  const y = planet.y + Math.sin(a) * moon.orbitR * Math.cos(moon.tilt) * 0.5;
  return new Vec2(x, y);
}

function updateMoonTrail(moon, planet, t) {
  const p = moonPosition(moon, planet, t);
  moon.trail.push(p);
  if (moon.trail.length > moon.trailMax) moon.trail.shift();
}

function drawMoon(ctx, moon, planet, t) {
  const p = moonPosition(moon, planet, t);
  const wCss = ctx.canvas.width / (ctx.canvas._buDpr || 1);
  if (p.x < -moon.size * 4 || p.x > wCss + moon.size * 4) return;
  const g = ctx.createRadialGradient(
    p.x - moon.size * 0.4, p.y - moon.size * 0.4, moon.size * 0.1,
    p.x, p.y, moon.size
  );
  g.addColorStop(0, rgbaString(lighten(moon.tint, 0.35), 0.95));
  g.addColorStop(0.55, rgbaString(moon.tint, 0.9));
  g.addColorStop(1, rgbaString(moon.dark, 0.95));
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(p.x, p.y, moon.size, 0, TAU);
  ctx.fill();
  const halo = ctx.createRadialGradient(p.x, p.y, moon.size * 0.8, p.x, p.y, moon.size * 2.6);
  halo.addColorStop(0, rgbaString(moon.light, 0.1));
  halo.addColorStop(1, rgbaString(moon.light, 0));
  ctx.fillStyle = halo;
  ctx.beginPath();
  ctx.arc(p.x, p.y, moon.size * 2.6, 0, TAU);
  ctx.fill();
}

function drawMoonOrbit(ctx, moon, planet) {
  ctx.save();
  ctx.translate(planet.x, planet.y);
  ctx.rotate(moon.tilt * 0.4);
  ctx.scale(1, Math.cos(moon.tilt) * 0.5);
  ctx.strokeStyle = rgbaString(moon.tint, 0.07);
  ctx.lineWidth = 0.7;
  ctx.beginPath();
  ctx.arc(0, 0, moon.orbitR, 0, TAU);
  ctx.stroke();
  ctx.restore();
}

function drawMoonTrails(ctx, moon) {
  if (moon.trail.length < 2) return;
  ctx.strokeStyle = rgbaString(moon.tint, 0.1);
  ctx.lineWidth = 0.6;
  ctx.beginPath();
  ctx.moveTo(moon.trail[0].x, moon.trail[0].y);
  for (let i = 1; i < moon.trail.length; i++) {
    ctx.lineTo(moon.trail[i].x, moon.trail[i].y);
  }
  ctx.stroke();
}

function drawMoonSystems(ctx, systems, t, dt, quality, cratersMap) {
  if (quality < 1) return;
  const w = ctx.canvas.width / (ctx.canvas._buDpr || 1);
  for (let s = 0; s < systems.length; s++) {
    const sys = systems[s];
    for (let i = 0; i < sys.moons.length; i++) {
      const moon = sys.moons[i];
      updateMoonTrail(moon, sys.planet, t);
      if (quality >= 2) {
        drawMoonOrbit(ctx, moon, sys.planet);
        drawMoonTrails(ctx, moon);
      }
      drawMoon(ctx, moon, sys.planet, t);
      if (cratersMap && cratersMap[s] && cratersMap[s][i] && quality >= 2) {
        const p = moonPosition(moon, sys.planet, t);
        if (p.x > -moon.size * 4 && p.x < w + moon.size * 4) {
          drawMoonCraters(ctx, moon, cratersMap[s][i], p.x, p.y);
        }
      }
    }
  }
}

/* ============================================================================
   33. BUS DE EVENTOS Y SERIALIZADOR DE ESCENA
   ========================================================================== */

function createEventBus() {
  const listeners = new Map();
  return {
    on(event, fn) {
      if (!listeners.has(event)) listeners.set(event, []);
      listeners.get(event).push(fn);
      return () => {
        const arr = listeners.get(event);
        if (arr) {
          const idx = arr.indexOf(fn);
          if (idx >= 0) arr.splice(idx, 1);
        }
      };
    },
    emit(event, payload) {
      const arr = listeners.get(event);
      if (!arr) return;
      for (let i = 0; i < arr.length; i++) {
        try {
          arr[i](payload);
        } catch (err) {
          if (typeof console !== "undefined" && console.error) {
            console.error("[BelentaniUniverse] event handler error:", err);
          }
        }
      }
    },
    clear() {
      listeners.clear();
    },
  };
}

function sceneToJSON(engine) {
  return JSON.stringify({
    seed: engine.seed,
    time: engine.time,
    quality: engine.quality,
    starCount: engine.starCount,
    audioSupported: engine.audioSupported,
    version: "1.0.0",
  });
}

function createDebugStats(engine) {
  return {
    snapshot() {
      return {
        time: engine.time,
        quality: engine.quality,
        stars: engine.starCount,
        fps: engine.fps || 0,
      };
    },
    log() {
      if (typeof console !== "undefined" && console.log) {
        console.log("[BelentaniUniverse]", sceneToJSON(engine));
      }
    },
  };
}

/* ============================================================================
   34. AUDIO EXTENDIDO (timpano, coro, riser, impacto)
   ========================================================================== */

function createTimpaniHit(ctx, dest, freq, startTime, duration) {
  const osc = ctx.createOscillator();
  osc.type = "sine";
  osc.frequency.setValueAtTime(freq * 1.9, startTime);
  osc.frequency.exponentialRampToValueAtTime(freq, startTime + 0.09);
  const env = ctx.createGain();
  env.gain.setValueAtTime(0, startTime);
  env.gain.linearRampToValueAtTime(0.7, startTime + 0.008);
  env.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
  const noise = ctx.createBufferSource();
  const noiseBuf = ctx.createBuffer(1, ctx.sampleRate * 0.05, ctx.sampleRate);
  const data = noiseBuf.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / data.length, 2);
  noise.buffer = noiseBuf;
  const noiseEnv = ctx.createGain();
  noiseEnv.gain.setValueAtTime(0.25, startTime);
  noiseEnv.gain.exponentialRampToValueAtTime(0.001, startTime + 0.06);
  const filter = ctx.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = 900;
  osc.connect(env);
  noise.connect(filter);
  filter.connect(noiseEnv);
  env.connect(dest);
  noiseEnv.connect(dest);
  osc.start(startTime);
  osc.stop(startTime + duration + 0.05);
  noise.start(startTime);
  noise.stop(startTime + 0.08);
}

function createChoirPad(ctx, dest, freqs, startTime, duration) {
  for (const f of freqs) {
    for (let v = 0; v < 4; v++) {
      const osc = ctx.createOscillator();
      osc.type = "sawtooth";
      osc.frequency.value = f * (1 + (v - 1.5) * 0.004);
      osc.detune.value = (v - 1.5) * 7;
      const bp = ctx.createBiquadFilter();
      bp.type = "bandpass";
      bp.frequency.value = f * 2.4;
      bp.Q.value = 2.2;
      const env = ctx.createGain();
      env.gain.setValueAtTime(0, startTime);
      env.gain.linearRampToValueAtTime(0.05, startTime + duration * 0.45);
      env.gain.setValueAtTime(0.05, startTime + duration * 0.7);
      env.gain.linearRampToValueAtTime(0, startTime + duration);
      const lfo = ctx.createOscillator();
      lfo.frequency.value = 4.6 + v * 0.3;
      const lfoGain = ctx.createGain();
      lfoGain.gain.value = 0.018;
      lfo.connect(lfoGain);
      lfoGain.connect(env.gain);
      osc.connect(bp);
      bp.connect(env);
      env.connect(dest);
      osc.start(startTime);
      osc.stop(startTime + duration + 0.1);
      lfo.start(startTime);
      lfo.stop(startTime + duration + 0.1);
    }
  }
}

function createRiser(ctx, dest, startTime, duration) {
  const osc = ctx.createOscillator();
  osc.type = "sawtooth";
  osc.frequency.setValueAtTime(110, startTime);
  osc.frequency.exponentialRampToValueAtTime(1760, startTime + duration);
  const filter = ctx.createBiquadFilter();
  filter.type = "bandpass";
  filter.frequency.setValueAtTime(400, startTime);
  filter.frequency.exponentialRampToValueAtTime(6400, startTime + duration);
  filter.Q.value = 6;
  const env = ctx.createGain();
  env.gain.setValueAtTime(0, startTime);
  env.gain.linearRampToValueAtTime(0.12, startTime + duration * 0.85);
  env.gain.linearRampToValueAtTime(0, startTime + duration);
  osc.connect(filter);
  filter.connect(env);
  env.connect(dest);
  osc.start(startTime);
  osc.stop(startTime + duration + 0.05);
  const noise = ctx.createBufferSource();
  const noiseBuf = ctx.createBuffer(1, Math.floor(ctx.sampleRate * duration), ctx.sampleRate);
  const data = noiseBuf.getChannelData(0);
  for (let i = 0; i < data.length; i++) {
    data[i] = (Math.random() * 2 - 1) * (i / data.length);
  }
  noise.buffer = noiseBuf;
  const nFilter = ctx.createBiquadFilter();
  nFilter.type = "highpass";
  nFilter.frequency.setValueAtTime(300, startTime);
  nFilter.frequency.exponentialRampToValueAtTime(9000, startTime + duration);
  const nEnv = ctx.createGain();
  nEnv.gain.setValueAtTime(0, startTime);
  nEnv.gain.linearRampToValueAtTime(0.05, startTime + duration * 0.9);
  nEnv.gain.linearRampToValueAtTime(0, startTime + duration);
  noise.connect(nFilter);
  nFilter.connect(nEnv);
  nEnv.connect(dest);
  noise.start(startTime);
  noise.stop(startTime + duration + 0.05);
}

function createImpact(ctx, dest, startTime) {
  const osc = ctx.createOscillator();
  osc.type = "sine";
  osc.frequency.setValueAtTime(160, startTime);
  osc.frequency.exponentialRampToValueAtTime(38, startTime + 1.4);
  const env = ctx.createGain();
  env.gain.setValueAtTime(0.85, startTime);
  env.gain.exponentialRampToValueAtTime(0.001, startTime + 1.8);
  osc.connect(env);
  env.connect(dest);
  osc.start(startTime);
  osc.stop(startTime + 1.9);
  const noise = ctx.createBufferSource();
  const noiseBuf = ctx.createBuffer(1, ctx.sampleRate * 0.4, ctx.sampleRate);
  const data = noiseBuf.getChannelData(0);
  for (let i = 0; i < data.length; i++) {
    data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / data.length, 1.6);
  }
  noise.buffer = noiseBuf;
  const filter = ctx.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.setValueAtTime(5200, startTime);
  filter.frequency.exponentialRampToValueAtTime(140, startTime + 0.5);
  const nEnv = ctx.createGain();
  nEnv.gain.setValueAtTime(0.5, startTime);
  nEnv.gain.exponentialRampToValueAtTime(0.001, startTime + 0.55);
  noise.connect(filter);
  filter.connect(nEnv);
  nEnv.connect(dest);
  noise.start(startTime);
  noise.stop(startTime + 0.6);
}

function extendAudioEngine(AudioEngineClass) {
  const proto = AudioEngineClass.prototype;
  proto.playPercussion = function () {
    if (!this.ctx) return;
    this.resume();
    const now = this.ctx.currentTime + 0.05;
    const notes = CONFIG.FANFARE.filter((n) => n.t >= 1.5);
    for (const note of notes) {
      const freq = note.f / 2;
      const t = now + note.t - 1.6;
      if (t >= now) createTimpaniHit(this.ctx, this.master, freq, t, note.d);
    }
  };
  proto.playChoir = function () {
    if (!this.ctx) return;
    this.resume();
    const now = this.ctx.currentTime + 0.05;
    createChoirPad(
      this.ctx,
      this.verbSend,
      [130.81, 196.0, 261.63, 329.63],
      now,
      9.5
    );
  };
  proto.playRiser = function () {
    if (!this.ctx) return;
    this.resume();
    const now = this.ctx.currentTime + 0.05;
    createRiser(this.ctx, this.master, now, 7.5);
  };
  proto.playImpact = function () {
    if (!this.ctx) return;
    this.resume();
    const now = this.ctx.currentTime + 0.05;
    createImpact(this.ctx, this.master, now);
  };
  proto.playFullScore = function () {
    this.playRiser();
    const self = this;
    setTimeout(() => {
      self.playFanfare();
      self.playPercussion();
      self.playChoir();
      self.playImpact();
    }, 7400);
  };
  return AudioEngineClass;
}

/* ============================================================================
   35. TITULO POR LETRAS (revelado escalonado)
   ========================================================================== */

function NeonLetter({ ch, index, total }) {
  const delay = 0.055 * index;
  return (
    <span
      className="bu-letter"
      style={{
        animationDelay: `${delay}s, ${delay}s, ${delay}s`,
        animationDuration: "1.15s, 1.7s, 3.7s",
      }}
      aria-hidden="true"
    >
      {ch}
    </span>
  );
}

function NeonTitleLetters() {
  const text = "BELENTANI";
  const letters = [];
  for (let i = 0; i < text.length; i++) {
    letters.push(
      <NeonLetter key={i} ch={text.charAt(i)} index={i} total={text.length} />
    );
  }
  return (
    <h1 className="bu-title bu-title-letters" aria-hidden="true">
      {letters}
    </h1>
  );
}

function isNeonTitleLettersEnabled() {
  return true;
}

/* ============================================================================
   36. CONSTELACIONES REALES (figuras reconocibles)
   ========================================================================== */

const REAL_CONSTELLATIONS = [
  {
    name: "Ursa Major",
    lines: [
      ["Dubhe", "Merak"],
      ["Merak", "Phecda"],
      ["Phecda", "Megrez"],
      ["Megrez", "Dubhe"],
      ["Megrez", "Alioth"],
      ["Alioth", "Mizar"],
      ["Mizar", "Alkaid"],
    ],
  },
  {
    name: "Orion",
    lines: [
      ["Betelgeuse", "Mintaka"],
      ["Bellatrix", "Alnitak"],
      ["Mintaka", "Alnilam"],
      ["Alnilam", "Alnitak"],
      ["Alnitak", "Saiph"],
      ["Mintaka", "Rigel"],
      ["Alnilam", "Na'ir al Saif"],
    ],
  },
  {
    name: "Cassiopeia",
    lines: [
      ["Caph", "Schedar"],
      ["Schedar", "Navi"],
      ["Navi", "Ruchbah"],
      ["Ruchbah", "Segin"],
    ],
  },
  {
    name: "Cygnus",
    lines: [
      ["Deneb", "Sadr"],
      ["Sadr", "Albireo"],
      ["Sadr", "Gienah Cygni"],
      ["Sadr", "Delta Cygni"],
    ],
  },
  {
    name: "Leo",
    lines: [
      ["Regulus", "Adhafera"],
      ["Adhafera", "Algieba"],
      ["Algieba", "Regulus"],
      ["Regulus", "Chertan"],
      ["Chertan", "Denebola"],
    ],
  },
  {
    name: "Scorpius",
    lines: [
      ["Antares", "Larawag"],
      ["Larawag", "Shaula"],
    ],
  },
  {
    name: "Taurus",
    lines: [
      ["Aldebaran", "Hyadum I"],
      ["Hyadum I", "Elnath"],
    ],
  },
  {
    name: "Gemini",
    lines: [
      ["Castor", "Pollux"],
      ["Castor", "Wasat"],
      ["Wasat", "Tejat"],
      ["Tejat", "Propus"],
      ["Propus", "Mebsuta"],
      ["Pollux", "Alhena"],
      ["Alhena", "Mebsuta"],
      ["Wasat", "Alhena"],
    ],
  },
];

function buildRealConstellations(catalog) {
  const byName = new Map();
  for (let i = 0; i < catalog.length; i++) {
    byName.set(catalog[i].name, catalog[i]);
  }
  const result = [];
  for (let c = 0; c < REAL_CONSTELLATIONS.length; c++) {
    const def = REAL_CONSTELLATIONS[c];
    const nodes = [];
    const edges = [];
    let matched = 0;
    for (let l = 0; l < def.lines.length; l++) {
      const a = byName.get(def.lines[l][0]);
      const b = byName.get(def.lines[l][1]);
      if (!a || !b) continue;
      matched++;
      edges.push([a, b]);
      if (nodes.indexOf(a) < 0) nodes.push(a);
      if (nodes.indexOf(b) < 0) nodes.push(b);
    }
    if (matched >= 2) {
      result.push({ name: def.name, nodes, edges });
    }
  }
  return result;
}

function drawRealConstellation(ctx, constellation, t, alpha) {
  ctx.strokeStyle = rgbaString(CONFIG.EARTH_HIGHLIGHT, alpha * 0.5);
  ctx.lineWidth = 0.8;
  ctx.beginPath();
  for (let i = 0; i < constellation.edges.length; i++) {
    const a = constellation.edges[i][0];
    const b = constellation.edges[i][1];
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
  }
  ctx.stroke();
  for (let i = 0; i < constellation.nodes.length; i++) {
    const s = constellation.nodes[i];
    const g = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.size * 9);
    g.addColorStop(0, rgbaString(CONFIG.EARTH_HIGHLIGHT, alpha * 0.7));
    g.addColorStop(1, rgbaString(CONFIG.EARTH_HIGHLIGHT, 0));
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.size * 9, 0, TAU);
    ctx.fill();
  }
}

function drawRealConstellations(ctx, realConstellations, t, quality) {
  if (quality < 1) return;
  const alpha = 0.1 + 0.06 * Math.sin(t * 0.21);
  for (let i = 0; i < realConstellations.length; i++) {
    drawRealConstellation(ctx, realConstellations[i], t, alpha);
  }
}

/* ============================================================================
   37. RADIANTES REALES DE LLUVIAS DE METEOROS
   ========================================================================== */

const METEOR_SHOWER_RADIANTS = [
  { name: "Perseids", raH: 3.32, dec: 58.0, zhr: 100, peak: "Aug 12" },
  { name: "Geminids", raH: 7.45, dec: 33.0, zhr: 150, peak: "Dec 14" },
  { name: "Leonids", raH: 10.14, dec: 22.0, zhr: 15, peak: "Nov 17" },
  { name: "Quadrantids", raH: 15.30, dec: 50.0, zhr: 120, peak: "Jan 3" },
  { name: "Orionids", raH: 5.45, dec: 16.0, zhr: 20, peak: "Oct 21" },
  { name: "Lyrids", raH: 18.13, dec: 34.0, zhr: 18, peak: "Apr 22" },
  { name: "eta Aquariids", raH: 22.50, dec: -1.0, zhr: 50, peak: "May 6" },
  { name: "alpha Capricornids", raH: 20.40, dec: -10.0, zhr: 5, peak: "Jul 30" },
];

function buildMeteorRadiants(rng, w, h) {
  const radiants = [];
  for (let i = 0; i < METEOR_SHOWER_RADIANTS.length; i++) {
    const r = METEOR_SHOWER_RADIANTS[i];
    const x = (r.raH / 24) * w;
    const y = ((90 - r.dec) / 180) * h * 0.92;
    if (y < -20 || y > h + 20) continue;
    radiants.push({
      name: r.name,
      x,
      y,
      zhr: r.zhr,
      peak: r.peak,
      strength: clamp01(r.zhr / 150),
      phase: rng() * TAU,
    });
  }
  return radiants;
}

function drawMeteorRadiant(ctx, radiant, t) {
  const pulse = 0.5 + 0.5 * Math.sin(t * 0.3 + radiant.phase);
  const r = 10 + radiant.strength * 26 * pulse;
  const g = ctx.createRadialGradient(radiant.x, radiant.y, 0, radiant.x, radiant.y, r);
  g.addColorStop(0, rgbaString([255, 240, 220], 0.1 + 0.08 * pulse));
  g.addColorStop(1, rgbaString([255, 240, 220], 0));
  ctx.globalCompositeOperation = "lighter";
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(radiant.x, radiant.y, r, 0, TAU);
  ctx.fill();
  ctx.globalCompositeOperation = "source-over";
}

function drawMeteorRadiants(ctx, radiants, t, quality) {
  if (quality < 1) return;
  for (let i = 0; i < radiants.length; i++) {
    drawMeteorRadiant(ctx, radiants[i], t);
  }
}

function spawnRadiantMeteor(rng, w, h, radiants) {
  if (!radiants.length) return createShootingStar(rng, w, h, false);
  const radiant = radiants[(rng() * radiants.length) | 0];
  const fromTop = rng() < 0.6;
  const x = radiant.x + (rng() - 0.5) * w * 0.3;
  const y = fromTop ? rng() * h * 0.3 : h * 0.1 + rng() * h * 0.4;
  const dx = x - radiant.x;
  const dy = y - radiant.y;
  const d = Math.hypot(dx, dy) || 1;
  const speed = 5 + rng() * 8;
  return {
    x,
    y,
    vx: (dx / d) * speed,
    vy: (dy / d) * speed,
    life: 1,
    decay: 0.014 + rng() * 0.02,
    width: 1 + rng() * 1.4,
    tint: mixRgb(pick(rng, CONFIG.STAR_TINTS), [255, 230, 190], 0.5),
    trail: 8 + rng() * 8,
  };
}

/* ============================================================================
   38. EVOLUCION ESTELAR (masa -> vida -> etapa)
   ========================================================================== */

const STELLAR_LIFETIME_YRS = 1e10;

function starMassFromSpectral(cls) {
  const table = { O: 22, B: 9, A: 2.2, F: 1.4, G: 1.0, K: 0.7, M: 0.35 };
  return table[cls] || 1.0;
}

function starLifetimeYrs(mass) {
  return STELLAR_LIFETIME_YRS * Math.pow(mass, -2.5);
}

function stellarStage(ageFrac, mass) {
  if (mass > 8) {
    if (ageFrac < 0.7) return "main";
    if (ageFrac < 0.82) return "giant";
    if (ageFrac < 0.9) return "nebula";
    return "remnant";
  }
  if (mass > 1.5) {
    if (ageFrac < 0.8) return "main";
    if (ageFrac < 0.95) return "giant";
    return "remnant";
  }
  if (ageFrac < 0.92) return "main";
  return "giant";
}

function stageVisual(stage, baseSize, baseTint) {
  switch (stage) {
    case "giant":
      return {
        size: baseSize * 3.4,
        tint: mixRgb(baseTint, [255, 120, 70], 0.75),
        alphaBoost: 1.8,
      };
    case "nebula":
      return {
        size: baseSize * 2.2,
        tint: mixRgb(baseTint, [150, 220, 255], 0.6),
        alphaBoost: 2.4,
      };
    case "remnant":
      return {
        size: Math.max(0.4, baseSize * 0.45),
        tint: mixRgb(baseTint, [200, 225, 255], 0.8),
        alphaBoost: 0.7,
      };
    default:
      return { size: baseSize, tint: baseTint, alphaBoost: 1 };
  }
}

function createEvolvingStar(rng, star) {
  const mass = starMassFromSpectral(star.cls || "G");
  const lifetime = starLifetimeYrs(mass);
  const stageSpan = Math.max(6000, 60000 * Math.pow(mass, -1.1));
  return {
    star,
    mass,
    lifetime,
    stageSpan,
    offset: rng() * stageSpan,
  };
}

function evolvingStage(ev, tMs) {
  const local = (tMs + ev.offset) % ev.stageSpan;
  return stellarStage(local / ev.stageSpan, ev.mass);
}

function drawEvolvingStar(ctx, ev, t, tMs) {
  const s = ev.star;
  const stage = evolvingStage(ev, tMs);
  const vis = stageVisual(stage, s.size, s.tint);
  const tw = 0.5 + 0.5 * Math.sin(t * s.twinkleSpeed + s.twinklePhase);
  const alpha = s.alpha * (0.45 + 0.55 * tw) * vis.alphaBoost;
  if (stage === "giant" || stage === "nebula") {
    drawStarGlow(ctx, { x: s.x, y: s.y, size: vis.size, tint: vis.tint }, alpha);
  }
  drawStarCore(ctx, { x: s.x, y: s.y, size: vis.size, tint: vis.tint }, alpha);
}

function createEvolutionField(rng, catalog) {
  const evolved = [];
  const step = Math.max(1, Math.floor(catalog.length / 46));
  for (let i = 0; i < catalog.length; i += step) {
    evolved.push(createEvolvingStar(rng, catalog[i]));
  }
  return evolved;
}

function drawEvolutionField(ctx, evolution, t, tMs, quality) {
  if (quality < 1) return;
  for (let i = 0; i < evolution.length; i++) {
    drawEvolvingStar(ctx, evolution[i], t, tMs);
  }
}

/* ============================================================================
   39. FILAMENTOS DE NEBULOSA
   ========================================================================== */

function createNebulaFilaments(rng, nebulas, w, h) {
  const filaments = [];
  for (let i = 0; i < nebulas.length; i++) {
    for (let j = i + 1; j < nebulas.length; j++) {
      const a = nebulas[i];
      const b = nebulas[j];
      const d = Math.hypot(a.x - b.x, a.y - b.y);
      if (d > Math.min(w, h) * 0.55) continue;
      if (rng() < 0.45) continue;
      filaments.push(createFilament(rng, a, b, w, h));
    }
  }
  return filaments;
}

function createFilament(rng, a, b, w, h) {
  const mid = new Vec2((a.x + b.x) / 2, (a.y + b.y) / 2);
  const perp = new Vec2(-(b.y - a.y), b.x - a.x).norm();
  const bow = (rng() - 0.5) * Math.min(w, h) * 0.25;
  const ctrl = new Vec2(mid.x + perp.x * bow, mid.y + perp.y * bow);
  const segments = 40;
  const points = [];
  for (let i = 0; i <= segments; i++) {
    points.push(quadraticBezier(new Vec2(a.x, a.y), ctrl, new Vec2(b.x, b.y), i / segments));
  }
  return {
    points,
    color: mixRgb(a.color, b.color, 0.5),
    accent: mixRgb(a.accent, b.accent, 0.5),
    alpha: 0.05 + rng() * 0.06,
    width: 1 + rng() * 3,
    phase: rng() * TAU,
    flowSpeed: 0.2 + rng() * 0.5,
    strands: 2 + (rng() * 3) | 0,
  };
}

function drawFilament(ctx, filament, t) {
  const flow = (t * filament.flowSpeed + filament.phase) % 1;
  ctx.globalCompositeOperation = "lighter";
  for (let s = 0; s < filament.strands; s++) {
    const offset = (s - (filament.strands - 1) / 2) * 3;
    const grad = ctx.createLinearGradient(
      filament.points[0].x,
      filament.points[0].y,
      filament.points[filament.points.length - 1].x,
      filament.points[filament.points.length - 1].y
    );
    const pulse = 0.6 + 0.4 * Math.sin(t * 0.5 + filament.phase + s);
    grad.addColorStop(0, rgbaString(filament.color, 0));
    grad.addColorStop(flow, rgbaString(filament.accent, filament.alpha * pulse));
    grad.addColorStop(1, rgbaString(filament.color, 0));
    ctx.strokeStyle = grad;
    ctx.lineWidth = filament.width * (1 - s * 0.22);
    ctx.lineCap = "round";
    ctx.beginPath();
    for (let i = 0; i < filament.points.length; i++) {
      const p = filament.points[i];
      const wob = Math.sin(i * 0.4 + t * 0.7 + s) * 2 + offset;
      if (i === 0) ctx.moveTo(p.x, p.y + wob);
      else ctx.lineTo(p.x, p.y + wob);
    }
    ctx.stroke();
  }
  ctx.globalCompositeOperation = "source-over";
}

function drawFilaments(ctx, filaments, t, quality) {
  if (quality < 1) return;
  for (let i = 0; i < filaments.length; i++) {
    drawFilament(ctx, filaments[i], t);
  }
}

/* ============================================================================
   40. GIGANTES GASEOSOS (bandas, tormenta, sombra de anillo)
   ========================================================================== */

function createGasGiantSurface(rng, planet) {
  const bands = [];
  const bandCount = 7 + (rng() * 4) | 0;
  for (let i = 0; i < bandCount; i++) {
    bands.push({
      offset: i / bandCount,
      color: mixRgb(
        pick(rng, CONFIG.EARTH_TONES),
        pick(rng, [CONFIG.EARTH_HIGHLIGHT, [222, 196, 160], [198, 158, 108]]),
        rng() * 0.6
      ),
      width: 0.5 + rng() * 1.4,
      drift: (rng() - 0.5) * 0.05,
      wobble: rng() * TAU,
    });
  }
  return {
    bands,
    storm: {
      x: (rng() - 0.5) * 0.5,
      y: (rng() - 0.5) * 0.3,
      rx: 0.16 + rng() * 0.1,
      ry: 0.08 + rng() * 0.05,
      color: mixRgb([200, 90, 50], CONFIG.EARTH_TONES[3], 0.4),
      drift: 0.01 + rng() * 0.02,
      phase: rng() * TAU,
    },
    ringShadow: 0.25 + rng() * 0.2,
  };
}

function drawGasGiantSurface(ctx, planet, surface, t) {
  const p = planet;
  ctx.save();
  ctx.beginPath();
  ctx.arc(p.x, p.y, p.r, 0, TAU);
  ctx.clip();
  for (let i = 0; i < surface.bands.length; i++) {
    const band = surface.bands[i];
    const yBase = p.y - p.r + ((band.offset + t * band.drift) % 1) * p.r * 2;
    const wob = Math.sin(t * 0.5 + band.wobble) * p.r * 0.05;
    ctx.fillStyle = rgbaString(band.color, 0.85);
    ctx.beginPath();
    ctx.moveTo(p.x - p.r, yBase + wob);
    for (let x = -p.r; x <= p.r; x += Math.max(4, p.r / 16)) {
      const y = yBase + wob + Math.sin((x / p.r) * 6 + band.wobble + t) * p.r * 0.03;
      ctx.lineTo(p.x + x, y);
    }
    ctx.lineTo(p.x + p.r, yBase + p.r * band.width + wob);
    ctx.lineTo(p.x - p.r, yBase + p.r * band.width + wob);
    ctx.closePath();
    ctx.fill();
  }
  const storm = surface.storm;
  const sx = p.x + storm.x * p.r + Math.sin(t * storm.drift * 3 + storm.phase) * p.r * 0.08;
  const sy = p.y + storm.y * p.r;
  const sgrad = ctx.createRadialGradient(sx, sy, 0, sx, sy, storm.rx * p.r);
  sgrad.addColorStop(0, rgbaString(lighten(storm.color, 0.25), 0.9));
  sgrad.addColorStop(0.7, rgbaString(storm.color, 0.85));
  sgrad.addColorStop(1, rgbaString(darken(storm.color, 0.3), 0));
  ctx.fillStyle = sgrad;
  ctx.beginPath();
  ctx.ellipse(sx, sy, storm.rx * p.r, storm.ry * p.r, 0, 0, TAU);
  ctx.fill();
  ctx.restore();
  if (p.ring) {
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.ringTilt);
    ctx.scale(1, 0.32);
    ctx.strokeStyle = rgbaString(p.dark, surface.ringShadow);
    ctx.lineWidth = p.r * 1.2;
    ctx.beginPath();
    ctx.arc(0, 0, p.r * 1.18, Math.PI * 0.15, Math.PI * 0.85);
    ctx.stroke();
    ctx.restore();
  }
}

/* ============================================================================
   41. CRATERES LUNARES
   ========================================================================== */

function createMoonCraters(rng, moon) {
  const craters = [];
  const count = 5 + (rng() * 7) | 0;
  for (let i = 0; i < count; i++) {
    const a = rng() * TAU;
    const d = rng() * 0.7;
    craters.push({
      x: Math.cos(a) * d,
      y: Math.sin(a) * d,
      r: 0.1 + rng() * 0.22,
      depth: 0.25 + rng() * 0.4,
    });
  }
  return craters;
}

function drawMoonCraters(ctx, moon, craters, px, py) {
  for (let i = 0; i < craters.length; i++) {
    const c = craters[i];
    const cx = px + c.x * moon.size;
    const cy = py + c.y * moon.size;
    const cr = c.r * moon.size;
    const g = ctx.createRadialGradient(
      cx - cr * 0.25, cy - cr * 0.25, cr * 0.1,
      cx, cy, cr
    );
    g.addColorStop(0, rgbaString(lighten(moon.tint, 0.15), 0.75 * c.depth));
    g.addColorStop(0.75, rgbaString(moon.dark, 0.5 * c.depth));
    g.addColorStop(1, rgbaString(moon.dark, 0));
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(cx, cy, cr, 0, TAU);
    ctx.fill();
  }
}

/* ============================================================================
   42. REFLEJO DEL TITULO EN EL AGUA
   ========================================================================== */

function drawTitleReflection(ctx, w, h, t, alpha) {
  if (alpha <= 0.001) return;
  const y0 = h * 0.9;
  const cx = w * 0.5;
  const cy = y0 + (h - y0) * 0.38;
  ctx.save();
  ctx.beginPath();
  ctx.rect(0, y0, w, h - y0);
  ctx.clip();
  ctx.translate(cx, cy);
  ctx.scale(1, -0.34);
  ctx.font = `900 ${Math.max(28, h * 0.075)}px Orbitron, 'Arial Black', sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.globalCompositeOperation = "lighter";
  let maxAlpha = 0;
  for (let i = 0; i < 6; i++) {
    const layerAlpha = alpha * 0.16 * (1 - i / 6);
    const dy = Math.sin(t * 1.3 + i * 1.7) * (2 + i * 1.4);
    const dx = Math.sin(t * 0.9 + i) * (1 + i * 0.8);
    ctx.fillStyle = rgbaString([255, 42, 42], layerAlpha);
    ctx.fillText("BELENTANI", dx, dy);
    maxAlpha = Math.max(maxAlpha, layerAlpha);
  }
  const sheen = ctx.createLinearGradient(0, -h * 0.05, 0, h * 0.05);
  sheen.addColorStop(0, rgbaString(CONFIG.EARTH_HIGHLIGHT, 0));
  sheen.addColorStop(0.5, rgbaString(CONFIG.EARTH_HIGHLIGHT, alpha * 0.08));
  sheen.addColorStop(1, rgbaString(CONFIG.EARTH_HIGHLIGHT, 0));
  ctx.fillStyle = sheen;
  ctx.fillRect(-w * 0.5, -h * 0.06, w, h * 0.12);
  ctx.globalCompositeOperation = "source-over";
  ctx.restore();
  return maxAlpha;
}

/* ============================================================================
   43. OBSERVATORIO Y ARBOLES (siluetas)
   ========================================================================== */

function drawObservatory(ctx, rng, w, h, baseY) {
  const domeX = w * 0.78;
  const domeR = Math.min(w, h) * 0.028;
  const wallH = domeR * 0.9;
  const color = rgbString(shade(CONFIG.EARTH_DEEP, 0.75));
  ctx.fillStyle = color;
  ctx.fillRect(domeX - domeR, baseY - wallH, domeR * 2, wallH);
  ctx.beginPath();
  ctx.arc(domeX, baseY - wallH, domeR, Math.PI, 0);
  ctx.fill();
  ctx.fillStyle = rgbaString(CONFIG.EARTH_HIGHLIGHT, 0.5);
  ctx.beginPath();
  ctx.moveTo(domeX, baseY - wallH - domeR);
  ctx.lineTo(domeX + domeR * 0.28, baseY - wallH - domeR * 0.6);
  ctx.lineTo(domeX - domeR * 0.28, baseY - wallH - domeR * 0.6);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = color;
  ctx.lineWidth = domeR * 0.12;
  ctx.beginPath();
  ctx.moveTo(domeX, baseY - wallH - domeR);
  ctx.lineTo(domeX + domeR * 0.75, baseY - wallH - domeR * 1.5);
  ctx.stroke();
}

function drawTreeSilhouette(ctx, x, baseY, height, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x - height * 0.03, baseY - height * 0.35, height * 0.06, height * 0.35);
  for (let i = 0; i < 4; i++) {
    const tierY = baseY - height * (0.25 + i * 0.2);
    const tierW = height * (0.34 - i * 0.07);
    ctx.beginPath();
    ctx.moveTo(x, tierY - height * 0.28);
    ctx.lineTo(x + tierW, tierY);
    ctx.lineTo(x - tierW, tierY);
    ctx.closePath();
    ctx.fill();
  }
}

function drawForestSilhouette(ctx, rng, w, h, baseY) {
  const color = rgbString(shade(CONFIG.EARTH_DEEP, 0.7));
  const count = 9 + (rng() * 8) | 0;
  for (let i = 0; i < count; i++) {
    const x = rng() * w;
    const height = h * (0.03 + rng() * 0.05);
    drawTreeSilhouette(ctx, x, baseY, height, color);
  }
}

/* ============================================================================
   44. AUDIO GRANULAR (plucks por letra, shimmer, swell inverso)
   ========================================================================== */

function createLetterPluck(ctx, dest, freq, startTime) {
  const osc = ctx.createOscillator();
  osc.type = "triangle";
  osc.frequency.value = freq;
  const osc2 = ctx.createOscillator();
  osc2.type = "sine";
  osc2.frequency.value = freq * 2;
  const env = ctx.createGain();
  env.gain.setValueAtTime(0, startTime);
  env.gain.linearRampToValueAtTime(0.22, startTime + 0.006);
  env.gain.exponentialRampToValueAtTime(0.001, startTime + 0.9);
  const env2 = ctx.createGain();
  env2.gain.setValueAtTime(0.08, startTime);
  env2.gain.exponentialRampToValueAtTime(0.001, startTime + 0.35);
  osc.connect(env);
  osc2.connect(env2);
  env.connect(dest);
  env2.connect(dest);
  osc.start(startTime);
  osc.stop(startTime + 1);
  osc2.start(startTime);
  osc2.stop(startTime + 0.4);
}

function createGranularShimmer(ctx, dest, startTime, duration, baseFreq) {
  const grainCount = Math.floor(duration * 22);
  for (let i = 0; i < grainCount; i++) {
    const t = startTime + Math.random() * duration;
    const dur = 0.04 + Math.random() * 0.12;
    const freq = baseFreq * (0.5 + Math.random() * 2.5);
    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.value = freq;
    const env = ctx.createGain();
    env.gain.setValueAtTime(0, t);
    env.gain.linearRampToValueAtTime(0.02 + Math.random() * 0.03, t + 0.015);
    env.gain.exponentialRampToValueAtTime(0.001, t + dur);
    osc.connect(env);
    env.connect(dest);
    osc.start(t);
    osc.stop(t + dur + 0.05);
  }
}

function createReverseSwell(ctx, dest, startTime, duration) {
  const noise = ctx.createBufferSource();
  const len = Math.floor(ctx.sampleRate * duration);
  const noiseBuf = ctx.createBuffer(1, len, ctx.sampleRate);
  const data = noiseBuf.getChannelData(0);
  for (let i = 0; i < len; i++) {
    data[i] = (Math.random() * 2 - 1) * Math.pow(i / len, 2.2);
  }
  noise.buffer = noiseBuf;
  const filter = ctx.createBiquadFilter();
  filter.type = "bandpass";
  filter.frequency.setValueAtTime(500, startTime);
  filter.frequency.exponentialRampToValueAtTime(4200, startTime + duration);
  filter.Q.value = 1.4;
  const env = ctx.createGain();
  env.gain.setValueAtTime(0.001, startTime);
  env.gain.linearRampToValueAtTime(0.16, startTime + duration * 0.96);
  env.gain.linearRampToValueAtTime(0, startTime + duration);
  noise.connect(filter);
  filter.connect(env);
  env.connect(dest);
  noise.start(startTime);
  noise.stop(startTime + duration + 0.05);
}

function extendAudioEngineGranular(AudioEngineClass) {
  const proto = AudioEngineClass.prototype;
  proto.playLetterPlucks = function (count) {
    if (!this.ctx) return;
    this.resume();
    const now = this.ctx.currentTime + 0.05;
    const scale = [261.63, 293.66, 329.63, 392.0, 440.0, 523.25, 587.33, 659.25, 783.99];
    for (let i = 0; i < count; i++) {
      const freq = scale[i % scale.length];
      createLetterPluck(this.ctx, this.verbSend, freq, now + i * 0.055);
    }
  };
  proto.playShimmer = function (duration) {
    if (!this.ctx) return;
    this.resume();
    createGranularShimmer(this.ctx, this.verbSend, this.ctx.currentTime + 0.05, duration, 392.0);
  };
  proto.playReverseSwell = function (duration) {
    if (!this.ctx) return;
    this.resume();
    createReverseSwell(this.ctx, this.master, this.ctx.currentTime + 0.05, duration);
  };
  proto.playOpeningScore = function (revealMs) {
    if (!this.ctx) return;
    this.resume();
    const now = this.ctx.currentTime + 0.05;
    createReverseSwell(this.ctx, this.master, now, revealMs / 1000 + 0.4);
    createGranularShimmer(this.ctx, this.verbSend, now, revealMs / 1000, 196.0);
    const self = this;
    setTimeout(() => {
      self.playFanfare();
      self.playPercussion();
      self.playImpact();
      self.playLetterPlucks(9);
      self.playShimmer(4.5);
    }, Math.max(0, revealMs - 350));
  };
  return AudioEngineClass;
}

/* ============================================================================
   45. GRAFICO DE FPS (solo consola)
   ========================================================================== */

function createFpsGraph(canvasWidth, canvasHeight) {
  const canvas = document.createElement("canvas");
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;
  const ctx = canvas.getContext("2d");
  const samples = [];
  const maxSamples = canvasWidth;
  return {
    push(fps) {
      samples.push(fps);
      if (samples.length > maxSamples) samples.shift();
    },
    render() {
      ctx.fillStyle = "rgba(8,5,3,1)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = "rgba(255,190,120,0.9)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let i = 0; i < samples.length; i++) {
        const x = i;
        const y = canvas.height - clamp01(samples[i] / 70) * canvas.height;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.strokeStyle = "rgba(255,42,42,0.6)";
      ctx.beginPath();
      const y50 = canvas.height - (50 / 70) * canvas.height;
      ctx.moveTo(0, y50);
      ctx.lineTo(canvas.width, y50);
      ctx.stroke();
    },
    toDataURL() {
      return canvas.toDataURL("image/png");
    },
    get length() {
      return samples.length;
    },
  };
}

/* ============================================================================
   46. CABLEADO DE AUDIO (extensiones instaladas tras cargar todo el modulo)
   ========================================================================== */

extendAudioEngine(AudioEngine);
extendAudioEngineGranular(AudioEngine);

/* ============================================================================
   47. ESTRELLAS BINARIAS (companeras en orbita kepleriana)
   ========================================================================== */

function createBinaryStar(rng, host) {
  const period = 3 + rng() * 17;
  const sep = host.size * (7 + rng() * 11);
  const angle0 = rng() * TAU;
  const massRatio = 0.25 + rng() * 0.6;
  return {
    host,
    period,
    sep,
    angle0,
    massRatio,
    tint: mixRgb(host.tint, [255, 200, 150], 0.35),
    size: Math.max(0.35, host.size * massRatio),
  };
}

function createBinaryField(rng, catalog) {
  const bright = catalog.filter((s) => s.mag < 2.6);
  const binaries = [];
  const count = Math.min(28, bright.length);
  for (let i = 0; i < count; i++) {
    binaries.push(createBinaryStar(rng, bright[(rng() * bright.length) | 0]));
  }
  return binaries;
}

function binaryCompanionPos(b, t) {
  const a = b.angle0 + (t / b.period) * TAU;
  const r = b.sep / (1 + b.massRatio);
  return {
    x: b.host.x - Math.cos(a) * r,
    y: b.host.y - Math.sin(a) * r * 0.72,
  };
}

function drawBinaryField(ctx, binaries, t, quality) {
  if (quality < 1) return;
  for (let i = 0; i < binaries.length; i++) {
    const b = binaries[i];
    const p = binaryCompanionPos(b, t);
    const tw = 0.5 + 0.5 * Math.sin(t * b.host.twinkleSpeed + b.host.twinklePhase);
    const alpha = b.host.alpha * (0.4 + 0.6 * tw);
    drawStarGlow(ctx, { x: p.x, y: p.y, size: b.size, tint: b.tint }, alpha * 0.9);
    drawStarCore(ctx, { x: p.x, y: p.y, size: b.size, tint: b.tint }, alpha * 0.9);
  }
}

/* ============================================================================
   48. ESTRELLAS VARIABLES (pulsacion tipo cefeida)
   ========================================================================== */

function createVariableStar(rng, host) {
  const period = 1.2 + rng() * 8.5;
  const amp = 0.25 + rng() * 0.4;
  return { host, period, amp, phase: rng() * TAU };
}

function createVariableField(rng, catalog) {
  const variables = [];
  for (let i = 0; i < 34; i++) {
    const host = catalog[(rng() * catalog.length) | 0];
    if (host) variables.push(createVariableStar(rng, host));
  }
  return variables;
}

function drawVariableField(ctx, variables, t, quality) {
  if (quality < 1) return;
  for (let i = 0; i < variables.length; i++) {
    const v = variables[i];
    const s = v.host;
    const cyc = 0.5 + 0.5 * Math.sin((t / v.period) * TAU + v.phase);
    const pulse = 1 + v.amp * (cyc - 0.5) * 2;
    const alpha = s.alpha * (0.35 + 0.65 * cyc);
    drawStarGlow(ctx, { x: s.x, y: s.y, size: s.size * pulse, tint: s.tint }, alpha);
  }
}

/* ============================================================================
   49. TRANSITOS DE EXOPLANETAS (caida de brillo periodica)
   ========================================================================== */

function createTransitingSystem(rng, host) {
  const period = 6 + rng() * 30;
  const transitDur = 0.08 + rng() * 0.1;
  const depth = 0.05 + rng() * 0.09;
  return {
    host,
    period,
    transitDur,
    depth,
    phase: rng() * TAU,
    planetSize: Math.max(0.4, host.size * 0.3),
  };
}

function createTransitField(rng, catalog) {
  const systems = [];
  for (let i = 0; i < 12; i++) {
    const host = catalog[(rng() * catalog.length) | 0];
    if (host) systems.push(createTransitingSystem(rng, host));
  }
  return systems;
}

function drawTransitField(ctx, transits, t, quality) {
  if (quality < 1) return;
  for (let i = 0; i < transits.length; i++) {
    const sys = transits[i];
    const s = sys.host;
    const ph = ((t / sys.period) * TAU + sys.phase) % TAU;
    const halfW = sys.transitDur * TAU * 0.5;
    const center = TAU / 2;
    let d = ph - center;
    if (d > Math.PI) d -= TAU;
    if (d < -Math.PI) d += TAU;
    const ad = Math.abs(d);
    if (ad >= halfW) continue;
    const f = 1 - ad / halfW;
    const dim = sys.depth * f;
    const cyc = (d + halfW) / (2 * halfW);
    const px = s.x + (cyc - 0.5) * s.size * 4;
    const halo = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.size * 12);
    halo.addColorStop(0, `rgba(8,5,3,${dim * 0.4})`);
    halo.addColorStop(1, "rgba(8,5,3,0)");
    ctx.fillStyle = halo;
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.size * 12, 0, TAU);
    ctx.fill();
    ctx.fillStyle = `rgba(6,4,2,${0.85 * f})`;
    ctx.beginPath();
    ctx.arc(px, s.y, sys.planetSize, 0, TAU);
    ctx.fill();
  }
}

/* ============================================================================
   50. CORRIENTE ESTELAR (corriente de marea galactica)
   ========================================================================== */

function createStellarStream(rng, w, h) {
  const points = [];
  const count = 420;
  const cx = w * (0.2 + rng() * 0.6);
  const cy = h * (0.15 + rng() * 0.5);
  const radius = Math.min(w, h) * (0.3 + rng() * 0.25);
  const tilt = (rng() - 0.5) * 0.9;
  for (let i = 0; i < count; i++) {
    const a = rng() * TAU;
    const r = radius * (0.82 + gauss(rng) * 0.06);
    const x = cx + Math.cos(a) * r;
    const y = cy + Math.sin(a) * r * (0.5 + tilt * 0.3);
    if (x < -10 || x > w + 10 || y < -10 || y > h + 10) continue;
    points.push({
      x,
      y,
      size: 0.25 + rng() * 0.55,
      tint: mixRgb(pick(rng, CONFIG.STAR_TINTS), CONFIG.EARTH_TONES[1], 0.4),
      alpha: 0.12 + rng() * 0.3,
      twinkleSpeed: 0.3 + rng() * 1.6,
      twinklePhase: rng() * TAU,
    });
  }
  return { points, cx, cy, radius };
}

function drawStellarStream(ctx, stream, t, quality) {
  if (!stream || quality < 1) return;
  ctx.globalCompositeOperation = "lighter";
  const glow = ctx.createRadialGradient(stream.cx, stream.cy, 0, stream.cx, stream.cy, stream.radius);
  glow.addColorStop(0, rgbaString(CONFIG.EARTH_TONES[1], 0.03));
  glow.addColorStop(1, rgbaString(CONFIG.EARTH_TONES[1], 0));
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(stream.cx, stream.cy, stream.radius, 0, TAU);
  ctx.fill();
  for (let i = 0; i < stream.points.length; i++) {
    const s = stream.points[i];
    const tw = 0.5 + 0.5 * Math.sin(t * s.twinkleSpeed + s.twinklePhase);
    ctx.fillStyle = rgbaString(s.tint, s.alpha * (0.4 + 0.6 * tw));
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.size, 0, TAU);
    ctx.fill();
  }
  ctx.globalCompositeOperation = "source-over";
}

/* ============================================================================
   51. ABULTAMIENTO GALACTICO (bulge central)
   ========================================================================== */

function createGalacticBulge(rng, w, h) {
  return {
    x: w * 0.5 + (rng() - 0.5) * w * 0.2,
    y: h * 0.5 + (rng() - 0.5) * h * 0.2,
    r: Math.min(w, h) * (0.28 + rng() * 0.12),
    phase: rng() * TAU,
  };
}

function drawGalacticBulge(ctx, bulge, t, quality) {
  if (!bulge || quality < 1) return;
  ctx.globalCompositeOperation = "lighter";
  const g = ctx.createRadialGradient(bulge.x, bulge.y, 0, bulge.x, bulge.y, bulge.r);
  const a = 0.05 + 0.012 * Math.sin(t * 0.07 + bulge.phase);
  g.addColorStop(0, rgbaString(CONFIG.EARTH_HIGHLIGHT, a));
  g.addColorStop(0.4, rgbaString(CONFIG.EARTH_TONES[1], a * 0.5));
  g.addColorStop(1, rgbaString(CONFIG.EARTH_TONES[1], 0));
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.ellipse(bulge.x, bulge.y, bulge.r, bulge.r * 0.62, 0.4, 0, TAU);
  ctx.fill();
  ctx.globalCompositeOperation = "source-over";
}

/* ============================================================================
   52. PULSAR (faro de barrido rotatorio)
   ========================================================================== */

function createPulsar(rng, w, h) {
  return {
    x: w * (0.15 + rng() * 0.7),
    y: h * (0.12 + rng() * 0.4),
    period: 2.4 + rng() * 4.5,
    spin: rng() * TAU,
    tint: mixRgb([200, 225, 255], CONFIG.EARTH_HIGHLIGHT, 0.3),
  };
}

function drawPulsar(ctx, pulsar, w, h, t, quality) {
  if (!pulsar || quality < 1) return;
  const cyc = (t / pulsar.period) % 1;
  const beamAngle = pulsar.spin + cyc * TAU;
  const len = Math.hypot(w, h) * 0.45;
  const bx = pulsar.x + Math.cos(beamAngle) * len;
  const by = pulsar.y + Math.sin(beamAngle) * len;
  const sweep = Math.abs(Math.sin(cyc * TAU));
  const alpha = 0.05 + 0.1 * Math.pow(sweep, 6);
  ctx.globalCompositeOperation = "lighter";
  const g = ctx.createLinearGradient(pulsar.x, pulsar.y, bx, by);
  g.addColorStop(0, rgbaString(pulsar.tint, alpha * 0.7));
  g.addColorStop(1, rgbaString(pulsar.tint, 0));
  ctx.strokeStyle = g;
  ctx.lineWidth = 2 + sweep * 6;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(pulsar.x, pulsar.y);
  ctx.lineTo(bx, by);
  ctx.stroke();
  const core = ctx.createRadialGradient(pulsar.x, pulsar.y, 0, pulsar.x, pulsar.y, 14);
  core.addColorStop(0, rgbaString([255, 255, 255], 0.5 + 0.4 * sweep));
  core.addColorStop(1, rgbaString(pulsar.tint, 0));
  ctx.fillStyle = core;
  ctx.beginPath();
  ctx.arc(pulsar.x, pulsar.y, 14, 0, TAU);
  ctx.fill();
  ctx.globalCompositeOperation = "source-over";
}

/* ============================================================================
   53. REMANENTE DE SUPERNOVA (capa en expansion persistente)
   ========================================================================== */

function createSupernovaRemnant(rng, w, h) {
  const filaments = [];
  const cx = w * (0.2 + rng() * 0.6);
  const cy = h * (0.15 + rng() * 0.45);
  const r = Math.min(w, h) * (0.1 + rng() * 0.08);
  const count = 90;
  for (let i = 0; i < count; i++) {
    const a = rng() * TAU;
    const rr = r * (0.75 + gauss(rng) * 0.14);
    filaments.push({
      x: cx + Math.cos(a) * rr,
      y: cy + Math.sin(a) * rr * 0.8,
      size: 0.4 + rng() * 1.1,
      tint: mixRgb([255, 190, 140], pick(rng, CONFIG.STAR_TINTS), 0.4),
      alpha: 0.15 + rng() * 0.35,
      twinkleSpeed: 0.2 + rng() * 1.2,
      twinklePhase: rng() * TAU,
    });
  }
  return { cx, cy, r, filaments, phase: rng() * TAU };
}

function drawSupernovaRemnant(ctx, remnant, t, quality) {
  if (!remnant || quality < 1) return;
  ctx.globalCompositeOperation = "lighter";
  const pulse = 1 + 0.05 * Math.sin(t * 0.11 + remnant.phase);
  const shell = ctx.createRadialGradient(
    remnant.cx, remnant.cy, remnant.r * 0.5 * pulse,
    remnant.cx, remnant.cy, remnant.r * 1.15 * pulse
  );
  shell.addColorStop(0, rgbaString([255, 170, 120], 0));
  shell.addColorStop(0.75, rgbaString([255, 170, 120], 0.05));
  shell.addColorStop(1, rgbaString([255, 170, 120], 0));
  ctx.fillStyle = shell;
  ctx.beginPath();
  ctx.arc(remnant.cx, remnant.cy, remnant.r * 1.2 * pulse, 0, TAU);
  ctx.fill();
  for (let i = 0; i < remnant.filaments.length; i++) {
    const f = remnant.filaments[i];
    const tw = 0.5 + 0.5 * Math.sin(t * f.twinkleSpeed + f.twinklePhase);
    ctx.fillStyle = rgbaString(f.tint, f.alpha * (0.35 + 0.65 * tw));
    ctx.beginPath();
    ctx.arc(f.x, f.y, f.size, 0, TAU);
    ctx.fill();
  }
  ctx.globalCompositeOperation = "source-over";
}

/* ============================================================================
   54. NUBES NOCTILUCENTES (cielo alto, brillo plateado)
   ========================================================================== */

function createNoctilucentField(rng, w, h) {
  const bands = [];
  for (let b = 0; b < 3; b++) {
    bands.push({
      yBase: h * (0.05 + b * 0.05),
      amp: h * (0.008 + rng() * 0.012),
      freq: 0.003 + rng() * 0.004,
      speed: 0.03 + rng() * 0.05,
      phase: rng() * TAU,
      alpha: 0.05 + rng() * 0.05,
    });
  }
  return bands;
}

function drawNoctilucent(ctx, bands, w, t, quality) {
  if (quality < 1) return;
  ctx.globalCompositeOperation = "lighter";
  for (let b = 0; b < bands.length; b++) {
    const band = bands[b];
    ctx.beginPath();
    for (let i = 0; i <= 160; i++) {
      const x = (i / 160) * w;
      const u = i / 160;
      const y =
        band.yBase +
        Math.sin(u * band.freq * 160 + t * band.speed + band.phase) * band.amp +
        Math.sin(u * band.freq * 340 - t * band.speed * 1.6) * band.amp * 0.4;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.strokeStyle = rgbaString([190, 210, 235], band.alpha);
    ctx.lineWidth = 1.4;
    ctx.stroke();
  }
  ctx.globalCompositeOperation = "source-over";
}

/* ============================================================================
   55. BRASAS TERRESTRES (partículas vivas de primer plano)
   ========================================================================== */

const emberRespawn = mulberry32(0x51a7);

function createEmber(rng, w, h) {
  return {
    x: rng() * w,
    y: h * (0.72 + rng() * 0.26),
    vx: (rng() - 0.5) * 0.05,
    vy: -(0.02 + rng() * 0.06),
    size: 0.5 + rng() * 1.2,
    alpha: 0.1 + rng() * 0.25,
    phase: rng() * TAU,
    speed: 0.6 + rng() * 1.8,
  };
}

function createEmberField(rng, w, h) {
  const embers = [];
  for (let i = 0; i < CONFIG.EMBER_COUNT; i++) embers.push(createEmber(rng, w, h));
  return embers;
}

function drawEmberField(ctx, embers, dt, w, h, t, quality) {
  if (quality < 1) return;
  ctx.globalCompositeOperation = "lighter";
  for (let i = 0; i < embers.length; i++) {
    const e = embers[i];
    e.x += e.vx * dt * 60 + Math.sin(t * 0.4 + e.phase) * 0.04;
    e.y += e.vy * dt * 60;
    if (e.y < h * 0.55) {
      e.y = h * (0.92 + emberRespawn() * 0.08);
      e.x = emberRespawn() * w;
    }
    if (e.x < -6) e.x = w + 4;
    else if (e.x > w + 6) e.x = -4;
    const tw = Math.pow(0.5 + 0.5 * Math.sin(t * e.speed + e.phase), 2);
    const a = e.alpha * tw;
    if (a < 0.004) continue;
    const g = ctx.createRadialGradient(e.x, e.y, 0, e.x, e.y, e.size * 5);
    g.addColorStop(0, rgbaString([255, 190, 110], a));
    g.addColorStop(1, rgbaString([255, 140, 60], 0));
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(e.x, e.y, e.size * 5, 0, TAU);
    ctx.fill();
  }
  ctx.globalCompositeOperation = "source-over";
}

/* ============================================================================
   56. SATELITES (destellos lentos en órbita baja)
   ========================================================================== */

function createSatellite(rng, w, h) {
  const fromLeft = rng() < 0.5;
  return {
    x: fromLeft ? -20 : w + 20,
    y: h * (0.08 + rng() * 0.4),
    vx: (fromLeft ? 1 : -1) * (0.02 + rng() * 0.03),
    vy: 0.004 + rng() * 0.008,
    period: 14 + rng() * 20,
    nextFlare: rng() * 20,
    flareDur: 0.5 + rng() * 0.7,
    size: 0.5 + rng() * 0.7,
    tint: [255, 240, 220],
  };
}

function createSatelliteField(rng, w, h) {
  const sats = [];
  for (let i = 0; i < 5; i++) sats.push(createSatellite(rng, w, h));
  return sats;
}

function drawSatelliteField(ctx, satellites, dt, t, w, h, quality) {
  if (quality < 1) return;
  ctx.globalCompositeOperation = "lighter";
  for (let i = 0; i < satellites.length; i++) {
    const s = satellites[i];
    s.x += s.vx * dt * 60;
    s.y += s.vy * dt * 60;
    if (s.x < -60 || s.x > w + 60) {
      s.x = s.vx > 0 ? -20 : w + 20;
      s.y = h * (0.08 + Math.random() * 0.4);
    }
    if (s.y > h + 60) {
      s.y = h * (0.08 + Math.random() * 0.4);
    }
    const sinceFlare = t - s.nextFlare;
    let flare = 0;
    if (sinceFlare >= 0 && sinceFlare <= s.flareDur) {
      flare = Math.sin((sinceFlare / s.flareDur) * Math.PI);
    } else if (sinceFlare > s.flareDur) {
      s.nextFlare = t + s.period * (0.6 + Math.random() * 0.8);
    }
    const a = 0.12 + flare * 0.85;
    const r = s.size * (3 + flare * 26);
    const g = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, r);
    g.addColorStop(0, rgbaString(s.tint, a));
    g.addColorStop(1, rgbaString(s.tint, 0));
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(s.x, s.y, r, 0, TAU);
    ctx.fill();
  }
  ctx.globalCompositeOperation = "source-over";
}

/* ============================================================================
   57. DOMO DE CONTAMINACION LUMINICA (resplandor urbano)
   ========================================================================== */

function drawLightPollutionDome(ctx, w, h, t) {
  ctx.globalCompositeOperation = "lighter";
  const domeX = w * 0.24;
  const domeY = h * 0.86;
  const r = Math.min(w, h) * 0.3;
  const g = ctx.createRadialGradient(domeX, domeY, 0, domeX, domeY, r);
  const a = 0.05 + 0.008 * Math.sin(t * 0.05);
  g.addColorStop(0, rgbaString([255, 180, 110], a));
  g.addColorStop(0.5, rgbaString([255, 160, 90], a * 0.4));
  g.addColorStop(1, rgbaString([255, 150, 80], 0));
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.ellipse(domeX, domeY, r, r * 0.55, 0, 0, TAU);
  ctx.fill();
  ctx.globalCompositeOperation = "source-over";
}

/* ============================================================================
   58. AJUSTES DE CONFIGURACION DE CAPAS NUEVAS
   ========================================================================== */

CONFIG.COSMIC_RAYS = 26;
CONFIG.RADIANT_METEOR_CHANCE = 0.004;
CONFIG.EMBER_COUNT = 42;
