import { test, expect } from '../fixtures/test-fixtures';

/**
 * Helper function to wait for articles to finish loading.
 * Waits until either articles appear or "No articles" message is shown.
 */
async function waitForArticlesToLoad(page: import('@playwright/test').Page) {
    // Wait for the loading state to clear - either articles load or we get empty state
    await page.waitForFunction(() => {
        const loadingText = document.body.innerText.includes('Loading articles...');
        const hasArticles = document.querySelectorAll('.article-preview').length > 0;
        const noArticles = document.body.innerText.includes('No articles are here');
        return !loadingText || hasArticles || noArticles;
    }, { timeout: 10000 });
}

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
            // Navigate to home and wait for articles to actually load
            await page.goto('/');
            await waitForArticlesToLoad(page);

            // Ensure we're on Global Feed tab
            const globalFeedTab = page.locator('.feed-toggle .nav-link', { hasText: 'Global Feed' });
            if (!(await globalFeedTab.getAttribute('class'))?.includes('active')) {
                await globalFeedTab.click();
                await waitForArticlesToLoad(page);
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
