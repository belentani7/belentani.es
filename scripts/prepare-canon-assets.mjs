import fs from 'node:fs/promises';
import crypto from 'node:crypto';
const source = '.local-archive/judas-canon';
const target = 'public/assets/judas-canon';
const capture = JSON.parse(await fs.readFile(`${source}/manifest.json`, 'utf8'));
await fs.mkdir(target, { recursive: true });
const selected = capture.assets.filter(asset => asset.file === '746b2f759ebdbcdea71c.png');
const records = [];
for (const asset of selected) {
  const bytes = await fs.readFile(`${source}/${asset.file}`);
  await fs.writeFile(`${target}/belentani-mon-amour.png`, bytes);
  records.push({ file: 'belentani-mon-amour.png', type: asset.type, origin: asset.origin, bytes: bytes.length, sha256: crypto.createHash('sha256').update(bytes).digest('hex'), role: 'Historical artist wordmark. Preserved as an asset; not presented as Judas cover art.' });
}
await fs.writeFile(`${target}/manifest.json`, JSON.stringify({ canon: capture.origin, captured: capture.captured, assets: records, archive: 'Raw network responses and screenshots retained privately, outside public build.' }, null, 2));
console.log(`Curated public visual assets: ${records.length}`);
