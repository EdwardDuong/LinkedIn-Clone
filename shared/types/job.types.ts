import { PublicUser } from './user.types';

export type EmploymentType = 'full-time' | 'part-time' | 'contract' | 'internship';
export type WorkplaceType = 'on-site' | 'remote' | 'hybrid';
export type ExperienceLevel = 'entry' | 'mid' | 'senior' | 'executive';
export type ApplicationStatus = 'applied' | 'reviewing' | 'interview' | 'rejected' | 'accepted';

export interface Job {
  id: string;
  companyId: string;
  company?: PublicUser;
  title: string;
  description: string;
  location?: string;
  employmentType?: EmploymentType;
  workplaceType?: WorkplaceType;
  experienceLevel?: ExperienceLevel;
  skillsRequired?: string[];
  salaryMin?: number;
  salaryMax?: number;
  applicationsCount: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface JobApplication {
  id: string;
  jobId: string;
  userId: string;
  job?: Job;
  applicant?: PublicUser;
  coverLetter?: string;
  resumeUrl?: string;
  status: ApplicationStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateJobData {
  title: string;
  description: string;
  location?: string;
  employmentType?: EmploymentType;
  workplaceType?: WorkplaceType;
  experienceLevel?: ExperienceLevel;
  skillsRequired?: string[];
  salaryMin?: number;
  salaryMax?: number;
}

export interface JobFilters {
  location?: string;
  employmentType?: EmploymentType;
  workplaceType?: WorkplaceType;
  experienceLevel?: ExperienceLevel;
  search?: string;
}

export interface ApplyToJobData {
  coverLetter?: string;
  resumeUrl?: string;
}
