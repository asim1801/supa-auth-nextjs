
import React from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/auth';

interface SignUpButtonProps {
  children?: React.ReactNode;
  className?: string;
  variant?: 'default' | 'outline' | 'ghost';
}

export function SignUpButton({ children = 'Sign up', className, variant = 'outline' }: SignUpButtonProps) {
  const { isSignedIn } = useAuth();

  if (isSignedIn) return null;

  const handleClick = () => {
    // In a real implementation, this would open a sign-up modal
    // For now, redirect to your sign-up page
    window.location.href = '/';
  };

  return (
    <Button onClick={handleClick} className={className} variant={variant}>
      {children}
    </Button>
  );
}
