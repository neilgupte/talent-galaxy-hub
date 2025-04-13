
import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChevronLeft } from 'lucide-react';

// Mock application data (replace with real data from API in production)
const mockApplications = [
  {
    id: 'app1',
    jobTitle: 'Senior Frontend Developer',
    companyName: 'Tech Solutions Inc',
    appliedDate: '2023-09-15',
    status: 'interview',
    matchPercentage: 85
  },
  {
    id: 'app2',
    jobTitle: 'UI/UX Designer',
    companyName: 'Creative Studios',
    appliedDate: '2023-09-10',
    status: 'under_review',
    matchPercentage: 75
  },
  {
    id: 'app3',
    jobTitle: 'Product Manager',
    companyName: 'Innovate Inc',
    appliedDate: '2023-09-05',
    status: 'rejected',
    matchPercentage: 60
  }
];

const ApplicationsPage: React.FC = () => {
  const navigate = useNavigate();

  const getStatusBadgeClass = (status: string) => {
    switch(status) {
      case 'interview':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100';
      case 'rejected':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100';
      case 'offered':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100';
      default:
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100';
    }
  };
  
  const getStatusText = (status: string) => {
    switch(status) {
      case 'interview':
        return 'Interview';
      case 'under_review':
        return 'Under Review';
      case 'rejected':
        return 'Not Selected';
      case 'offered':
        return 'Job Offered';
      default:
        return 'Applied';
    }
  };
  
  const getMatchBadgeClass = (percentage: number) => {
    if (percentage >= 80) return 'text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full';
    if (percentage >= 60) return 'text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded-full';
    return 'text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded-full';
  };
  
  return (
    <div className="container mx-auto py-8 px-4 max-w-5xl">
      <div className="mb-6">
        <Button variant="ghost" onClick={() => navigate(-1)} className="gap-1">
          <ChevronLeft className="h-4 w-4" />
          Back to Dashboard
        </Button>
      </div>

      <h1 className="text-3xl font-bold mb-6">Your Applications</h1>
      
      <Tabs defaultValue="all" className="space-y-6">
        <TabsList>
          <TabsTrigger value="all">All Applications</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="interview">Interviews</TabsTrigger>
          <TabsTrigger value="rejected">Not Selected</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>All Applications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {mockApplications.map((app) => (
                  <div key={app.id} className="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-4 last:border-0 last:pb-0 gap-2">
                    <div>
                      <h4 className="font-medium">{app.jobTitle}</h4>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                        <span>{app.companyName}</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <span className={`${getStatusBadgeClass(app.status)} text-xs px-2 py-1 rounded-full`}>
                          {getStatusText(app.status)}
                        </span>
                        <span className={getMatchBadgeClass(app.matchPercentage)}>
                          {app.matchPercentage}% Match
                        </span>
                        <span className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-2 py-1 rounded-full">
                          Applied on {new Date(app.appliedDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2 self-end sm:self-center mt-2 sm:mt-0">
                      <Button variant="outline" size="sm" className="border-primary text-primary" asChild>
                        <Link to={`/applications/${app.id}`}>View Application</Link>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="active">
          <Card>
            <CardHeader>
              <CardTitle>Active Applications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {mockApplications.filter(app => app.status === 'under_review').map((app) => (
                  <div key={app.id} className="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-4 last:border-0 last:pb-0 gap-2">
                    <div>
                      <h4 className="font-medium">{app.jobTitle}</h4>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                        <span>{app.companyName}</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <span className={`${getStatusBadgeClass(app.status)} text-xs px-2 py-1 rounded-full`}>
                          {getStatusText(app.status)}
                        </span>
                        <span className={getMatchBadgeClass(app.matchPercentage)}>
                          {app.matchPercentage}% Match
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2 self-end sm:self-center mt-2 sm:mt-0">
                      <Button variant="outline" size="sm" className="border-primary text-primary" asChild>
                        <Link to={`/applications/${app.id}`}>View Application</Link>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Similar code for the other tabs - interview and rejected */}
        <TabsContent value="interview">
          {/* Content for interview tab similar to active tab */}
          <Card>
            <CardHeader>
              <CardTitle>Interview Applications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockApplications.filter(app => app.status === 'interview').length > 0 ? (
                  mockApplications.filter(app => app.status === 'interview').map((app) => (
                    <div key={app.id} className="border-b pb-4 last:border-0">
                      <h4 className="font-medium">{app.jobTitle}</h4>
                      <p className="text-sm text-muted-foreground">{app.companyName}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Button variant="outline" size="sm" asChild>
                          <Link to={`/applications/${app.id}`}>View</Link>
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground">No interviews scheduled at the moment.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rejected">
          {/* Content for rejected tab similar to active tab */}
          <Card>
            <CardHeader>
              <CardTitle>Not Selected</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockApplications.filter(app => app.status === 'rejected').length > 0 ? (
                  mockApplications.filter(app => app.status === 'rejected').map((app) => (
                    <div key={app.id} className="border-b pb-4 last:border-0">
                      <h4 className="font-medium">{app.jobTitle}</h4>
                      <p className="text-sm text-muted-foreground">{app.companyName}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Button variant="outline" size="sm" asChild>
                          <Link to={`/applications/${app.id}`}>View</Link>
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground">No rejected applications.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ApplicationsPage;
