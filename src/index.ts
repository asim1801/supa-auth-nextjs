
// Main exports for the auth starter kit
export * from './components';
export * from './hooks';
export * from './config';
export * from './lib';

// Types
export type { AuthUser } from './lib/auth';
export { OrganizationProvider, useOrganization } from './lib/organization';
export { useTeamActions } from './hooks/useTeamActions';
export { OrganizationSwitcher } from './components/organization/OrganizationSwitcher';

// Security features
export { useAdvancedAuth, useEnhancedValidation } from './hooks';
export { TwoFactorSetup, DeviceManagement } from './components/security';
export type { TwoFactorSetup as TwoFactorSetupType, TrustedDevice } from './lib/twoFactor';
