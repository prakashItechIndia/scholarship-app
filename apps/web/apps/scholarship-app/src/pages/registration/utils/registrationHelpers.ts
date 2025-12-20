import { RegistrationFormData } from '@/contexts/RegistrationContext';

/**
 * Safely get string value from formData
 */
export const getStringValue = (formData: RegistrationFormData, key: string, defaultValue: string = ''): string => {
    const value = formData[key];
    return typeof value === 'string' ? value : defaultValue;
};

/**
 * Safely get Date value from formData
 */
export const getDateValue = (formData: RegistrationFormData, key: string): Date | undefined => {
    const value = formData[key];
    if (!value) return undefined;
    if (value instanceof Date) return value;
    if (typeof value === 'string') {
        const date = new Date(value);
        return isNaN(date.getTime()) ? undefined : date;
    }
    return undefined;
};

/**
 * Safely get File[] from formData
 */
export const getFileArrayValue = (formData: RegistrationFormData, key: string): File[] => {
    const value = formData[key];
    if (Array.isArray(value) && value.every(item => item instanceof File)) {
        return value;
    }
    return [];
};

/**
 * Get default values object from formData for a set of string keys
 */
export const getDefaultValues = <T extends Record<string, string>>(
    formData: RegistrationFormData,
    keys: (keyof T)[],
    defaults?: Partial<T>
): Partial<T> => {
    const values: Partial<T> = {};
    keys.forEach(key => {
        const formKey = key as string;
        values[key] = (getStringValue(formData, formKey, defaults?.[key] as string) || defaults?.[key]) as T[keyof T];
    });
    return values;
};

