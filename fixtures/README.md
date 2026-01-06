# Fixtures Module

Custom Playwright fixtures for dependency injection and test setup.

## How it Works
Fixtures extend Playwright's base `test` object to provide pre-configured dependencies like Page Objects, data factories, and API tokens.

## Available Fixtures

| Fixture | Description |
|---|---|
| `dataFactory` | API client for creating test data |
| `generator` | Unique data generator |
| `createdUser` | Pre-created test user |
| `createdArticle` | Pre-created article (depends on `createdUser`) |
| `createdComment` | Pre-created comment (depends on `createdArticle`) |
| `apiToken` | Fresh auth token from UI login |
| `loginPage`, `createArticlePage`, `articlePage` | Page Object instances |
| `useTempData` | Option to enable TempDB sharing |

## Usage
```typescript
import { test } from '../fixtures/test-fixtures';

test('my test', async ({ page, dataFactory, apiToken }) => {
  const article = await dataFactory.createArticle(apiToken);
});
```
