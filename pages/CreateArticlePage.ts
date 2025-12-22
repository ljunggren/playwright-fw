import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { FormModel } from '../utils/FormModel';

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

        this.publishButton = page.getByRole('button', { name: 'Publish Article' });
    }

    async goto() {
        await this.navigateTo('/editor');
    }

    async createArticle(data: Partial<ArticleForm>) {
        await this.form.fill(data);
        await this.publishButton.click();
    }
}
