import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { judasChapters } from '@/lib/judas-data';

const page = readFileSync(resolve(process.cwd(), 'app/(immersive)/judas/page.tsx'), 'utf8');
const css = readFileSync(resolve(process.cwd(), 'src/styles/spectral-art-direction.css'), 'utf8');

describe('The JUDAS story keeps its original canonical routes', () => {
  it('navigates all six actual chapters in three deliberate acts', () => {
    const chapters = judasChapters.filter(c => c.kind === 'chapter');
    expect(chapters).toHaveLength(6);
    const ids = ['genesis', 'invitacion', 'exceso', 'traicion', 'deuda', 'redencion'];
    expect(chapters.map(c => c.id)).toEqual(ids);
    for (const id of ids) expect(page).toContain(`'${id}'`);
    expect(page).toContain('chapters.find');
    expect(page).toContain('/judas/');
  });

  it('retains original appendices and native navigation', () => {
    expect(judasChapters.filter(c => c.kind === 'appendix')).toHaveLength(2);
    for (const value of ['id="ritual-acts"', 'id="judas-appendices"', 'aria-labelledby', '<Link', '<Card']) {
      expect(page).toContain(value);
    }
    expect(page).not.toContain('432 Hz');
    expect(page).not.toContain('−14 LUFS');
  });

  it('does not rely on external assets or duplicate a scene renderer', () => {
    expect(css).not.toMatch(/@import\s+url/);
    expect(page).not.toMatch(/<canvas|<iframe|dangerouslySetInnerHTML/);
    expect(css).toContain('prefers-reduced-motion');
    expect(css).toContain('prefers-contrast');
    expect(css).toContain(':focus-visible');
  });
});
