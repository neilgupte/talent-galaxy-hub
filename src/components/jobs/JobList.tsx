
import React from 'react';
import { Job } from '@/types';
import JobCard from '@/components/jobs/JobCard';
import { Button } from '@/components/ui/button';

interface JobListProps {
  jobs: Job[];
}

const JobList: React.FC<JobListProps> = ({ jobs }) => {
  if (jobs.length === 0) {
    return (
      <div className="text-center py-12 border rounded-lg">
        <h3 className="text-lg font-medium mb-2">No jobs found</h3>
        <p className="text-muted-foreground mb-4">
          Try adjusting your search filters or search terms
        </p>
        <Button onClick={() => window.location.reload()}>Reset Filters</Button>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      {jobs.map((job) => (
        <JobCard key={job.id} job={job} />
      ))}
    </div>
  );
};

export default JobList;
