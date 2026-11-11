import { expect, test } from '@playwright/test';

test('the Echo and Strings archive is readable and linked to the living terminal', async ({ page, request }) => {
  const response = await request.get('/lore');
  expect(response.status()).toBe(200);

  await page.goto('/lore');
  await expect(page.getByRole('heading', { name: /EL ECO.*Y LAS CUERDAS/i })).toBeVisible();
  await expect(page.getByText(/0,000000000000562000/)).toBeVisible();
  await expect(page.getByText(/MITO DE CIENCIA FICCIÓN/).last()).toBeVisible();
  await expect(page.getByRole('link', { name: /ENTRAR EN ANTIGRAVITY/i })).toHaveAttribute('href', '/maquina');
});

test('ANTIGRAVITY terminal opens the myth with working commands', async ({ page }) => {
  const runtimeErrors: string[] = [];
  page.on('pageerror', (error) => runtimeErrors.push(error.message));

  await page.goto('/maquina');
  await expect(page.getByRole('region', { name: /ANTIGRAVITY, terminal narrativa interactiva/i })).toBeVisible();
  await expect(page.getByRole('region', { name: /ANTIGRAVITY, terminal narrativa interactiva/i }).getByText('ANTIGRAVITY · ALIVE MACHINE', { exact: true })).toBeVisible();

  await page.getByRole('button', { name: 'ECHO', exact: true }).click();
  await expect(page.getByRole('heading', { name: /El Eco.*Lo que puede ser/i })).toBeVisible();
  await expect(page.getByText(/galaxia hermana/i).first()).toBeVisible();

  await page.getByRole('button', { name: 'STRINGS', exact: true }).click();
  await expect(page.getByText(/el sonido ordinario necesita un medio material/i).last()).toBeVisible();
  expect(runtimeErrors, 'ANTIGRAVITY should not crash while navigating its myth').toEqual([]);
});
