
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Building, Image } from 'lucide-react';

interface BrandingTabProps {
  formData: {
    logo: string;
  };
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  setActiveTab: (tab: string) => void;
}

const BrandingTab = ({
  formData,
  handleInputChange,
  setActiveTab
}: BrandingTabProps) => {
  return (
    <>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Image className="h-5 w-5" />
          Branding
        </CardTitle>
        <CardDescription>
          Add your company logo and website
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="logo" className="block">Company Logo URL</Label>
          <Input
            id="logo"
            name="logo"
            value={formData.logo}
            onChange={handleInputChange}
            placeholder="https://example.com/logo.png"
          />
          <p className="text-sm text-muted-foreground">Enter a direct link to your company logo image</p>
        </div>
        
        <div className="bg-muted p-4 rounded-md">
          <h4 className="font-medium mb-2">Logo Preview</h4>
          <div className="bg-white rounded-md p-6 flex items-center justify-center border">
            {formData.logo ? (
              <img src={formData.logo} alt="Company logo" className="max-h-24 max-w-full object-contain" />
            ) : (
              <div className="text-center text-muted-foreground">
                <Building className="h-12 w-12 mx-auto mb-2" />
                <p>Add a logo URL above to see preview</p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button type="button" variant="ghost" onClick={() => setActiveTab('details')}>Previous</Button>
        <Button type="button" onClick={() => setActiveTab('contact')}>Next: Contact Information</Button>
      </CardFooter>
    </>
  );
};

export default BrandingTab;
