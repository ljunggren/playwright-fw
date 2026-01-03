# Tests Module

This directory contains the primary test suite for the Playwright Pro framework.

## How it Works
The tests are designed following a business-centric workflow approach. They leverage "Digital Twins" (Page Objects) and a shared `WorkflowEngine` to ensure readability and resilience.

### Test Categories
- **article-crud.spec.ts**: Full UI-based lifecycle of an article.
- **article-crud-mixed.spec.ts**: Hybrid UI/API workflow for faster setup.
- **comment-crud.spec.ts**: CRUD operation for comments, utilizing `TempDB` for data sharing.

## Usage Examples

### Running specific specs
```bash
npx playwright test tests/article-crud.spec.ts
```

### Mixed Mode Shortcut Example
```typescript
// From article-crud-mixed.spec.ts
const article = await dataFactory.request.post('/api/articles', {
    headers: { Authorization: `Token ${apiToken}` },
    data: { article: payload }
});
await page.goto(`/article/${body.article.slug}`);
```

## Data Lifecycle
Most tests are designed to be independent but can share data via `TempDB` if run serially with `--workers=1`.
