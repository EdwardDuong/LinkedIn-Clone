export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  headline?: string;
  profilePicture?: string;
  coverImage?: string;
  about?: string;
  location?: string;
  industry?: string;
  createdAt: string;
  updatedAt: string;
  lastLogin?: string;
  isVerified: boolean;
  isActive: boolean;
}

export interface UserProfile extends User {
  skills?: UserSkill[];
  experiences?: UserExperience[];
  connectionsCount?: number;
}

export interface UserSkill {
  id: string;
  userId: string;
  skillName: string;
  endorsementCount: number;
  createdAt: string;
}

export interface UserExperience {
  id: string;
  userId: string;
  companyName: string;
  position: string;
  location?: string;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
  description?: string;
  createdAt: string;
}

export interface PublicUser {
  id: string;
  firstName: string;
  lastName: string;
  headline?: string;
  profilePicture?: string;
  industry?: string;
}
