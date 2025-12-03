#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Script to generate AI-consumable documentation for the component library
 * This creates a comprehensive manifest that AI agents can use to help developers
 * integrate components correctly.
 */

// Read package.json for metadata
const packageJson = JSON.parse(
  fs.readFileSync(path.join(__dirname, '..', 'package.json'), 'utf8')
);

// Component definitions extracted from source code
const manifest = {
  library: {
    name: packageJson.name,
    version: packageJson.version,
    description: packageJson.description,
    framework: 'React',
    typescript: true,
    repository: packageJson.repository || 'https://github.com/rvu-richard-griffiths/react-analytics-test',
    keywords: packageJson.keywords || [],
  },
  installation: {
    command: `npm install ${packageJson.name}`,
    peerDependencies: packageJson.peerDependencies || {},
  },
  setup: {
    provider: {
      import: `import { AnalyticsProvider } from '${packageJson.name}';`,
      required: true,
      description: 'Wrap your app with AnalyticsProvider to enable analytics tracking',
      usage: `<AnalyticsProvider adapter={analyticsAdapter}>
  <App />
</AnalyticsProvider>`,
      props: {
        adapter: {
          type: 'AnalyticsAdapter',
          required: false,
          description: 'Analytics adapter to integrate with your analytics platform',
        },
        enabled: {
          type: 'boolean',
          required: false,
          default: true,
          description: 'Enable or disable analytics tracking globally',
        },
      },
    },
    adapter: {
      interface: 'AnalyticsAdapter',
      description: 'Implement this interface to integrate with any analytics platform',
      structure: {
        track: '(event: AnalyticsEvent) => void | Promise<void>',
      },
      examples: {
        console: `const consoleAdapter: AnalyticsAdapter = {
  track: (event) => console.log('[Analytics]', event)
};`,
        googleAnalytics: `const gaAdapter: AnalyticsAdapter = {
  track: (event) => {
    gtag('event', event.eventType, {
      component_type: event.componentType,
      component_id: event.componentId,
      ...event.metadata
    });
  }
};`,
        segment: `const segmentAdapter: AnalyticsAdapter = {
  track: (event) => {
    analytics.track(event.eventType, {
      componentType: event.componentType,
      componentId: event.componentId,
      ...event.metadata
    });
  }
};`,
      },
    },
  },
  components: [
    {
      name: 'Button',
      import: `import { Button } from '${packageJson.name}';`,
      description: 'Button component with built-in analytics tracking for click events',
      props: {
        variant: {
          type: "'primary' | 'secondary' | 'danger'",
          default: 'primary',
          description: 'Button variant style',
        },
        size: {
          type: "'small' | 'medium' | 'large'",
          default: 'medium',
          description: 'Button size',
        },
        analyticsId: {
          type: 'string',
          required: false,
          description: 'Optional ID for analytics tracking',
        },
        analyticsMetadata: {
          type: 'Record<string, any>',
          required: false,
          description: 'Additional metadata to include in analytics events',
        },
        disableAnalytics: {
          type: 'boolean',
          default: false,
          description: 'Disable analytics tracking for this component',
        },
        onClick: {
          type: 'React.MouseEventHandler<HTMLButtonElement>',
          required: false,
          description: 'Click event handler',
        },
        disabled: {
          type: 'boolean',
          required: false,
          description: 'Disable the button',
        },
        children: {
          type: 'ReactNode',
          required: true,
          description: 'Button content',
        },
      },
      events: [
        {
          name: 'click',
          description: 'Fired when the button is clicked',
          eventType: 'button_click',
        },
      ],
      examples: [
        {
          title: 'Basic button',
          code: `<Button variant="primary" onClick={handleClick}>
  Submit
</Button>`,
        },
        {
          title: 'Button with analytics',
          code: `<Button 
  variant="primary" 
  analyticsId="submit-form"
  analyticsMetadata={{ formName: 'contact', section: 'footer' }}
  onClick={handleSubmit}
>
  Submit Form
</Button>`,
        },
        {
          title: 'Danger button',
          code: `<Button 
  variant="danger" 
  size="small"
  analyticsId="delete-btn"
  onClick={handleDelete}
>
  Delete
</Button>`,
        },
      ],
    },
    {
      name: 'TextBox',
      import: `import { TextBox } from '${packageJson.name}';`,
      description: 'Text input component with built-in analytics tracking for focus, blur, and change events',
      props: {
        label: {
          type: 'string',
          required: false,
          description: 'Label for the text box',
        },
        error: {
          type: 'string',
          required: false,
          description: 'Error message to display',
        },
        helpText: {
          type: 'string',
          required: false,
          description: 'Help text to display below the input',
        },
        analyticsId: {
          type: 'string',
          required: false,
          description: 'Optional ID for analytics tracking',
        },
        analyticsMetadata: {
          type: 'Record<string, any>',
          required: false,
          description: 'Additional metadata to include in analytics events',
        },
        disableAnalytics: {
          type: 'boolean',
          default: false,
          description: 'Disable analytics tracking for this component',
        },
        trackOnChange: {
          type: 'boolean',
          default: false,
          description: 'Track on change events (can be noisy, disabled by default)',
        },
        value: {
          type: 'string',
          required: false,
          description: 'Input value (for controlled components)',
        },
        onChange: {
          type: 'React.ChangeEventHandler<HTMLInputElement>',
          required: false,
          description: 'Change event handler',
        },
      },
      events: [
        {
          name: 'focus',
          description: 'Fired when the input receives focus',
          eventType: 'textbox_focus',
        },
        {
          name: 'blur',
          description: 'Fired when the input loses focus',
          eventType: 'textbox_blur',
          metadata: 'Includes duration (time focused in milliseconds) and hasValue (boolean)',
        },
        {
          name: 'change',
          description: 'Fired when the input value changes (only if trackOnChange is true)',
          eventType: 'textbox_change',
        },
      ],
      examples: [
        {
          title: 'Basic text input',
          code: `<TextBox
  label="Email"
  placeholder="Enter your email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
/>`,
        },
        {
          title: 'Text input with analytics',
          code: `<TextBox
  label="Email Address"
  placeholder="you@example.com"
  analyticsId="signup-email"
  analyticsMetadata={{ formName: 'signup', step: 1 }}
  value={email}
  onChange={(e) => setEmail(e.target.value)}
/>`,
        },
        {
          title: 'Text input with error',
          code: `<TextBox
  label="Password"
  type="password"
  error={passwordError}
  helpText="Must be at least 8 characters"
  value={password}
  onChange={(e) => setPassword(e.target.value)}
/>`,
        },
      ],
    },
    {
      name: 'DatePicker',
      import: `import { DatePicker } from '${packageJson.name}';`,
      description: 'Date picker component with built-in analytics tracking for date selection and calendar interactions',
      props: {
        value: {
          type: 'Date | null',
          required: false,
          description: 'The selected date value',
        },
        onChange: {
          type: '(date: Date | null) => void',
          required: false,
          description: 'Callback when date changes',
        },
        minDate: {
          type: 'Date',
          required: false,
          description: 'Minimum selectable date',
        },
        maxDate: {
          type: 'Date',
          required: false,
          description: 'Maximum selectable date',
        },
        format: {
          type: "'MM/DD/YYYY' | 'DD/MM/YYYY' | 'YYYY-MM-DD'",
          default: 'MM/DD/YYYY',
          description: 'Date format for display',
        },
        analyticsId: {
          type: 'string',
          required: false,
          description: 'Optional ID for analytics tracking',
        },
        analyticsMetadata: {
          type: 'Record<string, any>',
          required: false,
          description: 'Additional metadata to include in analytics events',
        },
        disableAnalytics: {
          type: 'boolean',
          default: false,
          description: 'Disable analytics tracking for this component',
        },
        disabled: {
          type: 'boolean',
          required: false,
          description: 'Disable the date picker',
        },
      },
      events: [
        {
          name: 'open',
          description: 'Fired when the calendar is opened',
          eventType: 'datepicker_open',
        },
        {
          name: 'close',
          description: 'Fired when the calendar is closed',
          eventType: 'datepicker_close',
          metadata: 'Includes duration (time opened in milliseconds)',
        },
        {
          name: 'select',
          description: 'Fired when a date is selected',
          eventType: 'datepicker_select',
          metadata: 'Includes selectedDate (ISO string)',
        },
      ],
      examples: [
        {
          title: 'Basic date picker',
          code: `<DatePicker
  value={selectedDate}
  onChange={setSelectedDate}
/>`,
        },
        {
          title: 'Date picker with analytics and constraints',
          code: `<DatePicker
  value={bookingDate}
  onChange={setBookingDate}
  minDate={new Date()}
  format="DD/MM/YYYY"
  analyticsId="booking-date"
  analyticsMetadata={{ context: 'booking-form', roomType: 'deluxe' }}
/>`,
        },
        {
          title: 'Date picker with date range',
          code: `<DatePicker
  value={appointmentDate}
  onChange={setAppointmentDate}
  minDate={new Date()}
  maxDate={new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)}
  analyticsId="appointment-date"
/>`,
        },
      ],
    },
    {
      name: 'Popup',
      import: `import { Popup } from '${packageJson.name}';`,
      description: 'Modal/popup component with built-in analytics tracking for open, close, and interaction events',
      props: {
        isOpen: {
          type: 'boolean',
          required: true,
          description: 'Whether the popup is open',
        },
        onClose: {
          type: '() => void',
          required: true,
          description: 'Callback when popup should close',
        },
        title: {
          type: 'string',
          required: false,
          description: 'Popup title',
        },
        children: {
          type: 'ReactNode',
          required: true,
          description: 'Popup content',
        },
        size: {
          type: "'small' | 'medium' | 'large'",
          default: 'medium',
          description: 'Popup size',
        },
        showCloseButton: {
          type: 'boolean',
          default: true,
          description: 'Whether to show close button',
        },
        closeOnOverlayClick: {
          type: 'boolean',
          default: true,
          description: 'Whether to close on overlay click',
        },
        closeOnEscape: {
          type: 'boolean',
          default: true,
          description: 'Whether to close on escape key',
        },
        analyticsId: {
          type: 'string',
          required: false,
          description: 'Optional ID for analytics tracking',
        },
        analyticsMetadata: {
          type: 'Record<string, any>',
          required: false,
          description: 'Additional metadata to include in analytics events',
        },
        disableAnalytics: {
          type: 'boolean',
          default: false,
          description: 'Disable analytics tracking for this component',
        },
      },
      events: [
        {
          name: 'open',
          description: 'Fired when the popup is opened',
          eventType: 'popup_open',
        },
        {
          name: 'close',
          description: 'Fired when the popup is closed',
          eventType: 'popup_close',
          metadata: 'Includes duration (time opened in milliseconds) and closeMethod (button, overlay, escape)',
        },
      ],
      examples: [
        {
          title: 'Basic popup',
          code: `<Popup
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Confirmation"
>
  <p>Are you sure you want to continue?</p>
  <Button onClick={() => setIsOpen(false)}>OK</Button>
</Popup>`,
        },
        {
          title: 'Popup with analytics',
          code: `<Popup
  isOpen={showDeleteConfirm}
  onClose={() => setShowDeleteConfirm(false)}
  title="Delete User"
  size="small"
  analyticsId="delete-user-popup"
  analyticsMetadata={{ userId: user.id, userName: user.name }}
>
  <p>Are you sure you want to delete {user.name}?</p>
  <Button variant="danger" onClick={handleDelete}>Delete</Button>
  <Button variant="secondary" onClick={() => setShowDeleteConfirm(false)}>Cancel</Button>
</Popup>`,
        },
        {
          title: 'Large popup with custom behavior',
          code: `<Popup
  isOpen={showDetails}
  onClose={() => setShowDetails(false)}
  title="User Details"
  size="large"
  closeOnOverlayClick={false}
  closeOnEscape={false}
  analyticsId="user-details-modal"
>
  {/* Complex content */}
</Popup>`,
        },
      ],
    },
  ],
  analytics: {
    eventStructure: {
      eventType: {
        type: 'string',
        description: 'Type of event (e.g., "button_click", "textbox_focus")',
      },
      componentType: {
        type: 'string',
        description: 'Type of component that triggered the event (e.g., "button", "textbox")',
      },
      componentId: {
        type: 'string',
        required: false,
        description: 'Optional ID for the specific component instance (from analyticsId prop)',
      },
      metadata: {
        type: 'Record<string, any>',
        required: false,
        description: 'Additional event metadata including user-provided analyticsMetadata and event-specific data',
      },
      timestamp: {
        type: 'number',
        description: 'Unix timestamp in milliseconds when the event occurred',
      },
    },
    integrationGuide: {
      stepByStep: [
        '1. Install the package: npm install ' + packageJson.name,
        '2. Create an analytics adapter that implements the AnalyticsAdapter interface',
        '3. Wrap your app with AnalyticsProvider and pass your adapter',
        '4. Use components with analyticsId and analyticsMetadata props to track specific interactions',
        '5. Events will automatically be sent to your analytics platform through the adapter',
      ],
      platforms: {
        googleAnalytics: {
          description: 'Integrate with Google Analytics 4',
          adapter: `const gaAdapter: AnalyticsAdapter = {
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
};`,
        },
        segment: {
          description: 'Integrate with Segment',
          adapter: `const segmentAdapter: AnalyticsAdapter = {
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
};`,
        },
        mixpanel: {
          description: 'Integrate with Mixpanel',
          adapter: `const mixpanelAdapter: AnalyticsAdapter = {
  track: (event) => {
    if (window.mixpanel) {
      window.mixpanel.track(event.eventType, {
        component_type: event.componentType,
        component_id: event.componentId,
        timestamp: event.timestamp,
        ...event.metadata
      });
    }
  }
};`,
        },
        custom: {
          description: 'Send events to your own API',
          adapter: `const customAdapter: AnalyticsAdapter = {
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
};`,
        },
      },
    },
    commonPatterns: {
      formTracking: {
        description: 'Track form interactions',
        example: `<AnalyticsProvider adapter={myAdapter}>
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
</AnalyticsProvider>`,
      },
      conditionalTracking: {
        description: 'Disable tracking for specific components',
        example: `<Button
  variant="primary"
  disableAnalytics={isTestEnvironment}
  onClick={handleClick}
>
  Submit
</Button>`,
      },
      contextualMetadata: {
        description: 'Add context-specific metadata to events',
        example: `const metadata = {
  userId: currentUser.id,
  userRole: currentUser.role,
  pageSection: 'checkout',
  cartTotal: cart.total
};

<Button
  analyticsId="checkout-btn"
  analyticsMetadata={metadata}
  onClick={handleCheckout}
>
  Proceed to Checkout
</Button>`,
      },
    },
  },
  bestPractices: [
    {
      title: 'Use meaningful analyticsId values',
      description: 'Choose IDs that clearly describe the component\'s purpose and location',
      example: 'Use "header-login-btn" instead of "btn1"',
    },
    {
      title: 'Include contextual metadata',
      description: 'Add relevant context to analyticsMetadata to make events more meaningful',
      example: 'Include form names, page sections, user segments, etc.',
    },
    {
      title: 'Avoid tracking sensitive data',
      description: 'Never include passwords, credit card numbers, or PII in analytics events',
      example: 'Use disableAnalytics or omit sensitive fields from metadata',
    },
    {
      title: 'Test your analytics integration',
      description: 'Use a console adapter during development to verify events are firing correctly',
      example: 'Create a console adapter to log events before connecting to your analytics platform',
    },
    {
      title: 'Handle analytics failures gracefully',
      description: 'Ensure your adapter catches errors and doesn\'t break the UI',
      example: 'Wrap track calls in try-catch blocks',
    },
    {
      title: 'Disable change tracking by default',
      description: 'For TextBox, only enable trackOnChange when needed to avoid noisy data',
      example: 'Use trackOnChange={true} only for critical inputs',
    },
  ],
  metadata: {
    generatedAt: new Date().toISOString(),
    generatedBy: 'generate-ai-docs.js',
    version: '1.0.0',
    purpose: 'AI-consumable component library documentation',
  },
};

// Create .ai directory if it doesn't exist
const aiDir = path.join(__dirname, '..', '.ai');
if (!fs.existsSync(aiDir)) {
  fs.mkdirSync(aiDir, { recursive: true });
  console.log('✅ Created .ai directory');
}

// Write manifest.json
const manifestPath = path.join(aiDir, 'component-manifest.json');
fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf8');
console.log('✅ Generated component-manifest.json');

// Generate quick-start guide for AI agents
const quickStart = `# AI Agent Quick Start Guide

## Purpose
This component library provides React UI components with built-in analytics tracking capabilities. All components can track user interactions through a unified analytics adapter interface.

## Installation
\`\`\`bash
${manifest.installation.command}
\`\`\`

## Basic Setup

### 1. Create an Analytics Adapter
\`\`\`typescript
import { AnalyticsAdapter, AnalyticsEvent } from '${packageJson.name}';

const myAdapter: AnalyticsAdapter = {
  track: (event: AnalyticsEvent) => {
    // Send event to your analytics platform
    console.log('Analytics event:', event);
  }
};
\`\`\`

### 2. Wrap Your App
\`\`\`tsx
import { AnalyticsProvider } from '${packageJson.name}';

function App() {
  return (
    <AnalyticsProvider adapter={myAdapter}>
      {/* Your app components */}
    </AnalyticsProvider>
  );
}
\`\`\`

### 3. Use Components
\`\`\`tsx
import { Button, TextBox, DatePicker, Popup } from '${packageJson.name}';

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
\`\`\`

## Available Components

${manifest.components.map(c => `### ${c.name}
${c.description}

**Import:** \`${c.import}\`

**Key Props:**
${Object.entries(c.props).slice(0, 5).map(([name, prop]) => `- \`${name}\`: ${prop.type}${prop.default ? ` (default: ${prop.default})` : ''}`).join('\n')}

**Events Tracked:** ${c.events.map(e => e.eventType).join(', ')}

**Example:**
\`\`\`tsx
${c.examples[0].code}
\`\`\``).join('\n\n')}

## Analytics Event Structure

All components emit events with this structure:

\`\`\`typescript
interface AnalyticsEvent {
  eventType: string;           // e.g., "button_click"
  componentType: string;        // e.g., "button"
  componentId?: string;         // from analyticsId prop
  metadata?: Record<string, any>; // combined component-specific and user metadata
  timestamp: number;            // Unix timestamp in milliseconds
}
\`\`\`

## Integration Examples

### Google Analytics 4
\`\`\`typescript
${manifest.analytics.integrationGuide.platforms.googleAnalytics.adapter}
\`\`\`

### Segment
\`\`\`typescript
${manifest.analytics.integrationGuide.platforms.segment.adapter}
\`\`\`

### Custom API
\`\`\`typescript
${manifest.analytics.integrationGuide.platforms.custom.adapter}
\`\`\`

## Common Patterns

### Form Tracking
${manifest.analytics.commonPatterns.formTracking.example}

### Conditional Tracking
${manifest.analytics.commonPatterns.conditionalTracking.example}

## Best Practices

${manifest.bestPractices.map((bp, i) => `${i + 1}. **${bp.title}**: ${bp.description}`).join('\n')}

## Resources

- Full API Documentation: See component-manifest.json
- Storybook (if available): Run \`npm run storybook\`
- Repository: ${manifest.library.repository}

---

*Generated: ${manifest.metadata.generatedAt}*
`;

const quickStartPath = path.join(aiDir, 'quick-start.md');
fs.writeFileSync(quickStartPath, quickStart, 'utf8');
console.log('✅ Generated quick-start.md');

// Generate component reference table
const componentReference = `# Component Reference

| Component | Purpose | Key Analytics Events | Example Usage |
|-----------|---------|---------------------|---------------|
${manifest.components.map(c => `| **${c.name}** | ${c.description.split('\n')[0]} | ${c.events.map(e => e.eventType).join(', ')} | \`analyticsId="${c.name.toLowerCase()}-id"\` |`).join('\n')}

## Quick Integration Checklist

- [ ] Install package: \`${manifest.installation.command}\`
- [ ] Create analytics adapter implementing \`AnalyticsAdapter\` interface
- [ ] Wrap app with \`<AnalyticsProvider adapter={myAdapter}>\`
- [ ] Add \`analyticsId\` prop to components you want to track
- [ ] Add \`analyticsMetadata\` for context-specific information
- [ ] Test events are flowing to your analytics platform

## Analytics Props (Common to All Components)

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| \`analyticsId\` | string | undefined | Unique identifier for this component instance |
| \`analyticsMetadata\` | Record<string, any> | undefined | Additional context data to include in events |
| \`disableAnalytics\` | boolean | false | Disable analytics tracking for this component |

## Event Metadata by Component

${manifest.components.map(c => `### ${c.name}
${c.events.map(e => `- **${e.eventType}**: ${e.description}${e.metadata ? `\n  - Metadata: ${e.metadata}` : ''}`).join('\n')}`).join('\n\n')}

---

For complete API documentation, see \`component-manifest.json\`.
`;

const referencePath = path.join(aiDir, 'component-reference.md');
fs.writeFileSync(referencePath, componentReference, 'utf8');
console.log('✅ Generated component-reference.md');

// Generate integration examples
const integrationExamples = `# Integration Examples

## Complete Example: User Registration Form

\`\`\`tsx
import React, { useState } from 'react';
import { 
  AnalyticsProvider, 
  AnalyticsAdapter,
  Button, 
  TextBox, 
  DatePicker,
  Popup 
} from '${packageJson.name}';

// 1. Create your analytics adapter
const analyticsAdapter: AnalyticsAdapter = {
  track: (event) => {
    // Send to your analytics platform
    console.log('[Analytics]', event);
    
    // Example: Send to Google Analytics
    if (typeof gtag !== 'undefined') {
      gtag('event', event.eventType, {
        component_type: event.componentType,
        component_id: event.componentId,
        ...event.metadata
      });
    }
  }
};

// 2. Registration form component
function RegistrationForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [birthdate, setBirthdate] = useState<Date | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    const newErrors: Record<string, string> = {};
    if (!email) newErrors.email = 'Email is required';
    if (!password) newErrors.password = 'Password is required';
    if (!birthdate) newErrors.birthdate = 'Birthdate is required';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Submit logic here
    setShowSuccess(true);
  };

  // Shared analytics metadata
  const formMetadata = {
    formName: 'user-registration',
    formVersion: '2.0',
    pageSection: 'main'
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Create Your Account</h2>
      
      <TextBox
        label="Email Address"
        type="email"
        placeholder="you@example.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={errors.email}
        analyticsId="registration-email"
        analyticsMetadata={formMetadata}
      />

      <TextBox
        label="Password"
        type="password"
        placeholder="At least 8 characters"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        error={errors.password}
        helpText="Must be at least 8 characters"
        analyticsId="registration-password"
        analyticsMetadata={formMetadata}
        disableAnalytics={true} // Don't track password field
      />

      <DatePicker
        value={birthdate}
        onChange={setBirthdate}
        maxDate={new Date()}
        format="MM/DD/YYYY"
        analyticsId="registration-birthdate"
        analyticsMetadata={formMetadata}
      />

      <Button
        type="submit"
        variant="primary"
        size="large"
        analyticsId="registration-submit"
        analyticsMetadata={{
          ...formMetadata,
          hasEmail: !!email,
          hasPassword: !!password,
          hasBirthdate: !!birthdate
        }}
      >
        Create Account
      </Button>

      <Popup
        isOpen={showSuccess}
        onClose={() => setShowSuccess(false)}
        title="Success!"
        size="small"
        analyticsId="registration-success-popup"
        analyticsMetadata={formMetadata}
      >
        <p>Your account has been created successfully!</p>
        <Button
          variant="primary"
          onClick={() => setShowSuccess(false)}
          analyticsId="success-popup-close"
        >
          Get Started
        </Button>
      </Popup>
    </form>
  );
}

// 3. Wrap with AnalyticsProvider
function App() {
  return (
    <AnalyticsProvider adapter={analyticsAdapter}>
      <RegistrationForm />
    </AnalyticsProvider>
  );
}

export default App;
\`\`\`

## Platform-Specific Adapters

### Google Analytics 4
\`\`\`typescript
${manifest.analytics.integrationGuide.platforms.googleAnalytics.adapter}

// Usage
<AnalyticsProvider adapter={gaAdapter}>
  <App />
</AnalyticsProvider>
\`\`\`

### Segment
\`\`\`typescript
${manifest.analytics.integrationGuide.platforms.segment.adapter}

// Usage
<AnalyticsProvider adapter={segmentAdapter}>
  <App />
</AnalyticsProvider>
\`\`\`

### Mixpanel
\`\`\`typescript
${manifest.analytics.integrationGuide.platforms.mixpanel.adapter}

// Usage
<AnalyticsProvider adapter={mixpanelAdapter}>
  <App />
</AnalyticsProvider>
\`\`\`

### Custom API Backend
\`\`\`typescript
${manifest.analytics.integrationGuide.platforms.custom.adapter}

// Usage
<AnalyticsProvider adapter={customAdapter}>
  <App />
</AnalyticsProvider>
\`\`\`

## Advanced Patterns

### Multi-Platform Adapter
Send events to multiple analytics platforms:

\`\`\`typescript
const multiAdapter: AnalyticsAdapter = {
  track: async (event) => {
    // Send to multiple platforms in parallel
    const promises = [
      // Google Analytics
      new Promise((resolve) => {
        if (typeof gtag !== 'undefined') {
          gtag('event', event.eventType, { ...event.metadata });
        }
        resolve(void 0);
      }),
      
      // Segment
      new Promise((resolve) => {
        if (window.analytics) {
          window.analytics.track(event.eventType, event);
        }
        resolve(void 0);
      }),
      
      // Custom API
      fetch('/api/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(event)
      }).catch(console.error)
    ];

    await Promise.allSettled(promises);
  }
};
\`\`\`

### Conditional Analytics (A/B Testing)
\`\`\`typescript
const conditionalAdapter: AnalyticsAdapter = {
  track: (event) => {
    // Only track for users in the experiment
    if (userInExperiment(currentUser)) {
      analyticsService.track({
        ...event,
        metadata: {
          ...event.metadata,
          experimentGroup: getCurrentExperimentGroup()
        }
      });
    }
  }
};
\`\`\`

### Batched Events
\`\`\`typescript
class BatchedAdapter implements AnalyticsAdapter {
  private queue: AnalyticsEvent[] = [];
  private batchSize = 10;
  private flushInterval = 5000; // 5 seconds

  constructor() {
    setInterval(() => this.flush(), this.flushInterval);
  }

  track(event: AnalyticsEvent) {
    this.queue.push(event);
    if (this.queue.length >= this.batchSize) {
      this.flush();
    }
  }

  private async flush() {
    if (this.queue.length === 0) return;
    
    const events = [...this.queue];
    this.queue = [];

    try {
      await fetch('/api/analytics/batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ events })
      });
    } catch (error) {
      console.error('Failed to send batched events:', error);
      // Re-queue on failure
      this.queue.unshift(...events);
    }
  }
}

const batchedAdapter = new BatchedAdapter();
\`\`\`

### Development vs Production
\`\`\`typescript
const createAdapter = (): AnalyticsAdapter => {
  if (process.env.NODE_ENV === 'development') {
    // Console adapter for development
    return {
      track: (event) => {
        console.log('📊 [Analytics]', event);
      }
    };
  } else {
    // Production adapter
    return {
      track: (event) => {
        // Send to real analytics platform
        gtag('event', event.eventType, event.metadata);
      }
    };
  }
};

<AnalyticsProvider adapter={createAdapter()}>
  <App />
</AnalyticsProvider>
\`\`\`

## Troubleshooting

### Events Not Firing
1. Verify AnalyticsProvider wraps your components
2. Check adapter is passed to AnalyticsProvider
3. Ensure \`disableAnalytics\` is not set to \`true\`
4. Check console for adapter errors

### Too Many Events
1. Disable \`trackOnChange\` on TextBox components
2. Use \`disableAnalytics\` on less critical components
3. Implement event throttling in your adapter

### Missing Metadata
1. Ensure \`analyticsMetadata\` prop is passed
2. Check that metadata object is not empty
3. Verify adapter is forwarding metadata correctly

---

*For more information, see component-manifest.json*
`;

const examplesPath = path.join(aiDir, 'integration-examples.md');
fs.writeFileSync(examplesPath, integrationExamples, 'utf8');
console.log('✅ Generated integration-examples.md');

// Generate README for the .ai directory
const aiReadme = `# AI-Consumable Documentation

This directory contains machine-readable documentation for the ${packageJson.name} component library.

## Purpose

These files are specifically formatted to be easily consumed by AI agents, code assistants, and LLMs to help developers integrate components correctly.

## Files

### component-manifest.json
Complete machine-readable API documentation including:
- Component props with types and descriptions
- Analytics event structures
- Integration examples for popular platforms
- Best practices and common patterns

**Use this for**: Complete API reference, programmatic access to component information

### quick-start.md
Concise guide for getting started quickly with the library.

**Use this for**: Fast onboarding, quick reference for AI agents helping developers

### component-reference.md
Table-based reference for all components with their key features.

**Use this for**: Quick lookup of component capabilities and analytics events

### integration-examples.md
Complete, copy-paste ready code examples for various integration scenarios.

**Use this for**: Real-world implementation patterns, platform-specific adapters

## For AI Agents

When helping developers use this library:

1. **Start with** quick-start.md for overview and basic setup
2. **Reference** component-manifest.json for detailed prop types and options
3. **Use** integration-examples.md for copy-paste ready code
4. **Check** component-reference.md for quick feature lookup

## For Developers

You can read these files directly, but they're optimized for AI consumption. For human-friendly documentation:
- See README.md in the root directory
- Run Storybook: \`npm run storybook\`
- Check CONTRIBUTING.md for development guidelines

## Regenerating

To regenerate these files after component changes:

\`\`\`bash
npm run generate-ai-docs
# or
task generate-ai-docs
\`\`\`

---

*Generated: ${manifest.metadata.generatedAt}*
*Generator: ${manifest.metadata.generatedBy}*
`;

const aiReadmePath = path.join(aiDir, 'README.md');
fs.writeFileSync(aiReadmePath, aiReadme, 'utf8');
console.log('✅ Generated .ai/README.md');

console.log('\n🎉 All AI documentation generated successfully!');
console.log('\nGenerated files:');
console.log('  - .ai/component-manifest.json (Complete API reference)');
console.log('  - .ai/quick-start.md (Quick start guide)');
console.log('  - .ai/component-reference.md (Component reference table)');
console.log('  - .ai/integration-examples.md (Code examples)');
console.log('  - .ai/README.md (Documentation overview)');
console.log('\nAI agents can now use these files to help developers integrate your components! 🤖');
