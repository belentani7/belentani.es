import { expect, test } from 'vitest';
import { ECHO_MYTH, MYTH_STATIONS, MYTH_PULSE, stationById } from '../lib/mythos';
import { WORLD_NODES, worldsForStation, isExternalWorld } from '../lib/worlds-atlas';

test('mythos has 8 stations with ES EN PT', () => {
  expect(MYTH_STATIONS).toHaveLength(8);
  for (const s of MYTH_STATIONS) {
    expect(s.title.es.length).toBeGreaterThan(3);
    expect(s.title.en.length).toBeGreaterThan(3);
    expect(s.title.pt.length).toBeGreaterThan(3);
    expect(s.speak.es.length).toBeGreaterThan(3);
  }
});

test('romance pulse names Pedro and Judas', () => {
  expect(MYTH_PULSE.romance.es.toLowerCase()).toMatch(/pedro|judas/);
  expect(MYTH_PULSE.romance.en.toLowerCase()).toMatch(/peter|judas/);
  expect(MYTH_PULSE.romance.pt.toLowerCase()).toMatch(/pedro|judas/);
});

test('traicion station is the kiss', () => {
  const t = stationById('traicion');
  expect(t).toBeTruthy();
  expect(t!.speak.es.toLowerCase()).toContain('judas');
});

test('Echo myth preserves the science-fiction rule and the archived galaxy', () => {
  expect(ECHO_MYTH.es.opening).toContain('lo que se puede ser');
  expect(ECHO_MYTH.es.galaxy).toContain('galaxia hermana');
  expect(ECHO_MYTH.es.lock).toContain('123456aaa');
  expect(ECHO_MYTH.es.singer).toContain('Belentani');
  expect(ECHO_MYTH.es.reveal).toContain('no atraviesa el vacío');
  expect(ECHO_MYTH.es.scienceNote).toContain('MITO DE CIENCIA FICCIÓN');
  for (const lang of ['es', 'en', 'pt'] as const) {
    expect(ECHO_MYTH[lang].scienceNote.length).toBeGreaterThan(40);
  }
});

test('Antigravity and AI Lab are reachable atlas worlds', () => {
  expect(WORLD_NODES.find((w) => w.id === 'antigravity')?.href).toBe('/maquina');
  expect(WORLD_NODES.find((w) => w.id === 'ai-lab')?.href).toBe('/ai-lab');
});

test('atlas links high-value worlds without inventing local copies', () => {
  expect(WORLD_NODES.length).toBeGreaterThanOrEqual(12);
  const judas = WORLD_NODES.find((w) => w.id === 'judas-web');
  expect(judas).toBeTruthy();
  expect(isExternalWorld(judas!)).toBe(true);
  expect(worldsForStation('traicion').length).toBeGreaterThan(0);
});
