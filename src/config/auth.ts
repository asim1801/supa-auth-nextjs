
export const authConfig = {
  // App configuration
  app: {
    name: 'Supauth',
    description: 'Free, open source authentication kit with team management',
    url: 'https://yourapp.com',
  },
  
  // Authentication settings
  auth: {
    redirectAfterSignIn: '/profile',
    redirectAfterSignUp: '/profile',
    redirectAfterSignOut: '/',
    enableEmailVerification: true,
    enablePasswordReset: true,
    enableMagicLink: true,
    enableOAuth: true,
    oauthProviders: ['google', 'github', 'discord'] as const,
    magicLinkRedirectTo: '/auth/callback', // Will be resolved dynamically on client
  },
  
  // Team/Organization features
  teams: {
    enabled: true,
    defaultRole: 'member' as const,
    maxMembersPerTeam: 50,
    allowSelfInvite: false,
    enableInvitations: true,
    invitationExpiryDays: 7,
  },
  
  // Profile settings
  profile: {
    requiredFields: ['firstName'] as const,
    optionalFields: ['lastName', 'avatar'] as const,
    maxAvatarSize: 5 * 1024 * 1024, // 5MB
    allowedAvatarTypes: ['image/jpeg', 'image/png', 'image/webp'] as const,
    enablePublicProfiles: false,
  },
  
  // Security settings
  security: {
    enableTwoFactor: false,
    enableSessionTimeout: true,
    sessionTimeoutMinutes: 30,
    enableAuditLog: true,
    enableRateLimit: true,
  },
  
  // UI customization
  ui: {
    brand: {
      logo: '/logo.svg',
      favicon: '/favicon.ico',
    },
    theme: {
      default: 'system' as const,
      enableToggle: true,
      storageKey: 'supauth-theme',
      colorScheme: 'blue' as const,
    },
    layout: {
      enableSidebar: true,
      enableBreadcrumbs: true,
      enableFooter: true,
    },
  },
  
  // Feature flags
  features: {
    enableAnalytics: false,
    enableNotifications: true,
    enableSearch: true,
    enableExport: false,
    enableBulkActions: false,
  },
  
  // Supabase specific settings
  supabase: {
    enableRealtime: true,
    enableStorage: true,
    enableEdgeFunctions: true,
    enableWebhooks: false,
  },
} as const;

export type AuthConfig = typeof authConfig;

// Helper function to override config
export const createAuthConfig = (overrides: Partial<typeof authConfig> = {}) => {
  return {
    ...authConfig,
    ...overrides,
    app: { ...authConfig.app, ...overrides.app },
    auth: { ...authConfig.auth, ...overrides.auth },
    teams: { ...authConfig.teams, ...overrides.teams },
    profile: { ...authConfig.profile, ...overrides.profile },
    security: { ...authConfig.security, ...overrides.security },
    ui: { 
      ...authConfig.ui, 
      ...overrides.ui,
      theme: { ...authConfig.ui.theme, ...overrides.ui?.theme },
      brand: { ...authConfig.ui.brand, ...overrides.ui?.brand },
      layout: { ...authConfig.ui.layout, ...overrides.ui?.layout },
    },
    features: { ...authConfig.features, ...overrides.features },
    supabase: { ...authConfig.supabase, ...overrides.supabase },
  };
};
