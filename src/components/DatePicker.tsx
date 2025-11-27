import React, { useState, useRef, useEffect, InputHTMLAttributes, useCallback } from 'react';
import { useOptionalAnalytics } from '../analytics';
import styles from './DatePicker.module.css';

export interface DatePickerProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'value' | 'onChange'> {
  /**
   * The selected date value
   */
  value?: Date | null;
  /**
   * Callback when date changes
   */
  onChange?: (date: Date | null) => void;
  /**
   * Minimum selectable date
   */
  minDate?: Date;
  /**
   * Maximum selectable date
   */
  maxDate?: Date;
  /**
   * Date format for display (simplified)
   */
  format?: 'MM/DD/YYYY' | 'DD/MM/YYYY' | 'YYYY-MM-DD';
  /**
   * Optional ID for analytics tracking
   */
  analyticsId?: string;
  /**
   * Additional metadata to include in analytics events
   */
  analyticsMetadata?: Record<string, any>;
  /**
   * Disable analytics tracking for this component
   */
  disableAnalytics?: boolean;
}

/**
 * DatePicker component with built-in analytics tracking
 * 
 * Tracks date selection, open, and close events
 * 
 * @example
 * ```tsx
 * <DatePicker
 *   value={selectedDate}
 *   onChange={setSelectedDate}
 *   analyticsId="booking-date"
 *   analyticsMetadata={{ context: 'booking-form' }}
 * />
 * ```
 */
export const DatePicker: React.FC<DatePickerProps> = ({
  value,
  onChange,
  minDate,
  maxDate,
  format = 'MM/DD/YYYY',
  analyticsId,
  analyticsMetadata,
  disableAnalytics = false,
  disabled,
  className,
  ...props
}) => {
  const analytics = useOptionalAnalytics();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const formatDate = (date: Date | null): string => {
    if (!date) return '';
    
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    switch (format) {
      case 'DD/MM/YYYY':
        return `${day}/${month}/${year}`;
      case 'YYYY-MM-DD':
        return `${year}-${month}-${day}`;
      case 'MM/DD/YYYY':
      default:
        return `${month}/${day}/${year}`;
    }
  };

  const toISODateString = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const trackEvent = useCallback(
    (eventType: string, metadata?: Record<string, any>) => {
      if (!disableAnalytics && analytics && !disabled) {
        analytics.track({
          eventType,
          componentType: 'datepicker',
          componentId: analyticsId,
          metadata: {
            selectedDate: value ? toISODateString(value) : null,
            format,
            ...analyticsMetadata,
            ...metadata,
          },
        });
      }
    },
    [analytics, analyticsId, analyticsMetadata, disableAnalytics, value, format, disabled]
  );

  const handleOpen = useCallback(() => {
    if (!disabled) {
      setIsOpen(true);
      trackEvent('open');
    }
  }, [disabled, trackEvent]);

  const handleClose = useCallback(() => {
    setIsOpen(false);
    trackEvent('close');
  }, [trackEvent]);

  const handleDateChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const newDate = event.target.value ? new Date(event.target.value) : null;
      
      if (onChange) {
        onChange(newDate);
      }

      trackEvent('select', {
        newDate: newDate ? toISODateString(newDate) : null,
      });

      handleClose();
    },
    [onChange, trackEvent, handleClose]
  );

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        if (isOpen) {
          handleClose();
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, handleClose]);

  const inputClasses = [styles.input, className].filter(Boolean).join(' ');

  return (
    <div className={styles.container} ref={containerRef}>
      <div className={styles.inputWrapper}>
        <input
          type="text"
          value={formatDate(value || null)}
          onClick={handleOpen}
          readOnly
          disabled={disabled}
          className={inputClasses}
          placeholder={format}
          {...props}
        />
        <span className={styles.icon}>📅</span>
      </div>
      {isOpen && !disabled && (
        <div className={styles.dropdown}>
          <input
            type="date"
            value={value ? toISODateString(value) : ''}
            onChange={handleDateChange}
            min={minDate ? toISODateString(minDate) : undefined}
            max={maxDate ? toISODateString(maxDate) : undefined}
            className={styles.nativeInput}
            autoFocus
          />
        </div>
      )}
    </div>
  );
};
