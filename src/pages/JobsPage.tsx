
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Skeleton } from '@/components/ui/skeleton';
import { Job, JobEmploymentType, JobOnsiteType, JobLevel } from '@/types';
import JobFilters from '@/components/jobs/JobFilters';
import JobList from '@/components/jobs/JobList';
import JobSearchBar from '@/components/jobs/JobSearchBar';
import JobListHeader from '@/components/jobs/JobListHeader';

// Jobs per page for pagination
const JOBS_PER_PAGE = 20;

const JobsPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilters, setSelectedFilters] = useState<{
    employmentTypes: string[];
    jobLevels: string[];
    onsiteTypes: string[];
    salaryRange: [number, number];
  }>({
    employmentTypes: [],
    jobLevels: [],
    onsiteTypes: [],
    salaryRange: [0, 250000],
  });
  const [sortBy, setSortBy] = useState<'date' | 'salary'>('date');
  
  // Fetch jobs with pagination
  const { data, isLoading, error } = useQuery({
    queryKey: ['jobs', currentPage, searchQuery, selectedFilters, sortBy],
    queryFn: async () => {
      console.log('Fetching jobs, page:', currentPage);
      // Calculate range for pagination
      const from = (currentPage - 1) * JOBS_PER_PAGE;
      const to = from + JOBS_PER_PAGE - 1;
      
      // Start building the query
      let query = supabase
        .from('jobs')
        .select('*, companies(*)', { count: 'exact' })
        .eq('status', 'active');
      
      // Apply search filter if provided
      if (searchQuery) {
        query = query.or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`);
      }
      
      // Apply employment type filter
      if (selectedFilters.employmentTypes.length > 0) {
        query = query.in('employment_type', selectedFilters.employmentTypes);
      }
      
      // Apply job level filter
      if (selectedFilters.jobLevels.length > 0) {
        query = query.in('job_level', selectedFilters.jobLevels);
      }
      
      // Apply onsite type filter
      if (selectedFilters.onsiteTypes.length > 0) {
        query = query.in('onsite_type', selectedFilters.onsiteTypes);
      }
      
      // Apply sorting
      if (sortBy === 'date') {
        query = query.order('created_at', { ascending: false });
      } else if (sortBy === 'salary') {
        // This is an imperfect sort as we're using a text field for salary range
        // A better approach would be to have min and max salary as separate numeric fields
        query = query.order('salary_range', { ascending: false });
      }
      
      // Apply pagination
      query = query.range(from, to);
      
      const { data, error, count } = await query;
      
      if (error) {
        console.error('Error fetching jobs:', error);
        throw error;
      }
      
      console.log(`Fetched ${data.length} jobs out of ${count} total`);
      
      return {
        jobs: data.map(job => mapDatabaseJobToModel(job)),
        totalCount: count || 0,
      };
    },
  });
  
  // Map database job to frontend model
  const mapDatabaseJobToModel = (job: any): Job => {
    return {
      id: job.id,
      companyId: job.company_id,
      title: job.title,
      description: job.description,
      location: job.location,
      salaryMin: job.salary_range ? parseInt(job.salary_range.split('-')[0]) : undefined,
      salaryMax: job.salary_range ? parseInt(job.salary_range.split('-')[1]) : undefined,
      employmentType: job.employment_type as JobEmploymentType,
      onsiteType: job.onsite_type as JobOnsiteType,
      jobLevel: job.job_level as JobLevel,
      requirements: job.requirements ? job.requirements.split(',').map((item: string) => item.trim()) : [],
      status: job.status as 'draft' | 'active' | 'expired' | 'closed',
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
    };
  };
  
  // Calculate total pages
  const totalPages = data ? Math.ceil(data.totalCount / JOBS_PER_PAGE) : 0;
  
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1); // Reset to first page on new search
  };
  
  const handleFilterChange = (newFilters: typeof selectedFilters) => {
    setSelectedFilters(newFilters);
    setCurrentPage(1); // Reset to first page on filter change
  };
  
  const handleSortChange = (sortValue: 'date' | 'salary') => {
    setSortBy(sortValue);
  };
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top of page
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  // Generate pagination items
  const renderPaginationItems = () => {
    if (totalPages <= 7) {
      // Show all pages if 7 or fewer
      return Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
        <PaginationItem key={page}>
          <PaginationLink 
            isActive={currentPage === page}
            onClick={() => handlePageChange(page)}
          >
            {page}
          </PaginationLink>
        </PaginationItem>
      ));
    } else {
      // Show pages with ellipsis for many pages
      const items = [];
      
      // Always add first page
      items.push(
        <PaginationItem key="first">
          <PaginationLink 
            isActive={currentPage === 1}
            onClick={() => handlePageChange(1)}
          >
            1
          </PaginationLink>
        </PaginationItem>
      );
      
      // Add ellipsis if current page is far from start
      if (currentPage > 3) {
        items.push(
          <PaginationItem key="ellipsis1">
            <span className="flex h-9 w-9 items-center justify-center">...</span>
          </PaginationItem>
        );
      }
      
      // Add pages around current page
      const startPage = Math.max(2, currentPage - 1);
      const endPage = Math.min(totalPages - 1, currentPage + 1);
      
      for (let i = startPage; i <= endPage; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink 
              isActive={currentPage === i}
              onClick={() => handlePageChange(i)}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }
      
      // Add ellipsis if current page is far from end
      if (currentPage < totalPages - 2) {
        items.push(
          <PaginationItem key="ellipsis2">
            <span className="flex h-9 w-9 items-center justify-center">...</span>
          </PaginationItem>
        );
      }
      
      // Always add last page
      items.push(
        <PaginationItem key="last">
          <PaginationLink 
            isActive={currentPage === totalPages}
            onClick={() => handlePageChange(totalPages)}
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
      
      return items;
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Browse Jobs</h1>
      
      <div className="mb-8">
        <JobSearchBar onSearch={handleSearch} initialQuery={searchQuery} />
      </div>
      
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Filters */}
        <div className="w-full lg:w-72">
          <JobFilters 
            filters={selectedFilters}
            onChange={handleFilterChange}
          />
        </div>
        
        {/* Results */}
        <div className="flex-1">
          <JobListHeader 
            totalJobs={data?.totalCount || 0}
            sortBy={sortBy}
            onSortChange={handleSortChange}
          />
          
          {isLoading ? (
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
            <div className="text-center py-10">
              <h3 className="text-xl font-medium text-red-500 mb-2">Error loading jobs</h3>
              <p className="text-muted-foreground mb-4">
                {error instanceof Error ? error.message : 'An error occurred while loading jobs.'}
              </p>
            </div>
          ) : (
            <JobList jobs={data?.jobs || []} />
          )}
          
          {/* Pagination */}
          {totalPages > 1 && (
            <Pagination className="my-8">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
                    aria-disabled={currentPage === 1}
                    className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
                
                {renderPaginationItems()}
                
                <PaginationItem>
                  <PaginationNext 
                    onClick={() => handlePageChange(Math.min(currentPage + 1, totalPages))}
                    aria-disabled={currentPage === totalPages}
                    className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobsPage;
