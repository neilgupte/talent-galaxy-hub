import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useLocation, Link } from 'react-router-dom';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  BarChart3, 
  Briefcase, 
  Building, 
  CheckCircle2, 
  Clock, 
  FileText, 
  Heart, 
  Search, 
  Award,
  BookOpen,
  FileArchive,
  Bell
} from 'lucide-react';
import MyCVsTab from './MyCVsTab';

// Mock data
const mockApplications = [
  {
    id: 'app1',
    jobTitle: 'Senior Frontend Developer',
    companyName: 'Tech Solutions Inc',
    appliedDate: '2023-09-15',
    status: 'interview',
    matchPercentage: 85
  },
  {
    id: 'app2',
    jobTitle: 'UI/UX Designer',
    companyName: 'Creative Studios',
    appliedDate: '2023-09-10',
    status: 'under_review',
    matchPercentage: 75
  },
  {
    id: 'app3',
    jobTitle: 'Product Manager',
    companyName: 'Innovate Inc',
    appliedDate: '2023-09-05',
    status: 'rejected',
    matchPercentage: 60
  }
];

const mockSavedJobs = [
  {
    id: 'job1',
    title: 'Full Stack Developer',
    companyName: 'Global Tech',
    location: 'New York, NY',
    salary: '$100k-$130k',
    matchPercentage: 90,
    postedDate: '2023-09-12'
  },
  {
    id: 'job2',
    title: 'Mobile Developer',
    companyName: 'App Wizards',
    location: 'Remote',
    salary: '$90k-$110k',
    matchPercentage: 82,
    postedDate: '2023-09-14'
  }
];

const JobSeekerDashboard = () => {
  const { authState } = useAuth();
  const { user, profile } = authState;
  const [activeTab, setActiveTab] = useState('overview');
  const location = useLocation();
  const [lastSearchTerm, setLastSearchTerm] = useState<string | null>(null);
  
  useEffect(() => {
    // Get the last search term from local storage
    const savedSearches = localStorage.getItem('recentSearches');
    if (savedSearches) {
      const searches = JSON.parse(savedSearches);
      if (searches.length > 0) {
        setLastSearchTerm(searches[0]);
      }
    }
  }, []);
  
  const getStatusBadgeClass = (status: string) => {
    switch(status) {
      case 'interview':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100';
      case 'rejected':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100';
      case 'offered':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100';
      default:
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100';
    }
  };
  
  const getStatusText = (status: string) => {
    switch(status) {
      case 'interview':
        return 'Interview';
      case 'under_review':
        return 'Under Review';
      case 'rejected':
        return 'Not Selected';
      case 'offered':
        return 'Job Offered';
      default:
        return 'Applied';
    }
  };
  
  const getMatchBadgeClass = (percentage: number) => {
    if (percentage >= 80) return 'job-match-badge job-match-high';
    if (percentage >= 60) return 'job-match-badge job-match-medium';
    return 'job-match-badge job-match-low';
  };
  
  // Filter applications by status
  const appliedApplications = mockApplications.filter(app => 
    app.status === 'pending' || app.status === 'rejected');
  
  const inProgressApplications = mockApplications.filter(app => 
    app.status === 'interview' || app.status === 'under_review' || app.status === 'offered');

  return (
    <div className="container mx-auto p-4 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          {profile?.headline ? profile.headline : 'Your Dashboard'}
        </h1>
        <p className="text-muted-foreground mb-2">
          {profile?.location ? profile.location : 'Complete your profile to improve your matches'}
        </p>
        
        {lastSearchTerm && (
          <div className="mt-1 mb-4">
            <Button 
              variant="outline" 
              className="flex items-center text-sm" 
              asChild
            >
              <Link to={`/jobs?q=${encodeURIComponent(lastSearchTerm)}`}>
                <Search className="mr-1 h-4 w-4" />
                <span>Continue searching for: <span className="font-semibold">{lastSearchTerm}</span></span>
              </Link>
            </Button>
          </div>
        )}
        
        {!profile && (
          <Card className="mb-6 border-amber-200 bg-amber-50 dark:bg-amber-950 dark:border-amber-800">
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-amber-800 dark:text-amber-200">
                    Complete your profile
                  </h3>
                  <p className="text-sm text-amber-700 dark:text-amber-300">
                    A complete profile improves your match score and helps employers find you
                  </p>
                </div>
                <Button asChild>
                  <Link to="/onboarding/profile">
                    Complete Profile
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="w-full sm:w-auto grid grid-cols-6 sm:inline-flex">
          <TabsTrigger value="overview" className="gap-1 sm:gap-2">
            <BarChart3 className="h-4 w-4" />
            <span className="hidden sm:inline">Overview</span>
          </TabsTrigger>
          <TabsTrigger value="applications" className="gap-1 sm:gap-2">
            <Briefcase className="h-4 w-4" />
            <span className="hidden sm:inline">Applications</span>
          </TabsTrigger>
          <TabsTrigger value="saved" className="gap-1 sm:gap-2">
            <Heart className="h-4 w-4" />
            <span className="hidden sm:inline">Saved Jobs</span>
          </TabsTrigger>
          <TabsTrigger value="alerts" className="gap-1 sm:gap-2">
            <Bell className="h-4 w-4" />
            <span className="hidden sm:inline">Alerts</span>
          </TabsTrigger>
          <TabsTrigger value="cvs" className="gap-1 sm:gap-2">
            <FileArchive className="h-4 w-4" />
            <span className="hidden sm:inline">My CVs</span>
          </TabsTrigger>
          <TabsTrigger value="resources" className="gap-1 sm:gap-2">
            <BookOpen className="h-4 w-4" />
            <span className="hidden sm:inline">Resources</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <FileText className="h-5 w-5 mr-2 text-primary" />
                  Profile Strength
                </CardTitle>
                <CardDescription>Complete your profile to improve matches</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">65% Complete</span>
                    <span className="text-xs text-muted-foreground">7/12 sections</span>
                  </div>
                  <Progress value={65} className="h-2" />
                  <Button variant="outline" size="sm" className="w-full mt-4" asChild>
                    <Link to="/profile">Complete Profile</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <Search className="h-5 w-5 mr-2 text-primary" />
                  Job Search Activity
                </CardTitle>
                <CardDescription>Your application progress</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-muted rounded-md p-3 text-center">
                    <span className="block text-2xl font-bold">{mockApplications.length}</span>
                    <span className="text-xs text-muted-foreground">Applications</span>
                  </div>
                  <div className="bg-muted rounded-md p-3 text-center">
                    <span className="block text-2xl font-bold">1</span>
                    <span className="text-xs text-muted-foreground">Interviews</span>
                  </div>
                  <div className="bg-muted rounded-md p-3 text-center">
                    <span className="block text-2xl font-bold">{mockSavedJobs.length}</span>
                    <span className="text-xs text-muted-foreground">Saved Jobs</span>
                  </div>
                  <div className="bg-muted rounded-md p-3 text-center">
                    <span className="block text-2xl font-bold">75%</span>
                    <span className="text-xs text-muted-foreground">Avg Match</span>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="w-full mt-4" asChild>
                  <Link to="/jobs">Find Jobs</Link>
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <Clock className="h-5 w-5 mr-2 text-primary" />
                  Recent Activity
                </CardTitle>
                <CardDescription>Latest updates on your applications</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <Building className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Tech Solutions Inc viewed your profile</p>
                      <p className="text-xs text-muted-foreground">2 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Application status changed to "Interview"</p>
                      <p className="text-xs text-muted-foreground">1 day ago</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <Award className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Your profile is in the top 10% for React Developer jobs</p>
                      <p className="text-xs text-muted-foreground">3 days ago</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card className="mt-6">
            <CardHeader className="pb-2">
              <CardTitle>Recent Applications</CardTitle>
              <CardDescription>Your most recent job applications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockApplications.slice(0, 3).map((app) => (
                  <div key={app.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                    <div>
                      <h4 className="font-medium">{app.jobTitle}</h4>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Building className="h-3 w-3" />
                        <span>{app.companyName}</span>
                      </div>
                      <div className="flex gap-2 mt-1">
                        <span className={`${getStatusBadgeClass(app.status)} text-xs px-2 py-1 rounded-full`}>
                          {getStatusText(app.status)}
                        </span>
                        <span className={getMatchBadgeClass(app.matchPercentage)}>
                          {app.matchPercentage}% Match
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-muted-foreground">
                        Applied on {new Date(app.appliedDate).toLocaleDateString()}
                      </div>
                      <Button 
                        variant={app.status !== 'pending' ? "outline" : "default"} 
                        size="sm" 
                        className={app.status !== 'pending' ? "mt-1 border-primary text-primary" : "mt-1"} 
                        asChild
                      >
                        <Link to={`/applications/${app.id}`}>View</Link>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              
              <Button variant="outline" size="sm" className="w-full mt-4" asChild>
                <Link to="/applications">View All Applications</Link>
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="applications">
          <Card>
            <CardHeader>
              <CardTitle>Your Applications</CardTitle>
              <CardDescription>
                Track the status of your job applications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="in-progress" className="mt-2 mb-6">
                <TabsList>
                  <TabsTrigger value="in-progress">In Progress ({inProgressApplications.length})</TabsTrigger>
                  <TabsTrigger value="applied">Applied ({appliedApplications.length})</TabsTrigger>
                </TabsList>
                
                <TabsContent value="in-progress" className="mt-4">
                  <div className="space-y-6">
                    {inProgressApplications.length > 0 ? (
                      inProgressApplications.map((app) => (
                        <div key={app.id} className="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-4 last:border-0 last:pb-0 gap-2">
                          <div>
                            <h4 className="font-medium">{app.jobTitle}</h4>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                              <Building className="h-3 w-3" />
                              <span>{app.companyName}</span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              <span className={`${getStatusBadgeClass(app.status)} text-xs px-2 py-1 rounded-full`}>
                                {getStatusText(app.status)}
                              </span>
                              <span className={getMatchBadgeClass(app.matchPercentage)}>
                                {app.matchPercentage}% Match
                              </span>
                              <span className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-2 py-1 rounded-full">
                                Applied on {new Date(app.appliedDate).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                          <div className="flex gap-2 self-end sm:self-center mt-2 sm:mt-0">
                            <Button variant="outline" size="sm" className="border-primary text-primary" asChild>
                              <Link to={`/applications/${app.id}`}>View Application</Link>
                            </Button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        No in-progress applications at the moment.
                      </div>
                    )}
                  </div>
                </TabsContent>
                
                <TabsContent value="applied" className="mt-4">
                  <div className="space-y-6">
                    {appliedApplications.length > 0 ? (
                      appliedApplications.map((app) => (
                        <div key={app.id} className="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-4 last:border-0 last:pb-0 gap-2">
                          <div>
                            <h4 className="font-medium">{app.jobTitle}</h4>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                              <Building className="h-3 w-3" />
                              <span>{app.companyName}</span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              <span className={`${getStatusBadgeClass(app.status)} text-xs px-2 py-1 rounded-full`}>
                                {getStatusText(app.status)}
                              </span>
                              <span className={getMatchBadgeClass(app.matchPercentage)}>
                                {app.matchPercentage}% Match
                              </span>
                              <span className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-2 py-1 rounded-full">
                                Applied on {new Date(app.appliedDate).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                          <div className="flex gap-2 self-end sm:self-center mt-2 sm:mt-0">
                            <Button variant="outline" size="sm" className="border-primary text-primary" asChild>
                              <Link to={`/applications/${app.id}`}>View Application</Link>
                            </Button>
                            {app.status === 'rejected' && (
                              <Button variant="outline" size="sm">
                                Appeal
                              </Button>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        No applications in this category.
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="saved">
          <Card>
            <CardHeader>
              <CardTitle>Saved Jobs</CardTitle>
              <CardDescription>
                Jobs you've saved for later
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {mockSavedJobs.map((job) => (
                  <div key={job.id} className="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-4 last:border-0 last:pb-0 gap-2">
                    <div>
                      <h4 className="font-medium">{job.title}</h4>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                        <Building className="h-3 w-3" />
                        <span>{job.companyName}</span>
                        <span className="inline-block h-1 w-1 rounded-full bg-gray-400"></span>
                        <span>{job.location}</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <span className={getMatchBadgeClass(job.matchPercentage)}>
                          {job.matchPercentage}% Match
                        </span>
                        <span className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-2 py-1 rounded-full">
                          {job.salary}
                        </span>
                        <span className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-2 py-1 rounded-full">
                          Posted on {new Date(job.postedDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2 self-end sm:self-center mt-2 sm:mt-0">
                      <Button variant="outline" size="sm" asChild>
                        <Link to={`/jobs/${job.id}`}>View Job</Link>
                      </Button>
                      <Button size="sm" asChild>
                        <Link to={`/jobs/${job.id}/apply`}>Apply Now</Link>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="alerts">
          <Card>
            <CardHeader>
              <CardTitle>Job Alerts</CardTitle>
              <CardDescription>
                Get notified when new jobs matching your criteria are posted
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="font-medium">Stay updated on new opportunities</h3>
                    <p className="text-sm text-muted-foreground">
                      Create customized job alerts based on your preferences
                    </p>
                  </div>
                  <Button asChild>
                    <Link to="/profile/alerts">
                      Manage Your Alerts
                    </Link>
                  </Button>
                </div>
                
                <div className="border rounded-lg p-4">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <h4 className="font-medium flex items-center">
                        <Bell className="h-4 w-4 mr-2 text-primary" />
                        Create Your First Alert
                      </h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        Get email notifications about new jobs that match your skills and preferences
                      </p>
                    </div>
                    <Button asChild>
                      <Link to="/profile/alerts">
                        Set Up Alerts
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="cvs">
          <MyCVsTab />
        </TabsContent>
        
        <TabsContent value="resources">
          <Card>
            <CardHeader>
              <CardTitle>Career Resources</CardTitle>
              <CardDescription>
                Resources to help you advance your career
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Resume Tips & Tricks</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      Learn how to optimize your resume for ATS systems and make it stand out to recruiters.
                    </p>
                    <Button variant="outline" size="sm">Read More</Button>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Interview Preparation</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      Prepare for your interviews with our comprehensive guides and practice questions.
                    </p>
                    <Button variant="outline" size="sm">Read More</Button>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Salary Negotiation</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      Tips on how to negotiate your salary and benefits package with confidence.
                    </p>
                    <Button variant="outline" size="sm">Read More</Button>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Career Path Planning</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      Map out your career growth with strategic planning and skill development.
                    </p>
                    <Button variant="outline" size="sm">Read More</Button>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default JobSeekerDashboard;
