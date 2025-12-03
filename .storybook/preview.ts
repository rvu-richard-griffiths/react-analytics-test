import type { Preview } from "@storybook/react";
import React from 'react';
import { action } from '@storybook/addon-actions';
import { AnalyticsProvider, AnalyticsAdapter, AnalyticsEvent } from '../src/analytics/AnalyticsContext';
import { createNatsAdapter } from '../src/analytics/NatsAdapter';

// Create NATS adapter for demo
const natsAdapter = createNatsAdapter({
  bridgeUrl: 'http://localhost:3001',
  debug: true, // Enable console logging in Storybook
});

// Create composite adapter that sends to both NATS and Storybook Actions
const compositeAdapter: AnalyticsAdapter = {
  track: (event: AnalyticsEvent) => {
    // Send to Storybook Actions tab
    action('analytics-event')(event);
    
    // Send to NATS
    natsAdapter.track(event);
  },
};

console.log('🔧 Storybook Analytics Adapter initialized (NATS + Actions)');

// Generate a simulated session ID for the Storybook session
const sessionId = `storybook-session-${Date.now()}`;
// Simulate a demo user
const demoUserId = 'demo-user-123';

const preview: Preview = {
  decorators: [
    (Story, context) => {
      // Extract story context for analytics
      const storyContext = {
        view: `/${context.title}/${context.name}`,
        section: context.title,
        channel: 'storybook',
        appVersion: '1.0.0',
        sessionId: sessionId,
        userId: demoUserId,
        custom: {
          storyId: context.id,
          storyKind: context.kind,
        },
      };
      
      return React.createElement(
        AnalyticsProvider, 
        { 
          adapter: compositeAdapter,
          context: storyContext,
          children: React.createElement(Story),
        }
      );
    },
  ],
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
