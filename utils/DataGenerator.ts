/**
 * DataGenerator provides utilities for generating unique, dynamic test data.
 * This ensures that entities like articles or users have unique identifiers across test runs.
 */
export class DataGenerator {
    private storedValues: Record<string, any> = {};

    /**
     * Generates a random alphanumeric hash.
     */
    generateHash(length: number = 6): string {
        return Math.random().toString(36).substring(2, 2 + length);
    }

    /**
     * Generates a unique string based on a prefix and a random hash.
     * Stores the value for later retrieval in validation steps.
     */
    generateUnique(key: string, prefix: string): string {
        const value = `${prefix}-${this.generateHash()}`;
        this.storedValues[key] = value;
        return value;
    }

    /**
     * Retrieves a previously generated value by key.
     */
    getValue(key: string): string {
        const value = this.storedValues[key];
        if (!value) {
            throw new Error(`DataGenerator: Key "${key}" not found. Did you generate it?`);
        }
        return value;
    }

    /**
     * Simple regex-like pattern generator.
     * Example: 'USER-####' -> 'USER-1234'
     */
    generateFromPattern(key: string, pattern: string): string {
        const value = pattern.replace(/#/g, () => Math.floor(Math.random() * 10).toString());
        this.storedValues[key] = value;
        return value;
    }
}

export const generator = new DataGenerator();
