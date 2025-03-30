
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

const AuthCallback = () => {
  const { authState } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!authState.isLoading) {
      if (authState.isAuthenticated) {
        // Redirect based on user role
        if (authState.user?.role === 'job_seeker') {
          navigate('/dashboard/job-seeker');
        } else if (authState.user?.role === 'employer') {
          navigate('/dashboard/employer');
        } else {
          navigate('/');
        }
      } else {
        // If authentication failed
        navigate('/auth');
      }
    }
  }, [authState, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Processing Authentication</h2>
        <p className="text-muted-foreground">Please wait while we complete your sign-in...</p>
      </div>
    </div>
  );
};

export default AuthCallback;
