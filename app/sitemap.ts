import type { MetadataRoute } from 'next';
import { judasChapters } from '@/lib/judas-data';

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ['/', '/artist', '/musica', '/prensa', '/judas',
    ...judasChapters.map(chapter => `/judas/${chapter.id}`)];
  return routes.map(path => ({ url: `https://belentani.es${path}` }));
}
