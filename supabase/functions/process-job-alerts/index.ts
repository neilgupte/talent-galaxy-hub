import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";
import { Resend } from "npm:resend@4.0.0";

// Initialize Supabase client
const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY") || "";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Initialize Resend client
const resendApiKey = Deno.env.get("RESEND_API_KEY") || "";
const resend = new Resend(resendApiKey);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

type JobAlert = {
  id: string;
  user_id: string;
  keywords: string[];
  location: string | null;
  employment_types: string[] | null;
  job_levels: string[] | null;
  salary_min: number | null;
  salary_max: number | null;
  frequency: "daily_am" | "daily_pm" | "weekly" | "instant";
  is_active: boolean;
  created_at: string;
  last_triggered_at: string | null;
  next_scheduled_at: string | null;
  user_email?: string;
  user_name?: string;
};

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Processing job alerts...");
    
    // Get alerts that are due to be processed based on their frequency and next_scheduled_at
    const now = new Date();
    
    // Process daily morning alerts (between 8-9 AM)
    const currentHour = now.getHours();
    const isDailyAMProcessing = currentHour === 8;
    const isDailyPMProcessing = currentHour === 17;
    const dayOfWeek = now.getDay(); // 0 = Sunday, 6 = Saturday
    const isWeeklyProcessing = dayOfWeek === 1 && currentHour === 9; // Monday 9 AM
    
    let alertsToProcess: JobAlert[] = [];
    
    // Fetch alerts based on frequency
    if (isDailyAMProcessing) {
      const { data, error } = await supabase
        .from('job_alerts')
        .select('*, profiles(email, name)')
        .eq('frequency', 'daily_am')
        .eq('is_active', true);
        
      if (error) throw error;
      alertsToProcess = data.map(row => ({
        ...row,
        user_email: row.profiles?.email,
        user_name: row.profiles?.name
      }));
    } else if (isDailyPMProcessing) {
      const { data, error } = await supabase
        .from('job_alerts')
        .select('*, profiles(email, name)')
        .eq('frequency', 'daily_pm')
        .eq('is_active', true);
        
      if (error) throw error;
      alertsToProcess = data.map(row => ({
        ...row,
        user_email: row.profiles?.email,
        user_name: row.profiles?.name
      }));
    } else if (isWeeklyProcessing) {
      const { data, error } = await supabase
        .from('job_alerts')
        .select('*, profiles(email, name)')
        .eq('frequency', 'weekly')
        .eq('is_active', true);
        
      if (error) throw error;
      alertsToProcess = data.map(row => ({
        ...row,
        user_email: row.profiles?.email,
        user_name: row.profiles?.name
      }));
    }
    
    // Also check for instant alerts for newly posted jobs within the last hour
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000).toISOString();
    const { data: newJobs, error: jobsError } = await supabase
      .from('jobs')
      .select('*')
      .gt('created_at', oneHourAgo);
      
    if (jobsError) throw jobsError;
    
    if (newJobs.length > 0) {
      const { data: instantAlerts, error: alertsError } = await supabase
        .from('job_alerts')
        .select('*, profiles(email, name)')
        .eq('frequency', 'instant')
        .eq('is_active', true);
        
      if (alertsError) throw alertsError;
      
      if (instantAlerts) {
        const formattedInstantAlerts = instantAlerts.map(row => ({
          ...row,
          user_email: row.profiles?.email,
          user_name: row.profiles?.name
        }));
        alertsToProcess = [...alertsToProcess, ...formattedInstantAlerts];
      }
    }
    
    console.log(`Found ${alertsToProcess.length} alerts to process`);
    
    // Process each alert
    for (const alert of alertsToProcess) {
      if (!alert.user_email) continue;
      
      // Find matching jobs based on alert criteria
      let query = supabase.from('jobs').select('*, companies(*)').eq('status', 'active');
      
      // Apply filters
      if (alert.keywords && alert.keywords.length > 0) {
        const keywordFilters = alert.keywords.map(keyword => 
          `title.ilike.%${keyword}%,description.ilike.%${keyword}%`
        ).join(',');
        query = query.or(keywordFilters);
      }
      
      if (alert.location) {
        query = query.ilike('location', `%${alert.location}%`);
      }
      
      if (alert.employment_type && alert.employment_type.length > 0) {
        query = query.in('employment_type', alert.employment_type);
      }
      
      if (alert.job_level && alert.job_level.length > 0) {
        query = query.in('job_level', alert.job_level);
      }
      
      if (alert.salary_min) {
        query = query.gte('salary_min', alert.salary_min);
      }
      
      if (alert.salary_max) {
        query = query.lte('salary_max', alert.salary_max);
      }
      
      // For instant alerts, only check new jobs
      if (alert.frequency === 'instant') {
        query = query.gt('created_at', oneHourAgo);
      } else {
        // For scheduled alerts, check jobs from the last day/week depending on frequency
        let timeFilter = oneHourAgo;
        if (alert.frequency === 'weekly') {
          timeFilter = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
        } else if (alert.frequency === 'daily_am' || alert.frequency === 'daily_pm') {
          timeFilter = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();
        }
        query = query.gt('created_at', timeFilter);
      }
      
      // Get matching jobs
      const { data: matchingJobs, error: matchError } = await query;
      if (matchError) throw matchError;
      
      if (matchingJobs && matchingJobs.length > 0) {
        console.log(`Found ${matchingJobs.length} matching jobs for alert ${alert.id}`);
        
        // Generate email content
        const jobListHtml = matchingJobs.map(job => `
          <div style="padding: 16px; margin-bottom: 16px; border: 1px solid #e4e4e7; border-radius: 8px;">
            <h3 style="margin-top: 0; color: #18181b;">${job.title}</h3>
            <p style="margin: 8px 0; color: #52525b;">
              <strong>${job.companies?.name || 'Company'}</strong> • ${job.location} • ${job.onsite_type}
            </p>
            <p style="margin: 8px 0; color: #71717a;">
              ${job.job_level} • ${job.employment_type} ${job.salary_min && job.salary_max ? `• $${job.salary_min.toLocaleString()}-$${job.salary_max.toLocaleString()}` : ''}
            </p>
            <div style="margin-top: 16px;">
              <a href="${supabaseUrl}/jobs/${job.id}" style="display: inline-block; padding: 8px 16px; margin-right: 8px; background-color: #2563eb; color: white; text-decoration: none; border-radius: 4px;">View Job</a>
              <a href="${supabaseUrl}/apply/${job.id}" style="display: inline-block; padding: 8px 16px; border: 1px solid #2563eb; color: #2563eb; text-decoration: none; border-radius: 4px;">Apply Now</a>
            </div>
          </div>
        `).join('');
        
        // Send email
        await resend.emails.send({
          from: 'TalentHub <no-reply@talenthub.com>',
          to: [alert.user_email],
          subject: `${matchingJobs.length} new job${matchingJobs.length > 1 ? 's' : ''} matching your alert`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h1 style="color: #18181b; margin-top: 32px;">New Jobs Matching Your Alert</h1>
              <p style="color: #52525b; margin-bottom: 24px;">
                Hello ${alert.user_name || 'there'},
                <br><br>
                We found ${matchingJobs.length} new job${matchingJobs.length > 1 ? 's' : ''} matching your alert for 
                "${alert.keywords?.join(', ') || 'All jobs'}" 
                ${alert.location ? `in ${alert.location}` : ''}
              </p>
              
              <div>
                ${jobListHtml}
              </div>
              
              <div style="margin-top: 32px; padding-top: 16px; border-top: 1px solid #e4e4e7; text-align: center;">
                <a href="${supabaseUrl}/profile/alerts" style="color: #2563eb; text-decoration: none;">
                  Manage Your Alerts
                </a>
              </div>
            </div>
          `,
        });
        
        // Update the last triggered date
        await supabase
          .from('job_alerts')
          .update({
            last_triggered_at: now.toISOString(),
            next_scheduled_at: calculateNextScheduledDate(alert.frequency),
          })
          .eq('id', alert.id);
      }
    }
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        processed: alertsToProcess.length 
      }),
      { 
        headers: { 
          ...corsHeaders, 
          "Content-Type": "application/json" 
        },
        status: 200 
      }
    );
  } catch (error) {
    console.error("Error processing job alerts:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { 
          ...corsHeaders, 
          "Content-Type": "application/json" 
        },
        status: 500 
      }
    );
  }
};

// Helper function to calculate the next scheduled date based on frequency
function calculateNextScheduledDate(frequency: string): string {
  const now = new Date();
  
  switch (frequency) {
    case 'daily_am':
      // Next day at 8 AM
      return new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() + 1,
        8, 0, 0
      ).toISOString();
    
    case 'daily_pm':
      // Next day at 5 PM
      return new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() + 1,
        17, 0, 0
      ).toISOString();
    
    case 'weekly':
      // Next Monday at 9 AM
      const daysToMonday = 1 - now.getDay();
      const nextMonday = new Date(now);
      nextMonday.setDate(now.getDate() + (daysToMonday <= 0 ? daysToMonday + 7 : daysToMonday));
      nextMonday.setHours(9, 0, 0, 0);
      return nextMonday.toISOString();
    
    case 'instant':
      // Check every hour
      return new Date(now.getTime() + 60 * 60 * 1000).toISOString();
    
    default:
      return now.toISOString();
  }
}

serve(handler);
