import { test, expect } from '@playwright/test';

test.describe('Home Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Wait for data to load
    await page.waitForSelector('[data-testid="vehicle-card"]', { timeout: 10000 });
  });

  test('should display vehicle cards', async ({ page }) => {
    const cards = page.locator('[data-testid="vehicle-card"]');
    await expect(cards.first()).toBeVisible();
  });

  test('should search for vehicles', async ({ page }) => {
    const searchInput = page.getByPlaceholder(/search/i);
    await searchInput.fill('Tesla');

    // Wait for search results
    await page.waitForTimeout(500);

    const cards = page.locator('[data-testid="vehicle-card"]');
    const count = await cards.count();
    expect(count).toBeGreaterThan(0);

    // Verify Tesla appears in results
    const firstCard = cards.first();
    await expect(firstCard).toContainText('Tesla');
  });

  test('should filter vehicles by make', async ({ page }) => {
    // Open filters
    const filterButton = page.getByRole('button', { name: /filter/i });
    if (await filterButton.isVisible()) {
      await filterButton.click();
    }

    // Select a make (adjust selector based on actual implementation)
    const makeFilter = page.locator('select[name="make"], [data-testid="filter-make"]').first();
    if (await makeFilter.isVisible()) {
      await makeFilter.selectOption({ index: 1 });

      // Verify filtered results
      const cards = page.locator('[data-testid="vehicle-card"]');
      expect(await cards.count()).toBeGreaterThan(0);
    }
  });

  test('should add vehicle to comparison', async ({ page }) => {
    const compareButton = page
      .locator('[data-testid="add-to-compare"], button:has-text("Compare")')
      .first();

    if (await compareButton.isVisible()) {
      await compareButton.click();

      // Verify comparison indicator appears
      const comparisonBadge = page.locator('[data-testid="comparison-count"], .comparison-badge');
      await expect(comparisonBadge).toBeVisible();
    }
  });

  test('should navigate to vehicle detail', async ({ page }) => {
    const firstCard = page.locator('[data-testid="vehicle-card"]').first();
    await firstCard.click();

    // Verify navigation to detail page
    await expect(page).toHaveURL(/\/vehicle\/.+/);

    // Verify detail page loaded
    const heading = page.locator('h1').first();
    await expect(heading).toBeVisible();
  });
});
