# How to Write Tests: A Step-by-Step Guide

Welcome to the `playwright-fw` project! This guide will walk you through our testing patterns and how to implement new tests efficiently.

## 1. The Big Picture
We use **Playwright** with **TypeScript**. Our goal is to write tests that are fast, stable, and easy to maintain. 

Key principles:
- **Skip Login**: We don't log in in every test. We do it once and share the session.
- **POM (Page Object Model)**: We keep selectors in Page classes, not in the tests.
- **API First**: We use APIs to set up data (like creating a user or an article) before testing the UI.

---

## 2. Authentication (The "Magic" Login)
We use a **Global Setup** to log in once.
- **File**: [global-setup.ts](file:///Users/matsljunggren/Workspace/playwright-fw/tests/global-setup.ts)
- **How it works**: It logs in, saves cookies to `user.json`, and every test then automatically uses that state. 
- **Benefit**: Saves ~5-10 seconds per test!

---

## 3. Page Object Model (POM)
Every page in the app should have a corresponding class in the `pages/` folder.

### Step 1: Create a Page Class
Inherit from `BasePage` to get common utilities.
```typescript
import { BasePage } from './BasePage';

export class MyNewPage extends BasePage {
  readonly myButton = this.page.getByRole('button', { name: 'Submit' });

  async submitForm() {
    await this.myButton.click();
  }
}
```

### Step 2: Use it in a Test
```typescript
test('My test', async ({ page }) => {
  const myPage = new MyNewPage(page);
  await myPage.navigateTo('/path');
  await myPage.submitForm();
});
```

---

## 4. Setting Up Data via API
Don't use the UI to set up prerequisites. Use the `DataFactory`.
- **File**: [DataFactory.ts](file:///Users/matsljunggren/Workspace/playwright-fw/utils/DataFactory.ts)
- **Example**: To test "Editing an Article", first create the article via API:
```typescript
const factory = new DataFactory(page.request);
const article = await factory.createArticle(token);
// Now go directly to the edit page for that article slug!
```

---

## 5. Checklist for a New Test
1. **Identify the Page**: Does a Page Object exist for what you're testing? If not, create one in `pages/`.
2. **Setup Data**: Do you need a user, article, or comment? Check `DataFactory.ts`.
3. **Write the Spec**: Create a `.spec.ts` file in `tests/`.
4. **Use Steps**: Wrap logical chunks in `test.step('Description', ...)` for better reports.
5. **Run it**: `npm test` or `npm run test:ui`.

---

## 6. Digital Twin Approach (Advanced)

Inspired by Boozang, we use a "Digital Twin" architecture for high coverage.

### Mapping "Models" (Digital Twin)
Instead of hardcoding selectors in every method, we map the entire form once using `FormModel`. This acts as the module's "Digital Twin".

```typescript
// pages/CreateArticlePage.ts
this.form = new FormModel<ArticleForm>(page, {
  title: 'input[placeholder="Article Title"]',
  body: 'textarea[placeholder="Write..."]',
});
```

### Workflow Orchestration
We use a `WorkflowEngine` to chain these models into high-level business flows. This separates **how** to interact with the page from **what** the business logic is.

```typescript
// tests/workflow.spec.ts
await workflow.runBusinessFlow([
  { name: 'Login', action: async () => loginPage.login() },
  { name: 'Create Article', action: async () => createArticlePage.createArticle(data) },
]);
```

Benefits:
- **Traceability**: Playwright reports show each logical step clearly.
- **Maintainability**: If a field moves, you update the `FormModel` map once.
- **Scalability**: Easily generate hundreds of tests from a single workflow with different data sets.

---

## Need Help?
Check the progress log for recent changes or ask the AI assistant for local project context!
