import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Toast, ToastComponent, ToastType } from './ToastComponent';

interface ToastContextType {
  showToast: (title: string, message: string, type?: ToastType) => void;
  success: (title: string, message: string) => void;
  error: (title: string, message: string) => void;
  info: (title: string, message: string) => void;
  warning: (title: string, message: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToastContext = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToastContext must be used within ToastProvider');
  }
  return context;
};

interface ToastProviderProps {
  children: ReactNode;
}

export const ToastProvider = ({ children }: ToastProviderProps) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev: Toast[]) => prev.filter((toast: Toast) => toast.id !== id));
  }, []);

  const showToast = useCallback(
    (title: string, message: string, type: ToastType = 'info') => {
      const id = `toast-${Date.now()}-${Math.random()}`;
      const newToast: Toast = {
        id,
        title,
        message,
        type,
      };

      setToasts((prev: Toast[]) => [...prev, newToast]);
    },
    []
  );

  const success = useCallback(
    (title: string, message: string) => {
      showToast(title, message, 'success');
    },
    [showToast]
  );

  const error = useCallback(
    (title: string, message: string) => {
      showToast(title, message, 'error');
    },
    [showToast]
  );

  const info = useCallback(
    (title: string, message: string) => {
      showToast(title, message, 'info');
    },
    [showToast]
  );

  const warning = useCallback(
    (title: string, message: string) => {
      showToast(title, message, 'warning');
    },
    [showToast]
  );

  return (
    <ToastContext.Provider value={{ showToast, success, error, info, warning }}>
      {children}
      <div
        style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          zIndex: 10000,
          pointerEvents: 'none',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          alignItems: 'flex-end',
        }}
      >
        {toasts.map((toast: Toast, index: number) => (
          <div
            key={toast.id}
            style={{
              pointerEvents: 'auto',
              transform: `translateY(${index * 0}px)`,
            }}
          >
            <ToastComponent
              toast={toast}
              onDismiss={removeToast}
              duration={5000}
            />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

