import { PublicUser } from './user.types';

export type ConnectionStatus = 'pending' | 'accepted' | 'rejected';

export interface Connection {
  id: string;
  requesterId: string;
  recipientId: string;
  status: ConnectionStatus;
  createdAt: string;
  updatedAt: string;
}

export interface ConnectionWithUser extends Connection {
  user: PublicUser;
}

export interface ConnectionRequest {
  id: string;
  requester: PublicUser;
  createdAt: string;
}

export interface ConnectionSuggestion {
  user: PublicUser;
  mutualConnections: number;
  reason?: string;
}
