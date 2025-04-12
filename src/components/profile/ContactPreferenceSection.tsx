
import React from 'react';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { ContactPreference } from '@/types';

interface ContactPreferenceSectionProps {
  contactPreference: ContactPreference;
  onContactPreferenceChange: (value: string[]) => void;
}

const ContactPreferenceSection = ({ 
  contactPreference, 
  onContactPreferenceChange 
}: ContactPreferenceSectionProps) => {
  return (
    <div className="space-y-2">
      <Label>Contact Preferences</Label>
      <p className="text-xs text-muted-foreground mb-2">
        How should recruiters contact you?
      </p>
      <div className="flex flex-col space-y-2">
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="contact-email" 
            checked={contactPreference === 'email' || contactPreference === 'both'} 
            onCheckedChange={(checked) => {
              const current = contactPreference === 'email' || contactPreference === 'both' ? ['email'] : [];
              const phone = contactPreference === 'phone' || contactPreference === 'both' ? ['phone'] : [];
              const newValue = checked ? [...phone, 'email'] : phone;
              onContactPreferenceChange(newValue);
            }}
          />
          <Label htmlFor="contact-email" className="font-normal">Email</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="contact-phone" 
            checked={contactPreference === 'phone' || contactPreference === 'both'} 
            onCheckedChange={(checked) => {
              const current = contactPreference === 'phone' || contactPreference === 'both' ? ['phone'] : [];
              const email = contactPreference === 'email' || contactPreference === 'both' ? ['email'] : [];
              const newValue = checked ? [...email, 'phone'] : email;
              onContactPreferenceChange(newValue);
            }}
          />
          <Label htmlFor="contact-phone" className="font-normal">Phone</Label>
        </div>
      </div>
    </div>
  );
};

export default ContactPreferenceSection;
