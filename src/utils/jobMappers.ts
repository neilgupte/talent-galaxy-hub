
import { Job, JobEmploymentType, JobOnsiteType, JobLevel } from '@/types';

/**
 * Maps a database job record to our application Job model
 */
export const mapDatabaseJobToModel = (job: any): Job => {
  // Parse salary information from either salary_min/max fields or salary_range string
  let salaryMin = 0;
  let salaryMax = 0;
  
  if (job.salary_min !== undefined && job.salary_min !== null) {
    salaryMin = job.salary_min;
  } else if (job.salary_range) {
    const parts = job.salary_range.split('-');
    if (parts.length >= 1) {
      const parsedMin = parseInt(parts[0].trim(), 10);
      if (!isNaN(parsedMin)) {
        salaryMin = parsedMin;
      }
    }
  }
  
  if (job.salary_max !== undefined && job.salary_max !== null) {
    salaryMax = job.salary_max;
  } else if (job.salary_range) {
    const parts = job.salary_range.split('-');
    if (parts.length >= 2) {
      const parsedMax = parseInt(parts[1].trim(), 10);
      if (!isNaN(parsedMax)) {
        salaryMax = parsedMax;
      }
    }
  }
  
  // Handle requirements properly
  let requirements: string[] = [];
  if (job.requirements) {
    if (typeof job.requirements === 'string') {
      requirements = job.requirements.split(',').map((item: string) => item.trim());
    } else if (Array.isArray(job.requirements)) {
      requirements = job.requirements;
    }
  }
  
  return {
    id: job.id,
    companyId: job.company_id,
    title: job.title,
    description: job.description || '',
    location: job.location || '',
    salaryMin: salaryMin,
    salaryMax: salaryMax,
    employmentType: (job.employment_type || 'full_time') as JobEmploymentType,
    onsiteType: (job.onsite_type || 'onsite') as JobOnsiteType,
    jobLevel: (job.job_level || 'entry') as JobLevel,
    requirements: requirements,
    status: (job.status || 'active') as 'draft' | 'active' | 'expired' | 'closed',
    isHighPriority: job.is_high_priority || false,
    isBoosted: job.is_boosted || false,
    endDate: job.end_date || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: job.created_at,
    updatedAt: job.updated_at || job.created_at,
    country: job.country || '',
    city: job.city || '',
    currency: job.currency || 'USD',
    company: job.companies ? {
      id: job.companies.id,
      name: job.companies.name,
      industry: job.companies.industry || '',
      description: job.companies.description || '',
      logoUrl: job.companies.logo_url || '/placeholder.svg',
      planType: job.companies.plan_type || 'free'
    } : undefined
  };
};
