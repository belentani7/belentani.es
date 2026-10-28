import { describe, expect, it } from 'vitest';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { VOYAGE_PLACES } from '../src/lib/voyage-places';

const ROUTE_ROOTS = ['app', 'app/(atlas)', 'app/(marketing)', 'app/(immersive)'];
function routeExists(url: string) {
  const segments = url.replace(/^\/+|\/+$/g, '');
  if (!segments) return existsSync(resolve(process.cwd(), 'app/page.tsx'));
  return ROUTE_ROOTS.some((base) =>
    existsSync(resolve(process.cwd(), base, segments, 'page.tsx')) ||
    existsSync(resolve(process.cwd(), base, segments, 'route.ts'))
  );
}

describe('galactic artist navigation', () => {
  it('every planet maps to an actual Next.js route, not a dead link', () => {
    for (const place of VOYAGE_PLACES) {
      expect(place.url, `Missing URL for ${place.id}`).toMatch(/^\/[a-z0-9/-]+$/);
      expect(routeExists(place.url!), `Missing Next route for ${place.id}: ${place.url}`).toBe(true);
    }
  });

  it('planet IDs and paths stay unique', () => {
    expect(new Set(VOYAGE_PLACES.map((place) => place.id)).size).toBe(VOYAGE_PLACES.length);
    expect(new Set(VOYAGE_PLACES.map((place) => place.url)).size).toBe(VOYAGE_PLACES.length);
  });

  it('creative studio and artist pages exist as actual destinations', () => {
    for (const route of ['/studio-creativo', '/artista', '/musica', '/judas', '/galaxia']) {
      expect(routeExists(route), `Missing required artist route: ${route}`).toBe(true);
    }
  });
});
