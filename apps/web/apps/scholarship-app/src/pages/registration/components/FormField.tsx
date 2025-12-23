import { ReactNode } from 'react';
import { Stack } from '@fluentui/react';
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
export const FormField = ({ label, required = false, children, className }: FormFieldProps) => {
    return (
        <Stack tokens={{ childrenGap: 4 }} className={className} styles={{ root: { alignItems: 'flex-start' } }}>
            <div style={{ minHeight: '20px', display: 'flex', alignItems: 'center' }}>
                <Label required={required} className="!text-[#242424] !text-[13px] !mb-0 !font-medium">{label}</Label>
            </div>
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
        <div className={`col-span-1 md:col-span-6 ${className || FORM_FIELD_WRAPPER_CLASS}`}>
            {children}
        </div>
    );
};

