import React, { ButtonHTMLAttributes, useCallback } from 'react';
import { useOptionalAnalytics } from '../analytics';
import styles from './Button.module.css';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Button variant style
   */
  variant?: 'primary' | 'secondary' | 'danger';
  /**
   * Button size
   */
  size?: 'small' | 'medium' | 'large';
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
 * Button component with built-in analytics tracking
 * 
 * Tracks click events with context-aware analytics
 * 
 * @example
 * ```tsx
 * <Button 
 *   variant="primary" 
 *   analyticsId="submit-form"
 *   analyticsMetadata={{ formName: 'contact' }}
 *   onClick={handleSubmit}
 * >
 *   Submit
 * </Button>
 * ```
 */
export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'medium',
  analyticsId,
  analyticsMetadata,
  disableAnalytics = false,
  onClick,
  children,
  className,
  disabled,
  ...props
}) => {
  const analytics = useOptionalAnalytics();

  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      // Track analytics if enabled and provider is available
      if (!disableAnalytics && analytics && !disabled) {
        analytics.track({
          eventType: 'click',
          componentType: 'button',
          componentId: analyticsId,
          metadata: {
            variant,
            size,
            label: typeof children === 'string' ? children : undefined,
            ...analyticsMetadata,
          },
        });
      }

      // Call the original onClick handler
      if (onClick) {
        onClick(event);
      }
    },
    [analytics, analyticsId, analyticsMetadata, disableAnalytics, onClick, variant, size, children, disabled]
  );

  const buttonClasses = [
    styles.button,
    styles[variant],
    styles[size],
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      className={buttonClasses}
      onClick={handleClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};
