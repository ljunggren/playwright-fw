import { test as base } from '@playwright/test';
import { DataFactory } from '../utils/DataFactory';
import { DataGenerator } from '../utils/DataGenerator';
import { UserData, ArticleData, CommentData } from '../types/data';

// Page Objects
import { LoginPage } from '../pages/LoginPage';
import { CreateArticlePage } from '../pages/CreateArticlePage';
import { ArticlePage } from '../pages/ArticlePage';

// Declare the types of our custom fixtures
type MyFixtures = {
  dataFactory: DataFactory;
  generator: DataGenerator;
  createdUser: UserData;
  createdArticle: ArticleData;
  createdComment: CommentData;

  // New Synchronization Fixture
  apiToken: string;

  // Page Object Fixtures
  loginPage: LoginPage;
  createArticlePage: CreateArticlePage;
  articlePage: ArticlePage;
};

export const test = base.extend<MyFixtures>({
  // Initialize Generator
  generator: async ({ }, use) => {
    await use(new DataGenerator());
  },

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

  // 5. Synchronization: Get a fresh token via UI login
  apiToken: async ({ loginPage }, use) => {
    // Force a UI login with Env credentials to get a fresh token
    const email = process.env.TEST_USERNAME!;
    const password = process.env.TEST_PASSWORD!;
    await loginPage.loginIfNeeded(email, password);
    const token = await loginPage.getAuthToken();
    await use(token);
  },

  // Page Object Instantiations
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  createArticlePage: async ({ page }, use) => {
    await use(new CreateArticlePage(page));
  },
  articlePage: async ({ page }, use) => {
    await use(new ArticlePage(page));
  },
});

export { expect } from '@playwright/test';