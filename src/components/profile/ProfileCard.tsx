
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Mail, Calendar, CheckCircle, XCircle } from 'lucide-react';

interface ProfileCardProps {
  user: {
    id: string;
    email: string;
    fullName: string | null;
    avatarUrl: string | null;
    emailVerified: boolean;
    createdAt: string;
  };
  showHeader?: boolean;
  title?: string;
  description?: string;
  className?: string;
}

export function ProfileCard({ 
  user, 
  showHeader = true, 
  title = "Profile Information",
  description = "Your account details and verification status",
  className 
}: ProfileCardProps) {
  const initials = user.fullName
    ? user.fullName.split(' ').map(n => n[0]).join('').toUpperCase()
    : user.email[0].toUpperCase();

  const joinDate = new Date(user.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <Card className={className}>
      {showHeader && (
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
      )}
      <CardContent className="space-y-6">
        <div className="flex items-center space-x-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={user.avatarUrl || undefined} alt="Profile" />
            <AvatarFallback className="text-lg">{initials}</AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <h3 className="text-lg font-medium">{user.fullName || 'User'}</h3>
            <div className="flex items-center space-x-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">{user.email}</span>
            </div>
          </div>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Email Verification</span>
            <Badge variant={user.emailVerified ? 'default' : 'secondary'} className="flex items-center space-x-1">
              {user.emailVerified ? (
                <CheckCircle className="h-3 w-3" />
              ) : (
                <XCircle className="h-3 w-3" />
              )}
              <span>{user.emailVerified ? 'Verified' : 'Unverified'}</span>
            </Badge>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Member Since</span>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>{joinDate}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
