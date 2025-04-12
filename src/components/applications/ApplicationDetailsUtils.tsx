
import { ApplicationStatus } from '@/types';
import { Badge } from '@/components/ui/badge';
import { 
  HelpCircle, 
  FileText, 
  CalendarClock, 
  MessageSquare, 
  XCircle, 
  CheckCircle 
} from 'lucide-react';

export const getStatusBadge = (status: ApplicationStatus) => {
  switch(status) {
    case 'pending':
      return <Badge variant="outline" className="bg-gray-100 text-gray-800">Pending</Badge>;
    case 'reviewing':
      return <Badge variant="outline" className="bg-blue-100 text-blue-800">Under Review</Badge>;
    case 'interview':
      return <Badge variant="outline" className="bg-purple-100 text-purple-800">Interview</Badge>;
    case 'offer':
      return <Badge variant="outline" className="bg-green-100 text-green-800">Offer</Badge>;
    case 'rejected':
      return <Badge variant="outline" className="bg-red-100 text-red-800">Rejected</Badge>;
    case 'accepted':
      return <Badge variant="outline" className="bg-emerald-100 text-emerald-800">Accepted</Badge>;
    case 'withdrawn':
      return <Badge variant="outline" className="bg-gray-100 text-gray-800">Withdrawn</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

export const getStatusIcon = (status: ApplicationStatus) => {
  switch(status) {
    case 'pending':
      return <HelpCircle className="h-5 w-5 text-gray-500" />;
    case 'reviewing':
      return <FileText className="h-5 w-5 text-blue-500" />;
    case 'interview':
      return <CalendarClock className="h-5 w-5 text-purple-500" />;
    case 'offer':
      return <MessageSquare className="h-5 w-5 text-green-500" />;
    case 'rejected':
      return <XCircle className="h-5 w-5 text-red-500" />;
    case 'accepted':
      return <CheckCircle className="h-5 w-5 text-emerald-500" />;
    case 'withdrawn':
      return <XCircle className="h-5 w-5 text-gray-500" />;
    default:
      return <HelpCircle className="h-5 w-5 text-gray-500" />;
  }
};
