import { expect, test } from '@playwright/test';

test('mobile visitors can open and use the full navigation without WebGL', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  const nav = page.getByRole('navigation', { name: 'Navegación móvil' });
  await expect(nav).toBeHidden();
  await page.locator('header summary').click();
  await expect(nav).toBeVisible();
  await expect(nav.getByRole('link', { name: 'JUDAS', exact: true })).toHaveAttribute('href', '/judas');
  await expect(nav.getByRole('link', { name: 'NOIACORE', exact: true })).toHaveAttribute('href', '/consultoria');
  await nav.getByRole('link', { name: 'PLANETAS', exact: true }).click();
  await expect(page).toHaveURL(/#constelacion$/);
});
