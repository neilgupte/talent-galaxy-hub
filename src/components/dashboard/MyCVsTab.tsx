
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Upload, FileText, Download, Check, X, RefreshCcw, Trash2, PlusCircle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { CV } from '@/types';

// Mock data for demonstration
const mockCVs: CV[] = [
  {
    id: 'cv1',
    userId: 'user1',
    fileName: 'John_Smith_CV_2023.pdf',
    fileUrl: '#',
    uploadDate: '2023-10-15',
    isDefault: true
  },
  {
    id: 'cv2',
    userId: 'user1',
    fileName: 'John_Smith_Technical_CV.pdf',
    fileUrl: '#',
    uploadDate: '2023-09-01',
    isDefault: false
  }
];

// Mock analysis results
const generateAnalysisReport = (cvName: string) => {
  return {
    fileName: `${cvName.split('.')[0]}_Analysis.pdf`,
    content: `
    CV Analysis Report for ${cvName}
    
    Strengths:
    - Good education section with relevant qualifications
    - Clear work history with quantifiable achievements
    - Technical skills clearly articulated
    
    Areas for Improvement:
    - Consider adding a more impactful professional summary
    - Quantify more achievements with specific metrics
    - Tailor skills section to match job descriptions more closely
    
    Recommendations:
    1. Add more keywords related to your target industry
    2. Reorganize experience to highlight most relevant achievements first
    3. Use action verbs at the beginning of each bullet point
    4. Include relevant certifications prominently
    
    Analysis Score: 78/100
    `,
    date: new Date().toISOString()
  };
};

const MyCVsTab = () => {
  const { toast } = useToast();
  const [cvs, setCvs] = useState<CV[]>(mockCVs);
  const [uploadingCV, setUploadingCV] = useState(false);
  const [analyzingCV, setAnalyzingCV] = useState<string | null>(null);
  const [analysisReports, setAnalysisReports] = useState<Record<string, any>>({});
  const [showAnalysisComplete, setShowAnalysisComplete] = useState(false);
  const [currentAnalysisCV, setCurrentAnalysisCV] = useState<string>('');
  
  const handleCVUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadingCV(true);
      
      // Simulate upload process
      setTimeout(() => {
        const file = e.target.files![0];
        const newCV: CV = {
          id: `cv${Date.now()}`,
          userId: 'user1',
          fileName: file.name,
          fileUrl: '#',
          uploadDate: new Date().toISOString().split('T')[0],
          isDefault: cvs.length === 0 // Make default if it's the first CV
        };
        
        setCvs([...cvs, newCV]);
        setUploadingCV(false);
        
        toast({
          title: "CV uploaded successfully",
          description: `${file.name} has been added to your CVs.`
        });
      }, 1500);
    }
  };
  
  const handleSetDefault = (cvId: string) => {
    setCvs(cvs.map(cv => ({
      ...cv,
      isDefault: cv.id === cvId
    })));
    
    toast({
      title: "Default CV updated",
      description: "This CV will be used as default for your applications."
    });
  };
  
  const handleDelete = (cvId: string) => {
    setCvs(cvs.filter(cv => cv.id !== cvId));
    
    toast({
      title: "CV deleted",
      description: "The CV has been removed from your profile."
    });
  };
  
  const handleAnalyze = (cvId: string) => {
    const cv = cvs.find(cv => cv.id === cvId);
    if (!cv) return;
    
    setAnalyzingCV(cvId);
    setCurrentAnalysisCV(cv.fileName);
    
    // Simulate analysis process
    setTimeout(() => {
      const report = generateAnalysisReport(cv.fileName);
      
      setAnalysisReports({
        ...analysisReports,
        [cvId]: report
      });
      
      setAnalyzingCV(null);
      setShowAnalysisComplete(true);
      
      toast({
        title: "CV Analysis Complete",
        description: "We've analyzed your CV and generated suggestions for improvement."
      });
      
      // Auto-hide the analysis complete notification after 8 seconds
      setTimeout(() => {
        setShowAnalysisComplete(false);
      }, 8000);
    }, 2000);
  };
  
  const handleDownload = (cv: CV) => {
    toast({
      title: "Downloading CV",
      description: `${cv.fileName} is being downloaded.`
    });
    
    // In a real implementation, this would trigger the actual download
  };
  
  const handleDownloadReport = (cvId: string) => {
    const report = analysisReports[cvId];
    if (!report) return;
    
    // Create a Blob from the text content
    const blob = new Blob([report.content], { type: 'text/plain' });
    
    // Create a URL for the Blob
    const url = URL.createObjectURL(blob);
    
    // Create a temporary anchor element
    const a = document.createElement('a');
    a.href = url;
    a.download = report.fileName;
    
    // Programmatically click the anchor to trigger download
    document.body.appendChild(a);
    a.click();
    
    // Clean up
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Downloading Analysis Report",
      description: `${report.fileName} is being downloaded.`
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>My CVs</CardTitle>
        <CardDescription>
          Manage your CV versions for different job applications
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <div className="border-2 border-dashed rounded-lg p-6 text-center">
            <div className="mb-4">
              <Upload className="h-10 w-10 mx-auto text-muted-foreground" />
            </div>
            
            <p className="text-muted-foreground mb-4">
              Drag and drop your CV file here, or click to browse
            </p>
            
            <div className="flex justify-center">
              <Button variant="outline" className="relative" disabled={uploadingCV}>
                <input
                  type="file"
                  className="absolute inset-0 opacity-0 w-full cursor-pointer"
                  accept=".pdf,.doc,.docx"
                  onChange={handleCVUpload}
                  disabled={uploadingCV}
                />
                {uploadingCV ? 'Uploading...' : 'Browse Files'}
              </Button>
            </div>
          </div>
        </div>
        
        {cvs.length > 0 ? (
          <div className="space-y-4">
            <h3 className="font-medium text-sm mb-2">Your CVs ({cvs.length})</h3>
            {cvs.map((cv) => (
              <div key={cv.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border rounded-md">
                <div className="flex items-center gap-3 mb-3 sm:mb-0">
                  <FileText className="h-10 w-10 text-primary" />
                  <div>
                    <p className="font-medium">{cv.fileName}</p>
                    <p className="text-xs text-muted-foreground">
                      Uploaded on {new Date(cv.uploadDate).toLocaleDateString()}
                    </p>
                    <div className="flex gap-2 mt-1">
                      {cv.isDefault && (
                        <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">
                          <Check className="h-3 w-3 mr-1" /> Default
                        </Badge>
                      )}
                      {analysisReports[cv.id] && (
                        <Badge variant="outline" className="text-blue-600 border-blue-200 bg-blue-50">
                          <Check className="h-3 w-3 mr-1" /> Analyzed
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDownload(cv)}
                  >
                    <Download className="h-4 w-4 mr-1" />
                    Download
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleAnalyze(cv.id)}
                    disabled={analyzingCV === cv.id}
                  >
                    {analyzingCV === cv.id ? (
                      <>
                        <RefreshCcw className="h-4 w-4 mr-1 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Check className="h-4 w-4 mr-1" />
                        AI Check
                      </>
                    )}
                  </Button>
                  
                  {analysisReports[cv.id] && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownloadReport(cv.id)}
                    >
                      <Download className="h-4 w-4 mr-1" />
                      Download Report
                    </Button>
                  )}
                  
                  {!cv.isDefault && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSetDefault(cv.id)}
                    >
                      <PlusCircle className="h-4 w-4 mr-1" />
                      Set Default
                    </Button>
                  )}
                  
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-destructive hover:text-destructive"
                    onClick={() => handleDelete(cv.id)}
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center p-6 border rounded-md">
            <p className="text-muted-foreground">
              You haven't uploaded any CVs yet. Upload your first CV to get started.
            </p>
          </div>
        )}
      </CardContent>
      
      {/* Analysis Complete Toast/Overlay */}
      {showAnalysisComplete && (
        <div className="fixed bottom-4 right-4 left-4 md:left-auto md:w-96 bg-white dark:bg-gray-800 rounded-lg shadow-lg border p-4 z-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-green-100 dark:bg-green-900 p-2 rounded-full">
              <Check className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="font-medium">CV Analysis Complete</p>
              <p className="text-sm text-muted-foreground">
                "{currentAnalysisCV}" has been analyzed
              </p>
            </div>
          </div>
          <Button 
            variant="ghost"
            size="sm"
            onClick={() => setShowAnalysisComplete(false)}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Button>
        </div>
      )}
    </Card>
  );
};

export default MyCVsTab;
