
import { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";

export function useJobCard() {
  const { toast } = useToast();
  const [isSaved, setIsSaved] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  
  const formatSalary = (min?: number, max?: number) => {
    if (!min && !max) return 'Salary not specified';
    if (min && !max) return `£${min.toLocaleString()}+`;
    if (!min && max) return `Up to £${max.toLocaleString()}`;
    return `£${min?.toLocaleString()} - £${max?.toLocaleString()}`;
  };
  
  const handleSaveJob = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsSaved(!isSaved);
    
    toast({
      title: isSaved ? "Job removed from saved jobs" : "Job saved successfully",
      description: isSaved 
        ? "The job has been removed from your saved jobs list" 
        : "The job has been added to your saved jobs list",
    });
  };
  
  const handleShareJob = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // In a real app, this would open a share dialog
    toast({
      title: "Share job",
      description: "Sharing functionality would be implemented here",
    });
  };
  
  const handleHideJob = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsHidden(true);
    
    toast({
      title: "Job hidden",
      description: "This job has been hidden from your job search results",
      action: (
        <Button variant="outline" size="sm" onClick={() => setIsHidden(false)}>
          Undo
        </Button>
      ),
    });
  };

  return {
    isSaved,
    isHidden,
    formatSalary,
    handleSaveJob,
    handleShareJob,
    handleHideJob
  };
}

// Add Button type to avoid TypeScript errors
import { Button } from '@/components/ui/button';
