
export { AuthProvider, useAuth } from './auth';
export { supabase, isSupabaseConfigured } from './supabase';
export { cn } from './utils';
export { 
  authMiddleware,
  requireAuth,
  requireEmailVerification,
  requirePermission,
  requireRole,
  rateLimitMiddleware,
  auditLogMiddleware,
  sessionTimeoutMiddleware,
  realtimeMiddleware,
} from './middleware';
export type { MiddlewareContext, MiddlewareFunction } from './middleware';
export { OrganizationProvider, useOrganization } from './organization';
export type { Organization, OrganizationMember } from './organization';

// Security exports
export {
  enableTwoFactor,
  verifyTwoFactor,
  addTrustedDevice,
  getTrustedDevices,
  removeTrustedDevice,
  isDeviceTrusted,
  disableTwoFactor
} from './twoFactor';
export type { TwoFactorSetup, TrustedDevice } from './twoFactor';

export {
  SecureEncryption,
  RateLimiter,
  DeviceFingerprinting,
  CSRFProtection,
  InputSecurity,
  safeCompare,
  getSecurityHeaders
} from './security';
export type { SecurityContext, RateLimitResult } from './security';
