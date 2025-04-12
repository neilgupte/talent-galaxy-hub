
import { Job } from './job-types';

export type ApplicationStatus = 
  | 'pending'
  | 'reviewing' 
  | 'interview' 
  | 'offer' 
  | 'rejected' 
  | 'accepted'
  | 'withdrawn';

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
