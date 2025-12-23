import { Control, FieldErrors } from 'react-hook-form';
import { Stack } from '@fluentui/react';
import { InputField, SelectField, FormRowContainer } from './FormFields';
import { FormRow } from './FormField';
import { STACK_TOKENS, ROW_TOKENS, SECTION_HEADER_CLASS } from '../utils/registrationConstants';

interface FamilyMemberSectionProps {
    title: string;
    prefix: 'father' | 'mother' | 'guardian';
    control: Control<any>;
    errors: FieldErrors<any>;
    occupationOptions: Array<{ value: string; label: string }>;
    incomeOptions: Array<{ value: string; label: string }>;
    isOptional?: boolean;
    className?: string;
}

/**
 * Reusable component for family member details section
 * Handles Father, Mother, and Guardian sections with consistent layout
 */
export const FamilyMemberSection = ({
    title,
    prefix,
    control,
    errors,
    occupationOptions,
    incomeOptions,
    isOptional = false,
}: FamilyMemberSectionProps) => {
    return (
        <Stack tokens={STACK_TOKENS}>
            <div className={SECTION_HEADER_CLASS}>{title}</div>
            <Stack tokens={ROW_TOKENS}>
                <FormRowContainer>
                    <FormRow>
                        <InputField
                            name={`${prefix}Name`}
                            control={control}
                            errors={errors}
                            label="Name"
                            required={!isOptional}
                            placeholder={`Enter ${prefix} name`}
                        />
                    </FormRow>
                    <FormRow>
                        <SelectField
                            name={`${prefix}Occupation`}
                            control={control}
                            errors={errors}
                            label="Occupation"
                            required={!isOptional}
                            options={occupationOptions}
                            placeholder="Select"
                        />
                    </FormRow>
                </FormRowContainer>

                <FormRowContainer>
                    <FormRow>
                        <InputField
                            name={`${prefix}Designation`}
                            control={control}
                            errors={errors}
                            label="Designation"
                            placeholder="Enter designation"
                        />
                    </FormRow>
                    <FormRow>
                        <InputField
                            name={`${prefix}Organization`}
                            control={control}
                            errors={errors}
                            label="Organization Name"
                            placeholder="Enter organization name"
                        />
                    </FormRow>
                </FormRowContainer>

                <FormRowContainer>
                    <FormRow>
                        <SelectField
                            name={`${prefix}Income`}
                            control={control}
                            errors={errors}
                            label="Annual Income"
                            required={!isOptional}
                            options={incomeOptions}
                            placeholder="Select"
                        />
                    </FormRow>
                </FormRowContainer>
            </Stack>
        </Stack>
    );
};

