import { ArticlePayload, CommentPayload } from '../types';

class TempDB {
    private articles: ArticlePayload[] = [];
    private comments: CommentPayload[] = [];

    saveArticle(article: ArticlePayload) {
        this.articles.push(article);
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
