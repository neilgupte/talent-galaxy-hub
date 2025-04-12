
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { Building, BriefcaseIcon } from 'lucide-react';
import EmployerLoginForm from './EmployerLoginForm';
import EmployerRegisterForm from './EmployerRegisterForm';
import SocialLogin from './SocialLogin';

const EmployerAuthForm = () => {
  const { login, register, continueWithGoogle, continueWithLinkedIn, authState } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>('login');

  // Check URL parameters for mode
  useEffect(() => {
    const mode = searchParams.get('mode');
    if (mode === 'signup' || mode === 'register') {
      setActiveTab('register');
    } else {
      setActiveTab('login');
    }
  }, [searchParams]);

  // Get redirect path from location state
  const redirectTo = location.state?.redirectTo || '/dashboard/employer';

  const handleLogin = async (email: string, password: string) => {
    setError(null);
    setIsLoading(true);
    
    try {
      console.log("EmployerAuthForm: Attempting login");
      await login(email, password);
      
      toast({
        title: "Login successful",
        description: "Welcome back to your employer portal!",
      });
      
      // Navigation will be handled by the parent component's useEffect
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
      console.log("EmployerAuthForm: Attempting registration with company:", companyName);
      await register(name, email, password, 'employer');
      
      toast({
        title: "Registration successful",
        description: "Welcome to your employer portal! Setting up your account...",
      });
      
      // Directly navigate to employer dashboard after registration instead of redirecting to auth page again
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
      console.log("EmployerAuthForm: Attempting Google login");
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
      console.log("EmployerAuthForm: Attempting LinkedIn login");
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

  return (
    <Card className="w-full max-w-md mx-auto border-primary/20">
      <div className="flex justify-center pt-6">
        <div className="p-2 rounded-full bg-primary/10">
          <Building className="h-8 w-8 text-primary" />
        </div>
      </div>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mt-4">
          <TabsTrigger value="login">Employer Sign In</TabsTrigger>
          <TabsTrigger value="register">Create Employer Account</TabsTrigger>
        </TabsList>
        
        <TabsContent value="login" className="m-0">
          <CardHeader>
            <CardTitle>Employer Sign In</CardTitle>
            <CardDescription>
              Access your employer dashboard to manage job postings and applications
            </CardDescription>
          </CardHeader>
          
          <EmployerLoginForm 
            onSubmit={handleLogin}
            isLoading={isLoading}
            error={error}
          />
          
          <div className="px-6 pb-6">
            <p className="text-center text-sm text-muted-foreground mb-2">Or continue with</p>
            <SocialLogin
              onGoogleLogin={handleGoogleLogin}
              onLinkedInLogin={handleLinkedInLogin}
            />
            <div className="text-center mt-4 text-sm">
              <a href="/auth" className="text-primary hover:underline">
                Looking for a job? Sign in as a job seeker
              </a>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="register" className="m-0">
          <CardHeader>
            <CardTitle>Create Employer Account</CardTitle>
            <CardDescription>
              Join TalentHub to post jobs and find the best candidates
            </CardDescription>
          </CardHeader>
          
          <EmployerRegisterForm
            onSubmit={handleRegister}
            isLoading={isLoading}
            error={error}
          />
          
          <div className="px-6 pb-6">
            <p className="text-center text-sm text-muted-foreground mb-2">Or continue with</p>
            <SocialLogin
              onGoogleLogin={handleGoogleLogin}
              onLinkedInLogin={handleLinkedInLogin}
            />
            <div className="text-center mt-4 text-sm">
              <a href="/auth" className="text-primary hover:underline">
                Looking for a job? Sign up as a job seeker
              </a>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default EmployerAuthForm;
