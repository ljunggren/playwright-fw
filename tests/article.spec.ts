// tests/article.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Article view', () => {
  
  // No login needed here! The browser starts authenticated.
  
  test('User can view an article and verify comments', async ({ page }) => {
    await page.goto('/article/Test-42244');
    await expect(page.locator('.card').first()).toBeVisible();
  });

});