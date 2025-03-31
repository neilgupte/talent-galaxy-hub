
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import JobCard from './JobCard';
import { Job, JobEmploymentType, JobOnsiteType, JobLevel } from '@/types';

const FeaturedJobs = () => {
  const { authState } = useAuth();
  const navigate = useNavigate();
  
  const { data, isLoading, error } = useQuery({
    queryKey: ['featuredJobs', authState.user?.id],
    queryFn: async () => {
      try {
        // First try to get user-specific job recommendations if logged in
        if (authState.isAuthenticated && authState.user) {
          // This is where you would normally fetch personalized recommendations
          // based on user profile, but for now we'll just fetch recent jobs
          console.log('Fetching personalized job recommendations for user:', authState.user.id);
        }
        
        // Fetch recent jobs as fallback or for non-authenticated users
        const { data, error } = await supabase
          .from('jobs')
          .select('*, companies(*)')
          .order('created_at', { ascending: false })
          .limit(3);
        
        if (error) throw error;
        
        // If no real data, create mock data for demo purposes
        if (!data || data.length === 0) {
          return Array.from({ length: 3 }, (_, i) => ({
            id: `featured-${i}`,
            companyId: `company-${i}`,
            title: i === 0 ? 'Senior UX Designer' : i === 1 ? 'Frontend Developer' : 'Marketing Manager',
            description: 'Join our team and work on exciting projects with the latest technologies.',
            location: i === 0 ? 'London, UK' : i === 1 ? 'Remote' : 'New York, USA',
            salaryMin: 50000 + i * 10000,
            salaryMax: 90000 + i * 15000,
            employmentType: i === 0 ? 'full_time' as JobEmploymentType : i === 1 ? 'contract' as JobEmploymentType : 'full_time' as JobEmploymentType,
            onsiteType: i === 0 ? 'hybrid' as JobOnsiteType : i === 1 ? 'remote' as JobOnsiteType : 'onsite' as JobOnsiteType,
            jobLevel: i === 0 ? 'senior' as JobLevel : i === 1 ? 'mid' as JobLevel : 'senior' as JobLevel,
            requirements: ['3+ years experience', 'Bachelor\'s degree', 'Team player'],
            status: 'active' as 'active',
            isHighPriority: i === 0,
            isBoosted: i === 1,
            endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            company: {
              id: `company-${i}`,
              name: i === 0 ? 'Design Studio' : i === 1 ? 'Tech Innovations' : 'Marketing Pro',
              industry: i === 0 ? 'Design' : i === 1 ? 'Technology' : 'Marketing',
              description: 'Leading company in the industry',
              logoUrl: '/placeholder.svg',
              planType: 'premium'
            },
            matchPercentage: 85 - (i * 7)
          }));
        }
        
        // Map database records to Job model
        return data.map((job: any) => ({
          id: job.id,
          companyId: job.company_id,
          title: job.title,
          description: job.description,
          location: job.location,
          salaryMin: job.salary_min || 0,
          salaryMax: job.salary_max || 0,
          employmentType: job.employment_type as JobEmploymentType,
          onsiteType: job.onsite_type as JobOnsiteType,
          jobLevel: job.job_level as JobLevel,
          requirements: job.requirements ? (typeof job.requirements === 'string' ? job.requirements.split(',') : job.requirements) : [],
          status: job.status as 'draft' | 'active' | 'expired' | 'closed',
          isHighPriority: job.is_high_priority,
          isBoosted: job.is_boosted,
          endDate: job.end_date || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          createdAt: job.created_at,
          updatedAt: job.updated_at,
          company: job.companies ? {
            id: job.companies.id,
            name: job.companies.name,
            industry: job.companies.industry || '',
            description: job.companies.description || '',
            logoUrl: job.companies.logo_url || '/placeholder.svg',
            planType: job.companies.plan_type || 'free'
          } : undefined,
          // Add a mock match percentage for UI display
          matchPercentage: Math.floor(70 + Math.random() * 25)
        }));
      } catch (err) {
        console.error('Error fetching featured jobs:', err);
        throw err;
      }
    },
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
  
  if (isLoading) {
    return (
      <div className="py-16 container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8 text-center">Latest jobs you may be interested in</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="border rounded-lg p-4">
              <Skeleton className="h-8 w-[200px] mb-4" />
              <Skeleton className="h-4 w-[150px] mb-2" />
              <Skeleton className="h-4 w-full mb-4" />
              <div className="flex flex-wrap gap-2 mt-2">
                <Skeleton className="h-6 w-[80px]" />
                <Skeleton className="h-6 w-[100px]" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  if (error || !data) {
    return null; // Don't show section on error to avoid disrupting homepage
  }
  
  return (
    <div className="py-16 container mx-auto px-4">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold">Latest jobs you may be interested in</h2>
        <Button variant="outline" onClick={() => navigate('/jobs')} className="gap-2">
          See more jobs <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {data.map((job) => (
          <JobCard key={job.id} job={job} />
        ))}
      </div>
    </div>
  );
};

export default FeaturedJobs;
