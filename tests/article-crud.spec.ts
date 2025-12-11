import { test, expect } from '@playwright/test';

test.describe('Article CRUD', () => {

  test('Create, Read, Update, and Delete an Article', async ({ page }) => {
    const randomId = Math.floor(Math.random() * 1000);
    const articleTitle = `Test Article ${randomId}`;
    const articleBody = 'This is a test article created by Playwright.';
    const updatedTitle = `Updated Article ${randomId}`;
    
    // We will store the slug here after we create the article
    let slug: string;

    // --- STEP 1: CREATE ---
    await test.step('Create a new article', async () => {
      await page.goto('/editor'); 
      
      await page.getByPlaceholder('Article Title').fill(articleTitle);
      await page.getByPlaceholder('What\'s this article about?').fill('Testing CRUD');
      await page.getByPlaceholder('Write your article (in markdown)').fill(articleBody);
      await page.getByPlaceholder('Enter tags').fill('playwright');
      
      await page.getByRole('button', { name: 'Publish Article' }).click();

      // 1. Wait for the URL to change to ANY article URL
      // This is safer than guessing the exact string
      await page.waitForURL(/\/article\//);

      // 2. Extract the slug from the current URL
      const url = page.url();
      // Assuming URL structure is .../article/slug-text
      slug = url.split('/').pop() || ''; 
      
      console.log(`Extracted Slug: ${slug}`);

      // 3. Basic assertion to ensure we aren't empty
      expect(slug).not.toBe('');
      expect(slug).toMatch(/test-article/i);
    });

    // --- STEP 2: READ ---
    await test.step('Verify the article was created', async () => {
      // We are already on the page, but now we can verify the URL explicitly if we want
      expect(page.url()).toContain(slug);

      await expect(page.locator('h1')).toContainText(articleTitle);
      await expect(page.getByText(articleBody)).toBeVisible();
    });

    // --- STEP 3: UPDATE ---
    await test.step('Edit the article', async () => {
      await page.getByRole('link', { name: 'Edit Article' }).first().click();
      await expect(page).toHaveURL(/\/editor/);

      await page.getByPlaceholder('Article Title').fill(updatedTitle);
      await page.getByRole('button', { name: 'Publish Article' }).click();

      // Verify the new title is visible
      await expect(page.locator('h1')).toContainText(updatedTitle);
    });

    // --- STEP 4: DELETE ---
    await test.step('Delete the article', async () => {
      // Handle the system popup
      page.on('dialog', async dialog => {
        await dialog.accept(); 
      });

      await page.getByRole('button', { name: 'Delete Article' }).first().click();

      // Wait for redirect to home
      await page.waitForURL('/');
      
      // Optional: Verify the article is actually gone by trying to visit the slug directly
      // This should now result in a 404 or redirect, depending on your app
      // await page.goto(`/article/${slug}`);
      // await expect(page.getByText('Article not found')).toBeVisible(); // Adjust based on your app
    });
  });

});