
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Upload, X } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";

interface ResumeUploadSectionProps {
  onResumeProcessed: (extractedData: any) => void;
}

const ResumeUploadSection = ({ onResumeProcessed }: ResumeUploadSectionProps) => {
  const { toast } = useToast();
  const [resumeFile, setResumeFile] = useState<File | null>(null);

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
        onResumeProcessed({
          headline: "Software Developer",
          currentTitle: "Full Stack Developer",
          skills: [
            "JavaScript",
            "React",
            "Node.js",
            "TypeScript"
          ]
        });
      }, 1500);
    }
  };

  return (
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
  );
};

export default ResumeUploadSection;
