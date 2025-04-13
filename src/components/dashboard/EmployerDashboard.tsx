
import React, { useState } from 'react';
import { useAuth } from '@/context/auth/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Link } from 'react-router-dom';
import {
  BarChart,
  Briefcase,
  Building,
  Clock,
  FileText,
  PlusCircle,
  Search,
  Users,
  Mail,
  Calendar,
  Settings,
} from 'lucide-react';

// Mock data
const mockJobs = [
  {
    id: 'job1',
    title: 'Senior Frontend Developer',
    location: 'New York, NY',
    status: 'published',
    applicants: 12,
    views: 245,
    postedDate: '2023-09-05',
    endDate: '2023-10-05',
    isHighPriority: true
  },
  {
    id: 'job2',
    title: 'UI/UX Designer',
    location: 'Remote',
    status: 'published',
    applicants: 8,
    views: 187,
    postedDate: '2023-09-10',
    endDate: '2023-10-10',
    isBoosted: true
  },
  {
    id: 'job3',
    title: 'Product Manager',
    location: 'San Francisco, CA',
    status: 'draft',
    applicants: 0,
    views: 0,
    postedDate: null,
    endDate: null
  }
];

const mockApplicants = [
  {
    id: 'app1',
    name: 'Emily Johnson',
    jobTitle: 'Senior Frontend Developer',
    matchPercentage: 92,
    aiScore: 88,
    status: 'under_review',
    appliedDate: '2023-09-15'
  },
  {
    id: 'app2',
    name: 'Michael Chen',
    jobTitle: 'UI/UX Designer',
    matchPercentage: 85,
    aiScore: 82,
    status: 'interview',
    appliedDate: '2023-09-12'
  },
  {
    id: 'app3',
    name: 'Sarah Miller',
    jobTitle: 'Senior Frontend Developer',
    matchPercentage: 78,
    aiScore: 75,
    status: 'under_review',
    appliedDate: '2023-09-16'
  }
];

const EmployerDashboard = () => {
  const { authState } = useAuth();
  const { user, company } = authState;
  const [activeTab, setActiveTab] = useState('overview');
  
  const getJobStatusBadge = (status: string) => {
    switch(status) {
      case 'published':
        return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200 dark:bg-green-900 dark:text-green-100 dark:border-green-800">Active</Badge>;
      case 'draft':
        return <Badge variant="outline" className="bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700">Draft</Badge>;
      case 'closed':
        return <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200 dark:bg-red-900 dark:text-red-100 dark:border-red-800">Closed</Badge>;
      case 'expired':
        return <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900 dark:text-amber-100 dark:border-amber-800">Expired</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };
  
  const getApplicantStatusBadge = (status: string) => {
    switch(status) {
      case 'under_review':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900 dark:text-blue-100 dark:border-blue-800">Under Review</Badge>;
      case 'interview':
        return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200 dark:bg-green-900 dark:text-green-100 dark:border-green-800">Interview</Badge>;
      case 'offered':
        return <Badge variant="outline" className="bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900 dark:text-purple-100 dark:border-purple-800">Offered</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200 dark:bg-red-900 dark:text-red-100 dark:border-red-800">Rejected</Badge>;
      case 'hired':
        return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200 dark:bg-green-900 dark:text-green-100 dark:border-green-800">Hired</Badge>;
      default:
        return <Badge variant="outline">Applied</Badge>;
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          {company?.name ? company.name : 'Company Dashboard'}
        </h1>
        <p className="text-muted-foreground mb-6">
          {company?.industry ? company.industry : 'Complete your company profile to attract top talent'}
        </p>
        
        {!company?.description && (
          <Card className="mb-6 border-amber-200 bg-amber-50 dark:bg-amber-950 dark:border-amber-800">
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-amber-800 dark:text-amber-200">
                    Complete your company profile
                  </h3>
                  <p className="text-sm text-amber-700 dark:text-amber-300">
                    A complete company profile helps attract the right talent to your jobs
                  </p>
                </div>
                <Button asChild>
                  <Link to="/company/profile">
                    Complete Profile
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
      
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Dashboard</h2>
        <Button asChild>
          <Link to="/jobs/post">
            <PlusCircle className="h-4 w-4 mr-2" />
            Post a Job
          </Link>
        </Button>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="w-full sm:w-auto grid grid-cols-4 sm:inline-flex">
          <TabsTrigger value="overview" className="gap-1 sm:gap-2">
            <BarChart className="h-4 w-4" />
            <span className="hidden sm:inline">Overview</span>
          </TabsTrigger>
          <TabsTrigger value="jobs" className="gap-1 sm:gap-2">
            <Briefcase className="h-4 w-4" />
            <span className="hidden sm:inline">Jobs</span>
          </TabsTrigger>
          <TabsTrigger value="applicants" className="gap-1 sm:gap-2">
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">Applicants</span>
          </TabsTrigger>
          <TabsTrigger value="talent" className="gap-1 sm:gap-2">
            <Search className="h-4 w-4" />
            <span className="hidden sm:inline">Talent Search</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Post Statistics */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <Briefcase className="h-5 w-5 mr-2 text-primary" />
                  Job Listings
                </CardTitle>
                <CardDescription>Summary of your job posts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-muted rounded-md p-3 text-center">
                    <span className="block text-2xl font-bold">{mockJobs.filter(j => j.status === 'published').length}</span>
                    <span className="text-xs text-muted-foreground">Active Jobs</span>
                  </div>
                  <div className="bg-muted rounded-md p-3 text-center">
                    <span className="block text-2xl font-bold">{mockJobs.filter(j => j.status === 'draft').length}</span>
                    <span className="text-xs text-muted-foreground">Drafts</span>
                  </div>
                  <div className="bg-muted rounded-md p-3 text-center">
                    <span className="block text-2xl font-bold">432</span>
                    <span className="text-xs text-muted-foreground">Total Views</span>
                  </div>
                  <div className="bg-muted rounded-md p-3 text-center">
                    <span className="block text-2xl font-bold">3</span>
                    <span className="text-xs text-muted-foreground">Free Posts Left</span>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="w-full mt-4" asChild>
                  <Link to="/jobs/manage">Manage Jobs</Link>
                </Button>
              </CardContent>
            </Card>
            
            {/* Applicant Stats */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <Users className="h-5 w-5 mr-2 text-primary" />
                  Applicant Overview
                </CardTitle>
                <CardDescription>Summary of your applicants</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-muted rounded-md p-3 text-center">
                    <span className="block text-2xl font-bold">{mockApplicants.length}</span>
                    <span className="text-xs text-muted-foreground">Total Applicants</span>
                  </div>
                  <div className="bg-muted rounded-md p-3 text-center">
                    <span className="block text-2xl font-bold">1</span>
                    <span className="text-xs text-muted-foreground">Interviews</span>
                  </div>
                  <div className="bg-muted rounded-md p-3 text-center">
                    <span className="block text-2xl font-bold">85%</span>
                    <span className="text-xs text-muted-foreground">Avg Match</span>
                  </div>
                  <div className="bg-muted rounded-md p-3 text-center">
                    <span className="block text-2xl font-bold">82%</span>
                    <span className="text-xs text-muted-foreground">Avg AI Score</span>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="w-full mt-4" asChild>
                  <Link to="/applicants">View All Applicants</Link>
                </Button>
              </CardContent>
            </Card>
            
            {/* Upcoming Tasks */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-primary" />
                  Upcoming Tasks
                </CardTitle>
                <CardDescription>Your scheduled activities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <Calendar className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Interview with Michael Chen</p>
                      <p className="text-xs text-muted-foreground">Tomorrow at 10:00 AM</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <Mail className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Review 5 new applications</p>
                      <p className="text-xs text-muted-foreground">Due in 2 days</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <Clock className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Senior Frontend Developer job expires</p>
                      <p className="text-xs text-muted-foreground">In 15 days</p>
                    </div>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="w-full mt-4">
                  View Calendar
                </Button>
              </CardContent>
            </Card>
          </div>
          
          {/* Recent Applications */}
          <Card className="mt-6">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Recent Applicants</CardTitle>
                  <CardDescription>Your most recent job applicants</CardDescription>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link to="/applicants">View All</Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockApplicants.map((applicant) => (
                  <div key={applicant.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src="/placeholder.svg" alt={applicant.name} />
                        <AvatarFallback>{applicant.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-medium">{applicant.name}</h4>
                        <p className="text-sm text-muted-foreground">{applicant.jobTitle}</p>
                        <div className="flex gap-2 mt-1 items-center">
                          {getApplicantStatusBadge(applicant.status)}
                          <div className="flex items-center text-xs text-muted-foreground">
                            <span className="inline-block w-3 h-3 rounded-full bg-job-match-high mr-1"></span>
                            <span>{applicant.matchPercentage}% Match</span>
                          </div>
                          <div className="flex items-center text-xs text-muted-foreground">
                            <span className="inline-block w-3 h-3 rounded-full bg-primary mr-1"></span>
                            <span>{applicant.aiScore} AI Score</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <Link to={`/applicants/${applicant.id}`}>Review</Link>
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="jobs">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Your Job Posts</CardTitle>
                  <CardDescription>Manage all your job postings</CardDescription>
                </div>
                <Button asChild>
                  <Link to="/jobs/post">
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Post a Job
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {mockJobs.map((job) => (
                  <div key={job.id} className="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-4 last:border-0 last:pb-0 gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">{job.title}</h4>
                        {job.isHighPriority && (
                          <Badge variant="outline" className="bg-job-priority text-white border-job-priority">
                            Priority
                          </Badge>
                        )}
                        {job.isBoosted && (
                          <Badge variant="outline" className="bg-job-boosted text-white border-job-boosted">
                            Boosted
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                        <Building className="h-3 w-3" />
                        <span>{job.location}</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {getJobStatusBadge(job.status)}
                        {job.status === 'published' && (
                          <>
                            <Badge variant="outline" className="bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700">
                              {job.applicants} Applicants
                            </Badge>
                            <Badge variant="outline" className="bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700">
                              {job.views} Views
                            </Badge>
                          </>
                        )}
                        {job.postedDate && (
                          <span className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-2 py-1 rounded-full">
                            Posted: {new Date(job.postedDate).toLocaleDateString()}
                          </span>
                        )}
                        {job.endDate && (
                          <span className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-2 py-1 rounded-full">
                            Expires: {new Date(job.endDate).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2 self-end sm:self-center mt-2 sm:mt-0">
                      {job.status === 'published' && (
                        <Button variant="outline" size="sm" asChild>
                          <Link to={`/jobs/${job.id}/applicants`}>View Applicants</Link>
                        </Button>
                      )}
                      <Button variant="outline" size="sm" asChild>
                        <Link to={`/jobs/${job.id}/edit`}>Edit</Link>
                      </Button>
                      {job.status === 'draft' && (
                        <Button size="sm">Publish</Button>
                      )}
                      {job.status === 'published' && (
                        <Button variant="destructive" size="sm">Close</Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="applicants">
          <Card>
            <CardHeader>
              <CardTitle>All Applicants</CardTitle>
              <CardDescription>
                Review and manage all your job applicants
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {mockApplicants.map((applicant) => (
                  <div key={applicant.id} className="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-4 last:border-0 last:pb-0 gap-2">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src="/placeholder.svg" alt={applicant.name} />
                        <AvatarFallback>{applicant.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-medium">{applicant.name}</h4>
                        <p className="text-sm text-muted-foreground">{applicant.jobTitle}</p>
                        <div className="flex flex-wrap gap-2 mt-1 items-center">
                          {getApplicantStatusBadge(applicant.status)}
                          <div className="flex items-center text-xs text-muted-foreground">
                            <span className="inline-block w-2 h-2 rounded-full bg-job-match-high mr-1"></span>
                            <span>{applicant.matchPercentage}% Match</span>
                          </div>
                          <div className="flex items-center text-xs text-muted-foreground">
                            <span className="inline-block w-2 h-2 rounded-full bg-primary mr-1"></span>
                            <span>{applicant.aiScore} AI Score</span>
                          </div>
                          <span className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-2 py-1 rounded-full">
                            Applied: {new Date(applicant.appliedDate).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 self-end sm:self-center mt-2 sm:mt-0">
                      <Button variant="outline" size="sm" asChild>
                        <Link to={`/applicants/${applicant.id}`}>View Profile</Link>
                      </Button>
                      <Button variant="outline" size="sm">Change Status</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="talent">
          <Card>
            <CardHeader>
              <CardTitle>Talent Search</CardTitle>
              <CardDescription>
                Search for job seekers matching your criteria
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <input
                        type="text"
                        placeholder="Search by job title, skills, or location"
                        className="w-full pl-10 pr-4 py-2 border rounded-md"
                      />
                    </div>
                  </div>
                  <Button>Search</Button>
                </div>
                
                <div className="py-8 text-center">
                  <FileText className="mx-auto h-12 w-12 text-muted-foreground opacity-50 mb-4" />
                  <h3 className="text-lg font-medium mb-2">No search results yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Search for job seekers based on skills, experience, or location
                  </p>
                  <Button>View Popular Searches</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EmployerDashboard;
