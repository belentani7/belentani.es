import { chromium } from 'playwright';
import fs from 'node:fs/promises';
import { PNG } from 'pngjs';
import pixelmatch from 'pixelmatch';

await fs.mkdir('.local-archive/verification', { recursive: true });
const browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--enable-webgl', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
const report = [];
const base = process.env.EXPERIENCE_URL || 'http://localhost:3017';
try {
  for (const [width, height] of [[1440, 900], [390, 844]]) {
    const page = await browser.newPage({ viewport: { width, height } });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(base + '/', { waitUntil: 'networkidle', timeout: 60000 });
    await page.locator('canvas').waitFor({ state: 'visible', timeout: 30000 });
    await page.waitForTimeout(2000);
    const a = PNG.sync.read(await page.locator('canvas').screenshot());
    await page.waitForTimeout(800);
    const b = PNG.sync.read(await page.locator('canvas').screenshot());
    let lit = 0;
    for (let i = 0; i < a.data.length; i += 4) if (Math.max(a.data[i], a.data[i + 1], a.data[i + 2]) > 45) lit++;
    const movingPixels = pixelmatch(a.data, b.data, null, a.width, a.height, { threshold: 0.03 });
    await page.getByRole('button', { name: /La deuda/ }).click();
    if (!await page.getByRole('heading', { name: 'Hay puertas que no se olvidan.' }).isVisible()) throw new Error('Chapter navigation failed');
    await page.getByRole('button', { name: 'Reset to Canon 0' }).click();
    if (!await page.getByRole('heading', { name: 'Antes del nombre, la voz.' }).isVisible()) throw new Error('Canon reset failed');
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth);
    await page.screenshot({ path: `.local-archive/verification/experience-${width}.png`, fullPage: true });
    report.push({ width, height, litPixels: lit, movingPixels, overflow, errors });
    if (lit < 100 || movingPixels < 10 || overflow || errors.length) throw new Error(JSON.stringify(report));
    await page.close();
  }
  const page = await browser.newPage({ reducedMotion: 'reduce' });
  await page.goto(base + '/judas-era');
  await page.getByRole('heading', { name: 'JUDAS ERA', exact: true }).waitFor();
  for (const route of ['/artist', '/musica', '/prensa', '/galaxia']) {
    const response = await page.goto(base + route);
    if (response.status() !== 200) throw new Error(`Failed route ${route}`);
  }
  console.log(JSON.stringify(report));
} finally {
  await fs.writeFile('.local-archive/verification/report.json', JSON.stringify(report, null, 2));
  await browser.close();
}
