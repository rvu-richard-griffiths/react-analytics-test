import React, { ReactNode, useCallback, useEffect, useRef } from 'react';
import { useOptionalAnalytics } from '../analytics';
import styles from './Popup.module.css';

export interface PopupProps {
  /**
   * Whether the popup is open
   */
  isOpen: boolean;
  /**
   * Callback when popup should close
   */
  onClose: () => void;
  /**
   * Popup title
   */
  title?: string;
  /**
   * Popup content
   */
  children: ReactNode;
  /**
   * Popup size
   */
  size?: 'small' | 'medium' | 'large';
  /**
   * Whether to show close button
   */
  showCloseButton?: boolean;
  /**
   * Whether to close on overlay click
   */
  closeOnOverlayClick?: boolean;
  /**
   * Whether to close on escape key
   */
  closeOnEscape?: boolean;
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
 * Popup/Modal component with built-in analytics tracking
 * 
 * Tracks open, close, and interaction events
 * 
 * @example
 * ```tsx
 * <Popup
 *   isOpen={isOpen}
 *   onClose={() => setIsOpen(false)}
 *   title="Confirmation"
 *   analyticsId="delete-confirmation"
 *   analyticsMetadata={{ action: 'delete-user' }}
 * >
 *   <p>Are you sure you want to delete this user?</p>
 *   <Button onClick={handleDelete}>Delete</Button>
 * </Popup>
 * ```
 */
export const Popup: React.FC<PopupProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'medium',
  showCloseButton = true,
  closeOnOverlayClick = true,
  closeOnEscape = true,
  analyticsId,
  analyticsMetadata,
  disableAnalytics = false,
}) => {
  const analytics = useOptionalAnalytics();
  const popupRef = useRef<HTMLDivElement>(null);
  const openedAtRef = useRef<number>(0);
  const hasTrackedOpenRef = useRef(false);

  const trackEvent = useCallback(
    (eventType: string, metadata?: Record<string, any>) => {
      if (!disableAnalytics && analytics) {
        analytics.track({
          eventType,
          componentType: 'popup',
          componentId: analyticsId,
          metadata: {
            title,
            size,
            ...analyticsMetadata,
            ...metadata,
          },
        });
      }
    },
    [analytics, analyticsId, analyticsMetadata, disableAnalytics, title, size]
  );

  // Track open event
  useEffect(() => {
    if (isOpen && !hasTrackedOpenRef.current) {
      openedAtRef.current = Date.now();
      hasTrackedOpenRef.current = true;
      trackEvent('open');
    } else if (!isOpen && hasTrackedOpenRef.current) {
      hasTrackedOpenRef.current = false;
    }
  }, [isOpen, trackEvent]);

  const handleClose = useCallback(
    (reason: 'close-button' | 'overlay-click' | 'escape-key') => {
      const timeOpen = openedAtRef.current ? Date.now() - openedAtRef.current : 0;
      
      trackEvent('close', {
        reason,
        timeOpenMs: timeOpen,
      });

      onClose();
    },
    [onClose, trackEvent]
  );

  const handleOverlayClick = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      if (closeOnOverlayClick && event.target === event.currentTarget) {
        handleClose('overlay-click');
      }
    },
    [closeOnOverlayClick, handleClose]
  );

  const handleCloseButtonClick = useCallback(() => {
    handleClose('close-button');
  }, [handleClose]);

  // Handle escape key
  useEffect(() => {
    if (!isOpen || !closeOnEscape) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleClose('escape-key');
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, closeOnEscape, handleClose]);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = '';
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const popupClasses = [styles.popup, styles[size]].filter(Boolean).join(' ');

  return (
    <div className={styles.overlay} onClick={handleOverlayClick}>
      <div className={popupClasses} ref={popupRef} role="dialog" aria-modal="true" aria-labelledby={title ? 'popup-title' : undefined}>
        {(title || showCloseButton) && (
          <div className={styles.header}>
            {title && <h2 id="popup-title" className={styles.title}>{title}</h2>}
            {showCloseButton && (
              <button
                className={styles.closeButton}
                onClick={handleCloseButtonClick}
                aria-label="Close"
              >
                ×
              </button>
            )}
          </div>
        )}
        <div className={styles.content}>{children}</div>
      </div>
    </div>
  );
};
