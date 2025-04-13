
export interface Company {
  id: string;
  name: string;
  industry: string;
  description: string;
  logoUrl?: string;
  planType: string;
  jobsPosted?: number;
  website?: string;
  logo?: string;
  size?: string;
  founded?: string;
  location?: string;
  phone?: string;
  email?: string;
  recruiterType: 'internal' | 'agency';
  hasWebsite?: boolean;
  companyType?: string;
}
