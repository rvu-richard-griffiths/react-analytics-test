import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { DatePicker } from './DatePicker';

const meta: Meta<typeof DatePicker> = {
  title: 'Components/DatePicker',
  component: DatePicker,
  tags: ['autodocs'],
  argTypes: {
    format: {
      control: 'select',
      options: ['MM/DD/YYYY', 'DD/MM/YYYY', 'YYYY-MM-DD'],
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
type Story = StoryObj<typeof DatePicker>;

export const Default: Story = {
  render: (args) => {
    const [date, setDate] = useState<Date | null>(null);
    return <DatePicker {...args} value={date} onChange={setDate} />;
  },
  args: {
    analyticsId: 'date-picker-default',
  },
};

export const WithInitialValue: Story = {
  render: (args) => {
    const [date, setDate] = useState<Date | null>(new Date('2024-01-15'));
    return <DatePicker {...args} value={date} onChange={setDate} />;
  },
  args: {
    analyticsId: 'date-picker-with-value',
  },
};

export const USFormat: Story = {
  render: (args) => {
    const [date, setDate] = useState<Date | null>(null);
    return <DatePicker {...args} value={date} onChange={setDate} />;
  },
  args: {
    format: 'MM/DD/YYYY',
    analyticsId: 'date-picker-us',
  },
};

export const EuropeanFormat: Story = {
  render: (args) => {
    const [date, setDate] = useState<Date | null>(null);
    return <DatePicker {...args} value={date} onChange={setDate} />;
  },
  args: {
    format: 'DD/MM/YYYY',
    analyticsId: 'date-picker-eu',
  },
};

export const ISOFormat: Story = {
  render: (args) => {
    const [date, setDate] = useState<Date | null>(null);
    return <DatePicker {...args} value={date} onChange={setDate} />;
  },
  args: {
    format: 'YYYY-MM-DD',
    analyticsId: 'date-picker-iso',
  },
};

export const WithMinMax: Story = {
  render: (args) => {
    const [date, setDate] = useState<Date | null>(null);
    const today = new Date();
    const minDate = new Date(today.getFullYear(), today.getMonth(), 1);
    const maxDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    return <DatePicker {...args} value={date} onChange={setDate} minDate={minDate} maxDate={maxDate} />;
  },
  args: {
    analyticsId: 'date-picker-constrained',
  },
};

export const Disabled: Story = {
  render: (args) => {
    const [date, setDate] = useState<Date | null>(new Date());
    return <DatePicker {...args} value={date} onChange={setDate} />;
  },
  args: {
    disabled: true,
    analyticsId: 'date-picker-disabled',
  },
};

export const WithMetadata: Story = {
  render: (args) => {
    const [date, setDate] = useState<Date | null>(null);
    return <DatePicker {...args} value={date} onChange={setDate} />;
  },
  args: {
    analyticsId: 'booking-date',
    analyticsMetadata: {
      context: 'booking-form',
      fieldName: 'checkInDate',
    },
  },
};
