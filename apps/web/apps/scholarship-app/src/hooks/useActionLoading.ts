import { useState, useCallback } from 'react';

/**
 * Hook for managing loading state of action buttons that trigger API calls
 * 
 * Provides:
 * - Loading state management
 * - Wrapper function to execute async actions with automatic loading state
 * - Prevents duplicate actions while loading
 * 
 * @returns Object containing loading state and execute function
 * 
 * @example
 * ```tsx
 * const { loading, execute } = useActionLoading();
 * 
 * const handleSubmit = execute(async () => {
 *   await api.submit();
 * });
 * 
 * <Button onClick={handleSubmit} disabled={loading}>
 *   {loading ? <Spinner /> : 'Submit'}
 * </Button>
 * ```
 */
export const useActionLoading = () => {
  const [loading, setLoading] = useState(false);

  /**
   * Execute an async action with automatic loading state management
   * Prevents duplicate executions while loading
   */
  const execute = useCallback(
    async <T,>(action: () => Promise<T>): Promise<T | undefined> => {
      // Prevent duplicate actions
      if (loading) {
        return undefined;
      }

      try {
        setLoading(true);
        const result = await action();
        return result;
      } catch (error) {
        // Re-throw error so caller can handle it
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [loading],
  );

  return {
    loading,
    execute,
    setLoading, // Allow manual control if needed
  };
};

