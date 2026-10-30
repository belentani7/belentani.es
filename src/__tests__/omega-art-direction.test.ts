import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
const read = (file: string) => readFileSync(resolve(process.cwd(), file), 'utf8');

describe('JUDAS artistic elevation is non-destructive', () => {
 it('imports only CSS, preserving the existing renderer stack', () => {
  expect(read('app/globals.css')).toContain("@import '../src/styles/omega-art-direction.css'");
  const manifest = JSON.parse(read('package.json'));
  expect(manifest.dependencies['@react-three/fiber']).toBeDefined();
  expect(manifest.dependencies['three']).toBeDefined();
 });
 it('scopes visual changes to the canonical JUDAS page', () => {
  const page = read('app/(immersive)/judas/page.tsx');
  expect(page).toContain('className="omega-art-direction ');
  expect(page).toContain('judasChapters.filter');
  expect(page).toContain('<Card');
 });
 it('respects contrast, keyboard access and reduced motion', () => {
  const css = read('src/styles/omega-art-direction.css');
  expect(css).toContain('prefers-reduced-motion');
  expect(css).toContain('prefers-contrast');
  expect(css).toContain('focus-visible');
 });
});
