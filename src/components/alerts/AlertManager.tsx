import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bell, BellPlus, PlusCircle, Clock, AlertCircle } from 'lucide-react';

import { JobAlert } from '@/types';
import AlertsList from './AlertsList';
import CreateAlertForm from './CreateAlertForm';
import { getSuggestedAlerts } from '@/utils/alertUtils';
import { JobAlertTable } from '@/integrations/supabase/schema';

const AlertManager = () => {
  const { authState } = useAuth();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('active');
  const [isCreatingAlert, setIsCreatingAlert] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [suggestedAlerts, setSuggestedAlerts] = useState<any[]>([]);
  
  const { data: alerts, isLoading } = useQuery({
    queryKey: ['job-alerts', authState.user?.id],
    queryFn: async () => {
      if (!authState.user?.id) return [];
      
      const { data, error } = await supabase
        .from('job_alerts')
        .select('*')
        .eq('user_id', authState.user.id)
        .order('created_at', { ascending: false });
        
      if (error) {
        toast.error('Failed to fetch job alerts');
        throw error;
      }
      
      return (data || []).map((alert: JobAlertTable): JobAlert => ({
        id: alert.id,
        userId: alert.user_id,
        keywords: alert.keywords,
        location: alert.location,
        employmentTypes: alert.employment_types as any,
        jobLevels: alert.job_levels as any,
        salaryMin: alert.salary_min,
        salaryMax: alert.salary_max,
        frequency: alert.frequency as any,
        isActive: alert.is_active,
        createdAt: alert.created_at,
        lastTriggeredAt: alert.last_triggered_at,
        nextScheduledAt: alert.next_scheduled_at
      }));
    },
    enabled: !!authState.user?.id,
  });
  
  const createAlertMutation = useMutation({
    mutationFn: async (alertData: Omit<JobAlert, 'id' | 'userId' | 'createdAt' | 'lastTriggeredAt' | 'nextScheduledAt'>) => {
      if (!authState.user?.id) throw new Error('User not authenticated');
      
      const newAlert = {
        user_id: authState.user.id,
        keywords: alertData.keywords,
        location: alertData.location,
        employmentTypes: alertData.employmentTypes,
        jobLevels: alertData.jobLevels,
        salaryMin: alertData.salaryMin,
        salaryMax: alertData.salaryMax,
        frequency: alertData.frequency,
        is_active: alertData.isActive,
      };
      
      const { data, error } = await supabase
        .from('job_alerts')
        .insert([newAlert])
        .select()
        .single();
        
      if (error) {
        toast.error('Failed to create job alert');
        throw error;
      }
      
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['job-alerts'] });
      toast.success('Job alert created successfully');
      setIsCreatingAlert(false);
    },
  });
  
  const updateAlertMutation = useMutation({
    mutationFn: async ({ id, ...updateData }: Partial<JobAlert> & { id: string }) => {
      const dbUpdateData: Partial<JobAlertTable> = {
        keywords: updateData.keywords,
        location: updateData.location,
        employment_types: updateData.employmentTypes as any,
        job_levels: updateData.jobLevels as any,
        salary_min: updateData.salaryMin,
        salary_max: updateData.salaryMax,
        frequency: updateData.frequency as any,
        is_active: updateData.isActive
      };
      
      const { data, error } = await supabase
        .from('job_alerts')
        .update(dbUpdateData)
        .eq('id', id)
        .select()
        .single();
        
      if (error) {
        toast.error('Failed to update job alert');
        throw error;
      }
      
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['job-alerts'] });
      toast.success('Job alert updated successfully');
    },
  });
  
  const deleteAlertMutation = useMutation({
    mutationFn: async (alertId: string) => {
      const { error } = await supabase
        .from('job_alerts')
        .delete()
        .eq('id', alertId);
        
      if (error) {
        toast.error('Failed to delete job alert');
        throw error;
      }
      
      return alertId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['job-alerts'] });
      toast.success('Job alert deleted successfully');
    },
  });
  
  const { data: applications } = useQuery({
    queryKey: ['user-applications', authState.user?.id],
    queryFn: async () => {
      if (!authState.user?.id) return [];
      
      const { data, error } = await supabase
        .from('applications')
        .select('*, job:jobs(*)')
        .eq('user_id', authState.user.id)
        .order('applied_at', { ascending: false });
        
      if (error) throw error;
      return data;
    },
    enabled: !!authState.user?.id,
  });
  
  useEffect(() => {
    const generateSuggestions = async () => {
      if (authState.profile && applications) {
        const suggestions = await getSuggestedAlerts(authState.profile, applications);
        setSuggestedAlerts(suggestions);
      }
    };
    
    generateSuggestions();
  }, [authState.profile, applications]);
  
  const filteredAlerts = alerts?.filter(alert => {
    if (activeTab === 'active') return alert.isActive;
    return !alert.isActive;
  });
  
  const handleCreateSuggestedAlert = (suggestion: any) => {
    createAlertMutation.mutate({
      keywords: suggestion.keywords,
      location: suggestion.location || null,
      employmentTypes: suggestion.employmentTypes || null,
      jobLevels: suggestion.jobLevels || null,
      salaryMin: null,
      salaryMax: null,
      frequency: 'weekly',
      isActive: true,
    });
    
    setShowSuggestions(false);
  };

  return (
    <div>
      {showSuggestions && suggestedAlerts.length > 0 && !isCreatingAlert && (
        <Card className="mb-6 border-primary/20 bg-primary/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <BellPlus className="h-5 w-5 mr-2 text-primary" />
              Suggested Job Alerts
            </CardTitle>
            <CardDescription>
              Based on your profile and application history
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {suggestedAlerts.slice(0, 2).map((suggestion, index) => (
                <div key={index} className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0">
                  <div>
                    <p className="font-medium">
                      {suggestion.keywords.join(', ')} jobs {suggestion.location ? `in ${suggestion.location}` : ''}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {suggestion.employmentTypes?.join(', ') || 'Any employment type'} • 
                      {suggestion.jobLevels?.join(', ') || 'Any job level'}
                    </p>
                  </div>
                  <Button 
                    size="sm" 
                    onClick={() => handleCreateSuggestedAlert(suggestion)}
                  >
                    Create Alert
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter className="border-t bg-muted/50 flex justify-between">
            <p className="text-sm text-muted-foreground">Create alerts based on your activity</p>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setShowSuggestions(false)}
            >
              Dismiss
            </Button>
          </CardFooter>
        </Card>
      )}

      {isCreatingAlert ? (
        <CreateAlertForm 
          onSubmit={createAlertMutation.mutate}
          onCancel={() => setIsCreatingAlert(false)}
          isSubmitting={createAlertMutation.isPending}
        />
      ) : (
        <>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <h2 className="text-xl font-semibold">Your Job Alerts</h2>
            <Button onClick={() => setIsCreatingAlert(true)}>
              <PlusCircle className="h-4 w-4 mr-2" />
              Create New Alert
            </Button>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="active" className="flex items-center">
                <Bell className="h-4 w-4 mr-2" />
                Active Alerts
              </TabsTrigger>
              <TabsTrigger value="paused" className="flex items-center">
                <Clock className="h-4 w-4 mr-2" />
                Paused Alerts
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="active" className="mt-0">
              <AlertsList 
                alerts={filteredAlerts || []}
                isLoading={isLoading}
                onUpdate={updateAlertMutation.mutate}
                onDelete={deleteAlertMutation.mutate}
                emptyMessage="You don't have any active alerts"
              />
            </TabsContent>
            
            <TabsContent value="paused" className="mt-0">
              <AlertsList 
                alerts={filteredAlerts || []}
                isLoading={isLoading}
                onUpdate={updateAlertMutation.mutate}
                onDelete={deleteAlertMutation.mutate}
                emptyMessage="You don't have any paused alerts"
              />
            </TabsContent>
          </Tabs>
        </>
      )}
      
      {!isCreatingAlert && !isLoading && alerts?.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="bg-primary/10 p-3 rounded-full mb-4">
            <AlertCircle className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No Job Alerts Yet</h3>
          <p className="text-muted-foreground max-w-md mb-6">
            Create personalized job alerts to get notified when new jobs matching your criteria are posted.
          </p>
          <Button onClick={() => setIsCreatingAlert(true)}>
            Create Your First Alert
          </Button>
        </div>
      )}
    </div>
  );
};

export default AlertManager;
