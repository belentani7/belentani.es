// Ruta cíclica: curva cerrada alrededor de la galaxia que atraviesa las 6 estaciones del lore.
import * as THREE from "three";

export const LORE = window.BELENTANI_LORE || {};
export const STATIONS = (LORE.estaciones || [{ id: "genesis", titulo: "GÉNESIS", tag: "", copy: "" }])
  .slice().sort((a, b) => a.orden - b.orden);
export const PLANETS = window.BELENTANI_PLANETAS || [];
export const N = STATIONS.length;

export const FAM = { judas: "#ff073a", omega: "#d4af37", belentani: "#4de8e0" };
export const TEX = ["mercury","venus_surface","earth_daymap","mars","jupiter","saturn","uranus","neptune","moon",
  "ceres_fictional","eris_fictional","haumea_fictional","makemake_fictional"];
export const hash = s => [...s].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7);

// 2 puntos de control por estación: la estación y una "vista" alta entre estaciones
const pts = [];
for (let i = 0; i < N; i++) {
  const a = (i / N) * Math.PI * 2, b = ((i + 0.5) / N) * Math.PI * 2;
  const r = i % 2 ? 620 : 420;
  pts.push(new THREE.Vector3(Math.cos(a) * r, i % 2 ? -30 : 50, Math.sin(a) * r));
  pts.push(new THREE.Vector3(Math.cos(b) * 760, 190, Math.sin(b) * 760));
}
export const curve = new THREE.CatmullRomCurve3(pts, true, "centripetal", 0.5);
export const stationT = i => i / N;
const wrap = t => ((t % 1) + 1) % 1;

// marco local en un punto de la ruta
export function frame(t) {
  const p = curve.getPointAt(wrap(t)), tan = curve.getTangentAt(wrap(t)).normalize();
  const up = new THREE.Vector3(0, 1, 0), side = new THREE.Vector3().crossVectors(tan, up).normalize();
  up.crossVectors(side, tan).normalize();
  return { p, tan, side, up };
}

// planetas en anillo alrededor de la ruta, un poco por delante de cada estación
export const placed = (() => {
  const by = STATIONS.map(() => []);
  PLANETS.forEach((p, i) => by[i % N].push(p));
  const out = [];
  by.forEach((list, s) => list.forEach((p, j) => {
    const h = hash(p.id), t = stationT(s) + 0.012 + j * (0.11 / N) / Math.max(1, list.length) * 4;
    const { p: c, side, up } = frame(t);
    const a = (j / list.length) * Math.PI * 2 + s, d = 38 + (h % 50);
    out.push({
      ...p, station: s, tex: TEX[h % TEX.length], ring: h % 9 === 0 || TEX[h % TEX.length] === "saturn",
      radius: 3 + (h % 70) / 10, tilt: ((h % 40) - 20) * Math.PI / 180, spin: 0.05 + (h % 7) * 0.02,
      pos: c.clone().addScaledVector(side, Math.cos(a) * d).addScaledVector(up, Math.sin(a) * d * 0.6)
    });
  }));
  return out;
})();

export const suns = STATIONS.map((_, s) => {
  const { p, side, up, tan } = frame(stationT(s) + 0.05);
  return p.clone().addScaledVector(side, s % 2 ? 260 : -260).addScaledVector(up, 90).addScaledVector(tan, 160);
});

// estado mutable compartido (fuera de React para no re-renderizar a 60 fps)
export const state = { t: 0, vel: 0.00012, target: 0.00012, auto: true, paused: false, warpTo: null, filter: "all", pointer: [0, 0], reduce: false };
export const BASE = 0.00012;
