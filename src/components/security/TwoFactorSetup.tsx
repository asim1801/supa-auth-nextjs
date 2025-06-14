'use client'

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Shield, Copy, Check, Download, AlertTriangle, Smartphone } from 'lucide-react';
import { useAdvancedAuth } from '@/hooks/useAdvancedAuth';
import { useToast } from '@/hooks/use-toast';

export function TwoFactorSetup() {
  const [verificationCode, setVerificationCode] = useState('');
  const [copiedCodes, setCopiedCodes] = useState(false);
  const [downloadedCodes, setDownloadedCodes] = useState(false);
  const [step, setStep] = useState<'setup' | 'scan' | 'verify' | 'backup'>('setup');
  
  const { isLoading, twoFactorSetup, setupTwoFactor, verifyTwoFactorToken } = useAdvancedAuth();
  const { toast } = useToast();

  const handleSetup = async () => {
    await setupTwoFactor();
    setStep('scan');
  };

  const handleVerify = async () => {
    if (verificationCode.length === 6) {
      const isValid = await verifyTwoFactorToken(verificationCode);
      if (isValid) {
        setStep('backup');
      }
    }
  };

  const copyBackupCodes = () => {
    if (twoFactorSetup?.backupCodes) {
      navigator.clipboard.writeText(twoFactorSetup.backupCodes.join('\n'));
      setCopiedCodes(true);
      setTimeout(() => setCopiedCodes(false), 2000);
      toast({
        title: "Backup codes copied",
        description: "Save these codes in a secure location",
      });
    }
  };

  const downloadBackupCodes = () => {
    if (twoFactorSetup?.backupCodes) {
      const content = `Supauth Two-Factor Authentication Backup Codes\n\nGenerated: ${new Date().toISOString()}\n\nBackup Codes:\n${twoFactorSetup.backupCodes.join('\n')}\n\nIMPORTANT:\n- Keep these codes secure\n- Each code can only be used once\n- Use these if you lose access to your authenticator app`;
      
      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
              a.download = 'supauth-backup-codes.txt';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      setDownloadedCodes(true);
      toast({
        title: "Backup codes downloaded",
        description: "Store this file in a secure location",
      });
    }
  };

  const getStepProgress = () => {
    switch (step) {
      case 'setup': return 25;
      case 'scan': return 50;
      case 'verify': return 75;
      case 'backup': return 100;
      default: return 0;
    }
  };

  if (step === 'setup') {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5" />
            <span>Two-Factor Authentication</span>
          </CardTitle>
          <CardDescription>
            Secure your account with an additional layer of protection
          </CardDescription>
          <Progress value={getStepProgress()} className="w-full" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <Smartphone className="h-4 w-4" />
            <AlertDescription>
              You'll need an authenticator app like Google Authenticator, Authy, or 1Password to set up 2FA.
            </AlertDescription>
          </Alert>
          
          <div className="space-y-2">
            <h4 className="font-medium">What you'll get:</h4>
            <ul className="text-sm text-muted-foreground space-y-1 ml-4">
              <li>• Protection against unauthorized access</li>
              <li>• Secure backup codes for device loss</li>
              <li>• Industry-standard TOTP security</li>
              <li>• Works with all major authenticator apps</li>
            </ul>
          </div>

          <Button onClick={handleSetup} disabled={isLoading} className="w-full">
            {isLoading ? 'Setting up...' : 'Begin Setup'}
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (step === 'scan' && twoFactorSetup) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Scan QR Code</CardTitle>
          <CardDescription>
            Use your authenticator app to scan this QR code
          </CardDescription>
          <Progress value={getStepProgress()} className="w-full" />
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center space-y-4">
            <img
              src={twoFactorSetup.qrCodeUrl}
              alt="2FA QR Code"
              className="mx-auto border rounded-lg p-4 bg-white"
              width={200}
              height={200}
            />
            
            <div className="space-y-2">
              <p className="text-sm font-medium">Manual entry code:</p>
              <code className="text-xs bg-muted px-2 py-1 rounded break-all">
                {twoFactorSetup.secret}
              </code>
            </div>
          </div>

          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Make sure to scan the QR code or enter the manual code in your authenticator app before proceeding.
            </AlertDescription>
          </Alert>

          <Button onClick={() => setStep('verify')} className="w-full">
            I've Added This to My App
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (step === 'verify') {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Verify Setup</CardTitle>
          <CardDescription>
            Enter the 6-digit code from your authenticator app
          </CardDescription>
          <Progress value={getStepProgress()} className="w-full" />
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="verification-code">Verification Code</Label>
            <Input
              id="verification-code"
              placeholder="000000"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              className="text-center text-lg tracking-widest"
              maxLength={6}
              autoComplete="off"
            />
            <p className="text-xs text-muted-foreground">
              The code changes every 30 seconds
            </p>
          </div>

          <Button
            onClick={handleVerify}
            disabled={verificationCode.length !== 6}
            className="w-full"
          >
            Verify & Enable 2FA
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (step === 'backup' && twoFactorSetup) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-green-600">2FA Successfully Enabled!</CardTitle>
          <CardDescription>
            Save your backup codes in a secure location
          </CardDescription>
          <Progress value={getStepProgress()} className="w-full" />
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert>
            <Shield className="h-4 w-4" />
            <AlertDescription>
              <strong>Important:</strong> These backup codes can be used to access your account if you lose your authenticator device. Each code can only be used once.
            </AlertDescription>
          </Alert>

          <div className="space-y-2">
            <Label>Backup Codes</Label>
            <div className="p-3 bg-muted rounded-lg space-y-1">
              <div className="grid grid-cols-2 gap-2">
                {twoFactorSetup.backupCodes.map((code, index) => (
                  <Badge key={index} variant="outline" className="justify-center font-mono">
                    {code}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          <div className="flex space-x-2">
            <Button
              variant="outline"
              onClick={copyBackupCodes}
              className="flex-1"
            >
              {copiedCodes ? (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Codes
                </>
              )}
            </Button>
            
            <Button
              variant="outline"
              onClick={downloadBackupCodes}
              className="flex-1"
            >
              <Download className="h-4 w-4 mr-2" />
              {downloadedCodes ? 'Downloaded!' : 'Download'}
            </Button>
          </div>

          <Alert className="border-orange-200 bg-orange-50">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>Next time you sign in:</strong> You'll need to enter a code from your authenticator app or use one of these backup codes.
            </AlertDescription>
          </Alert>

          <Button onClick={() => window.location.reload()} className="w-full">
            Complete Setup
          </Button>
        </CardContent>
      </Card>
    );
  }

  return null;
}
