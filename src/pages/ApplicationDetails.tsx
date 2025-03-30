
import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  AlertCircle,
  ArrowUpRight, 
  Building, 
  CalendarClock, 
  ChevronLeft, 
  CheckCircle, 
  ClipboardCheck, 
  Clock, 
  FileText, 
  Info, 
  MapPin,
  MessageSquare
} from 'lucide-react';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Application, Job } from '@/types';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/context/AuthContext';

// Mock function to fetch application details
const fetchApplicationDetails = async (id: string): Promise<Application> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Return mock data
  return {
    id,
    userId: 'user-123',
    jobId: 'job-123',
    appliedAt: '2023-09-15T14:30:00Z',
    status: 'reviewing',
    aiScore: 85,
    feedbackText: 'Your application shows strong relevant experience. Consider highlighting more specific achievements in your responses.',
    job: {
      id: 'job-123',
      companyId: 'company-123',
      title: 'Senior Frontend Developer',
      description: 'We are seeking an experienced Frontend Developer to join our team...',
      location: 'New York, NY',
      employmentType: 'full_time',
      onsiteType: 'hybrid',
      jobLevel: 'senior',
      status: 'active',
      isHighPriority: true,
      isBoosted: false,
      endDate: '2023-12-31',
      createdAt: '2023-09-01',
      updatedAt: '2023-09-01',
      company: {
        id: 'company-123',
        name: 'Tech Solutions Inc',
        industry: 'Software Development',
        description: 'Leading software development company',
        logoUrl: '/placeholder.svg',
        planType: 'premium'
      }
    },
    answers: [
      {
        id: 'answer-1',
        applicationId: id,
        questionId: 'question-1',
        answerText: 'I have 6+ years of experience with React and modern JavaScript frameworks. I have built and maintained several large-scale applications using React, Redux, and TypeScript.',
        aiScore: 90
      },
      {
        id: 'answer-2',
        applicationId: id,
        questionId: 'question-2',
        answerText: 'In my previous role, I improved application performance by implementing code splitting and lazy loading, which reduced initial load time by 45%.',
        aiScore: 85
      },
      {
        id: 'answer-3',
        applicationId: id,
        questionId: 'question-3',
        answerText: 'Yes, I am available to start immediately and can work with the hybrid schedule as described.',
        aiScore: 100
      }
    ]
  };
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'pending':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-600';
    case 'reviewing':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-600';
    case 'interview':
      return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-600';
    case 'offer':
      return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-600';
    case 'accepted':
      return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-600';
    case 'rejected':
      return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-600';
    case 'withdrawn':
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-600';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-600';
  }
};

const getScoreColor = (score?: number) => {
  if (!score) return '';
  
  if (score >= 80) return 'text-green-600 dark:text-green-400';
  if (score >= 60) return 'text-yellow-600 dark:text-yellow-400';
  return 'text-red-600 dark:text-red-400';
};

const ApplicationDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const { data: application, isLoading, error } = useQuery({
    queryKey: ['application', id],
    queryFn: () => fetchApplicationDetails(id!),
    enabled: !!id
  });
  
  const handleWithdraw = () => {
    toast({
      title: "Application withdrawn",
      description: "Your application has been withdrawn successfully."
    });
    
    // In a real app, you would make an API call to update the status
    navigate('/dashboard/job-seeker');
  };
  
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
          <Info className="h-16 w-16 text-muted-foreground mb-4" />
          <h2 className="text-2xl font-semibold mb-2">Application Not Found</h2>
          <p className="text-muted-foreground mb-6">The application you're looking for doesn't exist or has been removed.</p>
          <Button asChild>
            <Link to="/dashboard/job-seeker">Go to Dashboard</Link>
          </Button>
        </div>
      </div>
    );
  }
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString(undefined, {
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  const formatStatus = (status: string) => {
    return status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };
  
  return (
    <div className="container mx-auto py-8 px-4">
      {/* Back button */}
      <div className="mb-6">
        <Button variant="ghost" onClick={() => navigate(-1)} className="gap-1">
          <ChevronLeft className="h-4 w-4" />
          Back to Dashboard
        </Button>
      </div>
      
      {/* Application Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Application for {application.job?.title}</h1>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-muted-foreground">
          <div className="flex items-center">
            <Building className="h-4 w-4 mr-1" />
            <span>{application.job?.company?.name}</span>
          </div>
          <div className="flex items-center">
            <MapPin className="h-4 w-4 mr-1" />
            <span>{application.job?.location}</span>
          </div>
          <div className="flex items-center">
            <CalendarClock className="h-4 w-4 mr-1" />
            <span>Applied on {formatDate(application.appliedAt)}</span>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Application Status */}
          <Card>
            <CardHeader>
              <CardTitle>Application Status</CardTitle>
              <CardDescription>Track the progress of your application</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-6">
                <Badge className={`px-3 py-1 ${getStatusColor(application.status)}`}>
                  {formatStatus(application.status)}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  Last updated: {formatDate(application.appliedAt)} at {formatTime(application.appliedAt)}
                </span>
              </div>
              
              <div className="relative pt-1">
                <div className="flex mb-2 items-center justify-between">
                  <div>
                    <span className={`text-xs font-semibold inline-block ${getScoreColor(application.aiScore)}`}>
                      AI Match Score
                    </span>
                  </div>
                  <div className="text-right">
                    <span className={`text-xs font-semibold inline-block ${getScoreColor(application.aiScore)}`}>
                      {application.aiScore}%
                    </span>
                  </div>
                </div>
                <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200 dark:bg-gray-700">
                  <div 
                    style={{ width: `${application.aiScore}%` }}
                    className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${
                      application.aiScore && application.aiScore >= 80 
                        ? 'bg-green-500' 
                        : application.aiScore && application.aiScore >= 60 
                          ? 'bg-yellow-500' 
                          : 'bg-red-500'
                    }`}
                  ></div>
                </div>
              </div>
              
              {application.feedbackText && (
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md p-4 mt-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <Info className="h-5 w-5 text-blue-400" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-blue-800 dark:text-blue-300">AI Feedback</h3>
                      <div className="mt-2 text-sm text-blue-700 dark:text-blue-200">
                        {application.feedbackText}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Your Responses */}
          <Card>
            <CardHeader>
              <CardTitle>Your Responses</CardTitle>
              <CardDescription>Your answers to the application questions</CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {application.answers?.map((answer, index) => (
                  <AccordionItem key={answer.id} value={answer.id}>
                    <AccordionTrigger className="hover:no-underline">
                      <div className="flex justify-between w-full pr-4">
                        <span>Question {index + 1}</span>
                        {answer.aiScore && (
                          <Badge className={`${getScoreColor(answer.aiScore)} bg-opacity-10`}>
                            Score: {answer.aiScore}%
                          </Badge>
                        )}
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pt-2">
                      <div className="space-y-2">
                        <p className="font-medium">Your Answer:</p>
                        <p className="text-muted-foreground">{answer.answerText}</p>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </div>
        
        {/* Sidebar */}
        <div className="space-y-6">
          {/* Job Info Card */}
          <Card>
            <CardHeader>
              <CardTitle>Job Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <Avatar className="h-10 w-10 rounded-md">
                  <AvatarImage src={application.job?.company?.logoUrl} alt={application.job?.company?.name} />
                  <AvatarFallback className="rounded-md bg-primary/10">
                    {application.job?.company?.name?.charAt(0) || 'C'}
                  </AvatarFallback>
                </Avatar>
                
                <div>
                  <h3 className="font-medium">{application.job?.title}</h3>
                  <p className="text-sm text-muted-foreground">{application.job?.company?.name}</p>
                </div>
              </div>
              
              <Button asChild variant="outline" className="w-full gap-1">
                <Link to={`/jobs/${application.jobId}`}>
                  View Job Details
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
          
          {/* Actions Card */}
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full gap-1">
                <MessageSquare className="h-4 w-4" />
                Contact Recruiter
              </Button>
              
              <Button variant="outline" className="w-full gap-1">
                <FileText className="h-4 w-4" />
                Upload Additional Documents
              </Button>
              
              <Button variant="destructive" className="w-full gap-1" onClick={handleWithdraw}>
                <AlertCircle className="h-4 w-4" />
                Withdraw Application
              </Button>
            </CardContent>
          </Card>
          
          {/* Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex">
                  <div className="mr-4 flex flex-col items-center">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground">
                      <CheckCircle className="h-4 w-4" />
                    </div>
                    <div className="h-full w-px bg-border"></div>
                  </div>
                  <div>
                    <p className="font-medium">Application Submitted</p>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(application.appliedAt)} at {formatTime(application.appliedAt)}
                    </p>
                  </div>
                </div>
                
                <div className="flex">
                  <div className="mr-4 flex flex-col items-center">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground">
                      <ClipboardCheck className="h-4 w-4" />
                    </div>
                    <div className="h-full w-px bg-border"></div>
                  </div>
                  <div>
                    <p className="font-medium">Under Review</p>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(application.appliedAt)} at {formatTime(application.appliedAt)}
                    </p>
                  </div>
                </div>
                
                <div className="flex opacity-50">
                  <div className="mr-4 flex flex-col items-center">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-border">
                      <Clock className="h-4 w-4" />
                    </div>
                  </div>
                  <div>
                    <p className="font-medium">Next Steps Pending</p>
                    <p className="text-sm text-muted-foreground">
                      Waiting for recruiter action
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ApplicationDetails;
