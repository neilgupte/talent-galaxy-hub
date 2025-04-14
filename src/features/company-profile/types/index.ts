
// Re-export the company types from the main types file
export type { Company } from '@/types/company-types';

// Form data type specifically for company profile
export interface CompanyFormData {
  name: string;
  description?: string;
  website: string;
  logo: string;
  industry: string;
  size: string;
  founded: string;
  location: string;
  phone: string;
  email: string;
  recruiterType: 'internal' | 'agency';
  hasWebsite: boolean;
  companyType: string;
}
