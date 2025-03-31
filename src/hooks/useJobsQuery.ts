import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Job, JobEmploymentType, JobOnsiteType, JobLevel } from '@/types';

export interface JobFilters {
  employmentTypes: string[];
  jobLevels: string[];
  onsiteTypes: string[];
  salaryRange: [number, number];
}

interface UseJobsQueryProps {
  searchQuery: string;
  currentPage: number;
  selectedFilters: JobFilters;
  sortBy: 'date' | 'salary';
  jobsPerPage: number;
}

const mapDatabaseJobToModel = (job: any): Job => {
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

export const useJobsQuery = ({
  searchQuery,
  currentPage,
  selectedFilters,
  sortBy,
  jobsPerPage
}: UseJobsQueryProps) => {
  return useQuery({
    queryKey: ['jobs', currentPage, searchQuery, selectedFilters, sortBy],
    queryFn: async () => {
      console.log('Fetching jobs, page:', currentPage, 'query:', searchQuery);
      const from = (currentPage - 1) * jobsPerPage;
      const to = from + jobsPerPage - 1;
      
      try {
        let query = supabase
          .from('jobs')
          .select('*, companies(*)', { count: 'exact' })
          .eq('status', 'active'); 
        
        if (searchQuery) {
          query = query.or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%,location.ilike.%${searchQuery}%`);
        }
        
        if (selectedFilters.employmentTypes.length > 0) {
          query = query.in('employment_type', selectedFilters.employmentTypes);
        }
        
        if (selectedFilters.jobLevels.length > 0) {
          query = query.in('job_level', selectedFilters.jobLevels);
        }
        
        if (selectedFilters.onsiteTypes.length > 0) {
          query = query.in('onsite_type', selectedFilters.onsiteTypes);
        }
        
        // Add salary range filter
        if (selectedFilters.salaryRange[0] > 0) {
          query = query.gte('salary_min', selectedFilters.salaryRange[0]);
        }
        
        if (selectedFilters.salaryRange[1] < 250000) {
          query = query.lte('salary_max', selectedFilters.salaryRange[1]);
        }
        
        if (sortBy === 'date') {
          query = query.order('created_at', { ascending: false });
        } else if (sortBy === 'salary') {
          query = query.order('salary_max', { ascending: false });
        }
        
        query = query.range(from, to);
        
        let { data, error, count } = await query;
        console.log('🔥 Supabase returned:', data, 'Count:', count);
        
        if (error) {
          console.error('Error fetching jobs:', error);
          toast.error('Failed to fetch jobs. Please try again.');
          throw error;
        }
        
        let jobsData = data || [];
        console.log(`Fetched ${jobsData.length} jobs out of ${count || 0} total`);
        
        const mappedJobs = jobsData.map(job => mapDatabaseJobToModel(job));
        console.log('🟢 Final job data:', mappedJobs.length, mappedJobs);

        return {
          jobs: mappedJobs,
          totalCount: count || 0,
        };
      } catch (err) {
        console.error('Exception fetching jobs:', err);
        throw err;
      }
    },
    staleTime: 1000 * 30, // 30 seconds stale time
  });
};
