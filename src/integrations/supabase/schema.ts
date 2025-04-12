
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

// Add other missing table types as needed
export type Tables = {
  job_alerts: JobAlertTable;
  // Include any other table types that are missing in the generated types
}

export type ExtendedTablesType = {
  Tables: Tables;
}
