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

const preview: Preview = {
  decorators: [
    (Story) => 
      React.createElement(
        AnalyticsProvider, 
        { adapter: compositeAdapter },
        React.createElement(Story)
      ),
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
