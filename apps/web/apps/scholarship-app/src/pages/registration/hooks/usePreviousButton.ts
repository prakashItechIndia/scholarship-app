import { useEffect } from 'react';
import { useRegistration, PreviousButtonConfig } from '@/contexts/RegistrationContext';

/**
 * Hook for step components to configure the Previous button behavior dynamically
 * 
 * @param config - Configuration object for the previous button
 * @param config.onPrevious - Custom handler function to execute when Previous is clicked
 * @param config.disabled - Whether the Previous button should be disabled
 * @param config.label - Custom label for the Previous button (defaults to "Previous")
 * @param config.className - Custom className for the button (overrides bgColor/textColor)
 * @param config.bgColor - Background color (hex color like '#E0E0E0' or Tailwind class like 'bg-gray-200')
 * @param config.textColor - Text color (hex color like '#BDBDBD' or Tailwind class like 'text-gray-500')
 * 
 * @example
 * // Custom handler with styling
 * usePreviousButton({
 *   onPrevious: async () => {
 *     await saveData();
 *     prevStep();
 *   },
 *   bgColor: '#F0F0F0',
 *   textColor: '#666666'
 * });
 * 
 * @example
 * // Disable with custom disabled styling
 * usePreviousButton({
 *   disabled: true,
 *   bgColor: 'bg-gray-300',
 *   textColor: 'text-gray-400'
 * });
 * 
 * @example
 * // Full custom className
 * usePreviousButton({
 *   className: '!bg-blue-500 !text-white hover:!bg-blue-600 h-10 rounded-lg'
 * });
 */
export const usePreviousButton = (config: PreviousButtonConfig | null) => {
  const { currentStep, setPreviousButtonConfig } = useRegistration();

  useEffect(() => {
    // Set the configuration when component mounts or config changes
    setPreviousButtonConfig(config);

    // Cleanup: clear configuration when component unmounts or step changes
    return () => {
      setPreviousButtonConfig(null);
    };
  }, [config, setPreviousButtonConfig, currentStep]);
};

