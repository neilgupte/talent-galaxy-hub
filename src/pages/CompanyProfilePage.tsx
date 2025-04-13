
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/auth/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';
import { Building, Users, Globe, MapPin, Phone, Mail, Image, Link, AlertCircle, Calendar, Building2 } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Spinner } from '@/components/ui/spinner';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';

const CompanyProfilePage = () => {
  const { authState, updateCompany } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');
  const [error, setError] = useState<string | null>(null);
  
  // Company profile form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    website: '',
    logo: '',
    industry: '',
    size: '',
    founded: '',
    location: '',
    phone: '',
    email: '',
    recruiterType: 'internal' as 'internal' | 'agency',
    hasWebsite: true,
    companyType: 'Company'
  });
  
  // Update form if company data changes
  useEffect(() => {
    console.log("CompanyProfilePage: Company data updated", authState.company);
    
    if (authState.company) {
      setFormData({
        name: authState.company.name || '',
        description: authState.company.description || '',
        website: authState.company.website || '',
        logo: authState.company.logo || '',
        industry: authState.company.industry || '',
        size: authState.company.size || '',
        founded: authState.company.founded || '',
        location: authState.company.location || '',
        phone: authState.company.phone || '',
        email: authState.company.email || '',
        recruiterType: authState.company.recruiterType || 'internal',
        hasWebsite: authState.company.hasWebsite !== undefined ? authState.company.hasWebsite : true,
        companyType: authState.company.companyType || 'Company'
      });
    }
    
    if (!authState.isLoading) {
      setIsLoading(false);
    }
  }, [authState.company, authState.isLoading]);
  
  // Check if user is authenticated and is an employer
  useEffect(() => {
    console.log("CompanyProfilePage: Auth state", {
      isAuthenticated: authState.isAuthenticated,
      userRole: authState.user?.role,
      hasCompany: !!authState.company,
      isLoading: authState.isLoading
    });
    
    if (authState.isAuthenticated && authState.user?.role !== 'employer') {
      navigate('/dashboard/job-seeker');
    }
  }, [authState, navigate]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRecruiterTypeChange = (value: 'internal' | 'agency') => {
    setFormData(prev => ({
      ...prev,
      recruiterType: value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleWebsiteStatusChange = (checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      hasWebsite: checked,
      website: checked ? prev.website : ''
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    
    try {
      await updateCompany({
        ...formData,
        id: authState.company?.id,
        planType: authState.company?.planType || 'free'
      });
      
      toast({
        title: "Profile updated",
        description: "Your company profile has been successfully updated.",
      });
    } catch (error) {
      console.error("Error updating company profile:", error);
      setError("Failed to update your company profile. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };
  
  if (isLoading || authState.isLoading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col items-center justify-center gap-6">
          <h1 className="text-3xl font-bold">Company Profile</h1>
          <Spinner size="lg" />
          <p className="text-muted-foreground">Loading your company profile...</p>
        </div>
      </div>
    );
  }
  
  if (!authState.isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold mb-6">Company Profile</h1>
        <p className="mb-8">You need to be logged in as an employer to access this page.</p>
        <Button onClick={() => navigate('/employer/auth', { 
          state: { redirectTo: '/company/profile' }
        })}>
          Sign In as Employer
        </Button>
      </div>
    );
  }
  
  if (authState.user?.role !== 'employer') {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold mb-6">Company Profile</h1>
        <p className="mb-8">This page is only available to employer accounts.</p>
        <Button onClick={() => navigate('/dashboard/job-seeker')}>
          Go to Job Seeker Dashboard
        </Button>
      </div>
    );
  }
  
  if (!authState.company) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold mb-6">Company Profile</h1>
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
                <h3 className="font-medium">Recruiter Type</h3>
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
                <Label htmlFor="name">
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
                <Label htmlFor="industry">Industry*</Label>
                <Input 
                  id="industry" 
                  name="industry" 
                  value={formData.industry} 
                  onChange={handleInputChange}
                  placeholder="e.g. IT Services and IT Consulting"
                  required
                />
              </div>
            </div>
            
            <Button type="submit" className="w-full" disabled={isSaving}>
              {isSaving ? <><Spinner size="sm" className="mr-2" /> Creating Profile...</> : 'Create Company Profile'}
            </Button>
          </form>
        </div>
      </div>
    );
  }
  
  // If we get here, we have a valid company profile to edit
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-bold">Company Profile</h1>
          <p className="text-muted-foreground mt-2">
            Manage your company information and employer branding
          </p>
        </div>
        
        <div className="flex gap-4">
          <Button
            variant="outline"
            onClick={() => navigate('/dashboard/employer')}
          >
            Back to Dashboard
          </Button>
          
          <Button
            onClick={() => navigate('/jobs/post')}
          >
            Post a Job
          </Button>
        </div>
      </div>
      
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <form onSubmit={handleSubmit}>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="w-full md:w-auto grid grid-cols-2 md:inline-flex">
            <TabsTrigger value="basic">Basic Information</TabsTrigger>
            <TabsTrigger value="details">Company Details</TabsTrigger>
            <TabsTrigger value="branding">Branding</TabsTrigger>
            <TabsTrigger value="contact">Contact Information</TabsTrigger>
          </TabsList>
          
          <TabsContent value="basic">
            <Card>
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
                  <h3 className="font-medium">Recruiter Type</h3>
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
                  <Label htmlFor="name">
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
                  <Label htmlFor="industry" className="flex items-center">
                    Industry <span className="text-red-500 ml-1">*</span>
                  </Label>
                  <Input
                    id="industry"
                    name="industry"
                    value={formData.industry}
                    onChange={handleInputChange}
                    placeholder="e.g. IT Services and IT Consulting"
                    required
                  />
                </div>
                
                <div className="space-y-4">
                  <div>
                    <Label className="text-base font-medium">Website URL</Label>
                    <div className="flex items-center space-x-2 mt-2 mb-4">
                      <Checkbox 
                        id="has-website"
                        checked={formData.hasWebsite}
                        onCheckedChange={(checked) => handleWebsiteStatusChange(checked as boolean)} 
                      />
                      <Label htmlFor="has-website" className="cursor-pointer">
                        My organization doesn't have a website
                      </Label>
                    </div>
                  </div>
                  
                  {formData.hasWebsite && (
                    <div className="space-y-2">
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
                  <Label htmlFor="companyType" className="flex items-center">
                    Company type <span className="text-red-500 ml-1">*</span>
                  </Label>
                  <Select 
                    value={formData.companyType} 
                    onValueChange={(value) => handleSelectChange('companyType', value)}
                  >
                    <SelectTrigger>
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
            </Card>
          </TabsContent>
          
          <TabsContent value="details">
            <Card>
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
                  <Label htmlFor="size" className="flex items-center">
                    Company Size <span className="text-red-500 ml-1">*</span>
                  </Label>
                  <Select 
                    value={formData.size} 
                    onValueChange={(value) => handleSelectChange('size', value)}
                  >
                    <SelectTrigger>
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
                  <Label htmlFor="founded">Year Founded</Label>
                  <Input
                    id="founded"
                    name="founded"
                    value={formData.founded}
                    onChange={handleInputChange}
                    placeholder="e.g. 2010"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="location">Headquarters Location</Label>
                  <Input
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="e.g. London, UK"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">
                    Company Description
                  </Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Tell potential candidates about your company, culture, and values"
                    rows={6}
                  />
                  <p className="text-sm text-muted-foreground">
                    Briefly describe your company, its mission, and what makes it a great place to work
                  </p>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button type="button" variant="ghost" onClick={() => setActiveTab('basic')}>Previous</Button>
                <Button type="button" onClick={() => setActiveTab('branding')}>Next: Branding</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="branding">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Image className="h-5 w-5" />
                  Branding
                </CardTitle>
                <CardDescription>
                  Add your company logo and website
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="logo">Company Logo URL</Label>
                  <Input
                    id="logo"
                    name="logo"
                    value={formData.logo}
                    onChange={handleInputChange}
                    placeholder="https://example.com/logo.png"
                  />
                  <p className="text-sm text-muted-foreground">Enter a direct link to your company logo image</p>
                </div>
                
                <div className="bg-muted p-4 rounded-md">
                  <h4 className="font-medium mb-2">Logo Preview</h4>
                  <div className="bg-white rounded-md p-6 flex items-center justify-center border">
                    {formData.logo ? (
                      <img src={formData.logo} alt="Company logo" className="max-h-24 max-w-full object-contain" />
                    ) : (
                      <div className="text-center text-muted-foreground">
                        <Building className="h-12 w-12 mx-auto mb-2" />
                        <p>Add a logo URL above to see preview</p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button type="button" variant="ghost" onClick={() => setActiveTab('details')}>Previous</Button>
                <Button type="button" onClick={() => setActiveTab('contact')}>Next: Contact Information</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="contact">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="h-5 w-5" />
                  Contact Information
                </CardTitle>
                <CardDescription>
                  Add contact details for your company
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email">Contact Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="careers@example.com"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">Contact Phone</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+44 (0) 20 7123 4567"
                  />
                </div>
              </CardContent>
              <CardFooter>
                <div className="w-full flex flex-col sm:flex-row gap-4 justify-between">
                  <Button type="button" variant="ghost" onClick={() => setActiveTab('branding')}>Previous</Button>
                  <div className="flex gap-4">
                    <Button type="button" variant="outline" onClick={() => navigate('/dashboard/employer')}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isSaving}>
                      {isSaving ? <><Spinner size="sm" className="mr-2" /> Saving...</> : 'Save Profile'}
                    </Button>
                  </div>
                </div>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
        
        <div className="mt-4 flex justify-end">
          <Button type="submit" disabled={isSaving}>
            {isSaving ? <><Spinner size="sm" className="mr-2" /> Saving...</> : 'Save All Changes'}
          </Button>
        </div>
      </form>
      
      <div className="mt-8 pt-4 border-t">
        <h2 className="text-xl font-semibold mb-4">Your Public Company Profile</h2>
        <Card>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                {formData.logo ? (
                  <img src={formData.logo} alt={formData.name} className="h-16 w-16 object-contain bg-white rounded-md border p-1" />
                ) : (
                  <div className="h-16 w-16 bg-muted rounded-md flex items-center justify-center">
                    <Building className="h-8 w-8 text-muted-foreground" />
                  </div>
                )}
                
                <div>
                  <h3 className="text-xl font-bold">{formData.name || 'Your Company'}</h3>
                  <div className="flex flex-wrap text-muted-foreground text-sm gap-y-1 gap-x-4 mt-1">
                    {formData.industry && (
                      <div className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        <span>{formData.industry}</span>
                      </div>
                    )}
                    
                    {formData.location && (
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        <span>{formData.location}</span>
                      </div>
                    )}
                    
                    {formData.companyType && (
                      <div className="flex items-center gap-1">
                        <Building2 className="h-3 w-3" />
                        <span>{formData.companyType}</span>
                      </div>
                    )}

                    {formData.size && (
                      <div className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        <span>{formData.size}</span>
                      </div>
                    )}
                    
                    {formData.website && (
                      <div className="flex items-center gap-1">
                        <Globe className="h-3 w-3" />
                        <span>{formData.website}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <Button variant="ghost" size="sm">
                Preview Public Profile
              </Button>
            </div>
          </CardHeader>
          
          <CardContent>
            <Separator className="my-4" />
            <div className="prose prose-sm max-w-none">
              <p>{formData.description || 'No company description provided yet.'}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CompanyProfilePage;
