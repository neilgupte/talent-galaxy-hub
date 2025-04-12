
import { AlertFrequency } from './common-types';
import { JobEmploymentType, JobLevel } from './job-types';

export interface JobAlert {
  id: string;
  userId: string;
  keywords: string[];
  location: string | null;
  employmentTypes: JobEmploymentType[] | null;
  jobLevels: JobLevel[] | null;
  salaryMin: number | null;
  salaryMax: number | null;
  frequency: AlertFrequency;
  isActive: boolean;
  createdAt: string;
  lastTriggeredAt: string | null;
  nextScheduledAt: string | null;
}
