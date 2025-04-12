
import React, { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { AlertTriangle } from 'lucide-react';
import { CV } from '@/types';
import { generateAnalysisReport } from '@/utils/cvAnalysisUtils';
import CVUploadSection from './CVUploadSection';
import CVList from './CVList';
import CVAnalysisNotification from './CVAnalysisNotification';

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
  const { toast } = useToast();
  const [selectedCV, setSelectedCV] = useState<string | null>(
    cvs.find(cv => cv.isDefault)?.id || (cvs.length > 0 ? cvs[0].id : null)
  );
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [analyzingCV, setAnalyzingCV] = useState<string | null>(null);
  const [analysisReports, setAnalysisReports] = useState<Record<string, any>>({});
  const [showAnalysisComplete, setShowAnalysisComplete] = useState(false);
  const [currentAnalysisCV, setCurrentAnalysisCV] = useState<string>('');

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleDownload = (cv: CV) => {
    // In a real implementation, this would download the file from the URL
    toast({
      title: "Download started",
      description: `Downloading ${cv.fileName}...`,
    });
  };

  const handleAICheck = (cvId: string) => {
    const cv = cvs.find(cv => cv.id === cvId);
    if (!cv) return;
    
    setAnalyzingCV(cvId);
    setCurrentAnalysisCV(cv.fileName);
    
    // In a real implementation, this would call the AI check API
    if (onAICheck) {
      onAICheck(cvId);
    }
    
    // Simulate analysis with a timeout
    setTimeout(() => {
      const report = generateAnalysisReport(cv.fileName);
      
      setAnalysisReports({
        ...analysisReports,
        [cvId]: report
      });
      
      setAnalyzingCV(null);
      setShowAnalysisComplete(true);
      
      toast({
        title: "AI check complete",
        description: "We've analyzed your CV and generated suggestions for improvement.",
      });
      
      // Auto-hide after 8 seconds
      setTimeout(() => {
        setShowAnalysisComplete(false);
      }, 8000);
    }, 2000);
  };
  
  const handleDownloadReport = () => {
    const currentCVId = analyzingCV || selectedCV;
    if (!currentCVId) return;
    
    const cv = cvs.find(cv => cv.id === currentCVId);
    if (!cv) return;
    
    const report = analysisReports[currentCVId];
    if (!report) return;
    
    // Use the utility function from the imported file
    const { downloadAnalysisReport } = require('@/utils/cvAnalysisUtils');
    downloadAnalysisReport(currentCVId, report.fileName, report.content);
    
    toast({
      title: "Downloading Analysis Report",
      description: `${report.fileName} is being downloaded.`
    });
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
        <CVUploadSection onCVUpload={onCVUpload} />
        
        <CVList 
          cvs={cvs}
          selectedCVId={selectedCV}
          analyzingCV={analyzingCV}
          analysisReports={analysisReports}
          onSelectCV={(id) => {
            setSelectedCV(id);
            onSetDefaultCV(id);
          }}
          onDownloadCV={handleDownload}
          onDeleteCV={onCVDelete}
          onAICheckCV={handleAICheck}
          onUploadClick={handleUploadClick}
        />
      </CardContent>
      <CardFooter className="border-t px-6 py-4">
        <div className="flex items-start text-sm text-muted-foreground">
          <AlertTriangle className="h-4 w-4 mr-2 mt-0.5" />
          <p>
            You can upload multiple versions of your CV and choose which one to use for each job application.
          </p>
        </div>
      </CardFooter>
      
      {showAnalysisComplete && (
        <CVAnalysisNotification 
          cvFileName={currentAnalysisCV}
          onClose={() => setShowAnalysisComplete(false)}
          onDownload={handleDownloadReport}
          hasReport={!!Object.keys(analysisReports).some(id => 
            id === analyzingCV || id === selectedCV
          )}
        />
      )}
    </Card>
  );
};

export default CVManager;
