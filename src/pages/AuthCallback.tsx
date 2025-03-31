
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const AuthCallback = () => {
  const { authState, refreshSession } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState<string | null>(null);
  const [verifying, setVerifying] = useState(true);
  
  useEffect(() => {
    const handleAuthRedirect = async () => {
      try {
        setVerifying(true);
        console.log("Auth callback: Starting verification");
        
        // Get the URL parameters
        const params = new URLSearchParams(window.location.search);
        const hashParams = new URLSearchParams(location.hash.substring(1));
        
        // Check if there's an error in the URL
        if (params.get('error')) {
          throw new Error(params.get('error_description') || 'Authentication error');
        }
        
        // Check if there's an access token in the URL hash (Supabase auth flow)
        const accessToken = hashParams.get('access_token');
        const refreshToken = hashParams.get('refresh_token');
        
        if (accessToken && refreshToken) {
          console.log("Auth callback: Found tokens in URL, setting session");
          // Handle OAuth callback with tokens in URL
          const { error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });
          
          if (error) throw error;
          
          // Force refresh the session in the auth context
          await refreshSession();
        } else {
          console.log("Auth callback: No tokens in URL hash, checking existing session");
          // Standard email verification flow
          const { data, error } = await supabase.auth.getSession();
          
          console.log("Auth callback: Session check result", data, error);
          
          if (error) throw error;
          
          // Force refresh the session in the auth context
          await refreshSession();
        }
        
        setVerifying(false);
      } catch (err: any) {
        console.error('Auth callback error:', err);
        setError(err.message || 'An error occurred during authentication');
        setVerifying(false);
      }
    };
    
    handleAuthRedirect();
  }, [location.hash, refreshSession]);
  
  useEffect(() => {
    if (!verifying && !error) {
      if (authState.isAuthenticated) {
        console.log("Authentication successful, redirecting based on role:", authState.user?.role);
        // Redirect based on user role
        if (authState.user?.role === 'job_seeker') {
          navigate('/dashboard/job-seeker', { replace: true });
        } else if (authState.user?.role === 'employer') {
          navigate('/dashboard/employer', { replace: true });
        } else {
          navigate('/', { replace: true });
        }
      } else if (!authState.isLoading) {
        console.log("Authentication failed, redirecting to auth page");
        // If authentication failed and not still loading
        navigate('/auth', { replace: true });
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
