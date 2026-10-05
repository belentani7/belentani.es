const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ASSETS_DIR = path.join(__dirname, '..', 'public', 'assets');

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

async function downloadFromRepo(owner, repo, assetPath, destPath) {
  try {
    const url = `https://raw.githubusercontent.com/${owner}/${repo}/main/${assetPath}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const buffer = await response.arrayBuffer();
    ensureDir(path.dirname(destPath));
    fs.writeFileSync(destPath, Buffer.from(buffer));
    console.log(`✓ Downloaded ${assetPath} → ${destPath}`);
  } catch (e) {
    console.error(`✗ Failed ${assetPath}:`, e.message);
  }
}

async function main() {
  console.log('Downloading assets from source repos...\n');

  const assets = [
    // judas-experience-web
    { owner: 'belentani7', repo: 'judas-experience-web', src: 'assets/audio/sessions/instrumental.mp3', dest: 'audio/instrumental.mp3' },
    { owner: 'belentani7', repo: 'judas-experience-web', src: 'assets/audio/sessions/violin.mp3', dest: 'audio/violin.mp3' },
    { owner: 'belentani7', repo: 'judas-experience-web', src: 'assets/audio/sessions/coros.mp3', dest: 'audio/coros.mp3' },
    { owner: 'belentani7', repo: 'judas-experience-web', src: 'assets/audio/sessions/mixA.mp3', dest: 'audio/mixA.mp3' },
    { owner: 'belentani7', repo: 'judas-experience-web', src: 'assets/audio/sessions/coro_hi.mp3', dest: 'audio/coro_hi.mp3' },
    { owner: 'belentani7', repo: 'judas-experience-web', src: 'assets/audio/sessions/violin_m.mp3', dest: 'audio/violin_m.mp3' },
    { owner: 'belentani7', repo: 'judas-experience-web', src: 'assets/judas-key-art-planeta-diamante.png', dest: 'images/judas-key-art.png' },
    { owner: 'belentani7', repo: 'judas-experience-web', src: 'assets/lore-portal-preview.png', dest: 'images/lore-portal-preview.png' },

    // belentani-omega-immersive-portal
    { owner: 'belentani7', repo: 'belentani-omega-immersive-portal', src: 'assets/media/judas-hero.mp4', dest: 'video/judas-hero.mp4' },
    { owner: 'belentani7', repo: 'belentani-omega-immersive-portal', src: 'assets/media/judas-poster.webp', dest: 'images/judas-poster.webp' },
    { owner: 'belentani7', repo: 'belentani-omega-immersive-portal', src: 'img/diamond_scene.png', dest: 'images/diamond_scene.png' },
  ];

  for (const a of assets) {
    await downloadFromRepo(a.owner, a.repo, a.src, path.join(ASSETS_DIR, a.dest));
  }

  console.log('\nDone! Assets saved to public/assets/');
}

main();