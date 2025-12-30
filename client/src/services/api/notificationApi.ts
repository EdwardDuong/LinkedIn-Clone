import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery } from './axios.config';

export interface Notification {
  id: string;
  userId: string;
  type: string;
  message: string;
  link?: string;
  isRead: boolean;
  createdAt: string;
}

export const notificationApi = createApi({
  reducerPath: 'notificationApi',
  baseQuery,
  tagTypes: ['Notifications'],
  endpoints: (builder) => ({
    getNotifications: builder.query<Notification[], boolean>({
      query: (unreadOnly = false) => `/Notifications?unreadOnly=${unreadOnly}`,
      providesTags: ['Notifications'],
    }),
    markAsRead: builder.mutation<void, string>({
      query: (notificationId) => ({
        url: `/Notifications/${notificationId}/read`,
        method: 'PUT',
      }),
      invalidatesTags: ['Notifications'],
    }),
  }),
});

export const { useGetNotificationsQuery, useMarkAsReadMutation } = notificationApi;
