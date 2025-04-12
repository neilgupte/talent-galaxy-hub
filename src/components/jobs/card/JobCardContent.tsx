
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { MapPin, Globe, CheckCircle2 } from 'lucide-react';
import { Job } from '@/types';

interface JobCardContentProps {
  job: Job;
  formatSalary: (min?: number, max?: number) => string;
  displayLocation: string;
}

const JobCardContent: React.FC<JobCardContentProps> = ({ 
  job, 
  formatSalary,
  displayLocation
}) => {
  return (
    <div className="p-4 pt-0">
      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="h-3 w-3" />
          <span>{displayLocation}</span>
          
          {job.onsiteType === 'remote' && (
            <>
              <span className="inline-block h-1 w-1 rounded-full bg-gray-400"></span>
              <span>Remote</span>
            </>
          )}
          
          {job.onsiteType === 'hybrid' && (
            <>
              <span className="inline-block h-1 w-1 rounded-full bg-gray-400"></span>
              <span>Hybrid</span>
            </>
          )}
          
          {job.country && job.country !== 'UK' && (
            <>
              <span className="inline-block h-1 w-1 rounded-full bg-gray-400"></span>
              <Globe className="h-3 w-3 ml-1" />
              <span>{job.country}</span>
            </>
          )}
        </div>
        
        <div className="flex flex-wrap gap-2 text-sm">
          {job.salaryMin !== undefined && (
            <Badge variant="outline" className="font-normal">
              {formatSalary(job.salaryMin, job.salaryMax)}
            </Badge>
          )}
          
          <Badge variant="outline" className="font-normal capitalize">
            {job.employmentType.replace('_', ' ')}
          </Badge>
          
          <Badge variant="outline" className="font-normal capitalize">
            {job.jobLevel} Level
          </Badge>
        </div>
      </div>
      
      <p className="text-sm line-clamp-2 text-muted-foreground">
        {job.description}
      </p>
      
      {job.hasApplied && (
        <div className="mt-3 flex items-center text-sm text-green-600 dark:text-green-400 font-medium">
          <CheckCircle2 className="h-4 w-4 mr-1" />
          <span>
            Applied {job.applicationStatus && `• ${job.applicationStatus.charAt(0).toUpperCase() + job.applicationStatus.slice(1)}`}
          </span>
        </div>
      )}
    </div>
  );
};

export default JobCardContent;
