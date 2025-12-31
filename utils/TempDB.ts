import { ArticlePayload, CommentPayload } from '../types';

class TempDB {
    private articles: ArticlePayload[] = [];
    private comments: CommentPayload[] = [];

    saveArticle(article: any) {
        if (article.slug) {
            const index = this.articles.findIndex((a: any) => a.slug === article.slug);
            if (index !== -1) {
                this.articles[index] = article;
                return;
            }
        }
        this.articles.push(article);
    }

    removeArticle(slug: string) {
        this.articles = this.articles.filter((a: any) => a.slug !== slug);
    }

    getArticles(): ArticlePayload[] {
        return this.articles;
    }

    getLatestArticle(): ArticlePayload | undefined {
        return this.articles.length > 0 ? this.articles[this.articles.length - 1] : undefined;
    }

    saveComment(comment: CommentPayload) {
        this.comments.push(comment);
    }

    getComments(): CommentPayload[] {
        return this.comments;
    }

    clear() {
        this.articles = [];
        this.comments = [];
    }
}

// Export a singleton instance
export const tempDB = new TempDB();
