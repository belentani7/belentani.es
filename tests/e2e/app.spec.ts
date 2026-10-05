import { test, expect } from '@playwright/test';

test.describe('Galaxy Map Navigation', () => {
  test('loads galaxy map and shows all nodes', async ({ page }) => {
    await page.goto('/galaxia');
    await expect(page.locator('canvas')).toBeVisible();
    await expect(page.locator('text=BELENTANI')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('text=JUDAS')).toBeVisible();
    await expect(page.locator('text=OMEGA')).toBeVisible();
    await expect(page.locator('text=NEON')).toBeVisible();
    await expect(page.locator('text=DUCK')).toBeVisible();
  });

  test('keyboard navigation cycles nodes', async ({ page }) => {
    await page.goto('/galaxia');
    await page.waitForTimeout(2000);
    await page.keyboard.press('ArrowRight');
    await expect(page.locator('[data-node="judas"]')).toHaveClass(/active/);
    await page.keyboard.press('ArrowRight');
    await expect(page.locator('[data-node="omega"]')).toHaveClass(/active/);
  });

  test('Enter travels to node and opens dock', async ({ page }) => {
    await page.goto('/galaxia');
    await page.waitForTimeout(2000);
    await page.keyboard.press('ArrowRight');
    await page.keyboard.press('Enter');
    await expect(page.locator('[data-dock="judas"]')).toBeVisible();
    await expect(page.locator('text=ERA JUDAS')).toBeVisible();
  });

  test('Escape returns to belentani center', async ({ page }) => {
    await page.goto('/galaxia');
    await page.waitForTimeout(2000);
    await page.keyboard.press('ArrowRight');
    await page.keyboard.press('Enter');
    await page.keyboard.press('Escape');
    await expect(page.locator('[data-node="belentani"]')).toHaveClass(/active/);
  });
});

test.describe('JUDAS Chapters', () => {
  const chapters = ['genesis', 'traicion', 'deuda', 'redencion', 'biblia-musica', 'qwen-perfil'];

  for (const chapter of chapters) {
    test(`loads ${chapter} chapter with canvas`, async ({ page }) => {
      await page.goto(`/judas/${chapter}`);
      await expect(page.locator('canvas')).toBeVisible({ timeout: 15000 });
      await expect(page.locator(`text=${chapter.charAt(0).toUpperCase() + chapter.slice(1)}`)).toBeVisible();
    });
  }

  test('chapter navigation works', async ({ page }) => {
    await page.goto('/judas/genesis');
    await page.waitForTimeout(2000);
    await page.click('button:has-text("Siguiente")');
    await expect(page).toHaveURL('/judas/traicion');
  });

  test('audio player renders', async ({ page }) => {
    await page.goto('/judas/genesis');
    await expect(page.locator('audio')).toBeVisible();
  });
});

test.describe('Marketing Pages', () => {
  test('landing page loads with hero', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1:has-text("BELENTANI")')).toBeVisible();
    await expect(page.locator('text=Artista alternativo')).toBeVisible();
  });

  test('artista page loads', async ({ page }) => {
    await page.goto('/artista');
    await expect(page.locator('h1:has-text("BELENTANI")')).toBeVisible();
    await expect(page.locator('text=Booking')).toBeVisible();
  });

  test('prensa page loads', async ({ page }) => {
    await page.goto('/prensa');
    await expect(page.locator('h1:has-text("Press Kit")')).toBeVisible();
    await expect(page.locator('text=432 Hz')).toBeVisible();
  });

  test('musica page loads', async ({ page }) => {
    await page.goto('/musica');
    await expect(page.locator('h1:has-text("Música")')).toBeVisible();
    await expect(page.locator('text=JUDAS (Era Ω)')).toBeVisible();
  });
});

test.describe('AI Services', () => {
  test('lore chat endpoint responds', async ({ page }) => {
    const response = await page.request.post('/api/ai/lore-chat', {
      data: { messages: [{ role: 'user', content: 'Hola' }], context: 'judas' },
    });
    expect(response.ok()).toBeTruthy();
    const text = await response.text();
    expect(text.length).toBeGreaterThan(0);
  });

  test('lyric analysis endpoint responds', async ({ page }) => {
    const response = await page.request.post('/api/ai/lyric-analysis', {
      data: { lyrics: 'Test lyrics', context: 'biblia' },
    });
    expect(response.ok()).toBeTruthy();
  });

  test('prompt opt endpoint responds', async ({ page }) => {
    const response = await page.request.post('/api/ai/prompt-opt', {
      data: { prompt: 'cinematic mirror in desert' },
    });
    expect(response.ok()).toBeTruthy();
  });
});