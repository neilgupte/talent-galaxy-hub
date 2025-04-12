
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useJobsQuery } from '@/hooks/useJobsQuery';
import JobFiltersComponent from '@/components/jobs/JobFilters';
import JobSearchBar from '@/components/jobs/JobSearchBar';
import JobsPageContent from '@/components/jobs/JobsPageContent';
import { toast } from 'sonner';
import { useSearchResults } from '@/hooks/useSearchResults';
import SpellingCorrectionSuggestion from '@/components/search/SpellingCorrectionSuggestion';
import SearchPageTitle from '@/components/search/SearchPageTitle';

const JOBS_PER_PAGE = 20;

const SearchResultsPage = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  
  const initialQuery = queryParams.get('q') || '';
  const initialPage = parseInt(queryParams.get('page') || '1', 10);
  const countryCode = 'UK'; // Fixed to UK for now
  
  const {
    searchQuery,
    setSearchQuery,
    correctedQuery,
    currentPage,
    selectedFilters,
    sortBy,
    handleSearch,
    handleFilterChange,
    handleSortChange,
    handlePageChange,
    handleUseOriginalSearch
  } = useSearchResults({ initialQuery, initialPage });
  
  const { data, isLoading, error, refetch } = useJobsQuery({
    searchQuery,
    currentPage,
    selectedFilters,
    sortBy,
    jobsPerPage: JOBS_PER_PAGE,
    countryCode,
    includeAppliedJobs: true // Add this to fetch applied jobs
  });
  
  // Add automatic refetch when page loads
  useEffect(() => {
    // Refetch on component mount
    console.log("Search results component mounted, triggering refetch");
    refetch().catch(err => {
      console.error("Failed to fetch jobs:", err);
      toast.error("Failed to load jobs. Please try refreshing the page.");
    });
  }, [refetch]);
  
  const totalPages = data ? Math.ceil(data.totalCount / JOBS_PER_PAGE) : 0;
  
  return (
    <div className="container mx-auto px-4 py-8">
      <SearchPageTitle 
        searchQuery={searchQuery}
        correctedQuery={correctedQuery}
        totalCount={data?.totalCount || 0}
      />
      
      <SpellingCorrectionSuggestion
        correctedQuery={correctedQuery || ''}
        originalQuery={searchQuery}
        onCorrectedQueryClick={setSearchQuery}
        onUseOriginalSearch={handleUseOriginalSearch}
      />
      
      <div className="mb-8">
        <JobSearchBar onSearch={handleSearch} initialQuery={searchQuery} />
      </div>
      
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="w-full lg:w-72">
          <JobFiltersComponent 
            filters={selectedFilters}
            onChange={handleFilterChange}
          />
          
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
            searchQuery={searchQuery}
          />
        </div>
      </div>
    </div>
  );
};

export default SearchResultsPage;
