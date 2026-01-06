# Tests-Cleanup Module

Initialization and cleanup scripts that run before the main test suite.

## How it Works
This directory is the `testDir` for the `init` project in `playwright.config.ts`. All tests here run first due to project dependencies.

## Current Specs

| File | Purpose |
|---|---|
| `cleanup.spec.ts` | Removes articles via API for the test user |
| `cleanup-ui.spec.ts` | Removes articles via UI (Global Feed) |

## CI Pipeline Role
```
init (this directory) → smoke → regression
```
If cleanup fails, subsequent stages are skipped.

## Future Use
This directory is ideal for:
- Data seeding scripts
- Environment validation checks
- Database reset operations
