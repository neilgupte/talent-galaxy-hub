
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface ProfessionalInfoSectionProps {
  headline: string;
  currentTitle: string;
  location: string;
  bio: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const ProfessionalInfoSection = ({ 
  headline, 
  currentTitle, 
  location, 
  bio, 
  onChange 
}: ProfessionalInfoSectionProps) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="headline">Professional Headline *</Label>
        <Input
          id="headline"
          name="headline"
          placeholder="e.g. Senior Frontend Developer with 5 years of experience"
          value={headline}
          onChange={onChange}
          required
        />
        <p className="text-xs text-muted-foreground">
          A short tagline that summarizes your professional identity
        </p>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="currentTitle">Current Job Title *</Label>
        <Input
          id="currentTitle"
          name="currentTitle"
          placeholder="e.g. Frontend Developer"
          value={currentTitle}
          onChange={onChange}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="location">Location *</Label>
        <Input
          id="location"
          name="location"
          placeholder="e.g. London, UK"
          value={location}
          onChange={onChange}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="bio">Professional Summary *</Label>
        <Textarea
          id="bio"
          name="bio"
          placeholder="Write a brief summary about your professional background, experience, and career goals..."
          rows={5}
          value={bio}
          onChange={onChange}
          required
        />
      </div>
    </div>
  );
};

export default ProfessionalInfoSection;
