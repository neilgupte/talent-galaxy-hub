
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Building } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';

interface BasicInfoTabProps {
  formData: {
    name: string;
    industry: string;
    website: string;
    recruiterType: 'internal' | 'agency';
    hasWebsite: boolean;
    companyType: string;
  };
  industryOptions: string[];
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleRecruiterTypeChange: (value: 'internal' | 'agency') => void;
  handleSelectChange: (name: string, value: string) => void;
  handleWebsiteStatusChange: (checked: boolean) => void;
  setActiveTab: (tab: string) => void;
}

const BasicInfoTab = ({
  formData,
  industryOptions,
  handleInputChange,
  handleRecruiterTypeChange,
  handleSelectChange,
  handleWebsiteStatusChange,
  setActiveTab
}: BasicInfoTabProps) => {
  return (
    <>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building className="h-5 w-5" />
          Basic Information
        </CardTitle>
        <CardDescription>
          Add your company name and primary information
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <Label className="block text-base">Recruiter Type</Label>
          <RadioGroup 
            value={formData.recruiterType} 
            onValueChange={(value) => handleRecruiterTypeChange(value as 'internal' | 'agency')}
            className="space-y-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="internal" id="profile-internal" />
              <Label htmlFor="profile-internal" className="cursor-pointer">
                Internal Recruiter (hiring for my own company)
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="agency" id="profile-agency" />
              <Label htmlFor="profile-agency" className="cursor-pointer">
                External Recruitment Agency (hiring for multiple clients)
              </Label>
            </div>
          </RadioGroup>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="name" className="block">
            {formData.recruiterType === 'internal' ? 'Company Name *' : 'Agency Name *'}
          </Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder={formData.recruiterType === 'internal' ? 
              "Enter your company name" : 
              "Enter your recruitment agency name"}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="industry" className="block">Industry<span className="text-red-500 ml-1">*</span></Label>
          <Select 
            value={formData.industry} 
            onValueChange={(value) => handleSelectChange('industry', value)}
            required
          >
            <SelectTrigger id="industry">
              <SelectValue placeholder="Select industry" />
            </SelectTrigger>
            <SelectContent>
              {industryOptions.map((industry) => (
                <SelectItem key={industry} value={industry}>{industry}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-4">
          <div>
            <Label className="text-base block">Website URL</Label>
            <div className="flex items-center space-x-2 mt-2 mb-4">
              <Checkbox 
                id="has-website"
                checked={formData.hasWebsite}
                onCheckedChange={(checked) => handleWebsiteStatusChange(checked as boolean)} 
              />
              <Label htmlFor="has-website" className="cursor-pointer">
                My organization has a website
              </Label>
            </div>
          </div>
          
          {formData.hasWebsite && (
            <div className="space-y-2">
              <Label htmlFor="website" className="block">Website URL</Label>
              <Input
                id="website"
                name="website"
                value={formData.website}
                onChange={handleInputChange}
                placeholder="Add your website homepage (www.example.com)"
              />
            </div>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="companyType" className="block">Company type<span className="text-red-500 ml-1">*</span></Label>
          <Select 
            value={formData.companyType} 
            onValueChange={(value) => handleSelectChange('companyType', value)}
            required
          >
            <SelectTrigger id="companyType">
              <SelectValue placeholder="Select company type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Company">Company</SelectItem>
              <SelectItem value="Self Employed">Self Employed</SelectItem>
              <SelectItem value="Partnership">Partnership</SelectItem>
              <SelectItem value="Nonprofit">Nonprofit</SelectItem>
              <SelectItem value="Government Agency">Government Agency</SelectItem>
              <SelectItem value="School/University">School/University</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="ghost">Cancel</Button>
        <Button type="button" onClick={() => setActiveTab('details')}>Next: Company Details</Button>
      </CardFooter>
    </>
  );
};

export default BasicInfoTab;
