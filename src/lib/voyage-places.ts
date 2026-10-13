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

/** Planetas del mismo cielo — rutas internas presentes en esta aplicación */
export const VOYAGE_PLACES: VoyagePlace[] = [
  {
    id: 'viaje3d',
    title: 'GALAXIA',
    tagline: 'Escena cinematográfica · nave',
    kind: 'warp',
    url: '/galaxia',
    accent: '#ff073a',
  },
  {
    id: 'planet',
    title: 'NEON',
    tagline: 'Identidad visual · dark pop',
    kind: 'warp',
    url: '/neon',
    accent: '#ff073a',
  },
  {
    id: 'judas-web',
    title: 'JUDAS',
    tagline: 'Seis capítulos · dos anexos',
    kind: 'warp',
    url: '/judas',
    accent: '#ff073a',
  },
  {
    id: 'unificado',
    title: 'UNIFICADO',
    tagline: 'Puente al satélite artístico',
    kind: 'warp',
    url: '/unificado',
    accent: '#d4af37',
  },
  {
    id: 'expanded',
    title: 'HORIZONTE',
    tagline: 'Horizonte cinematográfico',
    kind: 'warp',
    url: '/judas-era',
    accent: '#8a0303',
  },
  {
    id: 'origen',
    title: 'ORIGEN',
    tagline: 'El artista · música e imagen',
    kind: 'warp',
    url: '/artista',
    accent: '#d4af37',
  },
  {
    id: 'sonic-archive',
    title: 'ARCHIVO SONORO',
    tagline: 'La voz y las canciones',
    kind: 'warp',
    url: '/musica',
    accent: '#4de8e0',
  },
  {
    id: 'nucleo',
    title: 'NÚCLEO',
    tagline: 'Shell maestro',
    kind: 'warp',
    url: '/maquina',
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
