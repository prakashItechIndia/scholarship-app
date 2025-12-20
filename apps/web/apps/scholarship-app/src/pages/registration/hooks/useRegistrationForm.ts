import { useEffect } from 'react';
import { useForm, UseFormReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRegistration } from '@/contexts/RegistrationContext';
import { RegistrationFormData } from '@/contexts/RegistrationContext';

interface UseRegistrationFormOptions<T extends z.ZodTypeAny> {
    schema: T;
    stepNumber: number;
    defaultValues: (formData: RegistrationFormData) => z.infer<T>;
}

interface UseRegistrationFormReturn<T extends z.ZodTypeAny> {
    form: UseFormReturn<z.infer<T>>;
    onSubmit: (data: z.infer<T>) => Promise<void>;
}

/**
 * Custom hook for registration form steps that handles:
 * - Form initialization with zod validation
 * - Saving form data to context on unmount
 * - Form submission with loading state
 * - Moving to next step after successful submission
 */
export const useRegistrationForm = <T extends z.ZodTypeAny>({
    schema,
    stepNumber,
    defaultValues,
}: UseRegistrationFormOptions<T>): UseRegistrationFormReturn<T> => {
    const { formData, updateFormData, nextStep, markStepComplete, setIsLoading } = useRegistration();

    const form = useForm<z.infer<T>>({
        resolver: zodResolver(schema),
        defaultValues: defaultValues(formData),
    });

    // Save data to context on unmount (navigation)
    useEffect(() => {
        return () => {
            updateFormData(form.getValues());
        };
    }, [updateFormData, form]);

    const onSubmit = async (data: z.infer<T>) => {
        setIsLoading(true);
        try {
            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 2000));
            // Convert Date objects to ISO strings for storage
            const serializedData = Object.entries(data).reduce((acc, [key, value]) => {
                acc[key] = value instanceof Date ? value.toISOString() : value;
                return acc;
            }, {} as any);
            updateFormData(serializedData);
            markStepComplete(stepNumber);
            nextStep();
        } finally {
            setIsLoading(false);
        }
    };

    return { form, onSubmit };
};

