
import React, { useEffect } from 'react';
import EmployerAuthForm from '@/components/auth/EmployerAuthForm';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { Spinner } from '@/components/ui/spinner';
import { useAuth } from '@/context/auth/useAuth';

const EmployerAuthPage = () => {
  const { authState } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const location = useLocation();

  // Get redirect path from query parameters or location state, default to company profile
  const redirectTo = 
    location.state?.redirectTo || 
    searchParams.get('redirectTo') || 
    '/company/profile';
    
  // Redirect if already authenticated as employer
  useEffect(() => {
    if (authState.isAuthenticated && !authState.isLoading) {
      console.log("EmployerAuthPage: User authenticated, redirecting based on role:", authState.user?.role);
      
      if (authState.user?.role === 'employer') {
        console.log("EmployerAuthPage: Redirecting to company profile or custom redirect:", redirectTo);
        toast({ 
          title: "Welcome back!", 
          description: "You're now signed in to your employer account." 
        });
        navigate(redirectTo, { replace: true });
      } else if (authState.user?.role === 'job_seeker') {
        console.log("EmployerAuthPage: User is a job seeker, redirecting to job seeker dashboard");
        navigate('/dashboard/job-seeker', { replace: true });
      }
    }
  }, [authState.isAuthenticated, authState.isLoading, authState.user, navigate, redirectTo]);

  return (
    <div className="container mx-auto px-4 py-12 flex flex-col items-center">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Employer Portal</h1>
        <p className="text-muted-foreground max-w-md mx-auto">
          Access your employer dashboard to post jobs, review applications, and find the perfect candidates for your organization.
        </p>
      </div>
      
      {authState.isLoading ? (
        <div className="flex flex-col items-center justify-center gap-4 py-8">
          <Spinner size="lg" />
          <p>Checking authentication status...</p>
        </div>
      ) : (
        <EmployerAuthForm />
      )}
    </div>
  );
};

export default EmployerAuthPage;
