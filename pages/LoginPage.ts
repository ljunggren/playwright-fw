// pages/LoginPage.ts
import { Page, Locator, test } from '@playwright/test';

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

  /**
   * Check if we are already logged in by looking for authenticated-only elements.
   * This is our "Validation" node in Boozang terms.
   */
  async isLoggedIn(): Promise<boolean> {
    // If "New Article" or "Settings" is visible, we are logged in.
    const newArticleLink = this.page.getByRole('link', { name: 'New Article' });
    try {
      // Short timeout for passive check
      await newArticleLink.waitFor({ state: 'visible', timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Boozang-style "LoginIfNeeded": only logs in if we don't detect an active session.
   */
  async loginIfNeeded(username?: string, password?: string) {
    await test.step('LoginIfNeeded Validation', async () => {
      // Go to home first to check session
      if (this.page.url() === 'about:blank') {
        await this.page.goto('/');
      }

      if (await this.isLoggedIn()) {
        console.log('Boozang: Session detected. Skipping login script and reporting success.');
        return;
      }

      console.log('Boozang: No session detected. Proceeding to login.');
      await this.goto();
      await this.login(username, password);
    });
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

    // Wait for login to complete (New Article link is a stable indicator)
    await this.page.getByRole('link', { name: 'New Article' }).waitFor({ timeout: 15000 });
  }
}