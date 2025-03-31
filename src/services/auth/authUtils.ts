
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { User, Profile, Company, UserRole } from "@/types";
import { useNavigate } from "react-router-dom";

// Convert database models to frontend models
export const mapDatabaseUserToModel = (userData: any): User => {
  return {
    id: userData.id,
    name: userData.name,
    email: userData.email,
    role: userData.role as UserRole,
    createdAt: userData.created_at
  };
};

export const mapDatabaseProfileToModel = (profileData: any): Profile | null => {
  if (!profileData) return null;
  
  return {
    userId: profileData.user_id,
    headline: profileData.headline || '',
    bio: profileData.bio || '',
    location: profileData.location || '',
    currentTitle: profileData.current_title || '',
    skills: profileData.skills || [],
    avatarUrl: profileData.avatar_url
  };
};

export const mapDatabaseCompanyToModel = (companyData: any): Company | null => {
  if (!companyData) return null;
  
  return {
    id: companyData.id,
    name: companyData.name,
    industry: companyData.industry || '',
    description: companyData.description || '',
    logoUrl: companyData.logo_url,
    planType: companyData.plan_type || 'free'
  };
};

// Login function
export const loginWithEmailPassword = async (email: string, password: string) => {
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

// Registration function
export const registerUser = async (name: string, email: string, password: string, role: UserRole) => {
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
  } catch (error: any) {
    toast({
      title: "Registration failed",
      description: error.message || "An error occurred",
      variant: "destructive"
    });
    throw error;
  }
};

// OAuth providers
export const continueWithOAuth = async (provider: 'google' | 'linkedin_oidc') => {
  try {
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    });

    if (error) throw error;
  } catch (error: any) {
    toast({
      title: `Failed to sign in with ${provider === 'google' ? 'Google' : 'LinkedIn'}`,
      description: error.message || "An error occurred",
      variant: "destructive"
    });
    throw error;
  }
};

// Logout function
export const logoutUser = async (navigate: ReturnType<typeof useNavigate>) => {
  try {
    await supabase.auth.signOut();
    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
    });
    navigate('/');
    return true;
  } catch (error) {
    console.error("Logout error:", error);
    return false;
  }
};
