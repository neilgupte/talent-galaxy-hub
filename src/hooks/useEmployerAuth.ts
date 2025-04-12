
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

export const useEmployerAuth = (redirectTo: string = '/dashboard/employer') => {
  const { login, register, continueWithGoogle, continueWithLinkedIn } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const handleLogin = async (email: string, password: string) => {
    setError(null);
    setIsLoading(true);
    
    try {
      console.log("useEmployerAuth: Attempting login");
      await login(email, password);
      
      toast({
        title: "Login successful",
        description: "Welcome back to your employer portal!",
      });
      
      console.log("useEmployerAuth: Login successful, navigating to employer dashboard");
      // Force navigation to employer dashboard regardless of role
      navigate('/dashboard/employer', { replace: true });
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

  const handleRegister = async (companyName: string, name: string, email: string, password: string) => {
    setError(null);
    setIsLoading(true);
    
    try {
      console.log("useEmployerAuth: Attempting registration with company:", companyName);
      await register(name, email, password, 'employer');
      
      toast({
        title: "Registration successful",
        description: "Welcome to your employer portal! Setting up your account...",
      });
      
      console.log("useEmployerAuth: Registration successful, navigating to employer dashboard");
      // Directly navigate to employer dashboard after registration
      navigate('/dashboard/employer', { replace: true });
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

  const handleGoogleLogin = () => {
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

  const handleLinkedInLogin = () => {
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
