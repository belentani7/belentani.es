import type { MetadataRoute } from 'next';

const routes = [
  '/',
  '/artist',
  '/artista',
  '/musica',
  '/prensa',
  '/judas',
  '/judas-era',
  '/judas/genesis',
  '/judas/traicion',
  '/judas/deuda',
  '/judas/redencion',
  '/galaxia',
  '/unificado',
];

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  return routes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date('2026-10-06T00:00:00.000Z'),
    changeFrequency: route === '/' ? 'weekly' : 'monthly',
    priority: route === '/' ? 1 : 0.7,
  }));
}
