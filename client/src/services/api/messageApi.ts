import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery } from './axios.config';

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  recipientId: string;
  content: string;
  isRead: boolean;
  createdAt: string;
}

export interface PublicUser {
  id: string;
  firstName: string;
  lastName: string;
  headline?: string;
  profilePicture?: string;
  location?: string;
}

export interface Conversation {
  id: string;
  otherUser: PublicUser;
  lastMessage?: Message;
  lastMessageAt?: string;
  unreadCount: number;
}

export interface SendMessageDto {
  recipientId: string;
  content: string;
}

export const messageApi = createApi({
  reducerPath: 'messageApi',
  baseQuery,
  tagTypes: ['Conversations', 'Messages'],
  endpoints: (builder) => ({
    getConversations: builder.query<Conversation[], void>({
      query: () => '/Messages/conversations',
      providesTags: ['Conversations'],
    }),
    getConversationMessages: builder.query<Message[], string>({
      query: (conversationId) => `/Messages/conversations/${conversationId}`,
      providesTags: (result, error, conversationId) => [
        { type: 'Messages', id: conversationId },
      ],
    }),
    sendMessage: builder.mutation<Message, SendMessageDto>({
      query: (data) => ({
        url: '/Messages',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Conversations', 'Messages'],
    }),
    markAsRead: builder.mutation<void, string>({
      query: (conversationId) => ({
        url: `/Messages/conversations/${conversationId}/read`,
        method: 'PUT',
      }),
      invalidatesTags: ['Conversations'],
    }),
  }),
});

export const {
  useGetConversationsQuery,
  useGetConversationMessagesQuery,
  useSendMessageMutation,
  useMarkAsReadMutation,
} = messageApi;
