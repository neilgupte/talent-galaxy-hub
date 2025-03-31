
import React, { useEffect } from 'react';
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
  User 
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Job } from '@/types';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import JobCard from '@/components/jobs/JobCard';

// Function to fetch job details from Supabase
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
    
    // Map database job to model
    return {
      id: data.id,
      companyId: data.company_id,
      title: data.title,
      description: data.description || '',
      location: data.location || '',
      salaryMin: data.salary_min || 0,
      salaryMax: data.salary_max || 0,
      employmentType: data.employment_type || 'full_time',
      onsiteType: data.onsite_type || 'onsite',
      jobLevel: data.job_level || 'entry',
      requirements: data.requirements ? (typeof data.requirements === 'string' ? data.requirements.split(',').map((item: string) => item.trim()) : data.requirements) : [],
      status: data.status || 'active',
      isHighPriority: data.is_high_priority || false,
      isBoosted: data.is_boosted || false,
      endDate: data.end_date || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: data.created_at,
      updatedAt: data.updated_at || data.created_at,
      country: data.country || '',
      city: data.city || '',
      currency: data.currency || 'USD',
      company: data.companies ? {
        id: data.companies.id,
        name: data.companies.name,
        industry: data.companies.industry || '',
        description: data.companies.description || '',
        logoUrl: data.companies.logo_url || '/placeholder.svg',
        planType: data.companies.plan_type || 'free'
      } : undefined
    };
  } catch (error) {
    console.error('Failed to fetch job details:', error);
    throw error;
  }
};

// Function to fetch similar jobs
const fetchSimilarJobs = async (currentJobId: string, jobTitle: string, jobLocation: string): Promise<Job[]> => {
  try {
    console.log('Fetching similar jobs for:', { jobTitle, jobLocation });
    
    // Extract keywords from job title
    const keywords = jobTitle.split(' ').filter(word => word.length > 3);
    
    // Create a query to find jobs with similar titles or in the same location
    let query = supabase
      .from('jobs')
      .select('*, companies(*)')
      .eq('status', 'active')
      .neq('id', currentJobId) // Exclude current job
      .limit(4);
    
    // If we have location, prioritize same location
    if (jobLocation) {
      query = query.or(`location.ilike.%${jobLocation}%`);
    }
    
    // Add title keywords to search
    if (keywords.length > 0) {
      const titleSearch = keywords.map(keyword => `title.ilike.%${keyword}%`).join(',');
      query = query.or(titleSearch);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching similar jobs:', error);
      return [];
    }
    
    if (!data || data.length === 0) {
      console.log('No similar jobs found, fetching recent jobs instead');
      // Fall back to recent jobs if no similar jobs found
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
      
      data = recentJobs || [];
    }
    
    console.log(`Found ${data.length} similar/recent jobs`);
    
    // Map database jobs to model
    return data.map(job => ({
      id: job.id,
      companyId: job.company_id,
      title: job.title,
      description: job.description || '',
      location: job.location || '',
      salaryMin: job.salary_min || 0,
      salaryMax: job.salary_max || 0,
      employmentType: job.employment_type || 'full_time',
      onsiteType: job.onsite_type || 'onsite',
      jobLevel: job.job_level || 'entry',
      requirements: job.requirements ? (typeof job.requirements === 'string' ? job.requirements.split(',').map((item: string) => item.trim()) : job.requirements) : [],
      status: job.status || 'active',
      isHighPriority: job.is_high_priority || false,
      isBoosted: job.is_boosted || false,
      endDate: job.end_date || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: job.created_at,
      updatedAt: job.updated_at || job.created_at,
      country: job.country || '',
      city: job.city || '',
      currency: job.currency || 'USD',
      company: job.companies ? {
        id: job.companies.id,
        name: job.companies.name,
        industry: job.companies.industry || '',
        description: job.companies.description || '',
        logoUrl: job.companies.logo_url || '/placeholder.svg',
        planType: job.companies.plan_type || 'free'
      } : undefined
    }));
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
  
  const { data: job, isLoading, error } = useQuery({
    queryKey: ['job', id],
    queryFn: () => fetchJobDetails(id!),
    enabled: !!id
  });
  
  // Fetch similar jobs once we have the job details
  const { data: similarJobs = [], isLoading: isSimilarJobsLoading } = useQuery({
    queryKey: ['similarJobs', id, job?.title, job?.location],
    queryFn: () => fetchSimilarJobs(id!, job!.title, job!.location),
    enabled: !!id && !!job,
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
      
      {/* Similar Jobs Section */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6">Similar Jobs</h2>
        
        {isSimilarJobsLoading ? (
          <div className="flex justify-center py-8">
            <p>Loading similar jobs...</p>
          </div>
        ) : similarJobs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {similarJobs.map(similarJob => (
              <JobCard key={similarJob.id} job={similarJob} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <p>No similar jobs found at this time.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobDetails;
