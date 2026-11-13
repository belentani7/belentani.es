/**
 * Canonical entry points for the single Belentani platform.
 * Keep route ownership here so every surface exposes the same destinations.
 */
export const PLATFORM_NAVIGATION = [
  { label: 'Judas', href: '/judas' },
  { label: 'Artista', href: '/artista' },
  { label: 'Prensa', href: '/prensa' },
  { label: 'Música', href: '/musica' },
  { label: 'Galaxia', href: '/galaxia' },
  { label: 'AI Lab', href: '/ai-lab' },
  { label: 'Estudio', href: '/studio-creativo' },
] as const;

export type PlatformNavigationItem = (typeof PLATFORM_NAVIGATION)[number];
