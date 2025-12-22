import { Page, Locator } from '@playwright/test';

/**
 * FormModel provides a way to map data fields to selectors.
 * This mimics the Boozang approach of mapping form elements once
 * and reusing them in workflows.
 */
export class FormModel<T extends Record<string, any>> {
    private page: Page;
    private fieldMap: Record<keyof T, string>;

    constructor(page: Page, fieldMap: Record<keyof T, string>) {
        this.page = page;
        this.fieldMap = fieldMap;
    }

    /**
     * Automatically fills a form based on a data object.
     */
    async fill(data: Partial<T>) {
        for (const [key, value] of Object.entries(data)) {
            const selector = this.fieldMap[key];
            if (selector) {
                const locator = this.page.locator(selector);
                await locator.fill(String(value));
            }
        }
    }

    /**
     * Retrieves a locator for a specific field.
     */
    getLocator(key: keyof T): Locator {
        return this.page.locator(this.fieldMap[key]);
    }
}
