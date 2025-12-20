import { ReactNode } from 'react';
import { Stack, StackItem } from '@fluentui/react';
import { Label } from '@shared/components';
import { FORM_FIELD_WRAPPER_CLASS } from '../utils/registrationConstants';

interface FormFieldProps {
    label: string;
    required?: boolean;
    error?: string;
    children: ReactNode;
    className?: string;
}

/**
 * Reusable form field wrapper component
 * Provides consistent label and spacing
 * Note: Error messages are handled within the child components (Input, Select, etc.)
 */
export const FormField = ({ label, required = false, error, children, className }: FormFieldProps) => {
    return (
        <Stack>
            <Label required={required}>{label}</Label>
            {children}
        </Stack>
    );
};

interface FormRowProps {
    children: ReactNode;
    className?: string;
}

/**
 * Reusable form row component for horizontal layouts
 */
export const FormRow = ({ children, className }: FormRowProps) => {
    return (
        <Stack.Item grow={1} className={className || FORM_FIELD_WRAPPER_CLASS}>
            {children}
        </Stack.Item>
    );
};

