export interface UserPayload {
  username: string;
  email: string;
  password: string;
}

export interface UserResponse {
  username: string;
  email: string;
  token: string;
  bio?: string;
  image?: string;
}