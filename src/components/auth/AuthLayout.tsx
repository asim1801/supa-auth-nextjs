
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { authConfig } from '@/config/auth';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  description?: string;
  showLogo?: boolean;
}

export function AuthLayout({ children, title, description, showLogo = true }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-md space-y-6">
        {showLogo && (
          <div className="text-center">
            <h1 className="text-2xl font-bold">{authConfig.app.name}</h1>
            <p className="text-muted-foreground">{authConfig.app.description}</p>
          </div>
        )}
        
        <Card>
          <CardHeader className="text-center">
            <CardTitle>{title}</CardTitle>
            {description && <CardDescription>{description}</CardDescription>}
          </CardHeader>
          <CardContent>
            {children}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
