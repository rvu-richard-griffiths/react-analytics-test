import type { Meta, StoryObj } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { useState } from 'react';
import { TextBox } from './TextBox';
import { AnalyticsProvider, AnalyticsAdapter } from '../analytics';

const mockAdapter: AnalyticsAdapter = {
  track: (event) => {
    console.log('📊 Analytics Event:', event);
    action('analytics-event')(event);
  },
};

const meta: Meta<typeof TextBox> = {
  title: 'Components/TextBox',
  component: TextBox,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <AnalyticsProvider adapter={mockAdapter}>
        <div style={{ padding: '20px', maxWidth: '400px' }}>
          <Story />
        </div>
      </AnalyticsProvider>
    ),
  ],
  argTypes: {
    disabled: {
      control: 'boolean',
    },
    disableAnalytics: {
      control: 'boolean',
    },
    trackOnChange: {
      control: 'boolean',
    },
  },
};

export default meta;
type Story = StoryObj<typeof TextBox>;

export const Default: Story = {
  render: (args) => {
    const [value, setValue] = useState('');
    return <TextBox {...args} value={value} onChange={(e) => setValue(e.target.value)} />;
  },
  args: {
    placeholder: 'Enter text...',
    analyticsId: 'textbox-default',
  },
};

export const WithLabel: Story = {
  render: (args) => {
    const [value, setValue] = useState('');
    return <TextBox {...args} value={value} onChange={(e) => setValue(e.target.value)} />;
  },
  args: {
    label: 'Email Address',
    placeholder: 'you@example.com',
    analyticsId: 'email-input',
  },
};

export const WithHelpText: Story = {
  render: (args) => {
    const [value, setValue] = useState('');
    return <TextBox {...args} value={value} onChange={(e) => setValue(e.target.value)} />;
  },
  args: {
    label: 'Username',
    placeholder: 'Enter username',
    helpText: 'Must be at least 3 characters',
    analyticsId: 'username-input',
  },
};

export const WithError: Story = {
  render: (args) => {
    const [value, setValue] = useState('ab');
    return <TextBox {...args} value={value} onChange={(e) => setValue(e.target.value)} />;
  },
  args: {
    label: 'Username',
    placeholder: 'Enter username',
    error: 'Username must be at least 3 characters',
    analyticsId: 'username-input-error',
  },
};

export const Password: Story = {
  render: (args) => {
    const [value, setValue] = useState('');
    return <TextBox {...args} value={value} onChange={(e) => setValue(e.target.value)} />;
  },
  args: {
    label: 'Password',
    type: 'password',
    placeholder: 'Enter password',
    analyticsId: 'password-input',
  },
};

export const Disabled: Story = {
  render: (args) => {
    const [value, setValue] = useState('Disabled value');
    return <TextBox {...args} value={value} onChange={(e) => setValue(e.target.value)} />;
  },
  args: {
    label: 'Disabled Field',
    disabled: true,
    analyticsId: 'disabled-input',
  },
};

export const WithMetadata: Story = {
  render: (args) => {
    const [value, setValue] = useState('');
    return <TextBox {...args} value={value} onChange={(e) => setValue(e.target.value)} />;
  },
  args: {
    label: 'Company Name',
    placeholder: 'Acme Corp',
    analyticsId: 'company-input',
    analyticsMetadata: {
      formName: 'signup',
      step: 2,
    },
  },
};

export const TrackOnChange: Story = {
  render: (args) => {
    const [value, setValue] = useState('');
    return <TextBox {...args} value={value} onChange={(e) => setValue(e.target.value)} />;
  },
  args: {
    label: 'Search',
    placeholder: 'Type to search...',
    trackOnChange: true,
    analyticsId: 'search-input',
  },
};
