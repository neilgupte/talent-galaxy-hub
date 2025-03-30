
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Profile, Company, UserRole, AuthState } from '@/types';
import { useToast } from "@/components/ui/use-toast";

// Mock data for now - will be replaced with actual API calls
const MOCK_USERS = [
  { 
    id: 'user1', 
    name: 'John Doe', 
    email: 'john@example.com', 
    role: 'job_seeker' as UserRole,
    createdAt: new Date().toISOString()
  },
  { 
    id: 'user2', 
    name: 'Jane Smith', 
    email: 'jane@example.com', 
    role: 'employer' as UserRole,
    createdAt: new Date().toISOString()
  },
];

const MOCK_PROFILES = [
  {
    userId: 'user1',
    headline: 'Software Developer',
    bio: 'Passionate developer with 5 years of experience',
    location: 'New York, NY',
    currentTitle: 'Senior Developer',
    skills: ['JavaScript', 'React', 'Node.js', 'TypeScript']
  }
];

const MOCK_COMPANIES = [
  {
    id: 'company1',
    name: 'Tech Solutions Inc',
    industry: 'Information Technology',
    description: 'Leading provider of innovative tech solutions',
    logoUrl: '/placeholder.svg',
    planType: 'premium',
    jobsPosted: 5
  }
];

type AuthContextType = {
  authState: AuthState;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role: UserRole) => Promise<void>;
  logout: () => void;
  updateProfile: (profile: Profile) => Promise<void>;
  updateCompany: (company: Company) => Promise<void>;
};

const defaultAuthState: AuthState = {
  user: null,
  profile: null,
  company: null,
  isAuthenticated: false,
  isLoading: true
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>(defaultAuthState);
  const { toast } = useToast();

  // Check for stored auth on mount
  useEffect(() => {
    const storedAuth = localStorage.getItem('auth');
    if (storedAuth) {
      try {
        const parsed = JSON.parse(storedAuth);
        setAuthState({
          ...parsed,
          isLoading: false
        });
      } catch (error) {
        console.error('Failed to parse stored auth:', error);
        setAuthState({ ...defaultAuthState, isLoading: false });
      }
    } else {
      setAuthState({ ...defaultAuthState, isLoading: false });
    }
  }, []);

  // Save auth state to localStorage when it changes
  useEffect(() => {
    if (!authState.isLoading) {
      localStorage.setItem('auth', JSON.stringify({
        user: authState.user,
        profile: authState.profile,
        company: authState.company,
        isAuthenticated: authState.isAuthenticated
      }));
    }
  }, [authState]);

  const login = async (email: string, password: string) => {
    try {
      // Mock login - would be replaced with actual API call
      const user = MOCK_USERS.find(u => u.email === email);
      
      if (!user) {
        throw new Error('Invalid credentials');
      }
      
      // Find associated profile or company
      const profile = user.role === 'job_seeker' 
        ? MOCK_PROFILES.find(p => p.userId === user.id) || null
        : null;
        
      const company = user.role === 'employer'
        ? MOCK_COMPANIES[0] // Mock association
        : null;
      
      setAuthState({
        user,
        profile,
        company,
        isAuthenticated: true,
        isLoading: false
      });
      
      toast({
        title: "Login successful",
        description: `Welcome back, ${user.name}!`,
      });
    } catch (error) {
      toast({
        title: "Login failed",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive"
      });
      throw error;
    }
  };

  const register = async (name: string, email: string, password: string, role: UserRole) => {
    try {
      // Mock registration - would be replaced with actual API call
      if (MOCK_USERS.some(u => u.email === email)) {
        throw new Error('Email already in use');
      }
      
      const newUser: User = {
        id: `user${MOCK_USERS.length + 1}`,
        name,
        email,
        role,
        createdAt: new Date().toISOString()
      };
      
      // For demo purposes, add to our mock data
      MOCK_USERS.push(newUser);
      
      setAuthState({
        user: newUser,
        profile: null,
        company: null,
        isAuthenticated: true,
        isLoading: false
      });
      
      toast({
        title: "Registration successful",
        description: `Welcome, ${name}!`,
      });
    } catch (error) {
      toast({
        title: "Registration failed",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive"
      });
      throw error;
    }
  };

  const logout = () => {
    setAuthState({
      user: null,
      profile: null,
      company: null,
      isAuthenticated: false,
      isLoading: false
    });
    localStorage.removeItem('auth');
    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
    });
  };

  const updateProfile = async (profile: Profile) => {
    try {
      // Mock profile update - would be replaced with actual API call
      setAuthState(prev => ({
        ...prev,
        profile
      }));
      
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated",
      });
    } catch (error) {
      toast({
        title: "Failed to update profile",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive"
      });
      throw error;
    }
  };

  const updateCompany = async (company: Company) => {
    try {
      // Mock company update - would be replaced with actual API call
      setAuthState(prev => ({
        ...prev,
        company
      }));
      
      toast({
        title: "Company updated",
        description: "Company details have been successfully updated",
      });
    } catch (error) {
      toast({
        title: "Failed to update company",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive"
      });
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{
      authState,
      login,
      register,
      logout,
      updateProfile,
      updateCompany
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
