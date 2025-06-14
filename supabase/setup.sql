
-- Enable RLS
ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-jwt-secret';

-- Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create organizations table
CREATE TABLE IF NOT EXISTS public.organizations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    website TEXT,
    logo_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create organization_members table
CREATE TABLE IF NOT EXISTS public.organization_members (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    role TEXT CHECK (role IN ('owner', 'admin', 'member')) DEFAULT 'member' NOT NULL,
    status TEXT CHECK (status IN ('active', 'pending')) DEFAULT 'active' NOT NULL,
    invited_by UUID REFERENCES public.profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(organization_id, user_id)
);

-- Create organization_invitations table
CREATE TABLE IF NOT EXISTS public.organization_invitations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE NOT NULL,
    email TEXT NOT NULL,
    role TEXT CHECK (role IN ('admin', 'member')) DEFAULT 'member' NOT NULL,
    invited_by UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    token TEXT UNIQUE DEFAULT gen_random_uuid()::text NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE DEFAULT (timezone('utc'::text, now()) + interval '7 days') NOT NULL,
    accepted_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enhanced audit_logs table for security tracking
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    organization_id UUID REFERENCES public.organizations(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    resource TEXT,
    resource_id UUID,
    details JSONB,
    user_agent TEXT,
    ip_address INET,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    -- Security audit fields
    session_id TEXT,
    risk_score INTEGER DEFAULT 0,
    verified BOOLEAN DEFAULT false
);

-- Enhanced rate_limits table
CREATE TABLE IF NOT EXISTS public.rate_limits (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    identifier TEXT NOT NULL, -- Can be user_id, ip_address, etc.
    action TEXT NOT NULL,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enhanced two-factor authentication table
CREATE TABLE IF NOT EXISTS public.user_two_factor (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL UNIQUE,
    secret TEXT NOT NULL, -- Encrypted
    backup_codes TEXT NOT NULL, -- Encrypted JSON array
    enabled BOOLEAN DEFAULT false,
    last_used_code TEXT,
    last_verified TIMESTAMP WITH TIME ZONE,
    setup_ip INET,
    setup_user_agent TEXT,
    verification_ip INET,
    verification_user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enhanced trusted devices table
CREATE TABLE IF NOT EXISTS public.trusted_devices (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    device_fingerprint TEXT NOT NULL,
    user_agent TEXT NOT NULL,
    ip_address INET,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    last_used TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, device_fingerprint)
);

-- Security events table for monitoring
CREATE TABLE IF NOT EXISTS public.security_events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    event_type TEXT NOT NULL,
    severity TEXT CHECK (severity IN ('low', 'medium', 'high', 'critical')) DEFAULT 'medium',
    description TEXT NOT NULL,
    metadata JSONB,
    ip_address INET,
    user_agent TEXT,
    resolved BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create notifications table for real-time notifications
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT CHECK (type IN ('info', 'success', 'warning', 'error')) DEFAULT 'info',
    read BOOLEAN DEFAULT false,
    data JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organization_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organization_invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rate_limits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_two_factor ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trusted_devices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.security_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Security-focused RLS policies

-- Profiles policies
CREATE POLICY "Users can view their own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Two-factor authentication policies
CREATE POLICY "Users can manage their own 2FA" ON public.user_two_factor
    FOR ALL USING (auth.uid() = user_id);

-- Trusted devices policies
CREATE POLICY "Users can manage their own trusted devices" ON public.trusted_devices
    FOR ALL USING (auth.uid() = user_id);

-- Security events policies
CREATE POLICY "Users can view their own security events" ON public.security_events
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System can insert security events" ON public.security_events
    FOR INSERT WITH CHECK (true);

-- Audit logs policies (enhanced)
CREATE POLICY "Users can view their own audit logs" ON public.audit_logs
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Organization admins can view org audit logs" ON public.audit_logs
    FOR SELECT USING (
        organization_id IS NOT NULL AND 
        EXISTS (
            SELECT 1 FROM public.organization_members
            WHERE organization_id = audit_logs.organization_id
            AND user_id = auth.uid()
            AND role IN ('owner', 'admin')
            AND status = 'active'
        )
    );

CREATE POLICY "System can insert audit logs" ON public.audit_logs
    FOR INSERT WITH CHECK (true);

-- Rate limits policies
CREATE POLICY "System can manage rate limits" ON public.rate_limits
    FOR ALL WITH CHECK (true);

-- ... keep existing code (organizations and other table policies)

-- Enhanced security functions
CREATE OR REPLACE FUNCTION public.log_security_event(
    p_user_id UUID DEFAULT NULL,
    p_event_type TEXT DEFAULT 'unknown',
    p_severity TEXT DEFAULT 'medium',
    p_description TEXT DEFAULT '',
    p_metadata JSONB DEFAULT '{}'::jsonb
)
RETURNS UUID AS $$
DECLARE
    event_id UUID;
BEGIN
    INSERT INTO public.security_events (
        user_id, event_type, severity, description, metadata,
        ip_address, user_agent
    ) VALUES (
        p_user_id, p_event_type, p_severity, p_description, p_metadata,
        inet_client_addr(), current_setting('request.header.user-agent', true)
    ) RETURNING id INTO event_id;
    
    RETURN event_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to clean up expired data
CREATE OR REPLACE FUNCTION public.cleanup_expired_security_data()
RETURNS void AS $$
BEGIN
    -- Clean up expired rate limits (older than 24 hours)
    DELETE FROM public.rate_limits 
    WHERE created_at < (now() - interval '24 hours');
    
    -- Clean up expired trusted devices
    DELETE FROM public.trusted_devices 
    WHERE expires_at < now();
    
    -- Clean up old audit logs (older than 1 year, configurable)
    DELETE FROM public.audit_logs 
    WHERE created_at < (now() - interval '1 year');
    
    -- Clean up resolved security events (older than 90 days)
    DELETE FROM public.security_events 
    WHERE resolved = true AND created_at < (now() - interval '90 days');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for automatic security event logging
CREATE OR REPLACE FUNCTION public.trigger_security_event()
RETURNS TRIGGER AS $$
BEGIN
    -- Log failed authentication attempts
    IF TG_TABLE_NAME = 'rate_limits' AND NEW.action LIKE '%_verify' THEN
        PERFORM public.log_security_event(
            CASE 
                WHEN NEW.identifier ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$' 
                THEN NEW.identifier::UUID 
                ELSE NULL 
            END,
            'rate_limit_exceeded',
            'medium',
            'Rate limit exceeded for action: ' || NEW.action,
            jsonb_build_object('action', NEW.action, 'identifier', NEW.identifier)
        );
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Apply security trigger
CREATE TRIGGER security_event_trigger
    AFTER INSERT ON public.rate_limits
    FOR EACH ROW EXECUTE FUNCTION public.trigger_security_event();

-- Enhanced indexes for performance and security
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id_created ON public.audit_logs(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_org_id_created ON public.audit_logs(organization_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_rate_limits_identifier_action ON public.rate_limits(identifier, action);
CREATE INDEX IF NOT EXISTS idx_rate_limits_created_at ON public.rate_limits(created_at);
CREATE INDEX IF NOT EXISTS idx_trusted_devices_user_fingerprint ON public.trusted_devices(user_id, device_fingerprint);
CREATE INDEX IF NOT EXISTS idx_trusted_devices_expires ON public.trusted_devices(expires_at);
CREATE INDEX IF NOT EXISTS idx_security_events_user_severity ON public.security_events(user_id, severity, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_two_factor_user_enabled ON public.user_two_factor(user_id, enabled);

-- Storage bucket for avatars (if not exists)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('avatars', 'avatars', true) 
ON CONFLICT (id) DO NOTHING;

-- Enhanced storage policies for security
CREATE POLICY "Avatar images are publicly accessible" ON storage.objects
    FOR SELECT USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload their own avatar" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'avatars' 
        AND auth.uid()::text = (storage.foldername(name))[1]
        AND (storage.extension(name)) IN ('jpg', 'jpeg', 'png', 'webp')
        AND octet_length(decode(metadata->>'size', 'escape')) < 5242880 -- 5MB limit
    );

CREATE POLICY "Users can update their own avatar" ON storage.objects
    FOR UPDATE USING (
        bucket_id = 'avatars' 
        AND auth.uid()::text = (storage.foldername(name))[1]
    );

CREATE POLICY "Users can delete their own avatar" ON storage.objects
    FOR DELETE USING (
        bucket_id = 'avatars' 
        AND auth.uid()::text = (storage.foldername(name))[1]
    );
