import { UserResponse } from './user';

export interface CommentPayload {
  body: string;
}

export interface CommentResponse {
  id: number;
  createdAt: string;
  updatedAt: string;
  body: string;
  author: UserResponse;
}