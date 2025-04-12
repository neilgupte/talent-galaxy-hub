
import { Company } from './company-types';

export type JobEmploymentType = 'full_time' | 'part_time' | 'contract' | 'temporary' | 'internship' | 'job_share';

export type JobOnsiteType = 'onsite' | 'hybrid' | 'remote';

export type JobLevel = 'entry' | 'junior' | 'mid' | 'senior' | 'executive';

export interface Job {
  id: string;
  companyId: string;
  title: string;
  description: string;
  location: string;
  locations?: string[];
  salaryMin?: number;
  salaryMax?: number;
  employmentType: JobEmploymentType;
  onsiteType: JobOnsiteType;
  jobLevel: JobLevel;
  requirements: string[];
  benefits?: string[];
  status: 'draft' | 'active' | 'expired' | 'closed';
  isHighPriority: boolean;
  isBoosted: boolean;
  endDate: string;
  createdAt: string;
  updatedAt: string;
  country?: string;
  city?: string;
  currency?: string;
  acceptsInternationalApplications?: boolean;
  visaSponsorshipAvailable?: boolean;
  
  // Joined fields
  company?: Company;
  questions?: JobQuestion[];
  matchPercentage?: number;
  hasApplied?: boolean;
  applicationStatus?: ApplicationStatus;
  applicationId?: string;
}

export interface JobQuestion {
  id: string;
  jobId: string;
  questionText: string;
  type: QuestionType;
  isRequired: boolean;
  isKnockout: boolean;
  idealAnswer?: string;
  options?: string[];
}

export type QuestionType = 'text' | 'mcq' | 'yesno';
