
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

export const useJobsQuery = ({
  searchQuery,
  currentPage,
  selectedFilters,
  sortBy,
  jobsPerPage
}: UseJobsQueryProps) => {
  const mapDatabaseJobToModel = (job: any): Job => {
    return {
      id: job.id,
      companyId: job.company_id,
      title: job.title,
      description: job.description,
      location: job.location,
      salaryMin: job.salary_min || parseInt(job.salary_range?.split('-')[0]) || 0,
      salaryMax: job.salary_max || parseInt(job.salary_range?.split('-')[1]) || 0,
      employmentType: job.employment_type as JobEmploymentType,
      onsiteType: job.onsite_type as JobOnsiteType,
      jobLevel: job.job_level as JobLevel,
      requirements: job.requirements ? (typeof job.requirements === 'string' ? job.requirements.split(',').map((item: string) => item.trim()) : job.requirements) : [],
      status: job.status as 'draft' | 'active' | 'expired' | 'closed',
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
          const salaryMinStr = selectedFilters.salaryRange[0].toString();
          query = query.gte('salary_range', `${salaryMinStr}-`);
        }
        
        if (selectedFilters.salaryRange[1] < 250000) {
          const salaryMaxStr = selectedFilters.salaryRange[1].toString();
          query = query.lte('salary_range', `-${salaryMaxStr}`);
        }
        
        if (sortBy === 'date') {
          query = query.order('created_at', { ascending: false });
        } else if (sortBy === 'salary') {
          query = query.order('salary_range', { ascending: false });
        }
        
        query = query.range(from, to);
        
        const { data, error, count } = await query;
        console.log('🔥 Supabase returned:', data, 'Count:', count);
        
        if (error) {
          console.error('Error fetching jobs:', error);
          toast.error('Failed to fetch jobs. Please try again.');
          throw error;
        }
        
        let jobsData = data || [];
        console.log(`Fetched ${jobsData.length} jobs out of ${count || 0} total`);
        
        // No mock data generation anymore - we only want to show real data
        // We just need to properly process the data from Supabase
        
        const mappedJobs = jobsData.map(job => mapDatabaseJobToModel(job));
        console.log('🟢 Final job data:', mappedJobs.length, mappedJobs);

        return {
          jobs: mappedJobs,
          totalCount: count || jobsData.length || 0,
        };
      } catch (err) {
        console.error('Exception fetching jobs:', err);
        throw err;
      }
    },
    staleTime: 1000 * 30, // Reduce stale time to 30 seconds while debugging
  });
};
