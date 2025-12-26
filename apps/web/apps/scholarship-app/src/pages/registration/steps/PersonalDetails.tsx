import { useState, useRef, useEffect } from 'react';
import { z } from 'zod';
import { Stack, IChoiceGroupOption, Text, MessageBar, MessageBarType } from '@fluentui/react';
import { useRegistrationForm } from '../hooks/useRegistrationForm';
import { useRegistration } from '@/contexts/RegistrationContext';
import { dropdownOptions } from '@/services/scholarship.service';
import { StepLayout } from '../components/StepLayout';
import { getStringValue, getDateValue } from '../utils/registrationHelpers';
import { STACK_TOKENS, SECTION_HEADER_CLASS } from '../utils/registrationConstants';
import { InputField, SelectField, DatePickerField, ChoiceGroupField, FormRowContainer, FormRow } from '../components';
import { Input } from '@shared/components';
import { Controller } from 'react-hook-form';
import { FormField } from '../components/FormField';
// ProfileAvatar component - SVG as React component
export const ProfileAvatar = ({ width = 80, height = 80, className = '' }: { width?: number; height?: number; className?: string }) => {
  return (
    <svg 
      width={width} 
      height={height} 
      viewBox="0 0 50 50" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path d="M17.1875 25C12.8728 25 9.375 21.5022 9.375 17.1875C9.375 12.8728 12.8728 9.375 17.1875 9.375C21.5022 9.375 25 12.8728 25 17.1875C25 21.5022 21.5022 25 17.1875 25ZM18.2292 12.2396C18.2292 11.8081 17.8794 11.4583 17.4479 11.4583C17.0164 11.4583 16.6667 11.8081 16.6667 12.2396V16.1458H12.7604C12.3289 16.1458 11.9792 16.4956 11.9792 16.9271C11.9792 17.3586 12.3289 17.7083 12.7604 17.7083H16.6667V21.6146C16.6667 22.0461 17.0164 22.3958 17.4479 22.3958C17.8794 22.3958 18.2292 22.0461 18.2292 21.6146V17.7083H22.1354C22.5669 17.7083 22.9167 17.3586 22.9167 16.9271C22.9167 16.4956 22.5669 16.1458 22.1354 16.1458H18.2292V12.2396ZM12.5 25.3083C12.8347 25.5019 13.1825 25.6754 13.5417 25.8272V34.8958C13.5417 35.5113 13.6942 36.0912 13.9635 36.5997L24.1923 26.282C25.2111 25.2543 26.8723 25.2543 27.891 26.282L38.1199 36.5997C38.3892 36.0912 38.5417 35.5113 38.5417 34.8958V17.1875C38.5417 15.174 36.9094 13.5417 34.8958 13.5417H25.8272C25.6754 13.1825 25.5019 12.8347 25.3083 12.5H34.8958C37.4847 12.5 39.5833 14.5987 39.5833 17.1875V34.8958C39.5833 37.4847 37.4847 39.5833 34.8958 39.5833H17.1875C14.5987 39.5833 12.5 37.4847 12.5 34.8958V25.3083ZM17.1875 38.5417H34.8958C35.9143 38.5417 36.8352 38.1241 37.4967 37.4507L27.1513 27.0153C26.54 26.3987 25.5433 26.3987 24.932 27.0153L14.5866 37.4507C15.2481 38.1241 16.169 38.5417 17.1875 38.5417ZM35.4167 20.8333C35.4167 22.8469 33.7844 24.4792 31.7708 24.4792C29.7573 24.4792 28.125 22.8469 28.125 20.8333C28.125 18.8198 29.7573 17.1875 31.7708 17.1875C33.7844 17.1875 35.4167 18.8198 35.4167 20.8333ZM34.375 20.8333C34.375 19.3951 33.2091 18.2292 31.7708 18.2292C30.3326 18.2292 29.1667 19.3951 29.1667 20.8333C29.1667 22.2716 30.3326 23.4375 31.7708 23.4375C33.2091 23.4375 34.375 22.2716 34.375 20.8333Z" fill="white"/>
    </svg>
  );
};

// --- Validation Schema ---
const personalSchema = z.object({
    scholarshipApplied: z.string().min(1, 'Selection required'),
    gender: z.string().min(1, 'Gender required'),
    community: z.string().min(1, 'Community required'),
    caste: z.string().optional(), // Optional field
    dob: z.date({ 
        required_error: 'Date of Birth required',
    }).refine((date) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return date <= today;
    }, {
        message: 'Date of Birth cannot be a future date',
    }).refine((date) => {
        const today = new Date();
        const age = today.getFullYear() - date.getFullYear();
        const monthDiff = today.getMonth() - date.getMonth();
        const dayDiff = today.getDate() - date.getDate();
        const actualAge = monthDiff < 0 || (monthDiff === 0 && dayDiff < 0) ? age - 1 : age;
        return actualAge >= 15;
    }, {
        message: 'Applicant must be at least 15 years old',
    }),
    // Email: Must be in a valid email format (e.g., yourdomain@gmail.com)
    email: z.string().min(1, 'Email is required').email('Email must be in a valid email format (e.g., yourdomain@gmail.com)'),
    // Phone Number: Must contain exactly 10 digits and allow numeric characters only
    mobile: z.string()
        .min(1, 'Mobile number is required')
        .length(10, 'Mobile number must be exactly 10 digits')
        .regex(/^\d+$/, 'Mobile number must contain only digits'),
    addressLine1: z.string().min(1, 'Address Line 1 required'),
    addressLine2: z.string().optional(), // Optional field
    city: z.string().min(1, 'City required'),
    district: z.string().min(1, 'District required'),
    state: z.string().min(1, 'State required'),
    pincode: z.string().min(6, 'Invalid Pincode. Must be at least 6 digits').regex(/^\d+$/, 'Pincode must contain only digits'),
    country: z.string().min(1, 'Country required'),
});


// --- Constants ---
const YES_NO_OPTIONS: IChoiceGroupOption[] = [
    { key: 'yes', text: 'Yes' },
    { key: 'no', text: 'No' },
];

const GENDER_OPTIONS: IChoiceGroupOption[] = [
    { key: 'male', text: 'Male' },
    { key: 'female', text: 'Female' },
];

// Options will be loaded from API





const PersonalDetails = () => {
    const { form, onSubmit } = useRegistrationForm({
        schema: personalSchema,
        stepNumber: 2,
        defaultValues: (formData) => {
            const dobValue = getDateValue(formData, 'dob');
            return {
                scholarshipApplied: getStringValue(formData, 'scholarshipApplied'),
                gender: getStringValue(formData, 'gender'),
                community: getStringValue(formData, 'community'),
                caste: getStringValue(formData, 'caste'),
                dob: dobValue ?? new Date(),
                email: getStringValue(formData, 'email'),
                mobile: getStringValue(formData, 'mobile'),
                addressLine1: getStringValue(formData, 'addressLine1'),
                addressLine2: getStringValue(formData, 'addressLine2'),
                city: getStringValue(formData, 'city'),
                district: getStringValue(formData, 'district'),
                state: getStringValue(formData, 'state'),
                pincode: getStringValue(formData, 'pincode'),
                country: getStringValue(formData, 'country'),
            };
        },
    });

    const { control, handleSubmit, formState: { errors }, watch, setValue } = form;
    const { formData, updateFormData } = useRegistration();
    const [isHovered, setIsHovered] = useState(false);
    const [photoPreview, setPhotoPreview] = useState<string | null>(null);
    const [photoError, setPhotoError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    
    // Get email from localStorage (pre-populated from registration)
    const [userEmail, setUserEmail] = useState<string>('');

    // Dropdown options state
    const [communityOptions, setCommunityOptions] = useState<{ value: string; label: string }[]>([]);
    const [districtOptions, setDistrictOptions] = useState<{ value: string; label: string }[]>([]);
    const [stateOptions, setStateOptions] = useState<{ value: string; label: string }[]>([]);
    const [countryOptions, setCountryOptions] = useState<{ value: string; label: string }[]>([]);

    // Watch for changes to trigger dependent dropdowns
    const selectedCountry = watch('country');
    const selectedState = watch('state');

    // Load email from localStorage on mount
    useEffect(() => {
        const authData = localStorage.getItem('scholarship_auth');
        if (authData) {
            try {
                const parsedAuth = JSON.parse(authData) as { email?: string };
                const email = parsedAuth?.email ?? '';
                if (email) {
                    setUserEmail(email);
                    setValue('email', email);
                    updateFormData({ email });
                }
            } catch (error) {
                console.error('Error parsing auth data:', error);
            }
        }
    }, [setValue, updateFormData]);

    // Load dropdown options on mount
    useEffect(() => {
        const loadOptions = async () => {
            try {
                const [countries, communities] = await Promise.all([
                    dropdownOptions.getCountries(),
                    dropdownOptions.getCommunities(),
                ]);
                setCountryOptions(countries);
                setCommunityOptions(communities);
            } catch (error) {
                console.error('Error loading dropdown options:', error);
            }
        };
        void loadOptions();
    }, []);

    // Load states when country changes
    useEffect(() => {
        const loadStates = async () => {
            if (selectedCountry) {
                try {
                    const states = await dropdownOptions.getStates(selectedCountry);
                    setStateOptions(states);
                    // Only reset dependent fields if country actually changed
                    const currentCountry = formData.country;
                    if (selectedCountry !== currentCountry) {
                        setValue('state', '');
                        setValue('district', '');
                        setDistrictOptions([]);
                    }
                } catch (error) {
                    console.error('Error loading states:', error);
                }
            } else {
                setStateOptions([]);
                setDistrictOptions([]);
            }
        };
        void loadStates();
    }, [selectedCountry, setValue, formData.country]);

    // Load districts when state changes
    useEffect(() => {
        const loadDistricts = async () => {
            if (selectedState) {
                try {
                    const districts = await dropdownOptions.getDistricts(selectedState);
                    setDistrictOptions(districts);
                    // Only reset district if state actually changed
                    const currentState = formData.state;
                    if (selectedState !== currentState) {
                        setValue('district', '');
                    }
                } catch (error) {
                    console.error('Error loading districts:', error);
                }
            } else {
                setDistrictOptions([]);
            }
        };
        void loadDistricts();
    }, [selectedState, setValue, formData.state]);

    // Load existing photo if available
    useEffect(() => {
        const existingPhoto = formData.photo;
        if (existingPhoto instanceof File) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPhotoPreview(reader.result as string);
            };
            reader.readAsDataURL(existingPhoto);
        } else {
            setPhotoPreview(null);
        }
    }, [formData.photo]);

    const handlePhotoClick = () => {
        fileInputRef.current?.click();
    };

    const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        // Validate file type
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
        if (!validTypes.includes(file.type)) {
            setPhotoError('Invalid file type. Please upload PNG, JPG or JPEG image.');
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
            return;
        }

        // Validate file size (5MB)
        const MAX_SIZE = 5 * 1024 * 1024; // 5MB
        if (file.size > MAX_SIZE) {
            setPhotoError('File size exceeds 5MB limit. Please upload a smaller image.');
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
            return;
        }

        // Validate minimum dimensions (200x200 pixels)
        const img = new Image();
        const objectUrl = URL.createObjectURL(file);
        img.onload = () => {
            URL.revokeObjectURL(objectUrl);
            const MIN_WIDTH = 200;
            const MIN_HEIGHT = 200;
            
            if (img.width < MIN_WIDTH || img.height < MIN_HEIGHT) {
                setPhotoError(`Image dimensions must be at least ${MIN_WIDTH}x${MIN_HEIGHT} pixels. Current size: ${img.width}x${img.height} pixels.`);
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
                return;
            }

            // Clear previous errors
            setPhotoError(null);

            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setPhotoPreview(reader.result as string);
            };
            reader.readAsDataURL(file);

            // Store file in formData
            updateFormData({ photo: file });
        };
        img.onerror = () => {
            URL.revokeObjectURL(objectUrl);
            setPhotoError('Failed to load image. Please try again.');
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        };
        img.src = objectUrl;
    };

    return (
        <StepLayout
            title="Personal Details"
            subtitle="Fill In Your Essential Personal Information"
        >
            <form className="w-full h-full flex flex-col" onSubmit={(e) => void handleSubmit(onSubmit)(e)} id="current-step-form">
                <Stack tokens={STACK_TOKENS}>

                        {/* Profile Photo */}
                        <Stack tokens={{ childrenGap: 8 }}>
                        <Stack horizontal verticalAlign="center" tokens={{ childrenGap: 16 }}>
                            <div
                                    onClick={handlePhotoClick}
                                onMouseEnter={() => setIsHovered(true)}
                                onMouseLeave={() => setIsHovered(false)}
                                className="w-20 h-20 rounded-full cursor-pointer overflow-hidden relative bg-[#242424] opacity-50 flex items-center justify-center"
                                    style={{
                                        backgroundImage: photoPreview ? `url(${photoPreview})` : undefined,
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center',
                                    }}
                                >
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        className="hidden"
                                        accept="image/jpeg,image/jpg,image/png"
                                        onChange={handlePhotoChange}
                                    />
                                    {!photoPreview && !isHovered && (
                                    <ProfileAvatar 
                                        width={80} 
                                        height={80} 
                                        className="w-full h-full"
                                    />
                                )}
                                    {(isHovered || photoPreview) && (
                                        <div className={`absolute inset-0 flex items-center justify-center rounded-full transition-opacity duration-300 ${
                                            photoPreview ? 'bg-black bg-opacity-40 hover:bg-opacity-60' : 'bg-black bg-opacity-50'
                                        }`}>
                                        <Text variant="small" className="text-white font-semibold text-center px-2" style={{ fontSize: '10px', lineHeight: '12px' }}>
                                                {photoPreview ? 'Change Photo' : 'Click to Add Photo'}
                                        </Text>
                                    </div>
                                )}
                            </div>
                            <Stack>
                                <Text variant="medium" className="font-semibold text-gray-700 dark:text-gray-300">Profile Photo</Text>
                                    <Text variant="small" className="text-gray-500 dark:text-gray-400">Supported formats: PNG, JPG and JPEG (up to 5MB, minimum 200x200 pixels)</Text>
                                </Stack>
                            </Stack>
                            {photoError && (
                                <MessageBar messageBarType={MessageBarType.error} onDismiss={() => setPhotoError(null)}>
                                    {photoError}
                                </MessageBar>
                            )}
                        </Stack>

                        {/* Row 1: Scholarship & Gender */}
                        <FormRowContainer>
                            <FormRow>
                                <ChoiceGroupField
                                    name="scholarshipApplied"
                                    control={control}
                                    errors={errors}
                                    label="Applied for any other scholarship"
                                    required
                                    options={YES_NO_OPTIONS}
                                />
                            </FormRow>
                            <FormRow>
                                <ChoiceGroupField
                                    name="gender"
                                    control={control}
                                    errors={errors}
                                    label="Gender"
                                    required
                                    options={GENDER_OPTIONS}
                                />
                            </FormRow>
                        </FormRowContainer>

                        {/* Community */}
                        <SelectField
                            name="community"
                            control={control}
                            errors={errors}
                            label="Community"
                            required
                            options={communityOptions}
                            placeholder="Select your community"
                        />

                        {/* Row 2: Caste & DOB */}
                        <FormRowContainer>
                            <FormRow>
                                <InputField
                                    name="caste"
                                    control={control}
                                    errors={errors}
                                    label="Caste"
                                    required
                                    placeholder="Enter your caste"
                                />
                            </FormRow>
                            <FormRow>
                                <DatePickerField
                                    name="dob"
                                    control={control}
                                    errors={errors}
                                    label="Date of Birth"
                                    required
                                />
                            </FormRow>
                        </FormRowContainer>


                        {/* Row 3: Email & Mobile */}
                        <FormRowContainer>
                            <FormRow>
                                <Controller
                                    name="email"
                                    control={control}
                                    render={({ field }) => (
                                        <FormField label="Email" required error={errors.email?.message as string}>
                                            <Input
                                                {...field}
                                                value={userEmail ?? field.value ?? ''}
                                                placeholder="Email (auto-filled)"
                                                errorMessage={errors.email?.message as string}
                                                disabled
                                                readOnly
                                            />
                                        </FormField>
                                    )}
                                />
                            </FormRow>
                            <FormRow>
                                <Controller
                                    name="mobile"
                                    control={control}
                                    render={({ field }) => (
                                        <FormField label="Mobile Number" required error={errors.mobile?.message as string}>
                                            <Input
                                                {...field}
                                                value={field.value ?? ''}
                                                placeholder="Enter mobile number"
                                                errorMessage={errors.mobile?.message as string}
                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                    // Only allow digits
                                                    const value = e.target.value;
                                                    const digitsOnly = value.replace(/\D/g, '');
                                                    if (digitsOnly.length <= 10) {
                                                        field.onChange(digitsOnly);
                                                    }
                                                }}
                                            />
                                        </FormField>
                                    )}
                                />
                            </FormRow>
                        </FormRowContainer>

                        <div className={SECTION_HEADER_CLASS}>Address Details</div>

                        {/* Row 4: Address Lines */}
                        <FormRowContainer >
                            <FormRow>
                                <InputField
                                    name="addressLine1"
                                    control={control}
                                    errors={errors}
                                    label="Address Line 1"
                                    required
                                    placeholder="Address line 1"
                                />
                            </FormRow>
                            <FormRow>
                                <InputField
                                    name="addressLine2"
                                    control={control}
                                    errors={errors}
                                    label="Address Line 2"
                                    placeholder="Address line 2"
                                />
                            </FormRow>
                        </FormRowContainer>

                        {/* Row 5: Country & State */}
                        <FormRowContainer>
                            <FormRow>
                                <SelectField
                                    name="country"
                                    control={control}
                                    errors={errors}
                                    label="Country"
                                    required
                                    options={countryOptions}
                                    placeholder="Select"
                                />
                            </FormRow>
                            <FormRow>
                                <SelectField
                                    name="state"
                                    control={control}
                                    errors={errors}
                                    label="State"
                                    required
                                    options={stateOptions}
                                    placeholder="Select"
                                />
                            </FormRow>
                        </FormRowContainer>

                        {/* Row 6: District & City */}
                        <FormRowContainer>
                            <FormRow>
                                <SelectField
                                    name="district"
                                    control={control}
                                    errors={errors}
                                    label="District"
                                    required
                                    options={districtOptions}
                                    placeholder="Select"
                                />
                            </FormRow>
                            <FormRow>
                                <InputField
                                    name="city"
                                    control={control}
                                    errors={errors}
                                    label="City"
                                    required
                                    placeholder="Enter city"
                                />
                            </FormRow>
                        </FormRowContainer>

                        {/* Row 7: Pincode */}
                        <div className="w-full md:w-[calc(50%-12px)]">
                            <Controller
                                name="pincode"
                                control={control}
                                render={({ field }) => (
                                    <FormField label="Pincode" required error={errors.pincode?.message as string}>
                                        <Input
                                            {...field}
                                            value={field.value ?? ''}
                                            placeholder="Enter pincode"
                                            errorMessage={errors.pincode?.message as string}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                // Pincode: Must contain only numeric characters
                                                const value = e.target.value;
                                                const digitsOnly = value.replace(/\D/g, '');
                                                if (digitsOnly.length <= 10) {
                                                    field.onChange(digitsOnly);
                                                }
                                            }}
                                        />
                                    </FormField>
                                )}
                            />
                        </div>
                        <div className="h-5"></div>

                    </Stack>
                </form>
        </StepLayout>
    );
}

export default PersonalDetails;
