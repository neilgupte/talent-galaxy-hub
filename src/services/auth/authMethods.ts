import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { UserRole } from "@/types";
import { useNavigate } from "react-router-dom";

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
      toast({
        title: "Login failed",
        description: error.message || "An error occurred",
        variant: "destructive"
      });
      throw error;
    }

    console.log("AuthUtils: Login successful", data.user?.id);
    toast({
      title: "Login successful",
      description: "Welcome back!",
    });
    
    return { data, error: null };
  } catch (error: any) {
    console.error("AuthUtils: Login failed", error);
    toast({
      title: "Login failed",
      description: error.message || "An error occurred",
      variant: "destructive"
    });
    return { data: null, error };
  }
};

// Registration function
export const registerUser = async (
  name: string,
  email: string,
  password: string,
  role: UserRole,
  additionalMetadata?: Record<string, any>
) => {
  try {
    console.log("AuthMethods: Registering user", { email, role });
    
    // Step 1: Actual signup with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          role,
          ...additionalMetadata
        },
        emailRedirectTo: `${window.location.origin}/auth/callback`
      }
    });

    if (authError) {
      console.error("Auth registration error:", authError);
      throw authError;
    }

    if (!authData.user) {
      throw new Error("Registration failed: No user returned");
    }

    console.log("AuthMethods: Auth registration successful, creating user record");

    // Step 2: Create a record in our users table
    const { error: dbError } = await supabase
      .from('users')
      .insert({
        id: authData.user.id,
        name,
        email,
        role,
        company_name: additionalMetadata?.companyName || null,
      });

    if (dbError) {
      console.error("Database user creation error:", dbError);
      throw dbError;
    }

    // Step 3: If this is an employer, create company and link it
    if (role === 'employer' && additionalMetadata?.companyName) {
      console.log("AuthMethods: Creating company for employer", additionalMetadata.companyName);
      
      // Create company
      const { data: companyData, error: companyError } = await supabase
        .from('companies')
        .insert({
          name: additionalMetadata.companyName,
          description: '',
          industry: '',
          plan_type: 'free',
          recruiter_type: additionalMetadata.recruiterType || 'internal'
        })
        .select('id')
        .single();

      if (companyError) {
        console.error("Company creation error:", companyError);
        throw companyError;
      }

      // Link user to company
      const { error: linkError } = await supabase
        .from('company_users')
        .insert({
          user_id: authData.user.id,
          company_id: companyData.id,
          role: 'admin'
        });

      if (linkError) {
        console.error("Company-user link error:", linkError);
        throw linkError;
      }
      
      console.log("AuthMethods: Company created and linked to user successfully");
    }

    return { data: authData, error: null };
  } catch (error) {
    console.error("Registration process error:", error);
    return { data: null, error };
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
      toast({
        title: `Failed to sign in with ${provider === 'google' ? 'Google' : 'LinkedIn'}`,
        description: error.message || "An error occurred",
        variant: "destructive"
      });
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
      toast({
        title: "Logout failed",
        description: error.message || "An error occurred",
        variant: "destructive"
      });
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
