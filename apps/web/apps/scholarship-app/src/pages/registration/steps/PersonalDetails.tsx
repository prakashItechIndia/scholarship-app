import { useState } from 'react';
import { z } from 'zod';
import { Stack, IChoiceGroupOption, Text, Image, ImageFit } from '@fluentui/react';
import { useRegistrationForm } from '../hooks/useRegistrationForm';
import { StepLayout } from '../components/StepLayout';
import { getStringValue, getDateValue } from '../utils/registrationHelpers';
import { STACK_TOKENS, SECTION_HEADER_CLASS } from '../utils/registrationConstants';
import { InputField, SelectField, DatePickerField, ChoiceGroupField, FormRowContainer, FormRow } from '../components';

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
    email: z.string().email('Invalid email').min(1, 'Email is required'),
    mobile: z.string().length(10, 'Mobile number must be exactly 10 digits').regex(/^\d+$/, 'Mobile number must contain only digits'),
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
    { key: 'other', text: 'Other' },
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

    const { control, handleSubmit, formState: { errors } } = form;
    const [isHovered, setIsHovered] = useState(false);

    return (
        <StepLayout
            title="Personal Details"
            subtitle="Fill In Your Essential Personal Information"
        >
            <form className="w-full h-full flex flex-col" onSubmit={(e) => void handleSubmit(onSubmit)(e)} id="current-step-form">
                <Stack tokens={STACK_TOKENS}>

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
                                <Text variant="medium" className="font-semibold text-gray-700 dark:text-gray-300">Profile Photo</Text>
                                <Text variant="small" className="text-gray-500 dark:text-gray-400">Supported formats: PNG, JPG and JPEG (up to 5MB)</Text>
                            </Stack>
                        </Stack>

                        {/* Row 1: Scholarship & Gender */}
                        <FormRowContainer wrap>
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
                            options={COMMUNITY_OPTIONS}
                            placeholder="Select your community"
                        />

                        {/* Row 2: Caste & DOB */}
                        <FormRowContainer>
                            <FormRow>
                                <SelectField
                                    name="caste"
                                    control={control}
                                    errors={errors}
                                    label="Caste"
                                    options={CASTE_OPTIONS}
                                    placeholder="Select your caste"
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
                                <InputField
                                    name="email"
                                    control={control}
                                    errors={errors}
                                    label="Email"
                                    required
                                    placeholder="Enter email ID"
                                />
                            </FormRow>
                            <FormRow>
                                <InputField
                                    name="mobile"
                                    control={control}
                                    errors={errors}
                                    label="Mobile Number"
                                    required
                                    placeholder="Enter mobile number"
                                />
                            </FormRow>
                        </FormRowContainer>

                        <div className={SECTION_HEADER_CLASS}>Address Details</div>

                        {/* Row 4: Address Lines */}
                        <FormRowContainer>
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

                        {/* Row 5: City & District */}
                        <FormRowContainer>
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
                            <FormRow>
                                <SelectField
                                    name="district"
                                    control={control}
                                    errors={errors}
                                    label="District"
                                    required
                                    options={DISTRICT_OPTIONS}
                                    placeholder="Select"
                                />
                            </FormRow>
                        </FormRowContainer>


                        {/* Row 6: State & Pincode */}
                        <FormRowContainer>
                            <FormRow>
                                <SelectField
                                    name="state"
                                    control={control}
                                    errors={errors}
                                    label="State"
                                    required
                                    options={STATE_OPTIONS}
                                    placeholder="Select"
                                />
                            </FormRow>
                            <FormRow>
                                <InputField
                                    name="pincode"
                                    control={control}
                                    errors={errors}
                                    label="Pincode"
                                    required
                                    placeholder="Enter pincode"
                                />
                            </FormRow>
                        </FormRowContainer>

                        {/* Country */}
                        <div className="max-w-[50%]">
                            <SelectField
                                name="country"
                                control={control}
                                errors={errors}
                                label="Country"
                                required
                                options={COUNTRY_OPTIONS}
                                placeholder="Select"
                            />
                        </div>
                        <div className="h-5"></div>

                    </Stack>
                </form>
        </StepLayout>
    );
}

export default PersonalDetails;
