import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { postsApi } from '../../services/api/postsApi';
import type { Post, CreatePostRequest } from '../../../../shared/types/post.types';

interface PostsState {
  posts: Post[];
  currentPost: Post | null;
  isLoading: boolean;
  error: string | null;
  hasMore: boolean;
  page: number;
}

const initialState: PostsState = {
  posts: [],
  currentPost: null,
  isLoading: false,
  error: null,
  hasMore: true,
  page: 1,
};

// Async thunks
export const createPost = createAsyncThunk(
  'posts/create',
  async (data: CreatePostRequest, { rejectWithValue }) => {
    try {
      const response = await postsApi.createPost(data);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create post');
    }
  }
);

// TODO: Add more thunks
// export const fetchPosts = createAsyncThunk(
//   'posts/fetchPosts',
//   async ({ page, limit }: { page: number; limit: number }, { rejectWithValue }) => {
//     try {
//       const response = await postsApi.getFeed(page, limit);
//       return response;
//     } catch (error: any) {
//       return rejectWithValue(error.response?.data?.message || 'Failed to fetch posts');
//     }
//   }
// );

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    addPost: (state, action: PayloadAction<Post>) => {
      state.posts.unshift(action.payload);
    },
    updatePost: (state, action: PayloadAction<Post>) => {
      const index = state.posts.findIndex((p) => p.id === action.payload.id);
      if (index !== -1) {
        state.posts[index] = action.payload;
      }
    },
    removePost: (state, action: PayloadAction<string>) => {
      state.posts = state.posts.filter((p) => p.id !== action.payload);
    },
    resetPosts: (state) => {
      state.posts = [];
      state.page = 1;
      state.hasMore = true;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Create post
    builder
      .addCase(createPost.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.isLoading = false;
        state.posts.unshift(action.payload);
      })
      .addCase(createPost.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // TODO: Add more cases for fetchPosts, likePost, deletePost, etc.
  },
});

export const { addPost, updatePost, removePost, resetPosts, clearError } = postsSlice.actions;
export default postsSlice.reducer;
