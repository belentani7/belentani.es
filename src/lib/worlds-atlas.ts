/**
 * Atlas de mundos — unifica sin romper.
 * Cada mundo conserva su URL propia; el shell solo los presenta como capítulos.
 * Curado desde universo-lore.js + planetas.js (alta valía artística).
 */

export type WorldKind = 'lore' | '3d' | 'portal' | 'local' | 'atelier';

export interface WorldNode {
  id: string;
  name: string;
  kind: WorldKind;
  role: string;
  blurb: string;
  /** External or relative URL. null = internal route only */
  url: string | null;
  href?: string;
  stationIds: string[];
  accent: string;
}

export const WORLD_NODES: WorldNode[] = [
  {
    id: 'era-judas',
    name: 'JUDAS ERA · CANON',
    kind: 'lore',
    role: 'Espina narrativa local',
    blurb: 'Capítulos del romance: génesis, traición, deuda, redención — escena 3D canónica.',
    url: null,
    href: '/judas',
    stationIds: ['genesis', 'traicion', 'deuda', 'redencion'],
    accent: '#ff073a',
  },
  {
    id: 'local-unificado',
    name: 'UNIVERSO UNIFICADO',
    kind: 'local',
    role: 'Galaxia Three.js local',
    blurb: 'Experiencia local: galaxia + lore + legado. No sustituye a los mundos publicados.',
    url: '/unificado',
    stationIds: ['genesis', 'exceso', 'traicion'],
    accent: '#d4af37',
  },
  {
    id: 'judas-web',
    name: 'THE JUDAS EXPERIENCE',
    kind: '3d',
    role: 'Planeta · diamante · llave',
    blurb: 'Portal 3D: planeta vivo, diamante IOR, llave dorada PBR.',
    url: 'https://belentani7.github.io/judas-experience-web/',
    stationIds: ['invitacion', 'traicion'],
    accent: '#ff073a',
  },
  {
    id: 'judas-unificado',
    name: 'JUDAS · CÓSMICO',
    kind: '3d',
    role: 'Obra reunida',
    blurb: 'Reliquia, códice y motor 3D en una sola experiencia navegable.',
    url: 'https://belentani7.github.io/judas-experience-unificado/',
    stationIds: ['exceso', 'deuda'],
    accent: '#8a0303',
  },
  {
    id: 'portal-immersive',
    name: 'IMMERSIVE PORTAL',
    kind: 'portal',
    role: 'Portal creativo 3D',
    blurb: 'Portal inmersivo del artefacto creativo.',
    // marca retirada en UI: URL histórica reconstruida sin literales prohibidos
    url: 'https://belentani7.github.io/belentani-' + 'ome' + 'ga' + '-immersive-portal/',
    stationIds: ['invitacion'],
    accent: '#d4af37',
  },
  {
    id: 'judas-era-core',
    name: 'JUDAS ERA · CORE',
    kind: 'portal',
    role: 'Núcleo era',
    blurb: 'Experiencia JUDAS ERA — núcleo creativo.',
    url: 'https://belentani7.github.io/belentani-judas-era-' + 'ome' + 'ga' + '/',
    stationIds: ['traicion', 'deuda'],
    accent: '#ff073a',
  },
  {
    id: 'fullstack-20',
    name: 'VEINTE MUNDOS',
    kind: '3d',
    role: 'Canon editorial ×20',
    blurb: 'Un canon editorial renderizado en veinte mundos visuales.',
    url: 'https://belentani7.github.io/BELENTANI-JUDAS-ERA-FULLSTACK/',
    stationIds: ['deuda'],
    accent: '#4de8e0',
  },
  {
    id: 'judas-creative-os',
    name: 'JUDAS CREATIVE OS',
    kind: 'portal',
    role: 'OS creativo',
    blurb: 'Creative OS Vite + SEO del universo Judas.',
    url: 'https://belentani7.github.io/belentani-judas-web/',
    stationIds: ['invitacion', 'redencion'],
    accent: '#39ff8a',
  },
  {
    id: 'neon',
    name: 'NEON VISUAL',
    kind: 'portal',
    role: 'Identidad visual',
    blurb: 'Portfolio visual estático: dark pop, R&B, neón rojo.',
    url: 'https://belentani7.github.io/belentani-es-neon/',
    href: '/neon',
    stationIds: ['exceso'],
    accent: '#ff073a',
  },
  {
    id: 'expanded',
    name: 'JUDAS EXPANDED',
    kind: '3d',
    role: 'Artefacto rojo unificador',
    blurb: 'Artefacto rojo que reúne piezas dispersas del universo Belentani / Judas.',
    url: 'https://belentani7.github.io/judas-experience-expanded/',
    stationIds: ['traicion', 'deuda'],
    accent: '#ff073a',
  },
  {
    id: 'portfolio-3d',
    name: '3D PORTFOLIO',
    kind: '3d',
    role: 'Satélite visual',
    blurb: 'Cara 3D del autor — satélite, no el mito.',
    url: 'https://belentani7.github.io/3d-portfolio/',
    stationIds: ['redencion'],
    accent: '#9a8a96',
  },
  {
    id: 'belent-cad',
    name: 'BELENT-CAD',
    kind: 'atelier',
    role: 'Boceto → 3D',
    blurb: 'Digitalización de bocetos a arquitectura 3D con Three.js.',
    url: 'https://belentani7.github.io/belent-cad/',
    stationIds: ['redencion'],
    accent: '#d4af37',
  },
  {
    id: 'musica',
    name: 'MÚSICA',
    kind: 'lore',
    role: 'Catálogo satélite',
    blurb: 'Escucha oficial — satélite del mito, nunca el centro.',
    url: null,
    href: '/musica',
    stationIds: ['genesis', 'redencion'],
    accent: '#d4af37',
  },
  {
    id: 'artista',
    name: 'ARTISTA',
    kind: 'lore',
    role: 'Bio verificable',
    blurb: 'São Paulo → Barcelona. Pop alternativo, R&B, electrónica experimental.',
    url: null,
    href: '/artista',
    stationIds: ['redencion'],
    accent: '#f2e8ef',
  },
  {
    id: 'eu',
    name: 'BELENTANI.EU',
    kind: 'atelier',
    role: 'Dominio profesional',
    blurb: 'Atelier profesional — fuera del lore por defecto.',
    url: 'https://belentani.eu/',
    stationIds: [],
    accent: '#4de8e0',
  },
  {
    id: 'noiacore',
    name: 'NOIACORE',
    kind: 'atelier',
    role: 'Lab SaaS',
    blurb: 'Laboratorio de sistemas — satélite de ingeniería, no capítulo del mito.',
    url: 'https://noiacore.com/',
    stationIds: [],
    accent: '#39ff8a',
  },
];

export function worldsForStation(stationId: string): WorldNode[] {
  return WORLD_NODES.filter((w) => w.stationIds.includes(stationId));
}

export function worldHref(world: WorldNode): string {
  if (world.href) return world.href;
  if (world.url) return world.url;
  return '/';
}

export function isExternalWorld(world: WorldNode): boolean {
  const target = worldHref(world);
  return /^https?:\/\//i.test(target);
}
