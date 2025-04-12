
import React, { useEffect, useState } from 'react';
import { useGeolocation } from '@/services/geolocation';
import JobPostForm from './JobPostForm';
import JobBulkUpload from './JobBulkUpload';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LoaderCircle, Upload } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";

interface JobPostInitialValues {
  country?: string;
  city?: string;
  currency?: string;
}

const JobPostFormWrapper = () => {
  const { location, loading, error } = useGeolocation();
  const [initialValues, setInitialValues] = useState<JobPostInitialValues>({});
  const [activeTab, setActiveTab] = useState<string>("single");
  const { toast } = useToast();

  useEffect(() => {
    if (location) {
      setInitialValues({
        country: location.country,
        city: location.city || '',
        currency: location.currency?.code || 'USD'
      });
    }
  }, [location]);

  const handleBulkUploadSuccess = (jobsCount: number) => {
    toast({
      title: "Success!",
      description: `${jobsCount} jobs have been uploaded and are now live.`
    });
    setActiveTab("single");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoaderCircle className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Detecting your location...</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Post a Job</h1>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="single" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            Single Job
          </TabsTrigger>
          <TabsTrigger value="bulk" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Upload className="h-4 w-4 mr-2" />
            Bulk Upload
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="single" className="space-y-6">
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertTitle>Location Detection Failed</AlertTitle>
              <AlertDescription>
                We couldn't detect your location automatically. You can still proceed with the job posting.
              </AlertDescription>
            </Alert>
          )}
          
          {location && (
            <Alert className="mb-6">
              <AlertTitle>Location Detected</AlertTitle>
              <AlertDescription>
                We've detected you're posting from {location.city}, {location.country}. We've pre-filled some fields for you.
              </AlertDescription>
            </Alert>
          )}
          
          <JobPostForm initialValues={initialValues} />
        </TabsContent>
        
        <TabsContent value="bulk">
          <div className="max-w-4xl mx-auto">
            <JobBulkUpload 
              onClose={() => setActiveTab("single")} 
              onSuccess={handleBulkUploadSuccess}
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default JobPostFormWrapper;
