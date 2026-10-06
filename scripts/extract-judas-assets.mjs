import { chromium } from 'playwright';
import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';

const origin = 'https://judas-experience-13898.buildaispace.app/';
const archive = path.resolve('.local-archive/judas-canon');
await fs.mkdir(archive, { recursive: true });
const browser = await chromium.launch({ headless: true, channel: 'chrome' });
const page = await browser.newPage();
const assets = [];
const pending = [];
const seen = new Set();
page.on('response', (response) => {
  const type = response.headers()['content-type'] || '';
  const url = response.url();
  if (!/image|font|css|javascript|json/.test(type) || /audio|video/.test(type) || seen.has(url)) return;
  seen.add(url);
  pending.push((async () => {
    try {
      if (!response.ok()) return;
      const bytes = await response.body();
      if (bytes.length > 20_000_000) return;
      const ext = path.extname(new URL(url).pathname).slice(0, 10) || '.bin';
      const name = crypto.createHash('sha256').update(bytes).digest('hex').slice(0, 20) + ext;
      await fs.writeFile(path.join(archive, name), bytes);
      const cleanUrl = new URL(url); cleanUrl.search = ''; cleanUrl.hash = '';
      assets.push({ file: name, type, origin: cleanUrl.href, bytes: bytes.length, use: type.startsWith('image') ? 'visual reference, review before publication' : 'historical reference only' });
    } catch { /* Failed responses are omitted, never invented. */ }
  })());
});
let status;
let design;
let error;
try {
  status = (await page.goto(origin, { waitUntil: 'domcontentloaded', timeout: 45000 }))?.status();
  await page.waitForTimeout(8000);
  design = await page.evaluate(() => ({ title: document.title, text: document.body.innerText.slice(0, 12000), styles: [...document.querySelectorAll('body *')].slice(0, 500).map((el) => { const css = getComputedStyle(el); return { font: css.fontFamily, color: css.color, background: css.backgroundColor }; }), classes: [...new Set([...document.querySelectorAll('[class]')].map((el) => el.getAttribute('class')))].slice(0, 150) }));
  for (const [width, height] of [[1920, 1080], [1440, 900], [390, 844]]) {
    await page.setViewportSize({ width, height });
    await page.screenshot({ path: path.join(archive, `canon-${width}.png`), fullPage: true });
  }
} catch (reason) { error = String(reason); }
await Promise.allSettled(pending);
await browser.close();
await fs.writeFile(path.join(archive, 'manifest.json'), JSON.stringify({ origin, captured: new Date().toISOString(), status, error, assets, design }, null, 2));
console.log(JSON.stringify({ status, error, assets: assets.length, archive }));
