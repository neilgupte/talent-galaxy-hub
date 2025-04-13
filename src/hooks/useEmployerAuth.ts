
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/context/auth/useAuth';

export const useEmployerAuth = (redirectTo: string = '/company/profile') => {
  const { login, register, continueWithGoogle, continueWithLinkedIn, resetPassword } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const handleLogin = async (email: string, password: string) => {
    setError(null);
    setIsLoading(true);
    
    try {
      console.log("useEmployerAuth: Attempting login with redirect to:", redirectTo);
      // Login first
      await login(email, password);
      
      toast({
        title: "Login successful",
        description: "Welcome back to your employer portal!",
      });
      
      console.log("useEmployerAuth: Login successful, navigating to:", redirectTo);
      
      // Force immediate navigation to employer dashboard
      navigate(redirectTo, { replace: true });
    } catch (err) {
      console.error("Login error:", err);
      setError(err instanceof Error ? err.message : 'Login failed');
      
      toast({
        title: "Login failed",
        description: err instanceof Error ? err.message : "An error occurred during login",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (companyName: string, name: string, email: string, password: string, recruiterType: 'internal' | 'agency' = 'internal') => {
    setError(null);
    setIsLoading(true);
    
    try {
      console.log("useEmployerAuth: Attempting registration with company:", companyName, "recruiter type:", recruiterType);
      await register(name, email, password, 'employer', { companyName, recruiterType });
      
      toast({
        title: "Registration successful",
        description: "Welcome to your employer portal! Complete your company profile.",
      });
      
      console.log("useEmployerAuth: Registration successful, navigating to:", redirectTo);
      // Directly navigate to company profile after registration
      navigate(redirectTo, { replace: true });
    } catch (err) {
      console.error("Registration error:", err);
      setError(err instanceof Error ? err.message : 'Registration failed');
      
      toast({
        title: "Registration failed",
        description: err instanceof Error ? err.message : "An error occurred during registration",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError(null);
    try {
      console.log("useEmployerAuth: Attempting Google login");
      return continueWithGoogle();
    } catch (err) {
      console.error("Google login error:", err);
      setError(err instanceof Error ? err.message : 'Google login failed');
      
      toast({
        title: "Google login failed",
        description: err instanceof Error ? err.message : "An error occurred",
        variant: "destructive",
      });
    }
  };

  const handleLinkedInLogin = async () => {
    setError(null);
    try {
      console.log("useEmployerAuth: Attempting LinkedIn login");
      return continueWithLinkedIn();
    } catch (err) {
      console.error("LinkedIn login error:", err);
      setError(err instanceof Error ? err.message : 'LinkedIn login failed');
      
      toast({
        title: "LinkedIn login failed",
        description: err instanceof Error ? err.message : "An error occurred",
        variant: "destructive",
      });
    }
  };

  return {
    isLoading,
    error,
    handleLogin,
    handleRegister,
    handleGoogleLogin,
    handleLinkedInLogin
  };
};
