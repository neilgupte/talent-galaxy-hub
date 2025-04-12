
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserRole, AuthState } from '@/types';
import { supabase } from "@/integrations/supabase/client";
import { toast } from '@/hooks/use-toast';
import { mapDatabaseUserToModel, mapDatabaseProfileToModel, mapDatabaseCompanyToModel } from '@/services/auth/authUtils';
import { 
  loginWithEmailPassword, 
  registerUser, 
  continueWithOAuth, 
  logoutUser 
} from '@/services/auth/authMethods';
import { 
  sendPasswordReset
} from '@/services/auth/passwordService';
import {
  updateUserProfile,
  updateCompanyInfo
} from '@/services/auth/profileService';
import { refreshUserSession } from '@/services/auth/sessionService';

// Define the default auth state
export const defaultAuthState: AuthState = {
  user: null,
  profile: null,
  company: null,
  isAuthenticated: false,
  isLoading: true
};

// Define the AuthContext type
export type AuthContextType = {
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

// Create the AuthContext
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>(defaultAuthState);
  const navigate = useNavigate();
  
  // Track password reset attempts per user (in-memory tracker for rate limiting)
  const [resetAttempts, setResetAttempts] = useState<Record<string, {count: number, lastAttempt: number}>>({});

  // Refresh the user session data
  const refreshSession = async (): Promise<void> => {
    try {
      console.log("AuthContext: Refreshing session");
      const updatedState = await refreshUserSession();
      setAuthState(updatedState);
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
      const { data, error } = await loginWithEmailPassword(email, password);

      if (error) throw error;

      // After successful login, fetch the user data to get the role
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('role')
        .eq('id', data.user?.id)
        .single();
      
      if (userError) {
        console.error("Error fetching user role:", userError);
      } else {
        console.log("User role determined:", userData.role);
      }
    } catch (error: any) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const register = async (name: string, email: string, password: string, role: UserRole): Promise<void> => {
    try {
      console.log("AuthContext: Register attempt", { email, role });
      const { data, error } = await registerUser(name, email, password, role);

      if (error) throw error;
      
      // Auto-login after registration
      if (data.user) {
        await login(email, password);
      }
    } catch (error: any) {
      console.error("Registration failed:", error);
      throw error;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      console.log("AuthContext: Logout");
      const success = await logoutUser(navigate);
      if (!success) throw new Error("Logout failed");
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
      await updateUserProfile(profile);
      await refreshSession();
    } catch (error: any) {
      throw error;
    }
  };

  const updateCompany = async (company: any): Promise<void> => {
    try {
      await updateCompanyInfo(company);
      await refreshSession();
    } catch (error: any) {
      throw error;
    }
  };

  const continueWithGoogle = async (): Promise<void> => {
    try {
      console.log("AuthContext: Google login attempt");
      await continueWithOAuth('google');
    } catch (error: any) {
      console.error("Google login failed:", error);
      throw error;
    }
  };

  const continueWithLinkedIn = async (): Promise<void> => {
    try {
      console.log("AuthContext: LinkedIn login attempt");
      await continueWithOAuth('linkedin_oidc');
    } catch (error: any) {
      console.error("LinkedIn login failed:", error);
      throw error;
    }
  };

  const resetPassword = async (email: string): Promise<void> => {
    try {
      await sendPasswordReset(email, resetAttempts, setResetAttempts);
    } catch (error: any) {
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
