
# Deployment Guide

## Deployment Options

### 1. Vercel (Recommended)

Vercel provides excellent support for React applications with automatic deployments.

#### Steps:

1. **Push to GitHub**: Ensure your code is in a GitHub repository

2. **Connect to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Vercel will automatically detect it's a Vite project

3. **Add Environment Variables**:
   - In your Vercel project dashboard, go to Settings > Environment Variables
   - Add your Supabase environment variables:
     ```
     VITE_SUPABASE_URL=your_supabase_project_url
     VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
     ```

4. **Deploy**: Vercel will automatically build and deploy your app

#### Custom Domain:
- Go to your Vercel project > Settings > Domains
- Add your custom domain and follow the DNS configuration instructions

### 2. Netlify

1. **Build Settings**:
   - Build command: `npm run build`
   - Publish directory: `dist`

2. **Environment Variables**: Add your Supabase variables in Site Settings > Environment Variables

3. **Deploy**: Connect your GitHub repo and deploy

### 3. Other Platforms

The built application (`npm run build` creates a `dist` folder) can be deployed to:
- AWS S3 + CloudFront
- GitHub Pages
- Firebase Hosting
- Any static hosting service

## Environment Variables in Production

Make sure to set these environment variables in your deployment platform:

```env
VITE_SUPABASE_URL=your_production_supabase_url
VITE_SUPABASE_ANON_KEY=your_production_supabase_anon_key
```

## Pre-Deployment Checklist

- [ ] All environment variables are set correctly
- [ ] Supabase project is configured for production
- [ ] Database tables and RLS policies are in place
- [ ] Authentication providers are configured
- [ ] Email templates are customized (optional)
- [ ] App has been tested in production mode (`npm run build && npm run preview`)

## Post-Deployment

1. **Test Authentication**: Verify login, signup, and password reset work
2. **Test Invitations**: Ensure email invitations are sent and work correctly
3. **Test Permissions**: Verify role-based access control works
4. **Monitor Performance**: Check Core Web Vitals and loading times
5. **Set up Analytics**: Consider adding analytics tracking

## Supabase Production Configuration

### Authentication Settings
- Configure allowed redirect URLs to include your production domain
- Set up custom email templates for a professional look
- Configure rate limiting for security

### Database
- Review and tighten RLS policies for production
- Set up database backups
- Monitor database performance

### Security
- Enable 2FA for your Supabase account
- Review API keys and rotate if necessary
- Set up proper CORS configuration
