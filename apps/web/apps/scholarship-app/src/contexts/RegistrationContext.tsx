import {
  createContext,
  useContext,
  useState,
  type ReactNode,
  useCallback,
  useEffect,
  useRef,
} from 'react';

// Define a more specific type for form data
export type RegistrationFormData = Record<string, string | number | Date | File[] | undefined | null>;

export interface PreviousButtonConfig {
  onPrevious?: () => void | Promise<void>;
  disabled?: boolean;
  label?: string;
  className?: string; // Custom className for the button
  bgColor?: string; // Background color (e.g., '#E0E0E0' or 'bg-gray-200')
  textColor?: string; // Text color (e.g., '#BDBDBD' or 'text-gray-500')
}

export interface RegistrationContextType {
  currentStep: number;
  completedSteps: number[];
  formData: RegistrationFormData;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  nextStep: () => void;
  prevStep: () => void | Promise<void>;
  setStep: (step: number) => void;
  markStepComplete: (step: number) => void;
  updateFormData: (data: Partial<RegistrationFormData>) => void;
  previousButtonConfig: PreviousButtonConfig | null;
  setPreviousButtonConfig: (config: PreviousButtonConfig | null) => void;
}

const RegistrationContext = createContext<RegistrationContextType | undefined>(undefined);

export const RegistrationProvider = ({ children }: { children: ReactNode }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [formData, setFormData] = useState<RegistrationFormData>({});
  const [isLoading, setIsLoading] = useState(false);
  const [previousButtonConfig, setPreviousButtonConfig] = useState<PreviousButtonConfig | null>(null);
  const previousStepRef = useRef(currentStep);

  // Track step changes to clear previous button config when step changes
  useEffect(() => {
    if (previousStepRef.current !== currentStep) {
      // Clear previous button config when step changes (unless it's set by the new step)
      previousStepRef.current = currentStep;
    }
  }, [currentStep]);

  const nextStep = useCallback(() => {
    setCurrentStep((prev) => Math.min(prev + 1, 6));
  }, []);

  const prevStep = useCallback(async () => {
    // If there's a custom handler, use it; otherwise use default behavior
    if (previousButtonConfig?.onPrevious) {
      await previousButtonConfig.onPrevious();
    } else {
      setCurrentStep((prev) => Math.max(prev - 1, 1));
    }
  }, [previousButtonConfig]);

  const setStep = useCallback((step: number) => {
    setCurrentStep(Math.max(1, Math.min(step, 6)));
  }, []);

  const markStepComplete = useCallback((step: number) => {
    setCompletedSteps((prev) => {
      if (!prev.includes(step)) {
        return [...prev, step];
      }
      return prev;
    });
  }, []);

  const updateFormData = useCallback((data: Partial<RegistrationFormData>) => {
    setFormData((prev) => ({
      ...prev,
      ...data,
    }));
  }, []);

  return (
    <RegistrationContext.Provider
      value={{
        currentStep,
        completedSteps,
        formData,
        isLoading,
        setIsLoading,
        nextStep,
        prevStep,
        setStep,
        markStepComplete,
        updateFormData,
        previousButtonConfig,
        setPreviousButtonConfig,
      }}
    >
      {children}
    </RegistrationContext.Provider>
  );
};

// Helper function to ensure type safety
function assertRegistrationContext(
  context: RegistrationContextType | undefined
): asserts context is RegistrationContextType {
  if (context === undefined) {
    throw new Error('useRegistration must be used within a RegistrationProvider');
  }
}

// eslint-disable-next-line react-refresh/only-export-components
export const useRegistration = (): RegistrationContextType => {
  const context = useContext(RegistrationContext);
  assertRegistrationContext(context);
  return context;
};

