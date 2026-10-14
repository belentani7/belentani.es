/**
 * Un solo universo: planetas navegables con origen trazable.
 * Cada nodo resume una fuente real del ecosistema Belentani o una ruta viva del sitio.
 */

export type PlaceKind = 'warp' | 'map';

export interface VoyagePlace {
  id: string;
  title: string;
  tagline: string;
  kind: PlaceKind;
  url?: string;
  accent: string;
  sourceRepo?: string;
  assetNote?: string;
}

/** Planetas del mismo cielo — rutas internas y satélites curados. */
export const VOYAGE_PLACES: VoyagePlace[] = [
  { id: 'viaje3d', title: 'GALAXIA', tagline: 'Escena cinematográfica · nave', kind: 'warp', url: '/galaxia', accent: '#ff073a', sourceRepo: 'belentani.es', assetNote: 'Atlas procedural propio' },
  { id: 'visual-engine', title: 'VISUAL ENGINE', tagline: 'Shaders · planeta vivo · export', kind: 'warp', url: '/visual-engine', accent: '#ff315b', sourceRepo: 'belentani-visual-engine', assetNote: 'Dirección técnica para planetas, diamante IOR y atmósfera' },
  { id: 'planet-scene', title: 'PLANETA ROJO', tagline: 'Órbita bioluminiscente · anillos', kind: 'warp', url: '/planet-scene', accent: '#ff0033', sourceRepo: 'belentani-portfolio/client/src/components/PlanetScene.tsx', assetNote: 'Patrón de planeta neón y nave orbital adaptado' },
  { id: 'judas-web', title: 'JUDAS', tagline: 'Seis capítulos · dos anexos', kind: 'warp', url: '/judas', accent: '#ff073a', sourceRepo: 'judas-experience-unificado', assetNote: 'Planeta, llave, diamante y máquina como motivos centrales' },
  { id: 'unificado', title: 'UNIFICADO', tagline: 'Puente al satélite artístico', kind: 'warp', url: '/unificado', accent: '#d4af37', sourceRepo: 'judas-experience-unificado/readme.md', assetNote: 'Canon de seis nodos y artefactos' },
  { id: 'expanded', title: 'HORIZONTE', tagline: 'Horizonte cinematográfico', kind: 'warp', url: '/judas-era', accent: '#8a0303', sourceRepo: 'belentani-judas-era-export', assetNote: 'Planeta 3D como lienzo narrativo' },
  { id: 'red-starfield', title: 'STARFIELD', tagline: 'Campo rojo · textura espacial', kind: 'warp', url: '/starfield', accent: '#ff456d', sourceRepo: 'red-starfield-frontend', assetNote: 'Tratamiento de fondo rojo y estrellas' },
  { id: 'diamond', title: 'DIAMANTE', tagline: 'Facetas físicas · arquetipos', kind: 'warp', url: '/diamante', accent: '#f4f0f2', sourceRepo: 'diamante-fotorealista', assetNote: 'Referencia de corte brillante y material físico' },
  { id: 'spaceship-trail', title: 'NAVE', tagline: 'Estela · guía · movimiento', kind: 'warp', url: '/nave', accent: '#4de8e0', sourceRepo: 'ManosAbiertas/src/components/manos-abiertas/SpaceShipTrail.tsx', assetNote: 'Estelas luminosas adaptadas como capa de navegación' },
  { id: 'origen', title: 'ORIGEN', tagline: 'El artista · música e imagen', kind: 'warp', url: '/artista', accent: '#d4af37', sourceRepo: 'Drive + app/(marketing)/artista', assetNote: 'Foto segura y bio revisada' },
  { id: 'sonic-archive', title: 'ARCHIVO SONORO', tagline: 'La voz y las canciones', kind: 'warp', url: '/musica', accent: '#4de8e0', sourceRepo: 'catálogo artístico', assetNote: 'Ruta musical del universo' },
  { id: 'nucleo', title: 'NÚCLEO', tagline: 'Shell maestro', kind: 'warp', url: '/maquina', accent: '#ff073a', sourceRepo: 'B7 core local', assetNote: 'NAVE, comandos y lore local' },
  { id: 'portal3d', title: 'PORTAL 3D', tagline: 'Portal inmersivo · Three.js', kind: 'warp', url: '/portal3d', accent: '#b9a4ff', sourceRepo: 'portal inmersivo B7', assetNote: 'Satélite 3D público inventariado' },
  { id: 'portfolio3d', title: '3D PORTFOLIO', tagline: 'Room GLB · portfolio', kind: 'warp', url: '/portfolio3d', accent: '#83d6ba', sourceRepo: '3d-portfolio', assetNote: 'GLB localizado, no importado por no ser nave/planeta' },
  { id: 'agency', title: 'AGENCY', tagline: 'IA · confianza · evidencia', kind: 'warp', url: '/agency', accent: '#b9a4ff', sourceRepo: 'noiacore-turbo-v2 · agentguard · evidence-ledger', assetNote: 'Imperio IA en órbita' },
  { id: 'duck', title: 'DUCK STUDIO', tagline: 'Música · producción creativa', kind: 'warp', url: '/duck', accent: '#ffc36c', sourceRepo: 'duck-studio-os-v2 · duck-music-lab', assetNote: 'Planeta musical creativo' },
  { id: 'school', title: 'OPEN SCHOOL', tagline: 'Educación · lenguas · acceso', kind: 'warp', url: '/school', accent: '#83d6ba', sourceRepo: 'open-school · linguaforge-v2', assetNote: 'Planeta educativo abierto' },
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
