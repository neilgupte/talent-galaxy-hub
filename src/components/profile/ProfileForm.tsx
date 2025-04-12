
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { ContactPreference, JobSeekerStatus, Profile } from '@/types';
import { useToast } from "@/components/ui/use-toast";

// Import refactored components
import ProfileHeader from './ProfileHeader';
import BasicInfoSection from './BasicInfoSection';
import ResumeUploadSection from './ResumeUploadSection';
import SkillsSection from './SkillsSection';
import JobAlertsSection from './JobAlertsSection';

const ProfileForm = () => {
  const { authState, updateProfile } = useAuth();
  const { user, profile } = authState;
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState<Partial<Profile>>({
    userId: user?.id || '',
    headline: profile?.headline || '',
    bio: profile?.bio || '',
    location: profile?.location || '',
    currentTitle: profile?.currentTitle || '',
    skills: profile?.skills || [],
    avatarUrl: profile?.avatarUrl || '',
    phone: profile?.phone || '',
    contactPreference: profile?.contactPreference || 'email',
    jobSeekerStatus: profile?.jobSeekerStatus || 'actively_seeking',
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleContactPreferenceChange = (value: string[]) => {
    let preference: ContactPreference = 'email';
    
    if (value.includes('email') && value.includes('phone')) {
      preference = 'both';
    } else if (value.includes('phone')) {
      preference = 'phone';
    }
    
    setFormData({
      ...formData,
      contactPreference: preference
    });
  };

  const handleStatusChange = (value: JobSeekerStatus) => {
    setFormData({
      ...formData,
      jobSeekerStatus: value
    });
  };
  
  const handleSkillsChange = (skills: string[]) => {
    setFormData({
      ...formData,
      skills
    });
  };
  
  const handleResumeProcessed = (extractedData: any) => {
    setFormData({
      ...formData,
      headline: formData.headline || extractedData.headline,
      currentTitle: formData.currentTitle || extractedData.currentTitle,
      skills: [
        ...(formData.skills || []),
        ...extractedData.skills
      ].filter((value, index, self) => self.indexOf(value) === index) // Remove duplicates
    });
  };
  
  const calculateProfileCompleteness = (): number => {
    let completed = 0;
    let total = 9; // Total number of fields we're checking
    
    if (formData.headline) completed++;
    if (formData.bio) completed++;
    if (formData.location) completed++;
    if (formData.currentTitle) completed++;
    if (formData.skills && formData.skills.length > 0) completed++;
    if (formData.avatarUrl) completed++;
    if (formData.phone) completed++;
    if (formData.contactPreference) completed++;
    if (formData.jobSeekerStatus) completed++;
    
    return Math.round((completed / total) * 100);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      if (!user) {
        throw new Error('User not found');
      }
      
      await updateProfile(formData as Profile);
      
      toast({
        title: "Profile updated successfully",
        description: "Your profile has been saved"
      });
      
      // Navigate to the job seeker dashboard
      navigate('/dashboard/job-seeker');
    } catch (error) {
      toast({
        title: "Failed to update profile",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const completeness = calculateProfileCompleteness();

  return (
    <div className="container mx-auto p-4 max-w-3xl">
      <ProfileHeader completeness={completeness} />
      
      <form onSubmit={handleSubmit}>
        <BasicInfoSection 
          user={user}
          formData={formData}
          handleInputChange={handleInputChange}
          handleContactPreferenceChange={handleContactPreferenceChange}
          handleStatusChange={handleStatusChange}
        />
        
        <ResumeUploadSection onResumeProcessed={handleResumeProcessed} />
        
        <SkillsSection 
          skills={formData.skills || []}
          onSkillsChange={handleSkillsChange}
        />
        
        <JobAlertsSection />
        
        <div className="flex justify-end gap-4 mb-12">
          <Button variant="outline" type="button" onClick={() => navigate(-1)}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save Profile'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ProfileForm;
