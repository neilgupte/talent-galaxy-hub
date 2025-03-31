
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserRole, AuthState } from '@/types';
import { supabase } from "@/integrations/supabase/client";
import { 
  loginWithEmailPassword, 
  registerUser, 
  continueWithOAuth, 
  logoutUser 
} from '@/services/auth/authUtils';
import { 
  defaultAuthState, 
  refreshUserSession 
} from '@/services/auth/sessionService';
import { 
  updateUserProfile, 
  updateCompanyInfo 
} from '@/services/auth/profileService';
import { 
  sendPasswordReset 
} from '@/services/auth/passwordService';

type AuthContextType = {
  authState: AuthState;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role: UserRole) => Promise<void>;
  logout: () => void;
  updateProfile: (profile: any) => Promise<void>;
  updateCompany: (company: any) => Promise<void>;
  continueWithGoogle: () => Promise<void>;
  continueWithLinkedIn: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  refreshSession: () => Promise<void>;
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
      const newAuthState = await refreshUserSession();
      console.log("AuthContext: New auth state", newAuthState);
      setAuthState(newAuthState);
    } catch (error) {
      console.error("Error refreshing session:", error);
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
          
          // Wait a moment to ensure authState is updated before checking roles
          setTimeout(() => {
            // If this was a login event, redirect to the appropriate dashboard
            if (event === 'SIGNED_IN') {
              const userRole = authState.user?.role;
              console.log("AuthContext: Redirecting after sign in", userRole);
              
              if (userRole === 'job_seeker') {
                navigate('/dashboard/job-seeker', { replace: true });
              } else if (userRole === 'employer') {
                navigate('/dashboard/employer', { replace: true });
              }
            }
          }, 100);
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
        const { data: { session } } = await supabase.auth.getSession();
        
        console.log("AuthContext: Existing session", !!session);
        if (!session) {
          setAuthState({
            ...defaultAuthState,
            isLoading: false
          });
        } else {
          // If we have a session, refresh the user data from the database
          await refreshSession();
        }
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
  const login = async (email: string, password: string) => {
    try {
      console.log("AuthContext: Login attempt", email);
      await loginWithEmailPassword(email, password);
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const register = async (name: string, email: string, password: string, role: UserRole) => {
    try {
      console.log("AuthContext: Register attempt", email, role);
      await registerUser(name, email, password, role);
    } catch (error) {
      console.error("Register error:", error);
      throw error;
    }
  };

  const logout = () => {
    console.log("AuthContext: Logout");
    logoutUser(navigate);
    setAuthState({
      user: null,
      profile: null,
      company: null,
      isAuthenticated: false,
      isLoading: false
    });
  };

  const updateProfile = async (profile: any) => {
    try {
      const success = await updateUserProfile(profile);
      if (success) {
        setAuthState(prev => ({
          ...prev,
          profile
        }));
      }
    } catch (error) {
      console.error("Update profile error:", error);
      throw error;
    }
  };

  const updateCompany = async (company: any) => {
    try {
      const success = await updateCompanyInfo(company);
      if (success) {
        setAuthState(prev => ({
          ...prev,
          company
        }));
      }
    } catch (error) {
      console.error("Update company error:", error);
      throw error;
    }
  };

  const continueWithGoogle = async () => {
    try {
      console.log("AuthContext: Google login attempt");
      await continueWithOAuth('google');
    } catch (error) {
      console.error("Google login error:", error);
      throw error;
    }
  };

  const continueWithLinkedIn = async () => {
    try {
      console.log("AuthContext: LinkedIn login attempt");
      await continueWithOAuth('linkedin_oidc');
    } catch (error) {
      console.error("LinkedIn login error:", error);
      throw error;
    }
  };

  const resetPassword = async (email: string) => {
    try {
      await sendPasswordReset(email, resetAttempts, setResetAttempts);
    } catch (error) {
      console.error("Reset password error:", error);
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
