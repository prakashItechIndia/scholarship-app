import { z } from 'zod';
import { Stack } from '@fluentui/react';
import { useRegistrationForm } from '../hooks/useRegistrationForm';
import { StepLayout } from '../components/StepLayout';
import { getStringValue } from '../utils/registrationHelpers';
import { STACK_TOKENS } from '../utils/registrationConstants';
import { InputField, FormRowContainer, FormRow, FamilyMemberSection } from '../components';

// --- Validation Schema ---
const familySchema = z.object({
    // Applicant Info (Repeated/Confirmed here per design)
    fullName: z.string().min(1, 'Applicant Name is required'),
    studentId: z.string().optional(),

    // Father
    fatherName: z.string().min(1, 'Father Name is required'),
    fatherOccupation: z.string().min(1, 'Occupation is required'),
    fatherDesignation: z.string().optional(),
    fatherOrganization: z.string().optional(),
    fatherIncome: z.string().min(1, 'Annual Income is required'),

    // Mother
    motherName: z.string().min(1, 'Mother Name is required'),
    motherOccupation: z.string().min(1, 'Occupation is required'),
    motherDesignation: z.string().optional(),
    motherOrganization: z.string().optional(),
    motherIncome: z.string().min(1, 'Annual Income is required'),

    // Guardian (Optional initially, or enforce if selected?) - Making optional for now as not everyone has one
    guardianName: z.string().optional(),
    guardianOccupation: z.string().optional(),
    guardianDesignation: z.string().optional(),
    guardianOrganization: z.string().optional(),
    guardianIncome: z.string().optional(),
});


// --- Constants ---
const OCCUPATION_OPTIONS = [
    { value: 'government', label: 'Government Service' },
    { value: 'private', label: 'Private Sector' },
    { value: 'business', label: 'Business / Self Employed' },
    { value: 'agriculture', label: 'Agriculture' },
    { value: 'professional', label: 'Professional (Doctor, Lawyer, etc.)' },
    { value: 'retired', label: 'Retired' },
    { value: 'homemaker', label: 'Homemaker' },
    { value: 'others', label: 'Others' },
];

const INCOME_OPTIONS = [
    { value: 'upto_1L', label: 'Up to 1 Lakh' },
    { value: '1L_2.5L', label: '1 Lakh - 2.5 Lakhs' },
    { value: '2.5L_5L', label: '2.5 Lakhs - 5 Lakhs' },
    { value: '5L_8L', label: '5 Lakhs - 8 Lakhs' },
    { value: 'above_8L', label: 'Above 8 Lakhs' },
];



const FamilyDetails = () => {
    const { form, onSubmit } = useRegistrationForm({
        schema: familySchema,
        stepNumber: 3,
        defaultValues: (formData) => ({
            fullName: getStringValue(formData, 'fullName'),
            studentId: getStringValue(formData, 'studentId'),
            fatherName: getStringValue(formData, 'fatherName'),
            fatherOccupation: getStringValue(formData, 'fatherOccupation'),
            fatherDesignation: getStringValue(formData, 'fatherDesignation'),
            fatherOrganization: getStringValue(formData, 'fatherOrganization'),
            fatherIncome: getStringValue(formData, 'fatherIncome'),
            motherName: getStringValue(formData, 'motherName'),
            motherOccupation: getStringValue(formData, 'motherOccupation'),
            motherDesignation: getStringValue(formData, 'motherDesignation'),
            motherOrganization: getStringValue(formData, 'motherOrganization'),
            motherIncome: getStringValue(formData, 'motherIncome'),
            guardianName: getStringValue(formData, 'guardianName'),
            guardianOccupation: getStringValue(formData, 'guardianOccupation'),
            guardianDesignation: getStringValue(formData, 'guardianDesignation'),
            guardianOrganization: getStringValue(formData, 'guardianOrganization'),
            guardianIncome: getStringValue(formData, 'guardianIncome'),
        }),
    });

    const { control, handleSubmit, formState: { errors } } = form;

    return (
        <StepLayout
            title="Family details"
            subtitle="Provide Information About Your Immediate Family Members"
        >
            <form className="w-full h-full flex flex-col" onSubmit={handleSubmit(onSubmit)} id="current-step-form">
                <Stack tokens={STACK_TOKENS}>

                    {/* Applicant & ID Row */}
                    <FormRowContainer>
                        <FormRow>
                            <InputField
                                name="fullName"
                                control={control}
                                errors={errors}
                                label="Name of Applicant"
                                required
                                            placeholder="Enter the name"
                                        />
                        </FormRow>
                        <FormRow>
                            <InputField
                                name="studentId"
                                control={control}
                                errors={errors}
                                label="Student ID (if known)"
                                            placeholder="Enter student ID"
                            />
                        </FormRow>
                    </FormRowContainer>

                    {/* Father Details */}
                    <FamilyMemberSection
                        title="Father Details"
                        prefix="father"
                                        control={control}
                        errors={errors}
                        occupationOptions={OCCUPATION_OPTIONS}
                        incomeOptions={INCOME_OPTIONS}
                    />

                    {/* Mother Details */}
                    <FamilyMemberSection
                        title="Mother Details"
                        prefix="mother"
                                        control={control}
                        errors={errors}
                        occupationOptions={OCCUPATION_OPTIONS}
                        incomeOptions={INCOME_OPTIONS}
                    />

                    {/* Guardian Details */}
                    <FamilyMemberSection
                        title="Guardian Details"
                        prefix="guardian"
                                        control={control}
                        errors={errors}
                        occupationOptions={OCCUPATION_OPTIONS}
                        incomeOptions={INCOME_OPTIONS}
                        isOptional
                                                />

                </Stack>
            </form>
        </StepLayout>
    );
};

export default FamilyDetails;
