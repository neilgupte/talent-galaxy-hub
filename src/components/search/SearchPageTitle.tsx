import React from 'react';

interface SearchPageTitleProps {
  searchQuery: string;
  correctedQuery: string | null;
}

const SearchPageTitle: React.FC<SearchPageTitleProps> = ({ searchQuery, correctedQuery }) => {
  const formatPageTitle = () => {
    // If we have a corrected query and we're displaying it, use that for the title
    const displayQuery = correctedQuery || searchQuery;
    
    if (!displayQuery) return "Job Search Results";
    
    // Check if query already contains the word "jobs" (case insensitive)
    const containsJobsWord = displayQuery.toLowerCase().includes("jobs");
    
    if (containsJobsWord) {
      // If it already has "jobs", just return the query
      return displayQuery.charAt(0).toUpperCase() + displayQuery.slice(1);
    } else {
      // Otherwise, append "Jobs" to the query
      return `${displayQuery.charAt(0).toUpperCase() + displayQuery.slice(1)} Jobs`;
    }
  };

  return <h1 className="text-3xl font-bold mb-2">{formatPageTitle()}</h1>;
};

export default SearchPageTitle;
