
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Company, Profile } from "@/types";

// Update user profile
export const updateUserProfile = async (profile: Profile): Promise<boolean> => {
  try {
    // Convert from frontend model to database model
    const dbProfile = {
      user_id: profile.userId,
      headline: profile.headline,
      bio: profile.bio,
      location: profile.location,
      current_title: profile.currentTitle,
      skills: profile.skills,
      avatar_url: profile.avatarUrl
    };

    const { error } = await supabase
      .from('profiles')
      .update(dbProfile)
      .eq('user_id', profile.userId);

    if (error) throw error;

    toast({
      title: "Profile updated",
      description: "Your profile has been successfully updated",
    });
    
    return true;
  } catch (error: any) {
    toast({
      title: "Failed to update profile",
      description: error.message || "An error occurred",
      variant: "destructive"
    });
    throw error;
  }
};

// Update company information
export const updateCompanyInfo = async (company: Company): Promise<boolean> => {
  try {
    // Convert from frontend model to database model
    const dbCompany = {
      id: company.id,
      name: company.name,
      industry: company.industry,
      description: company.description,
      logo_url: company.logoUrl,
      plan_type: company.planType
    };

    const { error } = await supabase
      .from('companies')
      .update(dbCompany)
      .eq('id', company.id);

    if (error) throw error;

    toast({
      title: "Company updated",
      description: "Company details have been successfully updated",
    });
    
    return true;
  } catch (error: any) {
    toast({
      title: "Failed to update company",
      description: error.message || "An error occurred",
      variant: "destructive"
    });
    throw error;
  }
};
