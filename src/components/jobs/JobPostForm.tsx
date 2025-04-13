import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/components/ui/use-toast";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { JobEmploymentType, JobLevel, JobOnsiteType } from '@/types';
import { useAuth } from '@/context/auth/useAuth';

interface JobPostFormProps {
  initialValues?: {
    country?: string;
    city?: string;
    currency?: string;
  };
}

const JobPostForm = ({ initialValues = {} }: JobPostFormProps) => {
  const { authState } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    title: '',
    location: '',
    onsiteType: 'onsite' as JobOnsiteType,
    employmentType: 'full_time' as JobEmploymentType,
    jobLevel: 'mid' as JobLevel,
    salaryMin: '',
    salaryMax: '',
    description: '',
    requirements: '',
    responsibilities: '',
    benefits: '',
    companyName: '',
    companyDescription: '',
    companyLogo: '',
    companyWebsite: '',
    isHighPriority: false,
    isBoosted: false,
    country: initialValues.country || 'UK',
    city: initialValues.city || '',
    currency: initialValues.currency || 'GBP',
    acceptsInternationalApplications: false,
    visaSponsorshipAvailable: false,
  });

  useEffect(() => {
    if (authState.company) {
      if (authState.company.recruiterType === 'internal') {
        setFormData(prevData => ({
          ...prevData,
          companyName: authState.company?.name || '',
          companyDescription: authState.company?.description || '',
          companyLogo: authState.company?.logoUrl || '',
          companyWebsite: authState.company?.website || '',
        }));
      }
    }
  }, [authState.company]);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('job-details');
  const [jobQuestions, setJobQuestions] = useState([
    { id: 'q1', questionText: '', type: 'text', isRequired: true, isKnockout: false }
  ]);

  const [benefitsList, setBenefitsList] = useState([
    { id: 'b1', text: 'Competitive salary and performance bonuses' },
    { id: 'b2', text: 'Flexible working hours and remote work options' },
    { id: 'b3', text: 'Comprehensive health, dental, and vision insurance' },
    { id: 'b4', text: '25 days annual leave plus bank holidays' }
  ]);
  
  const [selectedBenefits, setSelectedBenefits] = useState<string[]>([]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData({
      ...formData,
      [name]: checked
    });
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const addBenefit = () => {
    setBenefitsList([
      ...benefitsList,
      { id: `b${benefitsList.length + 1}`, text: '' }
    ]);
  };
  
  const updateBenefit = (id: string, value: string) => {
    setBenefitsList(benefitsList.map(benefit => 
      benefit.id === id ? { ...benefit, text: value } : benefit
    ));
  };
  
  const removeBenefit = (id: string) => {
    setBenefitsList(benefitsList.filter(benefit => benefit.id !== id));
  };
  
  const toggleBenefitSelection = (benefitId: string) => {
    if (selectedBenefits.includes(benefitId)) {
      setSelectedBenefits(selectedBenefits.filter(id => id !== benefitId));
    } else {
      setSelectedBenefits([...selectedBenefits, benefitId]);
    }
  };
  
  const addQuestion = () => {
    setJobQuestions([
      ...jobQuestions,
      {
        id: `q${jobQuestions.length + 1}`,
        questionText: '',
        type: 'text',
        isRequired: true,
        isKnockout: false
      }
    ]);
  };
  
  const updateQuestion = (id: string, field: string, value: any) => {
    setJobQuestions(jobQuestions.map(question => 
      question.id === id ? { ...question, [field]: value } : question
    ));
  };
  
  const removeQuestion = (id: string) => {
    setJobQuestions(jobQuestions.filter(question => question.id !== id));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const selectedBenefitsText = benefitsList
        .filter(benefit => selectedBenefits.includes(benefit.id) && benefit.text.trim())
        .map(benefit => benefit.text.trim())
        .join('\n');
      
      const finalFormData = {
        ...formData,
        benefits: selectedBenefitsText || formData.benefits,
      };
      
      console.log('Job Post Data:', finalFormData);
      console.log('Job Questions:', jobQuestions);
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Job posted successfully",
        description: "Your job has been posted and is now live."
      });
      
      navigate('/dashboard/employer');
    } catch (error) {
      toast({
        title: "Failed to post job",
        description: "There was an error posting your job. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Post a New Job</h1>
        <p className="text-muted-foreground">
          Create a detailed job listing to attract qualified candidates
        </p>
      </div>
      
      <form onSubmit={handleSubmit}>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="w-full grid grid-cols-3">
            <TabsTrigger value="job-details">Job Details</TabsTrigger>
            <TabsTrigger value="company-details">Company Details</TabsTrigger>
            <TabsTrigger value="application-questions">Application Questions</TabsTrigger>
          </TabsList>
          
          <TabsContent value="job-details">
            <Card>
              <CardHeader>
                <CardTitle>Job Information</CardTitle>
                <CardDescription>
                  Enter the details for this job posting
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="title">Job Title *</Label>
                    <Input
                      id="title"
                      name="title"
                      placeholder="e.g. Senior Frontend Developer"
                      value={formData.title}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="location">Location *</Label>
                    <Input
                      id="location"
                      name="location"
                      placeholder="e.g. London, Manchester"
                      value={formData.location}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Country *</Label>
                    <Select
                      value={formData.country}
                      onValueChange={(value) => handleSelectChange('country', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select country" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="UK">United Kingdom</SelectItem>
                        <SelectItem value="US">United States</SelectItem>
                        <SelectItem value="CA">Canada</SelectItem>
                        <SelectItem value="AU">Australia</SelectItem>
                        <SelectItem value="DE">Germany</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Onsite Type *</Label>
                    <Select
                      value={formData.onsiteType}
                      onValueChange={(value) => handleSelectChange('onsiteType', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select onsite type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="onsite">Onsite</SelectItem>
                        <SelectItem value="hybrid">Hybrid</SelectItem>
                        <SelectItem value="remote">Remote</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Employment Type *</Label>
                    <Select
                      value={formData.employmentType}
                      onValueChange={(value) => handleSelectChange('employmentType', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select employment type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="full_time">Full Time</SelectItem>
                        <SelectItem value="part_time">Part Time</SelectItem>
                        <SelectItem value="contract">Contract</SelectItem>
                        <SelectItem value="temporary">Temporary</SelectItem>
                        <SelectItem value="internship">Internship</SelectItem>
                        <SelectItem value="job_share">Job Share</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Job Level *</Label>
                    <Select
                      value={formData.jobLevel}
                      onValueChange={(value) => handleSelectChange('jobLevel', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select job level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="entry">Entry Level</SelectItem>
                        <SelectItem value="junior">Junior</SelectItem>
                        <SelectItem value="mid">Mid Level</SelectItem>
                        <SelectItem value="senior">Senior</SelectItem>
                        <SelectItem value="executive">Executive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="salaryMin">Salary Min</Label>
                      <Input
                        id="salaryMin"
                        name="salaryMin"
                        type="number"
                        placeholder="e.g. 50000"
                        value={formData.salaryMin}
                        onChange={handleInputChange}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="salaryMax">Salary Max</Label>
                      <Input
                        id="salaryMax"
                        name="salaryMax"
                        type="number"
                        placeholder="e.g. 70000"
                        value={formData.salaryMax}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Currency</Label>
                    <Select
                      value={formData.currency}
                      onValueChange={(value) => handleSelectChange('currency', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select currency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="GBP">GBP (£)</SelectItem>
                        <SelectItem value="USD">USD ($)</SelectItem>
                        <SelectItem value="EUR">EUR (€)</SelectItem>
                        <SelectItem value="AUD">AUD (A$)</SelectItem>
                        <SelectItem value="CAD">CAD (C$)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <Label htmlFor="description">Job Description *</Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Provide a detailed description of the job role and responsibilities"
                    rows={6}
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="requirements">Requirements *</Label>
                  <Textarea
                    id="requirements"
                    name="requirements"
                    placeholder="List the required skills, qualifications, and experience"
                    rows={4}
                    value={formData.requirements}
                    onChange={handleInputChange}
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    Separate each requirement with a new line for better readability
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="responsibilities">Responsibilities</Label>
                  <Textarea
                    id="responsibilities"
                    name="responsibilities"
                    placeholder="List the key responsibilities for this role"
                    rows={4}
                    value={formData.responsibilities}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Benefits & Perks</Label>
                  <div className="border rounded-md p-4 space-y-4">
                    <p className="text-sm text-muted-foreground mb-2">
                      Select or add benefits offered with this position:
                    </p>
                    
                    <div className="space-y-2">
                      {benefitsList.map((benefit) => (
                        <div key={benefit.id} className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            id={`benefit-${benefit.id}`}
                            checked={selectedBenefits.includes(benefit.id)}
                            onChange={() => toggleBenefitSelection(benefit.id)}
                            className="h-4 w-4 rounded border-gray-300"
                          />
                          <Input
                            value={benefit.text}
                            onChange={(e) => updateBenefit(benefit.id, e.target.value)}
                            placeholder="Enter benefit"
                            className="flex-1"
                          />
                          {benefitsList.length > 1 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeBenefit(benefit.id)}
                              className="h-8 w-8 p-0"
                            >
                              ×
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                    
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addBenefit}
                      className="mt-2"
                    >
                      Add Another Benefit
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>International Applications</Label>
                  <div className="space-y-4 p-4 border rounded-md">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="acceptsInternationalApplications" className="cursor-pointer">
                          Accept International Applications
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Allow candidates from other countries to apply for this position
                        </p>
                      </div>
                      <Switch
                        id="acceptsInternationalApplications"
                        checked={formData.acceptsInternationalApplications}
                        onCheckedChange={(checked) => handleSwitchChange('acceptsInternationalApplications', checked)}
                      />
                    </div>
                    
                    {formData.acceptsInternationalApplications && (
                      <div className="flex items-center justify-between pt-2">
                        <div className="space-y-0.5">
                          <Label htmlFor="visaSponsorshipAvailable" className="cursor-pointer">
                            Visa Sponsorship Available
                          </Label>
                          <p className="text-sm text-muted-foreground">
                            Company can sponsor visa for qualified international candidates
                          </p>
                        </div>
                        <Switch
                          id="visaSponsorshipAvailable"
                          checked={formData.visaSponsorshipAvailable}
                          onCheckedChange={(checked) => handleSwitchChange('visaSponsorshipAvailable', checked)}
                        />
                      </div>
                    )}
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Job Promotion Options</h3>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="isHighPriority" className="text-base cursor-pointer">
                        Mark as High Priority
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        High priority jobs are shown at the top of search results
                      </p>
                    </div>
                    <Switch
                      id="isHighPriority"
                      checked={formData.isHighPriority}
                      onCheckedChange={(checked) => handleSwitchChange('isHighPriority', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="isBoosted" className="text-base cursor-pointer">
                        Boost This Job
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Boosted jobs get 5x more visibility and appear in featured sections
                      </p>
                    </div>
                    <Switch
                      id="isBoosted"
                      checked={formData.isBoosted}
                      onCheckedChange={(checked) => handleSwitchChange('isBoosted', checked)}
                    />
                  </div>
                </div>
              </CardContent>
              
              <CardFooter className="flex justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/dashboard/employer')}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  onClick={() => setActiveTab('company-details')}
                >
                  Next: Company Details
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="company-details">
            <Card>
              <CardHeader>
                <CardTitle>Company Information</CardTitle>
                <CardDescription>
                  {authState.company?.recruiterType === 'agency' 
                    ? "Add details about the company you're recruiting for"
                    : "Add details about your company to help candidates learn more"}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="companyName">Company Name *</Label>
                  <Input
                    id="companyName"
                    name="companyName"
                    placeholder="Enter company name"
                    value={formData.companyName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="companyDescription">Company Description *</Label>
                  <Textarea
                    id="companyDescription"
                    name="companyDescription"
                    placeholder="Tell candidates about your company's mission, culture, and values"
                    rows={4}
                    value={formData.companyDescription}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="companyLogo">Company Logo URL</Label>
                    <Input
                      id="companyLogo"
                      name="companyLogo"
                      placeholder="https://example.com/logo.png"
                      value={formData.companyLogo}
                      onChange={handleInputChange}
                    />
                    <p className="text-xs text-muted-foreground">
                      Enter a URL for your company logo, or leave blank to use the default logo
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="companyWebsite">Company Website</Label>
                    <Input
                      id="companyWebsite"
                      name="companyWebsite"
                      placeholder="https://example.com"
                      value={formData.companyWebsite}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </CardContent>
              
              <CardFooter className="flex justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setActiveTab('job-details')}
                >
                  Back to Job Details
                </Button>
                <Button
                  type="button"
                  onClick={() => setActiveTab('application-questions')}
                >
                  Next: Application Questions
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="application-questions">
            <Card>
              <CardHeader>
                <CardTitle>Application Questions</CardTitle>
                <CardDescription>
                  Add screening questions for candidates to answer when applying
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-6">
                {jobQuestions.map((question, index) => (
                  <div key={question.id} className="p-4 border rounded-md space-y-4">
                    <div className="flex justify-between items-start">
                      <h4 className="font-medium">Question {index + 1}</h4>
                      {jobQuestions.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeQuestion(question.id)}
                        >
                          Remove
                        </Button>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor={`question-${question.id}`}>Question Text *</Label>
                      <Textarea
                        id={`question-${question.id}`}
                        value={question.questionText}
                        onChange={(e) => updateQuestion(question.id, 'questionText', e.target.value)}
                        placeholder="e.g. Describe your experience with React"
                        required
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Question Type</Label>
                        <Select
                          value={question.type}
                          onValueChange={(value) => updateQuestion(question.id, 'type', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select question type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="text">Text Answer</SelectItem>
                            <SelectItem value="mcq">Multiple Choice</SelectItem>
                            <SelectItem value="yesno">Yes/No</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor={`required-${question.id}`} className="cursor-pointer">
                            Required Question
                          </Label>
                          <Switch
                            id={`required-${question.id}`}
                            checked={question.isRequired}
                            onCheckedChange={(checked) => updateQuestion(question.id, 'isRequired', checked)}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <Label htmlFor={`knockout-${question.id}`} className="cursor-pointer">
                            Knockout Question
                          </Label>
                          <Switch
                            id={`knockout-${question.id}`}
                            checked={question.isKnockout}
                            onCheckedChange={(checked) => updateQuestion(question.id, 'isKnockout', checked)}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={addQuestion}
                >
                  Add Another Question
                </Button>
                
                <div className="p-4 bg-muted rounded-md">
                  <h4 className="font-medium mb-2">AI Question Suggestions</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Let AI suggest relevant screening questions based on your job description
                  </p>
                  <Button type="button" variant="secondary" className="w-full">
                    Generate AI Suggestions
                  </Button>
                </div>
              </CardContent>
              
              <CardFooter className="flex justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setActiveTab('company-details')}
                >
                  Back to Company Details
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Posting Job...' : 'Post Job'}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </form>
    </div>
  );
};

export default JobPostForm;
