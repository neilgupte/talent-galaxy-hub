
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Skeleton } from '@/components/ui/skeleton';
import JobCard from '@/components/jobs/JobCard';
import JobSearch from '@/components/jobs/JobSearch';

// Jobs per page for pagination
const JOBS_PER_PAGE = 20;

const JobsPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  
  // Fetch jobs with pagination
  const { data, isLoading, error } = useQuery({
    queryKey: ['jobs', currentPage],
    queryFn: async () => {
      // Calculate range for pagination
      const from = (currentPage - 1) * JOBS_PER_PAGE;
      const to = from + JOBS_PER_PAGE - 1;
      
      // Fetch jobs with pagination
      const { data, error, count } = await supabase
        .from('jobs')
        .select('*, companies(*)', { count: 'exact' })
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .range(from, to);
      
      if (error) throw error;
      
      return {
        jobs: data,
        totalCount: count || 0,
      };
    },
  });
  
  // Calculate total pages
  const totalPages = data ? Math.ceil(data.totalCount / JOBS_PER_PAGE) : 0;
  
  // Generate pagination items
  const paginationItems = [];
  if (totalPages > 0) {
    // Add first page
    paginationItems.push(
      <PaginationItem key="first">
        <PaginationLink 
          isActive={currentPage === 1}
          onClick={() => setCurrentPage(1)}
        >
          1
        </PaginationLink>
      </PaginationItem>
    );
    
    // Add ellipsis if necessary
    if (currentPage > 3) {
      paginationItems.push(
        <PaginationItem key="ellipsis1">
          <span className="flex h-9 w-9 items-center justify-center">...</span>
        </PaginationItem>
      );
    }
    
    // Add pages around current page
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      if (i === 1 || i === totalPages) continue; // Skip first and last pages (handled separately)
      paginationItems.push(
        <PaginationItem key={i}>
          <PaginationLink 
            isActive={currentPage === i}
            onClick={() => setCurrentPage(i)}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }
    
    // Add ellipsis if necessary
    if (currentPage < totalPages - 2) {
      paginationItems.push(
        <PaginationItem key="ellipsis2">
          <span className="flex h-9 w-9 items-center justify-center">...</span>
        </PaginationItem>
      );
    }
    
    // Add last page if not the same as first
    if (totalPages > 1) {
      paginationItems.push(
        <PaginationItem key="last">
          <PaginationLink 
            isActive={currentPage === totalPages}
            onClick={() => setCurrentPage(totalPages)}
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Browse Jobs</h1>
      
      <JobSearch />
      
      <div className="my-8">
        {isLoading ? (
          // Loading skeleton
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="border rounded-lg p-4">
                <Skeleton className="h-8 w-[250px] mb-4" />
                <Skeleton className="h-4 w-[300px] mb-2" />
                <Skeleton className="h-4 w-[200px] mb-4" />
                <div className="flex flex-wrap gap-2 mt-2">
                  <Skeleton className="h-6 w-[80px]" />
                  <Skeleton className="h-6 w-[100px]" />
                  <Skeleton className="h-6 w-[90px]" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          // Error state
          <div className="text-center py-10">
            <h3 className="text-xl font-medium text-red-500 mb-2">Error loading jobs</h3>
            <p className="text-muted-foreground mb-4">
              {error instanceof Error ? error.message : 'An error occurred while loading jobs.'}
            </p>
          </div>
        ) : data?.jobs && data.jobs.length > 0 ? (
          // Jobs list
          <div className="space-y-4">
            {data.jobs.map((job) => (
              <JobCard 
                key={job.id} 
                job={{
                  id: job.id,
                  companyId: job.company_id,
                  title: job.title,
                  description: job.description,
                  location: job.location,
                  salaryMin: job.salary_range ? parseInt(job.salary_range.split('-')[0]) : undefined,
                  salaryMax: job.salary_range ? parseInt(job.salary_range.split('-')[1]) : undefined,
                  employmentType: job.employment_type,
                  onsiteType: job.onsite_type,
                  jobLevel: job.job_level,
                  requirements: job.requirements ? job.requirements.split(',') : [],
                  status: job.status,
                  isHighPriority: job.is_high_priority,
                  isBoosted: job.is_boosted,
                  endDate: job.end_date,
                  createdAt: job.created_at,
                  updatedAt: job.updated_at,
                  company: job.companies ? {
                    id: job.companies.id,
                    name: job.companies.name,
                    industry: job.companies.industry || '',
                    description: job.companies.description || '',
                    logoUrl: job.companies.logo_url || '/placeholder.svg',
                    planType: job.companies.plan_type || 'free'
                  } : undefined
                }} 
              />
            ))}
          </div>
        ) : (
          // No jobs found
          <div className="text-center py-10 border rounded-lg">
            <h3 className="text-xl font-medium mb-2">No jobs found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search filters or check back later for new opportunities.
            </p>
          </div>
        )}
      </div>
      
      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination className="my-8">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious 
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              />
            </PaginationItem>
            
            {paginationItems}
            
            <PaginationItem>
              <PaginationNext 
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
};

export default JobsPage;
