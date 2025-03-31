
import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Briefcase, 
  Building, 
  Calendar, 
  ChevronLeft, 
  Clock, 
  DollarSign, 
  ExternalLink, 
  Globe, 
  Heart, 
  Info, 
  MapPin, 
  Share2, 
  Sparkles, 
  User 
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Job } from '@/types';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/context/AuthContext';

// Mock function to fetch job details - replace with actual API call
const fetchJobDetails = async (id: string): Promise<Job> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Return mock data
  return {
    id,
    companyId: '123',
    title: 'Senior Frontend Developer',
    description: `
      <p>We are seeking an experienced Frontend Developer to join our team...</p>
      
      <h3>Responsibilities:</h3>
      <ul>
        <li>Develop new user-facing features using React.js</li>
        <li>Build reusable components and front-end libraries for future use</li>
        <li>Translate designs and wireframes into high-quality code</li>
        <li>Optimise components for maximum performance</li>
        <li>Collaborate with the design team to improve user experience</li>
      </ul>
      
      <h3>Requirements:</h3>
      <ul>
        <li>5+ years of experience with React.js</li>
        <li>Strong proficiency in JavaScript, HTML, and CSS</li>
        <li>Experience with TypeScript, Redux, and modern frontend frameworks</li>
        <li>Familiarity with RESTful APIs</li>
        <li>Understanding of responsive design</li>
      </ul>
      
      <h3>Benefits:</h3>
      <ul>
        <li>Competitive salary and benefits package</li>
        <li>Flexible work schedule and remote options</li>
        <li>Professional development opportunities</li>
        <li>Collaborative and innovative work environment</li>
      </ul>
    `,
    location: 'London, UK',
    salaryMin: 100000,
    salaryMax: 130000,
    employmentType: 'full_time',
    onsiteType: 'hybrid',
    jobLevel: 'senior',
    requirements: [
      'React.js',
      'TypeScript',
      'JavaScript',
      'HTML/CSS',
      'Redux',
      'REST APIs'
    ],
    status: 'active',
    isHighPriority: true,
    isBoosted: false,
    endDate: '2023-12-31',
    createdAt: '2023-09-01',
    updatedAt: '2023-09-01',
    country: 'UK',
    city: 'London',
    currency: 'GBP',
    company: {
      id: '123',
      name: 'Tech Solutions Inc',
      industry: 'Software Development',
      description: 'Leading software development company focused on creating innovative solutions.',
      logoUrl: '/placeholder.svg',
      planType: 'premium'
    },
    matchPercentage: 92,
    hasApplied: false,
    applicationId: 'app-123' // This will be set if the user has applied
  };
};

const JobDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { authState } = useAuth();
  const { isAuthenticated, user } = authState;
  
  const { data: job, isLoading, error } = useQuery({
    queryKey: ['job', id],
    queryFn: () => fetchJobDetails(id!),
    enabled: !!id
  });
  
  const handleSaveJob = () => {
    toast({
      title: "Job saved",
      description: "This job has been added to your saved jobs."
    });
  };
  
  const handleShareJob = () => {
    toast({
      title: "Share job",
      description: "Sharing functionality would be implemented here."
    });
  };
  
  const handleApply = () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please sign in to apply for this job.",
        variant: "destructive"
      });
      navigate('/auth', { state: { redirectTo: `/jobs/${id}` } });
      return;
    }
    
    if (user?.role !== 'job_seeker') {
      toast({
        title: "Wrong account type",
        description: "You need a job seeker account to apply for jobs.",
        variant: "destructive"
      });
      return;
    }
    
    navigate(`/applications/job/${id}/apply`);
  };
  
  const handleViewApplication = () => {
    if (job?.applicationId) {
      navigate(`/applications/${job.applicationId}`);
    }
  };
  
  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-center items-center min-h-[50vh]">
          <p className="text-lg">Loading job details...</p>
        </div>
      </div>
    );
  }
  
  if (error || !job) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
          <Info className="h-16 w-16 text-muted-foreground mb-4" />
          <h2 className="text-2xl font-semibold mb-2">Job Not Found</h2>
          <p className="text-muted-foreground mb-6">The job you're looking for doesn't exist or has been removed.</p>
          <Button asChild>
            <Link to="/jobs">Browse All Jobs</Link>
          </Button>
        </div>
      </div>
    );
  }
  
  const formatSalary = (min?: number, max?: number) => {
    if (!min && !max) return 'Salary not specified';
    if (min && !max) return `£${min.toLocaleString()}+`;
    if (!min && max) return `Up to £${max.toLocaleString()}`;
    return `£${min?.toLocaleString()} - £${max?.toLocaleString()}`;
  };
  
  return (
    <div className="container mx-auto py-8 px-4">
      {/* Back button */}
      <div className="mb-6">
        <Button variant="ghost" onClick={() => navigate(-1)} className="gap-1">
          <ChevronLeft className="h-4 w-4" />
          Back to Jobs
        </Button>
      </div>
      
      {/* Job header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4 justify-between">
          <div className="flex gap-4">
            <Avatar className="h-16 w-16 rounded-md">
              <AvatarImage src={job.company?.logoUrl} alt={job.company?.name} />
              <AvatarFallback className="rounded-md bg-primary/10 text-lg">
                {job.company?.name?.charAt(0) || 'C'}
              </AvatarFallback>
            </Avatar>
            
            <div>
              <h1 className="text-2xl font-bold mb-1">{job.title}</h1>
              <div className="flex items-center text-muted-foreground mb-2">
                <Building className="h-4 w-4 mr-1" />
                <span>{job.company?.name}</span>
              </div>
              <div className="flex items-center text-muted-foreground">
                <MapPin className="h-4 w-4 mr-1" />
                <span>{job.location}</span>
                
                {job.onsiteType && (
                  <>
                    <span className="mx-2">•</span>
                    <span className="capitalize">{job.onsiteType}</span>
                  </>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex flex-col gap-2 md:items-end">
            {job.matchPercentage && (
              <Badge className="bg-green-100 text-green-800 dark:bg-green-800/30 dark:text-green-400 px-3 py-1 text-sm">
                <Sparkles className="h-3.5 w-3.5 mr-1" />
                {job.matchPercentage}% Match
              </Badge>
            )}
            
            {job.isHighPriority && (
              <Badge variant="outline" className="bg-amber-500 text-white border-amber-500 px-3 py-1">
                Priority
              </Badge>
            )}
          </div>
        </div>
      </div>
      
      {/* Job details and actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Job info */}
          <Card>
            <CardContent className="p-6">
              <div className="prose dark:prose-invert max-w-none" 
                dangerouslySetInnerHTML={{ __html: job.description }} 
              />
            </CardContent>
          </Card>
          
          {/* Company info */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">About {job.company?.name}</h2>
              <p className="text-muted-foreground mb-4">{job.company?.description}</p>
              
              <div className="flex items-center">
                <Globe className="h-4 w-4 text-muted-foreground mr-2" />
                <a href="#" className="text-primary hover:underline">Visit company website</a>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Sidebar */}
        <div className="space-y-6">
          {/* Apply card */}
          <Card className="sticky top-4">
            <CardContent className="p-6">
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-muted-foreground">
                      <Clock className="h-4 w-4 mr-2" />
                      <span>Posted on {new Date(job.createdAt).toLocaleDateString('en-GB', { 
                        year: 'numeric', month: 'long', day: 'numeric' 
                      })}</span>
                    </div>
                  </div>
                  
                  {job.hasApplied ? (
                    <Button
                      onClick={handleViewApplication}
                      className="w-full border-primary text-primary bg-white hover:bg-primary/10 hover:text-primary dark:bg-transparent"
                      variant="outline"
                      size="lg"
                    >
                      View Application
                    </Button>
                  ) : (
                    <Button
                      onClick={handleApply} 
                      className="w-full"
                      size="lg"
                    >
                      Apply Now
                    </Button>
                  )}
                  
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={handleSaveJob}
                    >
                      <Heart className="h-4 w-4 mr-2" />
                      Save
                    </Button>
                    
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={handleShareJob}
                    >
                      <Share2 className="h-4 w-4 mr-2" />
                      Share
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-3 pt-4 border-t">
                  <div className="flex gap-2">
                    <DollarSign className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                    <div>
                      <h3 className="font-medium">Salary</h3>
                      <p className="text-muted-foreground">{formatSalary(job.salaryMin, job.salaryMax)}</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Briefcase className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                    <div>
                      <h3 className="font-medium">Employment Type</h3>
                      <p className="text-muted-foreground capitalize">{job.employmentType.replace('_', ' ')}</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <User className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                    <div>
                      <h3 className="font-medium">Experience Level</h3>
                      <p className="text-muted-foreground capitalize">{job.jobLevel} Level</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Calendar className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                    <div>
                      <h3 className="font-medium">Closing Date</h3>
                      <p className="text-muted-foreground">{new Date(job.endDate).toLocaleDateString('en-GB', { 
                        year: 'numeric', month: 'long', day: 'numeric' 
                      })}</p>
                    </div>
                  </div>
                </div>
                
                {job.requirements && job.requirements.length > 0 && (
                  <div className="pt-4 border-t">
                    <h3 className="font-medium mb-2">Key Skills</h3>
                    <div className="flex flex-wrap gap-2">
                      {job.requirements.map((skill, index) => (
                        <Badge key={index} variant="secondary">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default JobDetails;
