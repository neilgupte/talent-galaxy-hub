
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
  const refreshSession = async () => {
    const newAuthState = await refreshUserSession();
    setAuthState(newAuthState);
  };

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session) {
          // If we have a session, refresh the user data from the database
          refreshSession();
        } else {
          // If no session, clear the auth state
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

  // Auth methods
  const login = async (email: string, password: string) => {
    await loginWithEmailPassword(email, password);
  };

  const register = async (name: string, email: string, password: string, role: UserRole) => {
    await registerUser(name, email, password, role);
  };

  const logout = () => {
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
    await continueWithOAuth('google');
  };

  const continueWithLinkedIn = async () => {
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
