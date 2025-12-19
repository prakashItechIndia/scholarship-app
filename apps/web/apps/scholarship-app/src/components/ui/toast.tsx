import { useCallback } from 'react';
import { MessageBar, MessageBarType } from '@fluentui/react';

// Simple toast hook that can be extended later
export const useToast = () => {
  const success = useCallback((title: string, message: string) => {
    // For now, just use console or implement a toast system
    // You can integrate with a toast library like react-toastify or create a custom one
    console.log(`Success: ${title} - ${message}`);
    // TODO: Implement actual toast notification
  }, []);

  const error = useCallback((title: string, message: string) => {
    console.error(`Error: ${title} - ${message}`);
    // TODO: Implement actual toast notification
  }, []);

  return { success, error };
};

