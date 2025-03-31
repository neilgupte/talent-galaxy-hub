
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useJobsQuery } from '@/hooks/useJobsQuery';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';

const FetchAllJobsTestButton = () => {
  const [isTestActive, setIsTestActive] = useState(false);
  
  // Default empty filters and parameters
  const emptyFilters = {
    employmentTypes: [],
    jobLevels: [],
    onsiteTypes: [],
    salaryRange: [0, 250000] as [number, number], // Fixed: explicitly typed as tuple
  };
  
  const { data, isLoading, error } = useJobsQuery({
    searchQuery: '',
    currentPage: 1,
    selectedFilters: emptyFilters,
    sortBy: 'date',
    jobsPerPage: 20,
    fetchAllJobs: isTestActive // Only fetch when test is active
  });
  
  const handleTestClick = () => {
    setIsTestActive(true);
    toast.info('Fetching all jobs for testing...');
  };
  
  return (
    <div className="my-8 p-4 border rounded-lg">
      <h3 className="text-lg font-semibold mb-4">Testing Tool: Fetch All Jobs</h3>
      
      {!isTestActive ? (
        <Button onClick={handleTestClick} variant="outline">
          Load All Jobs (Testing)
        </Button>
      ) : isLoading ? (
        <div className="space-y-2">
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-4 w-32" />
        </div>
      ) : error ? (
        <div className="text-red-500">
          Error loading jobs: {error instanceof Error ? error.message : 'Unknown error'}
        </div>
      ) : (
        <div>
          <p className="text-green-600 font-medium">✓ Successfully loaded {data?.jobs.length || 0} jobs</p>
          <p className="text-sm text-muted-foreground mt-1">Check the console for the complete dataset</p>
          <Button 
            variant="ghost" 
            size="sm" 
            className="mt-3"
            onClick={() => setIsTestActive(false)}
          >
            Reset
          </Button>
        </div>
      )}
    </div>
  );
};

export default FetchAllJobsTestButton;
