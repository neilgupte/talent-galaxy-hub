
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Building, Users, Globe, MapPin, Phone, Building2 } from 'lucide-react';

interface CompanyProfilePreviewProps {
  formData: {
    name: string;
    industry: string;
    website: string;
    logo: string;
    size: string;
    founded: string;
    location: string;
    phone: string;
    companyType: string;
  };
}

const CompanyProfilePreview = ({ formData }: CompanyProfilePreviewProps) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            {formData.logo ? (
              <img src={formData.logo} alt={formData.name} className="h-16 w-16 object-contain bg-white rounded-md border p-1" />
            ) : (
              <div className="h-16 w-16 bg-muted rounded-md flex items-center justify-center">
                <Building className="h-8 w-8 text-muted-foreground" />
              </div>
            )}
            
            <div>
              <h3 className="text-xl font-bold">{formData.name || 'Your Company'}</h3>
              <div className="flex flex-wrap text-muted-foreground text-sm gap-y-1 gap-x-4 mt-1">
                {formData.industry && (
                  <div className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    <span>{formData.industry}</span>
                  </div>
                )}
                
                {formData.location && (
                  <div className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    <span>{formData.location}</span>
                  </div>
                )}
                
                {formData.companyType && (
                  <div className="flex items-center gap-1">
                    <Building2 className="h-3 w-3" />
                    <span>{formData.companyType}</span>
                  </div>
                )}

                {formData.size && (
                  <div className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    <span>{formData.size}</span>
                  </div>
                )}
                
                {formData.website && (
                  <div className="flex items-center gap-1">
                    <Globe className="h-3 w-3" />
                    <span>{formData.website}</span>
                  </div>
                )}
                
                {formData.phone && (
                  <div className="flex items-center gap-1">
                    <Phone className="h-3 w-3" />
                    <span>{formData.phone}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <Button variant="ghost" size="sm">
            Preview Public Profile
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        <Separator className="my-4" />
        <div className="prose prose-sm max-w-none">
          <p>Industry: {formData.industry || 'No industry specified.'}</p>
          <p>Size: {formData.size || 'No company size specified.'}</p>
          <p>Founded: {formData.founded || 'No founding year provided.'}</p>
          <p>Location: {formData.location || 'No location provided.'}</p>
          <p>Contact: {formData.phone || 'No contact number provided.'}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default CompanyProfilePreview;
