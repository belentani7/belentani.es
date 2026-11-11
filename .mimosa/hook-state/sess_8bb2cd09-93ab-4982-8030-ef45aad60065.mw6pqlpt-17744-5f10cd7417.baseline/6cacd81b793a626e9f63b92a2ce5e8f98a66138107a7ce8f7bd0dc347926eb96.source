import { expect, test } from 'vitest';
import { ARCHETYPES } from '../lib/archetypes';
import { answerFromCanon } from '../lib/nave-knowledge';

test('NAVE gives a chapter route for a lore clue and admits when the signal is unknown', () => {
  expect(answerFromCanon('¿Qué significa la llave?').href).toBe('/judas/deuda');
  expect(answerFromCanon('meteorito 98765').source).toBe('archivo local');
});

test('each gem has its own color, route and clue', () => {
  expect(ARCHETYPES).toHaveLength(5);
  expect(new Set(ARCHETYPES.map((item) => item.color)).size).toBe(5);
  expect(ARCHETYPES.every((item) => item.href.startsWith('/') && item.clue.length > 10)).toBe(true);
});
