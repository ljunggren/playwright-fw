import { Page, Locator } from '@playwright/test';

export abstract class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // Common utility to navigate relative to base URL
  async navigateTo(path: string) {
    await this.page.goto(path);
  }

  // Visual validation helper
  async validateVisual(screenshotName: string) {
    await expect(this.page).toHaveScreenshot(`${screenshotName}.png`);
  }

  // Wrapper to make locators strictly scoped if needed
  protected find(selector: string): Locator {
    return this.page.locator(selector);
  }
}