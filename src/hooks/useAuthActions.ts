import { useState } from 'react';
import { useAuth } from '@/lib/auth';
import { useToast } from '@/hooks/use-toast';
import { authConfig } from '@/config/auth';

export function useAuthActions() {
  const [isLoading, setIsLoading] = useState(false);
  const { signIn, signUp, signInWithMagicLink, signInWithOAuth, signOut, updateProfile, resetPassword, changePassword } = useAuth();
  const { toast } = useToast();

  const handleSignIn = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      await signIn(email, password);
      toast({
        title: 'Welcome back!',
        description: 'You have been signed in successfully.',
      });
      window.location.href = authConfig.auth.redirectAfterSignIn;
    } catch (error: any) {
      toast({
        title: 'Sign in failed',
        description: error.message || 'Invalid email or password.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (email: string, password: string, firstName?: string, lastName?: string) => {
    setIsLoading(true);
    try {
      await signUp(email, password, firstName, lastName);
      toast({
        title: 'Account created!',
        description: authConfig.auth.enableEmailVerification 
          ? 'Please check your email to verify your account.'
          : 'Welcome to the platform!',
      });
      if (!authConfig.auth.enableEmailVerification) {
        window.location.href = authConfig.auth.redirectAfterSignUp;
      }
    } catch (error: any) {
      toast({
        title: 'Sign up failed',
        description: error.message || 'Unable to create account.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleMagicLink = async (email: string) => {
    setIsLoading(true);
    try {
      await signInWithMagicLink(email);
      toast({
        title: 'Magic link sent!',
        description: 'Check your email for a sign-in link.',
      });
    } catch (error: any) {
      toast({
        title: 'Failed to send magic link',
        description: error.message || 'Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialAuth = async (provider: 'google' | 'github' | 'discord') => {
    try {
      await signInWithOAuth(provider);
    } catch (error: any) {
      toast({
        title: 'Social sign-in failed',
        description: error.message || `Failed to sign in with ${provider}.`,
        variant: 'destructive',
      });
    }
  };

  const handlePasswordReset = async (email: string) => {
    setIsLoading(true);
    try {
      await resetPassword(email);
      toast({
        title: 'Password reset email sent',
        description: 'Check your email for reset instructions.',
      });
    } catch (error: any) {
      toast({
        title: 'Failed to send reset email',
        description: error.message || 'Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: 'Signed out',
        description: 'You have been signed out successfully.',
      });
      window.location.href = authConfig.auth.redirectAfterSignOut;
    } catch (error: any) {
      toast({
        title: 'Sign out failed',
        description: error.message || 'Unable to sign out.',
        variant: 'destructive',
      });
    }
  };

  const handleUpdateProfile = async (data: { firstName?: string; lastName?: string; avatar?: File }) => {
    setIsLoading(true);
    try {
      // Validate avatar if provided
      if (data.avatar) {
        if (data.avatar.size > authConfig.profile.maxAvatarSize) {
          throw new Error(`Avatar must be smaller than ${authConfig.profile.maxAvatarSize / (1024 * 1024)}MB`);
        }
        if (!authConfig.profile.allowedAvatarTypes.includes(data.avatar.type as any)) {
          throw new Error('Invalid file type. Please use JPEG, PNG, or WebP.');
        }
      }

      await updateProfile(data);
      toast({
        title: 'Profile updated',
        description: 'Your profile has been updated successfully.',
      });
    } catch (error: any) {
      toast({
        title: 'Update failed',
        description: error.message || 'Unable to update profile.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePassword = async (currentPassword: string, newPassword: string) => {
    setIsLoading(true);
    try {
      await changePassword(currentPassword, newPassword);
      toast({
        title: 'Password updated',
        description: 'Your password has been changed successfully.',
      });
    } catch (error: any) {
      toast({
        title: 'Failed to change password',
        description: error.message || 'Unable to change password.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    handleSignIn,
    handleSignUp,
    handleMagicLink,
    handleSocialAuth,
    handlePasswordReset,
    handleSignOut,
    handleUpdateProfile,
    handleChangePassword,
  };
}
