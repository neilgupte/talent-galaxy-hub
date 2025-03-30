
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Job } from '@/types';
import { ChevronLeft, BookOpen, Send } from 'lucide-react';

// Mock function to fetch job details - replace with actual API call
const fetchJobDetails = async (id: string): Promise<Job> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Return mock data - same as in JobDetails.tsx
  return {
    id,
    companyId: '123',
    title: 'Senior Frontend Developer',
    description: `We are seeking an experienced Frontend Developer to join our team...`,
    location: 'New York, NY',
    salaryMin: 100000,
    salaryMax: 130000,
    employmentType: 'full_time',
    onsiteType: 'hybrid',
    jobLevel: 'senior',
    requirements: [
      'React.js',
      'TypeScript',
      'JavaScript',
      'HTML/CSS',
      'Redux',
      'REST APIs'
    ],
    status: 'active',
    isHighPriority: true,
    isBoosted: false,
    endDate: '2023-12-31',
    createdAt: '2023-09-01',
    updatedAt: '2023-09-01',
    country: 'USA',
    city: 'New York',
    currency: 'USD',
    company: {
      id: '123',
      name: 'Tech Solutions Inc',
      industry: 'Software Development',
      description: 'Leading software development company focused on creating innovative solutions.',
      logoUrl: '/placeholder.svg',
      planType: 'premium'
    },
    matchPercentage: 92,
    hasApplied: false
  };
};

// Mock function to submit an application - replace with actual API call
const submitApplication = async (data: any): Promise<{ id: string }> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Return mock data
  return { id: 'app-' + Math.random().toString(36).substring(2, 9) };
};

const JobApplicationForm = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { authState } = useAuth();
  const { user } = authState;
  
  const [coverLetter, setCoverLetter] = useState('');
  const [phoneNumber, setPhoneNumber] = useState(user?.phone || '');
  const [answers, setAnswers] = useState<Record<string, string>>({
    'experience': '',
    'skills': ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Fetch job details
  const { data: job, isLoading, error } = useQuery({
    queryKey: ['job', id],
    queryFn: () => fetchJobDetails(id!),
    enabled: !!id
  });
  
  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-center items-center min-h-[50vh]">
          <p className="text-lg">Loading job details...</p>
        </div>
      </div>
    );
  }
  
  if (error || !job) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
          <h2 className="text-2xl font-semibold mb-2">Job Not Found</h2>
          <p className="text-muted-foreground mb-6">The job you're looking for doesn't exist or has been removed.</p>
          <Button onClick={() => navigate(-1)}>Go Back</Button>
        </div>
      </div>
    );
  }
  
  const handleAnswerChange = (questionId: string, value: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Prepare application data
      const applicationData = {
        jobId: job.id,
        userId: user?.id,
        coverLetter,
        phoneNumber,
        answers: Object.entries(answers).map(([questionId, answerText]) => ({
          questionId,
          answerText
        }))
      };
      
      // Submit application
      const result = await submitApplication(applicationData);
      
      // Show success toast
      toast({
        title: "Application submitted",
        description: "Your application has been successfully submitted.",
      });
      
      // Redirect to application details
      navigate(`/applications/${result.id}`);
    } catch (error) {
      // Show error toast
      toast({
        title: "Error",
        description: "There was an error submitting your application. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <div className="mb-6">
        <Button variant="ghost" onClick={() => navigate(-1)} className="gap-1">
          <ChevronLeft className="h-4 w-4" />
          Back to Job
        </Button>
      </div>
      
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Apply for {job.title}</h1>
        <p className="text-muted-foreground">
          at {job.company?.name} · {job.location}
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
            <CardDescription>
              We'll use this information to contact you about your application.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="fullName">Full Name</Label>
                <Input 
                  id="fullName" 
                  value={user?.name || ''} 
                  disabled 
                  className="bg-muted" 
                />
                <p className="text-xs text-muted-foreground mt-1">
                  This comes from your profile
                </p>
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  value={user?.email || ''} 
                  disabled 
                  className="bg-muted" 
                />
                <p className="text-xs text-muted-foreground mt-1">
                  This comes from your account
                </p>
              </div>
            </div>
            
            <div>
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input 
                id="phoneNumber" 
                type="tel" 
                placeholder="(555) 555-5555" 
                value={phoneNumber} 
                onChange={(e) => setPhoneNumber(e.target.value)} 
                required 
              />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Cover Letter</CardTitle>
            <CardDescription>
              Tell the employer why you're the perfect fit for this role.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea 
              placeholder="Write your cover letter here..." 
              className="min-h-[200px]" 
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              required
            />
          </CardContent>
          <CardFooter className="flex justify-between items-center border-t px-6 py-4">
            <div className="flex items-center text-muted-foreground">
              <BookOpen className="h-4 w-4 mr-2" />
              <span className="text-sm">Aim for 250-300 words</span>
            </div>
            <span className="text-sm text-muted-foreground">
              {coverLetter.split(/\s+/).filter(Boolean).length} words
            </span>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Screening Questions</CardTitle>
            <CardDescription>
              Please answer the following questions to help the employer assess your fit for the role.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label htmlFor="experience" className="text-base font-medium">
                Describe your experience with React.js and modern frontend frameworks.
              </Label>
              <Textarea 
                id="experience" 
                className="mt-2 min-h-[120px]"
                value={answers.experience}
                onChange={(e) => handleAnswerChange('experience', e.target.value)}
                required
              />
            </div>
            
            <Separator />
            
            <div>
              <Label htmlFor="skills" className="text-base font-medium">
                How would you approach building a responsive, accessible UI?
              </Label>
              <Textarea 
                id="skills" 
                className="mt-2 min-h-[120px]"
                value={answers.skills}
                onChange={(e) => handleAnswerChange('skills', e.target.value)}
                required
              />
            </div>
          </CardContent>
        </Card>
        
        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate(-1)}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="min-w-[120px]"
          >
            {isSubmitting ? (
              "Submitting..."
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Submit Application
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default JobApplicationForm;
