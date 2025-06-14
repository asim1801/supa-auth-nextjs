import { createClient } from '@supabase/supabase-js'

// Get credentials from environment variables or use demo defaults
const rawSupabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://xyzcompany.supabase.co'
const rawSupabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0'

// Clean up URLs and check if they're placeholder values
const isPlaceholderUrl = rawSupabaseUrl.includes('your_supabase_project_url') || rawSupabaseUrl === 'your_supabase_project_url'
const isPlaceholderKey = rawSupabaseAnonKey.includes('your_supabase_anon_key') || rawSupabaseAnonKey === 'your_supabase_anon_key'

// Use demo values if placeholders are detected
const supabaseUrl = isPlaceholderUrl ? 'https://xyzcompany.supabase.co' : rawSupabaseUrl.replace(/\/$/, '')
const supabaseAnonKey = isPlaceholderKey ? 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' : rawSupabaseAnonKey

// Check if we're using real credentials
const isRealConfig = 
  supabaseUrl !== 'https://xyzcompany.supabase.co' && 
  supabaseAnonKey !== 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' &&
  !isPlaceholderUrl &&
  !isPlaceholderKey

// Only log in development mode and don't expose sensitive data
if (process.env.NODE_ENV === 'development') {
  console.log('Supabase initialization:', {
    url: isRealConfig ? 'Configured' : 'Using demo mode',
    key: isRealConfig ? 'Configured' : 'Using demo mode'
  });
}

// Create client with proper error handling
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: isRealConfig,
    persistSession: isRealConfig,
    detectSessionInUrl: isRealConfig
  }
})

// Check if properly configured
export const isSupabaseConfigured = () => {
  return isRealConfig && supabaseUrl.includes('supabase.co');
};

console.log('Supabase client created:', isSupabaseConfigured() ? 'with real credentials' : 'in demo mode');

// Database types
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      organizations: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          website: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          website?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string | null
          website?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      organization_members: {
        Row: {
          id: string
          organization_id: string
          user_id: string
          role: 'owner' | 'admin' | 'member'
          status: 'active' | 'pending'
          invited_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          organization_id: string
          user_id: string
          role?: 'owner' | 'admin' | 'member'
          status?: 'active' | 'pending'
          invited_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          organization_id?: string
          user_id?: string
          role?: 'owner' | 'admin' | 'member'
          status?: 'active' | 'pending'
          invited_by?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      organization_invitations: {
        Row: {
          id: string
          organization_id: string
          email: string
          role: 'admin' | 'member'
          invited_by: string
          token: string
          expires_at: string
          accepted_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          organization_id: string
          email: string
          role?: 'admin' | 'member'
          invited_by: string
          token?: string
          expires_at?: string
          accepted_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          organization_id?: string
          email?: string
          role?: 'admin' | 'member'
          invited_by?: string
          token?: string
          expires_at?: string
          accepted_at?: string | null
          created_at?: string
        }
      }
    }
  }
}
