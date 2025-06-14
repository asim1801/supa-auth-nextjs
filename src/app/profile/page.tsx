import React from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { ProfileForm } from '@/components/profile/ProfileForm';
import { AvatarUpload } from '@/components/profile/AvatarUpload';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { User, Mail, Shield, Calendar } from 'lucide-react';
import { ChangePasswordForm } from '@/components/profile/ChangePasswordForm';
import { Badge } from '@/components/ui/badge';

export default function ProfilePage() {
  // Demo user data
  const demoUser = {
    id: 'demo-user-123',
    email: 'demo@example.com',
    fullName: 'Alex Demo User',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    emailVerified: true,
    createdAt: '2024-01-15T10:30:00Z'
  } as const;

  const initials = demoUser.fullName
    ? demoUser.fullName.split(' ').map(n => n[0]).join('').toUpperCase()
    : 'DU';

  return (
    <DashboardLayout>
      <div className="p-6 max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Profile Settings</h1>
          <p className="text-muted-foreground">
            Manage your account settings and preferences.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Overview */}
          <Card>
            <CardHeader>
              <CardTitle>Profile Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col items-center space-y-4">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={demoUser.avatarUrl} alt="Profile" />
                  <AvatarFallback className="text-lg">{initials}</AvatarFallback>
                </Avatar>
                <div className="text-center space-y-1">
                  <h3 className="font-semibold">{demoUser.fullName}</h3>
                  <p className="text-sm text-muted-foreground">{demoUser.email}</p>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Member since {new Date(demoUser.createdAt).getFullYear()}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <Badge variant="default" className="text-xs">
                    Email verified
                  </Badge>
                </div>
                <div className="flex items-center space-x-2">
                  <Shield className="h-4 w-4 text-muted-foreground" />
                  <Badge variant="secondary" className="text-xs">
                    2FA Enabled
                  </Badge>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Last login: Today</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="lg:col-span-2 space-y-6">
            <ProfileForm user={demoUser} />
            <AvatarUpload user={demoUser} />
            <ChangePasswordForm />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
} 