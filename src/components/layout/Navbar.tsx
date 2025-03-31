
import React, { useState } from "react";
import { Link } from "react-router-dom";
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
import { LogOut, Settings, User, LayoutDashboard, Bell, Briefcase, Search, BookmarkCheck } from "lucide-react";
import NotificationCenter from "@/components/notifications/NotificationCenter";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import SearchBox from "@/components/jobs/SearchBox";

const Navbar = () => {
  const { authState, logout } = useAuth();
  const { isAuthenticated, user, profile } = authState;
  const { notifications, markAsRead, markAllAsRead, deleteNotification } = useNotifications();
  const [searchQuery, setSearchQuery] = useState("");

  const handleLogout = async () => {
    await logout();
  };

  const handleSearch = (query: string) => {
    window.location.href = `/jobs?query=${encodeURIComponent(query)}`;
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="container flex h-16 items-center">
        <div className="mr-4 flex">
          <Link to="/" className="flex items-center space-x-2">
            <Briefcase className="h-6 w-6 text-primary" />
            <span className="font-bold text-2xl text-primary">Talent</span>
            <span className="font-light text-2xl">Hub</span>
          </Link>
        </div>
        
        <div className="hidden md:flex mx-4 flex-1 items-center">
          <SearchBox 
            onSearch={handleSearch}
            placeholder="Search jobs or locations..."
            className="w-full max-w-lg"
          />
        </div>
        
        <div className="flex items-center justify-end space-x-2 sm:space-x-4">
          {/* User is authenticated */}
          {isAuthenticated ? (
            <>
              {/* Notifications */}
              <NotificationCenter 
                notifications={notifications}
                onMarkAsRead={markAsRead}
                onMarkAllAsRead={markAllAsRead}
                onDelete={deleteNotification}
              />
              
              {/* User Menu - Now using Avatar component */}
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
              {/* Login and sign up buttons */}
              <Button variant="ghost" asChild>
                <Link to="/auth?mode=login">Log in</Link>
              </Button>
              <Button asChild>
                <Link to="/auth?mode=signup">Sign up</Link>
              </Button>
              <Separator orientation="vertical" className="h-6 bg-gray-400 dark:bg-gray-600" />
              {/* Post a Job button after separator */}
              <Button asChild variant="outline">
                <Link to="/auth?mode=signup&role=employer">Post a Job</Link>
              </Button>
            </>
          )}
        </div>
      </div>
      
      {/* Mobile search - only shown on smaller screens */}
      <div className="md:hidden px-4 pb-3">
        <SearchBox 
          onSearch={handleSearch}
          placeholder="Search jobs or locations..."
          className="w-full"
        />
      </div>
    </header>
  );
};

export default Navbar;
