// pages/LoginPage.ts
import { Page, Locator } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly signInButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.getByPlaceholder('Email');
    this.passwordInput = page.getByPlaceholder('Password');
    this.signInButton = page.getByRole('button', { name: 'Sign in' });
  }

  async goto() {
    await this.page.goto('/login');
  }

  // Parameters are now optional (marked with ?)
  async login(username?: string, password?: string) {
    // Use the provided argument, OR fall back to the environment variable
    const finalEmail = username || process.env.TEST_USERNAME;
    const finalPassword = password || process.env.TEST_PASSWORD;

    if (!finalEmail || !finalPassword) {
      throw new Error('No credentials provided and no TEST_USERNAME/TEST_PASSWORD set in .env');
    }

    await this.emailInput.fill(finalEmail);
    await this.passwordInput.fill(finalPassword);
    await this.signInButton.click();
    
    // Wait for login to complete (e.g. redirect to home)
    await this.page.waitForSelector('.feed-toggle', { timeout: 10000 });
  }
}