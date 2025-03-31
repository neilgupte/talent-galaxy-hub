
import React from 'react';
import SmartSearchBox from './SmartSearchBox';

interface SearchBoxProps {
  placeholder?: string;
  onSearch: (query: string, parsedQuery?: { title: string; location: string }) => void;
  className?: string;
  defaultValue?: string;
  required?: boolean;
}

const SearchBox = ({ 
  placeholder = "Search jobs...", 
  onSearch, 
  className = "", 
  defaultValue = "",
  required = true
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
      showHistory={true}
      showAutocomplete={true}
    />
  );
};

export default SearchBox;
