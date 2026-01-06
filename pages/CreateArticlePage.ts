import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { FormModel } from '../utils/FormModel';
import { tempDB } from '../utils/TempDB';

interface ArticleForm {
    title: string;
    description: string;
    body: string;
    tags: string;
}

export class CreateArticlePage extends BasePage {
    // The "Digital Twin" of the form
    readonly form: FormModel<ArticleForm>;
    readonly publishButton: Locator;

    constructor(page: Page) {
        super(page);

        // Map the fields once (like in Boozang modules)
        this.form = new FormModel<ArticleForm>(page, {
            title: 'input[placeholder="Article Title"]',
            description: 'input[placeholder="What\'s this article about?"]',
            body: 'textarea[placeholder="Write your article (in markdown)"]',
            tags: 'input[placeholder="Enter tags"]',
        });

        this.publishButton = page.getByRole('button', { name: /Publish Article|Update Article/i });
    }

    async goto() {
        await this.navigateTo('/editor');
    }

    async createArticle(data: Partial<ArticleForm>, saveToDB = true) {
        await this.form.fill(data);
        await this.publishButton.click();

        // Always wait for navigation to the article page
        await this.page.waitForURL(/\/article\//, { timeout: 10000 });

        if (saveToDB) {
            try {
                const url = this.page.url();
                const slug = url.split('/').pop() || '';

                tempDB.saveArticle({
                    title: data.title || '',
                    description: data.description || '',
                    body: data.body || '',
                    tagList: data.tags ? data.tags.split(',').map(t => t.trim()) : [],
                    slug: slug
                } as any);
            } catch (e: any) {
                console.warn('Failed to save to TempDB:', e.message);
            }
        }
    }
}
