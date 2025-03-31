
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import FeaturedJobs from '@/components/jobs/FeaturedJobs';
import FetchAllJobsTestButton from '@/components/jobs/FetchAllJobsTestButton';

const Index = () => {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="py-16 md:py-24 bg-blue-50/50">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Finally, a Job Platform That Respects Your Time.
          </h1>
          <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
            No more endless applications or ghosting — just smart matches, real feedback, and better outcomes for everyone.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <Button size="lg" className="bg-blue-600 text-white hover:bg-blue-700">
              Get Started
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/jobs">Browse Jobs</Link>
            </Button>
          </div>
          
          {/* Search Box */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Job title, keywords, or location..."
                className="w-full px-4 py-3 pl-4 pr-10 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <button className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <Search className="h-5 w-5 text-gray-500" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Latest Jobs Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Latest jobs you may be interested in</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Job cards will be populated here by FeaturedJobs component */}
          </div>
        </div>
      </section>
      
      <FeaturedJobs />

      {/* Platform Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Intelligent Job Matching Platform</h2>
          <p className="text-lg text-gray-600 mb-12 max-w-3xl mx-auto">
            Our AI-powered platform connects the right talent with the right opportunities
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {/* Feature 1 */}
            <div className="p-6 border border-gray-100 rounded-lg bg-white">
              <div className="flex justify-center mb-4">
                <svg className="w-10 h-10 text-blue-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 15C15.866 15 19 11.866 19 8C19 4.13401 15.866 1 12 1C8.13401 1 5 4.13401 5 8C5 11.866 8.13401 15 12 15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M8.21 13.89L7 23L12 20L17 23L15.79 13.88" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Smart Job Matching</h3>
              <p className="text-gray-600">
                Our AI-powered matching algorithm connects you with jobs that fit your skills and experience.
              </p>
            </div>
            
            {/* Feature 2 */}
            <div className="p-6 border border-gray-100 rounded-lg bg-white">
              <div className="flex justify-center mb-4">
                <svg className="w-10 h-10 text-blue-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M16 4H18C18.5304 4 19.0391 4.21071 19.4142 4.58579C19.7893 4.96086 20 5.46957 20 6V20C20 20.5304 19.7893 21.0391 19.4142 21.4142C19.0391 21.7893 18.5304 22 18 22H6C5.46957 22 4.96086 21.7893 4.58579 21.4142C4.21071 21.0391 4 20.5304 4 20V6C4 5.46957 4.21071 4.96086 4.58579 4.58579C4.96086 4.21071 5.46957 4 6 4H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M15 2H9C8.44772 2 8 2.44772 8 3V5C8 5.55228 8.44772 6 9 6H15C15.5523 6 16 5.55228 16 5V3C16 2.44772 15.5523 2 15 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Streamlined Applications</h3>
              <p className="text-gray-600">
                Apply to multiple jobs with your profile and track your application status in real-time.
              </p>
            </div>
            
            {/* Feature 3 */}
            <div className="p-6 border border-gray-100 rounded-lg bg-white">
              <div className="flex justify-center mb-4">
                <svg className="w-10 h-10 text-blue-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M8 14C8 14 9.5 16 12 16C14.5 16 16 14 16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M9 9H9.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M15 9H15.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">AI Feedback & Scoring</h3>
              <p className="text-gray-600">
                Get personalized feedback on your applications to improve your chances of landing interviews.
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 4 */}
            <div className="p-6 border border-gray-100 rounded-lg bg-white">
              <div className="flex justify-center mb-4">
                <svg className="w-10 h-10 text-blue-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 15C15.866 15 19 11.866 19 8C19 4.13401 15.866 1 12 1C8.13401 1 5 4.13401 5 8C5 11.866 8.13401 15 12 15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M8.21 13.89L7 23L12 20L17 23L15.79 13.88" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Top Talent Pool</h3>
              <p className="text-gray-600">
                Employers can search our pool of qualified candidates and reach out directly.
              </p>
            </div>
            
            {/* Feature 5 */}
            <div className="p-6 border border-gray-100 rounded-lg bg-white">
              <div className="flex justify-center mb-4">
                <svg className="w-10 h-10 text-blue-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 20V10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 20V4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M6 20V14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Detailed Analytics</h3>
              <p className="text-gray-600">
                Track your job search performance and see how you compare to other applicants.
              </p>
            </div>
            
            {/* Feature 6 */}
            <div className="p-6 border border-gray-100 rounded-lg bg-white">
              <div className="flex justify-center mb-4">
                <svg className="w-10 h-10 text-blue-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 6V12L16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Time-Saving Tools</h3>
              <p className="text-gray-600">
                Save time with one-click applications for jobs that match your profile.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-blue-500 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Job Search?</h2>
          <p className="text-xl mb-8">
            Join thousands of job seekers and employers already using our platform
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" className="bg-gray-900 text-white hover:bg-gray-800">
              Create Account
            </Button>
            <Button size="lg" variant="outline" className="text-white border-white hover:bg-blue-600">
              Learn More
            </Button>
          </div>
        </div>
      </section>
      
      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Trusted by Job Seekers and Employers</h2>
          <p className="text-lg text-gray-600 mb-12">
            Our platform is making a difference in the hiring process
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {/* Stat 1 */}
            <div>
              <p className="text-4xl font-bold text-blue-500 mb-2">5k+</p>
              <p className="text-gray-600">Active Jobs</p>
            </div>
            
            {/* Stat 2 */}
            <div>
              <p className="text-4xl font-bold text-blue-500 mb-2">2k+</p>
              <p className="text-gray-600">Companies</p>
            </div>
            
            {/* Stat 3 */}
            <div>
              <p className="text-4xl font-bold text-blue-500 mb-2">10k+</p>
              <p className="text-gray-600">Job Seekers</p>
            </div>
            
            {/* Stat 4 */}
            <div>
              <p className="text-4xl font-bold text-blue-500 mb-2">85%</p>
              <p className="text-gray-600">Match Rate</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Add testing button - only visible in development */}
      {import.meta.env.DEV && (
        <div className="container mx-auto px-4 my-8">
          <FetchAllJobsTestButton />
        </div>
      )}
    </div>
  );
};

export default Index;
