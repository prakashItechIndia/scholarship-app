import { useState, useEffect } from 'react';
import { z } from 'zod';
import { useRegistrationForm } from '../hooks/useRegistrationForm';
import { dropdownOptions } from '@/services/scholarship.service';
import { StepLayout } from '../components/StepLayout';
import { getStringValue } from '../utils/registrationHelpers';
import { InputField, SelectField } from '../components';

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


// Options will be loaded from API



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
    const [occupationOptions, setOccupationOptions] = useState<Array<{ value: string; label: string }>>([]);
    const [incomeOptions, setIncomeOptions] = useState<Array<{ value: string; label: string }>>([]);
    const [isLoadingOptions, setIsLoadingOptions] = useState(true);

    // Load dropdown options on mount
    useEffect(() => {
        const loadOptions = async () => {
            try {
                setIsLoadingOptions(true);
                const [occupations, incomeRanges] = await Promise.all([
                    dropdownOptions.getOccupations(),
                    dropdownOptions.getAnnualIncomeRanges(),
                ]);
                setOccupationOptions(occupations);
                setIncomeOptions(incomeRanges);
            } catch (error) {
                console.error('Error loading dropdown options:', error);
            } finally {
                setIsLoadingOptions(false);
            }
        };
        void loadOptions();
    }, []);

    return (
        <StepLayout
            title="Family details"
            subtitle="Provide Information About Your Immediate Family Members"
        >
            <form className="w-full h-full flex flex-col -mt-4" onSubmit={handleSubmit(onSubmit)} id="current-step-form">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">

                    {/* Applicant Details */}
                    <div className="col-span-1 md:col-span-2">
                        <h3 className="text-[16px] font-semibold text-[#242424] mb-2">Applicant Details</h3>
                    </div>
                    <div className="col-span-1 w-full">
                        <InputField
                            name="fullName"
                            control={control}
                            errors={errors}
                            label="Name of Applicant"
                            required
                            placeholder="Enter the name"
                        />
                    </div>
                    <div className="col-span-1 w-full">
                        <InputField
                            name="studentId"
                            control={control}
                            errors={errors}
                            label="Student ID (if known)"
                            placeholder="Enter student ID"
                        />
                    </div>

                    {/* Father Details */}
                    <div className="col-span-1 md:col-span-2 mt-2">
                        <h3 className="text-[16px] font-semibold text-[#242424] mb-2">Father Details</h3>
                    </div>
                    <div className="col-span-1 w-full">
                        <InputField
                            name="fatherName"
                            control={control}
                            errors={errors}
                            label="Name"
                            required
                            placeholder="Enter father name"
                        />
                    </div>
                    <div className="col-span-1 w-full">
                        <SelectField
                            name="fatherOccupation"
                            control={control}
                            errors={errors}
                            label="Occupation"
                            required
                            options={occupationOptions}
                            placeholder="Select"
                        />
                    </div>
                    <div className="col-span-1 w-full">
                        <InputField
                            name="fatherDesignation"
                            control={control}
                            errors={errors}
                            label="Designation"
                            placeholder="Enter designation"
                        />
                    </div>
                    <div className="col-span-1 w-full">
                        <InputField
                            name="fatherOrganization"
                            control={control}
                            errors={errors}
                            label="Organization Name"
                            placeholder="Enter organization name"
                        />
                    </div>
                    <div className="col-span-1 w-full">
                        <SelectField
                            name="fatherIncome"
                            control={control}
                            errors={errors}
                            label="Annual Income"
                            required
                            options={incomeOptions}
                            placeholder="Select"
                        />
                    </div>

                    {/* Mother Details */}
                    <div className="col-span-1 md:col-span-2 mt-2">
                        <h3 className="text-[16px] font-semibold text-[#242424] mb-2">Mother Details</h3>
                    </div>
                    <div className="col-span-1 w-full">
                        <InputField
                            name="motherName"
                            control={control}
                            errors={errors}
                            label="Name"
                            required
                            placeholder="Enter mother name"
                        />
                    </div>
                    <div className="col-span-1 w-full">
                        <SelectField
                            name="motherOccupation"
                            control={control}
                            errors={errors}
                            label="Occupation"
                            required
                            options={occupationOptions}
                            placeholder="Select"
                        />
                    </div>
                    <div className="col-span-1 w-full">
                        <InputField
                            name="motherDesignation"
                            control={control}
                            errors={errors}
                            label="Designation"
                            placeholder="Enter designation"
                        />
                    </div>
                    <div className="col-span-1 w-full">
                        <InputField
                            name="motherOrganization"
                            control={control}
                            errors={errors}
                            label="Organization Name"
                            placeholder="Enter organization name"
                        />
                    </div>
                    <div className="col-span-1 w-full">
                        <SelectField
                            name="motherIncome"
                            control={control}
                            errors={errors}
                            label="Annual Income"
                            required
                            options={incomeOptions}
                            placeholder="Select"
                        />
                    </div>

                    {/* Guardian Details */}
                    <div className="col-span-1 md:col-span-2 mt-2">
                        <h3 className="text-[16px] font-semibold text-[#242424] mb-2">Guardian Details</h3>
                    </div>
                    <div className="col-span-1 w-full">
                        <InputField
                            name="guardianName"
                            control={control}
                            errors={errors}
                            label="Name"
                            placeholder="Enter guardian name"
                        />
                    </div>
                    <div className="col-span-1 w-full">
                        <SelectField
                            name="guardianOccupation"
                            control={control}
                            errors={errors}
                            label="Occupation"
                            options={occupationOptions}
                            placeholder="Select"
                        />
                    </div>
                    <div className="col-span-1 w-full">
                        <InputField
                            name="guardianDesignation"
                            control={control}
                            errors={errors}
                            label="Designation"
                            placeholder="Enter designation"
                        />
                    </div>
                    <div className="col-span-1 w-full">
                        <InputField
                            name="guardianOrganization"
                            control={control}
                            errors={errors}
                            label="Organization Name"
                            placeholder="Enter organization name"
                        />
                    </div>
                    <div className="col-span-1 w-full">
                        <SelectField
                            name="guardianIncome"
                            control={control}
                            errors={errors}
                            label="Annual Income"
                            options={incomeOptions}
                            placeholder="Select"
                        />
                    </div>

                    </div>
            </form>
            <div className="h-5"></div>
            </StepLayout>
    );
};

export default FamilyDetails;
