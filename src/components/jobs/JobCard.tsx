
import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Job } from '@/types';
import { useJobCard } from '@/hooks/useJobCard';
import JobCardHeader from './card/JobCardHeader';
import JobCardContent from './card/JobCardContent';
import JobCardFooter from './card/JobCardFooter';

interface JobCardProps {
  job: Job;
}

const JobCard: React.FC<JobCardProps> = ({ job }) => {
  const { 
    isSaved, 
    isHidden,
    formatSalary, 
    handleSaveJob, 
    handleShareJob, 
    handleHideJob 
  } = useJobCard();
  
  if (isHidden) {
    return null;
  }

  // Get display location
  const displayLocation = job.locations && job.locations.length > 1
    ? `${job.locations[0]} + ${job.locations.length - 1} more`
    : job.location;

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <Link to={`/jobs/${job.id}`} className="block">
        <JobCardHeader 
          job={job}
          isSaved={isSaved}
          onSaveJob={handleSaveJob}
          onShareJob={handleShareJob}
          onHideJob={handleHideJob}
        />
        
        <JobCardContent
          job={job}
          formatSalary={formatSalary}
          displayLocation={displayLocation}
        />
        
        <JobCardFooter job={job} />
      </Link>
    </Card>
  );
};

export default JobCard;
