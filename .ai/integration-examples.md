# Integration Examples

## Complete Example: User Registration Form

```tsx
import React, { useState } from 'react';
import { 
  AnalyticsProvider, 
  AnalyticsAdapter,
  Button, 
  TextBox, 
  DatePicker,
  Popup 
} from '@your-org/react-analytics-ui';

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
```

## Platform-Specific Adapters

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

// Usage
<AnalyticsProvider adapter={gaAdapter}>
  <App />
</AnalyticsProvider>
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

// Usage
<AnalyticsProvider adapter={segmentAdapter}>
  <App />
</AnalyticsProvider>
```

### Mixpanel
```typescript
const mixpanelAdapter: AnalyticsAdapter = {
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
};

// Usage
<AnalyticsProvider adapter={mixpanelAdapter}>
  <App />
</AnalyticsProvider>
```

### Custom API Backend
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

// Usage
<AnalyticsProvider adapter={customAdapter}>
  <App />
</AnalyticsProvider>
```

## Advanced Patterns

### Multi-Platform Adapter
Send events to multiple analytics platforms:

```typescript
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
```

### Conditional Analytics (A/B Testing)
```typescript
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
```

### Batched Events
```typescript
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
```

### Development vs Production
```typescript
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
```

## Troubleshooting

### Events Not Firing
1. Verify AnalyticsProvider wraps your components
2. Check adapter is passed to AnalyticsProvider
3. Ensure `disableAnalytics` is not set to `true`
4. Check console for adapter errors

### Too Many Events
1. Disable `trackOnChange` on TextBox components
2. Use `disableAnalytics` on less critical components
3. Implement event throttling in your adapter

### Missing Metadata
1. Ensure `analyticsMetadata` prop is passed
2. Check that metadata object is not empty
3. Verify adapter is forwarding metadata correctly

---

*For more information, see component-manifest.json*
