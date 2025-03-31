
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface JobListHeaderProps {
  totalJobs: number;
  sortBy: 'date' | 'salary';
  onSortChange: (value: 'date' | 'salary') => void;
}

const JobListHeader: React.FC<JobListHeaderProps> = ({ totalJobs, sortBy, onSortChange }) => {
  return (
    <div className="mb-4 flex justify-between items-center">
      <div className="text-sm text-muted-foreground">
        {totalJobs} {totalJobs === 1 ? 'job' : 'jobs'} found
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm">Sort by:</span>
        <Select value={sortBy} onValueChange={(value) => onSortChange(value as 'date' | 'salary')}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Most Recent" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="date">Most Recent</SelectItem>
            <SelectItem value="salary">Highest Salary</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default JobListHeader;
