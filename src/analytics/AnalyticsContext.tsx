import React, { createContext, useContext, useCallback, ReactNode } from 'react';

/**
 * Analytics event data structure
 */
export interface AnalyticsEvent {
  eventType: string;
  componentType: string;
  componentId?: string;
  metadata?: Record<string, any>;
  timestamp: number;
}

/**
 * Analytics adapter interface - implement this to integrate with any analytics platform
 */
export interface AnalyticsAdapter {
  track: (event: AnalyticsEvent) => void | Promise<void>;
}

/**
 * Context value type
 */
interface AnalyticsContextValue {
  track: (event: Omit<AnalyticsEvent, 'timestamp'>) => void;
  adapter?: AnalyticsAdapter;
}

/**
 * Analytics Context
 */
const AnalyticsContext = createContext<AnalyticsContextValue | undefined>(undefined);

/**
 * Provider props
 */
export interface AnalyticsProviderProps {
  children: ReactNode;
  adapter?: AnalyticsAdapter;
  enabled?: boolean;
}

/**
 * Analytics Provider - Wrap your app with this to enable analytics tracking
 * 
 * @example
 * ```tsx
 * const myAdapter: AnalyticsAdapter = {
 *   track: (event) => {
 *     console.log('Analytics event:', event);
 *     // Send to your analytics platform
 *   }
 * };
 * 
 * <AnalyticsProvider adapter={myAdapter}>
 *   <App />
 * </AnalyticsProvider>
 * ```
 */
export const AnalyticsProvider: React.FC<AnalyticsProviderProps> = ({
  children,
  adapter,
  enabled = true,
}) => {
  console.log('🔧 AnalyticsProvider mounted:', { hasAdapter: !!adapter, enabled });
  
  const track = useCallback(
    (event: Omit<AnalyticsEvent, 'timestamp'>) => {
      console.log('📤 track() called:', event);
      
      if (!enabled) {
        console.log('⏸️ Analytics disabled');
        return;
      }

      const fullEvent: AnalyticsEvent = {
        ...event,
        timestamp: Date.now(),
      };

      if (adapter) {
        console.log('📨 Calling adapter.track() with:', fullEvent);
        console.log('📨 Adapter type:', typeof adapter);
        console.log('📨 Adapter.track type:', typeof adapter.track);
        console.log('📨 Adapter keys:', Object.keys(adapter));
        
        if (typeof adapter.track === 'function') {
          const result = adapter.track(fullEvent);
          console.log('📨 adapter.track() returned:', result);
          if (result instanceof Promise) {
            console.log('📨 Result is a Promise');
          }
        } else {
          console.error('❌ adapter.track is not a function!');
        }
      } else {
        // Default behavior: log to console in development
        console.log('[Analytics] No adapter, logging:', fullEvent);
      }
    },
    [adapter, enabled]
  );

  return (
    <AnalyticsContext.Provider value={{ track, adapter }}>
      {children}
    </AnalyticsContext.Provider>
  );
};

/**
 * Hook to access analytics tracking
 * 
 * @example
 * ```tsx
 * const { track } = useAnalytics();
 * 
 * const handleClick = () => {
 *   track({
 *     eventType: 'click',
 *     componentType: 'custom-button',
 *     metadata: { label: 'Submit' }
 *   });
 * };
 * ```
 */
export const useAnalytics = (): AnalyticsContextValue => {
  const context = useContext(AnalyticsContext);
  
  if (context === undefined) {
    throw new Error('useAnalytics must be used within an AnalyticsProvider');
  }
  
  return context;
};

/**
 * Optional hook for components that might not be wrapped in a provider
 */
export const useOptionalAnalytics = (): AnalyticsContextValue | undefined => {
  return useContext(AnalyticsContext);
};
