
import React from 'react';
import { useAuth } from '@/context/auth/useAuth';
import AlertManager from '@/components/alerts/AlertManager';

const AlertSettingsPage = () => {
  const { authState } = useAuth();
  
  if (!authState.isAuthenticated) {
    return (
      <div className="container mx-auto py-12 px-4 text-center">
        <h1 className="text-2xl font-bold mb-4">Job Alerts</h1>
        <p>Please sign in to manage your job alerts</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Job Alerts</h1>
      <p className="text-muted-foreground mb-8">
        Create and manage customized job alerts to receive notifications about relevant job opportunities.
      </p>
      <AlertManager />
    </div>
  );
};

export default AlertSettingsPage;
