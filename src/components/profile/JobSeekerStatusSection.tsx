
import React from 'react';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { JobSeekerStatus } from '@/types';

interface JobSeekerStatusSectionProps {
  jobSeekerStatus: JobSeekerStatus;
  onStatusChange: (value: JobSeekerStatus) => void;
}

const JobSeekerStatusSection = ({ 
  jobSeekerStatus, 
  onStatusChange 
}: JobSeekerStatusSectionProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="jobSeekerStatus">Job Seeking Status</Label>
      <RadioGroup 
        value={jobSeekerStatus}
        onValueChange={value => onStatusChange(value as JobSeekerStatus)}
        className="pt-2"
      >
        <div className="flex items-center space-x-2 mb-2">
          <RadioGroupItem value="actively_seeking" id="actively_seeking" />
          <Label htmlFor="actively_seeking" className="font-normal">
            Actively seeking jobs
          </Label>
        </div>
        <div className="flex items-center space-x-2 mb-2">
          <RadioGroupItem value="employed_but_open" id="employed_but_open" />
          <Label htmlFor="employed_but_open" className="font-normal">
            Employed but open to opportunities
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="not_open" id="not_open" />
          <Label htmlFor="not_open" className="font-normal">
            Not open to job offers
          </Label>
        </div>
      </RadioGroup>
    </div>
  );
};

export default JobSeekerStatusSection;
