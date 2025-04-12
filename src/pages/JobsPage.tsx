
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Job } from '@/types';
import { useJobsQuery, JobFilters as JobFiltersType } from '@/hooks/useJobsQuery';
import JobFiltersComponent from '@/components/jobs/JobFilters';
import JobSearchBar from '@/components/jobs/JobSearchBar';
import JobsPageContent from '@/components/jobs/JobsPageContent';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const JOBS_PER_PAGE = 20;

const JobsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  
  const initialQuery = queryParams.get('query') || '';
  const initialTitle = queryParams.get('title') || '';
  const initialLocation = queryParams.get('location') || '';
  const initialPage = parseInt(queryParams.get('page') || '1', 10);
  const countryCode = 'UK'; // Fixed to UK for now, could come from a country selector
  
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedFilters, setSelectedFilters] = useState<JobFiltersType>({
    employmentTypes: [],
    jobLevels: [],
    onsiteTypes: [],
    salaryRange: [0, 250000],
  });
  const [sortBy, setSortBy] = useState<'date' | 'salary'>('date');
  
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchQuery) params.set('query', searchQuery);
    if (currentPage > 1) params.set('page', currentPage.toString());
    
    navigate({
      pathname: location.pathname,
      search: params.toString()
    }, { replace: true });
  }, [searchQuery, currentPage, navigate, location.pathname]);
  
  const { data, isLoading, error, refetch } = useJobsQuery({
    searchQuery,
    currentPage,
    selectedFilters,
    sortBy,
    jobsPerPage: JOBS_PER_PAGE,
    countryCode
  });
  
  // Add automatic refetch when page loads
  useEffect(() => {
    // Refetch on component mount
    console.log("Component mounted, triggering refetch");
    refetch().catch(err => {
      console.error("Failed to fetch jobs:", err);
      toast.error("Failed to load jobs. Please try refreshing the page.");
    });
  }, [refetch]);
  
  const totalPages = data ? Math.ceil(data.totalCount / JOBS_PER_PAGE) : 0;
  
  const handleSearch = (query: string) => {
    console.log('Search query:', query);
    setSearchQuery(query);
    setCurrentPage(1);
  };
  
  const handleFilterChange = (newFilters: JobFiltersType) => {
    setSelectedFilters(newFilters);
    setCurrentPage(1);
  };
  
  const handleSortChange = (sortValue: 'date' | 'salary') => {
    setSortBy(sortValue);
  };
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top when page changes
    window.scrollTo(0, 0);
  };
  
  console.log('Rendering JobsPage, data:', data?.jobs?.length, 'items, page:', currentPage);
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Browse Jobs</h1>
      
      <div className="mb-8">
        <JobSearchBar onSearch={handleSearch} initialQuery={searchQuery} />
      </div>
      
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="w-full lg:w-72">
          <JobFiltersComponent 
            filters={selectedFilters}
            onChange={handleFilterChange}
          />
          
          {/* Debug button for development */}
          <div className="mt-4">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => {
                console.log('Manual refetch triggered');
                refetch();
                toast.info('Refreshing job listings...');
              }}
            >
              Refresh Jobs
            </Button>
          </div>
          
          {/* Current country indicator */}
          <div className="mt-4 p-3 bg-muted rounded-md">
            <p className="text-sm font-medium flex items-center">
              <span className="mr-2">🇬🇧</span> 
              <span>Showing jobs in UK</span>
            </p>
          </div>
        </div>
        
        <div className="flex-1">
          <JobsPageContent 
            jobs={data?.jobs}
            totalCount={data?.totalCount || 0}
            isLoading={isLoading}
            error={error instanceof Error ? error : null}
            currentPage={currentPage}
            totalPages={totalPages}
            sortBy={sortBy}
            onSortChange={handleSortChange}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    </div>
  );
};

export default JobsPage;
