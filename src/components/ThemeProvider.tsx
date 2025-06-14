
'use client'

import React, { createContext, useContext, useEffect, useState } from 'react';
import { authConfig } from '@/config/auth';

type Theme = 'dark' | 'light' | 'system';

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
  enableToggle?: boolean;
};

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  enableToggle: boolean;
};

const initialState: ThemeProviderState = {
  theme: 'system',
  setTheme: () => null,
  enableToggle: true,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  defaultTheme,
  storageKey,
  enableToggle,
  ...props
}: ThemeProviderProps) {
  // Use config values as defaults
  const resolvedDefaultTheme = defaultTheme || authConfig.ui.theme.default;
  const resolvedStorageKey = storageKey || authConfig.ui.theme.storageKey;
  const resolvedEnableToggle = enableToggle ?? authConfig.ui.theme.enableToggle;

  const [theme, setTheme] = useState<Theme>(resolvedDefaultTheme);
  const [mounted, setMounted] = useState(false);

  // Initialize theme from localStorage after component mounts
  useEffect(() => {
    setMounted(true);
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem(resolvedStorageKey) as Theme;
      if (savedTheme) {
        setTheme(savedTheme);
      }
    }
  }, [resolvedStorageKey]);

  useEffect(() => {
    if (typeof window === 'undefined' || !mounted) return;
    
    const root = window.document.documentElement;

    root.classList.remove('light', 'dark');

    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)')
        .matches
        ? 'dark'
        : 'light';

      root.classList.add(systemTheme);
      return;
    }

    root.classList.add(theme);
  }, [theme, mounted]);

  const value = {
    theme,
    enableToggle: resolvedEnableToggle,
    setTheme: (newTheme: Theme) => {
      if (!resolvedEnableToggle) return; // Prevent theme changes if disabled
      if (typeof window !== 'undefined') {
        localStorage.setItem(resolvedStorageKey, newTheme);
      }
      setTheme(newTheme);
    },
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined)
    throw new Error('useTheme must be used within a ThemeProvider');

  return context;
};
