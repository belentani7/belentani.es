export interface World {
  readonly id: 'judas' | 'agency' | 'duck' | 'school';
  readonly title: string;
  readonly category: string;
  readonly subtitle: string;
  readonly href: `/${string}`;
  readonly accent: string;
  readonly coordinates: readonly [number, number, number];
}

/** Source projects keep their own identity; the hub is their common entrance. */
export const WORLDS: readonly World[] = [
  {
    id: 'judas', title: 'JUDAS ERA', category: 'MÚSICA / NARRATIVA',
    subtitle: 'Una voz. Un espejo. Una deuda.', href: '/judas-era',
    accent: '#ff174d', coordinates: [0, 1.15, 0],
  },
  {
    id: 'agency', title: 'BELENTANI AGENCY', category: 'IA / TRUST & SAFETY',
    subtitle: 'Sistemas de IA con criterio y trazabilidad.', href: '/agency',
    accent: '#e3b96a', coordinates: [-3.8, -0.85, -0.5],
  },
  {
    id: 'duck', title: 'DUCK STUDIO', category: 'MÚSICA / PRODUCCIÓN',
    subtitle: 'Producción, sonido y dirección creativa.', href: '/duck',
    accent: '#e95637', coordinates: [3.8, -0.8, -0.4],
  },
  {
    id: 'school', title: 'OPEN SCHOOL', category: 'EDUCACIÓN ABIERTA',
    subtitle: 'Aprendizaje y herramientas multilingües.', href: '/school',
    accent: '#77c9d0', coordinates: [0, -2.65, -1.1],
  },
] as const;

export function findWorld(id: string): World | undefined {
  return WORLDS.find((world) => world.id === id);
}
