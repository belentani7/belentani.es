import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
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

describe('real artist sharing and identity', () => {
  it('publishes a real portrait for the artist, music and press preview cards', () => {
    const image = resolve(process.cwd(), 'public/media/artist/pedro-2024-portrait.jpg');
    expect(existsSync(image)).toBe(true);
    const layout = readFileSync(resolve(process.cwd(), 'app/layout.tsx'), 'utf8');
    expect(layout).toContain("card: 'summary_large_image'");
    expect(layout).toContain("'https://www.instagram.com/belentani_/'");
    expect(layout).toContain("image: 'https://belentani.es/media/artist/pedro-2024-portrait.jpg'");
    for (const route of ['artista', 'musica', 'prensa']) {
      const source = readFileSync(resolve(process.cwd(), 'app/(marketing)', route, 'page.tsx'), 'utf8');
      expect(source).toContain("images: [{ url: '/media/artist/pedro-2024-portrait.jpg'");
    }
  });
});
