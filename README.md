# Playwright Pro: Digital Twin Architecture

This framework implements a modern, model-based testing approach inspired by **Boozang**, designed for high coverage and low maintenance.

## Core Concepts

### 1. Digital Twin (Model-Based Testing)
We treat the application as a set of models rather than just scripts. Every form and entity is mapped once in a `FormModel` and reused across multiple test scenarios.

### 2. Workflow Engine
Business flows are orchestrated using a `WorkflowEngine` that chains high-level logical nodes (e.g., `Login` -> `Create Article` -> `Delete`). This separates "What to test" from "How to interact".

### 3. LoginIfNeeded Strategy
To optimize test execution, we use a `loginIfNeeded` strategy. It actively checks for an existing session before attempting to log in, reporting success immediately if a session is detected.

### 4. Dynamic Data Generation
Ensures test uniqueness across parallel runs using the `DataGenerator` utility. It handles unique hashes, pattern-based data (e.g., `USER-####`), and cross-step data persistence.

## Project Structure

- `pages/`: Page Object Models with integrated Form Models.
- `utils/`: Core architecture utilities (`WorkflowEngine`, `FormModel`, `DataGenerator`).
- `tests/`: High-level workflow tests (e.g., `article-crud.spec.ts`).
- `docs/`: Detailed design and "how-to" documentation.

## Getting Started

### Prerequisites
- Node.js (LTS)
- Playwright installed

### Installation
```bash
npm install
npx playwright install
```

### Running Tests
```bash
# Run the full Article CRUD workflow
npx playwright test tests/article-crud.spec.ts
```

## Continuous Integration
GitHub Actions are configured to run the full suite on every push to `main`, `master`, and `model` branches.
- [CI Dashboard](https://github.com/${{ github.repository }}/actions)

---
*Developed with a focus on scale-up release velocity.*
