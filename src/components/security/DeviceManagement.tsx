'use client'

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { 
  Smartphone, 
  Monitor, 
  Tablet, 
  Shield, 
  Trash2, 
  MapPin,
  Clock,
  AlertTriangle
} from 'lucide-react';
import { useAdvancedAuth } from '@/hooks/useAdvancedAuth';
import { TrustedDevice } from '@/lib/twoFactor';
import { formatDistanceToNow } from 'date-fns';

export function DeviceManagement() {
  const { trustedDevices, loadTrustedDevices, trustCurrentDevice, removeTrustedDevice } = useAdvancedAuth();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadTrustedDevices();
  }, [loadTrustedDevices]);

  const getDeviceIcon = (userAgent: string) => {
    const ua = userAgent.toLowerCase();
    if (ua.includes('mobile') || ua.includes('iphone') || ua.includes('android')) {
      return <Smartphone className="h-5 w-5" />;
    }
    if (ua.includes('tablet') || ua.includes('ipad')) {
      return <Tablet className="h-5 w-5" />;
    }
    return <Monitor className="h-5 w-5" />;
  };

  const handleTrustDevice = async () => {
    setIsLoading(true);
    try {
      await trustCurrentDevice();
      await loadTrustedDevices();
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveDevice = async (deviceId: string) => {
    try {
      await removeTrustedDevice(deviceId);
      await loadTrustedDevices();
    } catch (error) {
      console.error('Failed to remove device:', error);
    }
  };

  const currentDevice = trustedDevices.find(device => device.isCurrent);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5" />
            <span>Trusted Devices</span>
          </CardTitle>
          <CardDescription>
            Manage devices that can skip two-factor authentication
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!currentDevice && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                This device is not trusted. You can add it to your trusted devices to skip 2FA on this device.
                <Button 
                  onClick={handleTrustDevice} 
                  disabled={isLoading}
                  className="ml-2"
                  size="sm"
                >
                  {isLoading ? 'Adding...' : 'Trust This Device'}
                </Button>
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-3">
            {trustedDevices.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                No trusted devices found
              </p>
            ) : (
              trustedDevices.map((device) => (
                <DeviceCard 
                  key={device.id} 
                  device={device} 
                  onRemove={handleRemoveDevice}
                  getDeviceIcon={getDeviceIcon}
                />
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

interface DeviceCardProps {
  device: TrustedDevice;
  onRemove: (deviceId: string) => void;
  getDeviceIcon: (userAgent: string) => React.ReactNode;
}

function DeviceCard({ device, onRemove, getDeviceIcon }: DeviceCardProps) {
  return (
    <div className="flex items-center justify-between p-3 border rounded-lg">
      <div className="flex items-center space-x-3">
        {getDeviceIcon(device.userAgent)}
        <div className="flex-1">
          <div className="flex items-center space-x-2">
            <span className="font-medium">{device.name}</span>
            {device.isCurrent && (
              <Badge variant="secondary" className="text-xs">
                Current Device
              </Badge>
            )}
          </div>
          <div className="flex items-center space-x-4 text-xs text-muted-foreground">
            <span className="flex items-center space-x-1">
              <MapPin className="h-3 w-3" />
              <span>{device.ipAddress}</span>
            </span>
            <span className="flex items-center space-x-1">
              <Clock className="h-3 w-3" />
              <span>Last used {formatDistanceToNow(new Date(device.lastUsed), { addSuffix: true })}</span>
            </span>
          </div>
        </div>
      </div>
      
      {!device.isCurrent && (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="ghost" size="sm">
              <Trash2 className="h-4 w-4" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Remove Trusted Device</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to remove "{device.name}" from your trusted devices? 
                This device will require 2FA on next sign-in.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => onRemove(device.id)}>
                Remove Device
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
}
