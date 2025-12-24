import { z } from 'zod';
import { Stack } from '@fluentui/react';
import { useRegistrationForm } from '../hooks/useRegistrationForm';
import { StepLayout } from '../components/StepLayout';
import { getStringValue } from '../utils/registrationHelpers';
import { STACK_TOKENS } from '../utils/registrationConstants';
import { FormRowContainer, FormRow, InputField, SelectField } from '../components';
import { useRegistration } from '@/contexts/RegistrationContext';
import { useEffect, useState } from 'react';
import { scholarshipApplication, dropdownOptions } from '@/services/scholarship.service';
import { useToast } from '@/components/ui/toast';

/**
 * Verhoeff checksum validation for AADHAAR ID
 * Verhoeff algorithm is used to validate AADHAAR numbers
 */
function verhoeffCheck(aadhaar: string): boolean {
    if (aadhaar.length !== 12) return false;
    
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
    const myArray = aadhaar.split('').reverse();
    
    for (let i = 0; i < myArray.length; i++) {
        c = d[c][p[((i + 1) % 8)][parseInt(myArray[i], 10)]];
    }
    
    return c === 0;
}

// --- Validation Schema ---
// Sample AADHAAR ID for testing: 123456789012 (passes Verhoeff checksum validation)
const identitySchema = z
    .object({
        applicantType: z.string().min(1, 'Please select an applicant category'),
        aadhaarId: z
            .string()
            .min(12, 'AADHAAR ID must be exactly 12 digits')
            .max(12, 'AADHAAR ID must be exactly 12 digits')
            .regex(/^\d+$/, 'AADHAAR ID must contain only digits')
            .refine(
                (val) => verhoeffCheck(val),
                {
                    message: 'AADHAAR ID failed Verhoeff checksum validation. Please enter a valid AADHAAR number.',
                }
            ),
        // PAN is optional - only validate format if provided
        // Sample PAN ID for testing: ABCDE1234F
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

const IdentityDetails = () => {
    const { formData, updateFormData } = useRegistration();
    const [scholarshipYearId, setScholarshipYearId] = useState<number | null>(null);
    const [applicantOptions, setApplicantOptions] = useState<{ value: string; label: string }[]>([]);
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
                    { value: '', label: '--Select Applicant Category--' },
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
            // Validate Aadhaar ID with API
            if (data.aadhaarId && scholarshipYearId) {
                try {
                    await scholarshipApplication.checkAadhaarId(data.aadhaarId, scholarshipYearId);
                } catch (err: unknown) {
                    const errorMessage = err instanceof Error ? err.message : 'Aadhaar ID already exists';
                    form.setError('aadhaarId', { type: 'manual', message: errorMessage });
                    throw new Error(errorMessage);
                }
            }
            
            // Validate PAN ID with API if provided
            if (data.panId?.trim() && scholarshipYearId) {
                try {
                    await scholarshipApplication.checkPanId(data.panId.toUpperCase(), scholarshipYearId);
                } catch (err: unknown) {
                    const errorMessage = err instanceof Error ? err.message : 'PAN ID already exists';
                    form.setError('panId', { type: 'manual', message: errorMessage });
                    throw new Error(errorMessage);
                }
            }
        },
    });

    const { control, handleSubmit, formState: { errors } } = form;

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
                            <InputField
                                    name="aadhaarId"
                                    control={control}
                                errors={errors}
                                label="AADHAAR Number"
                                required
                                                placeholder="Enter 12 digit AADHAAR number"
                                            />
                        </FormRow>
                        <FormRow>
                            <InputField
                                    name="panId"
                                    control={control}
                                errors={errors}
                                label="PAN Number"
                                required={false}
                                placeholder="Enter PAN number (Optional)"
                                            />
                        </FormRow>
                    </FormRowContainer>
                    </Stack>
                </form>
        </StepLayout>
    );
};

export default IdentityDetails;
