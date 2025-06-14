'use client'

import React, { useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Camera, Upload } from 'lucide-react';
import { useAuthActions } from '@/hooks/useAuthActions';
import { authConfig } from '@/config/auth';

interface AvatarUploadProps {
  user: {
    fullName: string | null;
    email: string;
    avatarUrl: string | null;
  };
}

export function AvatarUpload({ user }: AvatarUploadProps) {
  const { handleUpdateProfile, isLoading } = useAuthActions();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const initials = user.fullName
    ? user.fullName.split(' ').map(n => n[0]).join('').toUpperCase()
    : 'U';

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await handleUpdateProfile({ avatar: file });
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Profile Picture</CardTitle>
          <CardDescription>
            Upload a new profile picture. Max {authConfig.profile.maxAvatarSize / (1024 * 1024)}MB.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Avatar className="h-16 w-16">
                <AvatarImage src={user.avatarUrl || undefined} alt="Profile" />
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
              <Button
                size="icon"
                variant="outline"
                className="absolute -bottom-1 -right-1 h-8 w-8 rounded-full"
                onClick={() => fileInputRef.current?.click()}
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600" />
                ) : (
                  <Camera className="h-4 w-4" />
                )}
              </Button>
            </div>
            <Button
              onClick={() => fileInputRef.current?.click()}
              disabled={isLoading}
              variant="outline"
            >
              <Upload className="mr-2 h-4 w-4" />
              {isLoading ? "Uploading..." : "Upload New Picture"}
            </Button>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept={authConfig.profile.allowedAvatarTypes.join(',')}
            className="hidden"
            onChange={handleFileChange}
          />
        </CardContent>
      </Card>
    </>
  );
}
