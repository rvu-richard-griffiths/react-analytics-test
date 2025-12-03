import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';
import { AnalyticsContextProvider } from '../analytics';

const meta: Meta<typeof Button> = {
  title: 'Examples/Context Demonstration',
  component: Button,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Button>;

/**
 * Events from this button will include the global Storybook context
 * set in .storybook/preview.ts (view, section, channel, etc.)
 */
export const GlobalContext: Story = {
  render: () => (
    <div>
      <h3>Global Context Only</h3>
      <p>This button uses only the global context from the provider.</p>
      <Button analyticsId="global-context-btn">
        Click Me
      </Button>
      <p style={{ marginTop: '1rem', fontSize: '0.875rem', color: '#666' }}>
        Check the Actions tab or NATS logs to see the context in the event.
      </p>
    </div>
  ),
};

/**
 * Additional context can be added at any level.
 * Here we add a 'section' context to group related components.
 */
export const NestedContext: Story = {
  render: () => (
    <AnalyticsContextProvider context={{ section: 'product-showcase' }}>
      <div style={{ padding: '1rem', border: '2px solid #e0e0e0', borderRadius: '8px' }}>
        <h3>Nested Context</h3>
        <p>These buttons are wrapped in an AnalyticsContextProvider with section: 'product-showcase'</p>
        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
          <Button analyticsId="buy-now-btn" variant="primary">
            Buy Now
          </Button>
          <Button analyticsId="add-to-cart-btn" variant="secondary">
            Add to Cart
          </Button>
        </div>
        <p style={{ marginTop: '1rem', fontSize: '0.875rem', color: '#666' }}>
          All events will include: section: 'product-showcase'
        </p>
      </div>
    </AnalyticsContextProvider>
  ),
};

/**
 * Context can be nested at multiple levels, with each level
 * adding to or overriding the parent context.
 */
export const MultiLevelNesting: Story = {
  render: () => (
    <AnalyticsContextProvider context={{ section: 'checkout-page' }}>
      <div style={{ padding: '1rem', border: '2px solid #4CAF50', borderRadius: '8px' }}>
        <h3>Checkout Page (section: 'checkout-page')</h3>
        
        <AnalyticsContextProvider context={{ section: 'shipping-form' }}>
          <div style={{ padding: '1rem', margin: '1rem 0', border: '1px dashed #2196F3', borderRadius: '4px' }}>
            <h4>Shipping Form (section: 'shipping-form')</h4>
            <Button analyticsId="save-shipping-btn" size="small">
              Save Shipping Address
            </Button>
          </div>
        </AnalyticsContextProvider>

        <AnalyticsContextProvider context={{ section: 'payment-form' }}>
          <div style={{ padding: '1rem', margin: '1rem 0', border: '1px dashed #FF9800', borderRadius: '4px' }}>
            <h4>Payment Form (section: 'payment-form')</h4>
            <Button analyticsId="submit-payment-btn" variant="primary" size="small">
              Submit Payment
            </Button>
          </div>
        </AnalyticsContextProvider>

        <Button analyticsId="complete-order-btn" variant="primary">
          Complete Order
        </Button>
        
        <p style={{ marginTop: '1rem', fontSize: '0.875rem', color: '#666' }}>
          Each button has different section context based on its nesting level.
        </p>
      </div>
    </AnalyticsContextProvider>
  ),
};

/**
 * Custom context properties can be added for specific use cases
 * like A/B testing, campaigns, or feature flags.
 */
export const CustomContext: Story = {
  render: () => (
    <AnalyticsContextProvider 
      context={{ 
        section: 'promo-banner',
        custom: {
          campaign: 'summer-sale-2024',
          variant: 'test-b',
          experimentId: 'exp-123',
        }
      }}
    >
      <div style={{ 
        padding: '2rem', 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderRadius: '8px',
        color: 'white'
      }}>
        <h3>50% Off Summer Sale! 🌞</h3>
        <p>Limited time offer - ends soon!</p>
        <Button 
          analyticsId="promo-cta-btn" 
          variant="secondary"
          style={{ marginTop: '1rem' }}
        >
          Shop Now
        </Button>
        <p style={{ marginTop: '1rem', fontSize: '0.875rem', opacity: 0.9 }}>
          Event includes: campaign, variant, experimentId in custom context
        </p>
      </div>
    </AnalyticsContextProvider>
  ),
};
