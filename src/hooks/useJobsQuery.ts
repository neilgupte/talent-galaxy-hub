import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Job, JobEmploymentType, JobOnsiteType, JobLevel } from '@/types';
import { mapDatabaseJobToModel } from '@/utils/jobMappers';

export interface JobFilters {
  employmentTypes: string[];
  jobLevels: string[];
  onsiteTypes: string[];
  salaryRange: [number, number];
}

interface UseJobsQueryProps {
  searchQuery: string;
  currentPage: number;
  selectedFilters: JobFilters;
  sortBy: 'date' | 'salary';
  jobsPerPage: number;
  fetchAllJobs?: boolean; // Parameter to fetch all jobs without filters
  countryCode?: string; // New parameter for country filtering
  includeAppliedJobs?: boolean; // New parameter to include applied jobs
}

// UK cities for location diversity
const UK_CITIES = [
  'London', 
  'Manchester', 
  'Birmingham', 
  'Leeds', 
  'Edinburgh', 
  'Glasgow', 
  'Liverpool', 
  'Bristol', 
  'Sheffield', 
  'Cardiff', 
  'Belfast', 
  'Newcastle'
];

// Company names for diversity
const COMPANY_NAMES = [
  'Tech Innovations UK',
  'Global Solutions Ltd',
  'British Digital Services',
  'London Tech Partners',
  'Northern Data Systems',
  'UK Healthcare Tech',
  'Financial Tech Solutions',
  'Green Energy Technologies',
  'Creative Media Group',
  'Advanced Manufacturing Ltd',
  'Educational Systems UK',
  'Cloud Services Britain',
  'UK Retail Technologies',
  'Smart City Solutions',
  'Quantum Computing UK'
];

// Job titles for each job level
const JOB_TITLES = {
  entry: [
    'Junior Developer', 
    'Graduate Engineer', 
    'Trainee Data Analyst', 
    'Entry-level Marketing Assistant',
    'Associate Designer',
    'Junior Customer Support',
    'Administrative Assistant',
    'Graduate Accountant'
  ],
  junior: [
    'Frontend Developer', 
    'Junior Software Engineer', 
    'Associate Project Manager', 
    'Junior Account Manager',
    'Sales Representative',
    'Junior Consultant',
    'Data Analyst',
    'Junior UX Designer'
  ],
  mid: [
    'Software Engineer', 
    'Web Developer', 
    'Project Manager', 
    'Product Manager',
    'UX/UI Designer',
    'Marketing Specialist',
    'HR Advisor',
    'Business Analyst'
  ],
  senior: [
    'Senior Software Engineer', 
    'Lead Developer', 
    'Senior Project Manager', 
    'Senior Product Manager',
    'Technical Lead',
    'Senior UX Designer',
    'Senior Marketing Strategist',
    'Senior Financial Analyst'
  ],
  executive: [
    'CTO', 
    'Technical Director', 
    'VP of Engineering', 
    'Director of Operations',
    'Chief Product Officer',
    'Head of Design',
    'VP of Marketing',
    'Director of Finance'
  ]
};

// Salary ranges by job level (in GBP)
const SALARY_RANGES = {
  entry: [20000, 35000],
  junior: [30000, 45000],
  mid: [40000, 65000],
  senior: [60000, 100000],
  executive: [90000, 250000]
};

export const useJobsQuery = ({
  searchQuery,
  currentPage,
  selectedFilters,
  sortBy,
  jobsPerPage,
  fetchAllJobs = false,
  countryCode = 'UK', // Default to UK for geo-targeting
  includeAppliedJobs = false // Default to false
}: UseJobsQueryProps) => {
  return useQuery({
    queryKey: ['jobs', currentPage, searchQuery, selectedFilters, sortBy, fetchAllJobs, countryCode, includeAppliedJobs],
    queryFn: async () => {
      console.log('Fetching jobs, page:', currentPage, 'query:', searchQuery, 'fetchAllJobs:', fetchAllJobs, 'country:', countryCode);
      
      try {
        let query = supabase
          .from('jobs')
          .select('*, companies(*)');
        
        // If fetchAllJobs is true, skip all filters and pagination
        if (fetchAllJobs) {
          console.log('🔥 Fetching ALL jobs without filters or pagination');
          query = query.eq('status', 'active').order('created_at', { ascending: false });
        } else {
          // Apply standard filtering and pagination
          const from = (currentPage - 1) * jobsPerPage;
          const to = from + jobsPerPage - 1;
          
          query = query.eq('status', 'active'); 
          
          // Apply country filter for geo-targeting
          // Either the country matches or the locations array contains the country
          if (countryCode) {
            query = query.or(`country.eq.${countryCode},locations.cs.{"${countryCode}"}`);
          }
          
          if (searchQuery) {
            query = query.or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%,location.ilike.%${searchQuery}%`);
          }
          
          if (selectedFilters.employmentTypes.length > 0) {
            query = query.in('employment_type', selectedFilters.employmentTypes);
          }
          
          if (selectedFilters.jobLevels.length > 0) {
            query = query.in('job_level', selectedFilters.jobLevels);
          }
          
          if (selectedFilters.onsiteTypes.length > 0) {
            query = query.in('onsite_type', selectedFilters.onsiteTypes);
          }
          
          // Add salary range filter
          if (selectedFilters.salaryRange[0] > 0) {
            query = query.gte('salary_min', selectedFilters.salaryRange[0]);
          }
          
          if (selectedFilters.salaryRange[1] < 250000) {
            query = query.lte('salary_max', selectedFilters.salaryRange[1]);
          }
          
          if (sortBy === 'date') {
            query = query.order('created_at', { ascending: false });
          } else if (sortBy === 'salary') {
            query = query.order('salary_max', { ascending: false });
          }
          
          query = query.range(from, to);
        }
        
        let { data, error, count } = await query;
        console.log('🔥 Supabase returned:', data?.length || 0, 'jobs');
        
        if (error) {
          console.error('Error fetching jobs:', error);
          toast.error('Failed to fetch jobs. Please try again.');
          throw error;
        }
        
        let jobsData = data || [];
        let mappedJobs;
        
        // If we have data from Supabase, use that
        if (jobsData.length > 0) {
          // Map jobs to model
          mappedJobs = jobsData.map(job => mapDatabaseJobToModel(job));
        } else {
          // Generate mock diverse data if no results from Supabase
          mappedJobs = generateDiverseJobs(
            searchQuery, 
            selectedFilters, 
            jobsPerPage,
            includeAppliedJobs
          );
          count = 120; // Set a reasonable total count for mock data
        }
        
        console.log('🟢 Final job data:', mappedJobs.length, mappedJobs);

        return {
          jobs: mappedJobs,
          totalCount: fetchAllJobs ? mappedJobs.length : (count || mappedJobs.length),
        };
      } catch (err) {
        console.error('Exception fetching jobs:', err);
        throw err;
      }
    },
    staleTime: 1000 * 30, // 30 seconds stale time
    retry: 2, // Add retry logic in case of network issues
  });
};

// Function to generate diverse jobs that match all filter combinations
function generateDiverseJobs(
  searchQuery: string,
  filters: JobFilters,
  jobsPerPage: number,
  includeAppliedJobs: boolean
): Job[] {
  console.log('Generating diverse jobs with filters:', filters);
  
  // Generate a diverse set of 100 jobs to start with
  const allJobs: Job[] = [];
  const employmentTypes: JobEmploymentType[] = ['full_time', 'part_time', 'contract', 'temporary', 'internship'];
  const jobLevels: JobLevel[] = ['entry', 'junior', 'mid', 'senior', 'executive'];
  const onsiteTypes: JobOnsiteType[] = ['onsite', 'hybrid', 'remote'];
  
  // Generate jobs for each combination to ensure coverage
  for (const level of jobLevels) {
    for (const employmentType of employmentTypes) {
      for (const onsiteType of onsiteTypes) {
        // Create at least 3 jobs for each combination
        for (let i = 0; i < 3; i++) {
          const jobCity = UK_CITIES[Math.floor(Math.random() * UK_CITIES.length)];
          const companyName = COMPANY_NAMES[Math.floor(Math.random() * COMPANY_NAMES.length)];
          const jobTitles = JOB_TITLES[level];
          const jobTitle = jobTitles[Math.floor(Math.random() * jobTitles.length)];
          const salaryRange = SALARY_RANGES[level];
          
          // Add some randomness to salaries
          const salaryMin = Math.round(salaryRange[0] - 5000 + (Math.random() * 10000));
          const salaryMax = Math.round(salaryRange[1] - 10000 + (Math.random() * 20000));
          
          // Create location with variation
          let location = `${jobCity}, UK`;
          // Sometimes create multi-location jobs
          if (Math.random() > 0.7 && onsiteType !== 'remote') {
            const secondCity = UK_CITIES.filter(c => c !== jobCity)[Math.floor(Math.random() * (UK_CITIES.length - 1))];
            location = `${jobCity} & ${secondCity}, UK`;
          }
          
          // For remote jobs, sometimes make them fully remote
          if (onsiteType === 'remote') {
            if (Math.random() > 0.5) {
              location = 'Remote, UK';
            } else {
              location = `${jobCity}, UK (Remote)`;
            }
          }
          
          // Generate job description
          let description = `We're looking for a ${jobTitle} to join our team`;
          if (onsiteType === 'remote') {
            description += ` remotely`;
          } else if (onsiteType === 'hybrid') {
            description += ` in a hybrid setup`;
          } else {
            description += ` at our ${jobCity} office`;
          }
          
          description += `. This is a ${employmentType.replace('_', ' ')} position perfect for ${level === 'entry' ? 'someone starting their career' : level === 'junior' ? 'those early in their career' : level === 'mid' ? 'experienced professionals' : level === 'senior' ? 'seasoned experts' : 'executive leaders'}. You'll be working on exciting projects in a collaborative environment with competitive compensation between £${salaryMin.toLocaleString()} - £${salaryMax.toLocaleString()} per year.`;
          
          // Generate requirements based on job level
          const requirements = [
            `${level === 'entry' ? '0-1' : level === 'junior' ? '1-2' : level === 'mid' ? '3-5' : level === 'senior' ? '5+' : '10+'} years of relevant experience`,
            `Strong communication skills`,
            `${level === 'entry' || level === 'junior' ? 'Basic understanding' : 'Expert knowledge'} of industry tools`,
            employmentType === 'full_time' ? 'Ability to work full time' : employmentType === 'part_time' ? 'Flexible availability' : 'Adaptable schedule',
            onsiteType === 'remote' ? 'Strong remote collaboration skills' : onsiteType === 'hybrid' ? 'Ability to work both remotely and in-office' : 'Daily office presence',
          ];
          
          // Generate unique ID
          const id = `mock-${level}-${employmentType}-${onsiteType}-${i}-${Date.now()}`;
          
          // Create the job object
          const job: Job = {
            id,
            companyId: `company-${companyName.replace(/\s+/g, '-').toLowerCase()}`,
            title: jobTitle,
            description,
            location,
            locations: location.split(' & ').map(loc => loc.trim()),
            salaryMin,
            salaryMax,
            employmentType,
            onsiteType,
            jobLevel: level,
            requirements,
            status: 'active',
            isHighPriority: Math.random() > 0.8,
            isBoosted: Math.random() > 0.9,
            endDate: new Date(Date.now() + (30 + Math.floor(Math.random() * 60)) * 24 * 60 * 60 * 1000).toISOString(),
            createdAt: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString(),
            updatedAt: new Date().toISOString(),
            country: 'UK',
            city: jobCity,
            currency: 'GBP',
            acceptsInternationalApplications: Math.random() > 0.7,
            visaSponsorshipAvailable: Math.random() > 0.8,
            company: {
              id: `company-${companyName.replace(/\s+/g, '-').toLowerCase()}`,
              name: companyName,
              industry: getIndustryForCompany(companyName),
              description: `${companyName} is a leading provider of innovative solutions in the ${getIndustryForCompany(companyName)} industry.`,
              logoUrl: '/lovable-uploads/51540783-120d-4616-82a5-16011c4b6344.png',
              planType: Math.random() > 0.7 ? 'premium' : 'standard' as 'free' | 'standard' | 'premium',
              recruiterType: Math.random() > 0.3 ? 'internal' : 'agency' // 70% internal, 30% agency recruiters
            },
            matchPercentage: 50 + Math.floor(Math.random() * 50)
          };
          
          allJobs.push(job);
        }
      }
    }
  }
  
  // If includeAppliedJobs flag is true, mark some jobs as applied
  if (includeAppliedJobs) {
    const applicationStatuses: ('pending' | 'reviewing' | 'interview' | 'offer')[] = 
      ['pending', 'reviewing', 'interview', 'offer'];
    
    // Mark every 6th job as applied
    for (let i = 0; i < allJobs.length; i += 6) {
      const statusIndex = i % applicationStatuses.length;
      allJobs[i].hasApplied = true;
      allJobs[i].applicationStatus = applicationStatuses[statusIndex];
      allJobs[i].applicationId = `app-${i}-${Date.now()}`;
    }
  }
  
  // Filter based on user's selected filters
  let filteredJobs = [...allJobs];
  
  // Apply search term filter if needed
  if (searchQuery) {
    filteredJobs = filteredJobs.filter(job => 
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company?.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }
  
  // Apply employment type filter if needed
  if (filters.employmentTypes.length > 0) {
    filteredJobs = filteredJobs.filter(job => 
      filters.employmentTypes.includes(job.employmentType)
    );
  }
  
  // Apply job level filter if needed
  if (filters.jobLevels.length > 0) {
    filteredJobs = filteredJobs.filter(job => 
      filters.jobLevels.includes(job.jobLevel)
    );
  }
  
  // Apply onsite type filter if needed
  if (filters.onsiteTypes.length > 0) {
    filteredJobs = filteredJobs.filter(job => 
      filters.onsiteTypes.includes(job.onsiteType)
    );
  }
  
  // Apply salary range filter if needed
  if (filters.salaryRange[0] > 0 || filters.salaryRange[1] < 250000) {
    filteredJobs = filteredJobs.filter(job => 
      (job.salaryMax && job.salaryMax >= filters.salaryRange[0]) &&
      (job.salaryMin && job.salaryMin <= filters.salaryRange[1])
    );
  }
  
  // In case we still don't have enough jobs to match the current filter combination,
  // ensure we have at least 3 jobs for each filtered result
  if (filteredJobs.length < 3) {
    console.log('Not enough filtered jobs, adding more to match filters');
    
    // Get employment types to match (either filtered ones or all types)
    const employmentTypesToMatch = filters.employmentTypes.length > 0 
      ? filters.employmentTypes as JobEmploymentType[] 
      : employmentTypes;
      
    // Get job levels to match (either filtered ones or all levels)
    const jobLevelsToMatch = filters.jobLevels.length > 0 
      ? filters.jobLevels as JobLevel[] 
      : jobLevels;
      
    // Get onsite types to match (either filtered ones or all types)
    const onsiteTypesToMatch = filters.onsiteTypes.length > 0 
      ? filters.onsiteTypes as JobOnsiteType[] 
      : onsiteTypes;
    
    // Add jobs that exactly match the filter criteria
    for (const employmentType of employmentTypesToMatch) {
      for (const jobLevel of jobLevelsToMatch) {
        for (const onsiteType of onsiteTypesToMatch) {
          // Check if we have enough jobs for this specific combination
          const matchingJobs = filteredJobs.filter(job => 
            job.employmentType === employmentType && 
            job.jobLevel === jobLevel && 
            job.onsiteType === onsiteType
          );
          
          // If we don't have at least 3 jobs for this combination, add more
          if (matchingJobs.length < 3) {
            const jobsToAdd = 3 - matchingJobs.length;
            
            for (let i = 0; i < jobsToAdd; i++) {
              const jobCity = UK_CITIES[Math.floor(Math.random() * UK_CITIES.length)];
              const companyName = COMPANY_NAMES[Math.floor(Math.random() * COMPANY_NAMES.length)];
              const jobTitles = JOB_TITLES[jobLevel];
              const jobTitle = jobTitles[Math.floor(Math.random() * jobTitles.length)];
              
              // Ensure salary range matches filter if specified
              let salaryRange = SALARY_RANGES[jobLevel];
              let salaryMin = Math.max(salaryRange[0], filters.salaryRange[0]);
              let salaryMax = Math.min(salaryRange[1], filters.salaryRange[1]);
              
              // Add some randomness but ensure it stays within filter range
              salaryMin = Math.round(salaryMin + (Math.random() * 5000));
              salaryMax = Math.round(Math.max(salaryMin + 10000, salaryMax - (Math.random() * 10000)));
              
              // Create location with variation
              let location = `${jobCity}, UK`;
              if (onsiteType === 'remote') {
                location = 'Remote, UK';
              }
              
              // Include search term in job title or description if specified
              let jobTitleWithSearch = jobTitle;
              let description = `We're looking for a ${jobTitle} to join our team`;
              
              if (searchQuery) {
                if (!jobTitle.toLowerCase().includes(searchQuery.toLowerCase())) {
                  jobTitleWithSearch = `${jobTitle} (${searchQuery})`;
                }
                if (!description.toLowerCase().includes(searchQuery.toLowerCase())) {
                  description += ` with expertise in ${searchQuery}`;
                }
              }
              
              const job: Job = {
                id: `forced-match-${employmentType}-${jobLevel}-${onsiteType}-${i}-${Date.now()}`,
                companyId: `company-${companyName.replace(/\s+/g, '-').toLowerCase()}`,
                title: jobTitleWithSearch,
                description,
                location,
                locations: [location],
                salaryMin,
                salaryMax,
                employmentType,
                onsiteType,
                jobLevel,
                requirements: [
                  `Experience with ${searchQuery || 'relevant technologies'}`,
                  'Team collaboration skills'
                ],
                status: 'active',
                isHighPriority: true,
                isBoosted: true,
                endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                country: 'UK',
                city: jobCity,
                currency: 'GBP',
                company: {
                  id: `company-${companyName.replace(/\s+/g, '-').toLowerCase()}`,
                  name: companyName,
                  industry: getIndustryForCompany(companyName),
                  description: `${companyName} is a leading provider in the ${getIndustryForCompany(companyName)} industry.`,
                  logoUrl: '/lovable-uploads/51540783-120d-4616-82a5-16011c4b6344.png',
                  planType: 'premium',
                  recruiterType: 'internal'
                },
                matchPercentage: 85 + Math.floor(Math.random() * 15)
              };
              
              filteredJobs.push(job);
            }
          }
        }
      }
    }
  }
  
  // Return the appropriate number of jobs for the current page
  // Sort by creation date before returning (newest first)
  return filteredJobs
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, jobsPerPage);
}

// Helper function to determine industry based on company name
function getIndustryForCompany(companyName: string): string {
  if (companyName.includes('Tech') || companyName.includes('Digital')) {
    return 'Technology';
  } else if (companyName.includes('Healthcare')) {
    return 'Healthcare';
  } else if (companyName.includes('Financial')) {
    return 'Finance';
  } else if (companyName.includes('Energy') || companyName.includes('Green')) {
    return 'Energy';
  } else if (companyName.includes('Media') || companyName.includes('Creative')) {
    return 'Media & Entertainment';
  } else if (companyName.includes('Manufacturing')) {
    return 'Manufacturing';
  } else if (companyName.includes('Educational')) {
    return 'Education';
  } else if (companyName.includes('Cloud')) {
    return 'Cloud Computing';
  } else if (companyName.includes('Retail')) {
    return 'Retail';
  } else if (companyName.includes('City')) {
    return 'Smart Cities';
  } else if (companyName.includes('Quantum')) {
    return 'Quantum Computing';
  } else {
    return 'Business Services';
  }
}
