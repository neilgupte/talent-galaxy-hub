
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface ProfileHeaderProps {
  title: string;
  description: string;
}

const ProfileHeader = ({ title, description }: ProfileHeaderProps) => {
  const navigate = useNavigate();
  
  return (
    <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-8">
      <div>
        <h1 className="text-3xl font-bold">{title}</h1>
        <p className="text-muted-foreground mt-2">{description}</p>
      </div>
      
      <div className="flex gap-4">
        <Button
          variant="outline"
          onClick={() => navigate('/dashboard/employer')}
        >
          Back to Dashboard
        </Button>
        
        <Button
          onClick={() => navigate('/jobs/post')}
        >
          Post a Job
        </Button>
      </div>
    </div>
  );
};

export default ProfileHeader;
