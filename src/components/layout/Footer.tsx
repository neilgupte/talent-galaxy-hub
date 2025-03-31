
import React from 'react';
import { Link } from 'react-router-dom';
import { Briefcase } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="container mx-auto py-12 px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Link to="/" className="flex items-center">
              <Briefcase className="h-6 w-6 text-blue-600 mr-2" />
              <span className="font-bold text-xl text-blue-600">Talent</span>
              <span className="font-normal text-xl text-gray-800">Hub</span>
            </Link>
            <p className="text-sm text-gray-600">
              Connecting talent with opportunity through intelligent job matching
            </p>
          </div>
          
          <div>
            <h4 className="font-medium mb-4">For Job Seekers</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/jobs" className="text-gray-600 hover:text-blue-600">Browse Jobs</Link></li>
              <li><Link to="/profile" className="text-gray-600 hover:text-blue-600">Create Profile</Link></li>
              <li><Link to="/dashboard/job-seeker" className="text-gray-600 hover:text-blue-600">Career Resources</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium mb-4">For Employers</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/jobs/post" className="text-gray-600 hover:text-blue-600">Post a Job</Link></li>
              <li><Link to="/companies" className="text-gray-600 hover:text-blue-600">Search Talent</Link></li>
              <li><Link to="/pricing" className="text-gray-600 hover:text-blue-600">Pricing</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium mb-4">Company</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/about" className="text-gray-600 hover:text-blue-600">About Us</Link></li>
              <li><Link to="/contact" className="text-gray-600 hover:text-blue-600">Contact</Link></li>
              <li><Link to="/privacy" className="text-gray-600 hover:text-blue-600">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-gray-200 text-center text-sm text-gray-600">
          © 2025 Talent Hub. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
