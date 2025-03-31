
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Job } from '@/types';
import { 
  Building, 
  Check, 
  CheckCircle2, 
  Clock, 
  ExternalLink,
  Heart, 
  MapPin, 
  MoreVertical, 
  Share2, 
  X 
} from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";

interface JobCardProps {
  job: Job;
}

const JobCard: React.FC<JobCardProps> = ({ job }) => {
  const { toast } = useToast();
  const [isSaved, setIsSaved] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  
  const getMatchBadgeClass = (percentage?: number) => {
    if (!percentage) return '';
    
    if (percentage >= 80) return 'job-match-badge job-match-high';
    if (percentage >= 60) return 'job-match-badge job-match-medium';
    return 'job-match-badge job-match-low';
  };
  
  const formatSalary = (min?: number, max?: number) => {
    if (!min && !max) return 'Salary not specified';
    if (min && !max) return `£${min.toLocaleString()}+`;
    if (!min && max) return `Up to £${max.toLocaleString()}`;
    return `£${min?.toLocaleString()} - £${max?.toLocaleString()}`;
  };
  
  const handleSaveJob = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsSaved(!isSaved);
    
    toast({
      title: isSaved ? "Job removed from saved jobs" : "Job saved successfully",
      description: isSaved 
        ? "The job has been removed from your saved jobs list" 
        : "The job has been added to your saved jobs list",
    });
  };
  
  const handleShareJob = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // In a real app, this would open a share dialog
    toast({
      title: "Share job",
      description: "Sharing functionality would be implemented here",
    });
  };
  
  const handleHideJob = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsHidden(true);
    
    toast({
      title: "Job hidden",
      description: "This job has been hidden from your job search results",
      action: (
        <Button variant="outline" size="sm" onClick={() => setIsHidden(false)}>
          Undo
        </Button>
      ),
    });
  };
  
  if (isHidden) {
    return null;
  }

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <Link to={`/jobs/${job.id}`} className="block">
        <CardHeader className="p-4 pb-2 flex flex-row items-start justify-between gap-4">
          <div className="flex gap-4 items-start">
            <Avatar className="h-12 w-12 rounded-md">
              <AvatarImage src={job.company?.logoUrl} alt={job.company?.name} />
              <AvatarFallback className="rounded-md bg-primary/10">
                {job.company?.name?.charAt(0) || 'C'}
              </AvatarFallback>
            </Avatar>
            
            <div>
              <CardTitle className="text-lg">{job.title}</CardTitle>
              <CardDescription className="flex items-center mt-1">
                <Building className="h-3 w-3 mr-1" />
                {job.company?.name}
              </CardDescription>
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
                <DropdownMenuItem onClick={handleSaveJob}>
                  <Heart className={`mr-2 h-4 w-4 ${isSaved ? 'fill-red-500 text-red-500' : ''}`} />
                  {isSaved ? 'Unsave Job' : 'Save Job'}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleShareJob}>
                  <Share2 className="mr-2 h-4 w-4" />
                  Share Job
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleHideJob}>
                  <X className="mr-2 h-4 w-4" />
                  Hide Job
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        
        <CardContent className="p-4 pt-0">
          <div className="space-y-2 mb-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-3 w-3" />
              <span>{job.location}</span>
              
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
            <div className="mt-3 flex items-center text-sm text-green-600 dark:text-green-400">
              <CheckCircle2 className="h-4 w-4 mr-1" />
              <span>
                Applied {job.applicationStatus && `• ${job.applicationStatus.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}`}
              </span>
            </div>
          )}
        </CardContent>
        
        <CardFooter className="p-4 pt-2 border-t flex justify-between items-center">
          <div className="flex items-center text-xs text-muted-foreground">
            <Clock className="h-3 w-3 mr-1" />
            <span>
              Posted {new Date(job.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
            </span>
          </div>
          
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
        </CardFooter>
      </Link>
    </Card>
  );
};

export default JobCard;
