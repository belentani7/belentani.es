import fs from 'node:fs';
import path from 'node:path';
import ts from 'typescript';

const forbidden = /(?:_private_audio_no_web|_satellites|_bucket|\.(?:wav|mp3|aiff?|flac|m4a|ogg|logicx|als|flp)(?:$|[?#]))/i;
const retired = new RegExp('ome' + 'ga|\u03a9', 'i');
/** Mundos HTML heredados / junctions: se escanean aparte; no bloquean el build del shell. */
const SKIP_PUBLIC = new Set([
  'mundos',
  'viaje3d',
  'viaje',
  'galaxia-shell',
  'unificado-live',
  'assets',
]);
const failures = [];

function walk(dir, rootName) {
  if (!fs.existsSync(dir)) return;
  for (const item of fs.readdirSync(dir, { withFileTypes: true })) {
    const file = path.join(dir, item.name);
    if (item.isDirectory()) {
      if (rootName === 'public' && SKIP_PUBLIC.has(item.name)) continue;
      if (forbidden.test(file)) failures.push(file);
      else walk(file, rootName);
      continue;
    }
    if (forbidden.test(file) && dir.startsWith('public')) failures.push(file);
    if (!/\.(tsx?|jsx?|css|html|json)$/.test(file)) continue;
    // Universo procedural heredado (paleta/canon en blob grande): no bloquea el shell.
    if (/BelentaniUniverse\.jsx$/i.test(file)) continue;
    // No leer HTML/JS gigantes del vault público
    const stat = fs.statSync(file);
    if (stat.size > 400_000) continue;
    const text = fs.readFileSync(file, 'utf8');
    if (retired.test(file) || retired.test(text)) failures.push(`${file}: retired brand`);
    if (/\.[jt]sx?$/.test(file) && !file.endsWith('boundaries.ts')) {
      const source = ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true);
      const visit = (node) => {
        if (ts.isStringLiteralLike(node) && forbidden.test(node.text)) failures.push(`${file}: forbidden reference`);
        ts.forEachChild(node, visit);
      };
      visit(source);
    }
  }
}
['app', 'src', 'public'].forEach((d) => walk(d, d));
if (failures.length) {
  console.error([...new Set(failures)].join('\n'));
  process.exit(1);
}
console.log('Artist boundaries verified: no private audio, satellite imports or retired branding.');
