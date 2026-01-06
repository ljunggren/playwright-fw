# Types Module

TypeScript type definitions for API payloads and responses.

## How it Works
This module uses a **Barrel file** pattern (`index.ts`) for clean imports. All types can be imported from a single location.

## Available Types

| File | Types |
|---|---|
| `api.ts` | `UserPayload`, `UserResponse`, `ArticlePayload`, `ArticleResponse`, `CommentPayload`, `CommentResponse` |
| `data.ts` | `UserData`, `ArticleData`, `CommentData` (aliases for cleaner code) |

## Usage
```typescript
// Clean import from barrel file
import { ArticlePayload, ArticleResponse } from '../types';
```
