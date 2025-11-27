import React, { InputHTMLAttributes, useCallback, useState, useRef, useEffect } from 'react';
import { useOptionalAnalytics } from '../analytics';
import styles from './TextBox.module.css';

export interface TextBoxProps extends InputHTMLAttributes<HTMLInputElement> {
  /**
   * Label for the text box
   */
  label?: string;
  /**
   * Error message to display
   */
  error?: string;
  /**
   * Help text to display below the input
   */
  helpText?: string;
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
  /**
   * Track on change events (can be noisy, disabled by default)
   */
  trackOnChange?: boolean;
}

/**
 * TextBox component with built-in analytics tracking
 * 
 * Tracks focus, blur, and optionally change events
 * 
 * @example
 * ```tsx
 * <TextBox
 *   label="Email"
 *   placeholder="Enter your email"
 *   analyticsId="email-input"
 *   analyticsMetadata={{ formName: 'signup' }}
 *   value={email}
 *   onChange={(e) => setEmail(e.target.value)}
 * />
 * ```
 */
export const TextBox: React.FC<TextBoxProps> = ({
  label,
  error,
  helpText,
  analyticsId,
  analyticsMetadata,
  disableAnalytics = false,
  trackOnChange = false,
  onFocus,
  onBlur,
  onChange,
  className,
  disabled,
  ...props
}) => {
  const analytics = useOptionalAnalytics();
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const startValueRef = useRef<string>('');

  useEffect(() => {
    if (inputRef.current) {
      startValueRef.current = inputRef.current.value;
    }
  }, []);

  const trackEvent = useCallback(
    (eventType: string, metadata?: Record<string, any>) => {
      if (!disableAnalytics && analytics && !disabled) {
        analytics.track({
          eventType,
          componentType: 'textbox',
          componentId: analyticsId,
          metadata: {
            label,
            hasError: !!error,
            ...analyticsMetadata,
            ...metadata,
          },
        });
      }
    },
    [analytics, analyticsId, analyticsMetadata, disableAnalytics, label, error, disabled]
  );

  const handleFocus = useCallback(
    (event: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true);
      startValueRef.current = event.target.value;
      trackEvent('focus');

      if (onFocus) {
        onFocus(event);
      }
    },
    [onFocus, trackEvent]
  );

  const handleBlur = useCallback(
    (event: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      
      const endValue = event.target.value;
      const valueChanged = startValueRef.current !== endValue;

      trackEvent('blur', {
        valueChanged,
        valueLength: endValue.length,
        isEmpty: endValue.length === 0,
      });

      if (onBlur) {
        onBlur(event);
      }
    },
    [onBlur, trackEvent]
  );

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (trackOnChange) {
        trackEvent('change', {
          valueLength: event.target.value.length,
        });
      }

      if (onChange) {
        onChange(event);
      }
    },
    [onChange, trackOnChange, trackEvent]
  );

  const inputClasses = [
    styles.input,
    error ? styles.error : '',
    isFocused ? styles.focused : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={styles.container}>
      {label && (
        <label className={styles.label} htmlFor={props.id}>
          {label}
        </label>
      )}
      <input
        ref={inputRef}
        className={inputClasses}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onChange={handleChange}
        disabled={disabled}
        {...props}
      />
      {error && <div className={styles.errorText}>{error}</div>}
      {helpText && !error && <div className={styles.helpText}>{helpText}</div>}
    </div>
  );
};
