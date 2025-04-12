
import React from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Check, Globe } from 'lucide-react';

interface Country {
  code: string;
  name: string;
  flag: string;
}

const countries: Country[] = [
  { code: 'UK', name: 'United Kingdom', flag: '🇬🇧' },
  { code: 'US', name: 'United States', flag: '🇺🇸' },
  { code: 'DE', name: 'Germany', flag: '🇩🇪' },
  { code: 'AU', name: 'Australia', flag: '🇦🇺' },
  { code: 'CA', name: 'Canada', flag: '🇨🇦' },
];

interface CountrySwitcherProps {
  currentCountry?: string;
  onCountryChange?: (country: Country) => void;
}

const CountrySwitcher: React.FC<CountrySwitcherProps> = ({
  currentCountry = 'UK',
  onCountryChange
}) => {
  const selectedCountry = countries.find(c => c.code === currentCountry) || countries[0];
  
  const handleCountrySelect = (country: Country) => {
    if (onCountryChange) {
      onCountryChange(country);
    }
    // For now just show a console message since we're not implementing the full redirect
    console.log(`Would redirect to ${country.code} version of the site`);
  };
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-1 h-9">
          <span className="mr-1">{selectedCountry.flag}</span>
          <span className="hidden md:inline">{selectedCountry.name}</span>
          <span className="md:hidden">{selectedCountry.code}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {countries.map((country) => (
          <DropdownMenuItem
            key={country.code}
            onClick={() => handleCountrySelect(country)}
            className="flex justify-between"
          >
            <span className="flex items-center">
              <span className="mr-2 text-base">{country.flag}</span>
              <span>{country.name}</span>
            </span>
            {country.code === selectedCountry.code && (
              <Check className="h-4 w-4 ml-2" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default CountrySwitcher;
