
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface FAQ {
  question: string;
  answer: React.ReactNode;
  category: string;
}

const FAQPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  
  const faqItems: FAQ[] = [
    // General FAQs
    {
      question: "What is Talent Hub?",
      answer: (
        <p>
          Talent Hub is an AI-powered job matching platform that connects job seekers with employers. We use advanced algorithms to match candidates with suitable job opportunities based on skills, experience, and preferences, making the hiring process more efficient and effective for both parties.
        </p>
      ),
      category: "general"
    },
    {
      question: "How does Talent Hub work?",
      answer: (
        <div>
          <p className="mb-3">
            For job seekers, Talent Hub works by analyzing your skills, experience, and preferences to match you with relevant job opportunities. You can create a profile, upload your resume, and apply to jobs with just a few clicks.
          </p>
          <p>
            For employers, Talent Hub helps you find qualified candidates for your job openings. You can post jobs, review applications, and connect with potential hires all in one platform.
          </p>
        </div>
      ),
      category: "general"
    },
    {
      question: "Is Talent Hub free to use?",
      answer: (
        <div>
          <p className="mb-3">
            For job seekers, Talent Hub is completely free to use. You can create a profile, search for jobs, and apply to as many positions as you like without any cost.
          </p>
          <p>
            For employers, we offer different pricing plans to suit various hiring needs. We also provide a limited free tier that allows you to post one job at a time. You can view our pricing details <Link to="/pricing" className="text-primary hover:underline">here</Link>.
          </p>
        </div>
      ),
      category: "general"
    },
    
    // Job Seeker FAQs
    {
      question: "How do I create a job seeker account?",
      answer: (
        <ol className="list-decimal pl-5 space-y-2">
          <li>Click on the "Sign Up" button in the top right corner of the homepage</li>
          <li>Select "Job Seeker" as your account type</li>
          <li>Fill in your personal information and create login credentials</li>
          <li>Verify your email address by clicking the link sent to your inbox</li>
          <li>Complete your profile by adding your education, work experience, and skills</li>
          <li>Upload your resume to enhance your profile</li>
        </ol>
      ),
      category: "jobseeker"
    },
    {
      question: "How can I update my resume or profile?",
      answer: (
        <p>
          To update your resume or profile, log in to your account and navigate to the "Profile" section from your dashboard. Here, you can edit your personal information, work experience, education, skills, and preferences. You can also upload a new resume file to replace your existing one. Remember to save your changes before leaving the page.
        </p>
      ),
      category: "jobseeker"
    },
    {
      question: "How do I apply for a job?",
      answer: (
        <div>
          <p className="mb-3">
            To apply for a job:
          </p>
          <ol className="list-decimal pl-5 space-y-2 mb-3">
            <li>Browse jobs or use the search function to find relevant opportunities</li>
            <li>Click on a job listing to view details</li>
            <li>Click the "Apply Now" button on the job details page</li>
            <li>Review your profile information and make any necessary updates</li>
            <li>Answer any additional questions the employer has included</li>
            <li>Submit your application</li>
          </ol>
          <p>
            You can track the status of your applications in the "Applications" section of your dashboard.
          </p>
        </div>
      ),
      category: "jobseeker"
    },
    {
      question: "Can I save jobs to apply later?",
      answer: (
        <p>
          Yes, you can save jobs to apply later. When viewing a job listing, click the "Save" button to add it to your saved jobs. You can access your saved jobs from the "Saved Jobs" section of your dashboard at any time. This feature allows you to keep track of interesting opportunities and apply when you're ready.
        </p>
      ),
      category: "jobseeker"
    },
    {
      question: "How can I set up job alerts?",
      answer: (
        <div>
          <p className="mb-3">
            To set up job alerts:
          </p>
          <ol className="list-decimal pl-5 space-y-2">
            <li>Navigate to the "Job Alerts" section in your dashboard</li>
            <li>Click "Create New Alert"</li>
            <li>Enter your job preferences including keywords, location, job type, etc.</li>
            <li>Select your preferred frequency (daily, weekly, etc.)</li>
            <li>Save your alert</li>
          </ol>
          <p className="mt-3">
            You'll receive notifications when new jobs matching your criteria are posted.
          </p>
        </div>
      ),
      category: "jobseeker"
    },
    
    // Employer FAQs
    {
      question: "How do I create an employer account?",
      answer: (
        <ol className="list-decimal pl-5 space-y-2">
          <li>Click on the "Sign Up" button in the top right corner of the homepage</li>
          <li>Select "Employer" as your account type</li>
          <li>Enter your company information and create login credentials</li>
          <li>Verify your email address by clicking the link sent to your inbox</li>
          <li>Complete your company profile by adding details like company size, industry, and culture</li>
          <li>Choose a subscription plan that suits your hiring needs</li>
        </ol>
      ),
      category: "employer"
    },
    {
      question: "How do I post a job?",
      answer: (
        <div>
          <p className="mb-3">
            To post a job:
          </p>
          <ol className="list-decimal pl-5 space-y-2">
            <li>Log in to your employer account</li>
            <li>Navigate to your dashboard and click "Post a Job"</li>
            <li>Fill in the job details including title, description, requirements, and benefits</li>
            <li>Set screening questions if desired</li>
            <li>Review and publish your job posting</li>
          </ol>
          <p className="mt-3">
            Your job will be reviewed and published on our platform, where it will be visible to potential candidates.
          </p>
        </div>
      ),
      category: "employer"
    },
    {
      question: "How does the candidate matching work?",
      answer: (
        <p>
          Our AI-powered matching algorithm analyzes job requirements and candidate profiles to identify the most suitable matches. The algorithm considers factors such as skills, experience, education, location preferences, and career goals. Each application receives a match score, helping you prioritize candidates. You can view detailed candidate profiles and sort applications based on the match score to streamline your hiring process.
        </p>
      ),
      category: "employer"
    },
    {
      question: "Can I upgrade or downgrade my subscription plan?",
      answer: (
        <p>
          Yes, you can change your subscription plan at any time from your account settings. Navigate to the "Billing & Subscription" section in your dashboard and select "Change Plan" to view available options. If you upgrade, you'll be charged the prorated difference immediately. If you downgrade, the change will take effect at the end of your current billing cycle. For custom enterprise plans or specific questions, please contact our sales team.
        </p>
      ),
      category: "employer"
    },
    {
      question: "How can I feature my job posting?",
      answer: (
        <div>
          <p className="mb-3">
            To feature your job posting and increase its visibility:
          </p>
          <ol className="list-decimal pl-5 space-y-2">
            <li>Go to your "Manage Jobs" section in the dashboard</li>
            <li>Find the job you want to feature</li>
            <li>Click "Promote" or "Boost Job"</li>
            <li>Select a featured promotion package</li>
            <li>Complete the payment process</li>
          </ol>
          <p className="mt-3">
            Featured jobs appear at the top of search results and receive special highlighting, significantly increasing their visibility to potential candidates.
          </p>
        </div>
      ),
      category: "employer"
    },
    
    // Account & Security FAQs
    {
      question: "How do I reset my password?",
      answer: (
        <div>
          <p className="mb-3">
            To reset your password:
          </p>
          <ol className="list-decimal pl-5 space-y-2">
            <li>Click "Log In" in the top right corner of the homepage</li>
            <li>Select "Forgot Password"</li>
            <li>Enter the email address associated with your account</li>
            <li>Check your email for a password reset link</li>
            <li>Click the link and follow the instructions to create a new password</li>
          </ol>
          <p className="mt-3">
            If you don't receive the email, check your spam folder or contact our support team for assistance.
          </p>
        </div>
      ),
      category: "account"
    },
    {
      question: "How can I delete my account?",
      answer: (
        <p>
          To delete your account, go to "Account Settings" in your dashboard and select "Delete Account" at the bottom of the page. You'll need to confirm your decision and provide your password for security purposes. Please note that account deletion is permanent and will remove all your data from our system, including your profile, job postings, applications, and messaging history, in accordance with our data retention policy.
        </p>
      ),
      category: "account"
    },
    {
      question: "Is my personal information secure?",
      answer: (
        <div>
          <p className="mb-3">
            Yes, we take data security and privacy very seriously. We implement industry-standard security measures to protect your personal information, including:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Encryption of sensitive data both in transit and at rest</li>
            <li>Regular security audits and vulnerability assessments</li>
            <li>Strict access controls for our staff</li>
            <li>Compliance with relevant data protection regulations</li>
          </ul>
          <p className="mt-3">
            For more information, please review our <Link to="/privacy" className="text-primary hover:underline">Privacy Policy</Link>.
          </p>
        </div>
      ),
      category: "account"
    }
  ];
  
  const filteredFAQs = faqItems.filter(item => 
    item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (typeof item.answer === 'string' && item.answer.toLowerCase().includes(searchQuery.toLowerCase()))
  );
  
  const filterByCategory = (category: string) => {
    return filteredFAQs.filter(item => item.category === category);
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h1 className="text-4xl font-bold mb-6">Frequently Asked Questions</h1>
        <p className="text-xl text-muted-foreground">
          Find answers to common questions about using Talent Hub
        </p>
        
        <div className="mt-8 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
          <Input
            type="search"
            placeholder="Search for answers..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      <div className="max-w-4xl mx-auto">
        <Tabs defaultValue="all" className="w-full mb-8">
          <TabsList className="grid grid-cols-5 w-full">
            <TabsTrigger value="all">All FAQs</TabsTrigger>
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="jobseeker">Job Seekers</TabsTrigger>
            <TabsTrigger value="employer">Employers</TabsTrigger>
            <TabsTrigger value="account">Account & Security</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all">
            <Accordion type="single" collapsible className="w-full">
              {filteredFAQs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                  <AccordionContent>{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
            
            {filteredFAQs.length === 0 && (
              <div className="text-center py-10">
                <p className="text-muted-foreground mb-4">No FAQs match your search.</p>
                <Button onClick={() => setSearchQuery('')}>Clear Search</Button>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="general">
            <Accordion type="single" collapsible className="w-full">
              {filterByCategory('general').map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                  <AccordionContent>{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
            
            {filterByCategory('general').length === 0 && (
              <div className="text-center py-10">
                <p className="text-muted-foreground mb-4">No FAQs match your search in this category.</p>
                <Button onClick={() => setSearchQuery('')}>Clear Search</Button>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="jobseeker">
            <Accordion type="single" collapsible className="w-full">
              {filterByCategory('jobseeker').map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                  <AccordionContent>{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
            
            {filterByCategory('jobseeker').length === 0 && (
              <div className="text-center py-10">
                <p className="text-muted-foreground mb-4">No FAQs match your search in this category.</p>
                <Button onClick={() => setSearchQuery('')}>Clear Search</Button>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="employer">
            <Accordion type="single" collapsible className="w-full">
              {filterByCategory('employer').map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                  <AccordionContent>{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
            
            {filterByCategory('employer').length === 0 && (
              <div className="text-center py-10">
                <p className="text-muted-foreground mb-4">No FAQs match your search in this category.</p>
                <Button onClick={() => setSearchQuery('')}>Clear Search</Button>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="account">
            <Accordion type="single" collapsible className="w-full">
              {filterByCategory('account').map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                  <AccordionContent>{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
            
            {filterByCategory('account').length === 0 && (
              <div className="text-center py-10">
                <p className="text-muted-foreground mb-4">No FAQs match your search in this category.</p>
                <Button onClick={() => setSearchQuery('')}>Clear Search</Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
        
        <div className="mt-12 text-center py-8 bg-muted rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">Didn't find an answer to your question?</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Our support team is ready to help with any questions you may have about our platform.
          </p>
          <Button asChild size="lg">
            <Link to="/contact">Contact Support</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FAQPage;
