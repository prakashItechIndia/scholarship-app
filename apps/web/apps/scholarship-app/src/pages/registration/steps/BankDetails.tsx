import { useState, useEffect } from 'react';
import { z } from 'zod';
import { Controller } from 'react-hook-form';
import { useRegistrationForm } from '../hooks/useRegistrationForm';
import { dropdownOptions } from '@/services/scholarship.service';
import { StepLayout } from '../components/StepLayout';
import { getStringValue } from '../utils/registrationHelpers';
import { InputField, IfscCodeField, SelectField } from '../components';
import { FormField } from '../components/FormField';
import { Input } from '@shared/components';

// --- Constants ---
const SCHOLARSHIP_MIN_AMOUNT = 1000;
const SCHOLARSHIP_MAX_AMOUNT = 500000;

const SCHOLARSHIP_SEEKING_OPTIONS = [
    { value: 'tuition', label: 'Tuition' },
    { value: 'books', label: 'Books' },
    { value: 'hostel', label: 'Hostel' },
    { value: 'transport', label: 'Transport' },
    { value: 'uniform', label: 'Uniform' },
    { value: 'fees', label: 'Fees' },
    { value: 'other', label: 'Other' },
];

// --- Validation Schema ---
// Sample test data for each field:
// - bankAccountName: "John Doe" or "Rajesh Kumar"
// - bankAccountNumber: "1234567890123456" (8-18 digits)
// - bankName: Select from dropdown
// - bankBranch: "Main Branch" or "Anna Nagar Branch"
// - bankRequestAmount: "50000" or "100000" (between ₹1,000 and ₹5,00,000)
// - bankScholarshipSeekingFor: Select from dropdown (tuition, books, hostel, etc.)
// - bankIfscCode: "SBIN0001234" or "HDFC0001234" (Format: 4 letters + 0 + 6 alphanumeric)
const bankSchema = z.object({
    bankAccountName: z
        .string()
        .min(1, 'Account Name is required')
        .regex(/^[A-Za-z\s]+$/, 'Account Name must contain only alphabets and spaces'),
    // Account Number: Must be between 8 and 18 digits and contain numeric characters only
    bankAccountNumber: z
        .string()
        .min(1, 'Account Number is required')
        .regex(/^\d+$/, 'Account Number must contain only numeric characters')
        .min(8, 'Account Number must be at least 8 digits')
        .max(18, 'Account Number must not exceed 18 digits'),
    bankName: z.string().min(1, 'Bank Name is required'),
    bankBranch: z.string().min(1, 'Branch is required'),
    bankRequestAmount: z
        .string()
        .min(1, 'Request Amount is required')
        .regex(/^\d+(\.\d{1,2})?$/, 'Request Amount must be a valid number')
        .refine(
            (val) => {
                const num = parseFloat(val);
                return num >= SCHOLARSHIP_MIN_AMOUNT && num <= SCHOLARSHIP_MAX_AMOUNT;
            },
            {
                message: `Request Amount must be between ₹${SCHOLARSHIP_MIN_AMOUNT.toLocaleString('en-IN')} and ₹${SCHOLARSHIP_MAX_AMOUNT.toLocaleString('en-IN')}`,
            }
        ),
    bankScholarshipSeekingFor: z.string().min(1, 'Scholarship Seeking For is required'),
    // IFSC Code: Must be exactly 11 characters long and follow the format 4 letters + 0 + 6 alphanumeric characters (e.g., SBIN0001234)
    bankIfscCode: z
        .string()
        .min(1, 'IFSC Code is required')
        .length(11, 'IFSC Code must be exactly 11 characters')
        .regex(/^[A-Z]{4}0[A-Z0-9]{6}$/, 'IFSC Code format is invalid. Format: 4 letters + 0 + 6 alphanumeric (e.g., SBIN0001234)'),
});


const BankDetails = () => {
    const { form, onSubmit } = useRegistrationForm({
        schema: bankSchema,
        stepNumber: 5, // Step 5 - Bank Details (Step 4 is Education/Medical Details)
        defaultValues: (formData) => ({
            bankAccountName: getStringValue(formData, 'bankAccountName'),
            bankAccountNumber: getStringValue(formData, 'bankAccountNumber'),
            bankName: getStringValue(formData, 'bankName'),
            bankBranch: getStringValue(formData, 'bankBranch'),
            bankRequestAmount: getStringValue(formData, 'bankRequestAmount'),
            bankScholarshipSeekingFor: getStringValue(formData, 'bankScholarshipSeekingFor'),
            bankIfscCode: getStringValue(formData, 'bankIfscCode'),
        }),
    });

    const { control, handleSubmit, formState: { errors } } = form;
    const [bankOptions, setBankOptions] = useState<{ value: string; label: string }[]>([]);

    // Load dropdown options on mount
    useEffect(() => {
        const loadOptions = async () => {
            try {
                const banks = await dropdownOptions.getBankNames();
                setBankOptions(banks);
            } catch (error) {
                console.error('Error loading bank options:', error);
            }
        };
        void loadOptions();
    }, []);

    return (
        <StepLayout
            title="Bank details of Applicant (Student)"
            subtitle="Provide accurate bank information for scholarship disbursement."
        >
            <form className="w-full h-full flex flex-col -mt-4" onSubmit={(e) => void handleSubmit(onSubmit)(e)} id="current-step-form">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                    {/* Row 1: Name and Account Number */}
                    <div className="col-span-1 w-full">
                        <InputField
                            name="bankAccountName"
                            control={control}
                            errors={errors}
                            label="Account Holder Name (As per passbook)"
                            required
                            placeholder="Enter account holder name"
                        />
                    </div>
                    <div className="col-span-1 w-full">
                        <Controller
                            name="bankAccountNumber"
                            control={control}
                            render={({ field }) => (
                                <FormField label="Account Number" required error={errors.bankAccountNumber?.message as string}>
                                    <Input
                                        {...field}
                                        value={field.value ?? ''}
                                        placeholder="Enter account number (8-18 digits)"
                                        errorMessage={errors.bankAccountNumber?.message as string}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                            // Account Number: Must be between 8 and 18 digits and contain numeric characters only
                                            const value = e.target.value;
                                            const digitsOnly = value.replace(/\D/g, '');
                                            if (digitsOnly.length <= 18) {
                                                field.onChange(digitsOnly);
                                            }
                                        }}
                                    />
                                </FormField>
                            )}
                        />
                    </div>

                    {/* Row 2: Bank and Branch */}
                    <div className="col-span-1 w-full">
                        <SelectField
                            name="bankName"
                            control={control}
                            errors={errors}
                            label="Bank Name"
                            required
                            options={bankOptions}
                            placeholder="Select"
                        />
                    </div>
                    <div className="col-span-1 w-full">
                        <InputField
                            name="bankBranch"
                            control={control}
                            errors={errors}
                            label="Branch"
                            required
                            placeholder="Enter branch name"
                        />
                    </div>

                    {/* Row 3: Request Amount & Scholarship Seeking For */}
                    <div className="col-span-1 w-full">
                        <Controller
                            name="bankRequestAmount"
                            control={control}
                            render={({ field }) => (
                                <FormField label="Request Amount" required error={errors.bankRequestAmount?.message as string}>
                                    <Input
                                        {...field}
                                        value={field.value ?? ''}
                                        placeholder={`Enter amount (₹${SCHOLARSHIP_MIN_AMOUNT.toLocaleString('en-IN')} - ₹${SCHOLARSHIP_MAX_AMOUNT.toLocaleString('en-IN')})`}
                                        errorMessage={errors.bankRequestAmount?.message as string}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                            // Request Amount: Must contain only numbers and optionally one decimal point with up to 2 decimal places
                                            const value = e.target.value;
                                            // Allow only digits and one decimal point
                                            let filteredValue = value.replace(/[^\d.]/g, '');
                                            
                                            // Ensure only one decimal point
                                            const parts = filteredValue.split('.');
                                            if (parts.length > 2) {
                                                filteredValue = parts[0] + '.' + parts.slice(1).join('');
                                            }
                                            
                                            // Limit decimal places to 2
                                            if (parts.length === 2 && parts[1].length > 2) {
                                                filteredValue = parts[0] + '.' + parts[1].substring(0, 2);
                                            }
                                            
                                            field.onChange(filteredValue);
                                        }}
                                    />
                                </FormField>
                            )}
                        />
                    </div>
                    <div className="col-span-1 w-full">
                        <SelectField
                            name="bankScholarshipSeekingFor"
                            control={control}
                            errors={errors}
                            label="Scholarship Seeking For"
                            required
                            options={SCHOLARSHIP_SEEKING_OPTIONS}
                            placeholder="Select purpose"
                        />
                    </div>

                    {/* Row 4: IFSC Code */}
                    <div className="col-span-1 md:col-span-2 w-full">
                        <IfscCodeField
                            name="bankIfscCode"
                            control={control}
                            errors={errors}
                            label="IFSC Code"
                            required
                            placeholder="Enter IFSC code (e.g., SBIN0001234)"
                            onLookupClick={() => {
                                void window.open('http://bankifsccode.com', '_blank', 'noopener,noreferrer');
                            }}
                        />
                    </div>
                </div>
            </form>
        </StepLayout>
    );
};

export default BankDetails;
