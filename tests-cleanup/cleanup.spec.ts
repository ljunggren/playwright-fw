import { test, expect } from '../fixtures/test-fixtures';

test.describe('Test Data Cleanup', () => {
    /**
     * This utility "test" removes all articles belonging to the current test user.
     * 
     * NOTE: The Conduit API endpoint /api/articles?author=username doesn't reliably
     * return articles by the specified author. For a more reliable cleanup, use
     * tests/cleanup-ui.spec.ts which deletes articles via the UI.
     * 
     * This API-based approach will work for articles created in the same test session.
     */
    test('Cleanup: Remove all articles for current user', async ({
        page,
        apiToken
    }) => {
        console.log('--- CLEANUP START: Identifying articles to delete ---');

        // 1. Get current user info using browser context
        const userResponse = await page.request.get('https://conduit-api.bondaracademy.com/api/user', {
            headers: { Authorization: `Token ${apiToken}` }
        });
        expect(userResponse.ok()).toBeTruthy();
        const userData = await userResponse.json();
        const username = userData.user.username;
        console.log(`--- Identifying articles for user: ${username} ---`);

        // 2. Fetch articles from global feed using browser context
        // NOTE: Using page.request ensures we get the same data the browser sees
        console.log(`--- Fetching global feed to find articles by ${username} ---`);
        const articlesResponse = await page.request.get('https://conduit-api.bondaracademy.com/api/articles?limit=100');
        expect(articlesResponse.ok()).toBeTruthy();
        const body = await articlesResponse.json();

        // Filter to only articles by the current user
        const articles = body.articles.filter((article: any) => article.author.username === username);

        console.log(`--- Found ${articles.length} articles to delete. ---`);

        // 3. Delete each article
        for (const article of articles) {
            console.log(`--- Deleting: ${article.title} (${article.slug}) ---`);
            const deleteResponse = await page.request.delete(`https://conduit-api.bondaracademy.com/api/articles/${article.slug}`, {
                headers: { Authorization: `Token ${apiToken}` }
            });
            expect(deleteResponse.ok()).toBeTruthy();
        }

        console.log('--- CLEANUP COMPLETE: Environment is clean. ---');
    });
});
