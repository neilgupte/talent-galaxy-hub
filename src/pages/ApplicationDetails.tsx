
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Application, Job, ApplicationStatus } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { 
  CalendarClock, 
  CheckCircle, 
  ChevronLeft, 
  FileText, 
  HelpCircle, 
  MessageSquare, 
  XCircle 
} from 'lucide-react';

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
        planType: 'premium'
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
          <Button asChild>
            <Link to="/dashboard/job-seeker">Back to Dashboard</Link>
          </Button>
        </div>
      </div>
    );
  }
  
  const getStatusBadge = (status: ApplicationStatus) => {
    switch(status) {
      case 'pending':
        return <Badge variant="outline" className="bg-gray-100 text-gray-800">Pending</Badge>;
      case 'reviewing':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800">Under Review</Badge>;
      case 'interview':
        return <Badge variant="outline" className="bg-purple-100 text-purple-800">Interview</Badge>;
      case 'offer':
        return <Badge variant="outline" className="bg-green-100 text-green-800">Offer</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="bg-red-100 text-red-800">Rejected</Badge>;
      case 'accepted':
        return <Badge variant="outline" className="bg-emerald-100 text-emerald-800">Accepted</Badge>;
      case 'withdrawn':
        return <Badge variant="outline" className="bg-gray-100 text-gray-800">Withdrawn</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  const getStatusIcon = (status: ApplicationStatus) => {
    switch(status) {
      case 'pending':
        return <HelpCircle className="h-5 w-5 text-gray-500" />;
      case 'reviewing':
        return <FileText className="h-5 w-5 text-blue-500" />;
      case 'interview':
        return <CalendarClock className="h-5 w-5 text-purple-500" />;
      case 'offer':
        return <MessageSquare className="h-5 w-5 text-green-500" />;
      case 'rejected':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'accepted':
        return <CheckCircle className="h-5 w-5 text-emerald-500" />;
      case 'withdrawn':
        return <XCircle className="h-5 w-5 text-gray-500" />;
      default:
        return <HelpCircle className="h-5 w-5 text-gray-500" />;
    }
  };
  
  return (
    <div className="container mx-auto py-8 px-4">
      {/* Back button */}
      <div className="mb-6">
        <Button 
          variant="ghost" 
          className="gap-1"
          asChild
        >
          <Link to="/dashboard/job-seeker">
            <ChevronLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>
      </div>
      
      {/* Application header */}
      <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold">Application for {application.job.title}</h1>
          <div className="flex items-center text-muted-foreground mt-1">
            <span>{application.job.company?.name}</span>
            <span className="mx-2">•</span>
            <span>{application.job.location}</span>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center gap-2">
            {getStatusIcon(application.status)}
            <span className="font-medium">Status:</span>
            {getStatusBadge(application.status)}
          </div>
          {application.status === 'rejected' && (
            <Button variant="outline">
              Appeal Decision
            </Button>
          )}
        </div>
      </div>
      
      {/* Application content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          {/* Application details card */}
          <Card>
            <CardHeader>
              <CardTitle>Application Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium text-sm text-muted-foreground mb-2">Date Applied</h3>
                <p>{new Date(application.appliedAt).toLocaleDateString(undefined, {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}</p>
              </div>
              
              {application.aiScore !== undefined && (
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground mb-2">AI Match Score</h3>
                  <div className="flex items-center">
                    <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full px-3 py-1 text-sm font-medium">
                      {application.aiScore}% Match
                    </div>
                  </div>
                </div>
              )}
              
              {application.feedbackText && (
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground mb-2">Feedback</h3>
                  <p className="text-sm">{application.feedbackText}</p>
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Application answers */}
          <Card>
            <CardHeader>
              <CardTitle>Your Responses</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {application.answers?.map((answer, index) => (
                <div key={answer.id} className="space-y-2">
                  <h3 className="font-medium">Question {index + 1}</h3>
                  <p className="text-sm">{answer.answerText}</p>
                  {answer.aiScore !== undefined && (
                    <div className="flex items-center mt-2">
                      <span className="text-xs text-muted-foreground mr-2">AI Score:</span>
                      <Badge variant="outline" className="bg-blue-50 text-blue-700">
                        {answer.aiScore}%
                      </Badge>
                    </div>
                  )}
                  {index < application.answers.length - 1 && <Separator className="my-4" />}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
        
        {/* Job summary */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Job Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium text-sm text-muted-foreground mb-2">Company</h3>
                <p>{application.job.company?.name}</p>
              </div>
              
              <div>
                <h3 className="font-medium text-sm text-muted-foreground mb-2">Location</h3>
                <p>{application.job.location}</p>
              </div>
              
              <div>
                <h3 className="font-medium text-sm text-muted-foreground mb-2">Employment Type</h3>
                <p className="capitalize">{application.job.employmentType.replace('_', ' ')}</p>
              </div>
              
              <div>
                <h3 className="font-medium text-sm text-muted-foreground mb-2">Work Type</h3>
                <p className="capitalize">{application.job.onsiteType}</p>
              </div>
              
              <Separator className="my-2" />
              
              <div>
                <h3 className="font-medium text-sm text-muted-foreground mb-2">Key Requirements</h3>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  {application.job.requirements?.map((req, index) => (
                    <li key={index}>{req}</li>
                  ))}
                </ul>
              </div>
              
              <div className="pt-2">
                <Button variant="outline" className="w-full" asChild>
                  <Link to={`/jobs/${application.job.id}`}>
                    View Full Job Details
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ApplicationDetails;
