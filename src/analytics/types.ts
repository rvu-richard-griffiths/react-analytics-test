/**
 * Common analytics props shared by all components
 */
export interface AnalyticsProps {
  /**
   * Optional ID for analytics tracking
   */
  analyticsId?: string;
  /**
   * Additional metadata to include in analytics events
   */
  analyticsMetadata?: Record<string, any>;
  /**
   * Disable analytics tracking for this component
   */
  disableAnalytics?: boolean;
}
