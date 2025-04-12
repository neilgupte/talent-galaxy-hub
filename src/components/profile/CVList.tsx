
import React from 'react';
import { Label } from '@/components/ui/label';
import { RadioGroup } from '@/components/ui/radio-group';
import { FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CV } from '@/types';
import CVListItem from './CVListItem';

interface CVListProps {
  cvs: CV[];
  selectedCVId: string | null;
  analyzingCV: string | null;
  analysisReports: Record<string, any>;
  onSelectCV: (id: string) => void;
  onDownloadCV: (cv: CV) => void;
  onDeleteCV: (id: string) => void;
  onAICheckCV: (id: string) => void;
  onUploadClick: () => void;
}

const CVList: React.FC<CVListProps> = ({
  cvs,
  selectedCVId,
  analyzingCV,
  analysisReports,
  onSelectCV,
  onDownloadCV,
  onDeleteCV,
  onAICheckCV,
  onUploadClick
}) => {
  if (cvs.length === 0) {
    return (
      <div className="text-center py-6">
        <FileText className="h-10 w-10 mx-auto mb-2 text-muted-foreground" />
        <h3 className="text-lg font-medium mb-1">No CVs uploaded</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Upload your CV to apply for jobs more quickly.
        </p>
        <Button onClick={onUploadClick}>Upload your first CV</Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Label className="block mb-2">Your CVs</Label>
      <RadioGroup value={selectedCVId || undefined} onValueChange={onSelectCV}>
        {cvs.map((cv) => (
          <CVListItem 
            key={cv.id}
            cv={cv}
            isSelected={cv.id === selectedCVId}
            isAnalyzing={cv.id === analyzingCV}
            hasAnalysisReport={!!analysisReports[cv.id]}
            onSelect={() => onSelectCV(cv.id)}
            onDownload={() => onDownloadCV(cv)}
            onDelete={() => onDeleteCV(cv.id)}
            onAICheck={() => onAICheckCV(cv.id)}
            analysisReport={analysisReports[cv.id]}
          />
        ))}
      </RadioGroup>
    </div>
  );
};

export default CVList;
