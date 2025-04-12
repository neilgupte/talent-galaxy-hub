
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
import { Building, Users, Globe, MapPin, Phone, Mail, Image, Link } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

const CompanyProfilePage = () => {
  const { authState, updateCompany } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');
  
  // Company profile form state
  const [formData, setFormData] = useState({
    name: authState.company?.name || '',
    description: authState.company?.description || '',
    website: authState.company?.website || '',
    logo: authState.company?.logo || '',
    industry: authState.company?.industry || '',
    size: authState.company?.size || '',
    founded: authState.company?.founded || '',
    location: authState.company?.location || '',
    phone: authState.company?.phone || '',
    email: authState.company?.email || ''
  });
  
  // Update form if company data changes
  useEffect(() => {
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
        email: authState.company.email || ''
      });
    }
  }, [authState.company]);
  
  // Check if user is authenticated and is an employer
  useEffect(() => {
    console.log("CompanyProfilePage: Auth state", {
      isAuthenticated: authState.isAuthenticated,
      userRole: authState.user?.role,
      hasCompany: !!authState.company
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
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await updateCompany(formData);
      
      toast({
        title: "Profile updated",
        description: "Your company profile has been successfully updated.",
      });
    } catch (error) {
      console.error("Error updating company profile:", error);
      
      toast({
        title: "Update failed",
        description: "Failed to update your company profile. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  if (authState.isLoading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold mb-6">Company Profile</h1>
        <p>Loading...</p>
      </div>
    );
  }
  
  if (!authState.isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold mb-6">Company Profile</h1>
        <p className="mb-8">You need to be logged in as an employer to access this page.</p>
        <Button onClick={() => navigate('/employer/auth')}>
          Sign In as Employer
        </Button>
      </div>
    );
  }
  
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
                  Add your company name and primary description
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Company Name *</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter your company name"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Company Description *</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Tell potential candidates about your company, culture, and values"
                    rows={6}
                    required
                  />
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="industry">Industry</Label>
                    <Input
                      id="industry"
                      name="industry"
                      value={formData.industry}
                      onChange={handleInputChange}
                      placeholder="e.g. Technology, Healthcare, Finance"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="size">Company Size</Label>
                    <Input
                      id="size"
                      name="size"
                      value={formData.size}
                      onChange={handleInputChange}
                      placeholder="e.g. 1-10, 11-50, 51-200, 201-500, 500+"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="founded">Founded Year</Label>
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
                
                <div className="space-y-2">
                  <Label htmlFor="website">Company Website</Label>
                  <Input
                    id="website"
                    name="website"
                    value={formData.website}
                    onChange={handleInputChange}
                    placeholder="https://example.com"
                  />
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
                    placeholder="+1 (555) 123-4567"
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
                    <Button type="submit" disabled={isLoading}>
                      {isLoading ? 'Saving...' : 'Save Profile'}
                    </Button>
                  </div>
                </div>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
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
