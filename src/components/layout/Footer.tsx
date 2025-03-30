
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-100 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
      <div className="container mx-auto py-8 px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">JobMatch AI</h3>
            <p className="text-sm text-muted-foreground">
              Powered by AI, matching the best talent with the perfect job opportunities.
            </p>
          </div>
          
          <div>
            <h4 className="font-medium mb-4">For Job Seekers</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/jobs" className="hover:underline">Browse Jobs</Link></li>
              <li><Link to="/dashboard/job-seeker" className="hover:underline">Your Dashboard</Link></li>
              <li><Link to="/profile" className="hover:underline">Build Profile</Link></li>
              <li><Link to="/notifications" className="hover:underline">Notifications</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium mb-4">For Employers</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/dashboard/employer" className="hover:underline">Employer Dashboard</Link></li>
              <li><Link to="/jobs/post" className="hover:underline">Post a Job</Link></li>
              <li><Link to="/pricing" className="hover:underline">Pricing</Link></li>
              <li><Link to="/companies" className="hover:underline">Companies</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium mb-4">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/about" className="hover:underline">About Us</Link></li>
              <li><Link to="/contact" className="hover:underline">Contact</Link></li>
              <li><Link to="/faq" className="hover:underline">FAQ</Link></li>
              <li><Link to="/privacy" className="hover:underline">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:underline">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row justify-between items-center mt-12 pt-6 border-t border-gray-200 dark:border-gray-800 text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} JobMatch AI. All rights reserved.</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <a href="#" className="hover:text-primary">Twitter</a>
            <a href="#" className="hover:text-primary">LinkedIn</a>
            <a href="#" className="hover:text-primary">Facebook</a>
            <a href="#" className="hover:text-primary">Instagram</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
