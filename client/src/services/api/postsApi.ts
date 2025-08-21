import axiosInstance from './axios.config';
import type { Post, CreatePostRequest } from '../../../../shared/types/post.types';

export const postsApi = {
  createPost: async (data: CreatePostRequest): Promise<Post> => {
    const response = await axiosInstance.post<Post>('/posts', data);
    return response.data;
  },

  // TODO: Add more endpoints
  // getFeed: async (page: number, limit: number): Promise<Post[]> => {
  //   const response = await axiosInstance.get<Post[]>(`/posts?page=${page}&limit=${limit}`);
  //   return response.data;
  // },

  // likePost: async (postId: string): Promise<void> => {
  //   await axiosInstance.post(`/posts/${postId}/like`);
  // },

  // deletePost: async (postId: string): Promise<void> => {
  //   await axiosInstance.delete(`/posts/${postId}`);
  // },
};
