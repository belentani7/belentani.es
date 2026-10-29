import { expect, test } from '@playwright/test';

test('artist page puts the work first, with a single main landmark and verified routes', async ({ page }) => {
  await page.goto('/artista');

  await expect(page.getByRole('main')).toHaveCount(1);
  await expect(page.getByRole('heading', { level: 1, name: 'Belentani.' })).toBeVisible();
  await expect(page.getByRole('img', { name: 'Retrato artístico de Belentani' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'La música primero.' })).toBeVisible();
  await expect(page.getByRole('link', { name: /Escuchar la música/i })).toHaveAttribute('href', '/musica');
  await expect(page.getByRole('link', { name: /Descubrir JUDAS/i })).toHaveAttribute('href', '/judas-era');

  // Historical catalog cautions explicitly exclude this malformed entry from promotion.
  await expect(page.getByText('Mon Amour (Remix 404 API Key not found)')).toHaveCount(0);
});

test('editorial press page provides biography and official contact without fabricated details', async ({ page }) => {
  await page.goto('/prensa');

  await expect(page.getByRole('main')).toHaveCount(1);
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Una obra hecha');
  await expect(page.getByRole('heading', { name: 'Canales oficiales' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Instagram' })).toHaveAttribute('href', 'https://www.instagram.com/belentani_/');
  await expect(page.getByRole('link', { name: 'Spotify' })).toHaveAttribute('href', /open.spotify.com\/artist\//);
});

test('mobile visitors can navigate from the artist profile to press', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/artista');
  await page.getByRole('link', { name: /Prensa y contacto/i }).click();
  await expect(page).toHaveURL(/\/prensa\/?$/);
  await expect(page.getByRole('heading', { name: 'Canales oficiales' })).toBeVisible();
});
