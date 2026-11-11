import type { MetadataRoute } from 'next';
import { judasChapters } from '@/lib/judas-data';

// The root domain is already used by the layout metadata and robots.txt.
// Do not switch to www without first verifying production DNS and redirects.
const SITE_URL = 'https://belentani.es';

export default function sitemap(): MetadataRoute.Sitemap {
  // Include public, canonical artist pages, not the historical /artist alias,
  // private /api paths or excluded /mundos archives.
  const routes = [
    '/',
    '/artista',
    '/galaxia',
    '/judas',
    '/judas-era',
    '/musica',
    '/prensa',
    ...judasChapters.map((chapter) => `/judas/${chapter.id}`),
  ];

  return [...new Set(routes)].map((path) => ({
    url: new URL(path, SITE_URL).toString(),
  }));
}
