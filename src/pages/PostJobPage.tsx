
import React from 'react';
import JobPostFormWrapper from '@/components/jobs/JobPostFormWrapper';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const PostJobPage: React.FC = () => {
  const { authState } = useAuth();
  const navigate = useNavigate();
  
  // Check if user is authenticated and is an employer
  const isEmployer = authState.isAuthenticated && authState.user?.role === 'employer';
  
  if (!authState.isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold mb-6">Post a Job</h1>
        <p className="mb-8">You need to be logged in to post a job.</p>
        <Button onClick={() => navigate('/auth')}>Sign In</Button>
      </div>
    );
  }
  
  if (!isEmployer) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold mb-6">Post a Job</h1>
        <p className="mb-8">Only employers can post jobs. Switch to an employer account to continue.</p>
        <Button onClick={() => navigate('/dashboard/job-seeker')}>Back to Dashboard</Button>
      </div>
    );
  }
  
  return <JobPostFormWrapper />;
};

export default PostJobPage;
