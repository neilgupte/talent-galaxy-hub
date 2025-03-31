
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { 
  Search, 
  Filter, 
  Clock, 
  Bookmark, 
  MoreVertical, 
  Trash, 
  Eye, 
  ExternalLink,
  AlertCircle
} from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';

// Mock data for saved jobs
const mockSavedJobs = [
  {
    id: 'job1',
    title: 'Senior Frontend Developer',
    company: 'Tech Innovations Inc.',
    location: 'San Francisco, CA',
    type: 'Full-time',
    salary: '$120,000 - $150,000',
    savedDate: '2023-06-15T10:30:00Z',
    logo: 'https://picsum.photos/seed/company1/40/40',
    expiresIn: 12, // days
    isActive: true
  },
  {
    id: 'job2',
    title: 'UX/UI Designer',
    company: 'Creative Solutions',
    location: 'Remote',
    type: 'Full-time',
    salary: '$90,000 - $110,000',
    savedDate: '2023-06-10T08:15:00Z',
    logo: 'https://picsum.photos/seed/company2/40/40',
    expiresIn: 5, // days
    isActive: true
  },
  {
    id: 'job3',
    title: 'Product Manager',
    company: 'Growth Startup',
    location: 'New York, NY',
    type: 'Full-time',
    salary: '$130,000 - $160,000',
    savedDate: '2023-06-05T14:45:00Z',
    logo: 'https://picsum.photos/seed/company3/40/40',
    expiresIn: 8, // days
    isActive: true
  },
  {
    id: 'job4',
    title: 'Backend Developer',
    company: 'Data Systems Co.',
    location: 'Chicago, IL',
    type: 'Contract',
    salary: '$60/hr',
    savedDate: '2023-06-01T11:20:00Z',
    logo: 'https://picsum.photos/seed/company4/40/40',
    expiresIn: 0, // days
    isActive: false
  },
  {
    id: 'job5',
    title: 'Marketing Specialist',
    company: 'Brand Builders',
    location: 'Austin, TX',
    type: 'Part-time',
    salary: '$30/hr',
    savedDate: '2023-05-28T09:10:00Z',
    logo: 'https://picsum.photos/seed/company5/40/40',
    expiresIn: -3, // days (expired)
    isActive: false
  }
];

const SavedJobsPage = () => {
  const { toast } = useToast();
  const [savedJobs, setSavedJobs] = useState(mockSavedJobs);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedJobs, setSelectedJobs] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState('all');
  
  const filteredJobs = savedJobs.filter(job => {
    const matchesSearch = 
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.location.toLowerCase().includes(searchQuery.toLowerCase());
      
    if (activeTab === 'all') return matchesSearch;
    if (activeTab === 'active') return matchesSearch && job.isActive;
    if (activeTab === 'expired') return matchesSearch && !job.isActive;
    
    return matchesSearch;
  });
  
  const handleToggleSelect = (jobId: string) => {
    setSelectedJobs(prev => 
      prev.includes(jobId) 
        ? prev.filter(id => id !== jobId)
        : [...prev, jobId]
    );
  };
  
  const handleSelectAll = () => {
    if (selectedJobs.length === filteredJobs.length) {
      setSelectedJobs([]);
    } else {
      setSelectedJobs(filteredJobs.map(job => job.id));
    }
  };
  
  const handleRemoveJob = (jobId: string) => {
    setSavedJobs(jobs => jobs.filter(job => job.id !== jobId));
    setSelectedJobs(prev => prev.filter(id => id !== jobId));
    
    toast({
      title: "Job removed",
      description: "The job has been removed from your saved list",
    });
  };
  
  const handleRemoveSelected = () => {
    if (selectedJobs.length === 0) return;
    
    setSavedJobs(jobs => jobs.filter(job => !selectedJobs.includes(job.id)));
    setSelectedJobs([]);
    
    toast({
      title: "Jobs removed",
      description: `${selectedJobs.length} jobs have been removed from your saved list`,
    });
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Saved Jobs</h1>
          <p className="text-muted-foreground mt-1">
            {savedJobs.length} jobs saved for later
          </p>
        </div>
        
        <Button asChild variant="outline">
          <Link to="/jobs">
            <Search className="mr-2 h-4 w-4" /> Find New Jobs
          </Link>
        </Button>
      </div>
      
      <div className="grid md:grid-cols-7 gap-6 mb-6">
        <div className="md:col-span-5">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              type="search"
              placeholder="Search saved jobs..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        
        <div className="md:col-span-2 flex gap-2">
          <Button variant="outline" className="flex-1">
            <Filter className="mr-2 h-4 w-4" /> Filter
          </Button>
          
          <Button 
            variant="default" 
            className="flex-1"
            onClick={handleRemoveSelected}
            disabled={selectedJobs.length === 0}
          >
            <Trash className="mr-2 h-4 w-4" /> Delete
          </Button>
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-950 rounded-lg border shadow-sm mb-8">
        <div className="p-4 border-b">
          <Tabs defaultValue="all" onValueChange={setActiveTab}>
            <div className="flex items-center justify-between">
              <TabsList>
                <TabsTrigger value="all">All Saved</TabsTrigger>
                <TabsTrigger value="active">Active</TabsTrigger>
                <TabsTrigger value="expired">Expired</TabsTrigger>
              </TabsList>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="selectAll" 
                  checked={selectedJobs.length === filteredJobs.length && filteredJobs.length > 0}
                  onCheckedChange={handleSelectAll}
                />
                <label htmlFor="selectAll" className="text-sm text-muted-foreground">
                  Select All
                </label>
              </div>
            </div>
            
            <TabsContent value="all" className="mt-0">
              {filteredJobs.length === 0 && (
                <div className="py-12 text-center">
                  <Bookmark className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No saved jobs found</h3>
                  <p className="text-muted-foreground mb-6">
                    {searchQuery ? 'Try another search term' : 'Start saving jobs to view them here'}
                  </p>
                  <Button asChild>
                    <Link to="/jobs">Browse Jobs</Link>
                  </Button>
                </div>
              )}
              
              {filteredJobs.map(job => (
                <SavedJobCard 
                  key={job.id}
                  job={job}
                  isSelected={selectedJobs.includes(job.id)}
                  onToggleSelect={() => handleToggleSelect(job.id)}
                  onRemove={() => handleRemoveJob(job.id)}
                  formatDate={formatDate}
                />
              ))}
            </TabsContent>
            
            <TabsContent value="active" className="mt-0">
              {filteredJobs.length === 0 && (
                <div className="py-12 text-center">
                  <Bookmark className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No active saved jobs found</h3>
                  <p className="text-muted-foreground mb-6">
                    {searchQuery ? 'Try another search term' : 'Jobs that are still open will appear here'}
                  </p>
                  <Button asChild>
                    <Link to="/jobs">Browse Jobs</Link>
                  </Button>
                </div>
              )}
              
              {filteredJobs.map(job => (
                <SavedJobCard 
                  key={job.id}
                  job={job}
                  isSelected={selectedJobs.includes(job.id)}
                  onToggleSelect={() => handleToggleSelect(job.id)}
                  onRemove={() => handleRemoveJob(job.id)}
                  formatDate={formatDate}
                />
              ))}
            </TabsContent>
            
            <TabsContent value="expired" className="mt-0">
              {filteredJobs.length === 0 && (
                <div className="py-12 text-center">
                  <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No expired saved jobs found</h3>
                  <p className="text-muted-foreground mb-6">
                    {searchQuery ? 'Try another search term' : 'Jobs that have expired will appear here'}
                  </p>
                  <Button asChild>
                    <Link to="/jobs">Browse Jobs</Link>
                  </Button>
                </div>
              )}
              
              {filteredJobs.map(job => (
                <SavedJobCard 
                  key={job.id}
                  job={job}
                  isSelected={selectedJobs.includes(job.id)}
                  onToggleSelect={() => handleToggleSelect(job.id)}
                  onRemove={() => handleRemoveJob(job.id)}
                  formatDate={formatDate}
                />
              ))}
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      <div className="bg-muted rounded-lg p-6 text-center">
        <h2 className="text-lg font-semibold mb-2">Job Search Tips</h2>
        <p className="text-muted-foreground mb-4">
          Save jobs that interest you to keep track of opportunities and apply when you're ready.
        </p>
        <div className="grid sm:grid-cols-3 gap-4 text-left">
          <div className="bg-card rounded-md p-4 border">
            <h3 className="font-medium mb-2 flex items-center">
              <Clock className="mr-2 h-4 w-4 text-primary" /> Set Reminders
            </h3>
            <p className="text-sm text-muted-foreground">
              Don't miss application deadlines. Set reminders for jobs you want to apply to.
            </p>
          </div>
          <div className="bg-card rounded-md p-4 border">
            <h3 className="font-medium mb-2 flex items-center">
              <Eye className="mr-2 h-4 w-4 text-primary" /> Review Regularly
            </h3>
            <p className="text-sm text-muted-foreground">
              Review your saved jobs regularly to stay organized and focused on your job search.
            </p>
          </div>
          <div className="bg-card rounded-md p-4 border">
            <h3 className="font-medium mb-2 flex items-center">
              <ExternalLink className="mr-2 h-4 w-4 text-primary" /> Research Companies
            </h3>
            <p className="text-sm text-muted-foreground">
              Research companies before applying to tailor your application to their culture and needs.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

interface SavedJobCardProps {
  job: typeof mockSavedJobs[0];
  isSelected: boolean;
  onToggleSelect: () => void;
  onRemove: () => void;
  formatDate: (date: string) => string;
}

const SavedJobCard = ({ job, isSelected, onToggleSelect, onRemove, formatDate }: SavedJobCardProps) => {
  return (
    <Card className="mb-4 border-0 shadow-none">
      <CardContent className="p-4">
        <div className="flex items-start">
          <Checkbox 
            checked={isSelected}
            onCheckedChange={onToggleSelect}
            className="mt-1 mr-4" 
          />
          
          <div className="mr-4">
            <div className="w-10 h-10 rounded bg-muted flex items-center justify-center overflow-hidden">
              <img src={job.logo} alt={job.company} className="w-full h-full object-cover" />
            </div>
          </div>
          
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-lg">
                  <Link to={`/jobs/${job.id}`} className="hover:text-primary">
                    {job.title}
                  </Link>
                </h3>
                <p className="text-muted-foreground">{job.company}</p>
              </div>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link to={`/jobs/${job.id}`}>View Job</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to={`/applications/job/${job.id}/apply`}>Apply Now</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={onRemove} className="text-destructive">
                    Remove from Saved
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            
            <div className="flex flex-wrap gap-2 mt-2">
              <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold text-muted-foreground">
                {job.location}
              </span>
              <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold text-muted-foreground">
                {job.type}
              </span>
              <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold text-muted-foreground">
                {job.salary}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
      
      <Separator />
      
      <CardFooter className="p-4 flex items-center justify-between">
        <div className="flex items-center text-sm text-muted-foreground">
          <Clock className="mr-1 h-4 w-4" />
          <span>Saved on {formatDate(job.savedDate)}</span>
        </div>
        
        <div className="flex items-center gap-3">
          {!job.isActive && (
            <span className="text-sm text-destructive flex items-center">
              <AlertCircle className="mr-1 h-4 w-4" />
              Expired
            </span>
          )}
          
          {job.isActive && job.expiresIn <= 7 && (
            <span className="text-sm text-amber-500 dark:text-amber-400 flex items-center">
              <Clock className="mr-1 h-4 w-4" />
              Expires in {job.expiresIn} days
            </span>
          )}
          
          <Button asChild variant="outline" size="sm">
            <Link to={`/applications/job/${job.id}/apply`}>
              Apply Now
            </Link>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default SavedJobsPage;
