import { authenticator } from 'otplib';
import { supabase, isSupabaseConfigured } from './supabase';
import { 
  SecureEncryption, 
  RateLimiter, 
  DeviceFingerprinting, 
  safeCompare,
  InputSecurity 
} from './security';

export interface TwoFactorSetup {
  secret: string;
  qrCodeUrl: string;
  backupCodes: string[];
}

export interface TrustedDevice {
  id: string;
  name: string;
  lastUsed: string;
  userAgent: string;
  ipAddress: string;
  deviceFingerprint: string;
  isCurrent: boolean;
  expiresAt: string;
}

// Configure otplib for maximum security
authenticator.options = {
  window: 1, // Strict time window
  crypto: window.crypto,
};

export async function enableTwoFactor(userId: string): Promise<TwoFactorSetup> {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase not configured');
  }

  // Rate limiting
  const rateLimitResult = await RateLimiter.checkLimit(userId, '2fa_setup', 3, 60);
  if (!rateLimitResult.allowed) {
    throw new Error('Too many 2FA setup attempts. Please try again later.');
  }

  // Generate cryptographically secure secret
  const secret = authenticator.generateSecret();
  const backupCodes = generateSecureBackupCodes();
  
  // Create QR code URL with proper issuer and account name
  const qrCodeUrl = authenticator.keyuri(
    `user-${userId}`, 
            'Supauth', 
    secret
  );

  // Encrypt and store in database with additional security metadata
  const { error } = await supabase
    .from('user_two_factor')
    .upsert({
      user_id: userId,
      secret: await SecureEncryption.encrypt(secret, userId),
      backup_codes: await SecureEncryption.encrypt(JSON.stringify(backupCodes), userId),
      enabled: false,
      setup_ip: await getUserIPAddress(),
      setup_user_agent: navigator.userAgent,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });

  if (error) throw error;

  return { 
    secret, 
    qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrCodeUrl)}`, 
    backupCodes 
  };
}

export async function verifyTwoFactor(userId: string, token: string): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;

  // Input validation and sanitization
  const sanitizedToken = InputSecurity.sanitizeInput(token).replace(/\s/g, '');
  if (!/^\d{6}$/.test(sanitizedToken) && !/^[A-F0-9]{8}$/i.test(sanitizedToken)) {
    return false;
  }

  // Rate limiting for 2FA verification
  const rateLimitResult = await RateLimiter.checkLimit(userId, '2fa_verify', 5, 15);
  if (!rateLimitResult.allowed) {
    throw new Error('Too many verification attempts. Please try again later.');
  }

  const { data, error } = await supabase
    .from('user_two_factor')
    .select('secret, backup_codes, last_used_code, last_verified')
    .eq('user_id', userId)
    .single();

  if (error || !data) return false;

  try {
    const decryptedSecret = await SecureEncryption.decrypt(data.secret, userId);
    const decryptedBackupCodes: string[] = JSON.parse(
      await SecureEncryption.decrypt(data.backup_codes, userId)
    );

    // Prevent replay attacks - check if token was recently used
    const now = Date.now();
    const lastVerified = data.last_verified ? new Date(data.last_verified).getTime() : 0;
    
    if (sanitizedToken === data.last_used_code && (now - lastVerified) < 30000) {
      return false; // Token reuse within 30 seconds
    }

    let isValid = false;
    let isBackupCode = false;

    // Check if it's a backup code (8 characters, hex)
    if (sanitizedToken.length === 8) {
      isBackupCode = true;
      // Use timing-safe comparison for backup codes
      for (const code of decryptedBackupCodes) {
        if (safeCompare(code.toUpperCase(), sanitizedToken.toUpperCase())) {
          isValid = true;
          break;
        }
      }

      if (isValid) {
        // Remove used backup code
        const updatedCodes = decryptedBackupCodes.filter(
          code => !safeCompare(code.toUpperCase(), sanitizedToken.toUpperCase())
        );
        
        await supabase
          .from('user_two_factor')
          .update({ 
            backup_codes: await SecureEncryption.encrypt(JSON.stringify(updatedCodes), userId),
            last_used_code: sanitizedToken,
            last_verified: new Date().toISOString()
          })
          .eq('user_id', userId);
      }
    } else {
      // Verify TOTP token with timing attack resistance
      isValid = authenticator.verify({ 
        token: sanitizedToken, 
        secret: decryptedSecret 
      });
    }
    
    if (isValid && !isBackupCode) {
      // Update last verification time and prevent replay attacks
      await supabase
        .from('user_two_factor')
        .update({ 
          enabled: true,
          last_used_code: sanitizedToken,
          last_verified: new Date().toISOString(),
          verification_ip: await getUserIPAddress(),
          verification_user_agent: navigator.userAgent
        })
        .eq('user_id', userId);
    }

    return isValid;
  } catch (error) {
    console.error('2FA verification error:', error);
    return false;
  }
}

export async function addTrustedDevice(userId: string, deviceInfo: Partial<TrustedDevice>): Promise<void> {
  if (!isSupabaseConfigured()) return;

  // Rate limiting for device trust
  const rateLimitResult = await RateLimiter.checkLimit(userId, 'trust_device', 10, 60);
  if (!rateLimitResult.allowed) {
    throw new Error('Too many device trust attempts. Please try again later.');
  }

  const fingerprint = await DeviceFingerprinting.generateSecureFingerprint();
  const ipAddress = await getUserIPAddress();
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

  // Check if device already exists
  const { data: existingDevice } = await supabase
    .from('trusted_devices')
    .select('id')
    .eq('user_id', userId)
    .eq('device_fingerprint', fingerprint)
    .single();

  if (existingDevice) {
    // Update existing device
    await supabase
      .from('trusted_devices')
      .update({
        last_used: new Date().toISOString(),
        expires_at: expiresAt.toISOString(),
        ip_address: ipAddress,
        user_agent: navigator.userAgent
      })
      .eq('id', existingDevice.id);
  } else {
    // Create new trusted device
    const { error } = await supabase
      .from('trusted_devices')
      .insert({
        user_id: userId,
        name: deviceInfo.name || getDeviceName(),
        user_agent: navigator.userAgent,
        ip_address: ipAddress,
        device_fingerprint: fingerprint,
        expires_at: expiresAt.toISOString(),
        last_used: new Date().toISOString(),
        created_at: new Date().toISOString()
      });

    if (error) throw error;
  }
}

export async function getTrustedDevices(userId: string): Promise<TrustedDevice[]> {
  if (!isSupabaseConfigured()) return [];

  // Clean up expired devices first
  await supabase
    .from('trusted_devices')
    .delete()
    .eq('user_id', userId)
    .lt('expires_at', new Date().toISOString());

  const { data, error } = await supabase
    .from('trusted_devices')
    .select('*')
    .eq('user_id', userId)
    .order('last_used', { ascending: false });

  if (error) return [];

  const currentFingerprint = await DeviceFingerprinting.generateSecureFingerprint();

  return data.map(device => ({
    id: device.id,
    name: device.name,
    lastUsed: device.last_used,
    userAgent: device.user_agent,
    ipAddress: device.ip_address,
    deviceFingerprint: device.device_fingerprint,
    expiresAt: device.expires_at,
    isCurrent: safeCompare(device.device_fingerprint, currentFingerprint)
  }));
}

export async function removeTrustedDevice(userId: string, deviceId: string): Promise<void> {
  if (!isSupabaseConfigured()) return;

  const { error } = await supabase
    .from('trusted_devices')
    .delete()
    .eq('user_id', userId)
    .eq('id', deviceId);

  if (error) throw error;
}

export async function isDeviceTrusted(userId: string): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;

  const fingerprint = await DeviceFingerprinting.generateSecureFingerprint();
  
  const { data, error } = await supabase
    .from('trusted_devices')
    .select('expires_at')
    .eq('user_id', userId)
    .eq('device_fingerprint', fingerprint)
    .gt('expires_at', new Date().toISOString())
    .single();

  return !error && !!data;
}

export async function disableTwoFactor(userId: string): Promise<void> {
  if (!isSupabaseConfigured()) return;

  // Rate limiting for 2FA disable
  const rateLimitResult = await RateLimiter.checkLimit(userId, '2fa_disable', 3, 60);
  if (!rateLimitResult.allowed) {
    throw new Error('Too many disable attempts. Please try again later.');
  }

  const { error } = await supabase
    .from('user_two_factor')
    .delete()
    .eq('user_id', userId);

  if (error) throw error;

  // Also remove all trusted devices when 2FA is disabled
  await supabase
    .from('trusted_devices')
    .delete()
    .eq('user_id', userId);
}

// Helper functions with enhanced security
function generateSecureBackupCodes(): string[] {
  const codes: string[] = [];
  for (let i = 0; i < 10; i++) {
    const array = new Uint8Array(4);
    window.crypto.getRandomValues(array);
    const code = Array.from(array, byte => 
      byte.toString(16).padStart(2, '0')
    ).join('').toUpperCase();
    codes.push(code);
  }
  return codes;
}

function getDeviceName(): string {
  const userAgent = navigator.userAgent.toLowerCase();
  if (userAgent.includes('iphone')) return 'iPhone';
  if (userAgent.includes('ipad')) return 'iPad';
  if (userAgent.includes('android')) return 'Android Device';
  if (userAgent.includes('mac')) return 'Mac';
  if (userAgent.includes('windows')) return 'Windows PC';
  if (userAgent.includes('linux')) return 'Linux PC';
  return 'Unknown Device';
}

async function getUserIPAddress(): Promise<string> {
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    return data.ip;
  } catch {
    return 'Unknown';
  }
}
