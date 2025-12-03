import { AnalyticsAdapter, AnalyticsEvent } from './AnalyticsContext';

/**
 * NATS Analytics Adapter Configuration
 */
export interface NatsAdapterConfig {
  /**
   * URL of the NATS bridge HTTP endpoint
   * @default 'http://localhost:3001'
   */
  bridgeUrl?: string;
  
  /**
   * Enable debug logging
   * @default false
   */
  debug?: boolean;
  
  /**
   * Retry failed events
   * @default true
   */
  retry?: boolean;
  
  /**
   * Maximum retry attempts
   * @default 3
   */
  maxRetries?: number;
}

/**
 * NATS Analytics Adapter
 * 
 * Sends analytics events to NATS via HTTP bridge for real-time streaming.
 * Perfect for demos and development environments.
 * 
 * @example
 * ```typescript
 * import { AnalyticsProvider } from '@your-org/react-analytics-ui';
 * import { createNatsAdapter } from '@your-org/react-analytics-ui/nats';
 * 
 * const natsAdapter = createNatsAdapter({
 *   bridgeUrl: 'http://localhost:3001',
 *   debug: true
 * });
 * 
 * function App() {
 *   return (
 *     <AnalyticsProvider adapter={natsAdapter}>
 *       <YourApp />
 *     </AnalyticsProvider>
 *   );
 * }
 * ```
 */
export class NatsAdapter implements AnalyticsAdapter {
  private config: Required<NatsAdapterConfig>;
  private eventQueue: AnalyticsEvent[] = [];
  private isOnline: boolean = true;

  constructor(config: NatsAdapterConfig = {}) {
    this.config = {
      bridgeUrl: config.bridgeUrl || 'http://localhost:3001',
      debug: config.debug || false,
      retry: config.retry !== false,
      maxRetries: config.maxRetries || 3,
    };

    // Bind methods to preserve 'this' context
    this.track = this.track.bind(this);
    this.checkConnection = this.checkConnection.bind(this);
    this.retryQueue = this.retryQueue.bind(this);

    // Check if bridge is reachable
    this.checkConnection();
  }

  private async checkConnection(): Promise<void> {
    try {
      const response = await fetch(`${this.config.bridgeUrl}/health`, {
        method: 'GET',
      });
      this.isOnline = response.ok;
      
      if (this.config.debug) {
        console.log('🔗 NATS Bridge:', this.isOnline ? 'Connected' : 'Disconnected');
      }
    } catch (err) {
      this.isOnline = false;
      if (this.config.debug) {
        console.warn('⚠️ NATS Bridge not reachable:', err);
      }
    }
  }

  async track(event: AnalyticsEvent): Promise<void> {
    if (this.config.debug) {
      console.log('📊 [NATS] Tracking event:', event);
      console.log('📊 [NATS] Bridge URL:', this.config.bridgeUrl);
    }

    try {
      if (this.config.debug) {
        console.log('📊 [NATS] Sending POST request...');
      }
      
      const response = await fetch(`${this.config.bridgeUrl}/analytics`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(event),
      });

      if (this.config.debug) {
        console.log('📊 [NATS] Response status:', response.status);
      }

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${response.statusText} - ${errorText}`);
      }

      const result = await response.json();
      
      if (this.config.debug) {
        console.log('✅ [NATS] Event published successfully:', result);
      }
    } catch (err) {
      console.error('❌ [NATS] Failed to publish event:', err);
      console.error('❌ [NATS] Error details:', {
        message: err.message,
        name: err.name,
        stack: err.stack
      });
      
      // Queue for retry if enabled
      if (this.config.retry) {
        this.eventQueue.push(event);
        this.retryQueue();
      }
    }
  }

  private async retryQueue(): Promise<void> {
    if (this.eventQueue.length === 0) return;

    // Wait before retrying
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Check connection
    await this.checkConnection();

    if (!this.isOnline) {
      if (this.config.debug) {
        console.log(`⏳ [NATS] Bridge offline, ${this.eventQueue.length} events queued`);
      }
      return;
    }

    // Retry queued events
    const eventsToRetry = [...this.eventQueue];
    this.eventQueue = [];

    for (const event of eventsToRetry) {
      await this.track(event);
    }
  }
}

/**
 * Create a NATS analytics adapter
 * 
 * @param config - NATS adapter configuration
 * @returns Analytics adapter instance
 * 
 * @example
 * ```typescript
 * const adapter = createNatsAdapter({
 *   bridgeUrl: 'http://localhost:3001',
 *   debug: true
 * });
 * ```
 */
export function createNatsAdapter(config?: NatsAdapterConfig): AnalyticsAdapter {
  return new NatsAdapter(config);
}
