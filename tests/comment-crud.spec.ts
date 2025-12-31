import { test, expect } from '../fixtures/test-fixtures';
import { LoginPage } from '../pages/LoginPage';
import { CreateArticlePage } from '../pages/CreateArticlePage';
import { ArticlePage } from '../pages/ArticlePage';
import { workflow } from '../utils/WorkflowEngine';
import { generator } from '../utils/DataGenerator';
import { tempDB } from '../utils/TempDB';

test.describe('Comment CRUD', () => {
    // This allows us to run tests in any order. 
    // If an article exists in TempDB, we use it. Otherwise we create one.

    // To use temp data, set this to true. 
    // If false, it will always create its own article.
    test.use({ useTempData: true });

    test('Comment CRUD Workflow', async ({ page, createdUser, useTempData }) => {
        const loginPage = new LoginPage(page);
        const createArticlePage = new CreateArticlePage(page);
        const articlePage = new ArticlePage(page);

        const commentText = generator.generateUnique('comment', 'This is a great article!');
        let articleSlug = '';

        await workflow.runBusinessFlow([
            {
                name: 'Login Step',
                action: async () => {
                    const email = process.env.TEST_USERNAME || createdUser.email;
                    const password = process.env.TEST_PASSWORD || createdUser.password;
                    await loginPage.loginIfNeeded(email, password);
                }
            },
            {
                name: 'Setup Article Step',
                action: async () => {
                    const existingArticle = tempDB.getLatestArticle() as any;

                    if (useTempData && existingArticle && existingArticle.slug) {
                        console.log(`Using existing article from TempDB: ${existingArticle.slug}`);
                        articleSlug = existingArticle.slug;
                    } else {
                        console.log('No suitable article found in TempDB or useTempData is false. Creating new article.');
                        await createArticlePage.goto();
                        const title = generator.generateUnique('article', 'Need Comments');
                        await createArticlePage.createArticle({
                            title,
                            description: 'Article for comment testing',
                            body: 'This article serves as a parent for comments.'
                        });

                        // Extract slug from URL
                        await page.waitForURL(/\/article\//);
                        articleSlug = page.url().split('/').pop() || '';
                    }
                }
            },
            {
                name: 'Navigate to Article',
                action: async () => {
                    // Navigate only if we are not already there
                    if (!page.url().includes(`/article/${articleSlug}`)) {
                        await page.goto(`/article/${articleSlug}`);
                    }
                }
            },
            {
                name: 'Post Comment Step',
                action: async () => {
                    // Ensure comment form is visible before interacting
                    const form = page.locator('form.comment-form');
                    await form.scrollIntoViewIfNeeded();
                    await expect(form).toBeVisible({ timeout: 10000 });
                    await articlePage.commentSection.postComment(commentText);
                }
            },
            {
                name: 'Verify Comment Step',
                action: async () => {
                    await articlePage.commentSection.expectCommentToExist(commentText);
                }
            },
            {
                name: 'Delete Comment Step',
                action: async () => {
                    await articlePage.commentSection.deleteComment(commentText);
                }
            },
            {
                name: 'Verify Comment Deleted Step',
                action: async () => {
                    await expect(page.locator('.card', { hasText: commentText })).not.toBeVisible();
                }
            }
        ]);
    });
});
