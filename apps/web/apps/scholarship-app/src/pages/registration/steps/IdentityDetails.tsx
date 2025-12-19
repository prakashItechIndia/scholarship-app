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
const identitySchema = z.object({
    applicantType: z.string().min(1, 'Please select an option'),
    aadhaarId: z.string().min(1, 'AADHAAR ID is required'),
    panId: z.string().min(1, 'PAN ID is required'),
});

type IdentityFormData = z.infer<typeof identitySchema>;

// --- Constants ---
const APPLICANT_OPTIONS: IDropdownOption[] = [
    { key: 'research_scholar', text: 'I am a Research Scholar seeking Scholarship' },
    { key: 'student', text: 'I am a College Student seeking Scholarship' },
    { key: 'student', text: 'I am a School Student seeking Scholarship' },
    { key: 'medical', text: 'I am a Medical Student seeking Scholarship' },

];

// --- Styles ---
const containerStyles: IStackStyles = {
    root: {
        width: '80%',
        height: '100%', // Full height to push footer down
        display: 'flex',
        flexDirection: 'column',
        color: 'white',
        selectors: {
            '& .ms-TextField-wrapper': { width: '100%' },
        },
    },
};

const stackTokens: IStackTokens = { childrenGap: 24 };
const rowTokens: IStackTokens = { childrenGap: 24 };

const titleStyles = mergeStyles({
    fontSize: 24, // text-2xl
    fontWeight: FontWeights.semibold, // Changed to semi-bold to match image crispness
    color: '#111827', // text-gray-900
    marginBottom: 4, // Reduced bottom margin
});

const subtitleStyles = mergeStyles({
    fontSize: 14, // text-sm
    color: '#6b7280', // lighter gray check
    marginBottom: 32, // Increased gap before form
});



const labelStyles = mergeStyles({
    fontWeight: 600, // Medium-bold font
    fontSize: 14,
    color: '#374151',
    marginBottom: 6,
    display: 'block'
});

const IdentityDetails = () => {
    const { formData, updateFormData, nextStep, markStepComplete } = useRegistration();

    const {
        control,
        handleSubmit,
        getValues,
        formState: { errors },
    } = useForm<IdentityFormData>({
        resolver: zodResolver(identitySchema),
        defaultValues: {
            applicantType: formData.applicantType || 'research_scholar', // Default or from context
            aadhaarId: formData.aadhaarId || '',
            panId: formData.panId || '',
        },
    });

    // Save data to context on unmount (navigation)
    useEffect(() => {
        return () => {
            updateFormData(getValues());
        };
    }, [updateFormData, getValues]);

    const onSubmit = (data: IdentityFormData) => {
        console.log('Identity Step Data:', data);
        updateFormData(data);
        markStepComplete(1);
        nextStep();
    };



    return (
        <Stack styles={containerStyles}>

            {/* Content Section (Grows to fill space) */}
            <Stack grow verticalAlign="start">
                {/* Header Section */}
                <h2 className={titleStyles}>Identity Verification Details</h2>
                <p className={subtitleStyles}>Fill in the Required ID Numbers for Authentication</p>

                {/* Form Fields */}
                <form style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }} onSubmit={handleSubmit(onSubmit)} id="current-step-form">
                    <Stack tokens={stackTokens}>

                        {/* Applicant Type Dropdown */}
                        <Controller
                            name="applicantType"
                            control={control}
                            render={({ field }) => (
                                <Stack>
                                    <label className={labelStyles}>What describes you better <span style={{ color: '#ef4444' }}>*</span></label>
                                    <Dropdown
                                        selectedKey={field.value}
                                        onChange={(_, option) => field.onChange(option?.key)}
                                        placeholder="Select an option"
                                        options={APPLICANT_OPTIONS}
                                        errorMessage={errors.applicantType?.message}
                                        styles={{
                                            dropdown: { width: '100%' },
                                            title: { height: 42, lineHeight: 40, borderRadius: 4, borderColor: '#d1d5db' },
                                        }}
                                    />
                                </Stack>
                            )}
                        />

                        {/* IDs Row (Side by Side) */}
                        <Stack horizontal tokens={rowTokens} wrap>
                            <Stack.Item grow={1} styles={{ root: { minWidth: 250 } }}>
                                <Controller
                                    name="aadhaarId"
                                    control={control}
                                    render={({ field }) => (
                                        <Stack>
                                            <label className={labelStyles}>AADHAAR ID (Candidate)</label>
                                            <TextField
                                                {...field}
                                                // Placeholder from image
                                                placeholder="Enter 12 Digit Aadhar Number"
                                                errorMessage={errors.aadhaarId?.message}
                                                styles={{ fieldGroup: { height: 42, borderRadius: 4, borderColor: '#d1d5db' } }}
                                            />
                                        </Stack>
                                    )}
                                />
                            </Stack.Item>

                            <Stack.Item grow={1} styles={{ root: { minWidth: 250 } }}>
                                <Controller
                                    name="panId"
                                    control={control}
                                    render={({ field }) => (
                                        <Stack>
                                            <label className={labelStyles}>PAN ID (Candidate)</label>
                                            <TextField
                                                {...field}
                                                placeholder="Enter Pan Card Number" // Placeholder from image
                                                errorMessage={errors.panId?.message}
                                                styles={{ fieldGroup: { height: 42, borderRadius: 4, borderColor: '#d1d5db' } }}
                                            />
                                        </Stack>
                                    )}
                                />
                            </Stack.Item>
                        </Stack>
                    </Stack>
                </form>
            </Stack>

        </Stack>
    );
};

export default IdentityDetails;
