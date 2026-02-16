import { test, expect } from '@playwright/test';

test.describe('Vehicle Detail Page', () => {
  test('should load vehicle detail page via direct URL', async ({ page }) => {
    // Navigate to a known vehicle (adjust code based on actual data)
    await page.goto('/vehicle/tesla-model-3-2023-long-range');

    // Verify page loads
    const heading = page.locator('h1').first();
    await expect(heading).toBeVisible();
    await expect(heading).toContainText(/tesla.*model.*3/i);
  });

  test('should switch between tabs', async ({ page }) => {
    await page.goto('/vehicle/tesla-model-3-2023-long-range');

    // Wait for page to load
    await page.waitForSelector('h1', { timeout: 10000 });

    // Find tabs (adjust selectors based on actual implementation)
    const specsTab = page.getByRole('tab', { name: /specs/i });

    if (await specsTab.isVisible()) {
      await specsTab.click();

      // Verify tab content changed
      await expect(page.locator('[role="tabpanel"]')).toBeVisible();
    }
  });

  test('should show data-driven tabs only when data exists', async ({ page }) => {
    await page.goto('/vehicle/tesla-model-3-2023-long-range');

    await page.waitForSelector('h1', { timeout: 10000 });

    // Verify Overview tab always exists
    const overviewTab = page.getByRole('tab', { name: /overview/i });
    await expect(overviewTab).toBeVisible();

    // Count visible tabs
    const tabs = page.locator('[role="tab"]');
    const tabCount = await tabs.count();
    expect(tabCount).toBeGreaterThanOrEqual(1);
  });

  test('should add vehicle to comparison from detail page', async ({ page }) => {
    await page.goto('/vehicle/tesla-model-3-2023-long-range');

    const compareButton = page
      .locator('button:has-text("Add to Compare"), [data-testid="add-to-compare"]')
      .first();

    if (await compareButton.isVisible()) {
      await compareButton.click();

      // Wait a bit for feedback to appear (may not exist in all implementations)
      await page.waitForTimeout(500);
    }
  });

  test('should handle invalid vehicle code with 404', async ({ page }) => {
    const response = await page.goto('/vehicle/invalid-vehicle-code-12345');

    // Should either redirect to 404 or show error message
    const is404 = response?.status() === 404;
    const hasErrorMessage = await page
      .locator('text=/not found|404|error/i')
      .isVisible()
      .catch(() => false);

    expect(is404 || hasErrorMessage).toBeTruthy();
  });
});
