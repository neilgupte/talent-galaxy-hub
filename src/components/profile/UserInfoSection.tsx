
import React from 'react';
import { User } from '@/types';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface UserInfoSectionProps {
  user: User | null;
  phone: string;
  onPhoneChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const UserInfoSection = ({ user, phone, onPhoneChange }: UserInfoSectionProps) => {
  return (
    <div className="flex-1 space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Full Name</Label>
        <Input id="name" value={user?.name || ''} disabled />
        <p className="text-xs text-muted-foreground">
          Your name comes from your account information
        </p>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" value={user?.email || ''} disabled />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="phone">Phone Number</Label>
        <Input
          id="phone"
          name="phone"
          placeholder="e.g. +44 7123 456789"
          value={phone}
          onChange={onPhoneChange}
        />
      </div>
    </div>
  );
};

export default UserInfoSection;
