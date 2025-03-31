
import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  ChevronLeft, 
  Clock, 
  CheckCircle2, 
  Calendar, 
  Building, 
  MapPin, 
  Download,
  ExternalLink,
  User,
  Mail,
  Phone,
  FileText,
  X
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

// Mock function to fetch application details
const fetchApplicationDetails = async (id: string) => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Return mock data
  return {
    id,
    jobId: 'job-123',
    userId: 'user-456',
    status: 'under_review',
    coverLetter: `Dear Hiring Manager,

I am writing to express my interest in the Senior Frontend Developer position at Tech Solutions Inc. With over 5 years of experience in React development and a passion for creating responsive, accessible user interfaces, I believe I would be an excellent fit for your team.

Throughout my career, I have successfully delivered numerous web applications using React, TypeScript, and modern frontend frameworks. I excel at translating designs into clean, maintainable code and have experience working in agile teams.

I am particularly impressed with Tech Solutions' focus on innovation and would love to contribute to your upcoming projects. Thank you for considering my application. I look forward to the opportunity to discuss how my skills align with your needs.

Sincerely,
John Smith`,
    answers: [
      {
        question: "Describe your experience with React.js and modern frontend frameworks.",
        answer: "I have 5+ years of experience with React.js, including hooks, context API, and Redux for state management. I've also worked extensively with Next.js for server-side rendering and have experience with Vue.js and Angular on smaller projects."
      },
      {
        question: "How would you approach building a responsive, accessible UI?",
        answer: "I start with a mobile-first approach, using CSS flexbox/grid and media queries. I implement ARIA attributes and follow WCAG guidelines, ensuring keyboard navigation works correctly. I also use semantic HTML elements and test with screen readers to ensure compatibility."
      }
    ],
    submittedAt: '2023-09-05T10:30:00.000Z',
    job: {
      id: 'job-123',
      title: 'Senior Frontend Developer',
      company: {
        id: 'comp-789',
        name: 'Tech Solutions Inc',
        logoUrl: '/placeholder.svg'
      },
      location: 'London, UK',
      onsiteType: 'hybrid',
      employmentType: 'full_time',
      canReapply: false,
      expiresAt: '2023-12-31T23:59:59.999Z'
    },
    user: {
      name: 'John Smith',
      email: 'john.smith@example.com',
      phone: '+44 7123 456789'
    }
  };
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
};

const formatTime = (dateString: string) => {
  return new Date(dateString).toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit'
  });
};

const ViewApplicationPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
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
          <Button onClick={() => navigate(-1)}>Go Back</Button>
        </div>
      </div>
    );
  }
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'under_review':
        return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">Under Review</Badge>;
      case 'interview_scheduled':
        return <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400">Interview Scheduled</Badge>;
      case 'hired':
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">Hired</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">Not Selected</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-800/30 dark:text-gray-400">Pending</Badge>;
    }
  };
  
  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <div className="mb-6">
        <Button variant="ghost" onClick={() => navigate(-1)} className="gap-1">
          <ChevronLeft className="h-4 w-4" />
          Back
        </Button>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <div className="flex gap-4 items-center">
            <Avatar className="h-16 w-16 rounded-md">
              <AvatarImage src={application.job.company.logoUrl} alt={application.job.company.name} />
              <AvatarFallback className="rounded-md bg-primary/10 text-lg">
                {application.job.company.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            
            <div>
              <h1 className="text-2xl font-bold mb-1">{application.job.title}</h1>
              <div className="flex items-center text-muted-foreground">
                <Building className="h-4 w-4 mr-1" />
                <span>{application.job.company.name}</span>
                <span className="mx-2">•</span>
                <MapPin className="h-4 w-4 mr-1" />
                <span>{application.job.location}</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {getStatusBadge(application.status)}
            <Link to={`/jobs/${application.jobId}`}>
              <Button variant="outline" size="sm" className="gap-1">
                View Job
                <ExternalLink className="h-3 w-3" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Application Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-medium mb-2">Cover Letter</h3>
                <div className="bg-gray-50 dark:bg-gray-900/50 rounded-md p-4 whitespace-pre-wrap text-sm text-muted-foreground">
                  {application.coverLetter}
                </div>
                <Button variant="ghost" size="sm" className="mt-2 gap-1">
                  <Download className="h-4 w-4" />
                  Download Cover Letter
                </Button>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <h3 className="font-medium">Screening Questions</h3>
                
                {application.answers.map((item, index) => (
                  <div key={index} className="space-y-2">
                    <p className="font-medium text-sm">{item.question}</p>
                    <p className="text-sm text-muted-foreground">{item.answer}</p>
                    {index < application.answers.length - 1 && <Separator className="my-4" />}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Application Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
                  <span>Application Submitted</span>
                </div>
                <span className="text-sm text-muted-foreground">{formatDate(application.submittedAt)}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Clock className="h-5 w-5 text-blue-500 mr-2" />
                  <span>Current Status</span>
                </div>
                <div>
                  {getStatusBadge(application.status)}
                </div>
              </div>
              
              {!application.job.canReapply && application.job.expiresAt && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <X className="h-5 w-5 text-red-500 mr-2" />
                    <span>Reapplication</span>
                  </div>
                  <span className="text-sm text-muted-foreground">Not allowed</span>
                </div>
              )}
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 text-muted-foreground mr-2" />
                  <span>Job Expires</span>
                </div>
                <span className="text-sm text-muted-foreground">{formatDate(application.job.expiresAt)}</span>
              </div>
              
              <Separator />
              
              <div className="space-y-3">
                <h3 className="font-medium text-sm">Your Contact Information</h3>
                
                <div className="flex items-center">
                  <User className="h-4 w-4 text-muted-foreground mr-2" />
                  <span className="text-sm">{application.user.name}</span>
                </div>
                
                <div className="flex items-center">
                  <Mail className="h-4 w-4 text-muted-foreground mr-2" />
                  <span className="text-sm">{application.user.email}</span>
                </div>
                
                <div className="flex items-center">
                  <Phone className="h-4 w-4 text-muted-foreground mr-2" />
                  <span className="text-sm">{application.user.phone}</span>
                </div>
              </div>
              
              <div className="pt-4">
                <Button variant="outline" className="w-full gap-1">
                  <FileText className="h-4 w-4" />
                  Download Application
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ViewApplicationPage;
