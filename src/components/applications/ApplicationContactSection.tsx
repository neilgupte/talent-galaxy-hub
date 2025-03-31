
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { User } from '@/types';

interface ApplicationContactSectionProps {
  user: User | null;
  phoneNumber: string;
  setPhoneNumber: (value: string) => void;
}

const ApplicationContactSection = ({ user, phoneNumber, setPhoneNumber }: ApplicationContactSectionProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Contact Information</CardTitle>
        <CardDescription>
          We'll use this information to contact you about your application.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="fullName">Full Name</Label>
            <Input 
              id="fullName" 
              value={user?.name || ''} 
              disabled 
              className="bg-muted" 
            />
            <p className="text-xs text-muted-foreground mt-1">
              This comes from your profile
            </p>
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input 
              id="email" 
              type="email" 
              value={user?.email || ''} 
              disabled 
              className="bg-muted" 
            />
            <p className="text-xs text-muted-foreground mt-1">
              This comes from your account
            </p>
          </div>
        </div>
        
        <div>
          <Label htmlFor="phoneNumber">Phone Number</Label>
          <Input 
            id="phoneNumber" 
            type="tel" 
            placeholder="(555) 555-5555" 
            value={phoneNumber} 
            onChange={(e) => setPhoneNumber(e.target.value)} 
            required 
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default ApplicationContactSection;
