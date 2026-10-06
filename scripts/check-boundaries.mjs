import fs from 'node:fs';
import path from 'node:path';
import ts from 'typescript';

const forbidden = /(?:_private_audio_no_web|_satellites|_bucket|\.(?:wav|mp3|aiff?|flac|m4a|ogg|logicx|als|flp)(?:$|[?#]))/i;
const retired = new RegExp('ome' + 'ga|\u03a9', 'i');
const failures = [];
function walk(dir) {
  if (!fs.existsSync(dir)) return;
  for (const item of fs.readdirSync(dir, { withFileTypes: true })) {
    const file = path.join(dir, item.name);
    if (item.isDirectory()) { if (forbidden.test(file)) failures.push(file); else walk(file); continue; }
    if (forbidden.test(file) && dir.startsWith('public')) failures.push(file);
    if (!/\.(tsx?|jsx?|css|html|json)$/.test(file)) continue;
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
['app', 'src', 'public'].forEach(walk);
if (failures.length) { console.error([...new Set(failures)].join('\n')); process.exit(1); }
console.log('Artist boundaries verified: no private audio, satellite imports or retired branding.');
