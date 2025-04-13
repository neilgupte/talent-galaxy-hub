
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Users } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface DetailsTabProps {
  formData: {
    size: string;
    founded: string;
    location: string;
  };
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSelectChange: (name: string, value: string) => void;
  setActiveTab: (tab: string) => void;
}

const DetailsTab = ({
  formData,
  handleInputChange,
  handleSelectChange,
  setActiveTab
}: DetailsTabProps) => {
  return (
    <>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Company Details
        </CardTitle>
        <CardDescription>
          Add details about your company's industry and structure
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="size" className="block">Company Size<span className="text-red-500 ml-1">*</span></Label>
          <Select 
            value={formData.size} 
            onValueChange={(value) => handleSelectChange('size', value)}
            required
          >
            <SelectTrigger id="size">
              <SelectValue placeholder="Select company size" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0-1 employees">0-1 employees</SelectItem>
              <SelectItem value="2-10 employees">2-10 employees</SelectItem>
              <SelectItem value="11-50 employees">11-50 employees</SelectItem>
              <SelectItem value="51-200 employees">51-200 employees</SelectItem>
              <SelectItem value="201-500 employees">201-500 employees</SelectItem>
              <SelectItem value="501-1000 employees">501-1000 employees</SelectItem>
              <SelectItem value="1001+ employees">1001+ employees</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="founded" className="block">Year Founded</Label>
          <Input
            id="founded"
            name="founded"
            value={formData.founded}
            onChange={handleInputChange}
            placeholder="e.g. 2010"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="location" className="block">Headquarters Location</Label>
          <Input
            id="location"
            name="location"
            value={formData.location}
            onChange={handleInputChange}
            placeholder="e.g. London, UK"
          />
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button type="button" variant="ghost" onClick={() => setActiveTab('basic')}>Previous</Button>
        <Button type="button" onClick={() => setActiveTab('branding')}>Next: Branding</Button>
      </CardFooter>
    </>
  );
};

export default DetailsTab;
