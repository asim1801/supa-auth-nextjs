-- Analytics and monitoring tables for Supauth
-- Run this after the main setup.sql

-- Analytics events table
CREATE TABLE IF NOT EXISTS public.analytics_events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    event TEXT NOT NULL,
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    session_id TEXT NOT NULL,
    properties JSONB NOT NULL DEFAULT '{}',
    user_agent TEXT,
    page TEXT,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Performance metrics table
CREATE TABLE IF NOT EXISTS public.performance_metrics (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    session_id TEXT NOT NULL,
    metric_name TEXT NOT NULL,
    metric_value NUMERIC NOT NULL,
    page TEXT,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Feature usage tracking
CREATE TABLE IF NOT EXISTS public.feature_usage (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    feature_name TEXT NOT NULL,
    action TEXT NOT NULL,
    metadata JSONB DEFAULT '{}',
    session_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Error tracking table
CREATE TABLE IF NOT EXISTS public.error_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    error_message TEXT NOT NULL,
    error_stack TEXT,
    page TEXT,
    user_agent TEXT,
    session_id TEXT,
    context JSONB DEFAULT '{}',
    resolved BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Application health metrics
CREATE TABLE IF NOT EXISTS public.health_metrics (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    metric_type TEXT NOT NULL, -- 'response_time', 'memory_usage', 'cpu_usage', etc.
    metric_value NUMERIC NOT NULL,
    instance_id TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS on analytics tables
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.performance_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feature_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.error_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.health_metrics ENABLE ROW LEVEL SECURITY;

-- RLS Policies for analytics

-- Analytics events policies
CREATE POLICY "Users can view their own analytics events" ON public.analytics_events
    FOR SELECT USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "System can insert analytics events" ON public.analytics_events
    FOR INSERT WITH CHECK (true);

-- Performance metrics policies
CREATE POLICY "Users can view their own performance metrics" ON public.performance_metrics
    FOR SELECT USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "System can insert performance metrics" ON public.performance_metrics
    FOR INSERT WITH CHECK (true);

-- Feature usage policies
CREATE POLICY "Users can view their own feature usage" ON public.feature_usage
    FOR SELECT USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "System can insert feature usage" ON public.feature_usage
    FOR INSERT WITH CHECK (true);

-- Error logs policies (admins can view all, users can view their own)
CREATE POLICY "Users can view their own errors" ON public.error_logs
    FOR SELECT USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "System can insert error logs" ON public.error_logs
    FOR INSERT WITH CHECK (true);

-- Health metrics policies (system only)
CREATE POLICY "System can manage health metrics" ON public.health_metrics
    FOR ALL WITH CHECK (true);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_analytics_events_user_id ON public.analytics_events(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_analytics_events_event ON public.analytics_events(event, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_analytics_events_session ON public.analytics_events(session_id);

CREATE INDEX IF NOT EXISTS idx_performance_metrics_user_session ON public.performance_metrics(user_id, session_id);
CREATE INDEX IF NOT EXISTS idx_performance_metrics_name ON public.performance_metrics(metric_name, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_feature_usage_user_feature ON public.feature_usage(user_id, feature_name);
CREATE INDEX IF NOT EXISTS idx_feature_usage_created ON public.feature_usage(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_error_logs_user_resolved ON public.error_logs(user_id, resolved, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_error_logs_created ON public.error_logs(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_health_metrics_type_created ON public.health_metrics(metric_type, created_at DESC);

-- Functions for analytics aggregation
CREATE OR REPLACE FUNCTION public.get_user_analytics_summary(user_uuid UUID)
RETURNS JSON AS $$
DECLARE
    result JSON;
BEGIN
    SELECT json_build_object(
        'total_events', (SELECT COUNT(*) FROM public.analytics_events WHERE user_id = user_uuid),
        'total_sessions', (SELECT COUNT(DISTINCT session_id) FROM public.analytics_events WHERE user_id = user_uuid),
        'features_used', (SELECT COUNT(DISTINCT feature_name) FROM public.feature_usage WHERE user_id = user_uuid),
        'error_count', (SELECT COUNT(*) FROM public.error_logs WHERE user_id = user_uuid),
        'last_activity', (SELECT MAX(created_at) FROM public.analytics_events WHERE user_id = user_uuid)
    ) INTO result;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Cleanup function for old analytics data
CREATE OR REPLACE FUNCTION public.cleanup_old_analytics_data()
RETURNS void AS $$
BEGIN
    -- Keep analytics data for 90 days
    DELETE FROM public.analytics_events WHERE created_at < NOW() - INTERVAL '90 days';
    DELETE FROM public.performance_metrics WHERE created_at < NOW() - INTERVAL '90 days';
    DELETE FROM public.feature_usage WHERE created_at < NOW() - INTERVAL '90 days';
    
    -- Keep error logs for 30 days
    DELETE FROM public.error_logs WHERE created_at < NOW() - INTERVAL '30 days';
    
    -- Keep health metrics for 7 days
    DELETE FROM public.health_metrics WHERE created_at < NOW() - INTERVAL '7 days';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant necessary permissions
GRANT SELECT ON public.analytics_events TO authenticated;
GRANT INSERT ON public.analytics_events TO authenticated;
GRANT SELECT ON public.performance_metrics TO authenticated;
GRANT INSERT ON public.performance_metrics TO authenticated;
GRANT SELECT ON public.feature_usage TO authenticated;
GRANT INSERT ON public.feature_usage TO authenticated;
GRANT SELECT ON public.error_logs TO authenticated;
GRANT INSERT ON public.error_logs TO authenticated; 