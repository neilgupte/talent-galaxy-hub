
import { useEffect, useState } from 'react';

// Types for the geolocation API response
interface GeolocationData {
  country: string;
  city: string;
  countryCode: string;
  region: string;
  timezone: string;
  currency?: {
    code: string;
    symbol: string;
  };
}

// Default currency codes by country
const countryCurrencies: Record<string, { code: string; symbol: string }> = {
  US: { code: 'USD', symbol: '$' },
  CA: { code: 'CAD', symbol: 'C$' },
  UK: { code: 'GBP', symbol: '£' },
  GB: { code: 'GBP', symbol: '£' },
  EU: { code: 'EUR', symbol: '€' },
  AU: { code: 'AUD', symbol: 'A$' },
  IN: { code: 'INR', symbol: '₹' },
  JP: { code: 'JPY', symbol: '¥' },
  // Add more countries as needed
};

export const detectUserLocation = async (): Promise<GeolocationData | null> => {
  try {
    // First try to use the free IP Geolocation API
    const response = await fetch('https://ipapi.co/json/');
    if (!response.ok) {
      throw new Error('Failed to fetch geolocation data');
    }
    
    const data = await response.json();
    
    // Add currency information based on country code
    const currency = countryCurrencies[data.country_code] || { code: 'USD', symbol: '$' };
    
    return {
      country: data.country_name,
      city: data.city,
      countryCode: data.country_code,
      region: data.region,
      timezone: data.timezone,
      currency
    };
  } catch (error) {
    console.error('Error detecting location:', error);
    return null;
  }
};

// React hook to use geolocation data
export const useGeolocation = () => {
  const [location, setLocation] = useState<GeolocationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const data = await detectUserLocation();
        setLocation(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to detect location'));
      } finally {
        setLoading(false);
      }
    };

    fetchLocation();
  }, []);

  return { location, loading, error };
};
