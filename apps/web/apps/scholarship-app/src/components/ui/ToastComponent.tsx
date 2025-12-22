import { MessageBar, MessageBarType } from '@fluentui/react';
import { useEffect, useState } from 'react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
  id: string;
  title: string;
  message: string;
  type: ToastType;
}

interface ToastProps {
  toast: Toast;
  onDismiss: (id: string) => void;
  duration?: number;
}

const getMessageBarType = (type: ToastType): MessageBarType => {
  switch (type) {
    case 'success':
      return MessageBarType.success;
    case 'error':
      return MessageBarType.error;
    case 'warning':
      return MessageBarType.warning;
    case 'info':
    default:
      return MessageBarType.info;
  }
};

export const ToastComponent = ({ toast, onDismiss, duration = 5000 }: ToastProps) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(() => onDismiss(toast.id), 300); // Wait for fade out animation
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration, toast.id, onDismiss]);

  const handleDismiss = () => {
    setIsVisible(false);
    setTimeout(() => onDismiss(toast.id), 300);
  };

  if (!isVisible) return null;

  return (
    <div
      style={{
        minWidth: '320px',
        maxWidth: '480px',
        animation: 'fadeIn 0.3s ease-in',
      }}
    >
      <style>
        {`
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(-10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>
      <MessageBar
        messageBarType={getMessageBarType(toast.type)}
        onDismiss={handleDismiss}
        dismissButtonAriaLabel="Close"
        styles={{
          root: {
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            borderRadius: '4px',
          },
        }}
      >
        <div>
          {toast.title && (
            <div style={{ fontWeight: 600, fontSize: '14px', marginBottom: '4px' }}>
              {toast.title}
            </div>
          )}
          {toast.message && (
            <div style={{ fontSize: '13px', lineHeight: '1.4' }}>{toast.message}</div>
          )}
        </div>
      </MessageBar>
    </div>
  );
};

