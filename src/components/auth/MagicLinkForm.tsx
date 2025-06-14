'use client'

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/lib/auth';
import { useToast } from '@/hooks/use-toast';
import { Mail } from 'lucide-react';

interface MagicLinkFormProps {
  onSuccess?: () => void;
  showHeader?: boolean;
  title?: string;
  description?: string;
  className?: string;
}

export function MagicLinkForm({ 
  onSuccess, 
  showHeader = true, 
  title = "Sign in with Magic Link",
  description = "Enter your email to receive a sign-in link",
  className 
}: MagicLinkFormProps) {
  const { signInWithMagicLink, isConfigured } = useAuth();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isConfigured) {
      toast({
        title: "Demo Mode",
        description: "Please configure Supabase credentials to enable magic link authentication.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      await signInWithMagicLink(email);
      setIsEmailSent(true);
      toast({
        title: "Magic link sent!",
        description: "Check your email for a sign-in link.",
      });
      onSuccess?.();
    } catch (error: any) {
      toast({
        title: "Failed to send magic link",
        description: error.message || "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const form = (
    <div className="space-y-4">
      {!isEmailSent ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="magic-email">Email</Label>
            <Input
              id="magic-email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>Sending magic link...</>
            ) : (
              <>
                <Mail className="mr-2 h-4 w-4" />
                Send Magic Link
              </>
            )}
          </Button>
        </form>
      ) : (
        <div className="text-center space-y-4">
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
            <Mail className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <h3 className="font-semibold text-green-800 dark:text-green-200">Magic link sent!</h3>
            <p className="text-sm text-green-600 dark:text-green-300">
              Check your email and click the link to sign in.
            </p>
          </div>
          <Button 
            variant="outline" 
            onClick={() => {
              setIsEmailSent(false);
              setEmail('');
            }}
            className="w-full"
          >
            Send another link
          </Button>
        </div>
      )}
    </div>
  );

  if (!showHeader) {
    return <div className={className}>{form}</div>;
  }

  return (
    <Card className={className}>
      <CardHeader className="text-center">
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {form}
      </CardContent>
    </Card>
  );
}
