import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
    Stack,
    IStackStyles,
    IStackTokens,
    mergeStyles,
    FontWeights,
} from '@fluentui/react';
import { Input, Select, Label } from '@shared/components';
import { useRegistration } from '@/contexts/RegistrationContext';

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

type FamilyFormData = z.infer<typeof familySchema>;

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

// --- Styles (Matching IdentityDetails) ---
const containerStyles: IStackStyles = {
    root: {
        width: '80%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
    },
};

const stackTokens: IStackTokens = { childrenGap: 24 };
const rowTokens: IStackTokens = { childrenGap: 24 };

const titleStyles = mergeStyles({
    fontSize: 24,
    fontWeight: FontWeights.semibold,
    color: '#111827',
    marginBottom: 4,
});

const subtitleStyles = mergeStyles({
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 32,
});

const sectionHeaderStyles = mergeStyles({
    fontSize: 16,
    fontWeight: 600,
    color: '#111827',
    marginTop: 8,
    marginBottom: 16,
});

const labelStyles = mergeStyles({
    fontWeight: 600,
    fontSize: 14,
    color: '#374151',
    marginBottom: 6,
    display: 'block'
});

const asteriskStyle = { color: '#ef4444' };


const FamilyDetails = () => {
    const { formData, updateFormData, nextStep, markStepComplete, setIsLoading } = useRegistration();

    const {
        control,
        handleSubmit,
        getValues,
        formState: { errors },
    } = useForm<FamilyFormData>({
        resolver: zodResolver(familySchema),
        defaultValues: {
            fullName: formData.fullName || '',
            studentId: formData.studentId || '',
            fatherName: formData.fatherName || '',
            fatherOccupation: formData.fatherOccupation || '',
            fatherDesignation: formData.fatherDesignation || '',
            fatherOrganization: formData.fatherOrganization || '',
            fatherIncome: formData.fatherIncome || '',
            motherName: formData.motherName || '',
            motherOccupation: formData.motherOccupation || '',
            motherDesignation: formData.motherDesignation || '',
            motherOrganization: formData.motherOrganization || '',
            motherIncome: formData.motherIncome || '',
            guardianName: formData.guardianName || '',
            guardianOccupation: formData.guardianOccupation || '',
            guardianDesignation: formData.guardianDesignation || '',
            guardianOrganization: formData.guardianOrganization || '',
            guardianIncome: formData.guardianIncome || '',
        },
    });

    // Save data to context on unmount
    useEffect(() => {
        return () => {
            updateFormData(getValues());
        };
    }, [updateFormData, getValues]);

    const onSubmit = async (data: FamilyFormData) => {
        console.log('Family Step Data:', data);
        setIsLoading(true);
        try {
            // Show loading for a few seconds before moving to next step
            await new Promise(resolve => setTimeout(resolve, 2000));
            updateFormData(data);
            markStepComplete(3);
            nextStep();
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Stack className="w-4/5 h-full flex flex-col">
            <h2 className="text-2xl font-semibold text-gray-900 mb-1">Family details</h2>
            <p className="text-sm text-gray-500 mb-8">Provide Information About Your Immediate Family Members</p>

            <form className="w-full h-full flex flex-col" onSubmit={handleSubmit(onSubmit)} id="current-step-form">
                <Stack tokens={stackTokens}>

                    {/* Applicant & ID Row */}
                    <Stack horizontal tokens={rowTokens} wrap>
                        <Stack.Item grow={1} className="min-w-[250px]">
                            <Controller
                                name="fullName"
                                control={control}
                                render={({ field }) => (
                                    <Stack>
                                        <Label required>Name of Applicant</Label>
                                        <Input
                                            {...field}
                                            value={field.value ?? ''}
                                            placeholder="Enter the name"
                                            errorMessage={errors.fullName?.message}
                                        />
                                    </Stack>
                                )}
                            />
                        </Stack.Item>
                        <Stack.Item grow={1} className="min-w-[250px]">
                            <Controller
                                name="studentId"
                                control={control}
                                render={({ field }) => (
                                    <Stack>
                                        <Label>Student ID (if known)</Label>
                                        <Input
                                            {...field}
                                            value={field.value ?? ''}
                                            placeholder="Enter student ID"
                                            errorMessage={errors.studentId?.message}
                                        />
                                    </Stack>
                                )}
                            />
                        </Stack.Item>
                    </Stack>

                    {/* Father Details */}
                    <Stack>
                        <div className="text-base font-semibold text-gray-900 mt-2 mb-4">Father Details</div>
                        <Stack tokens={rowTokens}>
                            <Stack horizontal tokens={rowTokens} wrap>
                                <Stack.Item grow={1} className="min-w-[250px]">
                                    <Controller
                                        name="fatherName"
                                        control={control}
                                        render={({ field }) => (
                                            <Stack>
                                                <Label required>Name</Label>
                                                <Input {...field} value={field.value ?? ''} placeholder="Enter father name" errorMessage={errors.fatherName?.message} />
                                            </Stack>
                                        )}
                                    />
                                </Stack.Item>
                                <Stack.Item grow={1} className="min-w-[250px]">
                                    <Controller
                                        name="fatherOccupation"
                                        control={control}
                                        render={({ field }) => (
                                            <Stack>
                                                <Label required>Occupation</Label>
                                                <Select
                                                    selectedKey={field.value}
                                                    onValueChange={field.onChange}
                                                    placeholder="Select"
                                                    options={OCCUPATION_OPTIONS}
                                                    errorMessage={errors.fatherOccupation?.message}
                                                />
                                            </Stack>
                                        )}
                                    />
                                </Stack.Item>
                            </Stack>
                            <Stack horizontal tokens={rowTokens} wrap>
                                <Stack.Item grow={1} className="min-w-[250px]">
                                    <Controller
                                        name="fatherDesignation"
                                        control={control}
                                        render={({ field }) => (
                                            <Stack>
                                                <Label>Designation</Label>
                                                <Input {...field} value={field.value ?? ''} placeholder="Enter father designation" errorMessage={errors.fatherDesignation?.message} />
                                            </Stack>
                                        )}
                                    />
                                </Stack.Item>
                                <Stack.Item grow={1} className="min-w-[250px]">
                                    <Controller
                                        name="fatherOrganization"
                                        control={control}
                                        render={({ field }) => (
                                            <Stack>
                                                <Label>Organization Name</Label>
                                                <Input {...field} value={field.value ?? ''} placeholder="Enter organisation name" errorMessage={errors.fatherOrganization?.message} />
                                            </Stack>
                                        )}
                                    />
                                </Stack.Item>
                            </Stack>
                            <Stack horizontal tokens={rowTokens} wrap>
                                <Stack.Item grow={1} className="w-1/2 min-w-[250px]">
                                    <Controller
                                        name="fatherIncome"
                                        control={control}
                                        render={({ field }) => (
                                            <Stack>
                                                <Label required>Annual Income</Label>
                                                <Select
                                                    selectedKey={field.value}
                                                    onValueChange={field.onChange}
                                                    placeholder="Select"
                                                    options={INCOME_OPTIONS}
                                                    errorMessage={errors.fatherIncome?.message}
                                                />
                                            </Stack>
                                        )}
                                    />
                                </Stack.Item>
                            </Stack>
                        </Stack>
                    </Stack>

                    {/* Mother Details */}
                    <Stack>
                        <div className="text-base font-semibold text-gray-900 mt-2 mb-4">Mother Details</div>
                        <Stack tokens={rowTokens}>
                            <Stack horizontal tokens={rowTokens} wrap>
                                <Stack.Item grow={1} className="min-w-[250px]">
                                    <Controller
                                        name="motherName"
                                        control={control}
                                        render={({ field }) => (
                                            <Stack>
                                                <Label required>Name</Label>
                                                <Input {...field} value={field.value ?? ''} placeholder="Enter mother name" errorMessage={errors.motherName?.message} />
                                            </Stack>
                                        )}
                                    />
                                </Stack.Item>
                                <Stack.Item grow={1} className="min-w-[250px]">
                                    <Controller
                                        name="motherOccupation"
                                        control={control}
                                        render={({ field }) => (
                                            <Stack>
                                                <Label required>Occupation</Label>
                                                <Select
                                                    selectedKey={field.value}
                                                    onValueChange={field.onChange}
                                                    placeholder="Select"
                                                    options={OCCUPATION_OPTIONS}
                                                    errorMessage={errors.motherOccupation?.message}
                                                />
                                            </Stack>
                                        )}
                                    />
                                </Stack.Item>
                            </Stack>
                            <Stack horizontal tokens={rowTokens} wrap>
                                <Stack.Item grow={1} className="min-w-[250px]">
                                    <Controller
                                        name="motherDesignation"
                                        control={control}
                                        render={({ field }) => (
                                            <Stack>
                                                <Label>Designation</Label>
                                                <Input {...field} value={field.value ?? ''} placeholder="Enter mother designation" errorMessage={errors.motherDesignation?.message} />
                                            </Stack>
                                        )}
                                    />
                                </Stack.Item>
                                <Stack.Item grow={1} className="min-w-[250px]">
                                    <Controller
                                        name="motherOrganization"
                                        control={control}
                                        render={({ field }) => (
                                            <Stack>
                                                <Label>Organization Name</Label>
                                                <Input {...field} value={field.value ?? ''} placeholder="Enter organisation name" errorMessage={errors.motherOrganization?.message} />
                                            </Stack>
                                        )}
                                    />
                                </Stack.Item>
                            </Stack>
                            <Stack horizontal tokens={rowTokens} wrap>
                                <Stack.Item grow={1} className="w-1/2 min-w-[250px]">
                                    <Controller
                                        name="motherIncome"
                                        control={control}
                                        render={({ field }) => (
                                            <Stack>
                                                <Label required>Annual Income</Label>
                                                <Select
                                                    selectedKey={field.value}
                                                    onValueChange={field.onChange}
                                                    placeholder="Select"
                                                    options={INCOME_OPTIONS}
                                                    errorMessage={errors.motherIncome?.message}
                                                />
                                            </Stack>
                                        )}
                                    />
                                </Stack.Item>
                            </Stack>
                        </Stack>
                    </Stack>

                    {/* Guardian Details */}
                    <Stack>
                        <div className="text-base font-semibold text-gray-900 mt-2 mb-4">Guardian Details</div>
                        <Stack tokens={rowTokens}>
                            <Stack horizontal tokens={rowTokens} wrap>
                                <Stack.Item grow={1} className="min-w-[250px]">
                                    <Controller
                                        name="guardianName"
                                        control={control}
                                        render={({ field }) => (
                                            <Stack>
                                                <Label>Name</Label>
                                                <Input {...field} value={field.value ?? ''} placeholder="Enter guardian name" errorMessage={errors.guardianName?.message} />
                                            </Stack>
                                        )}
                                    />
                                </Stack.Item>
                                <Stack.Item grow={1} className="min-w-[250px]">
                                    <Controller
                                        name="guardianOccupation"
                                        control={control}
                                        render={({ field }) => (
                                            <Stack>
                                                <Label>Occupation</Label>
                                                <Select
                                                    selectedKey={field.value}
                                                    onValueChange={field.onChange}
                                                    placeholder="Select"
                                                    options={OCCUPATION_OPTIONS}
                                                    errorMessage={errors.guardianOccupation?.message}
                                                />
                                            </Stack>
                                        )}
                                    />
                                </Stack.Item>
                            </Stack>
                            <Stack horizontal tokens={rowTokens} wrap>
                                <Stack.Item grow={1} className="min-w-[250px]">
                                    <Controller
                                        name="guardianDesignation"
                                        control={control}
                                        render={({ field }) => (
                                            <Stack>
                                                <Label>Designation</Label>
                                                <Input {...field} value={field.value ?? ''} placeholder="Enter guardian designation" errorMessage={errors.guardianDesignation?.message} />
                                            </Stack>
                                        )}
                                    />
                                </Stack.Item>
                                <Stack.Item grow={1} className="min-w-[250px]">
                                    <Controller
                                        name="guardianOrganization"
                                        control={control}
                                        render={({ field }) => (
                                            <Stack>
                                                <Label>Organization Name</Label>
                                                <Input {...field} value={field.value ?? ''} placeholder="Enter organisation name" errorMessage={errors.guardianOrganization?.message} />
                                            </Stack>
                                        )}
                                    />
                                </Stack.Item>
                            </Stack>
                            <Stack horizontal tokens={rowTokens} wrap>
                                <Stack.Item grow={1} className="w-1/2 min-w-[250px]">
                                    <Controller
                                        name="guardianIncome"
                                        control={control}
                                        render={({ field }) => (
                                            <Stack>
                                                <Label>Annual Income</Label>
                                                <Select
                                                    selectedKey={field.value}
                                                    onValueChange={field.onChange}
                                                    placeholder="Select"
                                                    options={INCOME_OPTIONS}
                                                    errorMessage={errors.guardianIncome?.message}
                                                />
                                            </Stack>
                                        )}
                                    />
                                </Stack.Item>
                            </Stack>
                        </Stack>
                    </Stack>



                </Stack>
            </form>
        </Stack>
    );
};

export default FamilyDetails;
