
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useNotifications } from "@/context/NotificationContext";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";
import { LogOut, Settings, User, LayoutDashboard, Bell, Briefcase, BookmarkCheck, FileText, X, Search } from "lucide-react";
import NotificationCenter from "@/components/notifications/NotificationCenter";
import { Separator } from "@/components/ui/separator";
import SmartSearchBox from "@/components/jobs/SmartSearchBox";

const Navbar = () => {
  const { authState, logout } = useAuth();
  const { isAuthenticated, user, profile } = authState;
  const { notifications, markAsRead, markAllAsRead, deleteNotification } = useNotifications();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
  };

  const handleSearch = (query: string, parsedQuery?: { title: string; location: string }) => {
    let searchUrl = `/jobs?query=${encodeURIComponent(query)}`;
    
    if (parsedQuery && parsedQuery.title && parsedQuery.location) {
      searchUrl = `/jobs?query=${encodeURIComponent(query)}&title=${encodeURIComponent(parsedQuery.title)}&location=${encodeURIComponent(parsedQuery.location)}`;
    }
    
    navigate(searchUrl);
  };

  return (
    <header className="w-full border-b bg-white py-3">
      <div className="container mx-auto flex items-center justify-between px-4">
        <div className="flex items-center">
          <Link to="/" className="flex items-center mr-8">
            <Briefcase className="h-6 w-6 text-blue-600 mr-2" />
            <span className="font-bold text-xl text-blue-600">Talent</span>
            <span className="font-normal text-xl text-gray-800">Hub</span>
          </Link>
          
          <div className="hidden md:flex relative max-w-md">
            <input
              type="text"
              placeholder="UX Designer"
              className="w-full border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
            <button className="absolute right-1 top-1/2 transform -translate-y-1/2 p-1">
              <X className="h-4 w-4 text-gray-400" />
            </button>
            <button className="absolute right-8 top-1/2 transform -translate-y-1/2 p-1">
              <Search className="h-4 w-4 text-gray-400" />
            </button>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            <>
              <NotificationCenter 
                notifications={notifications}
                onMarkAsRead={markAsRead}
                onMarkAllAsRead={markAllAsRead}
                onDelete={deleteNotification}
              />
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full p-0">
                    <Avatar className="h-8 w-8">
                      {profile?.avatarUrl ? (
                        <AvatarImage src={profile.avatarUrl} alt={user?.name || 'User'} />
                      ) : (
                        <AvatarFallback>
                          {user?.name?.charAt(0) || 'U'}
                        </AvatarFallback>
                      )}
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user?.name}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user?.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    {user?.role === 'job_seeker' ? (
                      <>
                        <DropdownMenuItem asChild>
                          <Link to="/dashboard/job-seeker">
                            <LayoutDashboard className="mr-2 h-4 w-4" />
                            <span>Dashboard</span>
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link to="/profile">
                            <User className="mr-2 h-4 w-4" />
                            <span>Profile</span>
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link to="/saved-jobs">
                            <BookmarkCheck className="mr-2 h-4 w-4" />
                            <span>Saved Jobs</span>
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link to="/profile#cvs">
                            <FileText className="mr-2 h-4 w-4" />
                            <span>My CVs</span>
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link to="/account/settings">
                            <Settings className="mr-2 h-4 w-4" />
                            <span>Settings</span>
                          </Link>
                        </DropdownMenuItem>
                      </>
                    ) : (
                      <DropdownMenuItem asChild>
                        <Link to="/dashboard/employer">
                          <LayoutDashboard className="mr-2 h-4 w-4" />
                          <span>Dashboard</span>
                        </Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem asChild>
                      <Link to="/notifications">
                        <Bell className="mr-2 h-4 w-4" />
                        <span>Notifications</span>
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Button variant="ghost" asChild className="text-gray-700">
                <Link to="/auth?mode=login">Log in</Link>
              </Button>
              <Button asChild className="bg-blue-600 hover:bg-blue-700">
                <Link to="/auth?mode=signup">Sign up</Link>
              </Button>
              <Button asChild className="bg-white border border-gray-300 text-gray-800 hover:bg-gray-50">
                <Link to="/auth?mode=signup&role=employer">Post a Job</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
