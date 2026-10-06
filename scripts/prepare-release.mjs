import fs from 'node:fs';
import path from 'node:path';

const source = process.cwd();
const target = path.resolve(source, '../../_bucket_descartes/2026-10-06_belentani_rotation/canonical-release');
if (!fs.existsSync(path.join(target, '.git'))) throw new Error('Expected existing canonical checkout');
const files = [
  'app/page.tsx', 'app/layout.tsx', 'app/globals.css',
  'app/(marketing)', 'app/(immersive)/judas-era', 'app/(immersive)/galaxia/page.tsx',
  'src/components/eras', 'src/components/canvas', 'src/components/Providers.tsx',
  'src/store/experienceStore.ts', 'src/hooks/useReducedMotion.ts', 'src/styles',
  'src/lib/boundaries.ts', 'src/__tests__/a11y.test.tsx', 'src/__tests__/experience.test.ts',
  'public', 'package.json', 'pnpm-lock.yaml', 'next.config.mjs', 'next-env.d.ts',
  'tsconfig.json', 'vitest.config.mjs', 'tailwind.config.mjs', 'postcss.config.mjs', '.gitignore',
  'README.md', 'CANON_UNIVERSO_MAESTRO.md', 'lore-canon/README.md',
  'scripts/check-boundaries.mjs', 'scripts/verify-experience.mjs',
  'RESUMEN_EJECUCION.md', 'PENDIENTES.md',
];
fs.mkdirSync(path.join(target, '_historical'), { recursive: true });
for (const file of ['index.html', 'app.js', 'data.js', 'styles.css']) {
  const original = path.join(target, file);
  if (fs.existsSync(original)) fs.copyFileSync(original, path.join(target, '_historical', file));
}
for (const file of files) {
  if (!fs.existsSync(path.join(source, file))) continue;
  fs.mkdirSync(path.dirname(path.join(target, file)), { recursive: true });
  fs.cpSync(path.join(source, file), path.join(target, file), { recursive: true });
}
const pkg = JSON.parse(fs.readFileSync(path.join(target, 'package.json'), 'utf8'));
pkg.name = 'belentani-the-experience';
for (const command of ['assets:download', 'assets:process', 'assets', 'test:e2e', 'test:visual', 'lint']) delete pkg.scripts[command];
pkg.scripts['test:visual'] = 'node scripts/verify-experience.mjs';
fs.writeFileSync(path.join(target, 'package.json'), JSON.stringify(pkg, null, 2) + '\n');
console.log('Prepared curated release:', target);
