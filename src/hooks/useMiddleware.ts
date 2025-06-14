
import { useEffect, useState } from 'react';
import { authMiddleware, type MiddlewareContext } from '@/lib/middleware';
import { useAuth } from '@/lib/auth';

export function useMiddleware() {
  const { user, isLoaded } = useAuth();
  const [context, setContext] = useState<MiddlewareContext | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isLoaded) return;

    const executeMiddleware = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const middlewareContext = await authMiddleware.execute();
        setContext(middlewareContext);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Middleware execution failed'));
      } finally {
        setIsLoading(false);
      }
    };

    executeMiddleware();
  }, [user, isLoaded]);

  return {
    context,
    error,
    isLoading,
    hasPermission: (permission: string) => 
      context?.permissions.includes(permission) || false,
    hasRole: (role: string) => 
      context?.role === role,
    isAuthenticated: context?.isAuthenticated || false,
  };
}
