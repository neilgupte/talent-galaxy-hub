
import React, { useRef, useState } from 'react';
import { User } from '@/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Upload } from 'lucide-react';
import { JobSeekerStatus, ContactPreference } from '@/types';
import { useToast } from "@/components/ui/use-toast";

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
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(formData.avatarUrl || null);

  const handlePhotoClick = () => {
    fileInputRef.current?.click();
  };
  
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploadingPhoto(true);
      
      // Create a preview URL for the image
      const previewUrl = URL.createObjectURL(file);
      setPreviewImage(previewUrl);
      
      // In a real app, you would upload the file to a server here
      // For this demo, we'll simulate a file upload
      setTimeout(() => {
        setUploadingPhoto(false);
        
        toast({
          title: "Photo updated",
          description: "Your profile photo has been updated"
        });
      }, 1000);
    }
  };

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
          <div className="flex flex-col items-center">
            <Avatar className="h-24 w-24 mb-2">
              <AvatarImage src={previewImage || ''} alt={user?.name} />
              <AvatarFallback className="text-lg">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </AvatarFallback>
            </Avatar>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              ref={fileInputRef}
              onChange={handlePhotoChange}
            />
            <Button 
              variant="outline" 
              size="sm" 
              type="button" 
              onClick={handlePhotoClick}
              disabled={uploadingPhoto}
            >
              {uploadingPhoto ? (
                <>
                  <Upload className="h-4 w-4 mr-2 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Photo
                </>
              )}
            </Button>
          </div>
          
          <div className="flex-1 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" value={user?.name || ''} disabled />
              <p className="text-xs text-muted-foreground">
                Your name comes from your account information
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" value={user?.email || ''} disabled />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                name="phone"
                placeholder="e.g. +44 7123 456789"
                value={formData.phone || ''}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </div>
        
        <Separator className="my-4" />
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="headline">Professional Headline *</Label>
            <Input
              id="headline"
              name="headline"
              placeholder="e.g. Senior Frontend Developer with 5 years of experience"
              value={formData.headline || ''}
              onChange={handleInputChange}
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
              value={formData.currentTitle || ''}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="location">Location *</Label>
            <Input
              id="location"
              name="location"
              placeholder="e.g. London, UK"
              value={formData.location || ''}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="jobSeekerStatus">Job Seeking Status</Label>
            <RadioGroup 
              value={formData.jobSeekerStatus}
              onValueChange={value => handleStatusChange(value as JobSeekerStatus)}
              className="pt-2"
            >
              <div className="flex items-center space-x-2 mb-2">
                <RadioGroupItem value="actively_seeking" id="actively_seeking" />
                <Label htmlFor="actively_seeking" className="font-normal">
                  Actively seeking jobs
                </Label>
              </div>
              <div className="flex items-center space-x-2 mb-2">
                <RadioGroupItem value="employed_but_open" id="employed_but_open" />
                <Label htmlFor="employed_but_open" className="font-normal">
                  Employed but open to opportunities
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="not_open" id="not_open" />
                <Label htmlFor="not_open" className="font-normal">
                  Not open to job offers
                </Label>
              </div>
            </RadioGroup>
          </div>
          
          <div className="space-y-2">
            <Label>Contact Preferences</Label>
            <p className="text-xs text-muted-foreground mb-2">
              How should recruiters contact you?
            </p>
            <div className="flex flex-col space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="contact-email" 
                  checked={formData.contactPreference === 'email' || formData.contactPreference === 'both'} 
                  onCheckedChange={(checked) => {
                    const current = formData.contactPreference === 'email' || formData.contactPreference === 'both' ? ['email'] : [];
                    const phone = formData.contactPreference === 'phone' || formData.contactPreference === 'both' ? ['phone'] : [];
                    const newValue = checked ? [...phone, 'email'] : phone;
                    handleContactPreferenceChange(newValue);
                  }}
                />
                <Label htmlFor="contact-email" className="font-normal">Email</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="contact-phone" 
                  checked={formData.contactPreference === 'phone' || formData.contactPreference === 'both'} 
                  onCheckedChange={(checked) => {
                    const current = formData.contactPreference === 'phone' || formData.contactPreference === 'both' ? ['phone'] : [];
                    const email = formData.contactPreference === 'email' || formData.contactPreference === 'both' ? ['email'] : [];
                    const newValue = checked ? [...email, 'phone'] : email;
                    handleContactPreferenceChange(newValue);
                  }}
                />
                <Label htmlFor="contact-phone" className="font-normal">Phone</Label>
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="bio">Professional Summary *</Label>
            <Textarea
              id="bio"
              name="bio"
              placeholder="Write a brief summary about your professional background, experience, and career goals..."
              rows={5}
              value={formData.bio || ''}
              onChange={handleInputChange}
              required
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BasicInfoSection;
