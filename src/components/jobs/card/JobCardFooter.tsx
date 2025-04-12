
import React from 'react';
import { Button } from '@/components/ui/button';
import { Clock, Globe, ExternalLink } from 'lucide-react';
import { Job } from '@/types';

interface JobCardFooterProps {
  job: Job;
}

const JobCardFooter: React.FC<JobCardFooterProps> = ({ job }) => {
  return (
    <div className="p-4 pt-2 border-t flex justify-between items-center">
      <div className="flex items-center text-xs text-muted-foreground">
        <Clock className="h-3 w-3 mr-1" />
        <span>
          Posted {new Date(job.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
        </span>
      </div>
      
      {job.acceptsInternationalApplications && (
        <div className="flex items-center text-xs">
          <Globe className="h-3 w-3 mr-1 text-blue-500" />
          <span className="text-blue-500">International Applications</span>
        </div>
      )}
      
      {job.hasApplied ? (
        <Button 
          size="sm" 
          variant="outline" 
          className="gap-1 border-primary text-primary hover:bg-primary/10"
        >
          View Application
          <ExternalLink className="h-3 w-3" />
        </Button>
      ) : (
        <Button size="sm" className="gap-1">
          Full Job Details
          <ExternalLink className="h-3 w-3" />
        </Button>
      )}
    </div>
  );
};

export default JobCardFooter;
