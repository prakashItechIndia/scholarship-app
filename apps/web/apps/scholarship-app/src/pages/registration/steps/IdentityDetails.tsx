import { z } from 'zod';
import { Stack, IDropdownOption } from '@fluentui/react';
import { useRegistrationForm } from '../hooks/useRegistrationForm';
import { StepLayout } from '../components/StepLayout';
import { getStringValue } from '../utils/registrationHelpers';
import { STACK_TOKENS } from '../utils/registrationConstants';
import { DropdownField, TextInputField, FormRowContainer, FormRow } from '../components';

// --- Validation Schema ---
const identitySchema = z
    .object({
    applicantType: z.string().min(1, 'Please select an option'),
    aadhaarId: z.string().min(12, 'AADHAAR ID must be 12 digits').max(12, 'AADHAAR ID must be 12 digits').regex(/^\d+$/, 'AADHAAR ID must contain only digits'),
        // PAN is optional per BRD Section 6.2.1 - only validate format if provided
        panId: z.string().optional(),
    })
    .refine(
        (data) => {
            if (!data.panId || data.panId.trim() === '') return true; // Optional, empty is valid
            const trimmed = data.panId.trim();
            return trimmed.length === 10 && /^[A-Za-z]{5}[0-9]{4}[A-Za-z]{1}$/.test(trimmed);
        },
        {
            message: 'PAN ID format is invalid (e.g., ABCDE1234F). Format: 5 letters + 4 numbers + 1 letter',
            path: ['panId'],
        }
    )
    .transform((data) => ({
        ...data,
        panId: data.panId?.trim() ? data.panId.trim().toUpperCase() : data.panId,
    }));

// --- Constants ---
const APPLICANT_OPTIONS: IDropdownOption[] = [
    { key: 'research_scholar', text: 'I am a Research Scholar seeking Scholarship' },
    { key: 'student', text: 'I am a College Student seeking Scholarship' },
    { key: 'student', text: 'I am a School Student seeking Scholarship' },
    { key: 'medical', text: 'I am a Medical Student seeking Scholarship' },

];

const IdentityDetails = () => {
    const { form, onSubmit } = useRegistrationForm({
        schema: identitySchema,
        stepNumber: 1,
        defaultValues: (formData) => ({
            applicantType: getStringValue(formData, 'applicantType', 'research_scholar'),
            aadhaarId: getStringValue(formData, 'aadhaarId'),
            panId: getStringValue(formData, 'panId'),
        }),
    });

    const { control, handleSubmit, formState: { errors } } = form;

    return (
        <StepLayout
            title="Identity Verification Details"
            subtitle="Fill in the Required ID Numbers for Authentication"
        >
            <form className="w-full h-full flex flex-col" onSubmit={(e) => void handleSubmit(onSubmit)(e)} id="current-step-form">
                <Stack tokens={STACK_TOKENS}>
                        {/* Applicant Type Dropdown */}
                    <DropdownField
                            name="applicantType"
                            control={control}
                        errors={errors}
                        label="What describes you better"
                        required
                        options={APPLICANT_OPTIONS}
                                        placeholder="Select an option"
                        />

                        {/* IDs Row (Side by Side) */}
                    <FormRowContainer>
                        <FormRow>
                            <TextInputField
                                    name="aadhaarId"
                                    control={control}
                                errors={errors}
                                label="AADHAAR ID (Candidate)"
                                required
                                                placeholder="Enter 12 Digit Aadhar Number"
                                            />
                        </FormRow>
                        <FormRow>
                            <TextInputField
                                    name="panId"
                                    control={control}
                                errors={errors}
                                label="PAN ID (Candidate)"
                                required={false}
                                placeholder="Enter Pan Card Number (Optional)"
                                            />
                        </FormRow>
                    </FormRowContainer>
                    </Stack>
                </form>
        </StepLayout>
    );
};

export default IdentityDetails;
