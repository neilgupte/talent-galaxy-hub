
import React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroupItem } from '@/components/ui/radio-group';
import { CV } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { AlertTriangle, Check, Download, FileText, Trash2 } from 'lucide-react';
import { downloadAnalysisReport } from '@/utils/cvAnalysisUtils';

interface CVListItemProps {
  cv: CV;
  isSelected: boolean;
  isAnalyzing: boolean;
  hasAnalysisReport: boolean;
  onSelect: () => void;
  onDownload: () => void;
  onDelete: () => void;
  onAICheck: () => void;
  analysisReport?: any;
}

const CVListItem: React.FC<CVListItemProps> = ({
  cv,
  isSelected,
  isAnalyzing,
  hasAnalysisReport,
  onSelect,
  onDownload,
  onDelete,
  onAICheck,
  analysisReport
}) => {
  const { toast } = useToast();

  const handleDownloadReport = () => {
    if (!analysisReport) return;
    
    downloadAnalysisReport(cv.id, analysisReport.fileName, analysisReport.content);
    
    toast({
      title: "Downloading Analysis Report",
      description: `${analysisReport.fileName} is being downloaded.`
    });
  };

  return (
    <div className="flex flex-col space-y-2">
      <div className="flex items-center justify-between border rounded-md p-3">
        <div className="flex items-center space-x-3">
          <RadioGroupItem value={cv.id} id={cv.id} onClick={onSelect} />
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
          {hasAnalysisReport && (
            <span className="bg-blue-100 text-blue-700 text-xs rounded-full px-2 py-1 flex items-center">
              <Check className="h-3 w-3 mr-1" /> Analyzed
            </span>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onDownload}
          >
            <Download className="h-4 w-4" />
            <span className="sr-only">Download</span>
          </Button>
          
          {isAnalyzing ? (
            <Button
              variant="outline"
              size="sm"
              disabled
            >
              <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full" />
              <span className="sr-only">Analyzing</span>
            </Button>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={onAICheck}
            >
              <AlertTriangle className="h-4 w-4" />
              <span className="sr-only">AI Check</span>
            </Button>
          )}
          
          {hasAnalysisReport && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownloadReport}
            >
              <Download className="h-4 w-4" />
              <span className="ml-2 hidden sm:inline">Report</span>
            </Button>
          )}
          
          <Button
            variant="outline"
            size="sm"
            onClick={onDelete}
          >
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">Delete</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CVListItem;
