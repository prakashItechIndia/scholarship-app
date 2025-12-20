import { useEffect, useState } from 'react';
// import ProfileImage from '../../../assets/ProfileImage.svg';
// import Avatar from '../../../assets/Avatar.svg';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
    Stack,
    IStackStyles,
    IStackTokens,
    mergeStyles,
    FontWeights,
    ChoiceGroup,
    IChoiceGroupOption,
    Text,
    Image,
    ImageFit,
} from '@fluentui/react';
import { Input, Select, DatePicker, Label } from '@shared/components';
import { useRegistration, type RegistrationFormData } from '@/contexts/RegistrationContext';

// --- Validation Schema ---
const personalSchema = z.object({
    scholarshipApplied: z.string().min(1, 'Selection required'),
    gender: z.string().min(1, 'Gender required'),
    community: z.string().min(1, 'Community required'),
    caste: z.string().min(1, 'Caste required'),
    dob: z.date({ required_error: 'Date of Birth required' }),
    email: z.string().email('Invalid email').min(1, 'Email is required'),
    mobile: z.string().min(10, 'Invalid mobile number').min(1, 'Mobile number is required'),
    addressLine1: z.string().min(1, 'Address Line 1 required'),
    addressLine2: z.string().optional(),
    city: z.string().min(1, 'City required'),
    district: z.string().min(1, 'District required'),
    state: z.string().min(1, 'State required'),
    pincode: z.string().min(6, 'Invalid Pincode'),
    country: z.string().min(1, 'Country required'),
});

type PersonalFormData = z.infer<typeof personalSchema>;

// --- Constants ---
const YES_NO_OPTIONS: IChoiceGroupOption[] = [
    { key: 'yes', text: 'Yes' },
    { key: 'no', text: 'No' },
];

const GENDER_OPTIONS: IChoiceGroupOption[] = [
    { key: 'male', text: 'Male' },
    { key: 'female', text: 'Female' },
];

const COMMUNITY_OPTIONS = [
    { value: 'oc', label: 'OC' },
    { value: 'bc', label: 'BC' },
    { value: 'mbc', label: 'MBC' },
    { value: 'sc', label: 'SC' },
    { value: 'st', label: 'ST' },
];

// Mock options (usually fetched from API)
const CASTE_OPTIONS = [{ value: 'caste1', label: 'Caste 1' }, { value: 'caste2', label: 'Caste 2' }];
const DISTRICT_OPTIONS = [{ value: 'chennai', label: 'Chennai' }, { value: 'kancheepuram', label: 'Kancheepuram' }];
const STATE_OPTIONS = [{ value: 'tn', label: 'Tamil Nadu' }, { value: 'ka', label: 'Karnataka' }];
const COUNTRY_OPTIONS = [{ value: 'in', label: 'India' }];


// --- Styles (Matching IdentityDetails) ---
const containerStyles: IStackStyles = {
    root: {
        width: '80%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        selectors: {
            '& .ms-TextField-wrapper': { width: '100%' },
        },
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
    fontSize: 18,
    fontWeight: FontWeights.semibold,
    color: '#111827',
    marginTop: 16,
    marginBottom: 16,
});

const labelStyles = mergeStyles({
    fontWeight: 600,
    fontSize: 14,
    color: '#374151',
    marginBottom: 6,
    display: 'block'
});



const PersonalDetails = () => {
    // Direct destructuring with explicit type annotations to help TypeScript
    const { formData, updateFormData, nextStep, markStepComplete, setIsLoading } = useRegistration();

    // Helper to safely get string value from formData
    const getStringValue = (key: string): string => {
        const value: string | number | Date | undefined | null = formData[key];
        return typeof value === 'string' ? value : '';
    };

    // Helper to safely convert formData dob to Date
    const getDobFromFormData = (): Date | undefined => {
        const dobValue: string | number | Date | undefined | null = formData.dob;
        if (!dobValue) return undefined;
        if (dobValue instanceof Date) return dobValue;
        if (typeof dobValue === 'string') {
            const date = new Date(dobValue);
            return isNaN(date.getTime()) ? undefined : date;
        }
        return undefined;
    };

    const { control, handleSubmit, getValues, formState: { errors } } = useForm<PersonalFormData>({
        resolver: zodResolver(personalSchema),
        defaultValues: {
            scholarshipApplied: getStringValue('scholarshipApplied'),
            gender: getStringValue('gender'),
            community: getStringValue('community'),
            caste: getStringValue('caste'),
            dob: getDobFromFormData(),
            email: getStringValue('email'),
            mobile: getStringValue('mobile'),
            addressLine1: getStringValue('addressLine1'),
            addressLine2: getStringValue('addressLine2'),
            city: getStringValue('city'),
            district: getStringValue('district'),
            state: getStringValue('state'),
            pincode: getStringValue('pincode'),
            country: getStringValue('country'),
        },
    });

    const [isHovered, setIsHovered] = useState(false);

    // Save data to context on unmount
    useEffect(() => {
        return () => {
            const data = getValues();
            const dobValue = data.dob instanceof Date ? data.dob.toISOString() : undefined;
            updateFormData({
                scholarshipApplied: data.scholarshipApplied,
                gender: data.gender,
                community: data.community,
                caste: data.caste,
                dob: dobValue,
                email: data.email,
                mobile: data.mobile,
                addressLine1: data.addressLine1,
                addressLine2: data.addressLine2,
                city: data.city,
                district: data.district,
                state: data.state,
                pincode: data.pincode,
                country: data.country,
            });
        };
    }, [updateFormData, getValues]);

    const onSubmit = async (data: PersonalFormData) => {
        console.log('Personal Step Data:', data);
        setIsLoading(true);
        try {
            // Show loading for a few seconds before moving to next step
            await new Promise(resolve => setTimeout(resolve, 2000));
            updateFormData({
                scholarshipApplied: data.scholarshipApplied,
                gender: data.gender,
                community: data.community,
                caste: data.caste,
                dob: data.dob instanceof Date ? data.dob.toISOString() : undefined,
                email: data.email,
                mobile: data.mobile,
                addressLine1: data.addressLine1,
                addressLine2: data.addressLine2,
                city: data.city,
                district: data.district,
                state: data.state,
                pincode: data.pincode,
                country: data.country,
            });
            markStepComplete(2);
            nextStep();
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Stack className="w-4/5 h-full flex flex-col [&_.ms-TextField-wrapper]:w-full">
            <Stack grow verticalAlign="start">
                <h2 className="text-2xl font-semibold text-gray-900 mb-1">Personal Details</h2>
                <p className="text-sm text-gray-500 mb-8">Fill In Your Essential Personal Information</p>

                <form className="w-full h-full flex flex-col" onSubmit={handleSubmit(onSubmit)} id="current-step-form">
                    <Stack tokens={stackTokens}>

                        {/* Profile Photo */}
                        <Stack horizontal verticalAlign="center" tokens={{ childrenGap: 16 }}>
                            <div
                                onMouseEnter={() => setIsHovered(true)}
                                onMouseLeave={() => setIsHovered(false)}
                                className={`w-20 h-20 rounded-full cursor-pointer overflow-hidden relative transition-all duration-300 ease-in-out ${isHovered ? 'scale-105' : 'scale-100'}`}
                            >
                                <Image
                                    // src={isHovered ? Avatar : ProfileImage}
                                    // src={Avatar}
                                    alt="Profile Photo"
                                    width={80}
                                    height={80}
                                    imageFit={ImageFit.cover}
                                    styles={{
                                        image: {
                                            transition: 'opacity 0.3s ease-in-out',
                                        }
                                    }}
                                />
                            </div>
                            <Stack>
                                <Text variant="medium" className="font-semibold text-gray-700">Profile Photo</Text>
                                <Text variant="small" className="text-gray-500">Supported formats: PNG, JPG and JPEG (up to 5MB)</Text>
                            </Stack>
                        </Stack>

                        {/* Row 1: Scholarship & Gender */}
                        <Stack horizontal tokens={rowTokens} wrap verticalAlign="start">
                            <Stack.Item grow={1} className="min-w-[250px]">
                                <Label required>Applied for any other scholarship</Label>
                                <Controller
                                    name="scholarshipApplied"
                                    control={control}
                                    render={({ field }) => (
                                        <ChoiceGroup
                                            selectedKey={field.value}
                                            options={YES_NO_OPTIONS}
                                            onChange={(_, option) => field.onChange(option?.key)}
                                            className="flex flex-row gap-6"
                                        />
                                    )}
                                />
                                {errors.scholarshipApplied && <p className="text-red-500 text-xs mt-1">{errors.scholarshipApplied.message}</p>}
                            </Stack.Item>

                            <Stack.Item grow={1} className="min-w-[250px]">
                                <Label required>Gender</Label>
                                <Controller
                                    name="gender"
                                    control={control}
                                    render={({ field }) => (
                                        <ChoiceGroup
                                            selectedKey={field.value}
                                            options={GENDER_OPTIONS}
                                            onChange={(_, option) => field.onChange(option?.key)}
                                            className="flex flex-row gap-6"
                                        />
                                    )}
                                />
                                {errors.gender && <p className="text-red-500 text-xs mt-1">{errors.gender.message}</p>}
                            </Stack.Item>
                        </Stack>

                        {/* Community */}
                        <Stack>
                            <Label required>Community</Label>
                            <Controller
                                name="community"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        placeholder="Select your community"
                                        selectedKey={field.value}
                                        onValueChange={field.onChange}
                                        options={COMMUNITY_OPTIONS}
                                        errorMessage={errors.community?.message}
                                    />
                                )}
                            />
                        </Stack>

                        {/* Row 2: Caste & DOB */}
                        <Stack horizontal tokens={rowTokens} wrap>
                            <Stack.Item grow={1} className="min-w-[250px]">
                                <Label required>Caste</Label>
                                <Controller
                                    name="caste"
                                    control={control}
                                    render={({ field }) => (
                                        <Select
                                            placeholder="Select your caste"
                                            selectedKey={field.value}
                                            onValueChange={field.onChange}
                                            options={CASTE_OPTIONS}
                                            errorMessage={errors.caste?.message}
                                        />
                                    )}
                                />
                            </Stack.Item>
                            <Stack.Item grow={1} className="min-w-[250px]">
                                <Label required>Date of Birth</Label>
                                <Controller
                                    name="dob"
                                    control={control}
                                    render={({ field }) => (
                                        <DatePicker
                                            placeholder="Select Date of birth"
                                            value={field.value}
                                            onSelectDate={(date) => field.onChange(date)}
                                            errorMessage={errors.dob?.message}
                                        />
                                    )}
                                />
                            </Stack.Item>
                        </Stack>


                        {/* Row 3: Email & Mobile */}
                        <Stack horizontal tokens={rowTokens} wrap>
                            <Stack.Item grow={1} className="min-w-[250px]">
                                <Label required>Email</Label>
                                <Controller
                                    name="email"
                                    control={control}
                                    render={({ field }) => (
                                        <Input {...field} value={field.value ?? ''} placeholder="Enter email ID" type="email" errorMessage={errors.email?.message} />
                                    )}
                                />
                            </Stack.Item>
                            <Stack.Item grow={1} className="min-w-[250px]">
                                <Label required>Mobile Number</Label>
                                <Controller
                                    name="mobile"
                                    control={control}
                                    render={({ field }) => (
                                        <Input {...field} value={field.value ?? ''} placeholder="Enter mobile number" type="tel" errorMessage={errors.mobile?.message} />
                                    )}
                                />
                            </Stack.Item>
                        </Stack>

                        <div className="text-base font-semibold text-gray-900 mt-2 mb-4">Address Details</div>

                        {/* Row 4: Address Lines */}
                        <Stack horizontal tokens={rowTokens} wrap>
                            <Stack.Item grow={1} className="min-w-[250px]">
                                <Label required>Address Line 1</Label>
                                <Controller
                                    name="addressLine1"
                                    control={control}
                                    render={({ field }) => (
                                        <Input {...field} value={field.value ?? ''} placeholder="Address line 1" errorMessage={errors.addressLine1?.message} />
                                    )}
                                />
                            </Stack.Item>
                            <Stack.Item grow={1} className="min-w-[250px]">
                                <Label>Address Line 2</Label>
                                <Controller
                                    name="addressLine2"
                                    control={control}
                                    render={({ field }) => (
                                        <Input {...field} value={field.value ?? ''} placeholder="Address line 2" />
                                    )}
                                />
                            </Stack.Item>
                        </Stack>

                        {/* Row 5: City & District */}
                        <Stack horizontal tokens={rowTokens} wrap>
                            <Stack.Item grow={1} className="min-w-[250px]">
                                <Label required>City</Label>
                                <Controller
                                    name="city"
                                    control={control}
                                    render={({ field }) => (
                                        <Input {...field} value={field.value ?? ''} placeholder="Enter city" errorMessage={errors.city?.message} />
                                    )}
                                />
                            </Stack.Item>
                            <Stack.Item grow={1} className="min-w-[250px]">
                                <Label required>District</Label>
                                <Controller
                                    name="district"
                                    control={control}
                                    render={({ field }) => (
                                        <Select
                                            placeholder="Select"
                                            selectedKey={field.value}
                                            onValueChange={field.onChange}
                                            options={DISTRICT_OPTIONS}
                                            errorMessage={errors.district?.message}
                                        />
                                    )}
                                />
                            </Stack.Item>
                        </Stack>


                        {/* Row 6: State & Pincode */}
                        <Stack horizontal tokens={rowTokens} wrap>
                            <Stack.Item grow={1} className="min-w-[250px]">
                                <Label required>State</Label>
                                <Controller
                                    name="state"
                                    control={control}
                                    render={({ field }) => (
                                        <Select
                                            placeholder="Select"
                                            selectedKey={field.value}
                                            onValueChange={field.onChange}
                                            options={STATE_OPTIONS}
                                            errorMessage={errors.state?.message}
                                        />
                                    )}
                                />
                            </Stack.Item>
                            <Stack.Item grow={1} className="min-w-[250px]">
                                <Label required>Pincode</Label>
                                <Controller
                                    name="pincode"
                                    control={control}
                                    render={({ field }) => (
                                        <Input {...field} value={field.value ?? ''} placeholder="Enter pincode" errorMessage={errors.pincode?.message} />
                                    )}
                                />
                            </Stack.Item>
                        </Stack>

                        {/* Country */}
                        <Stack className="max-w-[50%]">
                            <Label required>Country</Label>
                            <Controller
                                name="country"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        placeholder="Select"
                                        selectedKey={field.value}
                                        onValueChange={field.onChange}
                                        options={COUNTRY_OPTIONS}
                                        errorMessage={errors.country?.message}
                                    />
                                )}
                            />
                        </Stack>
                        <div className="h-5"></div>

                    </Stack>
                </form>
            </Stack>
        </Stack>
    );
}

export default PersonalDetails;
