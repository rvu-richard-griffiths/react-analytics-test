# React Analytics UI Component Library

A modern React UI component library with built-in context-aware analytics tracking. Each component provides seamless integration with any analytics platform through a simple adapter pattern.

## Features

- 🎯 **Context-Aware Analytics** - Track user interactions automatically with customizable metadata
- 🔌 **Platform Agnostic** - Works with any analytics platform (Google Analytics, Segment, Mixpanel, etc.)
- 📦 **Complete Component Set** - Button, DatePicker, TextBox, and Popup components
- 🎨 **Storybook Integration** - Test components in isolation during development
- 🔒 **Type-Safe** - Full TypeScript support
- ♿ **Accessible** - Built with accessibility best practices
- 🎭 **Customizable** - Styled with CSS modules, easy to override

## Quick Start

### Installation

```bash
npm install @your-org/react-analytics-ui
```

### Basic Usage

```tsx
import { AnalyticsProvider, Button, TextBox, DatePicker, Popup } from '@your-org/react-analytics-ui';

// Create an analytics adapter for your platform
const analyticsAdapter = {
  track: (event) => {
    // Send to your analytics platform
    analytics.track(event.eventType, event);
  }
};

function App() {
  return (
    <AnalyticsProvider adapter={analyticsAdapter}>
      <Button 
        analyticsId="submit-button"
        onClick={handleSubmit}
      >
        Submit
      </Button>
    </AnalyticsProvider>
  );
}
```

## 🎭 Live Demo with Real-Time Analytics

Experience the analytics system in action with our NATS-powered demo!

### Quick Start Demo

```bash
# Start NATS + Storybook in one command
task demo-dev

# Or start components separately:
task demo-up        # Start NATS containers
npm run storybook   # Start Storybook
task demo-logs      # Watch events in real-time
```

When you interact with components in Storybook (clicking buttons, typing, etc.), you'll see events streaming in real-time to the terminal!

**Example output:**
```
📊 Event #1 received
🎯 Event Type: button_click
🧩 Component: button
🏷️  Component ID: submit-button
📋 Metadata: { "variant": "primary" }
```

See [demo/README.md](./demo/README.md) for complete documentation.

### Demo Features

- ✅ **Real-time event streaming** via NATS message broker
- ✅ **Visual feedback** in terminal as you interact
- ✅ **HTTP bridge** for browser→NATS communication
- ✅ **Docker-based** - runs in containers
- ✅ **Query events** via REST API

## Components

### Button

```tsx
import { Button } from '@your-org/react-analytics-ui';

<Button
  variant="primary"
  size="medium"
  analyticsId="signup-btn"
  analyticsMetadata={{ page: 'landing' }}
  onClick={handleClick}
>
  Sign Up
</Button>
```

**Props:**
- `variant`: 'primary' | 'secondary' | 'danger'
- `size`: 'small' | 'medium' | 'large'
- `analyticsId`: Optional ID for tracking
- `analyticsMetadata`: Additional metadata for analytics
- `disableAnalytics`: Disable tracking for this component

### TextBox

```tsx
import { TextBox } from '@your-org/react-analytics-ui';

<TextBox
  label="Email"
  placeholder="you@example.com"
  analyticsId="email-input"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
/>
```

**Props:**
- `label`: Input label
- `error`: Error message to display
- `helpText`: Help text below input
- `analyticsId`: Optional ID for tracking
- `trackOnChange`: Track change events (default: false)

### DatePicker

```tsx
import { DatePicker } from '@your-org/react-analytics-ui';

<DatePicker
  value={date}
  onChange={setDate}
  format="MM/DD/YYYY"
  analyticsId="booking-date"
/>
```

**Props:**
- `value`: Selected date
- `onChange`: Date change handler
- `format`: 'MM/DD/YYYY' | 'DD/MM/YYYY' | 'YYYY-MM-DD'
- `minDate`: Minimum selectable date
- `maxDate`: Maximum selectable date
- `analyticsId`: Optional ID for tracking

### Popup

```tsx
import { Popup } from '@your-org/react-analytics-ui';

<Popup
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Confirmation"
  size="medium"
  analyticsId="delete-popup"
>
  <p>Are you sure?</p>
</Popup>
```

**Props:**
- `isOpen`: Whether popup is visible
- `onClose`: Close handler
- `title`: Popup title
- `size`: 'small' | 'medium' | 'large'
- `showCloseButton`: Show close button (default: true)
- `closeOnOverlayClick`: Close on backdrop click (default: true)
- `closeOnEscape`: Close on Escape key (default: true)

## Analytics Integration

### Creating an Adapter

The library works with any analytics platform through a simple adapter interface:

```tsx
import { AnalyticsAdapter } from '@your-org/react-analytics-ui';

const myAdapter: AnalyticsAdapter = {
  track: (event) => {
    // event structure:
    // {
    //   eventType: 'click' | 'focus' | 'blur' | 'open' | 'close' | 'select',
    //   componentType: 'button' | 'textbox' | 'datepicker' | 'popup',
    //   componentId: 'unique-id',
    //   metadata: { custom: 'data' },
    //   timestamp: 1234567890
    // }
    
    // Example: Google Analytics
    gtag('event', event.eventType, {
      component_type: event.componentType,
      component_id: event.componentId,
      ...event.metadata
    });
  }
};
```

### Example Adapters

#### Google Analytics

```tsx
const googleAnalyticsAdapter = {
  track: (event) => {
    gtag('event', event.eventType, {
      event_category: event.componentType,
      event_label: event.componentId,
      ...event.metadata
    });
  }
};
```

#### Segment

```tsx
const segmentAdapter = {
  track: (event) => {
    analytics.track(event.eventType, {
      componentType: event.componentType,
      componentId: event.componentId,
      ...event.metadata
    });
  }
};
```

#### Console (Development)

```tsx
const consoleAdapter = {
  track: (event) => {
    console.log('[Analytics]', event);
  }
};
```

### Disabling Analytics

Analytics can be disabled at the provider or component level:

```tsx
// Disable for entire app
<AnalyticsProvider enabled={false}>
  <App />
</AnalyticsProvider>

// Disable for specific component
<Button disableAnalytics>
  No Tracking
</Button>
```

## AI-Consumable Documentation

This library includes machine-readable documentation designed for AI agents and code assistants to help developers integrate components more easily.

### Generate Documentation

```bash
npm run generate-ai-docs
# or
task generate-ai-docs
```

This creates a `.ai/` directory with:
- **component-manifest.json** - Complete API reference
- **quick-start.md** - Quick start guide for AI agents
- **component-reference.md** - Component reference table
- **integration-examples.md** - Real-world code examples

AI assistants (GitHub Copilot, Cursor, Claude, etc.) can use these files to provide better suggestions and help with integration.

## Development

See [CONTRIBUTING.md](./CONTRIBUTING.md) for development guidelines.

### Running Storybook

```bash
npm run storybook
```

### Building

```bash
npm run build
```

## Using with Task

This project uses [Task](https://taskfile.dev) for consistent operations:

```bash
task install      # Install dependencies
task dev          # Start Storybook
task build        # Build library
task lint         # Run linter
task type-check   # TypeScript checking
task validate     # Run all checks
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT

## Support

For issues and questions, please [open an issue](https://github.com/your-org/react-analytics-ui/issues) on GitHub.
