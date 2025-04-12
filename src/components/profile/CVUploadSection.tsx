
import React, { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { Upload } from 'lucide-react';

interface CVUploadSectionProps {
  onCVUpload: (file: File) => void;
}

const CVUploadSection: React.FC<CVUploadSectionProps> = ({ onCVUpload }) => {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== 'application/pdf' && !file.name.endsWith('.docx')) {
        toast({
          title: "Invalid file format",
          description: "Please upload a PDF or DOCX file.",
          variant: "destructive"
        });
        return;
      }

      setIsUploading(true);
      // Simulate upload with a timeout
      setTimeout(() => {
        onCVUpload(file);
        setIsUploading(false);
        toast({
          title: "CV uploaded",
          description: "Your CV has been successfully uploaded.",
        });
      }, 1500);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <>
      <div>
        <Label htmlFor="cv-upload" className="mb-2 block">Upload a new CV</Label>
        <div className="flex items-center gap-4">
          <Input
            id="cv-upload"
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".pdf,.docx"
            className="hidden"
          />
          <Button onClick={handleUploadClick} disabled={isUploading}>
            <Upload className="h-4 w-4 mr-2" />
            {isUploading ? "Uploading..." : "Upload CV"}
          </Button>
          <p className="text-sm text-muted-foreground">
            Accepted formats: PDF, DOCX
          </p>
        </div>
      </div>
      <Separator />
    </>
  );
};

export default CVUploadSection;
