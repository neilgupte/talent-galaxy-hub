
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { AlertCircle, BookOpen } from 'lucide-react';

interface ApplicationCoverLetterSectionProps {
  coverLetter: string;
  setCoverLetter: (value: string) => void;
  validationError: string;
  clearValidationError: () => void;
}

const ApplicationCoverLetterSection = ({ 
  coverLetter, 
  setCoverLetter, 
  validationError,
  clearValidationError
}: ApplicationCoverLetterSectionProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Cover Letter <span className="text-red-500">*</span>
        </CardTitle>
        <CardDescription>
          Tell the employer why you're the perfect fit for this role.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Textarea 
          placeholder="Write your cover letter here..." 
          className={`min-h-[200px] ${validationError ? 'border-red-500' : ''}`}
          value={coverLetter}
          onChange={(e) => {
            setCoverLetter(e.target.value);
            if (validationError) {
              clearValidationError();
            }
          }}
          aria-invalid={!!validationError}
        />
        {validationError && (
          <div className="flex items-center mt-2 text-red-500 text-sm">
            <AlertCircle className="h-4 w-4 mr-1" />
            <span>{validationError}</span>
          </div>
        )}
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
  );
};

export default ApplicationCoverLetterSection;
