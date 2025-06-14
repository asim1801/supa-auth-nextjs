
import { useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { useAuth } from '@/lib/auth';
import { useOrganization } from '@/lib/organization';

export interface AuditEvent {
  action: string;
  resource: string;
  resourceId?: string;
  details?: Record<string, any>;
  userAgent?: string;
  ipAddress?: string;
}

export function useAuditLogger() {
  const { user } = useAuth();
  const { currentOrganization } = useOrganization();

  const logEvent = useCallback(async (event: AuditEvent) => {
    if (!user || !isSupabaseConfigured()) return;

    try {
      await supabase
        .from('audit_logs')
        .insert({
          user_id: user.id,
          organization_id: currentOrganization?.id,
          action: event.action,
          resource: event.resource,
          resource_id: event.resourceId,
          details: event.details || {},
          user_agent: event.userAgent || navigator.userAgent,
          ip_address: event.ipAddress || 'Unknown',
          created_at: new Date().toISOString()
        });
    } catch (error) {
      console.error('Failed to log audit event:', error);
    }
  }, [user, currentOrganization]);

  // Convenience methods for common actions
  const logSignIn = () => logEvent({
    action: 'sign_in',
    resource: 'auth',
    details: { method: 'email_password' }
  });

  const logSignOut = () => logEvent({
    action: 'sign_out',
    resource: 'auth'
  });

  const logMemberInvite = (email: string, role: string) => logEvent({
    action: 'member_invited',
    resource: 'organization_member',
    details: { email, role }
  });

  const logMemberRoleChange = (memberId: string, oldRole: string, newRole: string) => logEvent({
    action: 'member_role_changed',
    resource: 'organization_member',
    resourceId: memberId,
    details: { oldRole, newRole }
  });

  const logMemberRemoved = (memberId: string, email: string) => logEvent({
    action: 'member_removed',
    resource: 'organization_member',
    resourceId: memberId,
    details: { email }
  });

  const logProfileUpdate = (changes: Record<string, any>) => logEvent({
    action: 'profile_updated',
    resource: 'user_profile',
    resourceId: user?.id,
    details: { changes }
  });

  const logPasswordChange = () => logEvent({
    action: 'password_changed',
    resource: 'auth',
    details: { method: 'password_update' }
  });

  const logTwoFactorEnabled = () => logEvent({
    action: 'two_factor_enabled',
    resource: 'auth',
    details: { method: 'totp' }
  });

  return {
    logEvent,
    logSignIn,
    logSignOut,
    logMemberInvite,
    logMemberRoleChange,
    logMemberRemoved,
    logProfileUpdate,
    logPasswordChange,
    logTwoFactorEnabled,
  };
}
