import { expect, test } from '@playwright/test';

test('the real Next.js homepage boots the artist computer, not the old galaxy', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveURL(/\/artist-os\/index\.html$/);
  await expect(page.getByRole('main', { name: 'Ordenador de navegación BELENTANI' })).toBeVisible();
  await expect(page.getByRole('heading', { level: 1, name: /Todo tiene/i })).toBeVisible();
  await page.locator('button.folder[data-zone="music"]').click();
  await expect(page.locator('.entry[href="../musica"]')).toBeVisible();
  await page.locator('button.folder[data-zone="world"]').click();
  await expect(page.locator('.entry[href="../atlas"]')).toBeVisible();
});

test('runtime catalog includes curated first-party destinations without local or Drive leaks', async ({ request }) => {
  const response = await request.get('/artist-os/catalog.json');
  expect(response.status()).toBe(200);
  const data = await response.json();
  expect(data.total).toBe(15);
  expect(data.items.every((item: {href: string}) => /^\.\.\/[a-z0-9/-]+(?:\.html)?$/.test(item.href))).toBe(true);
  expect(data.source).toBe('Curated first-party Next.js routes; not the private vault');
  expect(data.items.every((item: {kind: string}) => item.kind === 'page')).toBe(true);
  const base = 'https://belentani.es/artist-os/index.html';
  for (const entry of data.items as Array<{title: string; href: string}>) {
    const url = new URL(entry.href, base);
    expect(url.origin, 'Only same-origin artist destinations are public').toBe('https://belentani.es');
    const linked = await request.get(url.pathname);
    expect(linked.status(), 'Broken artist destination: ' + entry.title).toBe(200);
    expect(linked.headers()['content-type']).toContain('text/html');
  }
});

test('the legacy interactive atlas is preserved at its own route', async ({ page }) => {
  await page.goto('/atlas');
  await expect(page.getByRole('heading', { level: 1, name: /atraviesa.*la galaxia/i })).toBeVisible();
});

test('the original Sound Lab plays only after user activation and keeps a return route', async ({ page }) => {
  await page.goto('/artist-os/lab.html');
  await expect(page.getByRole('heading', { level: 1, name: /Haz sonar/i })).toBeVisible();
  await expect(page.getByRole('link', { name: /VOLVER AL ORDENADOR/i })).toHaveAttribute('href', './index.html#studio');
  await expect(page.locator('[data-note]')).toHaveCount(12);
  await page.getByRole('button', { name: 'ENCENDER AUDIO' }).click();
  await expect(page.getByRole('status')).toContainText('Audio listo');
  await page.getByRole('button', { name: 'INICIAR SECUENCIA' }).click();
  await expect(page.getByRole('button', { name: 'DETENER SECUENCIA' })).toBeVisible();
  await page.getByRole('button', { name: 'DETENER SECUENCIA' }).click();
});

test('the artist archive separates confirmed releases from work in development', async ({ page }) => {
  await page.goto('/archivo');
  await expect(page.getByRole('heading', {level:1,name:/La memoria también/i})).toBeVisible();
  await expect(page.getByRole('heading', {name:'Beautiful Skies'})).toBeVisible();
  await expect(page.getByRole('heading', {name:'Therapist / Terapeuta'})).toBeVisible();
  await expect(page.locator('article[data-status="draft"]')).toHaveCount(2);
  await expect(page.getByRole('heading', {name:'Cassandra'})).toBeVisible();
  await expect(page.getByRole('link', {name:/Escuchar la discografía/i})).toHaveAttribute('href','/musica');
});

test('PENTADA has five accessible, same-origin doors with keyboard navigation', async ({ page }) => {
  await page.goto('/artist-os/portal.html');
  await expect(page.getByRole('heading', { level: 1, name: /Las cinco puertas/i })).toBeVisible();
  await expect(page.locator('button[data-gem]')).toHaveCount(5);
  await expect(page.locator('#progress-count')).toHaveText('0 / 5');
  await page.locator('button[data-gem="1"]').click();
  await expect(page.locator('#detail-link')).toHaveAttribute('href', '../judas');
  await expect(page.locator('#progress-count')).toHaveText('1 / 5');
  await page.keyboard.press('3');
  await expect(page.locator('#detail-link')).toHaveAttribute('href', '../omega-cosmos.html');
  await expect(page.locator('#progress-count')).toHaveText('2 / 5');
  for (const i of [0, 3, 4]) await page.locator('button[data-gem="' + i + '"]').click();
  await expect(page.locator('#progress-count')).toHaveText('5 / 5');
  await expect(page.getByRole('status')).toContainText('PENTADA COMPLETA');
  await expect(page.getByRole('link', { name: 'REGRESAR A LA MÁQUINA' })).toHaveAttribute('href','./index.html');
});

test('OMEGA COSMOS from Drive is autonomous and retains first-party exits', async ({ request, page }) => {
  const response = await request.get('/omega-cosmos.html');
  expect(response.status()).toBe(200);
  expect(response.headers()['content-type']).toContain('text/html');
  const html = await response.text();
  expect(html).toContain('50 GALÁXIAS');
  expect(html).not.toContain('drive.google.com');
  expect(html).not.toContain('localStorage');
  expect(html).not.toContain('data:image/svg+xml');
  await page.goto('/omega-cosmos.html', { waitUntil: 'domcontentloaded', timeout: 45000 });
  await expect(page.locator('#world-canvas')).toHaveCount(1);
  await expect(page.locator('#galaxy-list')).toHaveCount(1);
  await expect(page.locator('a.identity')).toHaveAttribute('href', '/');
  await expect(page.locator('#classic-link')).toHaveAttribute('href', '/atlas');
});
