import { Page, Locator, expect } from '@playwright/test';

export class CommentSection {
  private readonly page: Page;
  // Rename 'container' to something more semantic if you like, 
  // or just scope it less strictly.
  private readonly commentList: Locator;

  constructor(page: Page) {
    this.page = page;

    // 🔴 OLD (Brittle): Relies on exact sibling position
    // this.container = page.locator('.article-actions + .row'); 

    // 🟢 NEW (Robust): Finds the column where comments live
    // In Conduit, comments are lists of '.card' elements. 
    // We can just scope to the main content area or look for cards generally.
    this.commentList = page.locator('.card');
  }

  // Update this method to use the new locator
  async expectCommentToExist(text: string) {
    // We look for a card that contains our specific comment text
    const specificComment = this.commentList.filter({ hasText: text });

    // Playwright will retry this automatically until it appears
    await expect(specificComment).toBeVisible();
  }

  // Update other methods if necessary
  async postComment(text: string) {
    // The input is usually in a card with a 'Post Comment' button
    // We can scope this strictly to the form
    const form = this.page.locator('form.comment-form');
    await form.locator('textarea').fill(text);
    await form.locator('button[type="submit"]').click();
  }

  async deleteComment(text: string) {
    const commentCard = this.commentList.filter({ hasText: text });
    // In Conduit, the delete icon is usually a '.ion-trash-a' inside '.mod-options'
    await commentCard.locator('.ion-trash-a').click();
  }
}