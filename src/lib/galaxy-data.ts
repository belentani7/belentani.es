export interface GalaxySystem {
  id: string;
  name: string;
  kind: 'artist' | 'era' | 'duck';
  tag: string;
  blurb: string;
  color: string;
  position: { x: number; y: number };
  size: number;
  panel: 'nucleo' | 'judas' | 'omega' | 'neon' | 'duck';
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
    tag: 'ARTISTA PRINCIPAL',
    blurb: 'Artista y compositor. São Paulo → Barcelona. Dark pop, R&B, electrónica experimental.',
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
    id: 'omega',
    name: 'OMEGA',
    kind: 'era',
    tag: 'ECOSISTEMA',
    blurb: 'Ecosistema conectando música, código y tecnología creativa. Portal inmersivo, plantilla, escaparate.',
    color: '#d4af37',
    position: { x: 70, y: 30 },
    size: 1.5,
    panel: 'omega',
    url: 'https://belentani.es',
  },
  {
    id: 'neon',
    name: 'NEON',
    kind: 'era',
    tag: 'VISUAL RED',
    blurb: 'Portfolio visual estático: dark pop, R&B, neon. Judas Era visual identity.',
    color: '#ff073a',
    position: { x: 65, y: 65 },
    size: 1.2,
    panel: 'neon',
    url: 'https://belentani7.github.io/belentani-es-neon/',
  },
  {
    id: 'duck',
    name: 'DUCK',
    kind: 'duck',
    tag: 'ARTISTA DUCK',
    blurb: 'Productor musical (Aracaju, Brasil). Beats, catálogo, reproductor, Studio OS.',
    color: '#4de8e0',
    position: { x: 20, y: 70 },
    size: 1.6,
    panel: 'duck',
    url: 'https://belentani7.github.io/duck-hub/',
  },
];

export const galaxyRoutes = [
  ['belentani', 'judas'],
  ['belentani', 'omega'],
  ['belentani', 'neon'],
  ['belentani', 'duck'],
  ['judas', 'omega'],
  ['omega', 'neon'],
] as const;