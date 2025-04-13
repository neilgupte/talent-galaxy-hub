
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/auth/useAuth';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Spinner } from '@/components/ui/spinner';

// Import refactored components
import ProfileHeader from '@/components/company/ProfileHeader';
import BasicInfoTab from '@/components/company/BasicInfoTab';
import DetailsTab from '@/components/company/DetailsTab';
import BrandingTab from '@/components/company/BrandingTab';
import ContactTab from '@/components/company/ContactTab';
import CompanyProfilePreview from '@/components/company/CompanyProfilePreview';
import CreateCompanyForm from '@/components/company/CreateCompanyForm';

const CompanyProfilePage = () => {
  const { authState, updateCompany } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');
  const [error, setError] = useState<string | null>(null);
  
  // Industry options
  const industryOptions = [
    "Agriculture", 
    "Banking & Finance",
    "Construction",
    "Education",
    "Energy",
    "Food & Beverage",
    "Healthcare",
    "Information Technology",
    "IT Services and IT Consulting",
    "Manufacturing",
    "Media & Entertainment",
    "Real Estate",
    "Retail",
    "Software Development",
    "Telecommunications",
    "Transportation & Logistics",
    "Travel & Hospitality",
    "Other"
  ];
  
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
        <CreateCompanyForm 
          formData={formData}
          industryOptions={industryOptions}
          error={error}
          isSaving={isSaving}
          handleInputChange={handleInputChange}
          handleRecruiterTypeChange={handleRecruiterTypeChange}
          handleSelectChange={handleSelectChange}
          handleSubmit={handleSubmit}
        />
      </div>
    );
  }
  
  // If we get here, we have a valid company profile to edit
  return (
    <div className="container mx-auto px-4 py-8">
      <ProfileHeader 
        title="Company Profile"
        description="Manage your company information and employer branding"
      />
      
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
              <BasicInfoTab 
                formData={formData}
                industryOptions={industryOptions}
                handleInputChange={handleInputChange}
                handleRecruiterTypeChange={handleRecruiterTypeChange}
                handleSelectChange={handleSelectChange}
                handleWebsiteStatusChange={handleWebsiteStatusChange}
                setActiveTab={setActiveTab}
              />
            </Card>
          </TabsContent>
          
          <TabsContent value="details">
            <Card>
              <DetailsTab 
                formData={formData}
                handleInputChange={handleInputChange}
                handleSelectChange={handleSelectChange}
                setActiveTab={setActiveTab}
              />
            </Card>
          </TabsContent>
          
          <TabsContent value="branding">
            <Card>
              <BrandingTab 
                formData={formData}
                handleInputChange={handleInputChange}
                setActiveTab={setActiveTab}
              />
            </Card>
          </TabsContent>
          
          <TabsContent value="contact">
            <Card>
              <ContactTab 
                formData={formData}
                handleInputChange={handleInputChange}
                setActiveTab={setActiveTab}
                isSaving={isSaving}
              />
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
        <CompanyProfilePreview formData={formData} />
      </div>
    </div>
  );
};

export default CompanyProfilePage;
