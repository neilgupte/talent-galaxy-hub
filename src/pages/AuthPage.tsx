
import React, { useEffect } from 'react';
import AuthForm from '@/components/auth/AuthForm';
import { useAuth } from '@/context/AuthContext';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';

const AuthPage = () => {
  const { authState } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  
  // Get redirect path from query parameters or location state
  const redirectTo = 
    location.state?.redirectTo || 
    searchParams.get('redirectTo') || 
    '/dashboard/job-seeker';

  // If coming from registration, redirect to profile
  const isNewRegistration = searchParams.get('newRegistration') === 'true';
  const effectiveRedirect = isNewRegistration ? '/profile' : redirectTo;

  // Redirect if already authenticated
  useEffect(() => {
    if (authState.isAuthenticated && !authState.isLoading) {
      console.log("AuthPage: User is already authenticated, redirecting");
      if (authState.user?.role === 'job_seeker') {
        navigate(effectiveRedirect, { replace: true });
      } else if (authState.user?.role === 'employer') {
        navigate('/dashboard/employer', { replace: true });
      } else {
        navigate('/', { replace: true });
      }
    }
  }, [authState, navigate, effectiveRedirect]);

  return (
    <div className="container mx-auto px-4 py-12 flex flex-col items-center">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Job Seeker Portal</h1>
        <p className="text-muted-foreground max-w-md mx-auto">
          Connect with top companies and find your dream job with TalentHub.
        </p>
      </div>
      
      <AuthForm />
    </div>
  );
};

export default AuthPage;
