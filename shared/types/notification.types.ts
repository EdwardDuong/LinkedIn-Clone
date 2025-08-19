import { PublicUser } from './user.types';

export type NotificationType =
  | 'like'
  | 'comment'
  | 'connection_request'
  | 'connection_accepted'
  | 'message'
  | 'job_application';

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  senderId: string;
  sender?: PublicUser;
  referenceId?: string;
  content: string;
  isRead: boolean;
  createdAt: string;
}

export interface NotificationPreferences {
  likes: boolean;
  comments: boolean;
  connections: boolean;
  messages: boolean;
  jobAlerts: boolean;
  emailNotifications: boolean;
}
