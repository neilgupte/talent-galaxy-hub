import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search, Building2, Briefcase, Globe } from 'lucide-react';
import SearchBox from '@/components/jobs/SearchBox';
import FeaturedJobs from '@/components/jobs/FeaturedJobs';
import FetchAllJobsTestButton from '@/components/jobs/FetchAllJobsTestButton';

const Index = () => {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-100 to-blue-300 py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold text-blue-800 mb-8">
            Find Your Dream Job Today
          </h1>
          <p className="text-xl text-blue-600 mb-12">
            Explore thousands of job opportunities in various industries and locations.
          </p>
          <div className="flex justify-center">
            <Link to="/jobs">
              <Button className="bg-blue-600 text-white hover:bg-blue-700">
                Get Started <Search className="ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
            Search for Jobs
          </h2>
          <SearchBox />
        </div>
      </section>
      
      <FeaturedJobs />
      
      {/* Add testing button - only visible in development */}
      {import.meta.env.DEV && (
        <div className="container mx-auto px-4 my-8">
          <FetchAllJobsTestButton />
        </div>
      )}

      {/* Categories Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
            Browse by Category
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Example Category */}
            <Link to="/jobs?category=engineering" className="block bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition duration-300">
              <div className="flex items-center mb-4">
                <Building2 className="text-blue-500 mr-4" />
                <h3 className="text-xl font-semibold text-gray-700">Engineering</h3>
              </div>
              <p className="text-gray-600">Explore engineering jobs in software, hardware, and more.</p>
              <Badge className="mt-4 bg-blue-100 text-blue-700 border-none">245 Jobs</Badge>
            </Link>

            {/* Example Category */}
            <Link to="/jobs?category=marketing" className="block bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition duration-300">
              <div className="flex items-center mb-4">
                <Briefcase className="text-green-500 mr-4" />
                <h3 className="text-xl font-semibold text-gray-700">Marketing</h3>
              </div>
              <p className="text-gray-600">Find marketing positions in digital, content, and brand marketing.</p>
              <Badge className="mt-4 bg-green-100 text-green-700 border-none">189 Jobs</Badge>
            </Link>

            {/* Example Category */}
            <Link to="/jobs?category=remote" className="block bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition duration-300">
              <div className="flex items-center mb-4">
                <Globe className="text-purple-500 mr-4" />
                <h3 className="text-xl font-semibold text-gray-700">Remote</h3>
              </div>
              <p className="text-gray-600">Discover remote job opportunities from around the world.</p>
              <Badge className="mt-4 bg-purple-100 text-purple-700 border-none">322 Jobs</Badge>
            </Link>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="bg-blue-100 py-24">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-blue-800 mb-8">
            Ready to Take the Next Step?
          </h2>
          <p className="text-xl text-blue-600 mb-12">
            Create an account and start applying for jobs today.
          </p>
          <Link to="/auth">
            <Button className="bg-blue-600 text-white hover:bg-blue-700">
              Sign Up Now
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Index;
