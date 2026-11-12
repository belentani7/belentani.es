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


test('homepage links retain readable contrast, touch targets and visible brand names', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('link', { name: /^B7.*página del artista/i })).toBeVisible();
  const listen = page.getByRole('link', { name: 'Escuchar', exact: true });
  const appearance = await listen.evaluate((element) => {
    const style = getComputedStyle(element);
    const luminance = (rgb: string) => {
      const values = rgb.match(/[\d.]+/g)!.slice(0, 3).map(Number).map(value => {
        const channel = value / 255;
        return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
      });
      return values[0] * 0.2126 + values[1] * 0.7152 + values[2] * 0.0722;
    };
    const foreground = luminance(style.color);
    const background = luminance(style.backgroundColor);
    return {
      contrast: (Math.max(foreground, background) + 0.05) / (Math.min(foreground, background) + 0.05),
      height: element.getBoundingClientRect().height,
    };
  });
  expect(appearance.contrast).toBeGreaterThanOrEqual(4.5);
  expect(appearance.height).toBeGreaterThanOrEqual(44);
});
