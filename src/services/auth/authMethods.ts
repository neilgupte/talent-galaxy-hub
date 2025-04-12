
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
      toast({
        title: "Registration failed",
        description: error.message || "An error occurred",
        variant: "destructive"
      });
      throw error;
    }

    console.log("AuthUtils: Registration successful", data.user?.id);
    toast({
      title: "Registration successful",
      description: "Your account has been created! You can now sign in.",
    });
    
    return { data, error: null };
  } catch (error: any) {
    console.error("AuthUtils: Registration failed", error);
    toast({
      title: "Registration failed",
      description: error.message || "An error occurred",
      variant: "destructive"
    });
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
