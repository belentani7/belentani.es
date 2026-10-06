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
    blurb: 'La obra narrativa central. 6 capítulos: génesis, traición, deuda, redención, biblia, cognición.',
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
];

export const galaxyRoutes = [
  ['belentani', 'judas'],
  ['belentani', 'experience'],
  ['belentani', 'neon'],
  ['judas', 'experience'],
  ['experience', 'neon'],
] as const;
