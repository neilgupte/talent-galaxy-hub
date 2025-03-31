
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import SearchBox from '@/components/jobs/SearchBox';
import FeaturedJobs from '@/components/jobs/FeaturedJobs';
import FetchAllJobsTestButton from '@/components/jobs/FetchAllJobsTestButton';

const Index = () => {
  const navigate = useNavigate();
  
  const handleSearch = (query: string, parsedQuery?: { title: string; location: string }) => {
    navigate(`/jobs?q=${encodeURIComponent(query)}`);
  };

  return (
    <div className="bg-blue-50/50">
      {/* Hero Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Finally, a Job Platform That Respects Your Time.
          </h1>
          <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
            No more endless applications or ghosting — just smart matches, real feedback, and better outcomes for everyone.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" className="bg-blue-600 text-white hover:bg-blue-700">
              Get Started
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/jobs">Browse Jobs</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-6">
            <SearchBox 
              onSearch={handleSearch} 
              placeholder="Job title, keywords, or location..."
              showHistory={false}
            />
          </div>
        </div>
      </section>
      
      <FeaturedJobs />
      
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
