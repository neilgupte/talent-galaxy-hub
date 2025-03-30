
import React from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Mail, HelpCircle, FileText, Shield } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

const Footer = () => {
  return (
    <footer className="bg-gray-100 dark:bg-gray-900 mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">TalentHub</h3>
            <p className="text-muted-foreground text-sm mb-4">
              Connecting top talent with the best companies. Find your dream job or the perfect candidate.
            </p>
            <div className="flex items-center">
              <Briefcase className="h-5 w-5 text-primary mr-2" />
              <span className="text-sm">© 2023 TalentHub, Inc.</span>
            </div>
          </div>
          
          {/* Resources - Moved from navbar */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/resources/career-advice" className="text-muted-foreground hover:text-primary text-sm">
                  Career Advice
                </Link>
              </li>
              <li>
                <Link to="/resources/resume-tips" className="text-muted-foreground hover:text-primary text-sm">
                  Resume Tips
                </Link>
              </li>
              <li>
                <Link to="/resources/interview-prep" className="text-muted-foreground hover:text-primary text-sm">
                  Interview Prep
                </Link>
              </li>
              <li>
                <Link to="/resources/salary-guides" className="text-muted-foreground hover:text-primary text-sm">
                  Salary Guides
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Companies - Moved from navbar */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Companies</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/companies/browse" className="text-muted-foreground hover:text-primary text-sm">
                  Browse Companies
                </Link>
              </li>
              <li>
                <Link to="/companies/top-rated" className="text-muted-foreground hover:text-primary text-sm">
                  Top Rated
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="text-muted-foreground hover:text-primary text-sm">
                  Employer Pricing
                </Link>
              </li>
              <li>
                <Link to="/post-job" className="text-muted-foreground hover:text-primary text-sm">
                  Post a Job
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Support & Legal */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Help & Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-muted-foreground hover:text-primary text-sm flex items-center">
                  <FileText className="h-4 w-4 mr-2" />
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/help" className="text-muted-foreground hover:text-primary text-sm flex items-center">
                  <HelpCircle className="h-4 w-4 mr-2" />
                  Help Center
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-muted-foreground hover:text-primary text-sm flex items-center">
                  <Mail className="h-4 w-4 mr-2" />
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-muted-foreground hover:text-primary text-sm flex items-center">
                  <Shield className="h-4 w-4 mr-2" />
                  Privacy & Terms
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <Separator className="my-6" />
        
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} TalentHub. All rights reserved.
          </p>
          <div className="flex space-x-4">
            <Link to="/privacy" className="text-sm text-muted-foreground hover:text-primary">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-sm text-muted-foreground hover:text-primary">
              Terms of Service
            </Link>
            <Link to="/cookies" className="text-sm text-muted-foreground hover:text-primary">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
