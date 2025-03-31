
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { ContactPreference, JobSeekerStatus, Profile } from '@/types';
import { useToast } from "@/components/ui/use-toast";
import { CheckCircle, Plus, Upload, X } from 'lucide-react';

const ProfileForm = () => {
  const { authState, updateProfile } = useAuth();
  const { user, profile } = authState;
  const navigate = useNavigate();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
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
  
  const [newSkill, setNewSkill] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(formData.avatarUrl || null);
  
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
  
  const addSkill = () => {
    if (newSkill.trim() && !formData.skills?.includes(newSkill.trim())) {
      setFormData({
        ...formData,
        skills: [...(formData.skills || []), newSkill.trim()]
      });
      setNewSkill('');
    }
  };
  
  const removeSkill = (skillToRemove: string) => {
    setFormData({
      ...formData,
      skills: formData.skills?.filter(skill => skill !== skillToRemove) || []
    });
  };
  
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
        setFormData({
          ...formData,
          avatarUrl: previewUrl
        });
        setUploadingPhoto(false);
        
        toast({
          title: "Photo updated",
          description: "Your profile photo has been updated"
        });
      }, 1000);
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setResumeFile(e.target.files[0]);
      
      // In a real app, we would upload the file and parse the resume data
      // For this demo, we'll simulate extracting some data from the resume
      setTimeout(() => {
        toast({
          title: "Resume parsed successfully",
          description: "We've extracted information from your resume",
        });
        
        // Simulate extracted data
        setFormData({
          ...formData,
          headline: formData.headline || "Software Developer",
          currentTitle: formData.currentTitle || "Full Stack Developer",
          skills: [
            ...(formData.skills || []),
            "JavaScript",
            "React",
            "Node.js",
            "TypeScript"
          ].filter((value, index, self) => self.indexOf(value) === index) // Remove duplicates
        });
      }, 1500);
    }
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
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Create Your Profile</h1>
        <p className="text-muted-foreground">
          Complete your profile to improve your job matches and get discovered by employers
        </p>
      </div>
      
      <Card className="mb-6">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Profile Completeness</CardTitle>
          <CardDescription>Fill out your profile to improve your matches</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>{completeness}% complete</span>
              <span className="text-muted-foreground">
                {completeness < 100 ? 'Complete your profile' : 'Profile complete!'}
              </span>
            </div>
            <Progress value={completeness} className="h-2" />
          </div>
        </CardContent>
      </Card>
      
      <form onSubmit={handleSubmit}>
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
        
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Resume Upload</CardTitle>
            <CardDescription>
              Upload your resume to automatically fill in your profile information
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <div className="border-2 border-dashed rounded-lg p-6 text-center">
              <div className="mb-4">
                <Upload className="h-10 w-10 mx-auto text-muted-foreground" />
              </div>
              
              {resumeFile ? (
                <div className="flex items-center justify-center gap-2 mb-4">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>{resumeFile.name}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => setResumeFile(null)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <p className="text-muted-foreground mb-4">
                  Drag and drop your resume file here, or click to browse
                </p>
              )}
              
              <div className="flex justify-center">
                <Button variant="outline" type="button" className="relative">
                  <input
                    type="file"
                    className="absolute inset-0 opacity-0 w-full cursor-pointer"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileChange}
                  />
                  Browse Files
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Skills</CardTitle>
            <CardDescription>
              Add your technical and soft skills
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <div className="space-y-6">
              <div className="flex gap-2">
                <Input
                  placeholder="Add a skill"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addSkill();
                    }
                  }}
                />
                <Button type="button" onClick={addSkill}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add
                </Button>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {formData.skills && formData.skills.length > 0 ? (
                  formData.skills.map((skill) => (
                    <Badge key={skill} className="flex items-center gap-1 py-1.5">
                      {skill}
                      <button type="button" onClick={() => removeSkill(skill)}>
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))
                ) : (
                  <p className="text-muted-foreground text-sm">
                    No skills added yet. Add skills that are relevant to your profession.
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
        
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
