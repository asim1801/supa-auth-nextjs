'use client'

import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from './supabase';
import { authConfig } from '@/config/auth';

// Helper function to safely get the current origin
const getOrigin = () => {
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  // Fallback for server-side rendering
  return process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
};
import type { User, Session } from '@supabase/supabase-js';

export interface AuthUser {
  id: string;
  email: string;
  fullName: string | null;
  avatarUrl: string | null;
  emailVerified: boolean;
  createdAt: string;
}

interface AuthContextType {
  user: AuthUser | null;
  isLoaded: boolean;
  isSignedIn: boolean;
  isConfigured: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, firstName?: string, lastName?: string) => Promise<void>;
  signInWithMagicLink: (email: string) => Promise<void>;
  signInWithOAuth: (provider: 'google' | 'github' | 'discord') => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (data: { firstName?: string; lastName?: string; avatar?: File }) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isConfigured] = useState(isSupabaseConfigured());

  useEffect(() => {
    if (!isConfigured) {
      // Demo mode - set loaded immediately
      setIsLoaded(true);
      return;
    }

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        loadUser(session.user);
      } else {
        setIsLoaded(true);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          await loadUser(session.user);
        } else {
          setUser(null);
          setIsLoaded(true);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [isConfigured]);

  const loadUser = async (supabaseUser: User) => {
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', supabaseUser.id)
        .single();

      setUser({
        id: supabaseUser.id,
        email: supabaseUser.email!,
        fullName: profile?.full_name || null,
        avatarUrl: profile?.avatar_url || null,
        emailVerified: supabaseUser.email_confirmed_at !== null,
        createdAt: supabaseUser.created_at,
      });
    } catch (error) {
      console.error('Error loading user profile:', error);
    } finally {
      setIsLoaded(true);
    }
  };

  const signIn = async (email: string, password: string) => {
    if (!isConfigured) {
      throw new Error('Supabase not configured. Please add your VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables.');
    }
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  };

  const signUp = async (email: string, password: string, firstName?: string, lastName?: string) => {
    if (!isConfigured) {
      throw new Error('Supabase not configured. Please add your VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables.');
    }
    const fullName = [firstName, lastName].filter(Boolean).join(' ');
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName }
      }
    });
    if (error) throw error;
  };

  const signInWithMagicLink = async (email: string) => {
    if (!isConfigured) {
      throw new Error('Supabase not configured. Please add your VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables.');
    }
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${getOrigin()}${authConfig.auth.magicLinkRedirectTo}`,
      },
    });
    if (error) throw error;
  };

  const signInWithOAuth = async (provider: 'google' | 'github' | 'discord') => {
    if (!isConfigured) {
      throw new Error('Supabase not configured. Please add your VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables.');
    }
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${getOrigin()}/auth/callback`,
      },
    });
    if (error) throw error;
  };

  const signOut = async () => {
    if (!isConfigured) {
      throw new Error('Supabase not configured.');
    }
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  const resetPassword = async (email: string) => {
    if (!isConfigured) {
      throw new Error('Supabase not configured.');
    }
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${getOrigin()}/reset-password`,
    });
    if (error) throw error;
  };

  const changePassword = async (currentPassword: string, newPassword: string) => {
    if (!isConfigured) {
      throw new Error('Supabase not configured.');
    }
    if (!user) throw new Error('No authenticated user');

    // First verify current password by attempting to sign in
    const { error: verifyError } = await supabase.auth.signInWithPassword({
      email: user.email,
      password: currentPassword
    });

    if (verifyError) {
      throw new Error('Current password is incorrect');
    }

    // Update password
    const { error } = await supabase.auth.updateUser({
      password: newPassword
    });

    if (error) throw error;
  };

  const updateProfile = async (data: { firstName?: string; lastName?: string; avatar?: File }) => {
    if (!isConfigured) {
      throw new Error('Supabase not configured.');
    }
    if (!user) throw new Error('No authenticated user');

    let avatarUrl = user.avatarUrl;

    // Upload avatar if provided
    if (data.avatar) {
      const fileExt = data.avatar.name.split('.').pop();
      const fileName = `${user.id}/avatar.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, data.avatar, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      avatarUrl = publicUrl;
    }

    const fullName = [data.firstName, data.lastName].filter(Boolean).join(' ') || null;

    const { error } = await supabase
      .from('profiles')
      .update({
        full_name: fullName,
        avatar_url: avatarUrl,
        updated_at: new Date().toISOString()
      })
      .eq('id', user.id);

    if (error) throw error;

    // Update local state
    setUser(prev => prev ? {
      ...prev,
      fullName,
      avatarUrl
    } : null);
  };

  const value = {
    user,
    isLoaded,
    isSignedIn: !!user,
    isConfigured,
    signIn,
    signUp,
    signInWithMagicLink,
    signInWithOAuth,
    signOut,
    updateProfile,
    resetPassword,
    changePassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
