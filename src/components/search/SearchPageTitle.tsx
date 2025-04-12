
import React from 'react';

interface SearchPageTitleProps {
  searchQuery: string;
  correctedQuery: string | null;
  totalCount?: number;
}

const SearchPageTitle: React.FC<SearchPageTitleProps> = ({ 
  searchQuery, 
  correctedQuery,
  totalCount = 0
}) => {
  if (!searchQuery) {
    return <h1 className="text-3xl font-bold mb-8">Browse Jobs</h1>;
  }

  return (
    <div className="mb-6">
      <h1 className="text-3xl font-bold mb-2">
        {totalCount !== undefined ? totalCount : 0} {totalCount === 1 ? 'job' : 'jobs'} found for "{searchQuery}"
      </h1>
      {correctedQuery && (
        <p className="text-muted-foreground">
          Showing results for "{correctedQuery}" instead
        </p>
      )}
    </div>
  );
};

export default SearchPageTitle;
