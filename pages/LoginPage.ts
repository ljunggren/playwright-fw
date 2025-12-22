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
  async isLoggedIn(username?: string): Promise<boolean> {
    // If "New Article" is visible, we are logged in.
    const newArticleLink = this.page.getByRole('link', { name: 'New Article' });
    try {
      await newArticleLink.waitFor({ state: 'visible', timeout: 3000 });

      // If a specific username is provided, verify it's the one in the navbar
      if (username) {
        const userLink = this.page.getByRole('link', { name: username });
        return await userLink.isVisible();
      }

      return true;
    } catch {
      return false;
    }
  }

  /**
   * Boozang-style "LoginIfNeeded": only logs in if we don't detect an active session for the user.
   */
  async loginIfNeeded(usernameOrEmail?: string, password?: string) {
    await test.step('LoginIfNeeded Validation', async () => {
      // Go to home first to check session if needed
      if (this.page.url() === 'about:blank') {
        await this.page.goto('/');
      }

      // If we have a username, we can be more specific in our check
      // Note: usernameOrEmail might be an email, so we only use it if it doesn't look like an email
      const isEmail = usernameOrEmail?.includes('@');
      const checkName = isEmail ? undefined : usernameOrEmail;

      if (await this.isLoggedIn(checkName)) {
        console.log(`Boozang: Session detected${checkName ? ' for ' + checkName : ''}. Skipping login.`);
        return;
      }

      console.log('Boozang: No session detected. Proceeding to login.');
      await this.goto();
      await this.login(usernameOrEmail, password);
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
    await this.page.getByRole('link', { name: 'New Article' }).waitFor({ timeout: 10000 });
  }

  /**
   * Extracts the current JWT token from localStorage.
   * This is used to synchronize the UI session with API requests.
   */
  async getAuthToken(): Promise<string> {
    const token = await this.page.evaluate(() => localStorage.getItem('jwtToken'));
    if (!token) {
      throw new Error('Auth Token not found in localStorage. Are you logged in?');
    }
    return token;
  }
}