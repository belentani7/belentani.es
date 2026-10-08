import { test, expect } from '@playwright/test';

test('search engines receive public routes and robots directives', async ({ request }) => {
  const robots = await request.get('/robots.txt');
  expect(robots.status()).toBe(200);
  expect(await robots.text()).toContain('Sitemap: https://belentani.es/sitemap.xml');
  const sitemap = await request.get('/sitemap.xml');
  expect(sitemap.status()).toBe(200);
  const xml = await sitemap.text();
  expect(xml).toContain('<loc>https://belentani.es/judas</loc>');
  expect(xml).not.toContain('/api/');
  expect(xml).not.toContain('/mundos/');
});

for (const path of ['/pagina-inexistente-verificacion', '/judas/capitulo-inexistente-verificacion']) {
  test(`missing route returns 404 and usable recovery links: ${path}`, async ({ page }) => {
    const response = await page.goto(path);
    expect(response?.status()).toBe(404);
    await expect(page.getByRole('heading', { name: 'Esta página no existe' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Música', exact: true })).toHaveAttribute('href', '/musica');
    await page.getByRole('link', { name: 'Inicio', exact: true }).click();
    await expect(page).toHaveURL('/');
  });
}
