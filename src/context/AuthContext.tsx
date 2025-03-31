
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
    console.log("AuthContext: Refreshing session");
    const newAuthState = await refreshUserSession();
    console.log("AuthContext: New auth state", newAuthState);
    setAuthState(newAuthState);
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
          
          // If this was a login or signup event, redirect to the appropriate dashboard
          if (event === 'SIGNED_IN') {
            console.log("AuthContext: Redirecting after sign in", authState.user?.role);
            if (authState.user?.role === 'job_seeker') {
              navigate('/dashboard/job-seeker', { replace: true });
            } else if (authState.user?.role === 'employer') {
              navigate('/dashboard/employer', { replace: true });
            }
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
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log("AuthContext: Checking for existing session", !!session);
      if (!session) {
        setAuthState({
          ...defaultAuthState,
          isLoading: false
        });
      } else {
        // If we have a session, refresh the user data from the database
        refreshSession();
      }
    });

    return () => {
      console.log("AuthContext: Cleaning up auth state listener");
      subscription.unsubscribe();
    };
  }, [navigate]);

  // Auth methods
  const login = async (email: string, password: string) => {
    console.log("AuthContext: Login attempt", email);
    await loginWithEmailPassword(email, password);
  };

  const register = async (name: string, email: string, password: string, role: UserRole) => {
    console.log("AuthContext: Register attempt", email, role);
    await registerUser(name, email, password, role);
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
    const success = await updateUserProfile(profile);
    if (success) {
      setAuthState(prev => ({
        ...prev,
        profile
      }));
    }
  };

  const updateCompany = async (company: any) => {
    const success = await updateCompanyInfo(company);
    if (success) {
      setAuthState(prev => ({
        ...prev,
        company
      }));
    }
  };

  const continueWithGoogle = async () => {
    console.log("AuthContext: Google login attempt");
    await continueWithOAuth('google');
  };

  const continueWithLinkedIn = async () => {
    console.log("AuthContext: LinkedIn login attempt");
    await continueWithOAuth('linkedin_oidc');
  };

  const resetPassword = async (email: string) => {
    await sendPasswordReset(email, resetAttempts, setResetAttempts);
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
