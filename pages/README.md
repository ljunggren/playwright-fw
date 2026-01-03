# Pages Module (Digital Twins)

This directory contains the "Digital Twins" of the application—Page Objects that encapsulate both the DOM structure and business logic.

## How it Works
Each page object extends `BasePage` and uses the `FormModel` utility to map UI fields once, ensuring that changes to the DOM only require updates in one place.

### Key Components
- **LoginPage**: Handles session validation and `loginIfNeeded` logic.
- **CreateArticlePage**: Maps the article creation form.
- **ArticlePage**: Handles article viewing and management actions.
- **components/CommentSection**: A reusable component for article comments.

## Digital Twin Pattern
```typescript
class MyPage extends BasePage {
    readonly form: FormModel<MyFormType>;
    
    constructor(page: Page) {
        super(page);
        this.form = new FormModel<MyFormType>(page, {
            field1: 'input[name="field1"]',
            // ... selectors
        });
    }
}
```
Using `form.fill(data)` automatically handles input for all mapped fields.
