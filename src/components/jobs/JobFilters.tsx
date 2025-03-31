
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { X, SlidersHorizontal } from 'lucide-react';

interface JobFiltersProps {
  filters: {
    employmentTypes: string[];
    jobLevels: string[];
    onsiteTypes: string[];
    salaryRange: [number, number];
  };
  onChange: (filters: JobFiltersProps['filters']) => void;
}

const JobFilters: React.FC<JobFiltersProps> = ({ filters, onChange }) => {
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  
  const handleEmploymentTypeChange = (value: string) => {
    const newTypes = filters.employmentTypes.includes(value)
      ? filters.employmentTypes.filter(type => type !== value)
      : [...filters.employmentTypes, value];
    
    onChange({
      ...filters,
      employmentTypes: newTypes
    });
  };
  
  const handleJobLevelChange = (value: string) => {
    const newLevels = filters.jobLevels.includes(value)
      ? filters.jobLevels.filter(level => level !== value)
      : [...filters.jobLevels, value];
    
    onChange({
      ...filters,
      jobLevels: newLevels
    });
  };
  
  const handleOnsiteTypeChange = (value: string) => {
    const newTypes = filters.onsiteTypes.includes(value)
      ? filters.onsiteTypes.filter(type => type !== value)
      : [...filters.onsiteTypes, value];
    
    onChange({
      ...filters,
      onsiteTypes: newTypes
    });
  };
  
  const handleSalaryChange = (values: number[]) => {
    onChange({
      ...filters,
      salaryRange: [values[0], values[1]]
    });
  };
  
  const clearAllFilters = () => {
    onChange({
      employmentTypes: [],
      jobLevels: [],
      onsiteTypes: [],
      salaryRange: [0, 250000]
    });
  };
  
  const hasActiveFilters = 
    filters.employmentTypes.length > 0 || 
    filters.jobLevels.length > 0 || 
    filters.onsiteTypes.length > 0 || 
    filters.salaryRange[0] > 0 || 
    filters.salaryRange[1] < 250000;
  
  const FiltersContent = () => (
    <div className="border rounded-lg p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Filters</h3>
        {hasActiveFilters && (
          <Button variant="ghost" className="h-auto p-0 text-sm" onClick={clearAllFilters}>
            Clear All
          </Button>
        )}
      </div>
      
      <Accordion type="multiple" className="w-full">
        <AccordionItem value="salary">
          <AccordionTrigger>Salary Range</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4 py-2">
              <div className="flex justify-between text-sm">
                <span>${filters.salaryRange[0].toLocaleString()}</span>
                <span>${filters.salaryRange[1].toLocaleString()}</span>
              </div>
              <Slider
                max={250000}
                min={0}
                step={5000}
                value={[filters.salaryRange[0], filters.salaryRange[1]]}
                onValueChange={handleSalaryChange}
              />
            </div>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="employment">
          <AccordionTrigger>Employment Type</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="full_time"
                  checked={filters.employmentTypes.includes('full_time')}
                  onCheckedChange={() => handleEmploymentTypeChange('full_time')}
                />
                <Label htmlFor="full_time">Full Time</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="part_time"
                  checked={filters.employmentTypes.includes('part_time')}
                  onCheckedChange={() => handleEmploymentTypeChange('part_time')}
                />
                <Label htmlFor="part_time">Part Time</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="contract"
                  checked={filters.employmentTypes.includes('contract')}
                  onCheckedChange={() => handleEmploymentTypeChange('contract')}
                />
                <Label htmlFor="contract">Contract</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="temporary"
                  checked={filters.employmentTypes.includes('temporary')}
                  onCheckedChange={() => handleEmploymentTypeChange('temporary')}
                />
                <Label htmlFor="temporary">Temporary</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="internship"
                  checked={filters.employmentTypes.includes('internship')}
                  onCheckedChange={() => handleEmploymentTypeChange('internship')}
                />
                <Label htmlFor="internship">Internship</Label>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="level">
          <AccordionTrigger>Experience Level</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="entry"
                  checked={filters.jobLevels.includes('entry')}
                  onCheckedChange={() => handleJobLevelChange('entry')}
                />
                <Label htmlFor="entry">Entry Level</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="junior"
                  checked={filters.jobLevels.includes('junior')}
                  onCheckedChange={() => handleJobLevelChange('junior')}
                />
                <Label htmlFor="junior">Junior</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="mid"
                  checked={filters.jobLevels.includes('mid')}
                  onCheckedChange={() => handleJobLevelChange('mid')}
                />
                <Label htmlFor="mid">Mid Level</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="senior"
                  checked={filters.jobLevels.includes('senior')}
                  onCheckedChange={() => handleJobLevelChange('senior')}
                />
                <Label htmlFor="senior">Senior</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="executive"
                  checked={filters.jobLevels.includes('executive')}
                  onCheckedChange={() => handleJobLevelChange('executive')}
                />
                <Label htmlFor="executive">Executive</Label>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="location">
          <AccordionTrigger>Location Type</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="onsite"
                  checked={filters.onsiteTypes.includes('onsite')}
                  onCheckedChange={() => handleOnsiteTypeChange('onsite')}
                />
                <Label htmlFor="onsite">Onsite</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="hybrid"
                  checked={filters.onsiteTypes.includes('hybrid')}
                  onCheckedChange={() => handleOnsiteTypeChange('hybrid')}
                />
                <Label htmlFor="hybrid">Hybrid</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remote"
                  checked={filters.onsiteTypes.includes('remote')}
                  onCheckedChange={() => handleOnsiteTypeChange('remote')}
                />
                <Label htmlFor="remote">Remote</Label>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
  
  return (
    <>
      {/* Mobile Filters Toggle */}
      <div className="lg:hidden mb-4">
        <Button
          variant="outline"
          className="w-full"
          onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
        >
          <SlidersHorizontal className="mr-2 h-4 w-4" />
          {isMobileFiltersOpen ? 'Hide Filters' : 'Show Filters'}
        </Button>
      </div>
      
      {/* Filters - Show on desktop or when toggle enabled on mobile */}
      {(isMobileFiltersOpen || window.innerWidth >= 1024) && (
        <div className="lg:block">
          <FiltersContent />
        </div>
      )}
    </>
  );
};

export default JobFilters;
