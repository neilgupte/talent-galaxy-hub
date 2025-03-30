
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { Search, Briefcase, Zap, Award, BarChart, Clock } from 'lucide-react';

const Index = () => {
  const { authState } = useAuth();
  const { isAuthenticated, user } = authState;
  
  const features = [
    {
      icon: <Search className="h-10 w-10 text-primary mb-4" />,
      title: 'Smart Job Matching',
      description: 'Our AI-powered matching algorithm connects you with jobs that fit your skills and experience.'
    },
    {
      icon: <Briefcase className="h-10 w-10 text-primary mb-4" />,
      title: 'Streamlined Applications',
      description: 'Apply to multiple jobs with your profile and track your application status in real-time.'
    },
    {
      icon: <Zap className="h-10 w-10 text-primary mb-4" />,
      title: 'AI Feedback & Scoring',
      description: 'Get personalized feedback on your applications to improve your chances of landing interviews.'
    },
    {
      icon: <Award className="h-10 w-10 text-primary mb-4" />,
      title: 'Top Talent Pool',
      description: 'Employers can search our pool of qualified candidates and reach out directly.'
    },
    {
      icon: <BarChart className="h-10 w-10 text-primary mb-4" />,
      title: 'Detailed Analytics',
      description: 'Track your job search performance and see how you compare to other applicants.'
    },
    {
      icon: <Clock className="h-10 w-10 text-primary mb-4" />,
      title: 'Time-Saving Tools',
      description: 'Save time with one-click applications for jobs that match your profile.'
    }
  ];
  
  const getDashboardLink = () => {
    if (!isAuthenticated) return '/auth';
    
    return user?.role === 'job_seeker' 
      ? '/dashboard/job-seeker' 
      : '/dashboard/employer';
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-950 py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Find Your Dream Job or<br />Perfect Candidate
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
            Connect talent with opportunity through our AI-powered job platform that matches job seekers with their ideal roles and employers with their perfect candidates.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button asChild size="lg" className="text-lg py-6">
              <Link to={getDashboardLink()}>
                {isAuthenticated ? 'Go to Dashboard' : 'Get Started'}
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="text-lg py-6">
              <Link to="/jobs">
                Browse Jobs
              </Link>
            </Button>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-3xl mx-auto flex items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
              <input
                type="text"
                placeholder="Job title, keywords, or company"
                className="w-full pl-10 pr-4 py-3 border rounded-md"
              />
            </div>
            <div className="hidden sm:block border-l h-10 mx-4"></div>
            <div className="hidden sm:block relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
              <input
                type="text"
                placeholder="City, state, or 'Remote'"
                className="w-full pl-10 pr-4 py-3 border rounded-md"
              />
            </div>
            <Button className="ml-4 px-6 py-3">Search</Button>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-16 md:py-24 bg-white dark:bg-gray-950">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Intelligent Job Matching Platform
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Our AI-powered platform connects the right talent with the right opportunities
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="p-6 border rounded-lg hover:shadow-md transition-shadow">
                <div className="text-center">
                  {feature.icon}
                  <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="bg-primary text-primary-foreground py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Transform Your Job Search?
          </h2>
          <p className="text-xl opacity-90 max-w-2xl mx-auto mb-10">
            Join thousands of job seekers and employers already using our platform
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" variant="secondary" className="text-lg py-6">
              <Link to="/auth">Create Account</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="text-lg py-6 border-primary-foreground hover:bg-primary-foreground hover:text-primary">
              <Link to="/jobs">Browse Jobs</Link>
            </Button>
          </div>
        </div>
      </section>
      
      {/* Stats Section */}
      <section className="py-16 md:py-24 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Trusted by Job Seekers and Employers
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Our platform is making a difference in the hiring process
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <p className="text-4xl md:text-5xl font-bold text-primary mb-2">5k+</p>
              <p className="text-lg text-muted-foreground">Active Jobs</p>
            </div>
            <div className="text-center">
              <p className="text-4xl md:text-5xl font-bold text-primary mb-2">2k+</p>
              <p className="text-lg text-muted-foreground">Companies</p>
            </div>
            <div className="text-center">
              <p className="text-4xl md:text-5xl font-bold text-primary mb-2">10k+</p>
              <p className="text-lg text-muted-foreground">Job Seekers</p>
            </div>
            <div className="text-center">
              <p className="text-4xl md:text-5xl font-bold text-primary mb-2">85%</p>
              <p className="text-lg text-muted-foreground">Match Rate</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-gray-100 dark:bg-gray-950 py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between">
            <div className="mb-8 md:mb-0">
              <div className="flex items-center">
                <Briefcase className="h-8 w-8 text-primary" />
                <span className="ml-2 text-xl font-bold">TalentHub</span>
              </div>
              <p className="mt-2 text-muted-foreground max-w-md">
                Connecting talent with opportunity through intelligent job matching
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              <div>
                <h3 className="font-semibold mb-4">For Job Seekers</h3>
                <ul className="space-y-2">
                  <li><Link to="/jobs" className="text-muted-foreground hover:text-primary">Browse Jobs</Link></li>
                  <li><Link to="/auth" className="text-muted-foreground hover:text-primary">Create Profile</Link></li>
                  <li><Link to="/resources" className="text-muted-foreground hover:text-primary">Career Resources</Link></li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold mb-4">For Employers</h3>
                <ul className="space-y-2">
                  <li><Link to="/auth" className="text-muted-foreground hover:text-primary">Post a Job</Link></li>
                  <li><Link to="/talent" className="text-muted-foreground hover:text-primary">Search Talent</Link></li>
                  <li><Link to="/pricing" className="text-muted-foreground hover:text-primary">Pricing</Link></li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold mb-4">Company</h3>
                <ul className="space-y-2">
                  <li><Link to="/about" className="text-muted-foreground hover:text-primary">About Us</Link></li>
                  <li><Link to="/contact" className="text-muted-foreground hover:text-primary">Contact</Link></li>
                  <li><Link to="/privacy" className="text-muted-foreground hover:text-primary">Privacy Policy</Link></li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="border-t mt-12 pt-8 text-center">
            <p className="text-muted-foreground">
              &copy; {new Date().getFullYear()} TalentHub. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
