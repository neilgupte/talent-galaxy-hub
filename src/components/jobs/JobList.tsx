
import React from 'react';
import { Job } from '@/types';
import JobCard from '@/components/jobs/JobCard';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface JobListProps {
  jobs: Job[];
}

const JobList: React.FC<JobListProps> = ({ jobs }) => {
  const navigate = useNavigate();
  
  if (!jobs || jobs.length === 0) {
    return (
      <div className="text-center py-12 border rounded-lg">
        <h3 className="text-lg font-medium mb-2">No jobs found</h3>
        <p className="text-muted-foreground mb-4">
          Try adjusting your search filters or search terms
        </p>
        <Button onClick={() => {
          // Reset the search and filters
          navigate('/jobs');
          window.location.reload();
        }}>Reset Filters</Button>
      </div>
    );
  }
  
  console.log(`Rendering ${jobs.length} jobs in JobList component`);
  
  return (
    <div className="space-y-4">
      {jobs.map((job) => (
        <JobCard key={job.id} job={job} />
      ))}
    </div>
  );
};

export default JobList;
