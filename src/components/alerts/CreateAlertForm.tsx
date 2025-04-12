
import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectGroup, 
  SelectItem, 
  SelectLabel, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { X, Info } from 'lucide-react';
import { AlertFrequency, JobAlert, JobEmploymentType, JobLevel } from '@/types';

interface CreateAlertFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
  isSubmitting: boolean;
  initialData?: Partial<JobAlert>;
  isEditing?: boolean;
}

const frequencyOptions = [
  { value: 'daily_am', label: 'Daily (Morning)' },
  { value: 'daily_pm', label: 'Daily (Evening)' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'instant', label: 'Instantly' },
];

const employmentTypeOptions = [
  { value: 'full_time', label: 'Full-time' },
  { value: 'part_time', label: 'Part-time' },
  { value: 'contract', label: 'Contract' },
  { value: 'temporary', label: 'Temporary' },
  { value: 'internship', label: 'Internship' },
  { value: 'job_share', label: 'Job share' },
];

const jobLevelOptions = [
  { value: 'entry', label: 'Entry-level' },
  { value: 'junior', label: 'Junior' },
  { value: 'mid', label: 'Mid-level' },
  { value: 'senior', label: 'Senior' },
  { value: 'executive', label: 'Executive' },
];

const CreateAlertForm: React.FC<CreateAlertFormProps> = ({ 
  onSubmit, 
  onCancel, 
  isSubmitting, 
  initialData = {}, 
  isEditing = false 
}) => {
  const [keywords, setKeywords] = useState<string[]>(initialData.keywords || []);
  const [currentKeyword, setCurrentKeyword] = useState('');
  const [salaryRange, setSalaryRange] = useState<[number, number]>([
    initialData.salaryMin || 0,
    initialData.salaryMax || 250000
  ]);
  
  const form = useForm({
    defaultValues: {
      location: initialData.location || '',
      employmentTypes: initialData.employmentTypes || [],
      jobLevels: initialData.jobLevels || [],
      frequency: initialData.frequency || 'weekly',
      isActive: initialData.isActive !== undefined ? initialData.isActive : true,
    },
  });
  
  const addKeyword = () => {
    if (currentKeyword.trim() && !keywords.includes(currentKeyword.trim())) {
      setKeywords([...keywords, currentKeyword.trim()]);
      setCurrentKeyword('');
    }
  };
  
  const removeKeyword = (keywordToRemove: string) => {
    setKeywords(keywords.filter(k => k !== keywordToRemove));
  };
  
  const handleSubmit = (formData: any) => {
    onSubmit({
      ...formData,
      keywords,
      salaryMin: salaryRange[0] > 0 ? salaryRange[0] : null,
      salaryMax: salaryRange[1] < 250000 ? salaryRange[1] : null,
    });
  };
  
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>{isEditing ? 'Edit Job Alert' : 'Create Job Alert'}</CardTitle>
        <CardDescription>
          Get notified when new jobs matching your criteria are posted
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <div className="space-y-6">
              {/* Keywords */}
              <div className="space-y-2">
                <Label>Keywords</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Add job title or keyword"
                    value={currentKeyword}
                    onChange={(e) => setCurrentKeyword(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addKeyword();
                      }
                    }}
                  />
                  <Button type="button" onClick={addKeyword}>Add</Button>
                </div>
                <FormDescription>
                  Add job titles or keywords you're interested in
                </FormDescription>
                
                {keywords.length > 0 ? (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {keywords.map((keyword) => (
                      <Badge 
                        key={keyword} 
                        className="flex items-center gap-1 py-1.5"
                      >
                        {keyword}
                        <button 
                          type="button" 
                          onClick={() => removeKeyword(keyword)}
                          className="ml-1 rounded-full hover:bg-primary/20 focus:outline-none"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground mt-2">
                    No keywords added yet
                  </p>
                )}
              </div>
              
              {/* Location */}
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input placeholder="City, country, or 'Remote'" {...field} />
                    </FormControl>
                    <FormDescription>
                      Leave empty to receive alerts for jobs in all locations
                    </FormDescription>
                  </FormItem>
                )}
              />
              
              {/* Employment Type */}
              <FormField
                control={form.control}
                name="employmentTypes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Employment Type</FormLabel>
                    <FormControl>
                      <ToggleGroup 
                        type="multiple" 
                        className="flex flex-wrap justify-start"
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        {employmentTypeOptions.map(option => (
                          <ToggleGroupItem 
                            key={option.value} 
                            value={option.value}
                            className="mr-2 mb-2"
                          >
                            {option.label}
                          </ToggleGroupItem>
                        ))}
                      </ToggleGroup>
                    </FormControl>
                    <FormDescription>
                      Select multiple or none to receive alerts for all employment types
                    </FormDescription>
                  </FormItem>
                )}
              />
              
              {/* Job Level */}
              <FormField
                control={form.control}
                name="jobLevels"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Job Level</FormLabel>
                    <FormControl>
                      <ToggleGroup 
                        type="multiple" 
                        className="flex flex-wrap justify-start"
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        {jobLevelOptions.map(option => (
                          <ToggleGroupItem 
                            key={option.value} 
                            value={option.value}
                            className="mr-2 mb-2"
                          >
                            {option.label}
                          </ToggleGroupItem>
                        ))}
                      </ToggleGroup>
                    </FormControl>
                    <FormDescription>
                      Select multiple or none to receive alerts for all job levels
                    </FormDescription>
                  </FormItem>
                )}
              />
              
              {/* Salary Range */}
              <div className="space-y-2">
                <Label>Salary Range</Label>
                <div className="pt-4 px-2">
                  <Slider
                    value={salaryRange}
                    min={0}
                    max={250000}
                    step={1000}
                    onValueChange={(value: [number, number]) => setSalaryRange(value)}
                  />
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-sm">${salaryRange[0].toLocaleString()}</span>
                  <span className="text-sm">${salaryRange[1].toLocaleString()}</span>
                </div>
                <FormDescription>
                  Set minimum and maximum salary range or leave at extremes to receive alerts for all salary ranges
                </FormDescription>
              </div>
              
              {/* Alert Frequency */}
              <FormField
                control={form.control}
                name="frequency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Frequency</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select frequency" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Email Frequency</SelectLabel>
                          {frequencyOptions.map(option => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      How often would you like to receive job alert emails?
                    </FormDescription>
                  </FormItem>
                )}
              />
              
              {/* Status (Active/Paused) */}
              {isEditing && (
                <FormField
                  control={form.control}
                  name="isActive"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base mb-0">
                          {field.value ? 'Alert is active' : 'Alert is paused'}
                        </FormLabel>
                        <FormDescription>
                          {field.value 
                            ? 'You will receive emails for this alert based on your frequency settings' 
                            : 'You will not receive any emails for this alert'
                          }
                        </FormDescription>
                      </div>
                      <FormControl>
                        <ToggleGroup 
                          type="single" 
                          value={field.value ? 'active' : 'paused'}
                          onValueChange={value => field.onChange(value === 'active')}
                        >
                          <ToggleGroupItem value="active">Active</ToggleGroupItem>
                          <ToggleGroupItem value="paused">Paused</ToggleGroupItem>
                        </ToggleGroup>
                      </FormControl>
                    </FormItem>
                  )}
                />
              )}
            </div>
            
            <div className="mt-6 flex justify-end gap-3">
              <Button 
                type="button" 
                variant="outline" 
                onClick={onCancel}
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                disabled={isSubmitting || keywords.length === 0}
              >
                {isSubmitting ? 'Saving...' : isEditing ? 'Update Alert' : 'Create Alert'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default CreateAlertForm;
