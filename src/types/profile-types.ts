
import { ContactPreference, JobSeekerStatus } from './common-types';

export interface Profile {
  userId: string;
  headline: string;
  bio: string;
  location: string;
  currentTitle: string;
  skills: string[];
  avatarUrl?: string;
  phone?: string;
  contactPreference?: ContactPreference;
  jobSeekerStatus?: JobSeekerStatus;
  cvs?: CV[];
}

export interface CV {
  id: string;
  userId: string;
  fileName: string;
  fileUrl: string;
  uploadDate: string;
  isDefault?: boolean;
}

export interface Experience {
  id: string;
  profileId: string;
  title: string;
  company: string;
  startDate: string;
  endDate?: string;
  isCurrent?: boolean;
  description: string;
}

export interface Education {
  id: string;
  profileId: string;
  degree: string;
  institution: string;
  startYear: number;
  endYear?: number;
  isCurrent?: boolean;
}

// Add JobSeekerStatus type since it's referenced but not defined in common-types
export type JobSeekerStatus = 'not_open' | 'employed_but_open' | 'actively_seeking';
