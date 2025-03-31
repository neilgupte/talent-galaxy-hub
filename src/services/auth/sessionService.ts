
import { supabase } from "@/integrations/supabase/client";
import { AuthState } from "@/types";
import { mapDatabaseCompanyToModel, mapDatabaseProfileToModel, mapDatabaseUserToModel } from "./authUtils";

export const defaultAuthState: AuthState = {
  user: null,
  profile: null,
  company: null,
  isAuthenticated: false,
  isLoading: true
};

// Fetch user data from Supabase
export const fetchUserData = async (userId: string) => {
  console.log("SessionService: Fetching user data for", userId);
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    console.error("SessionService: Error fetching user data", error);
    throw error;
  }
  
  console.log("SessionService: User data fetched successfully");
  return data;
};

// Fetch profile data from Supabase
export const fetchProfileData = async (userId: string) => {
  console.log("SessionService: Fetching profile data for", userId);
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', userId)
    .single();

  // PGRST116 means no rows found, which is acceptable for a new user
  if (error && error.code !== 'PGRST116') {
    console.error("SessionService: Error fetching profile data", error);
    throw error;
  }
  
  console.log("SessionService: Profile data fetched", !!data);
  return data;
};

// Fetch company data for an employer
export const fetchCompanyData = async (userId: string) => {
  console.log("SessionService: Checking for company data", userId);
  // First get the company_id from company_users
  const { data: companyUserData, error: companyUserError } = await supabase
    .from('company_users')
    .select('company_id')
    .eq('user_id', userId)
    .single();

  if (companyUserError || !companyUserData) {
    console.log("SessionService: No company association found", companyUserError?.message);
    return null;
  }

  console.log("SessionService: Company association found, fetching company details");
  // Then get the company details
  const { data: company, error: companyError } = await supabase
    .from('companies')
    .select('*')
    .eq('id', companyUserData.company_id)
    .single();

  if (companyError) {
    console.error("SessionService: Error fetching company data", companyError);
    return null;
  }
  
  console.log("SessionService: Company data fetched successfully");
  return company;
};

// Refresh the current user session and data
export const refreshUserSession = async (): Promise<AuthState> => {
  try {
    console.log("SessionService: Refreshing user session");
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      console.log("SessionService: No active session found");
      return {
        ...defaultAuthState,
        isLoading: false
      };
    }
    
    console.log("SessionService: Active session found, user ID:", session.user.id);
    
    // Get user data
    const userData = await fetchUserData(session.user.id);
    const profileData = await fetchProfileData(session.user.id);
    
    // Get company data if user is an employer
    let companyData = null;
    if (userData.role === 'employer') {
      companyData = await fetchCompanyData(session.user.id);
    }
    
    // Map the data to our frontend models
    const user = mapDatabaseUserToModel(userData);
    const profile = mapDatabaseProfileToModel(profileData);
    const company = mapDatabaseCompanyToModel(companyData);
    
    console.log("SessionService: Session refresh complete", { 
      userRole: user.role,
      hasProfile: !!profile,
      hasCompany: !!company
    });
    
    return {
      user,
      profile,
      company,
      isAuthenticated: true,
      isLoading: false
    };
  } catch (error) {
    console.error('Error refreshing session:', error);
    return {
      ...defaultAuthState,
      isLoading: false
    };
  }
};
