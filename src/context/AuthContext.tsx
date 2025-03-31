
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Profile, Company, UserRole, AuthState } from '@/types';
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

type AuthContextType = {
  authState: AuthState;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role: UserRole) => Promise<void>;
  logout: () => void;
  updateProfile: (profile: Profile) => Promise<void>;
  updateCompany: (company: Company) => Promise<void>;
  continueWithGoogle: () => Promise<void>;
  continueWithLinkedIn: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  refreshSession: () => Promise<void>; // Added refreshSession method
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
  const navigate = useNavigate();
  
  // Track password reset attempts per user (in-memory tracker for rate limiting)
  const [resetAttempts, setResetAttempts] = useState<Record<string, {count: number, lastAttempt: number}>>({});

  // Added refreshSession function
  const refreshSession = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        // Get user data from our users table
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (userError) throw userError;

        // Get profile data
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', session.user.id)
          .single();

        if (profileError && profileError.code !== 'PGRST116') throw profileError;

        // Get company data if user is an employer
        let companyData = null;
        if (userData.role === 'employer') {
          const { data: companyUserData, error: companyUserError } = await supabase
            .from('company_users')
            .select('company_id')
            .eq('user_id', session.user.id)
            .single();

          if (!companyUserError && companyUserData) {
            const { data: company, error: companyError } = await supabase
              .from('companies')
              .select('*')
              .eq('id', companyUserData.company_id)
              .single();

            if (!companyError) companyData = company;
          }
        }

        // Convert from database model to frontend model
        const user: User = {
          id: userData.id,
          name: userData.name,
          email: userData.email,
          role: userData.role as UserRole,
          createdAt: userData.created_at
        };

        let profile: Profile | null = null;
        if (profileData) {
          profile = {
            userId: profileData.user_id,
            headline: profileData.headline || '',
            bio: profileData.bio || '',
            location: profileData.location || '',
            currentTitle: profileData.current_title || '',
            skills: profileData.skills || [],
            avatarUrl: profileData.avatar_url
          };
        }

        let company: Company | null = null;
        if (companyData) {
          company = {
            id: companyData.id,
            name: companyData.name,
            industry: companyData.industry || '',
            description: companyData.description || '',
            logoUrl: companyData.logo_url,
            planType: companyData.plan_type || 'free'
          };
        }

        setAuthState({
          user,
          profile,
          company,
          isAuthenticated: true,
          isLoading: false
        });

        return;
      }
      
      // If no session
      setAuthState({
        user: null,
        profile: null,
        company: null,
        isAuthenticated: false,
        isLoading: false
      });
    } catch (error) {
      console.error('Error refreshing session:', error);
      setAuthState({
        user: null,
        profile: null,
        company: null,
        isAuthenticated: false,
        isLoading: false
      });
    }
  };

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session) {
          try {
            // Get user data from our users table
            const { data: userData, error: userError } = await supabase
              .from('users')
              .select('*')
              .eq('id', session.user.id)
              .single();

            if (userError) throw userError;

            // Get profile data
            const { data: profileData, error: profileError } = await supabase
              .from('profiles')
              .select('*')
              .eq('user_id', session.user.id)
              .single();

            if (profileError && profileError.code !== 'PGRST116') throw profileError;

            // Get company data if user is an employer
            let companyData = null;
            if (userData.role === 'employer') {
              const { data: companyUserData, error: companyUserError } = await supabase
                .from('company_users')
                .select('company_id')
                .eq('user_id', session.user.id)
                .single();

              if (!companyUserError && companyUserData) {
                const { data: company, error: companyError } = await supabase
                  .from('companies')
                  .select('*')
                  .eq('id', companyUserData.company_id)
                  .single();

                if (!companyError) companyData = company;
              }
            }

            // Convert from database model to frontend model
            const user: User = {
              id: userData.id,
              name: userData.name,
              email: userData.email,
              role: userData.role as UserRole, // Cast to UserRole type
              createdAt: userData.created_at
            };

            let profile: Profile | null = null;
            if (profileData) {
              profile = {
                userId: profileData.user_id,
                headline: profileData.headline || '',
                bio: profileData.bio || '',
                location: profileData.location || '',
                currentTitle: profileData.current_title || '',
                skills: profileData.skills || [],
                avatarUrl: profileData.avatar_url
              };
            }

            let company: Company | null = null;
            if (companyData) {
              company = {
                id: companyData.id,
                name: companyData.name,
                industry: companyData.industry || '',
                description: companyData.description || '',
                logoUrl: companyData.logo_url,
                planType: companyData.plan_type || 'free'
              };
            }

            setAuthState({
              user,
              profile,
              company,
              isAuthenticated: true,
              isLoading: false
            });
          } catch (error) {
            console.error('Error fetching user data:', error);
            setAuthState({
              user: null,
              profile: null,
              company: null,
              isAuthenticated: false,
              isLoading: false
            });
          }
        } else {
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
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        setAuthState({
          ...defaultAuthState,
          isLoading: false
        });
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;

      toast({
        title: "Login successful",
        description: "Welcome back!",
      });
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.message || "An error occurred",
        variant: "destructive"
      });
      throw error;
    }
  };

  const register = async (name: string, email: string, password: string, role: UserRole) => {
    try {
      // Configure registration with options
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            role
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        }
      });

      if (error) throw error;

      toast({
        title: "Registration successful",
        description: "Please check your email to confirm your account.",
      });
      
      // Don't redirect yet - wait for email confirmation
    } catch (error: any) {
      toast({
        title: "Registration failed",
        description: error.message || "An error occurred",
        variant: "destructive"
      });
      throw error;
    }
  };

  const resetPassword = async (email: string) => {
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

  const logout = async () => {
    await supabase.auth.signOut();
    setAuthState({
      user: null,
      profile: null,
      company: null,
      isAuthenticated: false,
      isLoading: false
    });
    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
    });
    navigate('/');
  };

  const updateProfile = async (profile: Profile) => {
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

      setAuthState(prev => ({
        ...prev,
        profile
      }));

      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated",
      });
    } catch (error: any) {
      toast({
        title: "Failed to update profile",
        description: error.message || "An error occurred",
        variant: "destructive"
      });
      throw error;
    }
  };

  const updateCompany = async (company: Company) => {
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

      setAuthState(prev => ({
        ...prev,
        company
      }));

      toast({
        title: "Company updated",
        description: "Company details have been successfully updated",
      });
    } catch (error: any) {
      toast({
        title: "Failed to update company",
        description: error.message || "An error occurred",
        variant: "destructive"
      });
      throw error;
    }
  };

  const continueWithGoogle = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });

      if (error) throw error;
    } catch (error: any) {
      toast({
        title: "Failed to sign in with Google",
        description: error.message || "An error occurred",
        variant: "destructive"
      });
      throw error;
    }
  };

  const continueWithLinkedIn = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'linkedin_oidc',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });

      if (error) throw error;
    } catch (error: any) {
      toast({
        title: "Failed to sign in with LinkedIn",
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
