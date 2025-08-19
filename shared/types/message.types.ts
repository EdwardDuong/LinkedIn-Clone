import { PublicUser } from './user.types';

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  recipientId: string;
  sender?: PublicUser;
  recipient?: PublicUser;
  content: string;
  mediaUrl?: string;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Conversation {
  id: string;
  participantOneId: string;
  participantTwoId: string;
  participantOne?: PublicUser;
  participantTwo?: PublicUser;
  lastMessage?: Message;
  lastMessageAt: string;
  createdAt: string;
  unreadCount?: number;
}

export interface SendMessageData {
  recipientId: string;
  content: string;
  mediaUrl?: string;
}

export interface TypingIndicator {
  userId: string;
  conversationId: string;
  isTyping: boolean;
}
