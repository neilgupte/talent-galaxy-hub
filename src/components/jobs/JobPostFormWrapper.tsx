
import React, { useEffect, useState } from 'react';
import { useGeolocation } from '@/services/geolocation';
import JobPostForm from './JobPostForm';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { LoaderCircle } from 'lucide-react';

const JobPostFormWrapper = () => {
  const { location, loading, error } = useGeolocation();
  const [initialValues, setInitialValues] = useState({});

  useEffect(() => {
    if (location) {
      setInitialValues({
        country: location.country,
        city: location.city || '',
        currency: location.currency?.code || 'USD'
      });
    }
  }, [location]);

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
      {error && (
        <Alert variant="warning" className="mb-6">
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
    </div>
  );
};

export default JobPostFormWrapper;
