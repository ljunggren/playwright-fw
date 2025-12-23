import { test, expect } from '../fixtures/test-fixtures';

test.describe('Test Data Cleanup (UI-based)', () => {
    /**
     * This utility deletes articles by navigating through the Global Feed UI.
     * Since the API doesn't return boozang articles, we use the UI to find and delete them.
     */
    test('Cleanup: Remove all boozang articles via UI', async ({ page, apiToken }) => {
        console.log('--- CLEANUP START: Navigating to home page ---');

        let deletedCount = 0;
        const maxAttempts = 20; // Safety limit

        for (let attempt = 0; attempt < maxAttempts; attempt++) {
            // Navigate to home and wait for page to load
            await page.goto('/');
            await page.waitForTimeout(2000);

            // Ensure we're on Global Feed tab
            const globalFeedTab = page.locator('.feed-toggle .nav-link', { hasText: 'Global Feed' });
            if (!(await globalFeedTab.getAttribute('class'))?.includes('active')) {
                await globalFeedTab.click();
                await page.waitForTimeout(1000);
            }

            // Find all articles by "boozang"
            const boozangArticles = await page.locator('.article-preview').filter({
                has: page.locator('.author', { hasText: 'boozang' })
            }).all();

            if (boozangArticles.length === 0) {
                console.log('--- No more articles by boozang found in Global Feed ---');
                break;
            }

            console.log(`--- Found ${boozangArticles.length} articles by boozang (attempt ${attempt + 1}) ---`);

            // Click on the first article
            const firstArticle = boozangArticles[0];
            const title = await firstArticle.locator('h1').textContent();
            console.log(`--- Opening article: "${title}" ---`);

            await firstArticle.locator('h1').click();
            await page.waitForLoadState('networkidle');
            await page.waitForTimeout(1000);

            // Look for delete button with multiple selectors
            const deleteButton = page.locator('button').filter({ hasText: /Delete Article/i }).first();

            if (await deleteButton.isVisible({ timeout: 3000 })) {
                console.log(`--- Deleting: "${title}" ---`);
                await deleteButton.click();

                // Wait for redirect to home
                await page.waitForURL('/', { timeout: 5000 });
                deletedCount++;
                console.log(`--- Successfully deleted ${deletedCount} articles so far ---`);
            } else {
                console.log(`--- Delete button not visible for "${title}" ---`);
                console.log('--- This article may not be owned by the current user ---');

                // Check what buttons ARE visible
                const allButtons = await page.locator('button').allTextContents();
                console.log(`--- Available buttons: ${allButtons.join(', ')} ---`);

                // If we can't delete this article, we can't delete any of them
                console.log('--- Stopping cleanup - articles not owned by current user ---');
                break;
            }
        }

        console.log(`\n--- CLEANUP COMPLETE: Deleted ${deletedCount} articles ---`);

        if (deletedCount === 0) {
            console.log('--- NOTE: No articles were deleted. They may not be owned by the current user. ---');
        }
    });
});
