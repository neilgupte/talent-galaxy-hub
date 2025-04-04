
import React from 'react';
import SmartSearchBox from './SmartSearchBox';

interface SearchBoxProps {
  placeholder?: string;
  onSearch: (query: string, parsedQuery?: { title: string; location: string }) => void;
  className?: string;
  defaultValue?: string;
  required?: boolean;
  showHistory?: boolean;
}

const SearchBox = ({ 
  placeholder = "Search jobs...", 
  onSearch, 
  className = "", 
  defaultValue = "",
  required = true,
  showHistory = true
}: SearchBoxProps) => {
  const handleSearch = (query: string, parsedQuery?: { title: string; location: string }) => {
    if (query.trim()) {
      onSearch(query.trim(), parsedQuery);
    }
  };

  return (
    <SmartSearchBox
      placeholder={placeholder}
      onSearch={handleSearch}
      className={className}
      defaultValue={defaultValue}
      required={required}
      showHistory={showHistory}
      showAutocomplete={true}
    />
  );
};

export default SearchBox;
