
import CryptoJS from 'crypto-js';
import { supabase, isSupabaseConfigured } from './supabase';

// Security constants
const MAX_2FA_ATTEMPTS = 5;
const ATTEMPT_WINDOW_MINUTES = 15;
const TOKEN_WINDOW_SECONDS = 30;
const MAX_DEVICE_TRUST_DAYS = 30;

export interface SecurityContext {
  userId: string;
  sessionId: string;
  ipAddress: string;
  userAgent: string;
  timestamp: number;
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetTime: number;
}

// Enhanced encryption with proper key derivation
export class SecureEncryption {
  private static async deriveKey(password: string, salt: string): Promise<string> {
    const iterations = 100000;
    const keySize = 256 / 32;
    return CryptoJS.PBKDF2(password, salt, {
      keySize,
      iterations,
      hasher: CryptoJS.algo.SHA256
    }).toString();
  }

  static async encrypt(data: string, userId: string): Promise<string> {
    const salt = CryptoJS.lib.WordArray.random(128/8).toString();
    const masterKey = await this.getMasterKey();
    const derivedKey = await this.deriveKey(masterKey + userId, salt);
    const iv = CryptoJS.lib.WordArray.random(128/8);
    
    const encrypted = CryptoJS.AES.encrypt(data, derivedKey, { iv });
    
    return JSON.stringify({
      salt,
      iv: iv.toString(),
      data: encrypted.toString()
    });
  }

  static async decrypt(encryptedData: string, userId: string): Promise<string> {
    const { salt, iv, data } = JSON.parse(encryptedData);
    const masterKey = await this.getMasterKey();
    const derivedKey = await this.deriveKey(masterKey + userId, salt);
    
    const decrypted = CryptoJS.AES.decrypt(data, derivedKey, {
      iv: CryptoJS.enc.Hex.parse(iv)
    });
    
    return decrypted.toString(CryptoJS.enc.Utf8);
  }

  private static async getMasterKey(): Promise<string> {
    // In production, this should come from environment variables or HSM
    const envKey = process.env.ENCRYPTION_KEY;
    if (!envKey) {
      throw new Error('Encryption key not configured. Please set ENCRYPTION_KEY environment variable.');
    }
    return envKey;
  }
}

// Enhanced rate limiting
export class RateLimiter {
  static async checkLimit(
    identifier: string, 
    action: string, 
    maxAttempts: number = 5,
    windowMinutes: number = 15
  ): Promise<RateLimitResult> {
    if (!isSupabaseConfigured()) {
      return { allowed: true, remaining: maxAttempts, resetTime: Date.now() };
    }

    const windowStart = new Date(Date.now() - windowMinutes * 60 * 1000);
    
    // Count recent attempts
    const { data: attempts, error } = await supabase
      .from('rate_limits')
      .select('id')
      .eq('identifier', identifier)
      .eq('action', action)
      .gte('created_at', windowStart.toISOString());

    if (error) throw error;

    const currentAttempts = attempts?.length || 0;
    const remaining = Math.max(0, maxAttempts - currentAttempts);
    const resetTime = Date.now() + windowMinutes * 60 * 1000;

    if (currentAttempts >= maxAttempts) {
      return { allowed: false, remaining: 0, resetTime };
    }

    // Record this attempt
    await supabase
      .from('rate_limits')
      .insert({
        identifier,
        action,
        ip_address: await this.getClientIP(),
        user_agent: navigator.userAgent,
        created_at: new Date().toISOString()
      });

    return { allowed: true, remaining: remaining - 1, resetTime };
  }

  private static async getClientIP(): Promise<string> {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip;
    } catch {
      return 'unknown';
    }
  }

  static async cleanupExpiredLimits(): Promise<void> {
    if (!isSupabaseConfigured()) return;

    const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000); // 24 hours ago
    
    await supabase
      .from('rate_limits')
      .delete()
      .lt('created_at', cutoff.toISOString());
  }
}

// Enhanced device fingerprinting
export class DeviceFingerprinting {
  static async generateSecureFingerprint(): Promise<string> {
    const components = await this.collectFingerprints();
    const fingerprintString = JSON.stringify(components);
    
    // Use multiple hashing rounds for security
    let hash = CryptoJS.SHA256(fingerprintString).toString();
    for (let i = 0; i < 1000; i++) {
      hash = CryptoJS.SHA256(hash + i).toString();
    }
    
    return hash;
  }

  private static async collectFingerprints(): Promise<Record<string, any>> {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.textBaseline = 'top';
      ctx.font = '14px Arial';
      ctx.fillText('Device fingerprint', 2, 2);
    }

    return {
      userAgent: navigator.userAgent,
      language: navigator.language,
      languages: navigator.languages,
      platform: navigator.platform,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      screen: `${screen.width}x${screen.height}x${screen.colorDepth}`,
      hardwareConcurrency: navigator.hardwareConcurrency,
      cookieEnabled: navigator.cookieEnabled,
      doNotTrack: navigator.doNotTrack,
      canvasFingerprint: canvas.toDataURL(),
      webglFingerprint: this.getWebGLFingerprint(),
      audioFingerprint: await this.getAudioFingerprint(),
      timestamp: Date.now()
    };
  }

  private static getWebGLFingerprint(): string {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl') as WebGLRenderingContext | null;
    if (!gl) return 'no-webgl';

    const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
    return debugInfo ? 
      gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL) + '~' + 
      gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) : 'no-debug-info';
  }

  private static async getAudioFingerprint(): Promise<string> {
    return new Promise((resolve) => {
      try {
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const analyser = audioContext.createAnalyser();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(analyser);
        analyser.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = 10000;
        gainNode.gain.value = 0;
        
        oscillator.start();
        
        setTimeout(() => {
          const data = new Uint8Array(analyser.frequencyBinCount);
          analyser.getByteFrequencyData(data);
          oscillator.stop();
          audioContext.close();
          
          const fingerprint = Array.from(data).slice(0, 50).join(',');
          resolve(CryptoJS.SHA256(fingerprint).toString());
        }, 100);
      } catch {
        resolve('no-audio');
      }
    });
  }
}

// CSRF Protection
export class CSRFProtection {
  private static readonly TOKEN_HEADER = 'X-CSRF-Token';
  private static readonly TOKEN_STORAGE_KEY = 'csrf_token';

  static generateToken(): string {
    const token = CryptoJS.lib.WordArray.random(256/8).toString();
    sessionStorage.setItem(this.TOKEN_STORAGE_KEY, token);
    return token;
  }

  static getToken(): string | null {
    return sessionStorage.getItem(this.TOKEN_STORAGE_KEY);
  }

  static validateToken(token: string): boolean {
    const storedToken = this.getToken();
    return storedToken !== null && storedToken === token;
  }

  static addTokenToHeaders(headers: HeadersInit = {}): HeadersInit {
    const token = this.getToken();
    if (token) {
      return {
        ...headers,
        [this.TOKEN_HEADER]: token
      };
    }
    return headers;
  }
}

// Input sanitization and validation
export class InputSecurity {
  static sanitizeInput(input: string): string {
    return input
      .replace(/[<>]/g, '') // Remove potential HTML tags
      .replace(/['"]/g, '') // Remove quotes
      .replace(/javascript:/gi, '') // Remove javascript protocols
      .replace(/on\w+=/gi, '') // Remove event handlers
      .trim();
  }

  static validateEmail(email: string): { valid: boolean; reason?: string } {
    const sanitized = this.sanitizeInput(email);
    
    // Check for suspicious patterns
    if (sanitized !== email) {
      return { valid: false, reason: 'Contains invalid characters' };
    }

    // Enhanced email validation
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      return { valid: false, reason: 'Invalid email format' };
    }

    // Check for disposable email domains
    const disposableDomains = [
      '10minutemail.com', 'tempmail.org', 'guerrillamail.com',
      'mailinator.com', 'temp-mail.org', 'throwaway.email',
      'yopmail.com', 'maildrop.cc', 'tempail.com'
    ];
    
    const domain = email.split('@')[1]?.toLowerCase();
    if (domain && disposableDomains.includes(domain)) {
      return { valid: false, reason: 'Disposable email addresses not allowed' };
    }

    return { valid: true };
  }

  static validatePassword(password: string): { valid: boolean; score: number; feedback: string[] } {
    const feedback: string[] = [];
    let score = 0;

    // Length check
    if (password.length >= 12) score += 2;
    else if (password.length >= 8) score += 1;
    else feedback.push('Password must be at least 12 characters long');

    // Character variety
    if (/[A-Z]/.test(password)) score += 1;
    else feedback.push('Add uppercase letters');

    if (/[a-z]/.test(password)) score += 1;
    else feedback.push('Add lowercase letters');

    if (/[0-9]/.test(password)) score += 1;
    else feedback.push('Add numbers');

    if (/[^A-Za-z0-9]/.test(password)) score += 2;
    else feedback.push('Add special characters');

    // Pattern checks
    if (!/(.)\1{2,}/.test(password)) score += 1;
    else feedback.push('Avoid repeating characters');

    // Common password check
    const commonPasswords = [
      'password', 'password123', '123456', '123456789', 'qwerty',
      'abc123', 'password1', 'admin', 'letmein', 'welcome'
    ];
    
    if (!commonPasswords.some(common => password.toLowerCase().includes(common))) {
      score += 1;
    } else {
      feedback.push('Avoid common passwords');
    }

    // Entropy calculation
    const entropy = this.calculateEntropy(password);
    if (entropy > 50) score += 2;
    else if (entropy > 30) score += 1;

    return {
      valid: score >= 6,
      score: Math.min(score, 10),
      feedback
    };
  }

  private static calculateEntropy(password: string): number {
    const charset = new Set(password).size;
    return password.length * Math.log2(charset);
  }
}

// Timing attack resistant comparison
export function safeCompare(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}

// Security headers helper
export function getSecurityHeaders(): HeadersInit {
  return {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';",
    ...CSRFProtection.addTokenToHeaders()
  };
}
