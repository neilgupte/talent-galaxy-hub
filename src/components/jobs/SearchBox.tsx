
import React, { useState, useRef, useEffect } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import SearchHistory from './SearchHistory';

interface SearchBoxProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  className?: string;
}

const RECENT_SEARCHES_KEY = 'job_search_recent_searches';

const SearchBox: React.FC<SearchBoxProps> = ({
  onSearch,
  placeholder = "Search jobs...",
  className = ""
}) => {
  const [query, setQuery] = useState('');
  const [showHistory, setShowHistory] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
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

  return (
    <div className={`relative ${className}`} ref={searchContainerRef}>
      <form onSubmit={handleSubmit} className="relative">
        <Input
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setShowHistory(true)}
          className="pr-12"
        />
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
        <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border rounded-md shadow-lg max-h-60 overflow-hidden">
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
