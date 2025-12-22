import { Control, FieldErrors, Controller, ControllerRenderProps } from 'react-hook-form';
import { Stack, TextField, Dropdown, IDropdownOption, ChoiceGroup, IChoiceGroupOption } from '@fluentui/react';
import { Input, Select, DatePicker } from '@shared/components';
import { FormField, FormRow } from './FormField';
import { getFieldStyles, ROW_TOKENS } from '../utils/registrationConstants';
import { useThemeTokens } from '@/hooks/useThemeTokens';

interface BaseFormFieldProps {
    name: string;
    control: Control<any>;
    errors: FieldErrors<any>;
    label: string;
    required?: boolean;
    placeholder?: string;
}

/**
 * Text Input Field Component
 */
export const TextInputField = ({ name, control, errors, label, required, placeholder }: BaseFormFieldProps) => {
    const tokens = useThemeTokens();
    const fieldStyles = getFieldStyles(tokens);
    
    return (
        <Controller
            name={name}
            control={control}
            render={({ field }) => (
                <FormField label={label} required={required} error={errors[name]?.message as string}>
                    <TextField
                        {...field}
                        placeholder={placeholder}
                        errorMessage={errors[name]?.message as string}
                        styles={{ fieldGroup: fieldStyles.fieldGroup }}
                    />
                </FormField>
            )}
        />
    );
};

/**
 * Input Component Field (using shared Input component)
 */
export const InputField = ({ name, control, errors, label, required, placeholder }: BaseFormFieldProps) => {
    return (
        <Controller
            name={name}
            control={control}
            render={({ field }) => (
                <FormField label={label} required={required} error={errors[name]?.message as string}>
                    <Input
                        {...field}
                        value={field.value ?? ''}
                        placeholder={placeholder}
                        errorMessage={errors[name]?.message as string}
                    />
                </FormField>
            )}
        />
    );
};

/**
 * Dropdown Field Component
 */
interface DropdownFieldProps extends BaseFormFieldProps {
    options: IDropdownOption[];
}

export const DropdownField = ({ name, control, errors, label, required, options, placeholder }: DropdownFieldProps) => {
    const tokens = useThemeTokens();
    const fieldStyles = getFieldStyles(tokens);
    
    return (
        <Controller
            name={name}
            control={control}
            render={({ field }) => (
                <FormField label={label} required={required} error={errors[name]?.message as string}>
                    <Dropdown
                        selectedKey={field.value}
                        onChange={(_, option) => field.onChange(option?.key)}
                        placeholder={placeholder}
                        options={options}
                        errorMessage={errors[name]?.message as string}
                        className="w-full !text-[#242424] !text-[13px]"
                        styles={fieldStyles}
                    />
                </FormField>
            )}
        />
    );
};

/**
 * Select Field Component (using shared Select component)
 */
interface SelectFieldProps extends BaseFormFieldProps {
    options: Array<{ value: string; label: string }>;
}

export const SelectField = ({ name, control, errors, label, required, options, placeholder }: SelectFieldProps) => {
    return (
        <Controller
            name={name}
            control={control}
            render={({ field }) => (
                <FormField label={label} required={required} error={errors[name]?.message as string}>
                    <Select
                        placeholder={placeholder}
                        selectedKey={field.value}
                        onValueChange={field.onChange}
                        options={options}
                        errorMessage={errors[name]?.message as string}
                    />
                </FormField>
            )}
        />
    );
};

/**
 * DatePicker Field Component
 */
export const DatePickerField = ({ name, control, errors, label, required }: BaseFormFieldProps) => {
    return (
        <Controller
            name={name}
            control={control}
            render={({ field }) => (
                <FormField label={label} required={required} error={errors[name]?.message as string}>
                    <DatePicker
                        selectedDate={field.value}
                        onSelectDate={(date) => field.onChange(date)}
                        errorMessage={errors[name]?.message as string}
                    />
                </FormField>
            )}
        />
    );
};

/**
 * ChoiceGroup Field Component
 */
interface ChoiceGroupFieldProps extends BaseFormFieldProps {
    options: IChoiceGroupOption[];
    className?: string;
}

export const ChoiceGroupField = ({ name, control, errors, label, required, options, className }: ChoiceGroupFieldProps) => {
    const errorMessage = errors[name]?.message as string;
    return (
        <FormField label={label} required={required} error={errorMessage}>
            <Controller
                name={name}
                control={control}
                render={({ field }) => (
                    <>
                        <ChoiceGroup
                            selectedKey={field.value}
                            options={options}
                            onChange={(_, option) => field.onChange(option?.key)}
                            styles={{
                                flexContainer: {
                                    display: 'flex',
                                    flexDirection: 'row',
                                    gap: '24px',
                                },
                            }}
                        />
                        {errorMessage && <p className="text-red-600 dark:text-red-400 text-xs mt-1">{errorMessage}</p>}
                    </>
                )}
            />
        </FormField>
    );
};

/**
 * Form Row Container Component
 */
interface FormRowContainerProps {
    children: React.ReactNode;
    wrap?: boolean;
}

export const FormRowContainer = ({ children, wrap = true }: FormRowContainerProps) => {
    return (
        <Stack horizontal tokens={ROW_TOKENS} wrap={wrap}>
            {children}
        </Stack>
    );
};

/**
 * IFSC Code Field with Lookup Link
 */
interface IfscCodeFieldProps extends BaseFormFieldProps {
    onLookupClick?: () => void;
}

export const IfscCodeField = ({ name, control, errors, label, required, placeholder, onLookupClick }: IfscCodeFieldProps) => {
    const tokens = useThemeTokens();
    const fieldStyles = getFieldStyles(tokens);
    
    return (
        <Controller
            name={name}
            control={control}
            render={({ field }) => (
                <FormField label={label} required={required} error={errors[name]?.message as string}>
                    <div className="flex justify-end mb-1.5">
                        <span 
                            className="text-red-600 dark:text-red-400 text-xs cursor-pointer font-medium hover:underline"
                            onClick={onLookupClick}
                        >
                            (Lookup IFSC Code)
                        </span>
                    </div>
                    <TextField
                        {...field}
                        placeholder={placeholder}
                        errorMessage={errors[name]?.message as string}
                        styles={fieldStyles}
                    />
                </FormField>
            )}
        />
    );
};

