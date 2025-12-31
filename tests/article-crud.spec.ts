import { test, expect } from '../fixtures/test-fixtures';
import { LoginPage } from '../pages/LoginPage';
import { CreateArticlePage } from '../pages/CreateArticlePage';
import { ArticlePage } from '../pages/ArticlePage';
import { workflow } from '../utils/WorkflowEngine';
import { generator } from '../utils/DataGenerator';

test('Article CRUD Workflow (Digital Twin)', async ({ page, createdUser }) => {
    const loginPage = new LoginPage(page);
    const createArticlePage = new CreateArticlePage(page);
    const articlePage = new ArticlePage(page);

    // Dynamic data for the workflow
    const initialTitle = generator.generateUnique('articleTitle', 'Playwright CRUD');
    const updatedTitle = generator.generateUnique('updatedTitle', 'Updated MBT');

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
            name: 'Create Article Step',
            action: async () => {
                await createArticlePage.goto();
                await createArticlePage.createArticle({
                    title: initialTitle,
                    description: 'Testing full CRUD lifecycle',
                    body: 'This article will be created, edited, and deleted.',
                    tags: 'crud, mbt'
                }, false);
            }
        },
        {
            name: 'Read (Verify Create) Step',
            action: async () => {
                await articlePage.validateArticle(initialTitle, 'This article will be');
            }
        },
        {
            name: 'Edit Article Step',
            action: async () => {
                await articlePage.clickEdit();
                await createArticlePage.createArticle({
                    title: updatedTitle
                });
            }
        },
        {
            name: 'Verify Edit Step',
            action: async () => {
                await articlePage.validateArticle(updatedTitle, 'This article will be');
            }
        },
        {
            name: 'Delete Article Step',
            action: async () => {
                await articlePage.clickDelete();
                await page.waitForURL('/');
            }
        }
    ]);
});
