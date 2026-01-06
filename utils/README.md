# Utils Module

Core utilities for data management and test orchestration.

## Components

| File | Purpose |
|---|---|
| `DataFactory.ts` | API-based data creation (users, articles, comments) |
| `DataGenerator.ts` | Unique test data generation with prefixes |
| `FormModel.ts` | Maps form fields to selectors for Digital Twin pattern |
| `TempDB.ts` | In-memory storage for sharing test data between specs |
| `WorkflowEngine.ts` | Orchestrates multi-step business flows with logging |

## Usage

### DataFactory
```typescript
const article = await dataFactory.createArticle(token);
```

### TempDB
```typescript
tempDB.saveArticle(article);
const latest = tempDB.getLatestArticle();
```

### WorkflowEngine
```typescript
await workflow.runBusinessFlow([
  { name: 'Login', action: async () => await loginPage.login() },
  { name: 'Create', action: async () => await page.click('#submit') },
]);
```
