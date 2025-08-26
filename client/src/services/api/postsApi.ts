import axiosInstance from './axios.config';
import type { Post, CreatePostRequest, Comment } from '../../../../shared/types/post.types';

export const postsApi = {
  createPost: async (data: CreatePostRequest): Promise<Post> => {
    const response = await axiosInstance.post<Post>('/posts', data);
    return response.data;
  },

  getFeed: async (page: number = 1, limit: number = 10): Promise<Post[]> => {
    const response = await axiosInstance.get<Post[]>(`/posts/feed?page=${page}&limit=${limit}`);
    return response.data;
  },

  likePost: async (postId: string): Promise<void> => {
    await axiosInstance.post(`/posts/${postId}/like`);
  },

  deletePost: async (postId: string): Promise<void> => {
    await axiosInstance.delete(`/posts/${postId}`);
  },

  getComments: async (postId: string): Promise<Comment[]> => {
    const response = await axiosInstance.get<Comment[]>(`/posts/${postId}/comments`);
    return response.data;
  },

  addComment: async (postId: string, content: string): Promise<Comment> => {
    const response = await axiosInstance.post<Comment>(`/posts/${postId}/comments`, { content });
    return response.data;
  },
};
