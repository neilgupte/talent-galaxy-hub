
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
export const updateCompanyInfo = async (company: Partial<Company>): Promise<boolean> => {
  try {
    // Get current user's ID
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) throw new Error("User not authenticated");
    
    // Check if company already exists
    const { data: existingCompany, error: fetchError } = await supabase
      .from('companies')
      .select('*')
      .eq('id', company.id)
      .single();
    
    if (fetchError && fetchError.code !== 'PGRST116') {
      // PGRST116 means no rows returned, which is fine for new companies
      throw fetchError;
    }
    
    // Convert from frontend model to database model
    const dbCompany: any = {
      name: company.name,
      industry: company.industry,
      description: company.description,
      logo_url: company.logoUrl || company.logo,
      website: company.website,
      size: company.size,
      founded: company.founded,
      location: company.location,
      phone: company.phone,
      email: company.email,
      recruiter_type: company.recruiterType,
      plan_type: company.planType || 'free'
    };
    
    let result;
    
    if (!existingCompany) {
      // Insert new company
      dbCompany.id = company.id || crypto.randomUUID();
      dbCompany.owner_id = user.id;
      
      result = await supabase
        .from('companies')
        .insert(dbCompany);
    } else {
      // Update existing company
      result = await supabase
        .from('companies')
        .update(dbCompany)
        .eq('id', company.id);
    }
    
    if (result.error) throw result.error;

    toast({
      title: "Company updated",
      description: "Company details have been successfully updated",
    });
    
    return true;
  } catch (error: any) {
    console.error("Error updating company:", error);
    toast({
      title: "Failed to update company",
      description: error.message || "An error occurred",
      variant: "destructive"
    });
    throw error;
  }
};
