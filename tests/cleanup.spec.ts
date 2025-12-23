import { test, expect } from '../fixtures/test-fixtures';

test.describe('Test Data Cleanup', () => {
    /**
     * This utility "test" removes all articles belonging to the current test user.
     * It uses the synchronized apiToken for fast REST-based cleanup.
     */
    test('Cleanup: Remove all articles for current user', async ({
        dataFactory,
        apiToken
    }) => {
        console.log('--- CLEANUP START: Identifying articles to delete ---');

        // 1. Get articles for the user
        // We filter by author in a real scenario, but for Conduit public API we might just check ownership 
        // after fetching. For now, we'll fetch articles and attempt to delete them if they match our user
        // OR we just fetch the feed if possible.

        // Actually, the easiest way is to fetch the "Global Feed" but filtered by author.
        // We'll need the username. The apiToken fixture performs a login but doesn't return the username directly.
        // However, we can extract the username from the token payload (JWT) if needed, 
        // or just fetch /api/user to get current profile.

        const userResponse = await dataFactory.request.get('https://conduit-api.bondaracademy.com/api/user', {
            headers: { Authorization: `Token ${apiToken}` }
        });
        expect(userResponse.ok()).toBeTruthy();
        const userData = await userResponse.json();
        const username = userData.user.username;
        console.log(`--- Identifying articles for user: ${username} ---`);

        // 2. Fetch articles authored by this user
        const articlesResponse = await dataFactory.request.get('https://conduit-api.bondaracademy.com/api/articles', {
            params: { author: username }
        });
        expect(articlesResponse.ok()).toBeTruthy();
        const body = await articlesResponse.json();
        const articles = body.articles;

        console.log(`--- Found ${articles.length} articles to delete. ---`);

        // 3. Delete each article
        for (const article of articles) {
            console.log(`--- Deleting: ${article.title} (${article.slug}) ---`);
            const deleteResponse = await dataFactory.request.delete(`https://conduit-api.bondaracademy.com/api/articles/${article.slug}`, {
                headers: { Authorization: `Token ${apiToken}` }
            });
            expect(deleteResponse.ok()).toBeTruthy();
        }

        console.log('--- CLEANUP COMPLETE: Environment is clean. ---');
    });
});
