import { supabase, isSupabaseConfigured } from './supabase';

export interface AnalyticsEvent {
  event: string;
  userId?: string | undefined;
  properties: Record<string, any>;
  timestamp: Date;
  sessionId: string;
  userAgent: string;
  page: string;
}

export interface PerformanceMetrics {
  loadTime: number;
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  cumulativeLayoutShift: number;
  firstInputDelay: number;
  timeToInteractive: number;
}

class Analytics {
  private sessionId: string;
  private userId?: string;
  private performanceObserver?: PerformanceObserver;

  constructor() {
    this.sessionId = this.generateSessionId();
    this.initializePerformanceObserver();
  }

  private generateSessionId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private initializePerformanceObserver(): void {
    if (typeof window === 'undefined') return;

    try {
      this.performanceObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          if (entry.entryType === 'navigation') {
            this.trackPerformance(entry as PerformanceNavigationTiming);
          } else if (entry.entryType === 'largest-contentful-paint') {
            this.trackLCP(entry.startTime);
          } else if (entry.entryType === 'first-input') {
            this.trackFID(entry as PerformanceEventTiming);
          }
        });
      });

      this.performanceObserver.observe({ 
        entryTypes: ['navigation', 'largest-contentful-paint', 'first-input', 'layout-shift'] 
      });
    } catch (error) {
      console.warn('Performance Observer not supported:', error);
    }
  }

  public setUserId(userId: string): void {
    this.userId = userId;
  }

  public async track(event: string, properties: Record<string, any> = {}): Promise<void> {
    if (!isSupabaseConfigured()) return;

    const analyticsEvent: AnalyticsEvent = {
      event,
      userId: this.userId,
      properties,
      timestamp: new Date(),
      sessionId: this.sessionId,
      userAgent: navigator.userAgent,
      page: window.location.pathname
    };

    try {
      await supabase.from('analytics_events').insert(analyticsEvent);
    } catch (error) {
      console.error('Analytics tracking failed:', error);
    }
  }

  public async trackAuth(action: 'login' | 'signup' | 'logout' | '2fa_enable' | '2fa_disable', success: boolean): Promise<void> {
    await this.track('auth_action', {
      action,
      success,
      timestamp: Date.now(),
      userAgent: navigator.userAgent
    });
  }

  public async trackError(error: Error, context?: Record<string, any>): Promise<void> {
    await this.track('error', {
      message: error.message,
      stack: error.stack,
      context,
      timestamp: Date.now()
    });
  }

  private async trackPerformance(entry: PerformanceNavigationTiming): Promise<void> {
    const metrics: PerformanceMetrics = {
      loadTime: entry.loadEventEnd - entry.loadEventStart,
      firstContentfulPaint: this.getMetric('first-contentful-paint'),
      largestContentfulPaint: this.getMetric('largest-contentful-paint'),
      cumulativeLayoutShift: this.getCLS(),
      firstInputDelay: this.getMetric('first-input-delay'),
      timeToInteractive: entry.domContentLoadedEventEnd - entry.fetchStart
    };

    await this.track('performance', metrics);
  }

  private async trackLCP(value: number): Promise<void> {
    await this.track('lcp', { value });
  }

  private async trackFID(entry: PerformanceEventTiming): Promise<void> {
    await this.track('fid', { value: entry.processingStart - entry.startTime });
  }

  private getMetric(name: string): number {
    const entries = performance.getEntriesByName(name);
    return entries.length > 0 ? entries[0]?.startTime ?? 0 : 0;
  }

  private getCLS(): number {
    let clsValue = 0;
    try {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!(entry as any).hadRecentInput) {
            clsValue += (entry as any).value;
          }
        }
      });
      observer.observe({ type: 'layout-shift', buffered: true });
    } catch {
      // PerformanceObserver not supported
    }
    return clsValue;
  }

  public async trackPageView(page: string): Promise<void> {
    await this.track('page_view', {
      page,
      referrer: document.referrer,
      timestamp: Date.now()
    });
  }

  public async trackFeatureUsage(feature: string, action: string): Promise<void> {
    await this.track('feature_usage', {
      feature,
      action,
      timestamp: Date.now()
    });
  }

  public disconnect(): void {
    this.performanceObserver?.disconnect();
  }
}

export const analytics = new Analytics();

// Web Vitals tracking function (optional dependency)
export async function trackWebVitals(): Promise<void> {
  if (typeof window === 'undefined') return;

  try {
    // Dynamic import with proper typing
    const { getCLS, getFID, getFCP, getLCP, getTTFB } = await import('web-vitals');
    
    getCLS((metric) => analytics.track('cls', metric));
    getFID((metric) => analytics.track('fid', metric));
    getFCP((metric) => analytics.track('fcp', metric));
    getLCP((metric) => analytics.track('lcp', metric));
    getTTFB((metric) => analytics.track('ttfb', metric));
  } catch {
    // web-vitals package not available - this is optional
    console.warn('web-vitals package not available. Install with: npm install web-vitals');
  }
} 