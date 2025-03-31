
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/components/ui/use-toast';
import { CV } from '@/types';
import { Download, Upload, Check, FileText, Trash2, AlertTriangle } from 'lucide-react';

interface CVManagerProps {
  cvs: CV[];
  onCVUpload: (file: File) => void;
  onCVDelete: (cvId: string) => void;
  onSetDefaultCV: (cvId: string) => void;
  onAICheck?: (cvId: string) => void;
}

const CVManager: React.FC<CVManagerProps> = ({
  cvs,
  onCVUpload,
  onCVDelete,
  onSetDefaultCV,
  onAICheck
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [selectedCV, setSelectedCV] = useState<string | null>(
    cvs.find(cv => cv.isDefault)?.id || (cvs.length > 0 ? cvs[0].id : null)
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleDownload = (cv: CV) => {
    // In a real implementation, this would download the file from the URL
    // For now, we'll just show a toast
    toast({
      title: "Download started",
      description: `Downloading ${cv.fileName}...`,
    });
  };

  const handleDelete = (cvId: string) => {
    onCVDelete(cvId);
    toast({
      title: "CV deleted",
      description: "Your CV has been successfully deleted.",
    });
  };

  const handleAICheck = (cvId: string) => {
    if (onAICheck) {
      onAICheck(cvId);
      toast({
        title: "AI check in progress",
        description: "We're analysing your CV. This may take a few moments.",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>CV Management</CardTitle>
        <CardDescription>
          Upload, manage and optimise your CVs for job applications.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
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

        {cvs.length > 0 ? (
          <div className="space-y-4">
            <Label className="block mb-2">Your CVs</Label>
            <RadioGroup value={selectedCV || undefined} onValueChange={setSelectedCV}>
              {cvs.map((cv) => (
                <div key={cv.id} className="flex flex-col space-y-2">
                  <div className="flex items-center justify-between border rounded-md p-3">
                    <div className="flex items-center space-x-3">
                      <RadioGroupItem value={cv.id} id={cv.id} onClick={() => onSetDefaultCV(cv.id)} />
                      <Label htmlFor={cv.id} className="flex items-center cursor-pointer">
                        <FileText className="h-5 w-5 mr-2 text-primary" />
                        <div>
                          <p className="font-medium">{cv.fileName}</p>
                          <p className="text-xs text-muted-foreground">
                            Uploaded on {new Date(cv.uploadDate).toLocaleDateString('en-GB')}
                          </p>
                        </div>
                      </Label>
                      {cv.isDefault && (
                        <span className="bg-primary/10 text-primary text-xs rounded-full px-2 py-1 flex items-center">
                          <Check className="h-3 w-3 mr-1" /> Default
                        </span>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDownload(cv)}
                      >
                        <Download className="h-4 w-4" />
                        <span className="sr-only">Download</span>
                      </Button>
                      {onAICheck && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleAICheck(cv.id)}
                        >
                          <AlertTriangle className="h-4 w-4" />
                          <span className="sr-only">AI Check</span>
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(cv.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </RadioGroup>
          </div>
        ) : (
          <div className="text-center py-6">
            <FileText className="h-10 w-10 mx-auto mb-2 text-muted-foreground" />
            <h3 className="text-lg font-medium mb-1">No CVs uploaded</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Upload your CV to apply for jobs more quickly.
            </p>
            <Button onClick={handleUploadClick}>Upload your first CV</Button>
          </div>
        )}
      </CardContent>
      <CardFooter className="border-t px-6 py-4">
        <div className="flex items-start text-sm text-muted-foreground">
          <AlertTriangle className="h-4 w-4 mr-2 mt-0.5" />
          <p>
            You can upload multiple versions of your CV and choose which one to use for each job application.
          </p>
        </div>
      </CardFooter>
    </Card>
  );
};

export default CVManager;
