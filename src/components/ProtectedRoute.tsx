
import React from 'react';
import { AuthGuard } from '@/components/auth/AuthGuard';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  return <AuthGuard>{children}</AuthGuard>;
}
