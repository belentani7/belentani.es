import { expect, test } from 'vitest';
import { MYTH_STATIONS, MYTH_PULSE, stationById } from '../lib/mythos';
import { WORLD_NODES, worldsForStation, isExternalWorld } from '../lib/worlds-atlas';

test('mythos has 6 stations with ES EN PT', () => {
  expect(MYTH_STATIONS).toHaveLength(6);
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

test('atlas links high-value worlds without inventing local copies', () => {
  expect(WORLD_NODES.length).toBeGreaterThanOrEqual(12);
  const judas = WORLD_NODES.find((w) => w.id === 'judas-web');
  expect(judas).toBeTruthy();
  expect(isExternalWorld(judas!)).toBe(true);
  expect(worldsForStation('traicion').length).toBeGreaterThan(0);
});
