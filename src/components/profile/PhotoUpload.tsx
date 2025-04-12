
import React, { useRef, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";

interface PhotoUploadProps {
  avatarUrl: string | null;
  username: string;
}

const PhotoUpload = ({ avatarUrl, username }: PhotoUploadProps) => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(avatarUrl || null);

  const handlePhotoClick = () => {
    fileInputRef.current?.click();
  };
  
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploadingPhoto(true);
      
      // Create a preview URL for the image
      const previewUrl = URL.createObjectURL(file);
      setPreviewImage(previewUrl);
      
      // In a real app, you would upload the file to a server here
      // For this demo, we'll simulate a file upload
      setTimeout(() => {
        setUploadingPhoto(false);
        
        toast({
          title: "Photo updated",
          description: "Your profile photo has been updated"
        });
      }, 1000);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <Avatar className="h-24 w-24 mb-2">
        <AvatarImage src={previewImage || ''} alt={username} />
        <AvatarFallback className="text-lg">
          {username ? username.charAt(0).toUpperCase() : 'U'}
        </AvatarFallback>
      </Avatar>
      
      <input
        type="file"
        accept="image/*"
        className="hidden"
        ref={fileInputRef}
        onChange={handlePhotoChange}
      />
      
      <Button 
        variant="outline" 
        size="sm" 
        type="button" 
        onClick={handlePhotoClick}
        disabled={uploadingPhoto}
      >
        {uploadingPhoto ? (
          <>
            <Upload className="h-4 w-4 mr-2 animate-spin" />
            Uploading...
          </>
        ) : (
          <>
            <Upload className="h-4 w-4 mr-2" />
            Upload Photo
          </>
        )}
      </Button>
    </div>
  );
};

export default PhotoUpload;
