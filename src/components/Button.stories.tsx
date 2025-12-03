import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'danger'],
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
    },
    disabled: {
      control: 'boolean',
    },
    disableAnalytics: {
      control: 'boolean',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: {
    children: 'Primary Button',
    variant: 'primary',
    analyticsId: 'primary-btn',
  },
};

export const Secondary: Story = {
  args: {
    children: 'Secondary Button',
    variant: 'secondary',
    analyticsId: 'secondary-btn',
  },
};

export const Danger: Story = {
  args: {
    children: 'Delete',
    variant: 'danger',
    analyticsId: 'delete-btn',
  },
};

export const Small: Story = {
  args: {
    children: 'Small Button',
    size: 'small',
    analyticsId: 'small-btn',
  },
};

export const Medium: Story = {
  args: {
    children: 'Medium Button',
    size: 'medium',
    analyticsId: 'medium-btn',
  },
};

export const Large: Story = {
  args: {
    children: 'Large Button',
    size: 'large',
    analyticsId: 'large-btn',
  },
};

export const Disabled: Story = {
  args: {
    children: 'Disabled Button',
    disabled: true,
    analyticsId: 'disabled-btn',
  },
};

export const WithMetadata: Story = {
  args: {
    children: 'Submit Form',
    variant: 'primary',
    analyticsId: 'submit-form',
    analyticsMetadata: {
      formName: 'contact',
      step: 1,
    },
  },
};

export const WithoutAnalytics: Story = {
  args: {
    children: 'No Analytics',
    disableAnalytics: true,
  },
};
