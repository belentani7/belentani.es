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
  expect(data.total).toBe(11);
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
