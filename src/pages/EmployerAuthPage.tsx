
import React, { useEffect } from 'react';
import EmployerAuthForm from '@/components/auth/EmployerAuthForm';
import { useAuth } from '@/context/AuthContext';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';

const EmployerAuthPage = () => {
  const { authState } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const location = useLocation();

  // Get redirect path from query parameters or location state
  const redirectTo = 
    location.state?.redirectTo || 
    searchParams.get('redirectTo') || 
    '/dashboard/employer';
    
  // Redirect if already authenticated as employer
  useEffect(() => {
    const checkAuthAndRedirect = () => {
      if (authState.isAuthenticated && !authState.isLoading) {
        console.log("EmployerAuthPage: User is already authenticated, checking role", authState.user?.role);
        if (authState.user?.role === 'employer') {
          console.log("EmployerAuthPage: Redirecting to employer dashboard");
          // Use timeout to ensure state is fully updated before navigation
          navigate('/dashboard/employer', { replace: true });
        } else if (authState.user?.role === 'job_seeker') {
          // Redirect job seekers to regular dashboard
          console.log("EmployerAuthPage: User is a job seeker, redirecting to job seeker dashboard");
          navigate('/dashboard/job-seeker', { replace: true });
        }
      }
    };

    // Initial check
    checkAuthAndRedirect();
    
    // Set up interval for periodic checks (helps with race conditions)
    const intervalId = setInterval(checkAuthAndRedirect, 1000);
    
    return () => {
      clearInterval(intervalId);
    };
  }, [authState.isAuthenticated, authState.isLoading, authState.user, navigate]);

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
