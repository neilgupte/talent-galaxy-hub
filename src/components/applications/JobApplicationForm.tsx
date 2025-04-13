import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Send } from 'lucide-react';
import { Job } from '@/types';

// Import refactored components
import ApplicationContactSection from './ApplicationContactSection';
import ApplicationCoverLetterSection from './ApplicationCoverLetterSection';
import ApplicationQuestionsSection from './ApplicationQuestionsSection';

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
      planType: 'premium',
      recruiterType: 'internal'
    },
    matchPercentage: 92,
    hasApplied: false,
    questions: [
      {
        id: 'q1',
        jobId: id,
        questionText: 'Describe your experience with React.js and modern frontend frameworks.',
        type: 'text',
        isRequired: true,
        isKnockout: false
      },
      {
        id: 'q2',
        jobId: id,
        questionText: 'How would you approach building a responsive, accessible UI?',
        type: 'text',
        isRequired: true,
        isKnockout: false
      }
    ]
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
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({
    coverLetter: '',
  });
  
  // Fetch job details
  const { data: job, isLoading, error } = useQuery({
    queryKey: ['job', id],
    queryFn: () => fetchJobDetails(id!),
    enabled: !!id
  });

  // Initialize answers state when job data is loaded
  useEffect(() => {
    if (job?.questions) {
      const initialAnswers: Record<string, string> = {};
      job.questions.forEach(question => {
        initialAnswers[question.id] = '';
      });
      setAnswers(initialAnswers);
    }
  }, [job]);
  
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
    
    // Clear validation error when user types
    if (validationErrors[questionId]) {
      setValidationErrors(prev => ({
        ...prev,
        [questionId]: ''
      }));
    }
  };
  
  const clearCoverLetterError = () => {
    setValidationErrors(prev => ({
      ...prev,
      coverLetter: ''
    }));
  };
  
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    let isValid = true;
    
    // Validate cover letter
    if (!coverLetter.trim()) {
      newErrors.coverLetter = 'Cover letter is required';
      isValid = false;
    }
    
    // Validate each required question
    job.questions?.forEach(question => {
      if (question.isRequired && !answers[question.id]?.trim()) {
        newErrors[question.id] = 'This answer is required';
        isValid = false;
      }
    });
    
    setValidationErrors(newErrors);
    return isValid;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }
    
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
      
      // Redirect to application success page
      navigate(`/application/success/${result.id}`);
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
      
      <form onSubmit={handleSubmit} className="space-y-8" noValidate>
        <ApplicationContactSection 
          user={user}
          phoneNumber={phoneNumber}
          setPhoneNumber={setPhoneNumber}
        />
        
        <ApplicationCoverLetterSection 
          coverLetter={coverLetter}
          setCoverLetter={setCoverLetter}
          validationError={validationErrors.coverLetter}
          clearValidationError={clearCoverLetterError}
        />
        
        <ApplicationQuestionsSection 
          questions={job.questions || []}
          answers={answers}
          handleAnswerChange={handleAnswerChange}
          validationErrors={validationErrors}
        />
        
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
