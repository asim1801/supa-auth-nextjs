import { supabase, isSupabaseConfigured } from './supabase';
import type { User } from '@supabase/supabase-js';
import { authConfig } from '@/config/auth';

export interface MiddlewareContext {
  user: User | null;
  isAuthenticated: boolean;
  isConfigured: boolean;
  permissions: string[];
  organizationId?: string;
  role?: string;
}

export type MiddlewareFunction = (
  context: MiddlewareContext,
  next: () => void
) => void | Promise<void>;

class AuthMiddleware {
  private middlewares: MiddlewareFunction[] = [];

  // Add middleware
  use(middleware: MiddlewareFunction) {
    this.middlewares.push(middleware);
  }

  // Execute middleware chain
  async execute(initialContext: Partial<MiddlewareContext> = {}) {
    const context = await this.buildContext(initialContext);
    await this.runMiddlewares(context, 0);
    return context;
  }

  private async buildContext(initial: Partial<MiddlewareContext>): Promise<MiddlewareContext> {
    const { data: { user } } = await supabase.auth.getUser();
    
    let permissions: string[] = [];
    let organizationId: string | undefined;
    let role: string | undefined;

    if (user && isSupabaseConfigured()) {
      // Get user permissions and organization info
      const { data: memberData } = await supabase
        .from('organization_members')
        .select('organization_id, role, status')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .limit(1)
        .single();

      if (memberData) {
        organizationId = memberData.organization_id;
        role = memberData.role;
        permissions = this.getRolePermissions(memberData.role);
      }
    }

    return {
      user: user || null,
      isAuthenticated: !!user,
      isConfigured: isSupabaseConfigured(),
      permissions,
      organizationId,
      role,
      ...initial,
    };
  }

  private async runMiddlewares(context: MiddlewareContext, index: number) {
    if (index >= this.middlewares.length) return;

    const middleware = this.middlewares[index]!;
    const next = () => this.runMiddlewares(context, index + 1);

    await middleware(context, next);
  }

  private getRolePermissions(role: string): string[] {
    const rolePermissions = {
      owner: [
        'organization:read',
        'organization:write',
        'organization:delete',
        'members:read',
        'members:write',
        'members:delete',
        'invitations:read',
        'invitations:write',
        'invitations:delete',
        'billing:read',
        'billing:write',
      ],
      admin: [
        'organization:read',
        'organization:write',
        'members:read',
        'members:write',
        'members:delete',
        'invitations:read',
        'invitations:write',
        'invitations:delete',
      ],
      member: [
        'organization:read',
        'members:read',
      ],
    };

    return rolePermissions[role as keyof typeof rolePermissions] || [];
  }
}

// Create global middleware instance
export const authMiddleware = new AuthMiddleware();

// Built-in middleware functions
export const requireAuth: MiddlewareFunction = (context, next) => {
  if (!context.isAuthenticated) {
    throw new Error('Authentication required');
  }
  next();
};

export const requireEmailVerification: MiddlewareFunction = (context, next) => {
  if (!context.user?.email_confirmed_at && authConfig.auth.enableEmailVerification) {
    throw new Error('Email verification required');
  }
  next();
};

export const requirePermission = (permission: string): MiddlewareFunction => {
  return (context, next) => {
    if (!context.permissions.includes(permission)) {
      throw new Error(`Permission required: ${permission}`);
    }
    next();
  };
};

export const requireRole = (allowedRoles: string[]): MiddlewareFunction => {
  return (context, next) => {
    if (!context.role || !allowedRoles.includes(context.role)) {
      throw new Error(`Role required: ${allowedRoles.join(' or ')}`);
    }
    next();
  };
};

export const rateLimitMiddleware: MiddlewareFunction = async (context, next) => {
  if (!authConfig.security.enableRateLimit) {
    next();
    return;
  }

  // Implement rate limiting logic using Supabase
  const userId = context.user?.id;
  if (userId) {
    const now = new Date();
    const oneMinuteAgo = new Date(now.getTime() - 60000);

    // Check rate limit in Supabase (you'd need to create a rate_limits table)
    const { count } = await supabase
      .from('rate_limits')
      .select('*', { count: 'exact' })
      .eq('user_id', userId)
      .gte('created_at', oneMinuteAgo.toISOString());

    if ((count || 0) > 60) { // 60 requests per minute
      throw new Error('Rate limit exceeded');
    }

    // Log the request
    await supabase
      .from('rate_limits')
      .insert({
        user_id: userId,
        created_at: now.toISOString(),
      });
  }

  next();
};

export const auditLogMiddleware: MiddlewareFunction = async (context, next) => {
  if (!authConfig.security.enableAuditLog) {
    next();
    return;
  }

  const startTime = Date.now();
  
  try {
    next();
    
    // Log successful action
    if (context.user && isSupabaseConfigured()) {
      await supabase
        .from('audit_logs')
        .insert({
          user_id: context.user.id,
          action: 'page_access',
          resource: window.location.pathname,
          status: 'success',
          duration_ms: Date.now() - startTime,
          created_at: new Date().toISOString(),
        });
    }
  } catch (error) {
    // Log failed action
    if (context.user && isSupabaseConfigured()) {
      await supabase
        .from('audit_logs')
        .insert({
          user_id: context.user.id,
          action: 'page_access',
          resource: window.location.pathname,
          status: 'error',
          error_message: error instanceof Error ? error.message : 'Unknown error',
          duration_ms: Date.now() - startTime,
          created_at: new Date().toISOString(),
        });
    }
    throw error;
  }
};

// Session timeout middleware
export const sessionTimeoutMiddleware: MiddlewareFunction = async (context, next) => {
  if (!authConfig.security.enableSessionTimeout || !context.isAuthenticated) {
    next();
    return;
  }

  const { data: { session } } = await supabase.auth.getSession();
  if (session) {
    const lastActivity = localStorage.getItem('supauth-last-activity');
    const now = Date.now();
    const timeoutMs = authConfig.security.sessionTimeoutMinutes * 60 * 1000;

    if (lastActivity && (now - parseInt(lastActivity)) > timeoutMs) {
      await supabase.auth.signOut();
      throw new Error('Session expired due to inactivity');
    }

          localStorage.setItem('supauth-last-activity', now.toString());
  }

  next();
};

// Real-time notification middleware
export const realtimeMiddleware: MiddlewareFunction = (context, next) => {
  if (!authConfig.supabase.enableRealtime || !context.isAuthenticated) {
    next();
    return;
  }

  // Subscribe to real-time updates for the user
  const channel = supabase
    .channel(`user:${context.user?.id}`)
    .on('postgres_changes', 
      { 
        event: '*', 
        schema: 'public', 
        table: 'organization_members',
        filter: `user_id=eq.${context.user?.id}` 
      }, 
      (payload) => {
        // Trigger a context refresh or emit event
        window.dispatchEvent(new CustomEvent('membership-changed', { detail: payload }));
      }
    )
    .subscribe();

  // Cleanup on component unmount
  window.addEventListener('beforeunload', () => {
    supabase.removeChannel(channel);
  });

  next();
};

// Setup default middleware chain
authMiddleware.use(sessionTimeoutMiddleware);
authMiddleware.use(rateLimitMiddleware);
authMiddleware.use(auditLogMiddleware);
authMiddleware.use(realtimeMiddleware);
