// Public runtime for BELENTANI OS. Historical and private source catalogs stay outside public/.
// node scripts/publish-artist-os.mjs [--check]
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const source = path.join(root, 'artist-os');
const destination = path.join(root, 'public', 'artist-os');
const checkOnly = process.argv.includes('--check');
const assets = ['index.html', 'os.css', 'os.js', 'studio-reflections.css'];
const records = [
  { key: 'artist', title: 'BELENTANI · Artista y compositor', url: '/artista', zone: 'home' },
  { key: 'music', title: 'Escuchar la obra · Discografía', url: '/musica', zone: 'music' },
  { key: 'judas-era', title: 'JUDAS · La era', url: '/judas-era', zone: 'world' },
  { key: 'judas', title: 'JUDAS · Experiencia', url: '/judas', zone: 'world' },
  { key: 'omega', title: 'OMEGA · Universo vivo', url: '/omega-living.html', zone: 'world' },
  { key: 'atlas', title: 'Atlas vivo · Galaxia original', url: '/atlas', zone: 'world' },
  { key: 'galaxy', title: 'Galaxia · Viaje inmersivo', url: '/galaxia', zone: 'world' },
  { key: 'gallery', title: 'Galería · Escenas del universo', url: '/galeria', zone: 'visual' },
  { key: 'studio', title: 'Estudio creativo · Sonido y materia', url: '/studio-creativo', zone: 'studio' },
  { key: 'lore', title: 'Archivo vivo · El relato', url: '/lore', zone: 'archive' },
  { key: 'press', title: 'Prensa · Canales oficiales', url: '/prensa', zone: 'archive' }
];
const seen = new Set();
for (const record of records) {
  if (!/^\/[a-z0-9/-]+(?:\.html)?$/.test(record.url) || record.url.includes('//') || seen.has(record.url)) {
    throw Error('Unsafe or duplicate destination: ' + record.url);
  }
  seen.add(record.url);
}
for (const filename of assets) {
  if (!fs.existsSync(path.join(source, filename))) throw Error('Missing artist OS source: ' + filename);
}
if (!fs.existsSync(path.join(root, 'public', 'omega-living.html'))) throw Error('OMEGA scene missing');
if (!fs.existsSync(path.join(root, 'app', 'atlas', 'page.tsx'))) throw Error('Atlas page missing');
const items = records.map(({ key, title, url, zone }) => ({
  id: 'artist-canon/' + key,
  title, zone, kind: 'page', href: '..' + url,
  repo: 'belentani.es', path: url, red: zone === 'archive' ? 0 : 1,
  featured: true, collection: 'Obra artística'
}));
const catalog = {
  generated: '2026-11-17',
  source: 'Curated first-party Next.js routes; not the private vault',
  total: items.length, stats: { 'belentani.es': { items: items.length } }, items
};
if (!checkOnly) {
  fs.mkdirSync(destination, { recursive: true });
  for (const filename of assets) fs.copyFileSync(path.join(source, filename), path.join(destination, filename));
  fs.writeFileSync(path.join(destination, 'catalog.js'), 'window.BELENTANI_CATALOG=' + JSON.stringify(catalog) + ';\n', 'utf8');
  fs.writeFileSync(path.join(destination, 'catalog.json'), JSON.stringify(catalog, null, 2) + '\n', 'utf8');
}
console.log('ARTIST_OS_' + (checkOnly ? 'CHECK' : 'PUBLISHED'), items.length, 'FIRST_PARTY_ROUTES');
