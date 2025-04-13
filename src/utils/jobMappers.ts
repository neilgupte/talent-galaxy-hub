
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
  
  // Map locations array or set to single location if not available
  let locations: string[] = [];
  if (job.locations && Array.isArray(job.locations) && job.locations.length > 0) {
    locations = job.locations;
  } else if (job.location) {
    locations = [job.location];
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

  // Handle benefits properly
  let benefits: string[] = [];
  if (job.benefits) {
    if (typeof job.benefits === 'string') {
      benefits = job.benefits.split('\n').map((item: string) => item.trim()).filter(Boolean);
    } else if (Array.isArray(job.benefits)) {
      benefits = job.benefits;
    }
  }
  
  // Set default benefits if none are provided
  if (benefits.length === 0) {
    benefits = [
      "Competitive salary and performance bonuses",
      "Flexible working hours and remote work options",
      "Comprehensive health, dental, and vision insurance",
      "25 days annual leave plus bank holidays",
      "Professional development budget and learning opportunities",
      "Company pension scheme with employer contributions"
    ];
  }
  
  return {
    id: job.id,
    companyId: job.company_id,
    title: job.title,
    description: job.description || '',
    location: job.location || '',
    locations: locations,
    salaryMin: salaryMin,
    salaryMax: salaryMax,
    employmentType: (job.employment_type || 'full_time') as JobEmploymentType,
    onsiteType: (job.onsite_type || 'onsite') as JobOnsiteType,
    jobLevel: (job.job_level || 'entry') as JobLevel,
    requirements: requirements,
    benefits: benefits,
    status: (job.status || 'active') as 'draft' | 'active' | 'expired' | 'closed',
    isHighPriority: job.is_high_priority || false,
    isBoosted: job.is_boosted || false,
    endDate: job.end_date || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: job.created_at,
    updatedAt: job.updated_at || job.created_at,
    country: job.country || 'UK', // Default to UK for the UK site
    city: job.city || '',
    currency: job.currency || 'GBP', // Default to GBP since country is UK
    acceptsInternationalApplications: job.accepts_international_applications || false,
    visaSponsorshipAvailable: job.visa_sponsorship_available || false,
    company: job.companies ? {
      id: job.companies.id,
      name: job.companies.name || 'Creative Tech Solutions', // Default company name
      industry: job.companies.industry || 'Technology',
      description: job.companies.description || 'A leading technology company focused on innovative digital experiences.',
      logoUrl: job.companies.logo_url || '/lovable-uploads/51540783-120d-4616-82a5-16011c4b6344.png', // Use the uploaded logo
      planType: job.companies.plan_type || 'free',
      recruiterType: job.companies.recruiter_type || 'internal' // Add default recruiterType
    } : {
      id: 'default-company',
      name: 'Creative Tech Solutions',
      industry: 'Technology',
      description: 'A leading technology company focused on innovative digital experiences.',
      logoUrl: '/lovable-uploads/51540783-120d-4616-82a5-16011c4b6344.png',
      planType: 'free',
      recruiterType: 'internal' // Add default recruiterType
    }
  };
};
