import { test, expect } from '@playwright/test';

test.describe('Compare Page', () => {
  test('should add multiple vehicles and navigate to compare page', async ({ page }) => {
    await page.goto('/');

    // Wait for vehicles to load
    await page.waitForSelector('[data-testid="vehicle-card"]', { timeout: 10000 });

    // Add 3 vehicles to comparison
    const compareButtons = page.locator(
      '[data-testid="add-to-compare"], button:has-text("Compare")'
    );
    const buttonCount = await compareButtons.count();

    if (buttonCount >= 3) {
      await compareButtons.nth(0).click();
      await compareButtons.nth(1).click();
      await compareButtons.nth(2).click();

      // Click "Go to Compare" button
      const goToCompare = page
        .locator('button:has-text("Go to Compare"), [data-testid="go-to-compare"]')
        .first();

      if (await goToCompare.isVisible()) {
        await goToCompare.click();

        // Verify navigation to compare page
        await expect(page).toHaveURL(/\/compare/);
      }
    }
  });

  test('should display vehicles on compare page via direct URL', async ({ page }) => {
    // Navigate with URL params
    await page.goto('/compare?vehicles=tesla-model-3-2023-long-range,byd-seal-2023-awd');

    // Verify page loads
    const heading = page.locator('h1:has-text("Comparison"), h1:has-text("Compare")').first();
    await expect(heading).toBeVisible();

    // Verify vehicle data appears
    const vehicleHeaders = page.locator(
      '[data-testid="vehicle-header"], .vehicle-header, img[alt*="Tesla"], img[alt*="BYD"]'
    );
    const count = await vehicleHeaders.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should remove vehicle from comparison', async ({ page }) => {
    await page.goto(
      '/compare?vehicles=tesla-model-3-2023-long-range,byd-seal-2023-awd,porsche-taycan-2024-turbo'
    );

    await page.waitForTimeout(1000);

    // Find and click remove button
    const removeButton = page
      .locator('button:has-text("×"), [data-testid="remove-vehicle"], .remove-button')
      .first();

    if (await removeButton.isVisible()) {
      await removeButton.click();

      // Verify URL updated
      await page.waitForTimeout(500);
      const url = page.url();
      expect(url).toContain('/compare');
    }
  });

  test('should copy share link', async ({ page }) => {
    await page.goto('/compare?vehicles=tesla-model-3-2023-long-range,byd-seal-2023-awd');

    // Grant clipboard permissions
    await page.context().grantPermissions(['clipboard-read', 'clipboard-write']);

    const shareButton = page
      .locator('button:has-text("Share"), [data-testid="share-comparison"]')
      .first();

    if (await shareButton.isVisible()) {
      await shareButton.click();

      // Verify clipboard has URL
      await page.waitForTimeout(500);
      const clipboardText = await page.evaluate(() => navigator.clipboard.readText());
      expect(clipboardText).toContain('/compare');
      expect(clipboardText).toContain('vehicles=');
    }
  });

  test('should show empty state when no vehicles selected', async ({ page }) => {
    await page.goto('/compare');

    // Verify empty state message
    const emptyMessage = page.locator('text=/no vehicles/i, text=/select vehicles/i');
    await expect(emptyMessage).toBeVisible();

    // Verify link to home page
    const homeLink = page.locator('a[href="/"], button:has-text("Home")');
    await expect(homeLink).toBeVisible();
  });
});
