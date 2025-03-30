
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const AuthCallback = () => {
  const { authState } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState<string | null>(null);
  const [verifying, setVerifying] = useState(true);
  
  useEffect(() => {
    const handleAuthRedirect = async () => {
      try {
        setVerifying(true);
        
        // Check if there's an access token in the URL (Supabase auth flow)
        const params = new URLSearchParams(location.hash.substring(1));
        const accessToken = params.get('access_token');
        const refreshToken = params.get('refresh_token');
        
        if (accessToken && refreshToken) {
          // Handle OAuth callback with tokens in URL
          const { error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });
          
          if (error) throw error;
        } else {
          // Standard email verification flow
          const { error } = await supabase.auth.getSession();
          if (error) throw error;
        }
        
        setVerifying(false);
      } catch (err: any) {
        console.error('Auth callback error:', err);
        setError(err.message || 'An error occurred during authentication');
        setVerifying(false);
      }
    };
    
    handleAuthRedirect();
  }, [location.hash]);
  
  useEffect(() => {
    if (!verifying && !error) {
      if (authState.isAuthenticated) {
        // Redirect based on user role
        if (authState.user?.role === 'job_seeker') {
          navigate('/dashboard/job-seeker');
        } else if (authState.user?.role === 'employer') {
          navigate('/dashboard/employer');
        } else {
          navigate('/');
        }
      } else if (!authState.isLoading) {
        // If authentication failed and not still loading
        navigate('/auth');
      }
    }
  }, [authState, navigate, verifying, error]);

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <Alert variant="destructive" className="max-w-md">
          <AlertTitle>Authentication Error</AlertTitle>
          <AlertDescription>
            {error}
            <div className="mt-4">
              <button 
                onClick={() => navigate('/auth')}
                className="text-sm font-medium underline"
              >
                Return to login
              </button>
            </div>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="text-center max-w-md">
        <Loader2 className="animate-spin h-10 w-10 text-primary mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-4">Verifying Your Account</h2>
        <p className="text-muted-foreground">
          Please wait while we complete your authentication process...
        </p>
      </div>
    </div>
  );
};

export default AuthCallback;
