
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';

interface CreateCompanyFormProps {
  formData: {
    name: string;
    industry: string;
    recruiterType: 'internal' | 'agency';
    size: string;
    phone: string;
    companyType: string;
  };
  industryOptions: string[];
  error: string | null;
  isSaving: boolean;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleRecruiterTypeChange: (value: 'internal' | 'agency') => void;
  handleSelectChange: (name: string, value: string) => void;
  handleSubmit: (e: React.FormEvent) => void;
}

const CreateCompanyForm = ({
  formData,
  industryOptions,
  error,
  isSaving,
  handleInputChange,
  handleRecruiterTypeChange,
  handleSelectChange,
  handleSubmit
}: CreateCompanyFormProps) => {
  return (
    <div className="max-w-md mx-auto bg-muted p-6 rounded-lg">
      <p className="mb-8">You don't have a company profile yet. Let's create one!</p>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <div className="space-y-4">
            <Label className="block text-base">Recruiter Type</Label>
            <RadioGroup 
              value={formData.recruiterType} 
              onValueChange={(value) => handleRecruiterTypeChange(value as 'internal' | 'agency')}
              className="space-y-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="internal" id="internal" />
                <Label htmlFor="internal" className="cursor-pointer">
                  Internal Recruiter (hiring for my own company)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="agency" id="agency" />
                <Label htmlFor="agency" className="cursor-pointer">
                  External Recruitment Agency (hiring for multiple clients)
                </Label>
              </div>
            </RadioGroup>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="name" className="block">
              {formData.recruiterType === 'internal' ? 'Company Name*' : 'Agency Name*'}
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
            <Label htmlFor="phone" className="block">Phone Number</Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="Enter company phone number"
            />
          </div>
        </div>
        
        <Button type="submit" className="w-full" disabled={isSaving}>
          {isSaving ? <><Spinner size="sm" className="mr-2" /> Creating Profile...</> : 'Create Company Profile'}
        </Button>
      </form>
    </div>
  );
};

export default CreateCompanyForm;
