import { test, expect } from '../fixtures/test-fixtures';
import { workflow } from '../utils/WorkflowEngine';

test('Article CRUD Mixed Workflow (UI + API) @regression', async ({
    page,
    loginPage,
    createArticlePage,
    articlePage,
    dataFactory,
    createdUser,
    apiToken,
    generator
}) => {
    // Standard titles
    const apiArticleTitle = generator.generateUnique('apiArticle', 'API Setup');
    const uiEditTitle = generator.generateUnique('uiEdit', 'UI Edited');

    await workflow.runBusinessFlow([
        {
            name: 'Login Step (UI)',
            action: async () => {
                // The apiToken fixture already handled loginIfNeeded
                // We just verify we are on the right track
                await expect(page.getByRole('link', { name: 'New Article' })).toBeVisible();
            }
        },
        {
            name: 'Setup Article (API Shortcut)',
            action: async () => {
                // We use the synchronized apiToken extracted from UI
                console.log('--- API ACTION: Creating article via REST ---');
                const article = await dataFactory.request.post('https://conduit-api.bondaracademy.com/api/articles', {
                    headers: { Authorization: `Token ${apiToken}` },
                    data: {
                        article: {
                            title: apiArticleTitle,
                            description: 'Created via API shortcut',
                            body: 'This saves us about 3 seconds of UI time.',
                            tagList: ['api-shortcut']
                        }
                    }
                });
                expect(article.ok()).toBeTruthy();
                const body = await article.json();

                // Navigate to the article URL created via API
                await page.goto(`/article/${body.article.slug}`);
            }
        },
        {
            name: 'Verify Initial Article (UI)',
            action: async () => {
                await articlePage.validateArticle(apiArticleTitle, 'This saves us');
            }
        },
        {
            name: 'Edit Article (UI)',
            action: async () => {
                await articlePage.clickEdit();
                await createArticlePage.createArticle({
                    title: uiEditTitle
                });
            }
        },
        {
            name: 'Verify Edit (UI + Visual)',
            action: async () => {
                await articlePage.validateArticle(uiEditTitle, 'This saves us');

                // Visual regression check (will create first snapshot on first run)
                // await articlePage.validateVisual('article-details-after-edit');
            }
        },
        {
            name: 'Delete Article (UI)',
            action: async () => {
                await articlePage.clickDelete();
                await page.waitForURL('/');
            }
        }
    ]);
});
