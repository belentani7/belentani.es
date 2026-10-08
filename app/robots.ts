import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/', disallow: ['/api/', '/mundos/'] },
    sitemap: 'https://belentani.es/sitemap.xml',
  };
}
