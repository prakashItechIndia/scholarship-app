import { useEffect, useState } from 'react';
import ProfileImage from '../../../assets/ProfileImage.svg';
import Avatar from '../../../assets/Avatar.svg';
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
    ChoiceGroup,
    IChoiceGroupOption,
    DatePicker,
    Text,
    Image,
    ImageFit,
} from '@fluentui/react';
import { useRegistration } from '@/contexts/RegistrationContext';

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

const COMMUNITY_OPTIONS: IDropdownOption[] = [
    { key: 'oc', text: 'OC' },
    { key: 'bc', text: 'BC' },
    { key: 'mbc', text: 'MBC' },
    { key: 'sc', text: 'SC' },
    { key: 'st', text: 'ST' },
];

// Mock options (usually fetched from API)
const CASTE_OPTIONS: IDropdownOption[] = [{ key: 'caste1', text: 'Caste 1' }, { key: 'caste2', text: 'Caste 2' }];
const DISTRICT_OPTIONS: IDropdownOption[] = [{ key: 'chennai', text: 'Chennai' }, { key: 'kancheepuram', text: 'Kancheepuram' }];
const STATE_OPTIONS: IDropdownOption[] = [{ key: 'tn', text: 'Tamil Nadu' }, { key: 'ka', text: 'Karnataka' }];
const COUNTRY_OPTIONS: IDropdownOption[] = [{ key: 'in', text: 'India' }];


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

const commonFieldStyles = { fieldGroup: { height: 42, borderRadius: 4, borderColor: '#d1d5db' } };
const dropdownStyles = { dropdown: { width: '100%' }, title: { height: 42, lineHeight: 40, borderRadius: 4, borderColor: '#d1d5db' } };


const PersonalDetails = () => {
    const { formData, updateFormData, nextStep, markStepComplete } = useRegistration();

    const { control, handleSubmit, getValues, formState: { errors } } = useForm<PersonalFormData>({
        resolver: zodResolver(personalSchema),
        defaultValues: {
            scholarshipApplied: '',
            gender: '',
            ...formData,
            // Ensure dob is a proper Date object if it exists in formData (where it might be stored as string)
            dob: formData.dob ? new Date(formData.dob) : undefined,
        } as any, // Type cast to handle partial/loose matching with form data
    });

    const [isHovered, setIsHovered] = useState(false);

    // Save data to context on unmount
    useEffect(() => {
        return () => {
            const data = getValues();
            updateFormData({
                ...data,
                dob: typeof data.dob === 'string' ? data.dob : data.dob?.toISOString() // Ensure dob is string if needed or keep date
            } as any);
        };
    }, [updateFormData, getValues]);

    const onSubmit = (data: PersonalFormData) => {
        console.log('Personal Step Data:', data);
        updateFormData({
            ...data,
            dob: data.dob.toISOString(),
        } as any);
        markStepComplete(2);
        nextStep();
    };

    return (
        <Stack styles={containerStyles}>
            <Stack grow verticalAlign="start">
                <h2 className={titleStyles}>Personal Details</h2>
                <p className={subtitleStyles}>Fill In Your Essential Personal Information</p>

                <form style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }} onSubmit={handleSubmit(onSubmit)} id="current-step-form">
                    <Stack tokens={stackTokens}>

                        {/* Profile Photo */}
                        <Stack horizontal verticalAlign="center" tokens={{ childrenGap: 16 }}>
                            <div
                                onMouseEnter={() => setIsHovered(true)}
                                onMouseLeave={() => setIsHovered(false)}
                                className={mergeStyles({
                                    width: 80, height: 80, borderRadius: '50%', cursor: 'pointer', overflow: 'hidden',
                                    position: 'relative',
                                    transition: 'all 0.3s ease-in-out',
                                    transform: isHovered ? 'scale(1.05)' : 'scale(1)'
                                })}
                            >
                                <Image
                                    src={isHovered ? Avatar : ProfileImage}
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
                                <Text variant="medium" style={{ fontWeight: 600, color: '#374151' }}>Profile Photo</Text>
                                <Text variant="small" style={{ color: '#6b7280' }}>Supported formats: PNG, JPG and JPEG (up to 5MB)</Text>
                            </Stack>
                        </Stack>

                        {/* Row 1: Scholarship & Gender */}
                        <Stack horizontal tokens={rowTokens} wrap verticalAlign="start">
                            <Stack.Item grow={1} styles={{ root: { minWidth: 250 } }}>
                                <label className={labelStyles}>Applied for any other scholarship <span style={{ color: '#ef4444' }}>*</span></label>
                                <Controller
                                    name="scholarshipApplied"
                                    control={control}
                                    render={({ field }) => (
                                        <ChoiceGroup
                                            selectedKey={field.value}
                                            options={YES_NO_OPTIONS}
                                            onChange={(_, option) => field.onChange(option?.key)}
                                            styles={{ flexContainer: { display: 'flex', flexDirection: 'row', gap: 24 } }}
                                        />
                                    )}
                                />
                                {errors.scholarshipApplied && <p style={{ color: '#ef4444', fontSize: 12, marginTop: 4 }}>{errors.scholarshipApplied.message}</p>}
                            </Stack.Item>

                            <Stack.Item grow={1} styles={{ root: { minWidth: 250 } }}>
                                <label className={labelStyles}>Gender <span style={{ color: '#ef4444' }}>*</span></label>
                                <Controller
                                    name="gender"
                                    control={control}
                                    render={({ field }) => (
                                        <ChoiceGroup
                                            selectedKey={field.value}
                                            options={GENDER_OPTIONS}
                                            onChange={(_, option) => field.onChange(option?.key)}
                                            styles={{ flexContainer: { display: 'flex', flexDirection: 'row', gap: 24 } }}
                                        />
                                    )}
                                />
                                {errors.gender && <p style={{ color: '#ef4444', fontSize: 12, marginTop: 4 }}>{errors.gender.message}</p>}
                            </Stack.Item>
                        </Stack>

                        {/* Community */}
                        <Stack>
                            <label className={labelStyles}>Community <span style={{ color: '#ef4444' }}>*</span></label>
                            <Controller
                                name="community"
                                control={control}
                                render={({ field }) => (
                                    <Dropdown
                                        placeholder="Select your community"
                                        selectedKey={field.value}
                                        onChange={(_, option) => field.onChange(option?.key)}
                                        options={COMMUNITY_OPTIONS}
                                        styles={dropdownStyles}
                                        errorMessage={errors.community?.message}
                                    />
                                )}
                            />
                        </Stack>

                        {/* Row 2: Caste & DOB */}
                        <Stack horizontal tokens={rowTokens} wrap>
                            <Stack.Item grow={1} styles={{ root: { minWidth: 250 } }}>
                                <label className={labelStyles}>Caste <span style={{ color: '#ef4444' }}>*</span></label>
                                <Controller
                                    name="caste"
                                    control={control}
                                    render={({ field }) => (
                                        <Dropdown
                                            placeholder="Select your caste"
                                            selectedKey={field.value}
                                            onChange={(_, option) => field.onChange(option?.key)}
                                            options={CASTE_OPTIONS}
                                            styles={dropdownStyles}
                                            errorMessage={errors.caste?.message}
                                        />
                                    )}
                                />
                            </Stack.Item>
                            <Stack.Item grow={1} styles={{ root: { minWidth: 250 } }}>
                                <label className={labelStyles}>Date of Birth <span style={{ color: '#ef4444' }}>*</span></label>
                                <Controller
                                    name="dob"
                                    control={control}
                                    render={({ field }) => (
                                        <DatePicker
                                            placeholder="Select Date of birth"
                                            value={field.value}
                                            onSelectDate={(date) => field.onChange(date)}
                                            styles={{ textField: commonFieldStyles as any }} // Type casting for ease here
                                        />
                                    )}
                                />
                                {errors.dob && <p style={{ color: '#ef4444', fontSize: 12, marginTop: 4 }}>{errors.dob.message}</p>}
                            </Stack.Item>
                        </Stack>


                        {/* Row 3: Email & Mobile */}
                        <Stack horizontal tokens={rowTokens} wrap>
                            <Stack.Item grow={1} styles={{ root: { minWidth: 250 } }}>
                                <label className={labelStyles}>Email <span style={{ color: '#ef4444' }}>*</span></label>
                                <Controller
                                    name="email"
                                    control={control}
                                    render={({ field }) => (
                                        <TextField {...field} placeholder="Enter email ID" styles={commonFieldStyles} errorMessage={errors.email?.message} />
                                    )}
                                />
                            </Stack.Item>
                            <Stack.Item grow={1} styles={{ root: { minWidth: 250 } }}>
                                <label className={labelStyles}>Mobile Number <span style={{ color: '#ef4444' }}>*</span></label>
                                <Controller
                                    name="mobile"
                                    control={control}
                                    render={({ field }) => (
                                        <TextField {...field} placeholder="Enter mobile number" styles={commonFieldStyles} errorMessage={errors.mobile?.message} />
                                    )}
                                />
                            </Stack.Item>
                        </Stack>

                        <div className={sectionHeaderStyles}>Address Details</div>

                        {/* Row 4: Address Lines */}
                        <Stack horizontal tokens={rowTokens} wrap>
                            <Stack.Item grow={1} styles={{ root: { minWidth: 250 } }}>
                                <label className={labelStyles}>Address Line 1 <span style={{ color: '#ef4444' }}>*</span></label>
                                <Controller
                                    name="addressLine1"
                                    control={control}
                                    render={({ field }) => (
                                        <TextField {...field} placeholder="Address line 1" styles={commonFieldStyles} errorMessage={errors.addressLine1?.message} />
                                    )}
                                />
                            </Stack.Item>
                            <Stack.Item grow={1} styles={{ root: { minWidth: 250 } }}>
                                <label className={labelStyles}>Address Line 2</label>
                                <Controller
                                    name="addressLine2"
                                    control={control}
                                    render={({ field }) => (
                                        <TextField {...field} placeholder="Address line 2" styles={commonFieldStyles} />
                                    )}
                                />
                            </Stack.Item>
                        </Stack>

                        {/* Row 5: City & District */}
                        <Stack horizontal tokens={rowTokens} wrap>
                            <Stack.Item grow={1} styles={{ root: { minWidth: 250 } }}>
                                <label className={labelStyles}>City <span style={{ color: '#ef4444' }}>*</span></label>
                                <Controller
                                    name="city"
                                    control={control}
                                    render={({ field }) => (
                                        <TextField {...field} placeholder="Enter city" styles={commonFieldStyles} errorMessage={errors.city?.message} />
                                    )}
                                />
                            </Stack.Item>
                            <Stack.Item grow={1} styles={{ root: { minWidth: 250 } }}>
                                <label className={labelStyles}>District <span style={{ color: '#ef4444' }}>*</span></label>
                                <Controller
                                    name="district"
                                    control={control}
                                    render={({ field }) => (
                                        <Dropdown
                                            placeholder="Select"
                                            selectedKey={field.value}
                                            onChange={(_, option) => field.onChange(option?.key)}
                                            options={DISTRICT_OPTIONS}
                                            styles={dropdownStyles}
                                            errorMessage={errors.district?.message}
                                        />
                                    )}
                                />
                            </Stack.Item>
                        </Stack>


                        {/* Row 6: State & Pincode */}
                        <Stack horizontal tokens={rowTokens} wrap>
                            <Stack.Item grow={1} styles={{ root: { minWidth: 250 } }}>
                                <label className={labelStyles}>State <span style={{ color: '#ef4444' }}>*</span></label>
                                <Controller
                                    name="state"
                                    control={control}
                                    render={({ field }) => (
                                        <Dropdown
                                            placeholder="Select"
                                            selectedKey={field.value}
                                            onChange={(_, option) => field.onChange(option?.key)}
                                            options={STATE_OPTIONS}
                                            styles={dropdownStyles}
                                            errorMessage={errors.state?.message}
                                        />
                                    )}
                                />
                            </Stack.Item>
                            <Stack.Item grow={1} styles={{ root: { minWidth: 250 } }}>
                                <label className={labelStyles}>Pincode <span style={{ color: '#ef4444' }}>*</span></label>
                                <Controller
                                    name="pincode"
                                    control={control}
                                    render={({ field }) => (
                                        <TextField {...field} placeholder="Enter pincode" styles={commonFieldStyles} errorMessage={errors.pincode?.message} />
                                    )}
                                />
                            </Stack.Item>
                        </Stack>

                        {/* Country */}
                        <Stack style={{ maxWidth: '50%' }}>
                            <label className={labelStyles}>Country <span style={{ color: '#ef4444' }}>*</span></label>
                            <Controller
                                name="country"
                                control={control}
                                render={({ field }) => (
                                    <Dropdown
                                        placeholder="Select"
                                        selectedKey={field.value}
                                        onChange={(_, option) => field.onChange(option?.key)}
                                        options={COUNTRY_OPTIONS}
                                        styles={dropdownStyles}
                                        errorMessage={errors.country?.message}
                                    />
                                )}
                            />
                        </Stack>
                        <div style={{ height: 20 }}></div>

                    </Stack>
                </form>
            </Stack>
        </Stack>
    );
}

export default PersonalDetails;
