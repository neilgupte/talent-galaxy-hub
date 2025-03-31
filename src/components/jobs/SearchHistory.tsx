
import React from 'react';
import { Button } from '@/components/ui/button';
import { Clock, X, Search, Trash2 } from 'lucide-react';

interface SearchHistoryProps {
  recentSearches: string[];
  onSelectSearch: (search: string) => void;
  onClearSearch: (search: string) => void;
  onClearAllSearches: () => void;
  className?: string;
}

const SearchHistory: React.FC<SearchHistoryProps> = ({
  recentSearches,
  onSelectSearch,
  onClearSearch,
  onClearAllSearches,
  className = ''
}) => {
  if (recentSearches.length === 0) {
    return (
      <div className={`py-3 px-4 text-sm text-muted-foreground ${className}`}>
        No recent searches
      </div>
    );
  }

  return (
    <div className={`w-full ${className}`}>
      <div className="flex items-center justify-between px-4 py-2 border-b">
        <h3 className="text-sm font-medium">Recent Searches</h3>
        <Button
          variant="ghost"
          size="sm"
          className="text-xs h-7 px-2 hover:bg-transparent hover:text-destructive"
          onClick={onClearAllSearches}
        >
          <Trash2 className="h-3.5 w-3.5 mr-1" />
          Clear All
        </Button>
      </div>

      <ul className="max-h-60 overflow-auto">
        {recentSearches.map((search, index) => (
          <li
            key={index}
            className="flex items-center justify-between py-2 px-4 hover:bg-muted/50 cursor-pointer"
          >
            <button
              className="flex items-center w-full text-left"
              onClick={() => onSelectSearch(search)}
            >
              <Clock className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
              <span className="text-sm">{search}</span>
            </button>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 opacity-50 hover:opacity-100"
              onClick={(e) => {
                e.stopPropagation();
                onClearSearch(search);
              }}
            >
              <X className="h-3.5 w-3.5" />
              <span className="sr-only">Remove</span>
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SearchHistory;
