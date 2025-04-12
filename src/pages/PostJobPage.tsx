
import React, { useEffect, useState } from 'react';
import JobPostFormWrapper from '@/components/jobs/JobPostFormWrapper';
import { useAuth } from '@/context/auth/useAuth';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { Spinner } from '@/components/ui/spinner';

const PostJobPage: React.FC = () => {
  const { authState } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  
  // Check if user is authenticated and is an employer
  const isEmployer = authState.isAuthenticated && authState.user?.role === 'employer';
  
  useEffect(() => {
    // Add logging to help debug
    console.log("PostJobPage: Auth state", {
      isAuthenticated: authState.isAuthenticated,
      userRole: authState.user?.role,
      isEmployer,
      isLoading: authState.isLoading
    });
    
    // Set local loading state based on auth loading
    if (!authState.isLoading) {
      setIsLoading(false);
    }
  }, [authState, isEmployer]);
  
  if (isLoading || authState.isLoading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold mb-6">Post a Job</h1>
        <div className="flex flex-col items-center justify-center gap-4">
          <Spinner size="lg" />
          <p>Loading...</p>
        </div>
      </div>
    );
  }
  
  if (!authState.isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold mb-6">Post a Job</h1>
        <p className="mb-8">You need to be logged in to post a job.</p>
        <Button onClick={() => navigate('/employer/auth', { 
          state: { redirectTo: '/jobs/post' }
        })}>
          Sign In as Employer
        </Button>
      </div>
    );
  }
  
  if (!isEmployer) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold mb-6">Post a Job</h1>
        <p className="mb-8">Only employers can post jobs. Switch to an employer account to continue.</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button onClick={() => navigate('/dashboard/job-seeker')}>
            Back to Dashboard
          </Button>
          <Button onClick={() => navigate('/employer/auth')} variant="outline">
            Sign In as Employer
          </Button>
        </div>
      </div>
    );
  }

  // If we get here, user is authenticated as an employer
  useEffect(() => {
    // Show welcome toast when component mounts for employers
    if (isEmployer) {
      toast({
        title: "Ready to post a job!",
        description: "Fill out the form below to create your job posting.",
      });
    }
  }, [isEmployer]);
  
  return <JobPostFormWrapper />;
};

export default PostJobPage;
