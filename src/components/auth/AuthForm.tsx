
import React, { useState, useEffect } from 'react';
import { UserRole } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import SocialLogin from './SocialLogin';

const AuthForm = () => {
  const { login, register, continueWithGoogle, continueWithLinkedIn, authState } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>('login');

  // Check URL parameters for mode and role
  useEffect(() => {
    const mode = searchParams.get('mode');
    if (mode === 'signup' || mode === 'register') {
      setActiveTab('register');
    } else {
      setActiveTab('login');
    }
  }, [searchParams]);

  // If user is already authenticated, redirect to appropriate dashboard
  useEffect(() => {
    if (authState.isAuthenticated && !authState.isLoading) {
      console.log("AuthForm: User is already authenticated, redirecting");
      if (authState.user?.role === 'job_seeker') {
        navigate('/dashboard/job-seeker', { replace: true });
      } else if (authState.user?.role === 'employer') {
        navigate('/dashboard/employer', { replace: true });
      } else {
        navigate('/', { replace: true });
      }
    }
  }, [authState, navigate]);

  // Get redirect path from location state
  const redirectTo = location.state?.redirectTo || '/';

  const handleLogin = async (email: string, password: string) => {
    setError(null);
    setIsLoading(true);
    
    try {
      console.log("AuthForm: Attempting login");
      await login(email, password);
      // Navigation will be handled by the useEffect above
    } catch (err) {
      console.error("Login error:", err);
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (name: string, email: string, password: string, role: UserRole) => {
    setError(null);
    setIsLoading(true);
    
    try {
      console.log("AuthForm: Attempting registration");
      await register(name, email, password, role);
      // Redirect will be handled by the auth state change in AuthContext
    } catch (err) {
      console.error("Registration error:", err);
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError(null);
    try {
      console.log("AuthForm: Attempting Google login");
      await continueWithGoogle();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Google login failed');
    }
  };

  const handleLinkedInLogin = async () => {
    setError(null);
    try {
      console.log("AuthForm: Attempting LinkedIn login");
      await continueWithLinkedIn();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'LinkedIn login failed');
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="login">Sign In</TabsTrigger>
          <TabsTrigger value="register">Create Account</TabsTrigger>
        </TabsList>
        
        <TabsContent value="login">
          <CardHeader>
            <CardTitle>Sign In</CardTitle>
            <CardDescription>
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          
          <LoginForm 
            onSubmit={handleLogin}
            isLoading={isLoading}
            error={error}
          />
          
          <SocialLogin
            onGoogleLogin={handleGoogleLogin}
            onLinkedInLogin={handleLinkedInLogin}
          />
        </TabsContent>
        
        <TabsContent value="register">
          <CardHeader>
            <CardTitle>Create an Account</CardTitle>
            <CardDescription>
              Fill in your details to create a new account
            </CardDescription>
          </CardHeader>
          
          <RegisterForm
            onSubmit={handleRegister}
            isLoading={isLoading}
            error={error}
          />
          
          <SocialLogin
            onGoogleLogin={handleGoogleLogin}
            onLinkedInLogin={handleLinkedInLogin}
          />
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default AuthForm;
