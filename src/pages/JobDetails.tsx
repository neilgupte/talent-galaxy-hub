import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
  User,
  ArrowRight,
  Check,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Job, JobEmploymentType, JobOnsiteType, JobLevel } from '@/types';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import JobCard from '@/components/jobs/JobCard';
import { useIsMobile } from '@/hooks/use-mobile';
import CountrySwitcher from '@/components/layout/CountrySwitcher';
import { mapDatabaseJobToModel } from '@/utils/jobMappers';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

const fetchJobDetails = async (id: string): Promise<Job> => {
  try {
    console.log('Fetching job details for ID:', id);
    const { data, error } = await supabase
      .from('jobs')
      .select('*, companies(*)')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching job details:', error);
      throw error;
    }

    if (!data) {
      throw new Error('Job not found');
    }

    console.log('Fetched job details:', data);
    
    const jobData = mapDatabaseJobToModel(data);
    
    if (!jobData.company || !jobData.company.name) {
      jobData.company = {
        id: 'default-company',
        name: 'Creative Tech Solutions',
        industry: 'Technology',
        description: 'Creative Tech Solutions is a leading technology company focused on innovative digital experiences. We combine cutting-edge technology with creative design to deliver exceptional products and services to our clients worldwide.',
        logoUrl: '/lovable-uploads/51540783-120d-4616-82a5-16011c4b6344.png',
        planType: 'enterprise'
      };
    }
    
    if (!jobData.benefits) {
      jobData.benefits = [
        "Competitive salary and performance bonuses",
        "Flexible working hours and remote work options",
        "Comprehensive health, dental, and vision insurance",
        "25 days annual leave plus bank holidays",
        "Professional development budget and learning opportunities",
        "Company pension scheme with employer contributions",
        "Regular team building events and social activities",
        "Modern office with complimentary snacks and beverages"
      ];
    }
    
    jobData.country = 'UK';
    
    if (jobData.description.length < 300) {
      jobData.description += `<h3>About the Role</h3>
      <p>As a ${jobData.title} at ${jobData.company.name}, you'll be joining a dynamic team passionate about delivering exceptional results. You'll work closely with our talented professionals to develop innovative solutions that meet our clients' needs.</p>
      <p>This role offers an excellent opportunity to grow your skills and advance your career in a supportive and collaborative environment.</p>
      <h3>Key Responsibilities</h3>
      <ul>
        <li>Collaborate with cross-functional teams to deliver high-quality projects</li>
        <li>Stay updated with industry trends and best practices</li>
        <li>Participate in regular team meetings and contribute creative ideas</li>
        <li>Work closely with stakeholders to understand requirements and deliver solutions</li>
      </ul>
      <h3>Company Benefits</h3>
      <ul>
        ${jobData.benefits.map(benefit => `<li>${benefit}</li>`).join('\n')}
      </ul>`;
    }
    
    return jobData;
  } catch (error) {
    console.error('Failed to fetch job details:', error);
    throw error;
  }
};

const fetchSimilarJobs = async (currentJobId: string, jobTitle: string, jobLocation: string): Promise<Job[]> => {
  try {
    console.log('Fetching similar jobs for:', { jobTitle, jobLocation });
    
    const keywords = jobTitle.split(' ').filter(word => word.length > 3);
    
    let query = supabase
      .from('jobs')
      .select('*, companies(*)')
      .eq('status', 'active')
      .neq('id', currentJobId)
      .limit(4);
    
    if (jobLocation) {
      const sanitizedLocation = jobLocation.split(',')[0].trim();
      query = query.or(`location.ilike.%${sanitizedLocation}%`);
    }
    
    if (keywords.length > 0) {
      const titleConditions = keywords.map(keyword => `title.ilike.%${keyword}%`);
      query = query.or(titleConditions.join(','));
    }
    
    const { data: jobsData, error } = await query;
    
    if (error) {
      console.error('Error fetching similar jobs:', error);
      return [];
    }
    
    if (!jobsData || jobsData.length === 0) {
      console.log('No similar jobs found, fetching recent jobs instead');
      const { data: recentJobs, error: recentError } = await supabase
        .from('jobs')
        .select('*, companies(*)')
        .eq('status', 'active')
        .neq('id', currentJobId)
        .order('created_at', { ascending: false })
        .limit(4);
        
      if (recentError) {
        console.error('Error fetching recent jobs:', recentError);
        return [];
      }
      
      if (!recentJobs || recentJobs.length === 0) {
        return [];
      }
      
      const similarJobs = recentJobs.map(job => mapDatabaseJobToModel(job));
      console.log(`Found ${similarJobs.length} recent jobs`);
      return similarJobs;
    }
    
    console.log(`Found ${jobsData.length} similar jobs`);
    
    return jobsData.map(job => mapDatabaseJobToModel(job));
  } catch (error) {
    console.error('Failed to fetch similar jobs:', error);
    return [];
  }
};

const JobDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { authState } = useAuth();
  const { isAuthenticated, user } = authState;
  const jobDescriptionRef = useRef<HTMLDivElement>(null);
  const mainContainerRef = useRef<HTMLDivElement>(null);
  const [showBottomButtons, setShowBottomButtons] = useState(false);
  const isMobile = useIsMobile();
  
  const [showFloatingButton, setShowFloatingButton] = useState(isMobile);
  
  const { data: job, isLoading, error } = useQuery({
    queryKey: ['job', id],
    queryFn: () => fetchJobDetails(id!),
    enabled: !!id
  });
  
  const { data: similarJobs = [], isLoading: isSimilarJobsLoading } = useQuery({
    queryKey: ['similarJobs', id, job?.title, job?.location],
    queryFn: () => fetchSimilarJobs(id!, job!.title, job!.location),
    enabled: !!id && !!job,
  });

  useEffect(() => {
    if (!isMobile) return;

    const handleScroll = () => {
      if (!mainContainerRef.current) return;

      const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
      if (scrollTop + clientHeight >= scrollHeight - 100) {
        setShowBottomButtons(true);
        setShowFloatingButton(false);
      } else {
        setShowBottomButtons(false);
        setShowFloatingButton(true);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isMobile]);
  
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

  const previewSimilarJobs = similarJobs.slice(0, 3);
  const hasMoreSimilarJobs = similarJobs.length > 3;
  
  return (
    <div className="container mx-auto py-8 px-4" ref={mainContainerRef}>
      <div className="mb-6">
        <Button variant="ghost" onClick={() => navigate(-1)} className="gap-1">
          <ChevronLeft className="h-4 w-4" />
          Back to Jobs
        </Button>
      </div>
      
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
                <span className="font-medium">{job.company?.name}</span>
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
                
                <span className="mx-2">•</span>
                <span className="flex items-center">
                  <Globe className="h-3 w-3 mr-1" />
                  {job.country}
                </span>
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

            <div className="flex flex-col sm:flex-row gap-2 mt-4 md:mt-2 w-full md:w-auto">
              {job.hasApplied ? (
                <Button
                  onClick={handleViewApplication}
                  className="border-primary text-primary bg-white hover:bg-primary/10 hover:text-primary dark:bg-transparent"
                  variant="outline"
                >
                  View Application
                </Button>
              ) : (
                <Button
                  onClick={handleApply} 
                  className="w-full sm:w-auto"
                >
                  Apply Now
                </Button>
              )}
              
              <div className="flex gap-2 w-full sm:w-auto">
                <Button
                  variant="outline"
                  className="flex-1 sm:flex-none"
                  onClick={handleSaveJob}
                >
                  <Heart className="h-4 w-4 mr-2" />
                  Save
                </Button>
                
                <Button
                  variant="outline"
                  className="flex-1 sm:flex-none"
                  onClick={handleShareJob}
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardContent className="p-6" ref={jobDescriptionRef}>
              <div className="prose dark:prose-invert max-w-none" 
                dangerouslySetInnerHTML={{ __html: job.description }} 
              />

              <div className="mt-8 flex justify-center">
                {job.hasApplied ? (
                  <Button
                    onClick={handleViewApplication}
                    className="border-primary text-primary bg-white hover:bg-primary/10 hover:text-primary dark:bg-transparent"
                    variant="outline"
                    size="lg"
                  >
                    View Your Application
                  </Button>
                ) : (
                  <Button
                    onClick={handleApply} 
                    size="lg"
                  >
                    Apply Now
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>About {job.company?.name}</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <p className="text-muted-foreground mb-6">{job.company?.description}</p>
              
              <div className="flex items-center">
                <Globe className="h-4 w-4 text-muted-foreground mr-2" />
                <a href={`https://www.${job.company?.name.toLowerCase().replace(/\s+/g, '')}.com`} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                  Visit {job.company?.name}'s website
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-6">
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
                  
                  <div className="flex gap-2">
                    <Globe className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                    <div>
                      <h3 className="font-medium">Location</h3>
                      <p className="text-muted-foreground">
                        {job.location}, {job.country}
                      </p>
                    </div>
                  </div>
                  
                  {(job.acceptsInternationalApplications !== undefined || 
                    job.visaSponsorshipAvailable !== undefined) && (
                    <div className="flex gap-2">
                      <Globe className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                      <div>
                        <h3 className="font-medium">International Applications</h3>
                        <div className="text-muted-foreground">
                          <p>
                            Accepts International: {' '}
                            <span className={job.acceptsInternationalApplications ? 'text-green-500' : 'text-red-500'}>
                              {job.acceptsInternationalApplications ? 'Yes' : 'No'}
                            </span>
                          </p>
                          {job.acceptsInternationalApplications && (
                            <p>
                              Visa Sponsorship: {' '}
                              <span className={job.visaSponsorshipAvailable ? 'text-green-500' : 'text-red-500'}>
                                {job.visaSponsorshipAvailable ? 'Available' : 'Not Available'}
                              </span>
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {job.locations && job.locations.length > 1 && (
                    <div className="flex gap-2">
                      <MapPin className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                      <div>
                        <h3 className="font-medium">Multiple Locations</h3>
                        <ul className="text-muted-foreground list-disc pl-4">
                          {job.locations.map((loc, index) => (
                            <li key={index}>{loc}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                  
                  {job.benefits && job.benefits.length > 0 && (
                    <div className="flex gap-2">
                      <Check className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                      <div>
                        <h3 className="font-medium">Key Benefits</h3>
                        <ul className="text-muted-foreground list-disc pl-4 text-sm">
                          {job.benefits.slice(0, 3).map((benefit, i) => (
                            <li key={i}>{benefit}</li>
                          ))}
                          {job.benefits.length > 3 && (
                            <li className="text-primary">+ {job.benefits.length - 3} more benefits</li>
                          )}
                        </ul>
                      </div>
                    </div>
                  )}
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
      
      <div className="mt-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Similar Jobs</h2>
          
          {hasMoreSimilarJobs && (
            <Button variant="outline" asChild className="flex items-center gap-1">
              <Link to={`/search-results?related=${job.id}`}>
                See More <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          )}
        </div>
        
        {isSimilarJobsLoading ? (
          <div className="flex justify-center py-8">
            <p>Loading similar jobs...</p>
          </div>
        ) : previewSimilarJobs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {previewSimilarJobs.map(similarJob => (
              <JobCard key={similarJob.id} job={similarJob} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <p>No similar jobs found at this time.</p>
          </div>
        )}
      </div>
      
      {isMobile && showFloatingButton && !job.hasApplied && (
        <div className="fixed bottom-6 right-6 left-6 z-50 flex justify-center">
          <Button 
            onClick={handleApply}
            className="flex-1 max-w-xs shadow-lg"
            size="lg"
          >
            Apply Now
          </Button>
        </div>
      )}
      
      {isMobile && showBottomButtons && (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 p-4 border-t border-gray-200 dark:border-gray-800 flex gap-2">
          {job.hasApplied ? (
            <Button
              onClick={handleViewApplication}
              className="flex-1"
              variant="outline"
            >
              View Application
            </Button>
          ) : (
            <Button
              onClick={handleApply}
              className="flex-1"
            >
              Apply Now
            </Button>
          )}
          
          <Button
            variant="outline"
            className="flex-none"
            onClick={handleSaveJob}
          >
            <Heart className="h-4 w-4" />
          </Button>
          
          <Button
            variant="outline"
            className="flex-none"
            onClick={handleShareJob}
          >
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default JobDetails;
