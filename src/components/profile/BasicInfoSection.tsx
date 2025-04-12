
import React from 'react';
import { User } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { JobSeekerStatus, ContactPreference } from '@/types';

// Import the new component files
import PhotoUpload from './PhotoUpload';
import UserInfoSection from './UserInfoSection';
import ProfessionalInfoSection from './ProfessionalInfoSection';
import JobSeekerStatusSection from './JobSeekerStatusSection';
import ContactPreferenceSection from './ContactPreferenceSection';

interface BasicInfoSectionProps {
  user: User | null;
  formData: any;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleContactPreferenceChange: (value: string[]) => void;
  handleStatusChange: (value: JobSeekerStatus) => void;
}

const BasicInfoSection = ({ 
  user, 
  formData, 
  handleInputChange, 
  handleContactPreferenceChange,
  handleStatusChange 
}: BasicInfoSectionProps) => {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Basic Information</CardTitle>
        <CardDescription>
          Add your personal details and contact information
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="flex flex-col sm:flex-row gap-6">
          <PhotoUpload 
            avatarUrl={formData.avatarUrl} 
            username={user?.name || ''}
          />
          
          <UserInfoSection 
            user={user}
            phone={formData.phone || ''}
            onPhoneChange={handleInputChange}
          />
        </div>
        
        <Separator className="my-4" />
        
        <ProfessionalInfoSection 
          headline={formData.headline || ''}
          currentTitle={formData.currentTitle || ''}
          location={formData.location || ''}
          bio={formData.bio || ''}
          onChange={handleInputChange}
        />
        
        <JobSeekerStatusSection 
          jobSeekerStatus={formData.jobSeekerStatus as JobSeekerStatus}
          onStatusChange={handleStatusChange}
        />
        
        <ContactPreferenceSection 
          contactPreference={formData.contactPreference as ContactPreference}
          onContactPreferenceChange={handleContactPreferenceChange}
        />
      </CardContent>
    </Card>
  );
};

export default BasicInfoSection;
