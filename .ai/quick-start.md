# AI Agent Quick Start Guide

## Purpose
This component library provides React UI components with built-in analytics tracking capabilities. All components can track user interactions through a unified analytics adapter interface.

## Installation
```bash
npm install @your-org/react-analytics-ui
```

## Basic Setup

### 1. Create an Analytics Adapter
```typescript
import { AnalyticsAdapter, AnalyticsEvent } from '@your-org/react-analytics-ui';

const myAdapter: AnalyticsAdapter = {
  track: (event: AnalyticsEvent) => {
    // Send event to your analytics platform
    console.log('Analytics event:', event);
  }
};
```

### 2. Wrap Your App
```tsx
import { AnalyticsProvider } from '@your-org/react-analytics-ui';

function App() {
  return (
    <AnalyticsProvider adapter={myAdapter}>
      {/* Your app components */}
    </AnalyticsProvider>
  );
}
```

### 3. Use Components
```tsx
import { Button, TextBox, DatePicker, Popup } from '@your-org/react-analytics-ui';

function MyForm() {
  return (
    <div>
      <TextBox
        label="Email"
        analyticsId="signup-email"
        analyticsMetadata={{ formName: 'signup' }}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <Button
        variant="primary"
        analyticsId="signup-submit"
        analyticsMetadata={{ formName: 'signup' }}
        onClick={handleSubmit}
      >
        Sign Up
      </Button>
    </div>
  );
}
```

## Available Components

### Button
Button component with built-in analytics tracking for click events

**Import:** `import { Button } from '@your-org/react-analytics-ui';`

**Key Props:**
- `variant`: 'primary' | 'secondary' | 'danger' (default: primary)
- `size`: 'small' | 'medium' | 'large' (default: medium)
- `analyticsId`: string
- `analyticsMetadata`: Record<string, any>
- `disableAnalytics`: boolean

**Events Tracked:** button_click

**Example:**
```tsx
<Button variant="primary" onClick={handleClick}>
  Submit
</Button>
```

### TextBox
Text input component with built-in analytics tracking for focus, blur, and change events

**Import:** `import { TextBox } from '@your-org/react-analytics-ui';`

**Key Props:**
- `label`: string
- `error`: string
- `helpText`: string
- `analyticsId`: string
- `analyticsMetadata`: Record<string, any>

**Events Tracked:** textbox_focus, textbox_blur, textbox_change

**Example:**
```tsx
<TextBox
  label="Email"
  placeholder="Enter your email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
/>
```

### DatePicker
Date picker component with built-in analytics tracking for date selection and calendar interactions

**Import:** `import { DatePicker } from '@your-org/react-analytics-ui';`

**Key Props:**
- `value`: Date | null
- `onChange`: (date: Date | null) => void
- `minDate`: Date
- `maxDate`: Date
- `format`: 'MM/DD/YYYY' | 'DD/MM/YYYY' | 'YYYY-MM-DD' (default: MM/DD/YYYY)

**Events Tracked:** datepicker_open, datepicker_close, datepicker_select

**Example:**
```tsx
<DatePicker
  value={selectedDate}
  onChange={setSelectedDate}
/>
```

### Popup
Modal/popup component with built-in analytics tracking for open, close, and interaction events

**Import:** `import { Popup } from '@your-org/react-analytics-ui';`

**Key Props:**
- `isOpen`: boolean
- `onClose`: () => void
- `title`: string
- `children`: ReactNode
- `size`: 'small' | 'medium' | 'large' (default: medium)

**Events Tracked:** popup_open, popup_close

**Example:**
```tsx
<Popup
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Confirmation"
>
  <p>Are you sure you want to continue?</p>
  <Button onClick={() => setIsOpen(false)}>OK</Button>
</Popup>
```

## Analytics Event Structure

All components emit events with this structure:

```typescript
interface AnalyticsEvent {
  eventType: string;           // e.g., "button_click"
  componentType: string;        // e.g., "button"
  componentId?: string;         // from analyticsId prop
  metadata?: Record<string, any>; // combined component-specific and user metadata
  timestamp: number;            // Unix timestamp in milliseconds
}
```

## Integration Examples

### Google Analytics 4
```typescript
const gaAdapter: AnalyticsAdapter = {
  track: (event) => {
    if (typeof gtag !== 'undefined') {
      gtag('event', event.eventType, {
        component_type: event.componentType,
        component_id: event.componentId,
        timestamp: event.timestamp,
        ...event.metadata
      });
    }
  }
};
```

### Segment
```typescript
const segmentAdapter: AnalyticsAdapter = {
  track: (event) => {
    if (window.analytics) {
      window.analytics.track(event.eventType, {
        componentType: event.componentType,
        componentId: event.componentId,
        timestamp: event.timestamp,
        ...event.metadata
      });
    }
  }
};
```

### Custom API
```typescript
const customAdapter: AnalyticsAdapter = {
  track: async (event) => {
    try {
      await fetch('/api/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(event)
      });
    } catch (error) {
      console.error('Analytics error:', error);
    }
  }
};
```

## Common Patterns

### Form Tracking
<AnalyticsProvider adapter={myAdapter}>
  <form onSubmit={handleSubmit}>
    <TextBox
      label="Name"
      analyticsId="signup-name"
      analyticsMetadata={{ formName: 'signup', step: 1 }}
      value={name}
      onChange={(e) => setName(e.target.value)}
    />
    <TextBox
      label="Email"
      type="email"
      analyticsId="signup-email"
      analyticsMetadata={{ formName: 'signup', step: 1 }}
      value={email}
      onChange={(e) => setEmail(e.target.value)}
    />
    <Button
      variant="primary"
      analyticsId="signup-submit"
      analyticsMetadata={{ formName: 'signup', step: 1 }}
      type="submit"
    >
      Sign Up
    </Button>
  </form>
</AnalyticsProvider>

### Conditional Tracking
<Button
  variant="primary"
  disableAnalytics={isTestEnvironment}
  onClick={handleClick}
>
  Submit
</Button>

## Best Practices

1. **Use meaningful analyticsId values**: Choose IDs that clearly describe the component's purpose and location
2. **Include contextual metadata**: Add relevant context to analyticsMetadata to make events more meaningful
3. **Avoid tracking sensitive data**: Never include passwords, credit card numbers, or PII in analytics events
4. **Test your analytics integration**: Use a console adapter during development to verify events are firing correctly
5. **Handle analytics failures gracefully**: Ensure your adapter catches errors and doesn't break the UI
6. **Disable change tracking by default**: For TextBox, only enable trackOnChange when needed to avoid noisy data

## Resources

- Full API Documentation: See component-manifest.json
- Storybook (if available): Run `npm run storybook`
- Repository: https://github.com/rvu-richard-griffiths/react-analytics-test

---

*Generated: 2025-12-03T07:24:08.639Z*
