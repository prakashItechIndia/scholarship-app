import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
    Stack,
    TextField,
    Dropdown,
    IDropdownOption,
    IStackStyles,
    IStackTokens,
    mergeStyles,
    FontWeights,
} from '@fluentui/react';
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
const OCCUPATION_OPTIONS: IDropdownOption[] = [
    { key: 'government', text: 'Government Service' },
    { key: 'private', text: 'Private Sector' },
    { key: 'business', text: 'Business / Self Employed' },
    { key: 'agriculture', text: 'Agriculture' },
    { key: 'professional', text: 'Professional (Doctor, Lawyer, etc.)' },
    { key: 'retired', text: 'Retired' },
    { key: 'homemaker', text: 'Homemaker' },
    { key: 'others', text: 'Others' },
];

const INCOME_OPTIONS: IDropdownOption[] = [
    { key: 'upto_1L', text: 'Up to 1 Lakh' },
    { key: '1L_2.5L', text: '1 Lakh - 2.5 Lakhs' },
    { key: '2.5L_5L', text: '2.5 Lakhs - 5 Lakhs' },
    { key: '5L_8L', text: '5 Lakhs - 8 Lakhs' },
    { key: 'above_8L', text: 'Above 8 Lakhs' },
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

const dropdownStyles = {
    dropdown: { width: '100%' },
    title: { height: 42, lineHeight: 40, borderRadius: 4, borderColor: '#d1d5db' },
};

const textFieldStyles = {
    fieldGroup: { height: 42, borderRadius: 4, borderColor: '#d1d5db' }
};

const FamilyDetails = () => {
    const { formData, updateFormData, nextStep, markStepComplete } = useRegistration();

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

    const onSubmit = (data: FamilyFormData) => {
        console.log('Family Step Data:', data);
        updateFormData(data);
        markStepComplete(3);
        nextStep();
    };

    return (
        <Stack styles={containerStyles}>
            <h2 className={titleStyles}>Family details</h2>
            <p className={subtitleStyles}>Provide Information About Your Immediate Family Members</p>

            <form style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }} onSubmit={handleSubmit(onSubmit)} id="current-step-form">
                <Stack tokens={stackTokens}>

                    {/* Applicant & ID Row */}
                    <Stack horizontal tokens={rowTokens} wrap>
                        <Stack.Item grow={1} styles={{ root: { minWidth: 250 } }}>
                            <Controller
                                name="fullName"
                                control={control}
                                render={({ field }) => (
                                    <Stack>
                                        <label className={labelStyles}>Name of Applicant <span style={asteriskStyle}>*</span></label>
                                        <TextField
                                            {...field}
                                            placeholder="Enter the name"
                                            errorMessage={errors.fullName?.message}
                                            styles={textFieldStyles}
                                        />
                                    </Stack>
                                )}
                            />
                        </Stack.Item>
                        <Stack.Item grow={1} styles={{ root: { minWidth: 250 } }}>
                            <Controller
                                name="studentId"
                                control={control}
                                render={({ field }) => (
                                    <Stack>
                                        <label className={labelStyles}>Student ID (if known)</label>
                                        <TextField
                                            {...field}
                                            placeholder="Enter student ID"
                                            errorMessage={errors.studentId?.message}
                                            styles={textFieldStyles}
                                        />
                                    </Stack>
                                )}
                            />
                        </Stack.Item>
                    </Stack>

                    {/* Father Details */}
                    <Stack>
                        <div className={sectionHeaderStyles}>Father Details</div>
                        <Stack tokens={rowTokens}>
                            <Stack horizontal tokens={rowTokens} wrap>
                                <Stack.Item grow={1} styles={{ root: { minWidth: 250 } }}>
                                    <Controller
                                        name="fatherName"
                                        control={control}
                                        render={({ field }) => (
                                            <Stack>
                                                <label className={labelStyles}>Name <span style={asteriskStyle}>*</span></label>
                                                <TextField {...field} placeholder="Enter father name" errorMessage={errors.fatherName?.message} styles={textFieldStyles} />
                                            </Stack>
                                        )}
                                    />
                                </Stack.Item>
                                <Stack.Item grow={1} styles={{ root: { minWidth: 250 } }}>
                                    <Controller
                                        name="fatherOccupation"
                                        control={control}
                                        render={({ field }) => (
                                            <Stack>
                                                <label className={labelStyles}>Occupation <span style={asteriskStyle}>*</span></label>
                                                <Dropdown
                                                    selectedKey={field.value}
                                                    onChange={(_, opt) => field.onChange(opt?.key)}
                                                    placeholder="Select"
                                                    options={OCCUPATION_OPTIONS}
                                                    errorMessage={errors.fatherOccupation?.message}
                                                    styles={dropdownStyles}
                                                />
                                            </Stack>
                                        )}
                                    />
                                </Stack.Item>
                            </Stack>
                            <Stack horizontal tokens={rowTokens} wrap>
                                <Stack.Item grow={1} styles={{ root: { minWidth: 250 } }}>
                                    <Controller
                                        name="fatherDesignation"
                                        control={control}
                                        render={({ field }) => (
                                            <Stack>
                                                <label className={labelStyles}>Designation</label>
                                                <TextField {...field} placeholder="Enter father designation" errorMessage={errors.fatherDesignation?.message} styles={textFieldStyles} />
                                            </Stack>
                                        )}
                                    />
                                </Stack.Item>
                                <Stack.Item grow={1} styles={{ root: { minWidth: 250 } }}>
                                    <Controller
                                        name="fatherOrganization"
                                        control={control}
                                        render={({ field }) => (
                                            <Stack>
                                                <label className={labelStyles}>Organization Name</label>
                                                <TextField {...field} placeholder="Enter organisation name" errorMessage={errors.fatherOrganization?.message} styles={textFieldStyles} />
                                            </Stack>
                                        )}
                                    />
                                </Stack.Item>
                            </Stack>
                            <Stack horizontal tokens={rowTokens} wrap>
                                <Stack.Item grow={1} styles={{ root: { width: '50%', minWidth: 250 } }}>
                                    <Controller
                                        name="fatherIncome"
                                        control={control}
                                        render={({ field }) => (
                                            <Stack>
                                                <label className={labelStyles}>Annual Income <span style={asteriskStyle}>*</span></label>
                                                <Dropdown
                                                    selectedKey={field.value}
                                                    onChange={(_, opt) => field.onChange(opt?.key)}
                                                    placeholder="Select"
                                                    options={INCOME_OPTIONS}
                                                    errorMessage={errors.fatherIncome?.message}
                                                    styles={dropdownStyles}
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
                        <div className={sectionHeaderStyles}>Mother Details</div>
                        <Stack tokens={rowTokens}>
                            <Stack horizontal tokens={rowTokens} wrap>
                                <Stack.Item grow={1} styles={{ root: { minWidth: 250 } }}>
                                    <Controller
                                        name="motherName"
                                        control={control}
                                        render={({ field }) => (
                                            <Stack>
                                                <label className={labelStyles}>Name <span style={asteriskStyle}>*</span></label>
                                                <TextField {...field} placeholder="Enter mother name" errorMessage={errors.motherName?.message} styles={textFieldStyles} />
                                            </Stack>
                                        )}
                                    />
                                </Stack.Item>
                                <Stack.Item grow={1} styles={{ root: { minWidth: 250 } }}>
                                    <Controller
                                        name="motherOccupation"
                                        control={control}
                                        render={({ field }) => (
                                            <Stack>
                                                <label className={labelStyles}>Occupation <span style={asteriskStyle}>*</span></label>
                                                <Dropdown
                                                    selectedKey={field.value}
                                                    onChange={(_, opt) => field.onChange(opt?.key)}
                                                    placeholder="Select"
                                                    options={OCCUPATION_OPTIONS}
                                                    errorMessage={errors.motherOccupation?.message}
                                                    styles={dropdownStyles}
                                                />
                                            </Stack>
                                        )}
                                    />
                                </Stack.Item>
                            </Stack>
                            <Stack horizontal tokens={rowTokens} wrap>
                                <Stack.Item grow={1} styles={{ root: { minWidth: 250 } }}>
                                    <Controller
                                        name="motherDesignation"
                                        control={control}
                                        render={({ field }) => (
                                            <Stack>
                                                <label className={labelStyles}>Designation</label>
                                                <TextField {...field} placeholder="Enter mother designation" errorMessage={errors.motherDesignation?.message} styles={textFieldStyles} />
                                            </Stack>
                                        )}
                                    />
                                </Stack.Item>
                                <Stack.Item grow={1} styles={{ root: { minWidth: 250 } }}>
                                    <Controller
                                        name="motherOrganization"
                                        control={control}
                                        render={({ field }) => (
                                            <Stack>
                                                <label className={labelStyles}>Organization Name</label>
                                                <TextField {...field} placeholder="Enter organisation name" errorMessage={errors.motherOrganization?.message} styles={textFieldStyles} />
                                            </Stack>
                                        )}
                                    />
                                </Stack.Item>
                            </Stack>
                            <Stack horizontal tokens={rowTokens} wrap>
                                <Stack.Item grow={1} styles={{ root: { width: '50%', minWidth: 250 } }}>
                                    <Controller
                                        name="motherIncome"
                                        control={control}
                                        render={({ field }) => (
                                            <Stack>
                                                <label className={labelStyles}>Annual Income <span style={asteriskStyle}>*</span></label>
                                                <Dropdown
                                                    selectedKey={field.value}
                                                    onChange={(_, opt) => field.onChange(opt?.key)}
                                                    placeholder="Select"
                                                    options={INCOME_OPTIONS}
                                                    errorMessage={errors.motherIncome?.message}
                                                    styles={dropdownStyles}
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
                        <div className={sectionHeaderStyles}>Guardian Details</div>
                        <Stack tokens={rowTokens}>
                            <Stack horizontal tokens={rowTokens} wrap>
                                <Stack.Item grow={1} styles={{ root: { minWidth: 250 } }}>
                                    <Controller
                                        name="guardianName"
                                        control={control}
                                        render={({ field }) => (
                                            <Stack>
                                                <label className={labelStyles}>Name</label>
                                                <TextField {...field} placeholder="Enter guardian name" errorMessage={errors.guardianName?.message} styles={textFieldStyles} />
                                            </Stack>
                                        )}
                                    />
                                </Stack.Item>
                                <Stack.Item grow={1} styles={{ root: { minWidth: 250 } }}>
                                    <Controller
                                        name="guardianOccupation"
                                        control={control}
                                        render={({ field }) => (
                                            <Stack>
                                                <label className={labelStyles}>Occupation</label>
                                                <Dropdown
                                                    selectedKey={field.value}
                                                    onChange={(_, opt) => field.onChange(opt?.key)}
                                                    placeholder="Select"
                                                    options={OCCUPATION_OPTIONS}
                                                    errorMessage={errors.guardianOccupation?.message}
                                                    styles={dropdownStyles}
                                                />
                                            </Stack>
                                        )}
                                    />
                                </Stack.Item>
                            </Stack>
                            <Stack horizontal tokens={rowTokens} wrap>
                                <Stack.Item grow={1} styles={{ root: { minWidth: 250 } }}>
                                    <Controller
                                        name="guardianDesignation"
                                        control={control}
                                        render={({ field }) => (
                                            <Stack>
                                                <label className={labelStyles}>Designation</label>
                                                <TextField {...field} placeholder="Enter guardian designation" errorMessage={errors.guardianDesignation?.message} styles={textFieldStyles} />
                                            </Stack>
                                        )}
                                    />
                                </Stack.Item>
                                <Stack.Item grow={1} styles={{ root: { minWidth: 250 } }}>
                                    <Controller
                                        name="guardianOrganization"
                                        control={control}
                                        render={({ field }) => (
                                            <Stack>
                                                <label className={labelStyles}>Organization Name</label>
                                                <TextField {...field} placeholder="Enter organisation name" errorMessage={errors.guardianOrganization?.message} styles={textFieldStyles} />
                                            </Stack>
                                        )}
                                    />
                                </Stack.Item>
                            </Stack>
                            <Stack horizontal tokens={rowTokens} wrap>
                                <Stack.Item grow={1} styles={{ root: { width: '50%', minWidth: 250 } }}>
                                    <Controller
                                        name="guardianIncome"
                                        control={control}
                                        render={({ field }) => (
                                            <Stack>
                                                <label className={labelStyles}>Annual Income</label>
                                                <Dropdown
                                                    selectedKey={field.value}
                                                    onChange={(_, opt) => field.onChange(opt?.key)}
                                                    placeholder="Select"
                                                    options={INCOME_OPTIONS}
                                                    errorMessage={errors.guardianIncome?.message}
                                                    styles={dropdownStyles}
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
