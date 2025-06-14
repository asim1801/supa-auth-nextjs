
import { useState } from 'react';
import { useAuth } from '@/lib/auth';
import { useToast } from '@/hooks/use-toast';
import { 
  enableTwoFactor, 
  verifyTwoFactor, 
  addTrustedDevice, 
  getTrustedDevices,
  removeTrustedDevice as removeTrustedDeviceLib,
  isDeviceTrusted,
  disableTwoFactor
} from '@/lib/twoFactor';
import type { TwoFactorSetup, TrustedDevice } from '@/lib/twoFactor';

export function useAdvancedAuth() {
  const [isLoading, setIsLoading] = useState(false);
  const [twoFactorSetup, setTwoFactorSetup] = useState<TwoFactorSetup | null>(null);
  const [trustedDevices, setTrustedDevices] = useState<TrustedDevice[]>([]);
  const { user } = useAuth();
  const { toast } = useToast();

  const setupTwoFactor = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const setup = await enableTwoFactor(user.id);
      setTwoFactorSetup(setup);
      toast({
        title: '2FA Setup',
        description: 'Scan the QR code with your authenticator app',
      });
    } catch (error: any) {
      toast({
        title: 'Setup Failed',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const verifyTwoFactorToken = async (token: string) => {
    if (!user) return false;
    
    try {
      const isValid = await verifyTwoFactor(user.id, token);
      if (isValid) {
        toast({
          title: '2FA Verified',
          description: 'Two-factor authentication is now active',
        });
        setTwoFactorSetup(null);
      } else {
        toast({
          title: 'Invalid Code',
          description: 'Please check your authenticator app and try again',
          variant: 'destructive',
        });
      }
      return isValid;
    } catch (error: any) {
      toast({
        title: 'Verification Failed',
        description: error.message,
        variant: 'destructive',
      });
      return false;
    }
  };

  const trustCurrentDevice = async () => {
    if (!user) return;
    
    try {
      await addTrustedDevice(user.id, {});
      toast({
        title: 'Device Trusted',
        description: 'This device has been added to your trusted devices',
      });
      loadTrustedDevices();
    } catch (error: any) {
      toast({
        title: 'Failed to trust device',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const removeTrustedDevice = async (deviceId: string) => {
    if (!user) return;
    
    try {
      await removeTrustedDeviceLib(user.id, deviceId);
      toast({
        title: 'Device Removed',
        description: 'Device has been removed from trusted devices',
      });
      loadTrustedDevices();
    } catch (error: any) {
      toast({
        title: 'Failed to remove device',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const loadTrustedDevices = async () => {
    if (!user) return;
    
    try {
      const devices = await getTrustedDevices(user.id);
      setTrustedDevices(devices);
    } catch (error: any) {
      console.error('Failed to load trusted devices:', error);
    }
  };

  const checkDeviceTrust = async (): Promise<boolean> => {
    if (!user) return false;
    return await isDeviceTrusted(user.id);
  };

  const disable2FA = async () => {
    if (!user) return;
    
    try {
      await disableTwoFactor(user.id);
      toast({
        title: '2FA Disabled',
        description: 'Two-factor authentication has been disabled',
      });
    } catch (error: any) {
      toast({
        title: 'Failed to disable 2FA',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  return {
    isLoading,
    twoFactorSetup,
    trustedDevices,
    setupTwoFactor,
    verifyTwoFactorToken,
    trustCurrentDevice,
    removeTrustedDevice,
    loadTrustedDevices,
    checkDeviceTrust,
    disable2FA,
  };
}
