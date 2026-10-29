import { expect, test } from '@playwright/test';

const marketingRoutes = [
  ['Judas Era', '/judas-era'],
  ['Artista', '/artista'],
  ['Prensa', '/prensa'],
  ['Música', '/musica'],
  ['Galaxia', '/galaxia'],
] as const;

test('every marketing destination returns a real document instead of a 404', async ({ request }) => {
  for (const [, destination] of marketingRoutes) {
    const response = await request.get(destination);
    expect(response.status(), `Broken route ${destination}`).toBe(200);
    expect(response.headers()['content-type']).toContain('text/html');
    const html = await response.text();
    expect(html, `Empty page at ${destination}`).toMatch(/<main[\s>]/i);
  }
});

test('marketing menu on mobile opens, exposes real destinations and closes after clicking', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/artista');

  const toggle = page.getByRole('button', { name: 'Abrir menú' });
  await expect(toggle).toBeVisible();
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  await toggle.click();

  const menu = page.getByRole('navigation', { name: 'Navegación móvil' });
  await expect(menu).toBeVisible();

  for (const [label, destination] of marketingRoutes) {
    await expect(menu.getByRole('link', { name: label, exact: true })).toHaveAttribute('href', destination);
  }

  await menu.getByRole('link', { name: 'Música', exact: true }).click();
  await expect(page).toHaveURL(/\/musica\/?$/);
  await expect(menu).toBeHidden();
  await expect(page.getByRole('button', { name: 'Abrir menú' })).toHaveAttribute('aria-expanded', 'false');
});

test('desktop marketing navigation shows the same destinations without mobile toggle', async ({ page }) => {
  await page.setViewportSize({ width: 1366, height: 768 });
  await page.goto('/artista');

  const desktop = page.locator('header nav').first();
  await expect(desktop).toBeVisible();

  for (const [label, destination] of marketingRoutes) {
    await expect(desktop.getByRole('link', { name: label, exact: true })).toHaveAttribute('href', destination);
  }
  await expect(page.getByRole('button', { name: 'Abrir menú' })).toBeHidden();
});

test('keyboard users can skip the marketing navigation directly to the main content', async ({ page }) => {
  await page.goto('/artista');
  const skip = page.getByRole('link', { name: 'Saltar al contenido' });
  await page.keyboard.press('Tab');
  await expect(skip).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/\/artista\/?(?:#contenido)?$/);
  await expect(page.locator('main#contenido')).toBeFocused();
  await expect(page.locator('main#contenido')).toBeVisible();
});
