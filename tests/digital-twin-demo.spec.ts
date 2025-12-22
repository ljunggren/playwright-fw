import { test, expect } from '../fixtures/test-fixtures';
import { LoginPage } from '../pages/LoginPage';
import { CreateArticlePage } from '../pages/CreateArticlePage';
import { ArticlePage } from '../pages/ArticlePage';
import { workflow } from '../utils/WorkflowEngine';

test('Digital Twin Workflow Demo', async ({ page, createdUser }) => {
    const loginPage = new LoginPage(page);
    const createArticlePage = new CreateArticlePage(page);
    const articlePage = new ArticlePage(page);

    // Defining the workflow steps (Digital Twin nodes)
    await workflow.runBusinessFlow([
        {
            name: 'Login Step',
            action: async () => {
                await loginPage.goto();
                // Prioritize .env credentials as requested by user
                const email = process.env.TEST_USERNAME || createdUser.email;
                const password = process.env.TEST_PASSWORD || createdUser.password;
                await loginPage.login(email, password);
            }
        },
        {
            name: 'Create Article Step',
            action: async () => {
                await createArticlePage.goto();
                await createArticlePage.createArticle({
                    title: 'Model-Based Testing in Playwright',
                    description: 'Learning from Boozang concepts',
                    body: 'This test was generated using a Workflow Engine and Form Models.',
                    tags: 'playwright, boozang, mbt'
                });
            }
        },
        {
            name: 'Verification Step',
            action: async () => {
                await articlePage.validateArticle(
                    'Model-Based Testing in Playwright',
                    'This test was generated'
                );
            }
        }
    ]);
});
