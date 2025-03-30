
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

            setAuthState({
              user: userData,
              profile: profileData || null,
              company: companyData,
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
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            role
          }
        }
      });

      if (error) throw error;

      toast({
        title: "Registration successful",
        description: `Welcome, ${name}!`,
      });

      // Redirect to appropriate onboarding page based on role
      setTimeout(() => {
        if (role === 'job_seeker') {
          navigate('/onboarding/profile');
        } else {
          navigate('/dashboard/employer');
        }
      }, 1000);
    } catch (error: any) {
      toast({
        title: "Registration failed",
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
      const { error } = await supabase
        .from('profiles')
        .update(profile)
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
      const { error } = await supabase
        .from('companies')
        .update(company)
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
      continueWithLinkedIn
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
