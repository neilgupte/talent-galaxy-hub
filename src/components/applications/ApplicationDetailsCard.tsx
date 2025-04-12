
import React from 'react';
import { Application } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ApplicationDetailsCardProps {
  application: Application;
}

const ApplicationDetailsCard: React.FC<ApplicationDetailsCardProps> = ({ application }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Application Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="font-medium text-sm text-muted-foreground mb-2">Date Applied</h3>
          <p>{new Date(application.appliedAt).toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}</p>
        </div>
        
        {application.aiScore !== undefined && (
          <div>
            <h3 className="font-medium text-sm text-muted-foreground mb-2">AI Match Score</h3>
            <div className="flex items-center">
              <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full px-3 py-1 text-sm font-medium">
                {application.aiScore}% Match
              </div>
            </div>
          </div>
        )}
        
        {application.feedbackText && (
          <div>
            <h3 className="font-medium text-sm text-muted-foreground mb-2">Feedback</h3>
            <p className="text-sm">{application.feedbackText}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ApplicationDetailsCard;
