import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const configText = readFileSync(new URL('../next.config.mjs', import.meta.url), 'utf8');
const manifest = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'));
const deployment = JSON.parse(readFileSync(new URL('../vercel.json', import.meta.url), 'utf8'));

test('standard builds do not eagerly import optional bundle tooling', async () => {
  assert.ok(manifest.devDependencies['@next/bundle-analyzer']);
  assert.doesNotMatch(configText, /import bundleAnalyzer from ['"]@next\/bundle-analyzer['"]/);
  assert.match(configText, /if \(process\.env\.ANALYZE === 'true'\)/);
  const previous = process.env.ANALYZE;
  process.env.ANALYZE = 'false';
  try {
    // Execute the config in an isolated data module without any package resolution.
    // An eager package import would throw here even if it exists in this repo.
    const url = 'data:text/javascript;base64,' + Buffer.from(configText).toString('base64');
    const loaded = await import(url);
    assert.equal(typeof loaded.default.webpack, 'function');
    assert.equal(loaded.default.reactStrictMode, true);
  } finally {
    if (previous === undefined) delete process.env.ANALYZE;
    else process.env.ANALYZE = previous;
  }
});

test('Vercel installs the exact lockfile including build dependencies', () => {
  assert.equal(deployment.framework, 'nextjs');
  assert.match(deployment.installCommand, /pnpm install --frozen-lockfile --prod=false/);
  assert.equal(deployment.buildCommand, 'pnpm build');
});

test('Vercel API function globs target the existing App Router tree', () => {
  const rules = deployment.functions ?? {};
  assert.deepEqual(Object.keys(rules), ['app/api/**/route.ts']);
  assert.equal(rules['app/api/**/route.ts'].maxDuration, 30);

  const root = fileURLToPath(new URL('../', import.meta.url));
  const routes = [];
  function walk(directory) {
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
      const entryPath = join(directory, entry.name);
      if (entry.isDirectory()) walk(entryPath);
      else if (entry.isFile() && entry.name === 'route.ts') {
        routes.push(relative(root, entryPath).replaceAll(sep, '/'));
      }
    }
  }
  walk(join(root, 'app', 'api'));
  assert.ok(routes.length > 0, 'Expected at least one App Router API route');
  for (const route of routes) {
    assert.match(route, /^app\/api\/(?:[^/]+\/)+route\.ts$/, `Unexpected API route: ${route}`);
  }
});
