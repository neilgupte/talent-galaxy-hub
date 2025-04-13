
import React, { useEffect, useState } from 'react';
import { useGeolocation } from '@/services/geolocation';
import JobPostForm from './JobPostForm';
import JobBulkUpload from './JobBulkUpload';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LoaderCircle, Upload, FileUp, Clock, CheckCircle, LineChart } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

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
          <div className="grid md:grid-cols-2 gap-6 max-w-6xl mx-auto">
            <div>
              <JobBulkUpload 
                onClose={() => setActiveTab("single")} 
                onSuccess={handleBulkUploadSuccess}
              />
            </div>
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>How to Use Bulk Upload</CardTitle>
                  <CardDescription>
                    Save time by uploading multiple jobs at once
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium flex items-center mb-2">
                      <FileUp className="h-5 w-5 mr-2 text-primary" />
                      Benefits of Bulk Upload
                    </h3>
                    <ul className="list-disc pl-6 space-y-2 text-sm">
                      <li><span className="font-medium">Save Time:</span> Upload dozens of job listings in seconds</li>
                      <li><span className="font-medium">Stay Organized:</span> Maintain consistent job information across listings</li>
                      <li><span className="font-medium">Reduce Errors:</span> Our system validates your data before publishing</li>
                      <li><span className="font-medium">Batch Processing:</span> Make updates to multiple listings at once</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium flex items-center mb-2">
                      <Clock className="h-5 w-5 mr-2 text-primary" />
                      Simple 4-Step Process
                    </h3>
                    <ol className="list-decimal pl-6 space-y-3 text-sm">
                      <li>
                        <p className="font-medium">Download the template</p>
                        <p className="text-muted-foreground">Choose between CSV or Excel format based on your preference</p>
                      </li>
                      <li>
                        <p className="font-medium">Fill in your job details</p>
                        <p className="text-muted-foreground">Add job titles, descriptions, salaries and requirements</p>
                      </li>
                      <li>
                        <p className="font-medium">Upload and validate</p>
                        <p className="text-muted-foreground">Our system checks for any formatting errors before posting</p>
                      </li>
                      <li>
                        <p className="font-medium">Publish your jobs</p>
                        <p className="text-muted-foreground">With one click, all valid jobs will be posted to our platform</p>
                      </li>
                    </ol>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium flex items-center mb-2">
                      <LineChart className="h-5 w-5 mr-2 text-primary" />
                      Tips for Success
                    </h3>
                    <ul className="list-disc pl-6 space-y-2 text-sm">
                      <li>Follow the template structure exactly</li>
                      <li>Ensure all required fields are completed</li>
                      <li>Use common industry keywords in your descriptions for better visibility</li>
                      <li>Check your data for errors before uploading</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default JobPostFormWrapper;
