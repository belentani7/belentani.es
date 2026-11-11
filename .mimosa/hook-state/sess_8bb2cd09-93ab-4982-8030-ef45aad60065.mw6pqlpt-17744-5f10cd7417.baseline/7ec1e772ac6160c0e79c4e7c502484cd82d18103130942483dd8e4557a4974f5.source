import test from 'node:test';
import assert from 'node:assert/strict';
import { WORLDS, findWorld } from '../src/components/legacy/worlds.ts';

test('the hub gives each destination one stable internal route', () => {
  assert.deepEqual(WORLDS.map((world) => world.id), ['judas', 'agency', 'duck', 'school']);
  assert.equal(new Set(WORLDS.map((world) => world.href)).size, WORLDS.length);
  assert.ok(WORLDS.every((world) => world.href.startsWith('/') && !world.href.startsWith('//')));
});

test('world selection rejects unknown identifiers', () => {
  assert.equal(findWorld('school')?.href, '/school');
  assert.equal(findWorld('unknown'), undefined);
});
