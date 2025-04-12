
/**
 * This file contains type definitions for Supabase tables
 * until the generated types are properly updated.
 */
export type JobAlertTable = {
  id: string;
  user_id: string;
  keywords: string[];
  location: string | null;
  employment_types: string[] | null;
  job_levels: string[] | null;
  salary_min: number | null;
  salary_max: number | null;
  frequency: string;
  is_active: boolean;
  created_at: string;
  last_triggered_at: string | null;
  next_scheduled_at: string | null;
}

export type JobTable = {
  id: string;
  company_id: string;
  title: string;
  description: string;
  location: string;
  locations: string[] | null;
  salary_min: number | null;
  salary_max: number | null;
  employment_type: string;
  onsite_type: string;
  job_level: string | null;
  requirements: string | null;
  status: string;
  is_high_priority: boolean | null;
  is_boosted: boolean | null;
  end_date: string;
  created_at: string;
  updated_at: string;
  country: string | null;
  city: string | null;
  currency: string | null;
  accepts_international_applications: boolean | null;
  visa_sponsorship_available: boolean | null;
}

// Add other missing table types as needed
export type Tables = {
  job_alerts: JobAlertTable;
  jobs: JobTable;
  // Include any other table types that are missing in the generated types
}

export type ExtendedTablesType = {
  Tables: Tables;
}
