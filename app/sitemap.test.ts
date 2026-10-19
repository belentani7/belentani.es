import { describe, expect, it } from 'vitest';
import robots from './robots';
import sitemap from './sitemap';

describe('artist site indexability', () => {
  it('keeps robots.txt and sitemap.xml on the same configured apex host', () => {
    const policy = robots();
    expect(policy.sitemap).toBe('https://belentani.es/sitemap.xml');
    expect(policy.rules).toMatchObject({
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/mundos/'],
    });
  });

  it('indexes public artist routes without duplicate, archived, or alias URLs', () => {
    const urls = sitemap().map(({ url }) => url);
    expect(new Set(urls).size).toBe(urls.length);
    for (const path of ['/', '/artista', '/galaxia', '/judas', '/judas-era', '/musica', '/prensa']) {
      expect(urls).toContain(new URL(path, 'https://belentani.es').toString());
    }
    expect(urls).not.toContain('https://belentani.es/artist');
    expect(urls.every((url) => url.startsWith('https://belentani.es/'))).toBe(true);
    expect(urls.every((url) => !url.includes('/mundos/') && !url.includes('/api/'))).toBe(true);
  });
});
