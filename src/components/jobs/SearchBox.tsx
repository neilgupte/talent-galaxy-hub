
import React, { useState, KeyboardEvent } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

interface SearchBoxProps {
  placeholder?: string;
  onSearch: (query: string) => void;
  className?: string;
  defaultValue?: string;
  required?: boolean;
}

const SearchBox = ({ 
  placeholder = "Search...", 
  onSearch, 
  className = "", 
  defaultValue = "",
  required = true
}: SearchBoxProps) => {
  const [query, setQuery] = useState(defaultValue);

  const handleSearch = () => {
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    }
  };

  return (
    <div className={`relative flex w-full ${className}`}>
      <Input
        type="text"
        placeholder={placeholder}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        className="flex-1 pr-10"
        required={required}
      />
      <Button 
        type="button"
        variant="ghost" 
        size="icon" 
        className="absolute right-0 top-0 h-full"
        onClick={handleSearch}
        aria-label="Search"
      >
        <Search className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default SearchBox;
