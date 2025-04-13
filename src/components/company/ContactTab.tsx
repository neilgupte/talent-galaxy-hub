
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Phone } from 'lucide-react';
import { Spinner } from '@/components/ui/spinner';

interface ContactTabProps {
  formData: {
    email: string;
    phone: string;
  };
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  setActiveTab: (tab: string) => void;
  isSaving: boolean;
}

const ContactTab = ({
  formData,
  handleInputChange,
  setActiveTab,
  isSaving
}: ContactTabProps) => {
  return (
    <>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Phone className="h-5 w-5" />
          Contact Information
        </CardTitle>
        <CardDescription>
          Add contact details for your company
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="email" className="block">Contact Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="careers@example.com"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="phone" className="block">Contact Phone</Label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleInputChange}
            placeholder="+44 (0) 20 7123 4567"
          />
        </div>
      </CardContent>
      <CardFooter>
        <div className="w-full flex flex-col sm:flex-row gap-4 justify-between">
          <Button type="button" variant="ghost" onClick={() => setActiveTab('branding')}>Previous</Button>
          <div className="flex gap-4">
            <Button type="button" variant="outline" onClick={() => window.history.back()}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? <><Spinner size="sm" className="mr-2" /> Saving...</> : 'Save Profile'}
            </Button>
          </div>
        </div>
      </CardFooter>
    </>
  );
};

export default ContactTab;
