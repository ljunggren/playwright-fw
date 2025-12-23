# Playwright Pro: Digital Twin Architecture

This framework implements a modern, model-based testing approach inspired by **Boozang**, designed for high coverage and low maintenance.

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
| **`tests/`** | End-to-end specifications (UI, API, and Mixed workflows). | Tracked |
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
Remove all articles belonging to the test user to reset the environment.
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

# Run with headed browser (visible)
npx playwright test tests/article-crud.spec.ts --headed

# Run in debug mode (step through with Playwright Inspector)
npx playwright test tests/article-crud.spec.ts --debug

# Run specific test by name
npx playwright test --grep "Article CRUD"
```

## Continuous Integration
GitHub Actions are configured to run tests on `main`, `master`, and `model` branches.
- [CI Dashboard](https://github.com/${{ github.repository }}/actions)

---
*Developed with a focus on scale-up release velocity.*
