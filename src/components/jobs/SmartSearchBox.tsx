
import React, { useState, useEffect, useRef, KeyboardEvent } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X, Clock, ArrowUp, ArrowDown } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import SearchHistory from './SearchHistory';

interface SmartSearchBoxProps {
  placeholder?: string;
  onSearch?: (query: string, parsedQuery?: { title: string; location: string }) => void;
  className?: string;
  defaultValue?: string;
  required?: boolean;
  showHistory?: boolean;
  showAutocomplete?: boolean;
}

// Sample job titles for autocomplete
const POPULAR_JOB_TITLES = [
  'Software Engineer',
  'Product Manager',
  'UX Designer',
  'Data Scientist',
  'Marketing Manager',
  'Project Manager',
  'Sales Representative',
  'Frontend Developer',
  'Backend Developer',
  'Full Stack Developer',
  'DevOps Engineer',
  'UI Designer',
  'Content Writer',
  'Digital Marketing Specialist',
  'HR Manager'
];

// Sample locations for autocomplete
const POPULAR_LOCATIONS = [
  'Remote',
  'London',
  'New York',
  'San Francisco',
  'Berlin',
  'Tokyo',
  'Paris',
  'Sydney',
  'Toronto',
  'Singapore',
  'Austin',
  'Boston',
  'Chicago',
  'Seattle',
  'Los Angeles'
];

const SmartSearchBox = ({
  placeholder = "Search jobs or locations...",
  onSearch,
  className = "",
  defaultValue = "",
  required = false,
  showHistory = true,
  showAutocomplete = true
}: SmartSearchBoxProps) => {
  const [query, setQuery] = useState(defaultValue);
  const [isFocused, setIsFocused] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);
  
  const searchBoxRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  // Load recent searches from localStorage on component mount
  useEffect(() => {
    const storedSearches = localStorage.getItem('recentSearches');
    if (storedSearches) {
      setRecentSearches(JSON.parse(storedSearches));
    }
  }, []);

  // Generate suggestions based on input
  useEffect(() => {
    if (!query.trim() || !showAutocomplete) {
      setSuggestions([]);
      return;
    }

    const lowerQuery = query.toLowerCase();
    
    // Parse query to detect if it might be a job title, location, or both
    const words = lowerQuery.split(' ');
    
    let matchedSuggestions: string[] = [];
    
    // Check for job titles and locations
    const matchedTitles = POPULAR_JOB_TITLES.filter(title => 
      title.toLowerCase().includes(lowerQuery)
    );
    
    const matchedLocations = POPULAR_LOCATIONS.filter(location => 
      location.toLowerCase().includes(lowerQuery)
    );
    
    // Add job titles
    matchedSuggestions = [...matchedTitles];
    
    // Add locations
    matchedLocations.forEach(location => {
      if (!matchedSuggestions.includes(location)) {
        matchedSuggestions.push(location);
      }
    });
    
    // Add combinations (job titles + locations)
    if (words.length >= 1) {
      // Check if any word might be a location
      const possibleLocations = POPULAR_LOCATIONS.filter(location => 
        words.some(word => location.toLowerCase().includes(word.toLowerCase()))
      );
      
      // Check if any word might be a job title
      const possibleTitles = POPULAR_JOB_TITLES.filter(title => 
        words.some(word => title.toLowerCase().includes(word.toLowerCase()))
      );
      
      // Create combinations
      possibleTitles.forEach(title => {
        possibleLocations.forEach(location => {
          const combination = `${title} ${location}`;
          if (!matchedSuggestions.includes(combination)) {
            matchedSuggestions.push(combination);
          }
        });
      });
    }
    
    // Limit to top 6 suggestions
    setSuggestions(matchedSuggestions.slice(0, 6));
    setSelectedSuggestionIndex(-1);
  }, [query, showAutocomplete]);

  // Handle click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchBoxRef.current && !searchBoxRef.current.contains(event.target as Node)) {
        setIsFocused(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSearch = (searchQuery: string = query) => {
    if (!searchQuery.trim()) return;
    
    // Store in recent searches
    const updatedSearches = [
      searchQuery,
      ...recentSearches.filter(item => item !== searchQuery)
    ].slice(0, 5); // Keep only last 5 searches
    
    setRecentSearches(updatedSearches);
    localStorage.setItem('recentSearches', JSON.stringify(updatedSearches));
    
    // Parse the query into job title and location
    const parsedQuery = parseSearchQuery(searchQuery);
    
    // Call the onSearch prop if provided
    if (onSearch) {
      onSearch(searchQuery, parsedQuery);
    } else {
      // Default behavior - navigate to jobs page with the search query
      navigate(`/jobs?query=${encodeURIComponent(searchQuery)}`);
    }
    
    // Clear the suggestions and reset state
    setSuggestions([]);
    setIsFocused(false);
  };

  // Parse search query to extract job title and location
  const parseSearchQuery = (searchQuery: string) => {
    const lowerQuery = searchQuery.toLowerCase();
    const words = lowerQuery.split(' ');
    
    let title = '';
    let location = '';
    
    // Check if any word matches a known location
    const locationWords: string[] = [];
    const titleWords: string[] = [];
    
    words.forEach(word => {
      if (POPULAR_LOCATIONS.some(loc => loc.toLowerCase() === word)) {
        locationWords.push(word);
      } else {
        titleWords.push(word);
      }
    });
    
    title = titleWords.join(' ');
    location = locationWords.join(' ');
    
    return { title, location };
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedSuggestionIndex >= 0 && selectedSuggestionIndex < suggestions.length) {
        // Use the selected suggestion
        setQuery(suggestions[selectedSuggestionIndex]);
        handleSearch(suggestions[selectedSuggestionIndex]);
      } else {
        // Use the current input value
        handleSearch();
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedSuggestionIndex(prev => 
        prev < suggestions.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedSuggestionIndex(prev => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === 'Escape') {
      setIsFocused(false);
      setSuggestions([]);
    }
  };

  const handleClearSearch = () => {
    setQuery('');
    inputRef.current?.focus();
  };

  const handleClearAllSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('recentSearches');
  };

  const handleClearRecentSearch = (search: string) => {
    const updatedSearches = recentSearches.filter(item => item !== search);
    setRecentSearches(updatedSearches);
    localStorage.setItem('recentSearches', JSON.stringify(updatedSearches));
  };

  const handleSelectRecentSearch = (search: string) => {
    setQuery(search);
    handleSearch(search);
  };

  return (
    <div ref={searchBoxRef} className={`relative ${className}`}>
      <div className="relative">
        <Input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          className="pr-16"
          required={required}
          aria-label="Search"
        />
        
        {query && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-8 top-0 h-full"
            onClick={handleClearSearch}
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
        
        <Button 
          type="button"
          variant="ghost" 
          size="icon" 
          className="absolute right-0 top-0 h-full"
          onClick={() => handleSearch()}
          aria-label="Search"
        >
          <Search className="h-4 w-4" />
        </Button>
      </div>
      
      {/* Suggestions and recent searches dropdown */}
      {isFocused && (showHistory || suggestions.length > 0) && (
        <div className="absolute z-50 mt-1 w-full bg-background border rounded-md shadow-lg overflow-hidden">
          {suggestions.length > 0 && (
            <div className="max-h-60 overflow-auto">
              <h3 className="text-sm font-medium px-4 py-2 border-b">Suggestions</h3>
              <ul>
                {suggestions.map((suggestion, index) => (
                  <li
                    key={index}
                    className={`px-4 py-2 cursor-pointer flex items-center ${
                      index === selectedSuggestionIndex ? 'bg-muted' : 'hover:bg-muted/50'
                    }`}
                    onClick={() => {
                      setQuery(suggestion);
                      handleSearch(suggestion);
                    }}
                  >
                    <Search className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
                    <span className="text-sm">{suggestion}</span>
                    {index === selectedSuggestionIndex && (
                      <div className="ml-auto flex items-center text-xs text-muted-foreground">
                        Enter <ArrowUp className="h-3 w-3 mx-1" /> <ArrowDown className="h-3 w-3" />
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {showHistory && recentSearches.length > 0 && (
            <SearchHistory
              recentSearches={recentSearches}
              onSelectSearch={handleSelectRecentSearch}
              onClearSearch={handleClearRecentSearch}
              onClearAllSearches={handleClearAllSearches}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default SmartSearchBox;
