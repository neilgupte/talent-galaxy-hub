
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { JobAlert } from '@/types';
import CreateAlertForm from './CreateAlertForm';

interface AlertEditDialogProps {
  alert: JobAlert;
  onUpdate: (data: Partial<JobAlert>) => void;
  onCancel: () => void;
}

const AlertEditDialog: React.FC<AlertEditDialogProps> = ({
  alert,
  onUpdate,
  onCancel,
}) => {
  return (
    <Dialog open={true} onOpenChange={onCancel}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit Alert</DialogTitle>
          <DialogDescription>
            Update your job alert settings
          </DialogDescription>
        </DialogHeader>
        
        <CreateAlertForm
          initialData={alert}
          isEditing={true}
          onSubmit={onUpdate}
          onCancel={onCancel}
          isSubmitting={false}
        />
      </DialogContent>
    </Dialog>
  );
};

export default AlertEditDialog;
