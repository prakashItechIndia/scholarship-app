import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
} from 'react';

// Define a more specific type for form data
export type RegistrationFormData = Record<string, string | number | Date | File[] | undefined | null>;

export interface RegistrationContextType {
  currentStep: number;
  completedSteps: number[];
  formData: RegistrationFormData;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  nextStep: () => void;
  prevStep: () => void;
  markStepComplete: (step: number) => void;
  updateFormData: (data: Partial<RegistrationFormData>) => void;
}

const RegistrationContext = createContext<RegistrationContextType | undefined>(
  undefined,
) as React.Context<RegistrationContextType | undefined>;

export const RegistrationProvider = ({ children }: { children: ReactNode }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [formData, setFormData] = useState<RegistrationFormData>({});
  const [isLoading, setIsLoading] = useState(false);

  const nextStep = useCallback(() => {
    setCurrentStep((prev) => Math.min(prev + 1, 6));
  }, []);

  const prevStep = useCallback(() => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
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
        markStepComplete,
        updateFormData,
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

