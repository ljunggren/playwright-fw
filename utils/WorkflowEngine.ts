import { test } from '@playwright/test';

type StepAction = () => Promise<void>;

/**
 * WorkflowEngine orchestrates high-level actions across different Page Objects.
 * This mirrors the Boozang workflow engine.
 */
export class WorkflowEngine {
    /**
     * Executes a step with built-in Playwright step logging.
     */
    async step(name: string, action: StepAction) {
        await test.step(name, action);
    }

    /**
     * Example of an orchestrated "Business Flow"
     */
    async runBusinessFlow(steps: { name: string; action: StepAction }[]) {
        for (const { name, action } of steps) {
            await this.step(name, action);
        }
    }
}

export const workflow = new WorkflowEngine();
