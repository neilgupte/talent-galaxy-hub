export type UserRole = 'job_seeker' | 'employer' | 'admin';

export type JobEmploymentType = 'full_time' | 'part_time' | 'contract' | 'temporary' | 'internship' | 'job_share';

export type JobOnsiteType = 'onsite' | 'hybrid' | 'remote';

export type JobLevel = 'entry' | 'junior' | 'mid' | 'senior' | 'executive';

export type ApplicationStatus = 
  | 'pending'
  | 'reviewing' 
  | 'interview' 
  | 'offer' 
  | 'rejected' 
  | 'accepted'
  | 'withdrawn';

export type QuestionType = 'text' | 'mcq' | 'yesno';

export type JobSeekerStatus = 'not_open' | 'employed_but_open' | 'actively_seeking';

export type ContactPreference = 'email' | 'phone' | 'both';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string; // Added phone as optional property
  createdAt: string;
}

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

export interface Company {
  id: string;
  name: string;
  industry: string;
  description: string;
  logoUrl?: string;
  planType: string;
  jobsPosted?: number;
}

export interface Job {
  id: string;
  companyId: string;
  title: string;
  description: string;
  location: string;
  salaryMin?: number;
  salaryMax?: number;
  employmentType: JobEmploymentType;
  onsiteType: JobOnsiteType;
  jobLevel: JobLevel;
  requirements: string[];
  status: 'draft' | 'active' | 'expired' | 'closed';
  isHighPriority: boolean;
  isBoosted: boolean;
  endDate: string;
  createdAt: string;
  updatedAt: string;
  country?: string;
  city?: string;
  currency?: string;
  
  // Joined fields
  company?: Company;
  questions?: JobQuestion[];
  matchPercentage?: number; // Calculated field for job seekers
  hasApplied?: boolean; // Flag if the current user has applied
  applicationStatus?: ApplicationStatus; // Current status if applied
  applicationId?: string; // Reference to the user's application for this job
}

export interface JobQuestion {
  id: string;
  jobId: string;
  questionText: string;
  type: QuestionType;
  isRequired: boolean;
  isKnockout: boolean;
  idealAnswer?: string;
  options?: string[]; // For MCQ questions
}

export interface Application {
  id: string;
  userId: string;
  jobId: string;
  appliedAt: string;
  status: ApplicationStatus;
  aiScore?: number;
  feedbackText?: string;
  appealMessage?: string;
  
  // Joined fields
  job?: Job;
  answers?: Answer[];
}

export interface Answer {
  id: string;
  applicationId: string;
  questionId: string;
  answerText: string;
  aiScore?: number;
}

export interface CV {
  id: string;
  userId: string;
  fileName: string;
  fileUrl: string;
  uploadDate: string;
  isDefault?: boolean;
}

export interface AuthState {
  user: User | null;
  profile: Profile | null;
  company: Company | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface GeolocationInfo {
  country: string;
  city: string;
  countryCode: string;
  currency: {
    code: string;
    symbol: string;
  };
}
