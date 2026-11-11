import { expect, test } from 'vitest';
import { readdirSync } from 'node:fs';
import { join } from 'node:path';
import { VOYAGE_PLACES } from '../lib/voyage-places';

function appRoutes(directory: string, segments: string[] = []): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    if (entry.isFile() && entry.name === 'page.tsx') return [`/${segments.join('/')}`];
    if (!entry.isDirectory()) return [];
    const next = entry.name.startsWith('(') ? segments : [...segments, entry.name];
    return appRoutes(join(directory, entry.name), next);
  });
}

test('every artist planet enters an existing internal page', () => {
  const routes = new Set(appRoutes(join(process.cwd(), 'app')));
  const destinations = VOYAGE_PLACES.map((place) => place.url);
  expect(new Set(destinations).size).toBe(destinations.length);
  for (const destination of destinations) {
    expect(destination?.startsWith('/') && !destination.startsWith('//')).toBe(true);
    expect(routes.has(destination ?? '')).toBe(true);
  }
});
