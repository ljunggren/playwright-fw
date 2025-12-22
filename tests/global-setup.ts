// tests/global-setup.ts
import { chromium, FullConfig } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import dotenv from 'dotenv';

dotenv.config();

async function globalSetup(config: FullConfig) {
  const { baseURL, storageState } = config.projects[0].use;

  if (!baseURL) {
    throw new Error('Base URL is missing in playwright.config.ts');
  }

  const browser = await chromium.launch();
  const context = await browser.newContext({ baseURL });
  const page = await context.newPage();

  const loginPage = new LoginPage(page);

  try {
    await page.goto('/');
    // Use the same logic as the tests
    if (await loginPage.isLoggedIn()) {
      console.log('Global Setup: Already logged in.');
    } else {
      await loginPage.goto();
      await loginPage.login();
    }

    // Save the storage state (cookies) to 'user.json'
    await page.context().storageState({ path: storageState as string || 'user.json' });
  } catch (error) {
    console.error('Global Setup failed:', error);
    // Don't throw here to allow tests to try logging in themselves if needed
  } finally {
    await browser.close();
  }
}

export default globalSetup;