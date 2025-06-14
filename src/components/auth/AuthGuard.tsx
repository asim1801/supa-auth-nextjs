'use client'

import React, { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { authConfig } from '@/config/auth';

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requireEmailVerification?: boolean;
  fallbackPath?: string;
  loadingComponent?: React.ReactNode;
}

export function AuthGuard({ 
  children, 
  requireAuth = true,
  requireEmailVerification = false,
  fallbackPath,
  loadingComponent
}: AuthGuardProps) {
  const { user, isSignedIn, isLoaded } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoaded) return;

    // Redirect if auth is required but user is not signed in
    if (requireAuth && !isSignedIn) {
      const redirectPath = fallbackPath || authConfig.auth.redirectAfterSignOut;
      // Properly sanitize the redirect URL to prevent open redirect attacks
      const sanitizedFrom = pathname && pathname.startsWith('/') ? pathname : '/';
      router.push(`${redirectPath}?from=${encodeURIComponent(sanitizedFrom)}`);
      return;
    }

    // Redirect if user is signed in but auth is not required
    if (!requireAuth && isSignedIn) {
      const redirectPath = fallbackPath || authConfig.auth.redirectAfterSignIn;
      router.push(redirectPath);
      return;
    }
  }, [isLoaded, isSignedIn, requireAuth, fallbackPath, router, pathname]);

  // Show loading component while auth is loading
  if (!isLoaded) {
    return loadingComponent || (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  // Don't render children if redirecting
  if (requireAuth && !isSignedIn) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!requireAuth && isSignedIn) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  // Check email verification if required
  if (requireEmailVerification && user && !user.emailVerified) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Email Verification Required</h2>
          <p className="text-muted-foreground">Please verify your email to continue.</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
