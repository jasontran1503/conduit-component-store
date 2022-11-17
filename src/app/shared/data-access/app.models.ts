export type ApiStatus = 'idle' | 'success' | 'error' | 'loading';

export type FeedType = 'feed' | 'global';

export type AuthStatus = 'idle' | 'authenticated' | 'unauthenticated';

export type ProfileArticlesType = 'author' | 'favorited';

export interface LoginUser {
  email: string;
  password: string;
}

export interface LoginUserRequest {
  user: LoginUser;
}

export interface NewUser {
  username: string;
  email: string;
  password: string;
}

export interface NewUserRequest {
  user: NewUser;
}

export interface User {
  email: string;
  token: string;
  username: string;
  bio: string;
  image: string;
}

export interface UserResponse {
  user: User;
}

export interface UpdateUser {
  email?: string | null;
  token?: string | null;
  username?: string | null;
  bio?: string | null;
  image?: string | null;
}

export interface UpdateUserRequest {
  user: UpdateUser;
}

export interface ProfileResponse {
  profile: Profile;
}

export interface Profile {
  username: string;
  bio: string;
  image: string;
  following: boolean;
}

export interface Article {
  slug: string;
  title: string;
  description: string;
  body: string;
  tagList: string[];
  createdAt: Date;
  updatedAt: Date;
  favorited: boolean;
  favoritesCount: number;
  author: Profile;
}

export interface SingleArticleResponse {
  article: Article;
}

export interface MultipleArticlesResponse {
  articles: Article[];
  articlesCount: number;
}

export interface NewArticle {
  title: string;
  description: string;
  body: string;
  tagList?: string[] | null;
}

export interface NewArticleRequest {
  article: NewArticle;
}

export interface UpdateArticle {
  title?: string | null;
  description?: string | null;
  body?: string | null;
}

export interface UpdateArticleRequest {
  article: UpdateArticle;
}

export interface Comment {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  body: string;
  author: Profile;
}

export interface SingleCommentResponse {
  comment: Comment;
}

export interface MultipleCommentsResponse {
  comments: Comment[];
}

export interface NewComment {
  body: string;
}

export interface NewCommentRequest {
  comment: NewComment;
}

export interface TagsResponse {
  tags: string[];
}

export interface GenericErrorModel {
  errors: Errors;
}

export interface Errors {
  body: string[];
}
