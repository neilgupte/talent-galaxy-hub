
import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Application } from '@/types';
import ApplicationHeader from '@/components/applications/ApplicationHeader';
import ApplicationDetailsCard from '@/components/applications/ApplicationDetailsCard';
import ApplicationAnswersCard from '@/components/applications/ApplicationAnswersCard';
import JobSummaryCard from '@/components/applications/JobSummaryCard';

// Mock function to fetch application details - replace with actual API call
const fetchApplicationDetails = async (id: string): Promise<Application> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Return mock data
  return {
    id,
    userId: 'user-123',
    jobId: 'job-123',
    appliedAt: '2023-08-15T10:30:00Z',
    status: 'reviewing', 
    aiScore: 85,
    feedbackText: 'Your application shows strong technical skills, but we would like to see more detail about your team collaboration experience. Your problem-solving examples were excellent.',
    job: {
      id: 'job-123',
      companyId: 'company-456',
      title: 'Senior Frontend Developer',
      description: 'We are seeking an experienced Frontend Developer to join our team...',
      location: 'New York, NY',
      employmentType: 'full_time',
      onsiteType: 'hybrid',
      jobLevel: 'senior',
      requirements: ['React', 'TypeScript', 'Responsive Design', 'UI/UX', '5+ years experience'],
      status: 'active',
      isHighPriority: true,
      isBoosted: false,
      endDate: '2023-12-31',
      createdAt: '2023-08-01T00:00:00Z',
      updatedAt: '2023-08-01T00:00:00Z',
      company: {
        id: 'company-456',
        name: 'Tech Innovations Inc',
        industry: 'Software Development',
        description: 'Leading tech company focused on innovative solutions',
        logoUrl: '/placeholder.svg',
        planType: 'premium',
        recruiterType: 'internal' // Add recruiterType
      }
    },
    answers: [
      {
        id: 'answer-1',
        applicationId: id,
        questionId: 'question-1',
        answerText: 'I have 6+ years of experience with React, including work with hooks, context API, and Redux for state management.',
        aiScore: 90
      },
      {
        id: 'answer-2',
        applicationId: id,
        questionId: 'question-2',
        answerText: 'My approach to responsive design involves using a mobile-first strategy, flexbox/grid layouts, and media queries for breakpoints. I also implement accessibility best practices throughout.',
        aiScore: 85
      }
    ]
  };
};

const ApplicationDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  
  const { data: application, isLoading, error } = useQuery({
    queryKey: ['application', id],
    queryFn: () => fetchApplicationDetails(id!),
    enabled: !!id
  });
  
  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-center items-center min-h-[50vh]">
          <p className="text-lg">Loading application details...</p>
        </div>
      </div>
    );
  }
  
  if (error || !application) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
          <h2 className="text-2xl font-semibold mb-2">Application Not Found</h2>
          <p className="text-muted-foreground mb-6">The application you're looking for doesn't exist or has been removed.</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-8 px-4">
      <ApplicationHeader application={application} />
      
      {/* Application content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <ApplicationDetailsCard application={application} />
          {application.answers && application.answers.length > 0 && (
            <ApplicationAnswersCard answers={application.answers} />
          )}
        </div>
        
        {/* Job summary */}
        <div>
          {application.job && (
            <JobSummaryCard job={application.job} />
          )}
        </div>
      </div>
    </div>
  );
};

export default ApplicationDetails;
