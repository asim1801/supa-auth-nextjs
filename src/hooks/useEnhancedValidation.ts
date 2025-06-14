
import { useState, useCallback } from 'react';
import { z } from 'zod';
import { InputSecurity } from '@/lib/security';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  score?: number;
}

export interface PasswordStrength {
  score: number;
  feedback: string[];
  isValid: boolean;
}

export function useEnhancedValidation() {
  const [validationCache, setValidationCache] = useState<Map<string, ValidationResult>>(new Map());

  const validatePassword = useCallback((password: string): PasswordStrength => {
    const cacheKey = `password:${password}`;
    const cached = validationCache.get(cacheKey);
    
    if (cached) {
      return { 
        score: cached.score || 0, 
        feedback: cached.errors, 
        isValid: cached.isValid 
      };
    }

    const result = InputSecurity.validatePassword(password);
    
    const validationResult: ValidationResult = {
      isValid: result.valid,
      errors: result.feedback,
      score: result.score
    };

    setValidationCache(prev => new Map(prev).set(cacheKey, validationResult));

    return {
      score: result.score,
      feedback: result.feedback,
      isValid: result.valid
    };
  }, [validationCache]);

  const validateEmail = useCallback((email: string): ValidationResult => {
    const cacheKey = `email:${email}`;
    const cached = validationCache.get(cacheKey);
    
    if (cached) return cached;

    const result = InputSecurity.validateEmail(email);
    const validationResult: ValidationResult = {
      isValid: result.valid,
      errors: result.valid ? [] : [result.reason || 'Invalid email']
    };

    setValidationCache(prev => new Map(prev).set(cacheKey, validationResult));
    return validationResult;
  }, [validationCache]);

  const validatePhone = useCallback((phone: string): ValidationResult => {
    const sanitized = InputSecurity.sanitizeInput(phone);
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    
    return {
      isValid: phoneRegex.test(sanitized),
      errors: phoneRegex.test(sanitized) ? [] : ['Invalid phone number format']
    };
  }, []);

  const validateName = useCallback((name: string): ValidationResult => {
    const sanitized = InputSecurity.sanitizeInput(name);
    const nameRegex = /^[a-zA-Z\s'-]+$/;
    
    const errors: string[] = [];
    
    if (!name || name.trim().length === 0) {
      errors.push('Name is required');
    } else if (name.length > 50) {
      errors.push('Name is too long');
    } else if (!nameRegex.test(sanitized)) {
      errors.push('Name contains invalid characters');
    } else if (sanitized !== name) {
      errors.push('Name contains potentially unsafe characters');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }, []);

  const validateForm = useCallback((data: Record<string, any>, schema: z.ZodSchema): ValidationResult => {
    // Sanitize all string inputs
    const sanitizedData = Object.keys(data).reduce((acc, key) => {
      const value = data[key];
      acc[key] = typeof value === 'string' ? InputSecurity.sanitizeInput(value) : value;
      return acc;
    }, {} as Record<string, any>);

    const result = schema.safeParse(sanitizedData);
    return {
      isValid: result.success,
      errors: result.success ? [] : result.error.errors.map(e => `${e.path.join('.')}: ${e.message}`)
    };
  }, []);

  const clearCache = useCallback(() => {
    setValidationCache(new Map());
  }, []);

  return {
    validatePassword,
    validateEmail,
    validatePhone,
    validateName,
    validateForm,
    clearCache,
  };
}
