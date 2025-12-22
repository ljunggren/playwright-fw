import { test, expect } from '../fixtures/test-fixtures';
import { LoginPage } from '../pages/LoginPage';
import { CreateArticlePage } from '../pages/CreateArticlePage';
import { ArticlePage } from '../pages/ArticlePage';
import { workflow } from '../utils/WorkflowEngine';
import { generator } from '../utils/DataGenerator';

test('Digital Twin Workflow Demo', async ({ page, createdUser }) => {
    const loginPage = new LoginPage(page);
    const createArticlePage = new CreateArticlePage(page);
    const articlePage = new ArticlePage(page);

    // Defining the workflow steps (Digital Twin nodes)
    await workflow.runBusinessFlow([
        {
            name: 'Login Step',
            action: async () => {
                // Use the new loginIfNeeded logic (Boozang style)
                const email = process.env.TEST_USERNAME || createdUser.email;
                const password = process.env.TEST_PASSWORD || createdUser.password;
                await loginPage.loginIfNeeded(email, password);
            }
        },
        {
            name: 'Create Article Step',
            action: async () => {
                // Generate a unique title to avoid conflicts
                const dynamicTitle = generator.generateUnique('articleTitle', 'Playwright MBT');

                await createArticlePage.goto();
                await createArticlePage.createArticle({
                    title: dynamicTitle,
                    description: 'Learning from Boozang concepts',
                    body: 'This test was generated using a Workflow Engine and Form Models.',
                    tags: 'playwright, boozang, mbt'
                });
            }
        },
        {
            name: 'Verification Step',
            action: async () => {
                // Retrieve the generated title for validation
                const expectedTitle = generator.getValue('articleTitle');

                await articlePage.validateArticle(
                    expectedTitle,
                    'This test was generated'
                );
            }
        }
    ]);
});
