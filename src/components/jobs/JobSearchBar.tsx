
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, MapPin } from 'lucide-react';

interface JobSearchBarProps {
  onSearch: (query: string) => void;
  initialQuery?: string;
}

const JobSearchBar: React.FC<JobSearchBarProps> = ({ onSearch, initialQuery = '' }) => {
  const [searchTerm, setSearchTerm] = useState(initialQuery);
  const [location, setLocation] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchTerm);
  };
  
  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-[1fr_1fr_auto] gap-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Job title, keywords, or company"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>
      <div className="relative">
        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="City, state, or 'Remote'"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="pl-10"
        />
      </div>
      <Button type="submit" className="w-full lg:w-auto">Find Jobs</Button>
    </form>
  );
};

export default JobSearchBar;
