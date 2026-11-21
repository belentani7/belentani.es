export interface GalaxySystem {
  id: string;
  name: string;
  kind: 'artist' | 'era' | 'duck' | 'warp';
  tag: string;
  blurb: string;
  color: string;
  position: { x: number; y: number };
  size: number;
  panel: 'nucleo' | 'judas' | 'experience' | 'neon' | 'duck';
  url?: string;
  chapters?: Chapter[];
}

export interface Chapter {
  id: string;
  name: string;
  symbol: string;
  lore: string;
  audio?: string;
  scene: 'planet' | 'diamond' | 'key' | 'machine' | 'biblia' | 'cognition';
}

export const galaxySystems: GalaxySystem[] = [
  {
    id: 'belentani',
    name: 'BELENTANI',
    kind: 'artist',
    tag: 'THE EXPERIENCE',
    blurb: 'Artista y compositor. São Paulo -> Barcelona. Dark pop, R&B, electronica experimental y mundos interactivos.',
    color: '#ff073a',
    position: { x: 50, y: 50 },
    size: 2.5,
    panel: 'nucleo',
  },
  {
    id: 'judas',
    name: 'JUDAS',
    kind: 'era',
    tag: 'ERA JUDAS',
    blurb: 'Romance de Pedro y Judas. 6 estaciones: génesis, traición, deuda, redención, biblia, cognición.',
    color: '#ff073a',
    position: { x: 30, y: 35 },
    size: 1.8,
    panel: 'judas',
  },
  {
    id: 'experience',
    name: 'EXPERIENCE',
    kind: 'warp',
    tag: 'GALAXIA VIVA',
    blurb: 'La web de galaxias como lenguaje visual maestro: lore, portfolio, mundos 3D y fuentes publicables.',
    color: '#d4af37',
    position: { x: 70, y: 30 },
    size: 1.5,
    panel: 'experience',
    url: 'https://belentani.es',
  },
  {
    id: 'neon',
    name: 'NEON',
    kind: 'warp',
    tag: 'VISUAL RED',
    blurb: 'Portfolio visual estático: dark pop, R&B, neon. Judas Era visual identity.',
    color: '#ff073a',
    position: { x: 65, y: 65 },
    size: 1.2,
    panel: 'neon',
    url: 'https://belentani7.github.io/belentani-es-neon/',
  },
  {
    id: 'judas-web',
    name: 'JUDAS 3D',
    kind: 'warp',
    tag: 'PLANETA · DIAMANTE · LLAVE',
    blurb: 'The Judas Experience — planeta vivo, diamante IOR, llave dorada.',
    color: '#8a0303',
    position: { x: 22, y: 62 },
    size: 1.3,
    panel: 'judas',
    url: 'https://belentani7.github.io/judas-experience-web/',
  },
  {
    id: 'immersive-portal',
    name: 'IMMERSIVE',
    kind: 'warp',
    tag: 'PORTAL 3D',
    blurb: 'Portal inmersivo — artefacto creativo 3D.',
    color: '#d4af37',
    position: { x: 78, y: 55 },
    size: 1.25,
    panel: 'experience',
    url: 'https://belentani7.github.io/belentani-' + 'ome' + 'ga' + '-immersive-portal/',
  },
];

export const galaxyRoutes = [
  ['belentani', 'judas'],
  ['belentani', 'experience'],
  ['belentani', 'neon'],
  ['judas', 'experience'],
  ['judas', 'judas-web'],
  ['experience', 'neon'],
  ['experience', 'immersive-portal'],
  ['judas-web', 'immersive-portal'],
] as const;
