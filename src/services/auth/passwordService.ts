
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

// Handle password reset
export const sendPasswordReset = async (
  email: string, 
  resetAttempts: Record<string, {count: number, lastAttempt: number}>,
  setResetAttempts: React.Dispatch<React.SetStateAction<Record<string, {count: number, lastAttempt: number}>>>
): Promise<void> => {
  try {
    // Check for rate limiting
    const now = Date.now();
    const userAttempts = resetAttempts[email] || { count: 0, lastAttempt: 0 };
    
    // If the last attempt was more than an hour ago, reset the counter
    if (now - userAttempts.lastAttempt > 60 * 60 * 1000) {
      userAttempts.count = 0;
    }
    
    // Check if user has exceeded maximum attempts
    if (userAttempts.count >= 5) {
      throw new Error("Too many password reset attempts. Please try again later.");
    }
    
    // Update attempts counter
    setResetAttempts({
      ...resetAttempts,
      [email]: {
        count: userAttempts.count + 1,
        lastAttempt: now
      }
    });
    
    // Send password reset email with correct redirect
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });

    if (error) throw error;

    toast({
      title: "Password reset email sent",
      description: "Please check your email for the password reset link. The link will expire in 60 minutes.",
    });
  } catch (error: any) {
    toast({
      title: "Password reset failed",
      description: error.message || "An error occurred",
      variant: "destructive"
    });
    throw error;
  }
};
