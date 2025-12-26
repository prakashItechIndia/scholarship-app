import { Control, FieldErrors, Controller } from 'react-hook-form';
import { Stack, TextField, Dropdown, IDropdownOption, ChoiceGroup, IChoiceGroupOption } from '@fluentui/react';
import { Input, Select, DatePicker, Label } from '@shared/components';
import { FormField } from './FormField';
import { getFieldStyles } from '../utils/registrationConstants';
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
    options: { value: string; label: string }[];
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
                        value={field.value}
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

export const ChoiceGroupField = ({ name, control, errors, label, required, options }: ChoiceGroupFieldProps) => {
    const errorMessage = errors[name]?.message as string;
    return (
        <FormField label={label} required={required} error={errorMessage}>
            <Controller
                name={name}
                control={control}
                render={({ field }) => (
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
}

export const FormRowContainer = ({ children }: FormRowContainerProps) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
            {children}
        </div>
    );
};

/**
 * IFSC Code Field with Lookup Link
 */
interface IfscCodeFieldProps extends BaseFormFieldProps {
    onLookupClick?: () => void;
}

export const IfscCodeField = ({ name, control, errors, label, required, placeholder, onLookupClick }: IfscCodeFieldProps) => {
    return (
        <div className="w-full">
        <Controller
            name={name}
            control={control}
                render={({ field }) => (
                <Stack tokens={{ childrenGap: 4 }} className="w-full" styles={{ root: { alignItems: 'flex-start' } }}>
                    {/* Label and Lookup Link on same line with justify-between */}
                    <div className="flex justify-between items-center w-full" style={{ minHeight: '20px' }}>
                        <Label required={required} className="!text-[#242424] !text-[13px] !mb-0 !font-medium">{label}</Label>
                        <span 
                            className="text-red-600 dark:text-red-400 text-xs cursor-pointer font-medium hover:underline"
                            onClick={onLookupClick}
                        >
                            (Lookup IFSC Code)
                        </span>
                    </div>
                        <div className="w-full">
                            <Input
                                {...field}
                                value={field.value ?? ''}
                                placeholder={placeholder}
                                errorMessage={errors[name]?.message as string}
                                className="w-full"
                                onChange={(_e: React.ChangeEvent<HTMLInputElement>, value?: string) => {
                                    // IFSC Code: Must be exactly 11 characters long and follow the format 4 letters + 0 + 6 alphanumeric characters
                                    // Convert to uppercase and only allow alphanumeric
                                    const upperValue = (value ?? '').toUpperCase().replace(/[^A-Z0-9]/g, '');
                                    if (upperValue.length <= 11) {
                                        field.onChange(upperValue);
                                    }
                                }}
                    />
                        </div>
                </Stack>
            )}
        />
        </div>
    );
};

/**
 * TextArea Field Component
 */
interface TextAreaFieldProps extends BaseFormFieldProps {
    rows?: number;
}

export const TextAreaField = ({ name, control, errors, label, required, placeholder, rows = 4 }: TextAreaFieldProps) => {
    return (
        <Controller
            name={name}
            control={control}
            render={({ field }) => (
                <FormField label={label} required={required} error={errors[name]?.message as string}>
                    <TextField
                        {...field}
                        multiline
                        rows={rows}
                        placeholder={placeholder}
                        errorMessage={errors[name]?.message as string}
                        styles={{
                            fieldGroup: {
                                minHeight: `${rows * 24}px`,
                            },
                        }}
                    />
                </FormField>
            )}
        />
    );
};

