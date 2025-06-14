
import React from 'react';
import { useAuth } from '@/lib/auth';

interface SignedInProps {
  children: React.ReactNode;
}

export function SignedIn({ children }: SignedInProps) {
  const { isSignedIn, isLoaded } = useAuth();

  if (!isLoaded) return null;
  if (!isSignedIn) return null;

  return <>{children}</>;
}
