/**
 * Canonical entry points for the single Belentani platform.
 *
 * The order mirrors the JUDAS EXPERIENCE navigation (buildai.space):
 * HOME · THE ARTIST · MUSIC · JUDAS · PORTAL · ART GALLERY · CONTACT,
 * with the studio kept apart from the main bar, exactly as in the original.
 *
 * Every href below resolves to a page that exists in this repository.
 */
export const PLATFORM_NAVIGATION = [
  { index: '00', label: 'Inicio', href: '/' },
  { index: '01', label: 'Artista', href: '/artista' },
  { index: '02', label: 'Música', href: '/musica' },
  { index: '03', label: 'Judas', href: '/judas' },
  { index: '04', label: 'Portal', href: '/galaxia' },
  { index: '05', label: 'Galería', href: '/galeria' },
  { index: '06', label: 'Contacto', href: '/prensa' },
] as const;

/**
 * Satellites and archives. These are not chapters of the artist's identity:
 * they are the tools and records that orbit the main work.
 */
export const PLATFORM_NAV_UTILITY = [
  { label: 'Lore', href: '/lore' },
  { label: 'Antigravity', href: '/maquina' },
  { label: 'Futuro', href: '/future-era' },
  { label: 'AI Lab', href: '/ai-lab' },
  { label: 'Academia', href: '/school' },
  { label: 'Estudio', href: '/studio-creativo' },
] as const;

export type PlatformNavigationItem = (typeof PLATFORM_NAVIGATION)[number];
export type PlatformNavUtilityItem = (typeof PLATFORM_NAV_UTILITY)[number];
