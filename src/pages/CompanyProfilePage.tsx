
import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Briefcase, 
  MapPin, 
  Users, 
  Globe, 
  Calendar, 
  Star, 
  Share2, 
  Bookmark, 
  Building,
  Check,
  BadgeCheck,
  Info,
  Clock,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/components/ui/use-toast';

// Mock company data
const mockCompany = {
  id: 'company1',
  name: 'Tech Innovations Inc.',
  logo: 'https://picsum.photos/seed/company1/200/200',
  coverImage: 'https://picsum.photos/seed/company1cover/1200/300',
  description: `Tech Innovations Inc. is a leading technology company specializing in innovative software solutions that help businesses streamline their operations and improve their customer experience.
  
  Founded in 2010, our mission is to transform the way organizations leverage technology to solve complex business challenges. We believe in creating intuitive, powerful, and scalable software that makes a real difference in people's lives.
  
  Our team consists of passionate engineers, designers, and product specialists who are dedicated to pushing the boundaries of what's possible in software development.`,
  industry: 'Technology',
  location: 'San Francisco, CA',
  size: '1,000-5,000 employees',
  founded: 2010,
  website: 'https://techinnovations.example.com',
  specialties: ['Software Development', 'Cloud Computing', 'Artificial Intelligence', 'Data Analytics', 'Mobile Applications'],
  verified: true,
  rating: 4.5,
  totalReviews: 238,
  benefits: [
    { name: 'Health Insurance', description: 'Comprehensive medical, dental, and vision coverage' },
    { name: 'Flexible Work', description: 'Hybrid work model with remote options' },
    { name: 'Unlimited PTO', description: 'Take time off when you need it' },
    { name: 'Professional Development', description: '$5,000 annual learning stipend' },
    { name: 'Parental Leave', description: '16 weeks of paid leave for all parents' },
    { name: '401(k) Matching', description: '4% company match' },
  ],
  culture: {
    overall: 4.3,
    workLife: 4.5,
    compensation: 4.0,
    management: 4.2,
    culture: 4.6,
    career: 4.1
  }
};

// Mock jobs data
const mockJobs = [
  {
    id: 'job1',
    title: 'Senior Frontend Developer',
    location: 'San Francisco, CA',
    type: 'Full-time',
    salary: '$120,000 - $150,000',
    postedDate: '2023-06-15T10:30:00Z',
    description: 'We are looking for an experienced frontend developer to join our product team...',
    remote: true
  },
  {
    id: 'job2',
    title: 'Backend Engineer',
    location: 'San Francisco, CA',
    type: 'Full-time',
    salary: '$130,000 - $160,000',
    postedDate: '2023-06-10T08:15:00Z',
    description: 'Join our backend team to build scalable and efficient server-side applications...',
    remote: false
  },
  {
    id: 'job3',
    title: 'UX/UI Designer',
    location: 'Remote',
    type: 'Full-time',
    salary: '$90,000 - $120,000',
    postedDate: '2023-06-05T14:45:00Z',
    description: 'Create beautiful and intuitive user experiences for our products...',
    remote: true
  },
  {
    id: 'job4',
    title: 'Product Manager',
    location: 'San Francisco, CA',
    type: 'Full-time',
    salary: '$130,000 - $160,000',
    postedDate: '2023-06-02T11:20:00Z',
    description: 'Lead product development from conception to launch...',
    remote: false
  },
  {
    id: 'job5',
    title: 'Data Scientist',
    location: 'Remote',
    type: 'Full-time',
    salary: '$110,000 - $140,000',
    postedDate: '2023-05-28T09:10:00Z',
    description: 'Use data to drive product decisions and business strategies...',
    remote: true
  }
];

const CompanyProfilePage = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const [isSaved, setIsSaved] = useState(false);
  
  // In a real app, you would fetch company data based on the ID
  const company = mockCompany;
  const jobs = mockJobs;
  
  const handleSaveCompany = () => {
    setIsSaved(!isSaved);
    
    toast({
      title: isSaved ? "Company removed" : "Company saved",
      description: isSaved 
        ? "The company has been removed from your saved list" 
        : "The company has been added to your saved list",
    });
  };
  
  const handleShareCompany = () => {
    // In a real app, this would open a share dialog
    navigator.clipboard.writeText(window.location.href);
    
    toast({
      title: "Link copied",
      description: "Company profile link has been copied to clipboard",
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
  
  const daysAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays === 1 ? '1 day ago' : `${diffDays} days ago`;
  };

  return (
    <div className="min-h-screen">
      {/* Cover Image */}
      <div className="h-48 md:h-64 w-full bg-primary/10 relative overflow-hidden">
        <img 
          src={company.coverImage} 
          alt={`${company.name} cover`} 
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="container mx-auto px-4 -mt-16 relative z-10">
        <div className="bg-white dark:bg-gray-950 rounded-lg shadow-lg overflow-hidden">
          <div className="p-6 md:p-8">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              <Avatar className="w-24 h-24 border-4 border-white dark:border-gray-950 rounded-xl shadow-md">
                <AvatarImage src={company.logo} alt={company.name} />
                <AvatarFallback className="text-3xl font-bold">
                  {company.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <div className="flex items-center">
                  <h1 className="text-3xl font-bold mr-2">{company.name}</h1>
                  {company.verified && (
                    <BadgeCheck className="h-5 w-5 text-primary" />
                  )}
                </div>
                
                <div className="flex items-center mt-1">
                  <div className="flex items-center text-amber-500">
                    <Star className="fill-current h-5 w-5" />
                    <span className="ml-1 font-medium">{company.rating}</span>
                  </div>
                  <span className="mx-2 text-muted-foreground">•</span>
                  <span className="text-muted-foreground">{company.totalReviews} reviews</span>
                </div>
                
                <div className="flex flex-wrap mt-3 gap-y-2">
                  <div className="flex items-center mr-6">
                    <Briefcase className="h-4 w-4 text-muted-foreground mr-2" />
                    <span>{company.industry}</span>
                  </div>
                  <div className="flex items-center mr-6">
                    <MapPin className="h-4 w-4 text-muted-foreground mr-2" />
                    <span>{company.location}</span>
                  </div>
                  <div className="flex items-center mr-6">
                    <Users className="h-4 w-4 text-muted-foreground mr-2" />
                    <span>{company.size}</span>
                  </div>
                  <div className="flex items-center mr-6">
                    <Calendar className="h-4 w-4 text-muted-foreground mr-2" />
                    <span>Founded {company.founded}</span>
                  </div>
                  <div className="flex items-center">
                    <Globe className="h-4 w-4 text-muted-foreground mr-2" />
                    <a 
                      href={company.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      {company.website.replace('https://', '')}
                    </a>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-3 self-center md:self-start">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleShareCompany}
                  title="Share company"
                >
                  <Share2 className="h-4 w-4" />
                </Button>
                
                <Button
                  variant={isSaved ? "default" : "outline"}
                  onClick={handleSaveCompany}
                >
                  <Bookmark className={`mr-2 h-4 w-4 ${isSaved ? 'fill-current' : ''}`} />
                  {isSaved ? 'Saved' : 'Save'}
                </Button>
                
                <Button asChild>
                  <Link to="/jobs">
                    View Jobs
                  </Link>
                </Button>
              </div>
            </div>
          </div>
          
          <Tabs defaultValue="about" className="w-full">
            <div className="border-b">
              <div className="container">
                <TabsList className="w-full justify-start">
                  <TabsTrigger value="about" className="text-base">About</TabsTrigger>
                  <TabsTrigger value="jobs" className="text-base">Jobs ({jobs.length})</TabsTrigger>
                  <TabsTrigger value="reviews" className="text-base">Reviews</TabsTrigger>
                  <TabsTrigger value="benefits" className="text-base">Benefits</TabsTrigger>
                </TabsList>
              </div>
            </div>
            
            <div className="p-6 md:p-8">
              <TabsContent value="about">
                <div className="grid md:grid-cols-3 gap-8">
                  <div className="md:col-span-2">
                    <h2 className="text-2xl font-semibold mb-4">About {company.name}</h2>
                    
                    <div className="prose prose-sm dark:prose-invert max-w-none">
                      {company.description.split('\n\n').map((paragraph, index) => (
                        <p key={index} className="mb-4">{paragraph}</p>
                      ))}
                    </div>
                    
                    <h3 className="text-xl font-semibold mt-8 mb-4">Specialties</h3>
                    <div className="flex flex-wrap gap-2">
                      {company.specialties.map((specialty, index) => (
                        <span 
                          key={index}
                          className="bg-primary/10 text-primary rounded-full px-3 py-1 text-sm font-medium"
                        >
                          {specialty}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <Card>
                      <CardContent className="pt-6">
                        <h3 className="text-lg font-semibold mb-4">Company Culture</h3>
                        
                        <div className="space-y-4">
                          <div>
                            <div className="flex items-center justify-between text-sm mb-1">
                              <span>Overall Rating</span>
                              <span className="font-medium">{company.culture.overall}/5</span>
                            </div>
                            <Progress value={company.culture.overall * 20} className="h-2" />
                          </div>
                          
                          <div>
                            <div className="flex items-center justify-between text-sm mb-1">
                              <span>Work-life Balance</span>
                              <span className="font-medium">{company.culture.workLife}/5</span>
                            </div>
                            <Progress value={company.culture.workLife * 20} className="h-2" />
                          </div>
                          
                          <div>
                            <div className="flex items-center justify-between text-sm mb-1">
                              <span>Compensation & Benefits</span>
                              <span className="font-medium">{company.culture.compensation}/5</span>
                            </div>
                            <Progress value={company.culture.compensation * 20} className="h-2" />
                          </div>
                          
                          <div>
                            <div className="flex items-center justify-between text-sm mb-1">
                              <span>Management</span>
                              <span className="font-medium">{company.culture.management}/5</span>
                            </div>
                            <Progress value={company.culture.management * 20} className="h-2" />
                          </div>
                          
                          <div>
                            <div className="flex items-center justify-between text-sm mb-1">
                              <span>Company Culture</span>
                              <span className="font-medium">{company.culture.culture}/5</span>
                            </div>
                            <Progress value={company.culture.culture * 20} className="h-2" />
                          </div>
                          
                          <div>
                            <div className="flex items-center justify-between text-sm mb-1">
                              <span>Career Opportunities</span>
                              <span className="font-medium">{company.culture.career}/5</span>
                            </div>
                            <Progress value={company.culture.career * 20} className="h-2" />
                          </div>
                        </div>
                        
                        <Separator className="my-6" />
                        
                        <div className="text-center">
                          <Button asChild variant="outline" className="w-full">
                            <Link to={`/companies/${company.id}/reviews`}>
                              View All Reviews
                            </Link>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <div className="bg-muted rounded-lg p-4 mt-6">
                      <h3 className="font-semibold flex items-center mb-2">
                        <Info className="h-4 w-4 mr-2 text-primary" />
                        Why work at {company.name}?
                      </h3>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li className="flex items-start">
                          <Check className="h-4 w-4 mr-2 text-green-500 mt-0.5" />
                          <span>Innovative technology company with a strong market position</span>
                        </li>
                        <li className="flex items-start">
                          <Check className="h-4 w-4 mr-2 text-green-500 mt-0.5" />
                          <span>Competitive compensation and comprehensive benefits</span>
                        </li>
                        <li className="flex items-start">
                          <Check className="h-4 w-4 mr-2 text-green-500 mt-0.5" />
                          <span>Opportunities for professional growth and development</span>
                        </li>
                        <li className="flex items-start">
                          <Check className="h-4 w-4 mr-2 text-green-500 mt-0.5" />
                          <span>Collaborative and inclusive work environment</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="jobs">
                <div className="grid md:grid-cols-3 gap-8">
                  <div className="md:col-span-2">
                    <h2 className="text-2xl font-semibold mb-4">Open Positions at {company.name}</h2>
                    
                    {jobs.length === 0 ? (
                      <div className="bg-muted p-6 rounded-lg text-center">
                        <Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-medium mb-2">No open positions</h3>
                        <p className="text-muted-foreground mb-4">
                          This company doesn't have any open positions at the moment.
                        </p>
                        <Button asChild>
                          <Link to="/jobs">Browse All Jobs</Link>
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {jobs.map(job => (
                          <Card key={job.id} className="overflow-hidden">
                            <CardContent className="p-0">
                              <div className="p-6">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <h3 className="text-lg font-semibold">
                                      <Link to={`/jobs/${job.id}`} className="hover:text-primary">
                                        {job.title}
                                      </Link>
                                    </h3>
                                    <p className="text-muted-foreground">{company.name}</p>
                                  </div>
                                  <Button asChild size="sm">
                                    <Link to={`/applications/job/${job.id}/apply`}>
                                      Apply
                                    </Link>
                                  </Button>
                                </div>
                                
                                <div className="flex flex-wrap gap-2 mt-3">
                                  <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold text-muted-foreground">
                                    {job.location}
                                  </span>
                                  <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold text-muted-foreground">
                                    {job.type}
                                  </span>
                                  <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold text-muted-foreground">
                                    {job.salary}
                                  </span>
                                  {job.remote && (
                                    <span className="inline-flex items-center rounded-full bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 px-2.5 py-0.5 text-xs font-semibold">
                                      Remote
                                    </span>
                                  )}
                                </div>
                                
                                <p className="mt-4 text-sm line-clamp-2">
                                  {job.description}
                                </p>
                              </div>
                              
                              <div className="bg-muted py-2 px-6 text-sm text-muted-foreground flex items-center justify-between">
                                <div className="flex items-center">
                                  <Clock className="h-3.5 w-3.5 mr-1" />
                                  <span>Posted {daysAgo(job.postedDate)}</span>
                                </div>
                                <Link to={`/jobs/${job.id}`} className="text-primary hover:underline flex items-center">
                                  View Details
                                  <ChevronRight className="h-3.5 w-3.5 ml-1" />
                                </Link>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <Card>
                      <CardContent className="pt-6">
                        <h3 className="font-semibold mb-4 flex items-center">
                          <Info className="h-4 w-4 mr-2 text-primary" />
                          Working at {company.name}
                        </h3>
                        
                        <ul className="space-y-3 text-sm">
                          <li className="flex items-start">
                            <Building className="h-4 w-4 mr-2 text-muted-foreground mt-0.5" />
                            <div>
                              <span className="font-medium block">Company Size</span>
                              <span className="text-muted-foreground">{company.size}</span>
                            </div>
                          </li>
                          <li className="flex items-start">
                            <Globe className="h-4 w-4 mr-2 text-muted-foreground mt-0.5" />
                            <div>
                              <span className="font-medium block">Headquarters</span>
                              <span className="text-muted-foreground">{company.location}</span>
                            </div>
                          </li>
                          <li className="flex items-start">
                            <Calendar className="h-4 w-4 mr-2 text-muted-foreground mt-0.5" />
                            <div>
                              <span className="font-medium block">Founded</span>
                              <span className="text-muted-foreground">{company.founded}</span>
                            </div>
                          </li>
                        </ul>
                        
                        <Separator className="my-6" />
                        
                        <h3 className="font-semibold mb-4">Get to know us</h3>
                        
                        <a
                          href={company.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center text-primary hover:underline"
                        >
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Visit our website
                        </a>
                      </CardContent>
                    </Card>
                    
                    <div className="mt-6 bg-muted p-6 rounded-lg">
                      <h3 className="font-semibold mb-4">Not seeing the right job?</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Set up job alerts and be the first to know when new positions open up at {company.name}.
                      </p>
                      <Button asChild variant="outline" className="w-full">
                        <Link to="/jobs/alerts">Create Job Alert</Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="reviews">
                <div className="text-center py-8">
                  <Star className="h-12 w-12 text-amber-500 mx-auto mb-4" />
                  <h2 className="text-2xl font-semibold mb-2">Company Reviews</h2>
                  <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
                    Read reviews from current and former employees to learn more about working at {company.name}.
                  </p>
                  <Button asChild>
                    <Link to={`/companies/${company.id}/reviews`}>
                      View All {company.totalReviews} Reviews
                    </Link>
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="benefits">
                <h2 className="text-2xl font-semibold mb-6">Benefits and Perks</h2>
                
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {company.benefits.map((benefit, index) => (
                    <Card key={index}>
                      <CardContent className="pt-6">
                        <h3 className="font-semibold mb-2">{benefit.name}</h3>
                        <p className="text-sm text-muted-foreground">{benefit.description}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                
                <div className="mt-8 bg-muted p-6 rounded-lg">
                  <div className="flex items-start">
                    <Info className="h-5 w-5 text-amber-500 mr-3 mt-0.5" />
                    <div>
                      <h3 className="font-semibold mb-2">Disclaimer</h3>
                      <p className="text-sm text-muted-foreground">
                        The benefits information shown is provided by the employer or gathered from publicly available sources. Benefits may vary based on role, location, and other factors. For the most accurate information, please refer to the company's official benefits documentation.
                      </p>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default CompanyProfilePage;
