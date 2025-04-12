
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bell } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const JobAlertsSection = () => {
  const { authState } = useAuth();
  
  const { data: alertsCount } = useQuery({
    queryKey: ['alerts-count', authState.user?.id],
    queryFn: async () => {
      if (!authState.user?.id) return 0;
      
      const { count, error } = await supabase
        .from('job_alerts')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', authState.user.id)
        .eq('is_active', true);
        
      if (error) throw error;
      return count || 0;
    },
    enabled: !!authState.user?.id,
  });

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Bell className="h-5 w-5 mr-2 text-primary" />
          Job Alerts
        </CardTitle>
        <CardDescription>
          Receive notifications about relevant job opportunities
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          {alertsCount ? (
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4 bg-muted rounded-md">
              <div>
                <p className="font-medium">You have {alertsCount} active job alert{alertsCount !== 1 ? 's' : ''}</p>
                <p className="text-sm text-muted-foreground">
                  Manage your alerts to stay updated on new job opportunities
                </p>
              </div>
              <Button asChild>
                <Link to="/profile/alerts">Manage Alerts</Link>
              </Button>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4 bg-muted rounded-md">
              <div>
                <p className="font-medium">Stay updated on new job opportunities</p>
                <p className="text-sm text-muted-foreground">
                  Create job alerts based on your skills and preferences
                </p>
              </div>
              <Button asChild>
                <Link to="/profile/alerts">Create Alerts</Link>
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default JobAlertsSection;
