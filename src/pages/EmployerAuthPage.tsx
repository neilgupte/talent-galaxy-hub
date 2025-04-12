
import React, { useEffect } from 'react';
import EmployerAuthForm from '@/components/auth/EmployerAuthForm';
import { useAuth } from '@/context/auth/useAuth';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

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
    if (authState.isAuthenticated && !authState.isLoading) {
      console.log("EmployerAuthPage: User authenticated, redirecting based on role:", authState.user?.role);
      
      if (authState.user?.role === 'employer') {
        console.log("EmployerAuthPage: Redirecting to employer dashboard");
        toast({ title: "Welcome back!", description: "Redirecting to your dashboard..." });
        navigate('/dashboard/employer', { replace: true });
      } else if (authState.user?.role === 'job_seeker') {
        console.log("EmployerAuthPage: User is a job seeker, redirecting to job seeker dashboard");
        navigate('/dashboard/job-seeker', { replace: true });
      }
    }
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
