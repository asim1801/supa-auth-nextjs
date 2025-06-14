
import React from 'react';
import { useAuth } from '@/lib/auth';

interface SignedOutProps {
  children: React.ReactNode;
}

export function SignedOut({ children }: SignedOutProps) {
  const { isSignedIn, isLoaded } = useAuth();

  if (!isLoaded) return null;
  if (isSignedIn) return null;

  return <>{children}</>;
}
