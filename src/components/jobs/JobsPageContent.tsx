
import React from 'react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Job } from '@/types';
import JobList from '@/components/jobs/JobList';
import JobListHeader from '@/components/jobs/JobListHeader';
import JobsPagination from '@/components/jobs/JobsPagination';

interface JobsPageContentProps {
  jobs: Job[] | undefined;
  totalCount: number;
  isLoading: boolean;
  error: Error | null;
  currentPage: number;
  totalPages: number;
  sortBy: 'date' | 'salary';
  onSortChange: (sortValue: 'date' | 'salary') => void;
  onPageChange: (page: number) => void;
  searchQuery?: string;
}

const JobsPageContent: React.FC<JobsPageContentProps> = ({
  jobs,
  totalCount,
  isLoading,
  error,
  currentPage,
  totalPages,
  sortBy,
  onSortChange,
  onPageChange,
  searchQuery
}) => {
  if (isLoading) {
    return (
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
    );
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <h3 className="text-xl font-medium text-red-500 mb-2">Error loading jobs</h3>
        <p className="text-muted-foreground mb-4">
          {error instanceof Error ? error.message : 'An error occurred while loading jobs.'}
        </p>
        <Button onClick={() => window.location.reload()}>Try Again</Button>
      </div>
    );
  }

  return (
    <>
      <JobListHeader 
        totalJobs={totalCount}
        sortBy={sortBy}
        onSortChange={onSortChange}
        searchQuery={searchQuery}
      />
      
      <JobList jobs={jobs || []} />
      
      <div className="text-xs text-muted-foreground mt-2">
        Showing {jobs?.length || 0} of {totalCount} jobs
      </div>
      
      <JobsPagination 
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
    </>
  );
};

export default JobsPageContent;
