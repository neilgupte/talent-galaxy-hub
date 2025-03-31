
import React, { useEffect } from 'react';
import AuthForm from '@/components/auth/AuthForm';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AuthPage = () => {
  const { authState } = useAuth();
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    if (authState.isAuthenticated && !authState.isLoading) {
      console.log("AuthPage: User is already authenticated, redirecting");
      if (authState.user?.role === 'job_seeker') {
        navigate('/dashboard/job-seeker', { replace: true });
      } else if (authState.user?.role === 'employer') {
        navigate('/dashboard/employer', { replace: true });
      } else {
        navigate('/', { replace: true });
      }
    }
  }, [authState, navigate]);

  if (authState.isLoading) {
    return (
      <div className="container mx-auto px-4 py-12 flex flex-col items-center">
        <div className="animate-pulse">
          <div className="h-8 w-64 bg-gray-200 rounded mb-4"></div>
          <div className="h-4 w-96 bg-gray-200 rounded mb-8"></div>
          <div className="h-96 w-full max-w-md bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 flex flex-col items-center">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Welcome to TalentHub</h1>
        <p className="text-muted-foreground max-w-md mx-auto">
          Connect with top companies and find your dream job, or recruit the best talent for your organisation.
        </p>
      </div>
      
      <AuthForm />
    </div>
  );
};

export default AuthPage;
