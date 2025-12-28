import { z } from 'zod';
import { Stack } from '@fluentui/react';
import { Controller } from 'react-hook-form';
import { useRegistrationForm } from '../hooks/useRegistrationForm';
import { StepLayout } from '../components/StepLayout';
import { getStringValue } from '../utils/registrationHelpers';
import { STACK_TOKENS } from '../utils/registrationConstants';
import { FormRowContainer, FormRow, SelectField } from '../components';
import { FormField } from '../components/FormField';
import { Input } from '@shared/components';
import { useRegistration } from '@/contexts/RegistrationContext';
import { useEffect, useState } from 'react';
import { scholarshipApplication, dropdownOptions } from '@/services/scholarship.service';
import { useToast } from '@/components/ui/toast';

/**
 * Verhoeff checksum validation for AADHAAR ID
 * BRD Section 6.2.2: AADHAAR Validation Logic
 * - Length check: Must be exactly 12 digits
 * - Character check: Only numeric characters (0-9) allowed
 * - First digit check: Cannot start with 0 or 1
 * - Verhoeff checksum: Mathematical validation of the complete number
 * - Uniqueness check: No duplicate AADHAAR numbers across submitted applications (handled by API)
 */
function verhoeffCheck(aadhaar: string): boolean {
    if (aadhaar.length !== 12) return false;

    // BRD Section 6.2.2: First digit check - Cannot start with 0 or 1
    const firstDigit = parseInt(aadhaar[0], 10);
    if (firstDigit === 0 || firstDigit === 1) {
        return false;
    }

    const d = [
        [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
        [1, 2, 3, 4, 0, 6, 7, 8, 9, 5],
        [2, 3, 4, 0, 1, 7, 8, 9, 5, 6],
        [3, 4, 0, 1, 2, 8, 9, 5, 6, 7],
        [4, 0, 1, 2, 3, 9, 5, 6, 7, 8],
        [5, 9, 8, 7, 6, 0, 4, 3, 2, 1],
        [6, 5, 9, 8, 7, 1, 0, 4, 3, 2],
        [7, 6, 5, 9, 8, 2, 1, 0, 4, 3],
        [8, 7, 6, 5, 9, 3, 2, 1, 0, 4],
        [9, 8, 7, 6, 5, 4, 3, 2, 1, 0],
    ];

    const p = [
        [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
        [1, 5, 7, 6, 2, 8, 3, 0, 9, 4],
        [5, 8, 0, 3, 7, 9, 6, 1, 4, 2],
        [8, 9, 1, 6, 0, 4, 3, 5, 2, 7],
        [9, 4, 5, 3, 1, 2, 6, 8, 7, 0],
        [4, 2, 8, 6, 5, 7, 3, 9, 0, 1],
        [2, 7, 9, 3, 8, 0, 6, 4, 1, 5],
        [7, 0, 4, 6, 9, 1, 3, 2, 5, 8],
    ];

    let c = 0;
    const digits = aadhaar.split('').reverse().map(Number);

    for (let i = 0; i < digits.length; i++) {
        c = d[c][p[i % 8][digits[i]]];

    }

    return c === 0;
}

// --- Validation Schema ---
// Sample AADHAAR ID for testing: 123456789012 (passes Verhoeff checksum validation)
const identitySchema = z
    .object({
        applicantType: z.string().min(1, 'Please select an applicant category'),
        // Aadhaar Number: Must contain numeric characters only
        aadhaarId: z
            .string()
            .min(12, 'AADHAAR ID must be exactly 12 digits')
            .max(12, 'AADHAAR ID must be exactly 12 digits')
            .regex(/^\d+$/, 'AADHAAR ID must contain only numeric characters')
            .refine(
                (val) => {
                    // BRD Section 6.2.2: First digit check - Cannot start with 0 or 1
                    if (val.length > 0) {
                        const firstDigit = parseInt(val[0], 10);
                        if (firstDigit === 0 || firstDigit === 1) {
                            return false;
                        }
                    }
                    return true;
                },
                {
                    message: 'AADHAAR ID cannot start with 0 or 1. Please enter a valid AADHAAR number.',
                }
            )
            .refine(
                (val) => verhoeffCheck(val),
                {
                    message: 'AADHAAR ID failed Verhoeff checksum validation. Please enter a valid AADHAAR number.',
                }
            ),
        // PAN is optional - only validate format if provided
        // Sample PAN ID for testing: ABCDE1234F
        // PAN Number: Must follow the format 5 letters + 4 numbers + 1 letter; input is case-insensitive but will be stored in uppercase
        panId: z.string().optional(),
    })
    .refine(
        (data) => {
            if (!data.panId || data.panId.trim() === '') return true; // Optional, empty is valid
            const trimmed = data.panId.trim().toUpperCase();
            return trimmed.length === 10 && /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(trimmed);
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

const IdentityDetails = () => {
    const { updateFormData } = useRegistration();
    const [scholarshipYearId, setScholarshipYearId] = useState<number | null>(null);
    const [applicantOptions, setApplicantOptions] = useState<{ value: string; label: string }[]>([]);
    const [aadhaarValidationStatus, setAadhaarValidationStatus] = useState<{
        isValidating: boolean;
        isUnique: boolean | null;
        error: string | null;
    }>({ isValidating: false, isUnique: null, error: null });
    const { error: showError } = useToast();

    // Fetch applicant categories on mount
    useEffect(() => {
        const loadApplicantCategories = async () => {
            try {
                const categories = await dropdownOptions.getApplicantCategories();
                setApplicantOptions(categories);
            } catch (err) {
                console.error('Error loading applicant categories:', err);
                // Fallback to default options
                setApplicantOptions([
                    { value: 'School', label: 'I am a School Student seeking Scholarship' },
                    { value: 'College', label: 'I am a College Student seeking Scholarship' },
                    { value: 'Research', label: 'I am a Research Scholar seeking Scholarship' },
                    { value: 'Medical', label: 'I am a Medical Student seeking Scholarship' },
                ]);
            }
        };
        void loadApplicantCategories();
    }, []);

    // Fetch scholarship year on mount
    useEffect(() => {
        const fetchScholarshipYear = async () => {
            try {
                const yearData = await scholarshipApplication.getScholarshipYear();
                const firstYear = Array.isArray(yearData) ? yearData[0] : yearData;
                const yearId = firstYear && typeof firstYear === 'object' && 'ScholarshipYear_Id' in firstYear
                    ? (firstYear as { ScholarshipYear_Id: number }).ScholarshipYear_Id
                    : null;
                if (yearId) {
                    setScholarshipYearId(yearId);
                    updateFormData({ scholarshipYearId: yearId });
                }
            } catch (err) {
                console.error('Error fetching scholarship year:', err);
                showError('Error', 'Failed to load scholarship year. Please refresh the page.');
            }
        };
        void fetchScholarshipYear();
    }, [updateFormData, showError]);

    const { form, onSubmit } = useRegistrationForm({
        schema: identitySchema,
        stepNumber: 1,
        defaultValues: (formData) => ({
            applicantType: getStringValue(formData, 'applicantType', ''),
            aadhaarId: getStringValue(formData, 'aadhaarId'),
            panId: getStringValue(formData, 'panId'),
        }),
        async onValidate(data) {
            // BRD Section 6.2.2: Validate Aadhaar ID with API (uniqueness check)
            if (data.aadhaarId && scholarshipYearId) {
                try {
                    const result = await scholarshipApplication.checkAadhaarId(data.aadhaarId, scholarshipYearId) as { exists?: boolean; count?: number } | undefined;
                    // Backend returns { exists: boolean, count: number }
                    if (result && typeof result === 'object' && 'exists' in result && result.exists === true) {
                        const errorMessage = 'This AADHAAR ID has already been used for an application in this scholarship year. Please use a different AADHAAR ID.';
                        form.setError('aadhaarId', { type: 'manual', message: errorMessage });
                        throw new Error(errorMessage);
                    }
                } catch (err: unknown) {
                    // If it's already our custom error, re-throw it
                    if (err instanceof Error && err.message.includes('AADHAAR ID')) {
                        throw err;
                    }
                    // Otherwise, it's an API error
                    const errorMessage = err instanceof Error ? err.message : 'Failed to verify AADHAAR ID uniqueness. Please try again.';
                    form.setError('aadhaarId', { type: 'manual', message: errorMessage });
                    throw new Error(errorMessage);
                }
            }

            // Validate PAN ID with API if provided
            if (data.panId?.trim() && scholarshipYearId) {
                try {
                    const result = await scholarshipApplication.checkPanId(data.panId.toUpperCase(), scholarshipYearId) as { exists?: boolean; count?: number } | undefined;
                    // Backend returns { exists: boolean, count: number }
                    if (result && typeof result === 'object' && 'exists' in result && result.exists === true) {
                        const errorMessage = 'This PAN ID has already been used for an application in this scholarship year. Please use a different PAN ID.';
                        form.setError('panId', { type: 'manual', message: errorMessage });
                        throw new Error(errorMessage);
                    }
                } catch (err: unknown) {
                    // If it's already our custom error, re-throw it
                    if (err instanceof Error && err.message.includes('PAN ID')) {
                        throw err;
                    }
                    // Otherwise, it's an API error
                    const errorMessage = err instanceof Error ? err.message : 'Failed to verify PAN ID uniqueness. Please try again.';
                    form.setError('panId', { type: 'manual', message: errorMessage });
                    throw new Error(errorMessage);
                }
            }
        },
    });

    const { control, handleSubmit, formState: { errors }, watch } = form;
    const aadhaarValue = watch('aadhaarId');

    // Debounced uniqueness check for AADHAAR ID
    useEffect(() => {
        // Reset validation status when AADHAAR ID changes
        setAadhaarValidationStatus({ isValidating: false, isUnique: null, error: null });

        // Only check uniqueness if:
        // 1. AADHAAR ID is exactly 12 digits
        // 2. Passes all format validations (numeric, first digit, Verhoeff)
        // 3. Scholarship year ID is available
        if (
            aadhaarValue?.length === 12 &&
            /^\d+$/.test(aadhaarValue) &&
            parseInt(aadhaarValue[0] ?? '0', 10) !== 0 &&
            parseInt(aadhaarValue[0] ?? '0', 10) !== 1 &&
            verhoeffCheck(aadhaarValue) &&
            scholarshipYearId
        ) {
            // Debounce the API call
            const timeoutId = setTimeout(() => {
                void (async () => {
                    setAadhaarValidationStatus({ isValidating: true, isUnique: null, error: null });
                    try {
                        const result = await scholarshipApplication.checkAadhaarId(aadhaarValue, scholarshipYearId) as { exists?: boolean; count?: number } | undefined;
                        const exists = result && typeof result === 'object' && 'exists' in result && result.exists === true;
                        if (exists) {
                            setAadhaarValidationStatus({
                                isValidating: false,
                                isUnique: false,
                                error: 'This AADHAAR ID has already been used for an application in this scholarship year.',
                            });
                            // Set form error
                            form.setError('aadhaarId', {
                                type: 'manual',
                                message: 'This AADHAAR ID has already been used for an application in this scholarship year.',
                            });
                        } else {
                            setAadhaarValidationStatus({ isValidating: false, isUnique: true, error: null });
                            // Clear any previous errors
                            form.clearErrors('aadhaarId');
                        }
                    } catch (err) {
                        setAadhaarValidationStatus({
                            isValidating: false,
                            isUnique: null,
                            error: err instanceof Error ? err.message : 'Failed to verify AADHAAR ID uniqueness.',
                        });
                    }
                })();
            }, 500); // 500ms debounce

            return () => clearTimeout(timeoutId);
        }
    }, [aadhaarValue, scholarshipYearId, form]);

    return (
        <StepLayout
            title="Identity Verification Details"
            subtitle="Fill in the Required ID Numbers for Authentication"
        >
            <form className="w-full h-full flex flex-col" onSubmit={(e) => void handleSubmit(onSubmit)(e)} id="current-step-form">
                <Stack tokens={STACK_TOKENS}>
                    {/* Applicant Category Dropdown */}
                    <SelectField
                        name="applicantType"
                        control={control}
                        errors={errors}
                        label="What describes you better"
                        required
                        options={applicantOptions}
                        placeholder="Select applicant category"
                    />

                    {/* IDs Row (Side by Side) */}
                    <FormRowContainer>
                        <FormRow>
                            <Controller
                                name="aadhaarId"
                                control={control}
                                render={({ field }) => {
                                    // Real-time validation feedback
                                    const currentValue = field.value ?? '';
                                    let validationError: string | null = null;

                                    // BRD Section 6.2.2: Length check - Must be exactly 12 digits
                                    if (currentValue.length > 0 && currentValue.length !== 12) {
                                        validationError = 'AADHAAR ID must be exactly 12 digits';
                                    }
                                    // BRD Section 6.2.2: Character check - Only numeric characters (0-9) allowed
                                    else if (currentValue.length > 0 && !/^\d+$/.test(currentValue)) {
                                        validationError = 'AADHAAR ID must contain only numeric characters (0-9)';
                                    }
                                    // BRD Section 6.2.2: First digit check - Cannot start with 0 or 1
                                    else if (currentValue.length > 0) {
                                        const firstDigit = parseInt(currentValue[0], 10);
                                        if (firstDigit === 0 || firstDigit === 1) {
                                            validationError = 'AADHAAR ID cannot start with 0 or 1. Please enter a valid AADHAAR number.';
                                        }
                                        // BRD Section 6.2.2: Verhoeff checksum - Mathematical validation
                                        else if (currentValue.length === 12 && !verhoeffCheck(currentValue)) {
                                            validationError = 'AADHAAR ID failed Verhoeff checksum validation. Please enter a valid AADHAAR number.';
                                        }
                                    }

                                    // Combine validation errors (schema errors take precedence)
                                    const errorMessage = errors.aadhaarId?.message ?? validationError ?? aadhaarValidationStatus.error ?? null;
                                    const showError = Boolean(errorMessage);

                                    return (
                                        <FormField
                                            label="AADHAR ID (Candidate)"
                                            required
                                            error={errorMessage as string}
                                        >
                                            <Input
                                                {...field}
                                                value={field.value ?? ''}
                                                placeholder="Enter 12 digit AADHAAR number"
                                                errorMessage={errorMessage as string}
                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                    // BRD Section 6.2.2: Character check - Only numeric characters (0-9) allowed
                                                    const value = e.target.value;
                                                    const digitsOnly = value.replace(/\D/g, '');

                                                    // BRD Section 6.2.2: Length check - Must be exactly 12 digits
                                                    if (digitsOnly.length <= 12) {
                                                        field.onChange(digitsOnly);

                                                        // Trigger validation on change for immediate feedback
                                                        if (digitsOnly.length === 12) {
                                                            // Validate first digit and Verhoeff immediately
                                                            const firstDigit = parseInt(digitsOnly[0], 10);
                                                            if (firstDigit === 0 || firstDigit === 1) {
                                                                form.setError('aadhaarId', {
                                                                    type: 'manual',
                                                                    message: 'AADHAAR ID cannot start with 0 or 1. Please enter a valid AADHAAR number.',
                                                                });
                                                            } else if (!verhoeffCheck(digitsOnly)) {
                                                                form.setError('aadhaarId', {
                                                                    type: 'manual',
                                                                    message: 'AADHAAR ID failed Verhoeff checksum validation. Please enter a valid AADHAAR number.',
                                                                });
                                                            } else {
                                                                // Clear format errors if valid, but keep uniqueness check pending
                                                                form.clearErrors('aadhaarId');
                                                            }
                                                        } else {
                                                            // Clear errors if not 12 digits yet (user is still typing)
                                                            if (digitsOnly.length < 12) {
                                                                form.clearErrors('aadhaarId');
                                                            }
                                                        }

                                                        // Reset uniqueness validation status when user types
                                                        if (digitsOnly.length !== 12 || digitsOnly !== aadhaarValue) {
                                                            setAadhaarValidationStatus({ isValidating: false, isUnique: null, error: null });
                                                        }
                                                    }
                                                }}
                                                onBlur={field.onBlur}
                                            />
                                            {/* Real-time validation feedback */}
                                            {field.value?.length === 12 && !showError && (
                                                <div className="text-xs mt-1">
                                                    {aadhaarValidationStatus.isValidating ? (
                                                        <span className="text-blue-600">Verifying uniqueness...</span>
                                                    ) : aadhaarValidationStatus.isUnique === true ? (
                                                        <span className="text-green-600">✓ AADHAAR ID is valid and available</span>
                                                    ) : null}
                                                </div>
                                            )}
                                        </FormField>
                                    );
                                }}
                            />
                        </FormRow>
                        <FormRow>
                            <Controller
                                name="panId"
                                control={control}
                                render={({ field }) => (
                                    <FormField label="PAN ID (Candidate)" required={false} error={errors.panId?.message as string}>
                                        <Input
                                            {...field}
                                            value={field.value ?? ''}
                                            placeholder="Enter PAN number (Optional)"
                                            errorMessage={errors.panId?.message as string}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                // PAN Number: Must follow the format 5 letters + 4 numbers + 1 letter; input is case-insensitive but will be stored in uppercase
                                                const value = e.target.value;
                                                const upperValue = value.toUpperCase().replace(/[^A-Z0-9]/g, '');
                                                if (upperValue.length <= 10) {
                                                    field.onChange(upperValue);
                                                }
                                            }}
                                        />
                                    </FormField>
                                )}
                            />
                        </FormRow>
                    </FormRowContainer>
                </Stack>
            </form>
        </StepLayout>
    );
};

export default IdentityDetails;
