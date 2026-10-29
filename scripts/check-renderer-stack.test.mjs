import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { validateRendererStack } from './check-renderer-stack.mjs';

const manifest = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'));

function changed(edit) {
  const copy = structuredClone(manifest);
  edit(copy);
  return validateRendererStack(copy);
}

test('current Next.js, React, R3F and Tailwind versions are compatible', () => {
  assert.deepEqual(validateRendererStack(manifest), []);
});

test('rejects React 18 / Fiber 8 under Next.js 15 App Router', () => {
  const errors = changed((p) => {
    p.dependencies.react = '18.3.1';
    p.dependencies['react-dom'] = '18.3.1';
    p.dependencies['@react-three/fiber'] = '8.16.0';
    p.dependencies['@react-three/drei'] = '9.100.0';
    p.devDependencies['@types/react'] = '18.3.3';
    p.devDependencies['@types/react-dom'] = '18.3.0';
  });
  assert.ok(errors.some((message) => message.includes('Fiber 8 crashes')));
});

test('rejects mismatched Tailwind internal package overrides', () => {
  const errors = changed((p) => {
    p.pnpm.overrides['@tailwindcss/oxide'] = '4.0.0';
    p.pnpm.overrides['@tailwindcss/node'] = '4.0.0';
  });
  assert.ok(errors.some((message) => message.includes('@tailwindcss/oxide')));
  assert.ok(errors.some((message) => message.includes('@tailwindcss/node')));
});

test('rejects React mismatched to react-dom and TypeScript declarations', () => {
  const errors = changed((p) => {
    p.dependencies['react-dom'] = '18.3.1';
    p.devDependencies['@types/react'] = '18.3.3';
  });
  assert.ok(errors.some((message) => message.includes('react and react-dom')));
  assert.ok(errors.some((message) => message.includes('@types/react')));
});

test('rejects missing pinned dependency versions', () => {
  const errors = changed((p) => {
    p.dependencies.next = '^15.5.28';
  });
  assert.ok(errors.some((message) => message.includes('next must be pinned')));
});
