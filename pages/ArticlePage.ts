import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { CommentSection } from './components/CommentSection'; // Import the component

export class ArticlePage extends BasePage {
  readonly commentSection: CommentSection; // Publicly expose the component
  
  private readonly title: Locator;
  private readonly body: Locator;
  private readonly tags: Locator;

  constructor(page: Page) {
    super(page);
    this.commentSection = new CommentSection(page); // Initialize it
    
    this.title = page.locator('h1');
    this.body = page.locator('.article-content');
    this.tags = page.locator('.tag-list');
  }

  async validateArticle(expectedTitle: string, expectedBody: string) {
    await expect(this.title).toHaveText(expectedTitle);
    await expect(this.body).toContainText(expectedBody);
  }
}