
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';

const AccountUpgrade = () => {
  const { authState } = useAuth();
  const navigate = useNavigate();
  
  if (!authState.isAuthenticated) {
    navigate('/auth');
    return null;
  }
  
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">Upgrade Your Account</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>Switch to an Employer Account</CardTitle>
            <CardDescription>
              Post jobs, review applications, and find the perfect candidates for your positions.
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <p className="mb-4">
              As an employer, you'll be able to:
            </p>
            
            <ul className="list-disc pl-5 space-y-2 mb-6">
              <li>Post job listings that reach thousands of qualified candidates</li>
              <li>Review applications with our AI-powered screening tools</li>
              <li>Contact candidates directly through our messaging system</li>
              <li>Track your hiring pipeline with our intuitive dashboard</li>
              <li>Build your employer brand with a company profile</li>
            </ul>
            
            <p className="text-sm text-muted-foreground">
              Note: Switching to an employer account will create a new company profile for you. You will still have access to your job seeker profile.
            </p>
          </CardContent>
          
          <CardFooter>
            <Button onClick={() => navigate('/employer/onboarding')} className="w-full">
              Switch to Employer Account
            </Button>
          </CardFooter>
        </Card>
        
        <div className="text-center mt-6">
          <Button variant="ghost" onClick={() => navigate(-1)}>
            Go Back
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AccountUpgrade;
