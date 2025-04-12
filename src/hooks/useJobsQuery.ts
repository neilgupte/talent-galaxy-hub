
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Job, JobEmploymentType, JobOnsiteType, JobLevel } from '@/types';
import { mapDatabaseJobToModel } from '@/utils/jobMappers';

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
  fetchAllJobs?: boolean; // Parameter to fetch all jobs without filters
  countryCode?: string; // New parameter for country filtering
}

export const useJobsQuery = ({
  searchQuery,
  currentPage,
  selectedFilters,
  sortBy,
  jobsPerPage,
  fetchAllJobs = false,
  countryCode = 'UK' // Default to UK for geo-targeting
}: UseJobsQueryProps) => {
  return useQuery({
    queryKey: ['jobs', currentPage, searchQuery, selectedFilters, sortBy, fetchAllJobs, countryCode],
    queryFn: async () => {
      console.log('Fetching jobs, page:', currentPage, 'query:', searchQuery, 'fetchAllJobs:', fetchAllJobs, 'country:', countryCode);
      
      try {
        let query = supabase
          .from('jobs')
          .select('*, companies(*)');
        
        // If fetchAllJobs is true, skip all filters and pagination
        if (fetchAllJobs) {
          console.log('🔥 Fetching ALL jobs without filters or pagination');
          query = query.eq('status', 'active').order('created_at', { ascending: false });
        } else {
          // Apply standard filtering and pagination
          const from = (currentPage - 1) * jobsPerPage;
          const to = from + jobsPerPage - 1;
          
          query = query.eq('status', 'active'); 
          
          // Apply country filter for geo-targeting
          // Either the country matches or the locations array contains the country
          if (countryCode) {
            query = query.or(`country.eq.${countryCode},locations.cs.{"${countryCode}"}`);
          }
          
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
        }
        
        let { data, error, count } = await query;
        console.log('🔥 Supabase returned:', data?.length || 0, 'jobs');
        
        if (error) {
          console.error('Error fetching jobs:', error);
          toast.error('Failed to fetch jobs. Please try again.');
          throw error;
        }
        
        let jobsData = data || [];
        
        const mappedJobs = jobsData.map(job => mapDatabaseJobToModel(job));
        console.log('🟢 Final job data:', mappedJobs.length, mappedJobs);

        return {
          jobs: mappedJobs,
          totalCount: fetchAllJobs ? mappedJobs.length : (count || 0),
        };
      } catch (err) {
        console.error('Exception fetching jobs:', err);
        throw err;
      }
    },
    staleTime: 1000 * 30, // 30 seconds stale time
    retry: 2, // Add retry logic in case of network issues
  });
};
