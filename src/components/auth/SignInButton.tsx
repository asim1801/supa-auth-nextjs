
import React from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/auth';

interface SignInButtonProps {
  children?: React.ReactNode;
  className?: string;
}

export function SignInButton({ children = 'Sign in', className }: SignInButtonProps) {
  const { isSignedIn } = useAuth();

  if (isSignedIn) return null;

  const handleClick = () => {
    // In a real implementation, this would open a sign-in modal
    // For now, redirect to your sign-in page
    window.location.href = '/';
  };

  return (
    <Button onClick={handleClick} className={className}>
      {children}
    </Button>
  );
}
