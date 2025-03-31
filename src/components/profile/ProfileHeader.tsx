
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface ProfileHeaderProps {
  completeness: number;
}

const ProfileHeader = ({ completeness }: ProfileHeaderProps) => {
  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Create Your Profile</h1>
        <p className="text-muted-foreground">
          Complete your profile to improve your job matches and get discovered by employers
        </p>
      </div>
      
      <Card className="mb-6">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Profile Completeness</CardTitle>
          <CardDescription>Fill out your profile to improve your matches</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>{completeness}% complete</span>
              <span className="text-muted-foreground">
                {completeness < 100 ? 'Complete your profile' : 'Profile complete!'}
              </span>
            </div>
            <Progress value={completeness} className="h-2" />
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default ProfileHeader;
