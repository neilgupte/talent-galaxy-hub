
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
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) throw error;
  return data;
};

// Fetch profile data from Supabase
export const fetchProfileData = async (userId: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', userId)
    .single();

  // PGRST116 means no rows found, which is acceptable for a new user
  if (error && error.code !== 'PGRST116') throw error;
  return data;
};

// Fetch company data for an employer
export const fetchCompanyData = async (userId: string) => {
  // First get the company_id from company_users
  const { data: companyUserData, error: companyUserError } = await supabase
    .from('company_users')
    .select('company_id')
    .eq('user_id', userId)
    .single();

  if (companyUserError || !companyUserData) return null;

  // Then get the company details
  const { data: company, error: companyError } = await supabase
    .from('companies')
    .select('*')
    .eq('id', companyUserData.company_id)
    .single();

  if (companyError) return null;
  return company;
};

// Refresh the current user session and data
export const refreshUserSession = async (): Promise<AuthState> => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      return {
        ...defaultAuthState,
        isLoading: false
      };
    }
    
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
