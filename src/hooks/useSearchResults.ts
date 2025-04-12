
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { JobFilters } from '@/hooks/useJobsQuery';
import { toast } from 'sonner';

// Basic spelling corrections for common job titles
const SPELLING_CORRECTIONS: Record<string, string> = {
  'desinger': 'designer',
  'developr': 'developer',
  'enginee': 'engineer',
  'programer': 'programmer',
  'analist': 'analyst',
  'managr': 'manager',
  'specialst': 'specialist',
};

interface UseSearchResultsProps {
  initialQuery: string;
  initialPage: number;
}

interface UseSearchResultsReturn {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  correctedQuery: string | null;
  setCorrectedQuery: (query: string | null) => void;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  selectedFilters: JobFilters;
  setSelectedFilters: (filters: JobFilters) => void;
  sortBy: 'date' | 'salary';
  setSortBy: (sort: 'date' | 'salary') => void;
  handleSearch: (query: string) => void;
  handleFilterChange: (filters: JobFilters) => void;
  handleSortChange: (sortValue: 'date' | 'salary') => void;
  handlePageChange: (page: number) => void;
  handleUseOriginalSearch: () => void;
}

export const useSearchResults = ({ 
  initialQuery, 
  initialPage 
}: UseSearchResultsProps): UseSearchResultsReturn => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [correctedQuery, setCorrectedQuery] = useState<string | null>(null);
  const [selectedFilters, setSelectedFilters] = useState<JobFilters>({
    employmentTypes: [],
    jobLevels: [],
    onsiteTypes: [],
    salaryRange: [0, 250000],
  });
  const [sortBy, setSortBy] = useState<'date' | 'salary'>('date');
  
  useEffect(() => {
    // Check for possible spelling corrections
    const words = initialQuery.toLowerCase().split(' ');
    const correctedWords = [...words];
    let hasCorrection = false;
    
    words.forEach((word, index) => {
      for (const [misspelled, correction] of Object.entries(SPELLING_CORRECTIONS)) {
        if (word.includes(misspelled)) {
          correctedWords[index] = word.replace(misspelled, correction);
          hasCorrection = true;
          break;
        }
      }
    });
    
    if (hasCorrection) {
      setCorrectedQuery(correctedWords.join(' '));
    } else {
      setCorrectedQuery(null);
    }
  }, [initialQuery]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (searchQuery) params.set('q', searchQuery);
    if (currentPage > 1) params.set('page', currentPage.toString());
    
    navigate({
      pathname: '/search-results',
      search: params.toString()
    }, { replace: true });
  }, [searchQuery, currentPage, navigate]);
  
  const handleSearch = (query: string) => {
    console.log('Search query:', query);
    setSearchQuery(query);
    setCurrentPage(1);
  };
  
  const handleFilterChange = (newFilters: JobFilters) => {
    setSelectedFilters(newFilters);
    setCurrentPage(1);
  };
  
  const handleSortChange = (sortValue: 'date' | 'salary') => {
    setSortBy(sortValue);
  };
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top when page changes
    window.scrollTo(0, 0);
  };

  const handleUseOriginalSearch = () => {
    // User chose to use their original search term
    setCorrectedQuery(null);
  };

  return {
    searchQuery,
    setSearchQuery,
    correctedQuery,
    setCorrectedQuery,
    currentPage,
    setCurrentPage,
    selectedFilters,
    setSelectedFilters,
    sortBy,
    setSortBy,
    handleSearch,
    handleFilterChange,
    handleSortChange,
    handlePageChange,
    handleUseOriginalSearch
  };
};
