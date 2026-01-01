import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import postsReducer from '../features/posts/postsSlice';
import { notificationApi } from '../services/api/notificationApi';
import { messageApi } from '../services/api/messageApi';
import { profileApi } from '../services/api/profileApi';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    posts: postsReducer,
    [notificationApi.reducerPath]: notificationApi.reducer,
    [messageApi.reducerPath]: messageApi.reducer,
    [profileApi.reducerPath]: profileApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ['auth/setCredentials'],
      },
    })
      .concat(notificationApi.middleware)
      .concat(messageApi.middleware)
      .concat(profileApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
