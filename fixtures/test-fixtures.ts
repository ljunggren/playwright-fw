import { test as base } from '@playwright/test';
import { DataFactory } from '../utils/DataFactory';
import { UserData, ArticleData, CommentData } from '../types/data';

// Declare the types of our custom fixtures
type MyFixtures = {
  dataFactory: DataFactory;
  createdUser: UserData;
  createdArticle: ArticleData;
  createdComment: CommentData;
};

export const test = base.extend<MyFixtures>({
  // 1. Initialize the Factory
  dataFactory: async ({ request }, use) => {
    await use(new DataFactory(request));
  },

  // 2. Create a User (Standalone)
  createdUser: async ({ dataFactory }, use) => {
    const user = await dataFactory.createUniqueUser();
    await use(user);
  },

  // 3. Create an Article (Depends on User)
  createdArticle: async ({ dataFactory, createdUser }, use) => {
    const article = await dataFactory.createArticle(createdUser.token!);
    await use(article);
  },

  // 4. Create a Comment (Depends on Article AND User)
  createdComment: async ({ dataFactory, createdUser, createdArticle }, use) => {
    const comment = await dataFactory.createComment(createdUser.token!, createdArticle.slug!);
    await use(comment);
  },
});

export { expect } from '@playwright/test';