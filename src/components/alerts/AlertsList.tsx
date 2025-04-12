
import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';
import { Bell, BellOff, Edit, Trash2, MoreVertical, Calendar, Clock } from 'lucide-react';

import { AlertFrequency, JobAlert } from '@/types';
import AlertEditDialog from './AlertEditDialog';
import AlertDeleteDialog from './AlertDeleteDialog';
import { format, parseISO } from 'date-fns';

interface AlertsListProps {
  alerts: JobAlert[];
  isLoading: boolean;
  onUpdate: (data: Partial<JobAlert> & { id: string }) => void;
  onDelete: (id: string) => void;
  emptyMessage?: string;
}

const AlertsList: React.FC<AlertsListProps> = ({
  alerts,
  isLoading,
  onUpdate,
  onDelete,
  emptyMessage = 'No alerts found',
}) => {
  const [editingAlert, setEditingAlert] = useState<JobAlert | null>(null);
  const [deleteAlertId, setDeleteAlertId] = useState<string | null>(null);

  const getFrequencyLabel = (frequency: AlertFrequency) => {
    switch (frequency) {
      case 'daily_am':
        return 'Daily (Morning)';
      case 'daily_pm':
        return 'Daily (Evening)';
      case 'weekly':
        return 'Weekly';
      case 'instant':
        return 'Instantly';
      default:
        return frequency;
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Never';
    try {
      return format(parseISO(dateString), 'MMM d, yyyy h:mm a');
    } catch (error) {
      return 'Invalid date';
    }
  };

  const handleToggleActive = (alert: JobAlert) => {
    onUpdate({
      id: alert.id,
      isActive: !alert.isActive,
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2].map(i => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <Skeleton className="h-5 w-3/4" />
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Skeleton className="h-4 w-1/2" />
                <div className="flex flex-wrap gap-2">
                  <Skeleton className="h-6 w-20" />
                  <Skeleton className="h-6 w-16" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (alerts.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {alerts.map(alert => (
        <Card key={alert.id}>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">
                {alert.keywords.join(', ')}
                {alert.location && ` in ${alert.location}`}
              </CardTitle>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreVertical className="h-4 w-4" />
                    <span className="sr-only">Actions</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => handleToggleActive(alert)}>
                    {alert.isActive ? (
                      <>
                        <BellOff className="h-4 w-4 mr-2" />
                        Pause Alert
                      </>
                    ) : (
                      <>
                        <Bell className="h-4 w-4 mr-2" />
                        Activate Alert
                      </>
                    )}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setEditingAlert(alert)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Alert
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-destructive"
                    onClick={() => setDeleteAlertId(alert.id)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Alert
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="bg-primary/10">
                  {getFrequencyLabel(alert.frequency)}
                </Badge>
                {alert.employmentTypes && alert.employmentTypes.length > 0 && (
                  <Badge variant="outline">
                    {alert.employmentTypes.join(', ')}
                  </Badge>
                )}
                {alert.jobLevels && alert.jobLevels.length > 0 && (
                  <Badge variant="outline">
                    {alert.jobLevels.join(', ')}
                  </Badge>
                )}
                {alert.salaryMin && alert.salaryMax && (
                  <Badge variant="outline">
                    ${alert.salaryMin.toLocaleString()} - ${alert.salaryMax.toLocaleString()}
                  </Badge>
                )}
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between text-sm text-muted-foreground gap-2">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  {alert.lastTriggeredAt ? (
                    <span>Last sent: {formatDate(alert.lastTriggeredAt)}</span>
                  ) : (
                    <span>Not triggered yet</span>
                  )}
                </div>
                {alert.isActive && alert.nextScheduledAt && (
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>Next scheduled: {formatDate(alert.nextScheduledAt)}</span>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
          <CardFooter className="border-t pt-4 flex justify-between">
            <Button
              variant={alert.isActive ? "default" : "outline"}
              size="sm"
              onClick={() => handleToggleActive(alert)}
            >
              {alert.isActive ? (
                <>
                  <BellOff className="h-4 w-4 mr-2" />
                  Pause Alert
                </>
              ) : (
                <>
                  <Bell className="h-4 w-4 mr-2" />
                  Activate Alert
                </>
              )}
            </Button>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setEditingAlert(alert)}
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => setDeleteAlertId(alert.id)}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </div>
          </CardFooter>
        </Card>
      ))}

      {editingAlert && (
        <AlertEditDialog
          alert={editingAlert}
          onUpdate={(updatedData) => {
            onUpdate({ id: editingAlert.id, ...updatedData });
            setEditingAlert(null);
          }}
          onCancel={() => setEditingAlert(null)}
        />
      )}

      {deleteAlertId && (
        <AlertDeleteDialog
          onConfirm={() => {
            onDelete(deleteAlertId);
            setDeleteAlertId(null);
          }}
          onCancel={() => setDeleteAlertId(null)}
        />
      )}
    </div>
  );
};

export default AlertsList;
