
// Common types shared across multiple domains

export type UserRole = 'job_seeker' | 'employer' | 'admin';

export type ContactPreference = 'email' | 'phone' | 'both';

export type AlertFrequency = 'daily_am' | 'daily_pm' | 'weekly' | 'instant';

export interface GeolocationInfo {
  country: string;
  city: string;
  countryCode: string;
  currency: {
    code: string;
    symbol: string;
  };
}
