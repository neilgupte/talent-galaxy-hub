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
  ArrowRight
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Job, JobEmploymentType, JobOnsiteType, JobLevel } from '@/types';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import JobCard from '@/components/jobs/JobCard';
import { useIsMobile } from '@/hooks/use-mobile';

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
    
    return mapDatabaseJobToModel(data);
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
      // Parse location to avoid SQL injection
      const sanitizedLocation = jobLocation.split(',')[0].trim(); // Get just the city part
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

const mapDatabaseJobToModel = (job: any): Job => {
  // Parse salary information from either salary_min/max fields or salary_range string
  let salaryMin = 0;
  let salaryMax = 0;
  
  if (job.salary_min !== undefined && job.salary_min !== null) {
    salaryMin = job.salary_min;
  } else if (job.salary_range) {
    const parts = job.salary_range.split('-');
    if (parts.length >= 1) {
      const parsedMin = parseInt(parts[0].trim(), 10);
      if (!isNaN(parsedMin)) {
        salaryMin = parsedMin;
      }
    }
  }
  
  if (job.salary_max !== undefined && job.salary_max !== null) {
    salaryMax = job.salary_max;
  } else if (job.salary_range) {
    const parts = job.salary_range.split('-');
    if (parts.length >= 2) {
      const parsedMax = parseInt(parts[1].trim(), 10);
      if (!isNaN(parsedMax)) {
        salaryMax = parsedMax;
      }
    }
  }
  
  // Map locations array or set to single location if not available
  let locations: string[] = [];
  if (job.locations && Array.isArray(job.locations) && job.locations.length > 0) {
    locations = job.locations;
  } else if (job.location) {
    locations = [job.location];
  }
  
  // Handle requirements properly
  let requirements: string[] = [];
  if (job.requirements) {
    if (typeof job.requirements === 'string') {
      requirements = job.requirements.split(',').map((item: string) => item.trim());
    } else if (Array.isArray(job.requirements)) {
      requirements = job.requirements;
    }
  }
  
  return {
    id: job.id,
    companyId: job.company_id,
    title: job.title,
    description: job.description || '',
    location: job.location || '',
    locations: locations,
    salaryMin: salaryMin,
    salaryMax: salaryMax,
    employmentType: (job.employment_type || 'full_time') as JobEmploymentType,
    onsiteType: (job.onsite_type || 'onsite') as JobOnsiteType,
    jobLevel: (job.job_level || 'entry') as JobLevel,
    requirements: requirements,
    status: (job.status || 'active') as 'draft' | 'active' | 'expired' | 'closed',
    isHighPriority: job.is_high_priority || false,
    isBoosted: job.is_boosted || false,
    endDate: job.end_date || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: job.created_at,
    updatedAt: job.updated_at || job.created_at,
    country: job.country || '',
    city: job.city || '',
    currency: job.currency || 'USD',
    acceptsInternationalApplications: job.accepts_international_applications || false,
    visaSponsorshipAvailable: job.visa_sponsorship_available || false,
    company: job.companies ? {
      id: job.companies.id,
      name: job.companies.name,
      industry: job.companies.industry || '',
      description: job.companies.description || '',
      logoUrl: job.companies.logo_url || '/placeholder.svg',
      planType: job.companies.plan_type || 'free'
    } : undefined
  };
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
  
  // Show floating button on mobile (unless we've scrolled to the bottom)
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

  // Detect when user scrolls to bottom of page
  useEffect(() => {
    if (!isMobile) return;

    const handleScroll = () => {
      if (!mainContainerRef.current) return;

      const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
      // Check if we're near the bottom of the page
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

  // Display only 3 similar jobs for the preview section
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

            {/* Action buttons moved to the top section */}
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

              {/* Add Apply Now button at the bottom of the job description */}
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
                  
                  {/* New section for international applications */}
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

                  {/* Multiple locations display */}
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
      
      {/* Mobile floating Apply Now button */}
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
      
      {/* Bottom buttons that appear at the end of the page on mobile */}
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
