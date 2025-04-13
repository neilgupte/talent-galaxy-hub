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
    planType: companyData.plan_type || 'free',
    recruiterType: companyData.recruiter_type || 'internal',
    website: companyData.website || '',
    size: companyData.size || '',
    founded: companyData.founded || '',
    location: companyData.location || '',
    phone: companyData.phone || '',
    email: companyData.email || '',
    hasWebsite: companyData.has_website,
    companyType: companyData.company_type || 'Company'
  };
};

// Login function
export const loginWithEmailPassword = async (email: string, password: string) => {
  try {
    console.log("AuthUtils: Signing in with email/password");
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      console.error("AuthUtils: Login error", error);
      throw error;
    }

    console.log("AuthUtils: Login successful", data.user?.id);
    toast({
      title: "Login successful",
      description: "Welcome back!",
    });
    
    return data;
  } catch (error: any) {
    console.error("AuthUtils: Login failed", error);
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
    console.log("AuthUtils: Registering new user", { email, role });
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
      console.error("AuthUtils: Registration error", error);
      throw error;
    }

    console.log("AuthUtils: Registration successful", data.user?.id);
    toast({
      title: "Registration successful",
      description: "Your account has been created! You can now sign in.",
    });
    
    return data;
  } catch (error: any) {
    console.error("AuthUtils: Registration failed", error);
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
    console.log(`AuthUtils: Signing in with ${provider}`);
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    });

    if (error) {
      console.error(`AuthUtils: ${provider} sign in error`, error);
      throw error;
    }
    
    console.log(`AuthUtils: ${provider} sign in initiated`);
    return data;
  } catch (error: any) {
    console.error(`AuthUtils: ${provider} sign in failed`, error);
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
    console.log("AuthUtils: Signing out");
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      console.error("AuthUtils: Logout error", error);
      throw error;
    }
    
    console.log("AuthUtils: Logout successful");
    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
    });
    navigate('/');
    return true;
  } catch (error) {
    console.error("AuthUtils: Logout error", error);
    return false;
  }
};
