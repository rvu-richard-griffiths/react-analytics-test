import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Popup } from './Popup';
import { Button } from './Button';

const meta: Meta<typeof Popup> = {
  title: 'Components/Popup',
  component: Popup,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
    },
    showCloseButton: {
      control: 'boolean',
    },
    closeOnOverlayClick: {
      control: 'boolean',
    },
    closeOnEscape: {
      control: 'boolean',
    },
    disableAnalytics: {
      control: 'boolean',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Popup>;

export const Default: Story = {
  render: (args) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setIsOpen(true)}>Open Popup</Button>
        <Popup {...args} isOpen={isOpen} onClose={() => setIsOpen(false)}>
          <p>This is a basic popup with default settings.</p>
        </Popup>
      </>
    );
  },
  args: {
    title: 'Default Popup',
    analyticsId: 'default-popup',
  },
};

export const Small: Story = {
  render: (args) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setIsOpen(true)}>Open Small Popup</Button>
        <Popup {...args} isOpen={isOpen} onClose={() => setIsOpen(false)}>
          <p>This is a small popup.</p>
        </Popup>
      </>
    );
  },
  args: {
    title: 'Small Popup',
    size: 'small',
    analyticsId: 'small-popup',
  },
};

export const Large: Story = {
  render: (args) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setIsOpen(true)}>Open Large Popup</Button>
        <Popup {...args} isOpen={isOpen} onClose={() => setIsOpen(false)}>
          <p>This is a large popup with more content space.</p>
          <p>You can put lots of content here.</p>
        </Popup>
      </>
    );
  },
  args: {
    title: 'Large Popup',
    size: 'large',
    analyticsId: 'large-popup',
  },
};

export const NoTitle: Story = {
  render: (args) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setIsOpen(true)}>Open Popup Without Title</Button>
        <Popup {...args} isOpen={isOpen} onClose={() => setIsOpen(false)}>
          <h3 style={{ marginTop: 0 }}>Custom Title Inside Content</h3>
          <p>This popup doesn't have a title in the header.</p>
        </Popup>
      </>
    );
  },
  args: {
    analyticsId: 'no-title-popup',
  },
};

export const NoCloseButton: Story = {
  render: (args) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setIsOpen(true)}>Open Popup</Button>
        <Popup {...args} isOpen={isOpen} onClose={() => setIsOpen(false)}>
          <p>This popup has no close button. Click outside or press Escape to close.</p>
        </Popup>
      </>
    );
  },
  args: {
    title: 'No Close Button',
    showCloseButton: false,
    analyticsId: 'no-close-btn-popup',
  },
};

export const WithForm: Story = {
  render: (args) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setIsOpen(true)}>Open Form</Button>
        <Popup {...args} isOpen={isOpen} onClose={() => setIsOpen(false)}>
          <form onSubmit={(e) => { e.preventDefault(); setIsOpen(false); }}>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px' }}>Name:</label>
              <input type="text" style={{ width: '100%', padding: '8px' }} />
            </div>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px' }}>Email:</label>
              <input type="email" style={{ width: '100%', padding: '8px' }} />
            </div>
            <Button type="submit" variant="primary">Submit</Button>
          </form>
        </Popup>
      </>
    );
  },
  args: {
    title: 'Contact Form',
    analyticsId: 'contact-form-popup',
    analyticsMetadata: {
      formType: 'contact',
    },
  },
};

export const Confirmation: Story = {
  render: (args) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
      <>
        <Button variant="danger" onClick={() => setIsOpen(true)}>Delete Item</Button>
        <Popup {...args} isOpen={isOpen} onClose={() => setIsOpen(false)}>
          <p>Are you sure you want to delete this item? This action cannot be undone.</p>
          <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
            <Button variant="danger" onClick={() => setIsOpen(false)}>Delete</Button>
            <Button variant="secondary" onClick={() => setIsOpen(false)}>Cancel</Button>
          </div>
        </Popup>
      </>
    );
  },
  args: {
    title: 'Confirm Delete',
    size: 'small',
    closeOnOverlayClick: false,
    analyticsId: 'delete-confirmation',
    analyticsMetadata: {
      action: 'delete-item',
    },
  },
};

export const WithMetadata: Story = {
  render: (args) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setIsOpen(true)}>Open Settings</Button>
        <Popup {...args} isOpen={isOpen} onClose={() => setIsOpen(false)}>
          <p>Settings content goes here.</p>
        </Popup>
      </>
    );
  },
  args: {
    title: 'Settings',
    analyticsId: 'settings-popup',
    analyticsMetadata: {
      section: 'user-preferences',
      version: '2.0',
    },
  },
};
