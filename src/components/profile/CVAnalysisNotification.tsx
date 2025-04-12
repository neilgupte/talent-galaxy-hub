
import React from 'react';
import { Button } from '@/components/ui/button';
import { Check, Download, X } from 'lucide-react';

interface CVAnalysisNotificationProps {
  cvFileName: string;
  onClose: () => void;
  onDownload: () => void;
  hasReport: boolean;
}

const CVAnalysisNotification: React.FC<CVAnalysisNotificationProps> = ({ 
  cvFileName, 
  onClose, 
  onDownload,
  hasReport 
}) => {
  return (
    <div className="fixed bottom-4 right-4 left-4 md:left-auto md:w-96 bg-white dark:bg-gray-800 rounded-lg shadow-lg border p-4 z-50 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="bg-green-100 dark:bg-green-900 p-2 rounded-full">
          <Check className="h-5 w-5 text-green-600 dark:text-green-400" />
        </div>
        <div>
          <p className="font-medium">CV Analysis Complete</p>
          <p className="text-sm text-muted-foreground">
            "{cvFileName}" has been analyzed
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button 
          variant="outline"
          size="sm"
          onClick={onDownload}
          disabled={!hasReport}
        >
          <Download className="h-4 w-4 mr-1" />
          Download Report
        </Button>
        <Button 
          variant="ghost"
          size="icon"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </Button>
      </div>
    </div>
  );
};

export default CVAnalysisNotification;
