
import React, { useEffect } from 'react';
import EmployerAuthForm from '@/components/auth/EmployerAuthForm';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';

const EmployerAuthPage = () => {
  const { authState } = useAuth();
  const navigate = useNavigate();

  // Redirect if already authenticated as employer
  useEffect(() => {
    if (authState.isAuthenticated && !authState.isLoading) {
      console.log("EmployerAuthPage: User is already authenticated, checking role");
      if (authState.user?.role === 'employer') {
        navigate('/dashboard/employer', { replace: true });
      } else if (authState.user?.role === 'job_seeker') {
        // Redirect job seekers to regular dashboard
        navigate('/dashboard/job-seeker', { replace: true });
      }
    }
  }, [authState, navigate]);

  return (
    <div className="container mx-auto px-4 py-12 flex flex-col items-center">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Employer Portal</h1>
        <p className="text-muted-foreground max-w-md mx-auto">
          Access your employer dashboard to post jobs, review applications, and find the perfect candidates for your organization.
        </p>
      </div>
      
      <EmployerAuthForm />
    </div>
  );
};

export default EmployerAuthPage;
