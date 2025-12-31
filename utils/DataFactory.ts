import { APIRequestContext } from '@playwright/test';
import { faker } from '@faker-js/faker';
import { tempDB } from './TempDB';
// Clean import thanks to the Barrel file (types/index.ts)
import {
  UserPayload, UserResponse,
  ArticlePayload, ArticleResponse,
  CommentPayload, CommentResponse
} from '../types';

export class DataFactory {
  readonly request: APIRequestContext;

  constructor(request: APIRequestContext) {
    this.request = request;
  }

  async createUniqueUser(): Promise<UserResponse> {
    const userPayload: UserPayload = {
      username: faker.internet.username(),
      email: faker.internet.email(),
      password: 'Password123!',
    };

    const response = await this.request.post('https://conduit-api.bondaracademy.com/api/users', {
      data: { user: userPayload },
    });

    const body = await response.json();
    return body.user; // Returns UserResponse (with token)
  }

  async createArticle(token: string): Promise<ArticleResponse> {
    const articlePayload: ArticlePayload = {
      title: faker.lorem.sentence(),
      description: faker.lorem.sentences(2),
      body: faker.lorem.paragraphs(2),
      tagList: [faker.lorem.word()],
    };

    const response = await this.request.post('https://conduit-api.bondaracademy.com/api/articles', {
      headers: { Authorization: `Token ${token}` },
      data: { article: articlePayload },
    });

    const body = await response.json();
    const article = body.article;

    // Save to TempDB for Digital Twin sharing
    tempDB.saveArticle(article);

    return article; // Returns ArticleResponse (with slug)
  }

  async createComment(token: string, slug: string): Promise<CommentResponse> {
    const commentPayload: CommentPayload = {
      body: faker.lorem.sentence(),
    };

    const response = await this.request.post(`https://conduit-api.bondaracademy.com/api/articles/${slug}/comments`, {
      headers: { Authorization: `Token ${token}` },
      data: { comment: commentPayload },
    });

    const body = await response.json();
    const comment = body.comment;

    // Save to TempDB
    tempDB.saveComment(comment);

    return comment; // Returns CommentResponse (with ID)
  }
}