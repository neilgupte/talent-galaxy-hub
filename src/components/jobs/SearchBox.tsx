
import React from 'react';
import SmartSearchBox from './SmartSearchBox';

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
  const handleSearch = (query: string) => {
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  return (
    <SmartSearchBox
      placeholder={placeholder}
      onSearch={handleSearch}
      className={className}
      defaultValue={defaultValue}
      required={required}
      showHistory={false}
      showAutocomplete={true}
    />
  );
};

export default SearchBox;
