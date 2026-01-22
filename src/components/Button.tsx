import React, { ButtonHTMLAttributes, useCallback } from 'react';
import { useAnalyticsTracking, AnalyticsProps } from '../analytics';
import styles from './Button.module.css';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>, AnalyticsProps {
  /**
   * Button variant style
   */
  variant?: 'primary' | 'secondary' | 'danger';
  /**
   * Button size
   */
  size?: 'small' | 'medium' | 'large';
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
  const trackEvent = useAnalyticsTracking({
    componentType: 'button',
    componentId: analyticsId,
    metadata: {
      variant,
      size,
      label: typeof children === 'string' ? children : undefined,
      ...analyticsMetadata,
    },
    disableAnalytics,
    disabled,
  });

  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      // Track analytics event
      trackEvent('click');

      // Call the original onClick handler
      if (onClick) {
        onClick(event);
      }
    },
    [trackEvent, onClick]
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
