
// Common types shared across multiple domains

export type UserRole = 'job_seeker' | 'employer' | 'admin';

export type ContactPreference = 'email' | 'phone' | 'both';

export type AlertFrequency = 'daily_am' | 'daily_pm' | 'weekly' | 'instant';

export type JobSeekerStatus = 'not_open' | 'employed_but_open' | 'actively_seeking';

export interface GeolocationInfo {
  country: string;
  city: string;
  countryCode: string;
  currency: {
    code: string;
    symbol: string;
  };
}
