import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const bucket = path.resolve(root, '../..', '_bucket_descartes/2026-10-06_belentani_rotation');
fs.mkdirSync(bucket, { recursive: true });
const backup = path.join(bucket, 'preflight-backup');
const apply = process.argv.includes('--apply');
if (!apply) {
  for (const dir of ['app', 'src']) {
    fs.cpSync(path.join(root, dir), path.join(backup, dir), { recursive: true, force: false, errorOnExist: true });
  }
  const files = [];
  function inventory(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (['node_modules', '.git', '.next', '_clones', 'Ciclona', '_private_audio_no_web', '_satellites', '.vercel'].includes(entry.name) || entry.isSymbolicLink()) continue;
      const file = path.join(dir, entry.name);
      if (entry.isDirectory()) inventory(file);
      else if (/\.(mp3|wav|aiff?|flac|m4a|ogg|logicx|als|flp)$/i.test(entry.name)) files.push({ path: path.relative(root, file), bytes: fs.statSync(file).size });
    }
  }
  inventory(root);
  fs.writeFileSync(path.join(bucket, 'preflight.json'), JSON.stringify({ root, backup, audio: files }, null, 2));
  console.log(JSON.stringify({ backup, audioFiles: files.length, audioBytes: files.reduce((sum, file) => sum + file.bytes, 0) }));
  process.exit(0);
}
if (!fs.existsSync(path.join(bucket, 'preflight.json'))) throw new Error('Run preflight first');
const manifest = path.join(bucket, '_MANIFEST_MOVED.csv');
if (!fs.existsSync(manifest)) fs.writeFileSync(manifest, 'ruta_origen,ruta_destino,fecha,motivo,reversible\n');
const csv = (value) => `"${String(value).replaceAll('"', '""')}"`;
function move(relative, target, reason) {
  const source = path.resolve(root, relative);
  const dest = path.resolve(target);
  if (!source.startsWith(root + path.sep) || !dest.startsWith(bucket + path.sep) && !dest.startsWith(root + path.sep)) throw new Error('Path outside workspace');
  if (!fs.existsSync(source)) return;
  if (fs.existsSync(dest)) throw new Error(`Destination exists: ${dest}`);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.appendFileSync(manifest, [source, dest, new Date().toISOString(), `planned: ${reason}`, true].map(csv).join(',') + '\n');
  fs.renameSync(source, dest);
  fs.appendFileSync(manifest, [source, dest, new Date().toISOString(), reason, true].map(csv).join(',') + '\n');
}

// Historical versions remain byte-for-byte in the archive, outside the runtime.
move('app/(marketing)/page.tsx', path.join(bucket, 'historical/marketing-home.tsx'), 'Historical homepage preserved');
move('app/(marketing)/maestro', path.join(root, '_satellites/portfolio-maestro'), 'Separate professional portfolio');
move('src/lib/master-portfolio.ts', path.join(root, '_satellites/master-portfolio.ts'), 'Separate satellite data');
const retired = 'ome' + 'ga';
move(`app/(immersive)/${retired}`, path.join(bucket, 'historical/experience-route'), 'Historical route preserved');

const audio = /\.(mp3|wav|aiff?|flac|m4a|ogg|logicx|als|flp)$/i;
const skip = new Set(['node_modules', '.next', '.git', '_private_audio_no_web', '_satellites', 'Ciclona', '_clones', '.vercel']);
function walk(dir) {
  for (const item of fs.readdirSync(dir, { withFileTypes: true })) {
    if (skip.has(item.name) || item.isSymbolicLink()) continue;
    const file = path.join(dir, item.name);
    if (audio.test(item.name)) {
      const relative = path.relative(root, file);
      move(relative, path.join(root, '_private_audio_no_web', relative), 'Private audio excluded from website');
    } else if (item.isDirectory()) walk(file);
  }
}
walk(root);
function clean(dir) {
  for (const item of fs.readdirSync(dir, { withFileTypes: true })) {
    const file = path.join(dir, item.name);
    if (item.isDirectory()) clean(file);
    else if (/\.(tsx?|jsx?|css|json)$/.test(file)) {
      const source = fs.readFileSync(file, 'utf8');
      const result = source.replace(new RegExp(retired, 'gi'), (word) => word === word.toUpperCase() ? 'EXPERIENCE' : word[0] === word[0].toUpperCase() ? 'Experience' : 'experience').replaceAll('\u03a9', 'B');
      if (result !== source) fs.writeFileSync(file, result);
    }
  }
}
['app', 'src'].forEach((dir) => clean(path.join(root, dir)));
for (const directory of ['_satellites/noiacore', '_satellites/education', '_satellites/consultoria', '_satellites/duck', 'public/assets/judas-canon']) fs.mkdirSync(directory, { recursive: true });
console.log('Curation complete. Reversible manifest:', manifest);
