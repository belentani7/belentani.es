const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const { PNG } = require('pngjs');
const pixelmatch = require('pixelmatch');

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
const BASELINE_DIR = path.join(__dirname, '..', 'tests', 'visual', 'baselines');
const CURRENT_DIR = path.join(__dirname, '..', 'tests', 'visual', 'current');
const DIFF_DIR = path.join(__dirname, '..', 'tests', 'visual', 'diffs');

const views = [
  { name: 'galaxia', url: '/galaxia', selector: 'canvas', wait: 3000 },
  { name: 'judas-genesis', url: '/judas/genesis', selector: 'canvas', wait: 4000 },
  { name: 'judas-traicion', url: '/judas/traicion', selector: 'canvas', wait: 3000 },
  { name: 'judas-deuda', url: '/judas/deuda', selector: 'canvas', wait: 3000 },
  { name: 'judas-redencion', url: '/judas/redencion', selector: 'canvas', wait: 3000 },
  { name: 'judas-biblia-musica', url: '/judas/biblia-musica', selector: 'canvas', wait: 3000 },
  { name: 'judas-qwen-perfil', url: '/judas/qwen-perfil', selector: 'canvas', wait: 3000 },
];

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

async function capture(page, name) {
  await page.waitForTimeout(1000);
  const canvas = await page.$(views.find(v => v.name === name)?.selector || 'canvas');
  if (!canvas) throw new Error(`Canvas not found for ${name}`);
  return await canvas.screenshot({ type: 'png' });
}

function compareImages(baselinePath, currentPath, diffPath) {
  const baseline = PNG.sync.read(fs.readFileSync(baselinePath));
  const current = PNG.sync.read(fs.readFileSync(currentPath));
  const { width, height } = baseline;
  const diff = new PNG({ width, height });

  const mismatches = pixelmatch(baseline.data, current.data, diff.data, width, height, {
    threshold: 0.1,
    includeAA: true,
  });

  fs.writeFileSync(diffPath, PNG.sync.write(diff));
  const ratio = mismatches / (width * height);
  return { mismatches, ratio, pass: ratio < 0.001 };
}

async function main() {
  ensureDir(BASELINE_DIR);
  ensureDir(CURRENT_DIR);
  ensureDir(DIFF_DIR);

  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });

  let allPassed = true;

  for (const view of views) {
    console.log(`\nTesting ${view.name}...`);
    try {
      await page.goto(`${BASE_URL}${view.url}`, { waitUntil: 'networkidle' });
      await page.waitForTimeout(view.wait);

      const screenshot = await capture(page, view.name);
      const currentPath = path.join(CURRENT_DIR, `${view.name}.png`);
      fs.writeFileSync(currentPath, screenshot);

      const baselinePath = path.join(BASELINE_DIR, `${view.name}.png`);
      if (!fs.existsSync(baselinePath)) {
        fs.copyFileSync(currentPath, baselinePath);
        console.log(`  Created baseline for ${view.name}`);
        continue;
      }

      const diffPath = path.join(DIFF_DIR, `${view.name}-diff.png`);
      const result = compareImages(baselinePath, currentPath, diffPath);
      console.log(`  ${result.pass ? '✓ PASS' : '✗ FAIL'} — ${(result.ratio * 100).toFixed(4)}% diff (${result.mismatches} pixels)`);

      if (!result.pass) allPassed = false;
    } catch (e) {
      console.error(`  ✗ ERROR: ${e.message}`);
      allPassed = false;
    }
  }

  await browser.close();
  process.exit(allPassed ? 0 : 1);
}

main();