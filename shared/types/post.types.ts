import { PublicUser } from './user.types';

export interface Post {
  id: string;
  userId: string;
  author: PublicUser;
  content: string;
  mediaUrl?: string;
  mediaType?: 'image' | 'video' | 'document';
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  isLiked?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  id: string;
  postId: string;
  userId: string;
  author: PublicUser;
  content: string;
  parentCommentId?: string;
  likesCount: number;
  isLiked?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PostLike {
  id: string;
  postId: string;
  userId: string;
  createdAt: string;
}

export interface CreatePostData {
  content: string;
  mediaUrl?: string;
  mediaType?: 'image' | 'video' | 'document';
}

export interface UpdatePostData {
  content?: string;
  mediaUrl?: string;
}

export interface CreateCommentData {
  content: string;
  parentCommentId?: string;
}
