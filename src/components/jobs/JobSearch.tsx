import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import JobCard from '@/components/jobs/JobCard';
import { Job } from '@/types';
import { Search, MapPin, SlidersHorizontal, X } from 'lucide-react';

// Mock data for job listings
const MOCK_JOBS: Job[] = [
  {
    id: 'job1',
    companyId: 'company1',
    title: 'Senior Frontend Developer',
    description: 'We are seeking an experienced Frontend Developer to join our team...',
    location: 'New York, NY',
    salaryMin: 100000,
    salaryMax: 130000,
    employmentType: 'full_time',
    onsiteType: 'hybrid',
    jobLevel: 'senior',
    requirements: ['5+ years of React experience', 'TypeScript proficiency', 'UI/UX knowledge'],
    status: 'active',
    isHighPriority: true,
    isBoosted: false,
    endDate: '2023-10-30',
    createdAt: '2023-09-01',
    updatedAt: '2023-09-01',
    company: {
      id: 'company1',
      name: 'Tech Solutions Inc',
      industry: 'Software Development',
      description: 'Leading provider of innovative software solutions',
      logoUrl: '/placeholder.svg',
      planType: 'premium',
      recruiterType: 'internal'
    },
    matchPercentage: 92
  },
  {
    id: 'job2',
    companyId: 'company2',
    title: 'UX Designer',
    description: 'Looking for a creative UX Designer to create amazing user experiences...',
    location: 'Remote',
    salaryMin: 80000,
    salaryMax: 110000,
    employmentType: 'full_time',
    onsiteType: 'remote',
    jobLevel: 'mid',
    requirements: ['3+ years of UX design experience', 'Figma proficiency', 'User research skills'],
    status: 'active',
    isHighPriority: false,
    isBoosted: true,
    endDate: '2023-10-25',
    createdAt: '2023-09-05',
    updatedAt: '2023-09-05',
    company: {
      id: 'company2',
      name: 'Creative Design Co',
      industry: 'Design',
      description: 'Award-winning design agency',
      logoUrl: '/placeholder.svg',
      planType: 'standard',
      recruiterType: 'internal'
    },
    matchPercentage: 80
  },
  {
    id: 'job3',
    companyId: 'company3',
    title: 'Full Stack Developer',
    description: 'Join our engineering team to build scalable web applications...',
    location: 'San Francisco, CA',
    salaryMin: 120000,
    salaryMax: 150000,
    employmentType: 'full_time',
    onsiteType: 'onsite',
    jobLevel: 'senior',
    requirements: ['Experience with Node.js', 'React knowledge', 'Database design'],
    status: 'active',
    isHighPriority: false,
    isBoosted: false,
    endDate: '2023-10-20',
    createdAt: '2023-09-10',
    updatedAt: '2023-09-10',
    company: {
      id: 'company3',
      name: 'Global Tech',
      industry: 'Technology',
      description: 'Global technology leader',
      logoUrl: '/placeholder.svg',
      planType: 'premium',
      recruiterType: 'internal'
    },
    matchPercentage: 75
  },
  {
    id: 'job4',
    companyId: 'company4',
    title: 'Product Manager',
    description: 'We need a Product Manager to lead our product development...',
    location: 'Remote',
    salaryMin: 90000,
    salaryMax: 120000,
    employmentType: 'full_time',
    onsiteType: 'remote',
    jobLevel: 'mid',
    requirements: ['3+ years in product management', 'Agile methodology', 'User-centric mindset'],
    status: 'active',
    isHighPriority: true,
    isBoosted: false,
    endDate: '2023-11-05',
    createdAt: '2023-09-15',
    updatedAt: '2023-09-15',
    company: {
      id: 'company4',
      name: 'Innovate Inc',
      industry: 'Product Development',
      description: 'Creating innovative products',
      logoUrl: '/placeholder.svg',
      planType: 'standard',
      recruiterType: 'internal'
    },
    matchPercentage: 65,
    hasApplied: true,
    applicationStatus: 'reviewing'
  }
];

const JobSearch: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [location, setLocation] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [employmentTypes, setEmploymentTypes] = useState<string[]>([]);
  const [jobLevels, setJobLevels] = useState<string[]>([]);
  const [onsiteTypes, setOnsiteTypes] = useState<string[]>([]);
  const [salaryRange, setSalaryRange] = useState([50000, 150000]);
  const [sortBy, setSortBy] = useState('match');
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  
  const toggleFilter = (filter: string, value: string) => {
    let newActiveFilters = [...activeFilters];
    const filterString = `${filter}:${value}`;
    
    if (newActiveFilters.includes(filterString)) {
      newActiveFilters = newActiveFilters.filter(f => f !== filterString);
    } else {
      newActiveFilters.push(filterString);
    }
    
    setActiveFilters(newActiveFilters);
    
    // Update the specific filter state
    switch(filter) {
      case 'employment':
        if (employmentTypes.includes(value)) {
          setEmploymentTypes(employmentTypes.filter(type => type !== value));
        } else {
          setEmploymentTypes([...employmentTypes, value]);
        }
        break;
      case 'level':
        if (jobLevels.includes(value)) {
          setJobLevels(jobLevels.filter(level => level !== value));
        } else {
          setJobLevels([...jobLevels, value]);
        }
        break;
      case 'onsite':
        if (onsiteTypes.includes(value)) {
          setOnsiteTypes(onsiteTypes.filter(type => type !== value));
        } else {
          setOnsiteTypes([...onsiteTypes, value]);
        }
        break;
    }
  };
  
  const removeFilter = (filter: string) => {
    const [type, value] = filter.split(':');
    
    if (type === 'salary') {
      setSalaryRange([50000, 150000]);
      setActiveFilters(activeFilters.filter(f => !f.startsWith('salary:')));
    } else {
      toggleFilter(type, value);
    }
  };
  
  const clearAllFilters = () => {
    setEmploymentTypes([]);
    setJobLevels([]);
    setOnsiteTypes([]);
    setSalaryRange([50000, 150000]);
    setActiveFilters([]);
  };
  
  const handleSalaryChange = (values: number[]) => {
    setSalaryRange(values);
    
    // Update active filters for salary
    const newActiveFilters = activeFilters.filter(f => !f.startsWith('salary:'));
    newActiveFilters.push(`salary:$${values[0].toLocaleString()}-$${values[1].toLocaleString()}`);
    setActiveFilters(newActiveFilters);
  };
  
  // Filter jobs based on search criteria
  const filteredJobs = MOCK_JOBS.filter(job => {
    // Search term filter
    const searchTermMatch = 
      !searchTerm || 
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company?.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Location filter
    const locationMatch = 
      !location || 
      job.location.toLowerCase().includes(location.toLowerCase());
    
    // Employment type filter
    const employmentTypeMatch = 
      employmentTypes.length === 0 || 
      employmentTypes.includes(job.employmentType);
    
    // Job level filter
    const jobLevelMatch = 
      jobLevels.length === 0 || 
      jobLevels.includes(job.jobLevel);
    
    // Onsite type filter
    const onsiteTypeMatch = 
      onsiteTypes.length === 0 || 
      onsiteTypes.includes(job.onsiteType);
    
    // Salary range filter
    const salaryMatch = 
      (job.salaryMin === undefined || job.salaryMin === null || job.salaryMin >= salaryRange[0]) &&
      (job.salaryMax === undefined || job.salaryMax === null || job.salaryMax <= salaryRange[1]);
    
    return searchTermMatch && locationMatch && employmentTypeMatch && jobLevelMatch && onsiteTypeMatch && salaryMatch;
  });
  
  // Sort jobs based on selected criteria
  const sortedJobs = [...filteredJobs].sort((a, b) => {
    switch(sortBy) {
      case 'match':
        return (b.matchPercentage || 0) - (a.matchPercentage || 0);
      case 'date':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'salary':
        return (b.salaryMax || 0) - (a.salaryMax || 0);
      default:
        return 0;
    }
  });

  return (
    <div className="container mx-auto p-4 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Find Your Perfect Job</h1>
        <p className="text-muted-foreground">
          Browse through thousands of job opportunities matched to your profile
        </p>
      </div>
      
      {/* Search Bar */}
      <div className="mb-8 grid grid-cols-1 lg:grid-cols-[1fr_1fr_auto] gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Job title, keywords, or company"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="City, state, or 'Remote'"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button className="w-full lg:w-auto">Find Jobs</Button>
      </div>
      
      {/* Filters and Results */}
      <div className="flex flex-col md:flex-row gap-6">
        {/* Filters on Mobile */}
        <div className="md:hidden mb-4">
          <Button
            variant="outline"
            className="w-full"
            onClick={() => setShowFilters(!showFilters)}
          >
            <SlidersHorizontal className="mr-2 h-4 w-4" />
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </Button>
        </div>
        
        {/* Filters - Show on desktop or when toggle enabled on mobile */}
        {(showFilters || window.innerWidth >= 768) && (
          <div className="w-full md:w-72 space-y-6">
            <div className="border rounded-lg p-4 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Filters</h3>
                <Button variant="ghost" className="h-auto p-0 text-sm" onClick={clearAllFilters}>
                  Clear All
                </Button>
              </div>
              
              <Accordion type="multiple" className="w-full">
                <AccordionItem value="salary">
                  <AccordionTrigger>Salary Range</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4 py-2">
                      <div className="flex justify-between text-sm">
                        <span>${salaryRange[0].toLocaleString()}</span>
                        <span>${salaryRange[1].toLocaleString()}</span>
                      </div>
                      <Slider
                        defaultValue={[50000, 150000]}
                        max={250000}
                        min={0}
                        step={5000}
                        value={salaryRange}
                        onValueChange={handleSalaryChange}
                      />
                    </div>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="employment">
                  <AccordionTrigger>Employment Type</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="full_time"
                          checked={employmentTypes.includes('full_time')}
                          onCheckedChange={() => toggleFilter('employment', 'full_time')}
                        />
                        <Label htmlFor="full_time">Full Time</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="part_time"
                          checked={employmentTypes.includes('part_time')}
                          onCheckedChange={() => toggleFilter('employment', 'part_time')}
                        />
                        <Label htmlFor="part_time">Part Time</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="contract"
                          checked={employmentTypes.includes('contract')}
                          onCheckedChange={() => toggleFilter('employment', 'contract')}
                        />
                        <Label htmlFor="contract">Contract</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="temporary"
                          checked={employmentTypes.includes('temporary')}
                          onCheckedChange={() => toggleFilter('employment', 'temporary')}
                        />
                        <Label htmlFor="temporary">Temporary</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="internship"
                          checked={employmentTypes.includes('internship')}
                          onCheckedChange={() => toggleFilter('employment', 'internship')}
                        />
                        <Label htmlFor="internship">Internship</Label>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="level">
                  <AccordionTrigger>Experience Level</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="entry"
                          checked={jobLevels.includes('entry')}
                          onCheckedChange={() => toggleFilter('level', 'entry')}
                        />
                        <Label htmlFor="entry">Entry Level</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="junior"
                          checked={jobLevels.includes('junior')}
                          onCheckedChange={() => toggleFilter('level', 'junior')}
                        />
                        <Label htmlFor="junior">Junior</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="mid"
                          checked={jobLevels.includes('mid')}
                          onCheckedChange={() => toggleFilter('level', 'mid')}
                        />
                        <Label htmlFor="mid">Mid Level</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="senior"
                          checked={jobLevels.includes('senior')}
                          onCheckedChange={() => toggleFilter('level', 'senior')}
                        />
                        <Label htmlFor="senior">Senior</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="executive"
                          checked={jobLevels.includes('executive')}
                          onCheckedChange={() => toggleFilter('level', 'executive')}
                        />
                        <Label htmlFor="executive">Executive</Label>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="location">
                  <AccordionTrigger>Location Type</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="onsite"
                          checked={onsiteTypes.includes('onsite')}
                          onCheckedChange={() => toggleFilter('onsite', 'onsite')}
                        />
                        <Label htmlFor="onsite">Onsite</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="hybrid"
                          checked={onsiteTypes.includes('hybrid')}
                          onCheckedChange={() => toggleFilter('onsite', 'hybrid')}
                        />
                        <Label htmlFor="hybrid">Hybrid</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="remote"
                          checked={onsiteTypes.includes('remote')}
                          onCheckedChange={() => toggleFilter('onsite', 'remote')}
                        />
                        <Label htmlFor="remote">Remote</Label>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        )}
        
        {/* Results */}
        <div className="flex-1">
          {/* Active Filters */}
          {activeFilters.length > 0 && (
            <div className="mb-4">
              <div className="flex flex-wrap gap-2">
                {activeFilters.map((filter) => (
                  <div
                    key={filter}
                    className="inline-flex items-center bg-primary/10 text-primary text-sm rounded-full px-3 py-1"
                  >
                    <span>{filter.split(':')[1]}</span>
                    <button
                      className="ml-2"
                      onClick={() => removeFilter(filter)}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
                {activeFilters.length > 1 && (
                  <button
                    className="text-sm text-primary hover:underline"
                    onClick={clearAllFilters}
                  >
                    Clear All
                  </button>
                )}
              </div>
            </div>
          )}
          
          {/* Sort Options */}
          <div className="mb-4 flex justify-between items-center">
            <div className="text-sm text-muted-foreground">
              {filteredJobs.length} jobs found
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm">Sort by:</span>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Best Match" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="match">Best Match</SelectItem>
                  <SelectItem value="date">Most Recent</SelectItem>
                  <SelectItem value="salary">Highest Salary</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {/* Job List */}
          <div className="space-y-4">
            {sortedJobs.length > 0 ? (
              sortedJobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))
            ) : (
              <div className="text-center py-12 border rounded-lg">
                <h3 className="text-lg font-medium mb-2">No jobs found</h3>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your search filters or search terms
                </p>
                <Button onClick={clearAllFilters}>Clear All Filters</Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobSearch;
