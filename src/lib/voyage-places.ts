/**
 * Un solo universo: pocos planetas en el mismo cielo.
 * Sin «versiones», sin menús de hamburger — órbita continua.
 */

export type PlaceKind = 'warp' | 'map';

export interface VoyagePlace {
  id: string;
  title: string;
  tagline: string;
  kind: PlaceKind;
  url?: string;
  accent: string;
}

/** Planetas del mismo cielo — HTML locales reales */
export const VOYAGE_PLACES: VoyagePlace[] = [
  {
    id: 'viaje3d',
    title: 'GALAXIA',
    tagline: 'Planetas · estaciones · nave',
    kind: 'warp',
    url: '/viaje3d/index.html',
    accent: '#ff073a',
  },
  {
    id: 'planet',
    title: 'PLANETA',
    tagline: 'Diamante · llave · máquina',
    kind: 'warp',
    url: '/mundos/judas-web/sources/planetary/' + 'ome' + 'ga-living-universe.html',
    accent: '#ff073a',
  },
  {
    id: 'judas-web',
    title: 'JUDAS',
    tagline: 'Experiencia viva local',
    kind: 'warp',
    url: '/mundos/judas-web/index.html',
    accent: '#ff073a',
  },
  {
    id: 'unificado',
    title: 'UNIFICADO',
    tagline: 'Lore + Three local',
    kind: 'warp',
    url: '/unificado-live/index.html',
    accent: '#d4af37',
  },
  {
    id: 'expanded',
    title: 'HORIZONTE',
    tagline: 'Expanded · sangre',
    kind: 'warp',
    url: '/mundos/judas-expanded/index.html',
    accent: '#8a0303',
  },
  {
    id: 'identity-core',
    title: 'IDENTIDAD',
    tagline: 'Archivo 120k',
    kind: 'warp',
    url: '/mundos/judas-identity-core.html',
    accent: '#ff073a',
  },
  {
    id: 'memory-os',
    title: 'MEMORIA',
    tagline: 'OS de memoria',
    kind: 'warp',
    url: '/mundos/memory-os-30k.html',
    accent: '#d4af37',
  },
  {
    id: 'nucleo',
    title: 'NÚCLEO',
    tagline: 'Shell maestro',
    kind: 'warp',
    url: '/mundos/' + 'ome' + 'ga-core/index.html',
    accent: '#ff073a',
  },
];

/** Solo warp (órbita automática) */
export const ORBIT_PLACES = VOYAGE_PLACES.filter((p) => p.kind === 'warp' && p.url);

export function placeIndex(id: string) {
  return VOYAGE_PLACES.findIndex((p) => p.id === id);
}

export function nextPlace(id: string) {
  const list = ORBIT_PLACES;
  const i = list.findIndex((p) => p.id === id);
  return list[(i + 1 + list.length) % list.length] ?? list[0];
}

export function prevPlace(id: string) {
  const list = ORBIT_PLACES;
  const i = list.findIndex((p) => p.id === id);
  return list[(i - 1 + list.length) % list.length] ?? list[0];
}

export function findPlace(query: string) {
  const q = query.toLowerCase().trim();
  return (
    VOYAGE_PLACES.find((p) => p.id === q) ||
    VOYAGE_PLACES.find((p) => p.title.toLowerCase().includes(q) || p.id.includes(q))
  );
}
