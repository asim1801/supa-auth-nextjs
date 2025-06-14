
# Setup Guide

## Prerequisites

- Node.js 18+ and npm/yarn/pnpm/bun
- A Supabase account and project (optional for demo mode)

## Quick Start

### 1. Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd supa-auth-nextjs
npm install
```

### 2. Environment Setup

```bash
# Copy environment template
cp .env.example .env.local

# For production, add your Supabase credentials:
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

**Note**: The app works in demo mode without Supabase for development/testing.

### 3. Database Setup (Production Only)

1. **Create Supabase Project**:
   - Go to [supabase.com](https://supabase.com)
   - Create a new project
   - Note your project URL and anon key

2. **Run Database Schema**:
   ```sql
   -- Copy and paste contents from supabase/setup.sql
   -- This creates all necessary tables and policies
   ```

3. **Configure Authentication**:
   - Enable email authentication in Supabase Auth settings
   - Configure OAuth providers (optional)
   - Set redirect URLs for production

### 4. Start Development

```bash
npm run dev
```

## Development vs Production

### 🟢 Development Mode (No Configuration)
- Works immediately without setup
- Uses demo data and mock responses
- Perfect for UI development and testing
- Shows helpful configuration banners

### 🔵 Production Mode (Requires Supabase)
- Full authentication functionality
- Real data persistence
- Email notifications
- File storage capabilities
- Team management features

## Feature Status

### ✅ Production Ready Features
```typescript
// Core authentication
import { 
  SignInForm,
  SignUpForm,
  MagicLinkForm,
  SocialAuth,
  UserButton,
  AuthGuard 
} from '@/components/auth';

// Team management
import { 
  TeamList,
  InviteMemberDialog,
  OrganizationSwitcher 
} from '@/components/team';

// Profile management
import { 
  ProfileForm,
  AvatarUpload,
  ChangePasswordForm 
} from '@/components/profile';
```

### ⚠️ Beta Features (Use with Caution)
```typescript
// Enhanced security (simplified implementation)
import { 
  TwoFactorSetup,
  useAdvancedAuth,
  useEnhancedValidation 
} from '@/components/security';

// Bulk operations
import { 
  BulkInviteDialog,
  useBulkInvitations 
} from '@/components/team';

// Performance optimizations
import { 
  useAuthCache,
  useAuditLogger 
} from '@/hooks';
```

## Configuration Options

### Basic Auth Configuration
```typescript
// src/config/auth.ts
export const authConfig = {
  app: {
    name: 'Your App Name',
    description: 'Your app description',
  },
  auth: {
    redirectAfterSignIn: '/dashboard',
    enableEmailVerification: true,
    enableMagicLink: true,
  }
};
```

### Advanced Security (Beta)
```typescript
// Enable with caution - requires additional setup
authConfig.security = {
  enableTwoFactor: true,        // Simplified implementation
  enableDeviceTracking: true,   // Basic device management
  enableAuditLogging: true,     // Activity tracking
  requireEmailVerification: true,
};
```

## Production Checklist

### ✅ Must Have
- [ ] Supabase project configured
- [ ] Environment variables set
- [ ] Database schema deployed
- [ ] Authentication providers configured
- [ ] Email templates customized
- [ ] HTTPS enabled
- [ ] Domain configured

### ⚠️ Security Hardening Required
- [ ] Replace simplified 2FA with proper TOTP library
- [ ] Implement proper device fingerprinting
- [ ] Add rate limiting at infrastructure level
- [ ] Set up error monitoring (Sentry, LogRocket)
- [ ] Configure security headers
- [ ] Regular security audits
- [ ] Backup and disaster recovery plan

### 🔧 Optional Improvements
- [ ] Custom email templates
- [ ] Analytics integration
- [ ] Performance monitoring
- [ ] CDN for static assets
- [ ] Database optimization

## Deployment Platforms

### Vercel (Recommended)
```bash
# 1. Push to GitHub
git push origin main

# 2. Connect to Vercel and add environment variables
# 3. Deploy automatically
```

### Netlify
```bash
# Build command: npm run build
# Publish directory: dist
# Add environment variables in dashboard
```

### Railway
```bash
# Supports full-stack deployment
# Automatic GitHub integration
# Built-in database support
```

## Common Issues

### "Supabase not configured" Errors
```bash
# Solution 1: Add environment variables
VITE_SUPABASE_URL=your_url
VITE_SUPABASE_ANON_KEY=your_key

# Solution 2: Use demo mode (development only)
# No configuration needed - works out of the box
```

### Authentication Not Working
```bash
# Check redirect URLs in Supabase dashboard
# Verify email templates are configured
# Check browser console for errors
```

### 2FA Not Working Properly
```bash
# Known issue: Simplified implementation
# Recommendation: Replace with proper TOTP library
# See roadmap for production-ready implementation
```

## Security Recommendations

### Before Production
1. **Audit the 2FA implementation** - Current version is simplified
2. **Review device management** - Implement proper fingerprinting
3. **Security headers** - Add CSP, HSTS, etc.
4. **Rate limiting** - Implement at infrastructure level
5. **Error monitoring** - Add comprehensive error tracking

### Ongoing Security
- Regular dependency updates
- Security audit every 6 months
- Monitor for suspicious activity
- Backup strategy implementation
- Incident response plan

## Getting Help

- **Documentation**: Full documentation in `/docs`
- **Issues**: Report bugs on GitHub
- **Security**: Email security@yourproject.com
- **Community**: Join our Discord server

## Next Steps

1. **Start with core features** - Get basic auth working first
2. **Test thoroughly** - Especially security features
3. **Plan security audit** - Before production deployment
4. **Monitor performance** - Add analytics and monitoring
5. **Stay updated** - Follow roadmap for improvements

---

**Remember**: This is a powerful starter kit, but production deployment requires careful security review and testing.
