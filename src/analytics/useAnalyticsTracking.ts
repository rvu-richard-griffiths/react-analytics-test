import { useCallback } from 'react';
import { useOptionalAnalytics } from './AnalyticsContext';

interface UseAnalyticsTrackingOptions {
  componentType: string;
  componentId?: string;
  metadata?: Record<string, any>;
  disableAnalytics?: boolean;
  disabled?: boolean;
}

/**
 * Custom hook to simplify analytics tracking in components
 * Encapsulates common analytics tracking logic to reduce code duplication
 * 
 * @example
 * ```tsx
 * const trackEvent = useAnalyticsTracking({
 *   componentType: 'button',
 *   componentId: analyticsId,
 *   metadata: { variant, size, ...analyticsMetadata },
 *   disableAnalytics,
 *   disabled
 * });
 * 
 * trackEvent('click', { additionalData: 'value' });
 * ```
 */
export const useAnalyticsTracking = (options: UseAnalyticsTrackingOptions) => {
  const {
    componentType,
    componentId,
    metadata: baseMetadata,
    disableAnalytics = false,
    disabled = false,
  } = options;

  const analytics = useOptionalAnalytics();

  const trackEvent = useCallback(
    (eventType: string, additionalMetadata?: Record<string, any>) => {
      if (!disableAnalytics && analytics && !disabled) {
        analytics.track({
          eventType,
          componentType,
          componentId,
          metadata: {
            ...baseMetadata,
            ...additionalMetadata,
          },
        });
      }
    },
    [analytics, componentType, componentId, baseMetadata, disableAnalytics, disabled]
  );

  return trackEvent;
};
