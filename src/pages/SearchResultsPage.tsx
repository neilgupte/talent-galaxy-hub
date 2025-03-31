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

// Basic spelling corrections for common job titles
const SPELLING_CORRECTIONS: Record<string, string> = {
  'desinger': 'designer',
  'developr': 'developer',
  'enginee': 'engineer',
  'programer': 'programmer',
  'analist': 'analyst',
  'managr': 'manager',
  'specialst': 'specialist',
};

const SearchResultsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  
  const initialQuery = queryParams.get('q') || '';
  const initialPage = parseInt(queryParams.get('page') || '1', 10);
  
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [correctedQuery, setCorrectedQuery] = useState<string | null>(null);
  const [selectedFilters, setSelectedFilters] = useState<JobFiltersType>({
    employmentTypes: [],
    jobLevels: [],
    onsiteTypes: [],
    salaryRange: [0, 250000],
  });
  const [sortBy, setSortBy] = useState<'date' | 'salary'>('date');
  
  useEffect(() => {
    // Check for possible spelling corrections
    const words = initialQuery.toLowerCase().split(' ');
    const correctedWords = [...words];
    let hasCorrection = false;
    
    words.forEach((word, index) => {
      for (const [misspelled, correction] of Object.entries(SPELLING_CORRECTIONS)) {
        if (word.includes(misspelled)) {
          correctedWords[index] = word.replace(misspelled, correction);
          hasCorrection = true;
          break;
        }
      }
    });
    
    if (hasCorrection) {
      setCorrectedQuery(correctedWords.join(' '));
    } else {
      setCorrectedQuery(null);
    }
  }, [initialQuery]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (searchQuery) params.set('q', searchQuery);
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
    jobsPerPage: JOBS_PER_PAGE
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

  const handleUseOriginalSearch = () => {
    // User chose to use their original search term
    setCorrectedQuery(null);
  };
  
  // Format the page title based on search query
  const formatPageTitle = () => {
    // If we have a corrected query and we're displaying it, use that for the title
    const displayQuery = correctedQuery || searchQuery;
    
    if (!displayQuery) return "Job Search Results";
    
    // Check if query already contains the word "jobs" (case insensitive)
    const containsJobsWord = displayQuery.toLowerCase().includes("jobs");
    
    if (containsJobsWord) {
      // If it already has "jobs", just return the query
      return displayQuery.charAt(0).toUpperCase() + displayQuery.slice(1);
    } else {
      // Otherwise, append "Jobs" to the query
      return `${displayQuery.charAt(0).toUpperCase() + displayQuery.slice(1)} Jobs`;
    }
  };
  
  console.log('Rendering SearchResultsPage, data:', data?.jobs?.length, 'items, page:', currentPage);
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">{formatPageTitle()}</h1>
      
      {correctedQuery && (
        <div className="mb-4 text-sm">
          <p>
            Did you mean: <Button 
              variant="link" 
              className="p-0 h-auto font-normal text-blue-600" 
              onClick={() => {
                setSearchQuery(correctedQuery);
                refetch();
              }}
            >
              {correctedQuery}
            </Button>? Or {' '}
            <Button 
              variant="link" 
              className="p-0 h-auto font-normal text-blue-600" 
              onClick={handleUseOriginalSearch}
            >
              search for "{searchQuery}"
            </Button>
          </p>
        </div>
      )}
      
      <div className="mb-8">
        <JobSearchBar onSearch={handleSearch} initialQuery={searchQuery} />
      </div>
      
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="w-full lg:w-72">
          <JobFiltersComponent 
            filters={selectedFilters}
            onChange={handleFilterChange}
          />
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

export default SearchResultsPage;
