
import React, { useState, useEffect } from 'react';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useSearchParams, useLocation } from 'react-router-dom';
import { Building } from 'lucide-react';
import EmployerLoginForm from './EmployerLoginForm';
import EmployerRegisterForm from './EmployerRegisterForm';
import EmployerAuthFooter from './EmployerAuthFooter';
import { useEmployerAuth } from '@/hooks/useEmployerAuth';

const EmployerAuthForm: React.FC = () => {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<string>('login');
  
  // Get redirect path from location state or default to company profile
  const redirectTo = location.state?.redirectTo || '/company/profile';
  
  // Authentication hook
  const { 
    isLoading, 
    error, 
    handleLogin, 
    handleRegister, 
    handleGoogleLogin, 
    handleLinkedInLogin 
  } = useEmployerAuth(redirectTo);

  // Check URL parameters for mode
  useEffect(() => {
    const mode = searchParams.get('mode');
    if (mode === 'signup' || mode === 'register') {
      setActiveTab('register');
    } else {
      setActiveTab('login');
    }
  }, [searchParams]);

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
          
          <EmployerAuthFooter
            activeTab={activeTab} 
            onGoogleLogin={handleGoogleLogin}
            onLinkedInLogin={handleLinkedInLogin}
          />
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
          
          <EmployerAuthFooter
            activeTab={activeTab}
            onGoogleLogin={handleGoogleLogin}
            onLinkedInLogin={handleLinkedInLogin}
          />
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default EmployerAuthForm;
