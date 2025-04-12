
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Application } from '@/types';
import { ChevronLeft } from 'lucide-react';
import { getStatusBadge, getStatusIcon } from './ApplicationDetailsUtils';

interface ApplicationHeaderProps {
  application: Application;
}

const ApplicationHeader: React.FC<ApplicationHeaderProps> = ({ application }) => {
  return (
    <>
      {/* Back button */}
      <div className="mb-6">
        <Button 
          variant="ghost" 
          className="gap-1"
          asChild
        >
          <Link to="/dashboard/job-seeker">
            <ChevronLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>
      </div>
      
      {/* Application header */}
      <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold">Application for {application.job?.title}</h1>
          <div className="flex items-center text-muted-foreground mt-1">
            <span>{application.job?.company?.name}</span>
            <span className="mx-2">•</span>
            <span>{application.job?.location}</span>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center gap-2">
            {getStatusIcon(application.status)}
            <span className="font-medium">Status:</span>
            {getStatusBadge(application.status)}
          </div>
          {application.status === 'rejected' && (
            <Button variant="outline">
              Appeal Decision
            </Button>
          )}
        </div>
      </div>
    </>
  );
};

export default ApplicationHeader;
