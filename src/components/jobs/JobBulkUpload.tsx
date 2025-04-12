
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { FileUp, AlertCircle, CheckCircle2, X } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from "@/components/ui/use-toast";
import { Spinner } from '@/components/ui/spinner';
import { Progress } from '@/components/ui/progress';

interface JobBulkUploadProps {
  onClose: () => void;
  onSuccess: (jobsCount: number) => void;
}

const JobBulkUpload: React.FC<JobBulkUploadProps> = ({ onClose, onSuccess }) => {
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [validationResults, setValidationResults] = useState<{
    valid: boolean;
    errors: string[];
    validCount: number;
  } | null>(null);
  const { toast } = useToast();
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    setFileError(null);
    
    if (!selectedFile) {
      return;
    }
    
    // Check if file is CSV or Excel
    const validExtensions = ['.csv', '.xlsx', '.xls'];
    const fileExtension = selectedFile.name.substring(selectedFile.name.lastIndexOf('.')).toLowerCase();
    
    if (!validExtensions.includes(fileExtension)) {
      setFileError('Please upload a CSV or Excel file');
      setFile(null);
      return;
    }
    
    setFile(selectedFile);
  };
  
  const validateFile = async () => {
    if (!file) return;
    
    setIsUploading(true);
    setUploadProgress(10);
    
    // Simulate file validation process
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setUploadProgress(40);
      
      // Simulate validation results
      const mockValidationResult = {
        valid: true,
        errors: [] as string[],
        validCount: 5
      };
      
      // Add some simulated errors for demonstration
      const randomErrors = Math.random() > 0.5;
      if (randomErrors) {
        mockValidationResult.valid = false;
        mockValidationResult.errors = [
          'Row 3: Missing job title',
          'Row 7: Invalid employment type',
          'Row 12: Salary range format incorrect'
        ];
        mockValidationResult.validCount = 9; // Out of 12
      }
      
      setUploadProgress(70);
      await new Promise(resolve => setTimeout(resolve, 500));
      setUploadProgress(100);
      
      setValidationResults(mockValidationResult);
    } catch (error) {
      setFileError('Error validating file. Please try again.');
      toast({
        title: "Validation Failed",
        description: "There was an error validating your file. Please try again.",
        variant: "destructive"
      });
    } finally {
      setTimeout(() => {
        setIsUploading(false);
      }, 500);
    }
  };
  
  const processBulkUpload = async () => {
    if (!validationResults) return;
    
    setIsUploading(true);
    setUploadProgress(30);
    
    // Simulate processing
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setUploadProgress(60);
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      setUploadProgress(100);
      
      toast({
        title: "Upload Successful",
        description: `${validationResults.validCount} jobs have been uploaded successfully.`,
      });
      
      onSuccess(validationResults.validCount);
    } catch (error) {
      toast({
        title: "Upload Failed",
        description: "There was an error uploading your jobs. Please try again.",
        variant: "destructive"
      });
    } finally {
      setTimeout(() => {
        setIsUploading(false);
      }, 500);
    }
  };
  
  const resetForm = () => {
    setFile(null);
    setFileError(null);
    setValidationResults(null);
    setUploadProgress(0);
  };
  
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Bulk Upload Jobs</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}><X className="h-4 w-4" /></Button>
        </div>
        <CardDescription>
          Upload multiple jobs at once using a CSV or Excel file
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {!validationResults ? (
          <div className="space-y-6">
            <div>
              <p className="text-sm mb-4">
                To bulk upload jobs, please use our template and ensure all required fields are filled correctly.
              </p>
              
              <div className="flex flex-col gap-2 md:flex-row md:gap-4">
                <Button variant="outline" className="text-sm">
                  Download CSV Template
                </Button>
                <Button variant="outline" className="text-sm">
                  Download Excel Template
                </Button>
              </div>
            </div>
            
            <div className="border border-dashed border-gray-300 rounded-lg p-6 text-center">
              <div className="mb-4">
                <FileUp className="mx-auto h-12 w-12 text-gray-400" />
              </div>
              
              <p className="mb-2">Drag and drop your file here, or</p>
              
              <label htmlFor="file-upload" className="cursor-pointer">
                <span className="inline-block bg-primary text-primary-foreground rounded px-4 py-2 text-sm font-medium">
                  Browse Files
                </span>
                <Input 
                  id="file-upload" 
                  type="file" 
                  onChange={handleFileChange} 
                  accept=".csv,.xlsx,.xls"
                  className="sr-only"
                />
              </label>
              
              <p className="mt-2 text-xs text-gray-500">
                Accepted formats: .csv, .xlsx, .xls (max 10MB)
              </p>
            </div>
            
            {file && (
              <div className="flex items-center justify-between p-3 border rounded-md bg-muted/50">
                <div className="flex items-center gap-3">
                  <FileUp className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium text-sm">{file.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {(file.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 w-8 p-0"
                  onClick={() => setFile(null)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
            
            {fileError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                  {fileError}
                </AlertDescription>
              </Alert>
            )}
            
            {isUploading && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm mb-1">
                  <span>Validating file...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <Progress value={uploadProgress} className="h-2" />
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            <Alert variant={validationResults.valid ? "default" : "warning"} className="border-l-4">
              <div className="flex items-start gap-3">
                {validationResults.valid ? (
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-amber-500" />
                )}
                <div>
                  <AlertTitle className={validationResults.valid ? "text-green-600" : "text-amber-600"}>
                    {validationResults.valid 
                      ? "File Validation Successful" 
                      : "File Validation Complete with Issues"}
                  </AlertTitle>
                  <AlertDescription>
                    {validationResults.valid 
                      ? `All ${validationResults.validCount} jobs in your file are ready to be uploaded.`
                      : `${validationResults.validCount} out of ${validationResults.validCount + validationResults.errors.length} jobs are valid and ready to be uploaded. There are ${validationResults.errors.length} issues to resolve.`}
                  </AlertDescription>
                </div>
              </div>
            </Alert>
            
            {!validationResults.valid && validationResults.errors.length > 0 && (
              <div className="border rounded-md p-4">
                <h4 className="font-medium text-sm mb-2">Issues found:</h4>
                <ul className="space-y-1 text-sm">
                  {validationResults.errors.map((error, index) => (
                    <li key={index} className="text-red-600">{error}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {isUploading && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm mb-1">
                  <span>Processing upload...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <Progress value={uploadProgress} className="h-2" />
              </div>
            )}
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex flex-col sm:flex-row gap-3 justify-end border-t pt-4">
        {!validationResults ? (
          <>
            <Button variant="outline" onClick={onClose} disabled={isUploading}>
              Cancel
            </Button>
            <Button 
              onClick={validateFile} 
              disabled={!file || isUploading}
            >
              {isUploading && <Spinner className="mr-2 h-4 w-4" />}
              Validate File
            </Button>
          </>
        ) : (
          <>
            <Button variant="outline" onClick={resetForm} disabled={isUploading}>
              Back
            </Button>
            <Button 
              onClick={processBulkUpload} 
              disabled={!validationResults.valid && validationResults.validCount === 0 || isUploading}
            >
              {isUploading && <Spinner className="mr-2 h-4 w-4" />}
              {validationResults.valid 
                ? `Upload ${validationResults.validCount} Jobs`
                : `Upload ${validationResults.validCount} Valid Jobs`}
            </Button>
          </>
        )}
      </CardFooter>
    </Card>
  );
};

export default JobBulkUpload;
