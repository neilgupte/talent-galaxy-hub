
import React, { useState, useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import SearchHistory from './SearchHistory';

interface SearchBoxProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  className?: string;
}

const RECENT_SEARCHES_KEY = 'job_search_recent_searches';
const SUGGESTIONS = [
  "Software Engineer",
  "Product Manager",
  "UX Designer",
  "Data Scientist",
  "Marketing Manager",
  "London",
  "Manchester",
  "Remote",
  "New York",
  "Software Engineer London",
  "Remote UX Designer",
  "Marketing Manager Manchester"
];

const SearchBox: React.FC<SearchBoxProps> = ({
  onSearch,
  placeholder = "Search jobs...",
  className = ""
}) => {
  const [query, setQuery] = useState('');
  const [showHistory, setShowHistory] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Load recent searches from localStorage on component mount
  useEffect(() => {
    const savedSearches = localStorage.getItem(RECENT_SEARCHES_KEY);
    if (savedSearches) {
      try {
        const parsedSearches = JSON.parse(savedSearches);
        if (Array.isArray(parsedSearches)) {
          setRecentSearches(parsedSearches);
        }
      } catch (error) {
        console.error('Error parsing recent searches:', error);
      }
    }
  }, []);

  // Filter suggestions based on user input
  useEffect(() => {
    if (query.trim() === '') {
      setFilteredSuggestions([]);
      return;
    }
    
    const lowerQuery = query.toLowerCase();
    const filtered = SUGGESTIONS.filter(suggestion => 
      suggestion.toLowerCase().includes(lowerQuery)
    ).slice(0, 5); // Limit to 5 suggestions
    
    setFilteredSuggestions(filtered);
  }, [query]);

  // Handle clicks outside to close the search history
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchContainerRef.current && 
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setShowHistory(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const saveSearch = (searchTerm: string) => {
    if (!searchTerm.trim()) return;
    
    const newSearches = [
      searchTerm,
      ...recentSearches.filter(s => s !== searchTerm)
    ].slice(0, 10); // Keep only 10 most recent searches
    
    setRecentSearches(newSearches);
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(newSearches));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      saveSearch(query.trim());
      onSearch(query.trim());
      setShowHistory(false);
    }
  };

  const handleSelectSearch = (search: string) => {
    setQuery(search);
    onSearch(search);
    setShowHistory(false);
  };

  const handleClearSearch = (search: string) => {
    const newSearches = recentSearches.filter(s => s !== search);
    setRecentSearches(newSearches);
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(newSearches));
  };

  const handleClearAllSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem(RECENT_SEARCHES_KEY);
  };

  // Intelligent parsing of job title and location
  const parseSearchQuery = (input: string) => {
    const knownLocations = ["london", "manchester", "birmingham", "glasgow", "leeds", "liverpool", "edinburgh", "remote"];
    const words = input.toLowerCase().split(/\s+/);
    
    // Check if any word is a known location
    let location = '';
    let jobTitle = [];
    
    for (const word of words) {
      if (knownLocations.includes(word)) {
        location = word;
      } else {
        jobTitle.push(word);
      }
    }
    
    return {
      jobTitle: jobTitle.join(' '),
      location: location
    };
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    saveSearch(suggestion);
    onSearch(suggestion);
    setShowHistory(false);
  };

  const clearInput = () => {
    setQuery('');
  };

  return (
    <div className={`relative ${className}`} ref={searchContainerRef}>
      <form onSubmit={handleSubmit} className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setShowHistory(true)}
          className="pl-10 pr-10"
        />
        {query && (
          <Button 
            type="button"
            variant="ghost" 
            size="icon"
            onClick={clearInput}
            className="absolute right-8 top-0 h-full"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
        <Button 
          type="submit"
          variant="ghost" 
          size="icon"
          className="absolute right-0 top-0 h-full"
        >
          <Search className="h-4 w-4" />
        </Button>
      </form>
      
      {showHistory && (
        <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border rounded-md shadow-lg overflow-hidden">
          {/* Show filtered suggestions if there are any */}
          {filteredSuggestions.length > 0 && (
            <div className="border-b">
              <div className="px-4 py-2 text-sm font-medium">Suggestions</div>
              <ul>
                {filteredSuggestions.map((suggestion, index) => (
                  <li 
                    key={index}
                    className="px-4 py-2 hover:bg-muted/50 cursor-pointer flex items-center"
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    <Search className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
                    <span className="text-sm">{suggestion}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {/* Always show recent searches */}
          <SearchHistory
            recentSearches={recentSearches}
            onSelectSearch={handleSelectSearch}
            onClearSearch={handleClearSearch}
            onClearAllSearches={handleClearAllSearches}
          />
        </div>
      )}
    </div>
  );
};

export default SearchBox;
