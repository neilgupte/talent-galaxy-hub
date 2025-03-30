
import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, ArrowRight, Home } from 'lucide-react';

const JobApplicationSuccess = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  return (
    <div className="container max-w-md mx-auto py-16 px-4">
      <Card className="border-green-100 shadow-lg">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-50">
            <CheckCircle className="h-8 w-8 text-green-500" />
          </div>
          <CardTitle className="text-2xl font-bold">Application Submitted!</CardTitle>
        </CardHeader>
        
        <CardContent className="text-center space-y-2">
          <p className="text-muted-foreground">
            Your application has been successfully submitted. You can track the status of your application in your dashboard.
          </p>
          
          <div className="py-2">
            <p className="font-medium">Application ID:</p>
            <p className="font-mono text-sm bg-muted p-2 rounded">{id}</p>
          </div>
          
          <p className="text-sm text-muted-foreground mt-4">
            The employer will review your application and get in touch if there's a match.
          </p>
        </CardContent>
        
        <CardFooter className="flex flex-col space-y-3">
          <Button 
            className="w-full" 
            asChild
          >
            <Link to="/dashboard/job-seeker">
              <ArrowRight className="mr-2 h-4 w-4" />
              Go to Dashboard
            </Link>
          </Button>
          
          <Button 
            variant="outline" 
            className="w-full"
            asChild
          >
            <Link to="/jobs">
              Find More Jobs
            </Link>
          </Button>
          
          <Button 
            variant="ghost" 
            className="w-full"
            asChild
          >
            <Link to="/">
              <Home className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default JobApplicationSuccess;
