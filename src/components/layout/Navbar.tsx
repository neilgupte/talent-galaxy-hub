
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Bell, Menu, Search, User, Briefcase, LogOut, PlusCircle } from 'lucide-react';

const Navbar = () => {
  const { authState, logout } = useAuth();
  const { isAuthenticated, user } = authState;
  const navigate = useNavigate();
  
  const handleLogout = () => {
    logout();
  };
  
  const getInitials = (name: string) => {
    return name
      ?.split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase() || 'U';
  };
  
  const dashboardLink = user?.role === 'job_seeker' 
    ? '/dashboard/job-seeker' 
    : '/dashboard/employer';

  const handlePostJobClick = () => {
    if (isAuthenticated && user?.role === 'employer') {
      navigate('/jobs/post');
    } else if (isAuthenticated && user?.role === 'job_seeker') {
      // If a job seeker tries to post a job, redirect them to change their account type
      navigate('/account/upgrade');
    } else {
      // If not logged in, redirect to auth page
      navigate('/auth');
    }
  };

  return (
    <header className="bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-40">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and main nav */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <Briefcase className="h-8 w-8 text-primary" />
              <span className="ml-2 text-xl font-bold text-gray-900 dark:text-gray-100">TalentHub</span>
            </Link>
            
            <nav className="hidden md:ml-10 md:flex md:space-x-6">
              <Link to="/jobs" className="text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary px-3 py-2 rounded-md">
                Find Jobs
              </Link>
              <Link to="/companies" className="text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary px-3 py-2 rounded-md">
                Companies
              </Link>
              <Link to="/resources" className="text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary px-3 py-2 rounded-md">
                Resources
              </Link>
            </nav>
          </div>
          
          {/* Search - visible on larger screens */}
          <div className="hidden md:block flex-1 max-w-md mx-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md leading-5 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                placeholder="Search jobs..."
              />
            </div>
          </div>
          
          {/* Auth buttons or user menu */}
          <div className="flex items-center space-x-2">
            <Button 
              onClick={handlePostJobClick}
              className="hidden sm:flex items-center gap-2"
              variant="outline"
            >
              <PlusCircle className="h-4 w-4" />
              Post Job
            </Button>
            
            {isAuthenticated ? (
              <>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-500"></span>
                </Button>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                      <Avatar>
                        <AvatarImage src="/placeholder.svg" alt={user?.name} />
                        <AvatarFallback>{user?.name ? getInitials(user.name) : 'U'}</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <div className="flex items-center justify-start gap-2 p-2">
                      <div className="flex flex-col space-y-0.5 leading-none">
                        <p className="font-medium text-sm">{user?.name}</p>
                        <p className="text-xs text-muted-foreground">{user?.email}</p>
                      </div>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to={dashboardLink} className="cursor-pointer w-full flex items-center">
                        <User className="mr-2 h-4 w-4" />
                        <span>Dashboard</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/profile" className="cursor-pointer w-full flex items-center">
                        <User className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Button variant="ghost" asChild>
                  <Link to="/auth">Log in</Link>
                </Button>
                <Button asChild>
                  <Link to="/auth">Sign up</Link>
                </Button>
              </>
            )}
            
            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile search - only visible on small screens */}
      <div className="md:hidden px-4 pb-3">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md leading-5 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
            placeholder="Search jobs..."
          />
        </div>
      </div>
    </header>
  );
};

export default Navbar;
