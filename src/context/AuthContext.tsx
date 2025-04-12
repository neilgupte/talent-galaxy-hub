
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserRole, AuthState } from '@/types';
import { supabase } from "@/integrations/supabase/client";
import { toast } from '@/hooks/use-toast';
import { mapDatabaseUserToModel, mapDatabaseProfileToModel, mapDatabaseCompanyToModel } from '@/services/auth/authUtils';

type AuthContextType = {
  authState: AuthState;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role: UserRole) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (profile: any) => Promise<void>;
  updateCompany: (company: any) => Promise<void>;
  continueWithGoogle: () => Promise<void>;
  continueWithLinkedIn: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  refreshSession: () => Promise<void>;
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
  const navigate = useNavigate();
  
  // Track password reset attempts per user (in-memory tracker for rate limiting)
  const [resetAttempts, setResetAttempts] = useState<Record<string, {count: number, lastAttempt: number}>>({});

  // Refresh the user session data
  const refreshSession = async (): Promise<void> => {
    try {
      console.log("AuthContext: Refreshing session");
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        console.log("AuthContext: No session found during refresh");
        setAuthState({
          ...defaultAuthState,
          isLoading: false
        });
        return;
      }
      
      console.log("AuthContext: Session found, fetching user data", session.user.id);
      
      // Fetch user data
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', session.user.id)
        .single();
      
      if (userError) {
        console.error("Error fetching user data:", userError);
        setAuthState({
          ...defaultAuthState,
          isLoading: false
        });
        return;
      }
      
      // Fetch profile data
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', session.user.id)
        .single();
      
      // Fetch company data if user is an employer
      let companyData = null;
      if (userData.role === 'employer') {
        const { data: companyUserData } = await supabase
          .from('company_users')
          .select('company_id')
          .eq('user_id', session.user.id)
          .single();
        
        if (companyUserData) {
          const { data: company } = await supabase
            .from('companies')
            .select('*')
            .eq('id', companyUserData.company_id)
            .single();
          
          companyData = company;
        }
      }
      
      // Map the data to our frontend models
      const user = mapDatabaseUserToModel(userData);
      const profile = mapDatabaseProfileToModel(profileData);
      const company = mapDatabaseCompanyToModel(companyData);
      
      console.log("AuthContext: Session refresh complete", { 
        userRole: user.role,
        hasProfile: !!profile,
        hasCompany: !!company
      });
      
      setAuthState({
        user,
        profile,
        company,
        isAuthenticated: true,
        isLoading: false
      });
    } catch (error) {
      console.error('Error refreshing session:', error);
      setAuthState({
        ...defaultAuthState,
        isLoading: false
      });
    }
  };

  useEffect(() => {
    console.log("AuthContext: Setting up auth state listener");
    
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("AuthContext: Auth state changed", event, !!session);
        
        if (session) {
          // If we have a session, refresh the user data from the database
          await refreshSession();
          
          // If this was a sign in event, redirect to the appropriate dashboard
          if (event === 'SIGNED_IN') {
            // Use timeout to ensure authState is updated before checking
            setTimeout(() => {
              const userRole = authState.user?.role;
              console.log("AuthContext: Redirecting after sign in", userRole);
              
              if (userRole === 'job_seeker') {
                navigate('/dashboard/job-seeker', { replace: true });
              } else if (userRole === 'employer') {
                navigate('/dashboard/employer', { replace: true });
              }
            }, 500);
          }
        } else {
          // If no session, clear the auth state
          console.log("AuthContext: No session, clearing auth state");
          setAuthState({
            user: null,
            profile: null,
            company: null,
            isAuthenticated: false,
            isLoading: false
          });
        }
      }
    );

    // Check for existing session
    const initSession = async () => {
      try {
        console.log("AuthContext: Checking for existing session");
        await refreshSession();
      } catch (error) {
        console.error("Error checking session:", error);
        setAuthState({
          ...defaultAuthState,
          isLoading: false
        });
      }
    };

    initSession();

    return () => {
      console.log("AuthContext: Cleaning up auth state listener");
      subscription.unsubscribe();
    };
  }, [navigate]);

  // Auth methods
  const login = async (email: string, password: string): Promise<void> => {
    try {
      console.log("AuthContext: Login attempt", email);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        console.error("Login error:", error);
        toast({
          title: "Login failed",
          description: error.message || "An error occurred",
          variant: "destructive"
        });
        throw error;
      }

      console.log("AuthContext: Login successful", data.user?.id);
      toast({
        title: "Login successful",
        description: "Welcome back!",
      });
    } catch (error: any) {
      console.error("Login error:", error);
      toast({
        title: "Login failed",
        description: error.message || "An error occurred",
        variant: "destructive"
      });
      throw error;
    }
  };

  const register = async (name: string, email: string, password: string, role: UserRole): Promise<void> => {
    try {
      console.log("AuthContext: Register attempt", { email, role });
      // Configure registration with no email verification
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            role
          },
          // Remove email redirect to disable verification
          emailRedirectTo: undefined,
        }
      });

      if (error) {
        console.error("Registration error:", error);
        toast({
          title: "Registration failed",
          description: error.message || "An error occurred",
          variant: "destructive"
        });
        throw error;
      }

      console.log("AuthContext: Registration successful", data.user?.id);
      toast({
        title: "Registration successful",
        description: "Your account has been created! You can now sign in.",
      });
      
      // Auto-login after registration
      if (data.user) {
        await login(email, password);
      }
    } catch (error: any) {
      console.error("Registration failed:", error);
      toast({
        title: "Registration failed",
        description: error.message || "An error occurred",
        variant: "destructive"
      });
      throw error;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      console.log("AuthContext: Logout");
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error("Logout error:", error);
        toast({
          title: "Logout failed",
          description: error.message || "An error occurred",
          variant: "destructive"
        });
        throw error;
      }
      
      console.log("AuthContext: Logout successful");
      toast({
        title: "Logged out",
        description: "You have been successfully logged out",
      });
      navigate('/');
    } catch (error: any) {
      console.error("Logout error:", error);
      toast({
        title: "Logout failed",
        description: error.message || "An error occurred",
        variant: "destructive"
      });
    }
  };

  const updateProfile = async (profile: any): Promise<void> => {
    try {
      // Convert from frontend model to database model
      const dbProfile = {
        user_id: profile.userId,
        headline: profile.headline,
        bio: profile.bio,
        location: profile.location,
        current_title: profile.currentTitle,
        skills: profile.skills,
        avatar_url: profile.avatarUrl
      };

      const { error } = await supabase
        .from('profiles')
        .update(dbProfile)
        .eq('user_id', profile.userId);

      if (error) throw error;

      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated",
      });
      
      await refreshSession();
    } catch (error: any) {
      toast({
        title: "Failed to update profile",
        description: error.message || "An error occurred",
        variant: "destructive"
      });
      throw error;
    }
  };

  const updateCompany = async (company: any): Promise<void> => {
    try {
      // Convert from frontend model to database model
      const dbCompany = {
        id: company.id,
        name: company.name,
        industry: company.industry,
        description: company.description,
        logo_url: company.logoUrl,
        plan_type: company.planType
      };

      const { error } = await supabase
        .from('companies')
        .update(dbCompany)
        .eq('id', company.id);

      if (error) throw error;

      toast({
        title: "Company updated",
        description: "Company details have been successfully updated",
      });
      
      await refreshSession();
    } catch (error: any) {
      toast({
        title: "Failed to update company",
        description: error.message || "An error occurred",
        variant: "destructive"
      });
      throw error;
    }
  };

  const continueWithGoogle = async (): Promise<void> => {
    try {
      console.log("AuthContext: Google login attempt");
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });

      if (error) {
        console.error("Google login error:", error);
        toast({
          title: "Google login failed",
          description: error.message || "An error occurred",
          variant: "destructive"
        });
        throw error;
      }
      
      console.log("Google sign in initiated", data);
    } catch (error: any) {
      console.error("Google login failed:", error);
      toast({
        title: "Failed to sign in with Google",
        description: error.message || "An error occurred",
        variant: "destructive"
      });
      throw error;
    }
  };

  const continueWithLinkedIn = async (): Promise<void> => {
    try {
      console.log("AuthContext: LinkedIn login attempt");
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'linkedin_oidc',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });

      if (error) {
        console.error("LinkedIn login error:", error);
        toast({
          title: "LinkedIn login failed",
          description: error.message || "An error occurred",
          variant: "destructive"
        });
        throw error;
      }
      
      console.log("LinkedIn sign in initiated", data);
    } catch (error: any) {
      console.error("LinkedIn login failed:", error);
      toast({
        title: "Failed to sign in with LinkedIn",
        description: error.message || "An error occurred",
        variant: "destructive"
      });
      throw error;
    }
  };

  const resetPassword = async (email: string): Promise<void> => {
    try {
      // Check for rate limiting
      const now = Date.now();
      const userAttempts = resetAttempts[email] || { count: 0, lastAttempt: 0 };
      
      // If the last attempt was more than an hour ago, reset the counter
      if (now - userAttempts.lastAttempt > 60 * 60 * 1000) {
        userAttempts.count = 0;
      }
      
      // Check if user has exceeded maximum attempts
      if (userAttempts.count >= 5) {
        throw new Error("Too many password reset attempts. Please try again later.");
      }
      
      // Update attempts counter
      setResetAttempts({
        ...resetAttempts,
        [email]: {
          count: userAttempts.count + 1,
          lastAttempt: now
        }
      });
      
      // Send password reset email with correct redirect
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });

      if (error) throw error;

      toast({
        title: "Password reset email sent",
        description: "Please check your email for the password reset link. The link will expire in 60 minutes.",
      });
    } catch (error: any) {
      toast({
        title: "Password reset failed",
        description: error.message || "An error occurred",
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
      updateCompany,
      continueWithGoogle,
      continueWithLinkedIn,
      resetPassword,
      refreshSession
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
