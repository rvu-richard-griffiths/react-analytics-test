import React, { createContext, useContext, useCallback, ReactNode } from 'react';

/**
 * Context information about where the event occurred
 * This is channel-agnostic and works for web, mobile, desktop, etc.
 */
export interface AnalyticsContext {
  /**
   * The current view identifier (e.g., page path, screen name, route)
   * Examples: '/dashboard', 'HomeScreen', 'settings-page'
   */
  view?: string;
  
  /**
   * The section or module within the view
   * Examples: 'header', 'sidebar', 'product-list', 'checkout-form'
   */
  section?: string;
  
  /**
   * User session identifier
   */
  sessionId?: string;
  
  /**
   * User identifier (if available)
   */
  userId?: string;
  
  /**
   * Application or channel identifier
   * Examples: 'web', 'ios', 'android', 'desktop'
   */
  channel?: string;
  
  /**
   * Application version
   */
  appVersion?: string;
  
  /**
   * Any additional custom context
   */
  custom?: Record<string, any>;
}

/**
 * Analytics event data structure
 */
export interface AnalyticsEvent {
  eventType: string;
  componentType: string;
  componentId?: string;
  metadata?: Record<string, any>;
  timestamp: number;
  context?: AnalyticsContext;
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
  context?: AnalyticsContext;
}

/**
 * Analytics Context
 */
const AnalyticsReactContext = createContext<AnalyticsContextValue | undefined>(undefined);

/**
 * Provider props
 */
export interface AnalyticsProviderProps {
  children: ReactNode;
  adapter?: AnalyticsAdapter;
  enabled?: boolean;
  /**
   * Contextual information to be included with all events
   * Can be static or dynamically updated
   */
  context?: AnalyticsContext;
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
 * <AnalyticsProvider 
 *   adapter={myAdapter}
 *   context={{ view: '/home', channel: 'web', sessionId: '123' }}
 * >
 *   <App />
 * </AnalyticsProvider>
 * ```
 */
export const AnalyticsProvider: React.FC<AnalyticsProviderProps> = ({
  children,
  adapter,
  enabled = true,
  context: providerContext,
}) => {
  console.log('🔧 AnalyticsProvider mounted:', { hasAdapter: !!adapter, enabled, context: providerContext });
  
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
        // Merge provider context with event context (event context takes precedence)
        context: {
          ...providerContext,
          ...event.context,
        },
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
    [adapter, enabled, providerContext]
  );

  return (
    <AnalyticsReactContext.Provider value={{ track, adapter, context: providerContext }}>
      {children}
    </AnalyticsReactContext.Provider>
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
 *     metadata: { label: 'Submit' },
 *     context: { section: 'checkout-form' }
 *   });
 * };
 * ```
 */
export const useAnalytics = (): AnalyticsContextValue => {
  const context = useContext(AnalyticsReactContext);
  
  if (context === undefined) {
    throw new Error('useAnalytics must be used within an AnalyticsProvider');
  }
  
  return context;
};

/**
 * Optional hook for components that might not be wrapped in a provider
 */
export const useOptionalAnalytics = (): AnalyticsContextValue | undefined => {
  return useContext(AnalyticsReactContext);
};

/**
 * Nested Context Provider - Use this to add or override context at any level
 * 
 * This is useful for:
 * - Adding page/route context when navigation changes
 * - Adding section context for specific UI areas
 * - Overriding context for specific features or modules
 * 
 * @example
 * ```tsx
 * // In your router or page component
 * <AnalyticsContextProvider context={{ view: '/dashboard', section: 'analytics' }}>
 *   <DashboardPage />
 * </AnalyticsContextProvider>
 * 
 * // Or nest multiple levels
 * <App>
 *   <AnalyticsProvider adapter={adapter} context={{ channel: 'web', userId: '123' }}>
 *     <Router>
 *       <Route path="/dashboard">
 *         <AnalyticsContextProvider context={{ view: '/dashboard' }}>
 *           <DashboardPage />
 *         </AnalyticsContextProvider>
 *       </Route>
 *     </Router>
 *   </AnalyticsProvider>
 * </App>
 * ```
 */
export const AnalyticsContextProvider: React.FC<{
  children: ReactNode;
  context: Partial<AnalyticsContext>;
}> = ({ children, context: additionalContext }) => {
  const parentAnalytics = useOptionalAnalytics();
  
  const track = useCallback(
    (event: Omit<AnalyticsEvent, 'timestamp'>) => {
      if (!parentAnalytics) {
        console.warn('AnalyticsContextProvider used without parent AnalyticsProvider');
        return;
      }
      
      // Merge parent context with this level's context and event context
      parentAnalytics.track({
        ...event,
        context: {
          ...parentAnalytics.context,
          ...additionalContext,
          ...event.context,
        },
      });
    },
    [parentAnalytics, additionalContext]
  );
  
  const mergedContext = {
    ...parentAnalytics?.context,
    ...additionalContext,
  };
  
  return (
    <AnalyticsReactContext.Provider 
      value={{ 
        track, 
        adapter: parentAnalytics?.adapter,
        context: mergedContext,
      }}
    >
      {children}
    </AnalyticsReactContext.Provider>
  );
};
