import { z } from 'zod';

// Environment schema validation
const envSchema = z.object({
  // Supabase Configuration
  NEXT_PUBLIC_SUPABASE_URL: z.string().url().optional(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1).optional(),
  
  // Security
  ENCRYPTION_KEY: z.string().min(32).optional(),
  
  // Optional: Rate limiting
  RATE_LIMIT_WINDOW_MS: z.coerce.number().default(900000), // 15 minutes
  RATE_LIMIT_MAX_REQUESTS: z.coerce.number().default(100),
  
  // Optional: Feature flags
  FEATURE_2FA_ENABLED: z.enum(['true', 'false']).default('true'),
  FEATURE_ANALYTICS_ENABLED: z.enum(['true', 'false']).default('true'),
  FEATURE_AUDIT_LOGS_ENABLED: z.enum(['true', 'false']).default('true'),
  
  // Environment
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  
  // Optional: External services
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.coerce.number().optional(),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),
});

// Parse and validate environment variables
function validateEnv() {
  try {
    return envSchema.parse(process.env);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingVars = error.errors
        .filter(err => err.code === 'invalid_type' && err.received === 'undefined')
        .map(err => err.path.join('.'));
      
      if (missingVars.length > 0) {
        console.warn(`⚠️  Missing optional environment variables: ${missingVars.join(', ')}`);
        console.warn('ℹ️  The app will work in demo mode. Check .env.example for setup instructions.');
      }
    }
    
    // Return partial config for demo mode with explicit undefined values
    return {
      NODE_ENV: (process.env.NODE_ENV as 'development' | 'production' | 'test') || 'development',
      FEATURE_2FA_ENABLED: 'true' as const,
      FEATURE_ANALYTICS_ENABLED: 'true' as const,
      FEATURE_AUDIT_LOGS_ENABLED: 'true' as const,
      RATE_LIMIT_WINDOW_MS: 900000,
      RATE_LIMIT_MAX_REQUESTS: 100,
      NEXT_PUBLIC_SUPABASE_URL: undefined,
      NEXT_PUBLIC_SUPABASE_ANON_KEY: undefined,
      ENCRYPTION_KEY: undefined,
      SMTP_HOST: undefined,
      SMTP_PORT: undefined,
      SMTP_USER: undefined,
      SMTP_PASS: undefined,
    };
  }
}

export const env = validateEnv();

// Configuration helpers
export const config = {
  supabase: {
    url: env.NEXT_PUBLIC_SUPABASE_URL || 'https://xyzcompany.supabase.co',
    anonKey: env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0',
    isConfigured: Boolean(env.NEXT_PUBLIC_SUPABASE_URL && env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
  },
  
  security: {
    encryptionKey: env.ENCRYPTION_KEY || 'demo-key-change-in-production-32chars',
    isEncryptionConfigured: Boolean(env.ENCRYPTION_KEY),
  },
  
  features: {
    twoFactorAuth: env.FEATURE_2FA_ENABLED === 'true',
    analytics: env.FEATURE_ANALYTICS_ENABLED === 'true',
    auditLogs: env.FEATURE_AUDIT_LOGS_ENABLED === 'true',
  },
  
  rateLimit: {
    windowMs: env.RATE_LIMIT_WINDOW_MS,
    maxRequests: env.RATE_LIMIT_MAX_REQUESTS,
  },
  
  isDevelopment: env.NODE_ENV === 'development',
  isProduction: env.NODE_ENV === 'production',
  isTest: env.NODE_ENV === 'test',
  
  smtp: {
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    user: env.SMTP_USER,
    pass: env.SMTP_PASS,
    isConfigured: Boolean(env.SMTP_HOST && env.SMTP_USER && env.SMTP_PASS),
  },
};

// Runtime configuration checks
export function validateConfiguration(): { isValid: boolean; warnings: string[]; errors: string[] } {
  const warnings: string[] = [];
  const errors: string[] = [];
  
  if (!config.supabase.isConfigured) {
    warnings.push('Supabase not configured - running in demo mode');
  }
  
  if (!config.security.isEncryptionConfigured) {
    if (config.isProduction) {
      errors.push('ENCRYPTION_KEY must be set in production');
    } else {
      warnings.push('Using demo encryption key - set ENCRYPTION_KEY for production');
    }
  }
  
  if (config.isProduction && !config.smtp.isConfigured) {
    warnings.push('SMTP not configured - email notifications disabled');
  }
  
  return {
    isValid: errors.length === 0,
    warnings,
    errors,
  };
}

// Log configuration status on startup
if (typeof window === 'undefined') {
  const validation = validateConfiguration();
  
  if (validation.warnings.length > 0) {
    console.warn('⚠️  Configuration warnings:');
    validation.warnings.forEach(warning => console.warn(`   ${warning}`));
  }
  
  if (validation.errors.length > 0) {
    console.error('❌ Configuration errors:');
    validation.errors.forEach(error => console.error(`   ${error}`));
  }
  
  if (validation.isValid && validation.warnings.length === 0) {
    // console.log('✅ All configurations valid');
  }
} 