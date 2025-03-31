
import React from 'react';
import AuthForm from '@/components/auth/AuthForm';

const AuthPage = () => {
  return (
    <div className="container mx-auto px-4 py-12 flex flex-col items-center">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Welcome to TalentHub</h1>
        <p className="text-muted-foreground max-w-md mx-auto">
          Connect with top companies and find your dream job, or recruit the best talent for your organisation.
        </p>
      </div>
      
      <AuthForm />
    </div>
  );
};

export default AuthPage;
