import type { Preview } from "@storybook/react";
import React from 'react';
import { AnalyticsProvider } from '../src/analytics/AnalyticsContext';
import { createNatsAdapter } from '../src/analytics/NatsAdapter';

// Create NATS adapter for demo
const natsAdapter = createNatsAdapter({
  bridgeUrl: 'http://localhost:3001',
  debug: true, // Enable console logging in Storybook
});

console.log('🔧 Storybook Analytics Adapter initialized:', natsAdapter);

const preview: Preview = {
  decorators: [
    (Story) => 
      React.createElement(
        AnalyticsProvider, 
        { adapter: natsAdapter },
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
