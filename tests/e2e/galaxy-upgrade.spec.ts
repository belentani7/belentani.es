import { expect, test } from '@playwright/test';

test('galaxy navigation remains usable after Three.js dependency upgrades', async ({ page }) => {
  const runtimeErrors: string[] = [];
  page.on('pageerror', (error) => runtimeErrors.push(error.message));

  await page.goto('/');

  await expect(page.getByRole('heading', { level: 1, name: /atraviesa.*la galaxia/i })).toBeVisible();
  await expect(page.getByRole('link', { name: /escuchar la obra/i })).toHaveAttribute('href', '/musica');
  await expect(page.getByRole('navigation', { name: 'Sistemas de la galaxia' })).toBeAttached();

  const activate = page.getByRole('button', { name: /explorar en 3d/i });
  await expect(activate).toBeVisible();
  await activate.click();

  const mode = await page.getByRole('button', { name: /volver a modo ligero|explorar en 3d/i }).getAttribute('aria-pressed');
  if (mode === 'true') {
    await expect(page.getByTestId('galaxy-3d-scene').locator('canvas')).toBeAttached({ timeout: 15_000 });
    await expect(page.getByRole('button', { name: /volver a modo ligero/i })).toBeVisible();
  } else {
    await expect(page.getByRole('status').filter({ hasText: /este navegador no ofrece webgl/i })).toBeVisible();
  }

  await expect(page.getByRole('navigation', { name: 'Sistemas de la galaxia' })).toBeAttached();
  expect(runtimeErrors, 'The galaxy should not crash at runtime').toEqual([]);
});
