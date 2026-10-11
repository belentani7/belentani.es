import { chromium } from 'playwright';
import fs from 'node:fs/promises';

await fs.mkdir('.local-archive/verification', { recursive: true });
const browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--enable-webgl', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
const report = [];
const base = process.env.EXPERIENCE_URL || 'http://localhost:3017';
try {
  for (const [width, height] of [[1440, 900], [390, 844]]) {
    const page = await browser.newPage({ viewport: { width, height } });
    const errors = [];
    const badResponses = [];
    page.on('pageerror', (error) => errors.push(error.message));
    page.on('response', (r) => { if (r.status() >= 400) badResponses.push(`${r.status()} ${r.url()}`); });

    await page.goto(base + '/', { waitUntil: 'networkidle', timeout: 60000 });
    const iframe = page.locator('iframe');
    await iframe.waitFor({ state: 'visible', timeout: 30000 });
    const firstWorld = await iframe.getAttribute('src');
    if (!firstWorld) throw new Error('Home iframe has no src');

    await page.getByRole('button', { name: 'Máquina' }).click();
    await page.getByRole('textbox', { name: 'Comando de la máquina' }).waitFor({ timeout: 10000 });
    await page.getByRole('textbox', { name: 'Comando de la máquina' }).fill('WARP judas');
    await page.getByRole('button', { name: 'ENTER' }).click();
    await page.waitForFunction(() => document.querySelector('iframe')?.getAttribute('src')?.includes('/judas'), null, { timeout: 15000 });
    const warpedWorld = await iframe.getAttribute('src');
    const hasPlaceParam = page.url().includes('lugar=judas');

    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth);
    await page.screenshot({ path: `.local-archive/verification/experience-${width}.png`, fullPage: true });
    report.push({ width, height, firstWorld, warpedWorld, hasPlaceParam, overflow, errors, badResponses });
    if (!warpedWorld?.includes('/judas') || !hasPlaceParam || overflow || errors.length || badResponses.length) {
      throw new Error(JSON.stringify(report, null, 2));
    }
    await page.close();
  }

  const page = await browser.newPage({ reducedMotion: 'reduce' });
  await page.goto(base + '/judas-era');
  await page.getByRole('heading', { name: 'JUDAS ERA', exact: true }).waitFor();
  for (const route of ['/artist', '/musica', '/prensa', '/galaxia', '/maquina', '/judas']) {
    const response = await page.goto(base + route);
    if (response.status() !== 200) throw new Error(`Failed route ${route}`);
  }
  console.log(JSON.stringify(report, null, 2));
} finally {
  await fs.writeFile('.local-archive/verification/report.json', JSON.stringify(report, null, 2));
  await browser.close();
}
