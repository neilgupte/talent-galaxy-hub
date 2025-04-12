
import React from 'react';
import { Link } from 'react-router-dom';
import { Building, MoreVertical } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, Share2, X } from 'lucide-react';
import { Job } from '@/types';

interface JobCardHeaderProps {
  job: Job;
  isSaved: boolean;
  onSaveJob: (e: React.MouseEvent) => void;
  onShareJob: (e: React.MouseEvent) => void;
  onHideJob: (e: React.MouseEvent) => void;
}

const JobCardHeader: React.FC<JobCardHeaderProps> = ({ 
  job, 
  isSaved,
  onSaveJob,
  onShareJob,
  onHideJob
}) => {
  const getMatchBadgeClass = (percentage?: number) => {
    if (!percentage) return '';
    
    if (percentage >= 80) return 'job-match-badge job-match-high';
    if (percentage >= 60) return 'job-match-badge job-match-medium';
    return 'job-match-badge job-match-low';
  };

  return (
    <div className="p-4 pb-2 flex flex-row items-start justify-between gap-4">
      <div className="flex gap-4 items-start">
        <Avatar className="h-12 w-12 rounded-md">
          <AvatarImage src={job.company?.logoUrl} alt={job.company?.name} />
          <AvatarFallback className="rounded-md bg-primary/10">
            {job.company?.name?.charAt(0) || 'C'}
          </AvatarFallback>
        </Avatar>
        
        <div>
          <h3 className="text-lg font-bold">{job.title}</h3>
          <div className="flex items-center mt-1 font-medium text-muted-foreground text-sm">
            <Building className="h-3 w-3 mr-1" />
            {job.company?.name}
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        {job.matchPercentage && (
          <span className={getMatchBadgeClass(job.matchPercentage)}>
            {job.matchPercentage}% Match
          </span>
        )}
        
        {job.isHighPriority && (
          <Badge variant="outline" className="bg-job-priority text-white border-job-priority">
            Priority
          </Badge>
        )}
        
        {job.isBoosted && (
          <Badge variant="outline" className="bg-job-boosted text-white border-job-boosted">
            Featured
          </Badge>
        )}
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => e.preventDefault()}>
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onSaveJob}>
              <Heart className={`mr-2 h-4 w-4 ${isSaved ? 'fill-red-500 text-red-500' : ''}`} />
              {isSaved ? 'Unsave Job' : 'Save Job'}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onShareJob}>
              <Share2 className="mr-2 h-4 w-4" />
              Share Job
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onHideJob}>
              <X className="mr-2 h-4 w-4" />
              Hide Job
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default JobCardHeader;
