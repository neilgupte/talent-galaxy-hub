
import React, { useState, useEffect } from 'react';
import { UserRole } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { User } from 'lucide-react';
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

  // Get redirect path from location state
  const redirectTo = location.state?.redirectTo || '/';

  const handleLogin = async (email: string, password: string) => {
    setError(null);
    setIsLoading(true);
    
    try {
      console.log("AuthForm: Attempting login");
      await login(email, password);
      
      toast({
        title: "Login successful",
        description: "Welcome back!",
      });
      
      // Navigation will be handled by the AuthPage component
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

  const handleRegister = async (name: string, email: string, password: string, role: UserRole) => {
    setError(null);
    setIsLoading(true);
    
    try {
      console.log("AuthForm: Attempting registration");
      await register(name, email, password, role);
      
      toast({
        title: "Registration successful",
        description: "Your account has been created!",
      });
      
      // For new registrations, redirect to profile page
      navigate('/auth?newRegistration=true', { replace: true });
      
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
      console.log("AuthForm: Attempting Google login");
      await continueWithGoogle();
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
      console.log("AuthForm: Attempting LinkedIn login");
      await continueWithLinkedIn();
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
          <User className="h-8 w-8 text-primary" />
        </div>
      </div>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mt-4">
          <TabsTrigger value="login">Job Seeker Sign In</TabsTrigger>
          <TabsTrigger value="register">Create Account</TabsTrigger>
        </TabsList>
        
        <TabsContent value="login" className="m-0">
          <CardHeader>
            <CardTitle>Job Seeker Sign In</CardTitle>
            <CardDescription>
              Access your account to find new job opportunities
            </CardDescription>
          </CardHeader>
          
          <LoginForm 
            onSubmit={handleLogin}
            isLoading={isLoading}
            error={error}
          />
          
          <div className="px-6 pb-6">
            <p className="text-center text-sm text-muted-foreground mb-2">Or continue with</p>
            <SocialLogin
              onGoogleLogin={() => {
                console.log("AuthForm: Attempting Google login");
                return continueWithGoogle();
              }}
              onLinkedInLogin={() => {
                console.log("AuthForm: Attempting LinkedIn login");
                return continueWithLinkedIn();
              }}
            />
            <div className="text-center mt-4 text-sm">
              <a href="/employer/auth" className="text-primary hover:underline">
                Are you an employer? Sign in to your employer account
              </a>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="register" className="m-0">
          <CardHeader>
            <CardTitle>Create Job Seeker Account</CardTitle>
            <CardDescription>
              Join TalentHub to find your dream job
            </CardDescription>
          </CardHeader>
          
          <RegisterForm
            onSubmit={handleRegister}
            isLoading={isLoading}
            error={error}
          />
          
          <div className="px-6 pb-6">
            <p className="text-center text-sm text-muted-foreground mb-2">Or continue with</p>
            <SocialLogin
              onGoogleLogin={() => {
                console.log("AuthForm: Attempting Google login");
                return continueWithGoogle();
              }}
              onLinkedInLogin={() => {
                console.log("AuthForm: Attempting LinkedIn login");
                return continueWithLinkedIn();
              }}
            />
            <div className="text-center mt-4 text-sm">
              <a href="/employer/auth" className="text-primary hover:underline">
                Are you an employer? Create an employer account
              </a>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default AuthForm;
