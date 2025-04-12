
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Job } from '@/types';

interface JobSummaryCardProps {
  job: Job;
}

const JobSummaryCard: React.FC<JobSummaryCardProps> = ({ job }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Job Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="font-medium text-sm text-muted-foreground mb-2">Company</h3>
          <p>{job.company?.name}</p>
        </div>
        
        <div>
          <h3 className="font-medium text-sm text-muted-foreground mb-2">Location</h3>
          <p>{job.location}</p>
        </div>
        
        <div>
          <h3 className="font-medium text-sm text-muted-foreground mb-2">Employment Type</h3>
          <p className="capitalize">{job.employmentType.replace('_', ' ')}</p>
        </div>
        
        <div>
          <h3 className="font-medium text-sm text-muted-foreground mb-2">Work Type</h3>
          <p className="capitalize">{job.onsiteType}</p>
        </div>
        
        <Separator className="my-2" />
        
        <div>
          <h3 className="font-medium text-sm text-muted-foreground mb-2">Key Requirements</h3>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            {job.requirements?.map((req, index) => (
              <li key={index}>{req}</li>
            ))}
          </ul>
        </div>
        
        <div className="pt-2">
          <Button variant="outline" className="w-full" asChild>
            <Link to={`/jobs/${job.id}`}>
              View Full Job Details
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default JobSummaryCard;
