# Playwright Pro: Digital Twin Architecture

This framework implements a modern, model-based testing approach inspired by **Boozang**, designed for high coverage and low maintenance.

## Overview

### The Why
Modern web applications are complex and change rapidly. Traditional script-based testing is brittle and expensive to maintain. We need a framework that is resilient to UI changes and focuses on business value.

### The What
A Playwright-based framework that uses:
- **Digital Twins**: Decoupled models of the UI.
- **Workflow Engine**: Business-centric test orchestration.
- **Hybrid Execution**: Unified UI and API testing.

### The How
By mapping UI components to `FormModel` instances and chaining them in logical business flows, we ensure that tests are easy to write, read, and maintain.

## Core Concepts

### 1. Digital Twin (Model-Based Testing)
We treat the application as a set of models rather than just scripts. Every form and entity is mapped once in a `FormModel` and reused across multiple test scenarios.

### 2. Workflow Engine
Business flows are orchestrated using a `WorkflowEngine` that chains high-level logical nodes. This separates "What to test" from "How to interact".

### 3. LoginIfNeeded & Session Sync
To optimize execution, we use a `loginIfNeeded` strategy. Furthermore, we synchronize UI and API sessions by extracting the `jwtToken` from `localStorage` after a UI login, ensuring parity across all test actions.

### 4. Hybrid UI/API Workflows
The framework supports "Mixed Mode" testing. You can use API shortcuts for fast data setup and immediately transition to UI verification or interaction within the same test context.

### 5. Dynamic Data Generation
Ensures test uniqueness across parallel runs using the `DataGenerator` utility. It handles unique hashes and pattern-based data (e.g., `USER-####`).

### 6. TempDB (In-Memory Data Factory)
The `TempDB` singleton allows tests to share data within a single run. For example, a `Comment` test can reuse an `Article` created by a previous test to verify interactions without redundant setup.

> [!WARNING]
> **Parallel Workers Limitation**: Because `TempDB` is an in-memory singleton, it is worker-scoped. Tests that rely on sharing data through `TempDB` must run in the same worker process (using `--workers=1`). For true parallel execution across workers, consider using a persistent data store or file-based cache.

## Visual Concepts

### Digital Twin Architecture
```mermaid
graph TD
    A[Test Specification] --> B[Page Object / Digital Twin]
    B --> C[FormModel]
    C --> D[DOM Element 1]
    C --> E[DOM Element 2]
    B --> F[Business Logic Actions]
```

### Workflow Execution
```mermaid
sequenceDiagram
    participant T as Test Spec
    participant W as WorkflowEngine
    participant P as Page Objects (Digital Twins)
    
    T->>W: runBusinessFlow([steps])
    loop for each step
        W->>P: executeAction()
        P->>P: validateState()
    end
    W->>T: complete
```

## Directory Map

| Directory | Purpose | Git Status |
| :--- | :--- | :--- |
| **`.agent/`** | AI agent configuration, workflows, and project context. | Tracked |
| **`.env`** | Local secrets and config (credentials, API tokens). | **Ignored** |
| **`.github/`** | GitHub Actions workflows and CI configurations. | Tracked |
| **`.tr/`** | **Ticket Resources**: Local cached insights from Jira/Azure. | **Ignored** |
| **`docs/`** | Long-form documentation and architectural decision logs. | Tracked |
| **`fixtures/`** | Playwright fixtures for data-injection and POM instantiation. | Tracked |
| **`pages/`** | **Digital Twins**: Page Objects containing the `FormModel` maps. | Tracked |
| **`playwright-report/`** | HTML reports generated after a test run. | **Ignored** |
| **`scripts/`** | Operational scripts (e.g., syncing data, cleaning envs). | Tracked |
| **`test-results/`** | Metadata and media (videos/traces) from failed runs. | **Ignored** |
| **`tests/`** | **Primary Test Suite**: Run by default by Playwright. | Tracked |
| **`tests-cleanup/`** | **Maintenance Tests**: Run using `TEST_MODE=cleanup`. | Tracked |
| **`types/`** | Unified TypeScript interfaces for Payload and Response data. | Tracked |
| **`utils/`** | Shared engines: `WorkflowEngine`, `DataGenerator`, `FormModel`. | Tracked |

## Scripts & Operations

### Ticket Integration
Sync bug reports from systems like Azure DevOps into the framework for unified insights.
```bash
npm run ticket:sync
```
*Note: Requires `AZURE_TOKEN`, `AZURE_ORG`, and `AZURE_PROJECT` in `.env`.*

### Test Data Cleanup
Remove all articles belonging to the test user to reset the environment. These tests are stored in `tests-cleanup/` to avoid running during the regular test suite.
```bash
npm run test:cleanup
```
*Note: Uses UI-based deletion due to Conduit API limitations with author queries.*

## Getting Started

### Installation
```bash
npm install
npx playwright install
```

### Running Tests
```bash
# Run the mixed UI/API workflow
npx playwright test tests/article-crud-mixed.spec.ts

# Run the full UI-based Article CRUD
npx playwright test tests/article-crud.spec.ts

# Run cleanup tests explicitly
npm run test:cleanup
```

### Useful Playwright CLI Flags
```bash
# Run with visible browser
npx playwright test --headed

# Run in debug mode (step through with Playwright Inspector)
npx playwright test --debug

# Record video on failure only (default)
npx playwright test

# Always record video
npx playwright test --video=on

# Record trace for debugging (includes screenshots, network, console)
npx playwright test --trace=on

# Run specific test by name pattern
npx playwright test --grep "Article CRUD"

# Run on specific browser
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit

# Control parallelism (number of workers)
npx playwright test --workers=4      # Run with 4 concurrent workers
npx playwright test --workers=1      # Run serially (required for TempDB sharing)
```

## Test Execution & Ordering

### 1. Default Behavior
By default, Playwright runs tests in **alphabetical order** by filename when using `--workers=1`. 
- `01-setup.spec.ts` runs before `02-feature.spec.ts`.

### 2. Manual CLI Order
You can explicitly define the execution order by passing files in the desired sequence:
```bash
npx playwright test tests/article-crud.spec.ts tests/comment-crud.spec.ts --workers=1
```

### 3. Project Dependencies (Advanced)
For complex dependencies, you can configure projects in `playwright.config.ts`:
```typescript
projects: [
  { name: 'setup', testMatch: /.*setup\.spec\.ts/ },
  { name: 'testing', testMatch: /.*crud\.spec\.ts/, dependencies: ['setup'] },
]
```

> [!TIP]
> **Data Lifecycle**: If you use a full CRUD test (like `article-crud.spec.ts`) as a data provider, ensure it doesn't delete the data until dependent tests (like `comment-crud.spec.ts`) have finished. Alternatively, use a dedicated "Setup" test that only performs the 'Create' action.

### 4. Interactive Mode
Run tests in UI mode (interactive test runner):
```bash
npm run test:ui
```

## Continuous Integration
GitHub Actions are configured to run tests on `main`, `master`, and `model` branches.
- [CI Dashboard](https://github.com/${{ github.repository }}/actions)

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---
*Developed with a focus on scale-up release velocity.*
