// tests/global-setup.ts
import { chromium, FullConfig } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

async function globalSetup(config: FullConfig) {
  // 1. Read the baseURL from your Playwright config
  // We look at the first project's configuration to find it.
  const { baseURL, storageState } = config.projects[0].use;

  if (!baseURL) {
    throw new Error('Base URL is missing in playwright.config.ts');
  }

  const browser = await chromium.launch();

  // 2. Create a context with the baseURL explicitly set
  // This ensures that page.goto('/login') resolves to 'http://localhost:3000/login'
  const context = await browser.newContext({ baseURL });
  const page = await context.newPage();

  const loginPage = new LoginPage(page);
  
  // Now this works because the context knows the base URL!
  await loginPage.goto(); 
  
  await loginPage.login();

  // 3. Save the storage state (cookies) to 'user.json'
  // using the path defined in your config (or defaulting to 'user.json')
  await page.context().storageState({ path: storageState as string || 'user.json' });

  await browser.close();
}

export default globalSetup;