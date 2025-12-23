import { z } from 'zod';
import { IDropdownOption } from '@fluentui/react';
import { useRegistrationForm } from '../hooks/useRegistrationForm';
import { StepLayout } from '../components/StepLayout';
import { getStringValue } from '../utils/registrationHelpers';
import { InputField, IfscCodeField, SelectField } from '../components';

// --- Validation Schema ---
const bankSchema = z.object({
    bankAccountName: z.string().min(1, 'Account Name is required'),
    bankAccountNumber: z.string().min(1, 'Account Number is required'),
    bankName: z.string().min(1, 'Bank Name is required'),
    bankBranch: z.string().min(1, 'Branch is required'),
    bankRequestAmount: z.string().min(1, 'Request Amount is required'),
    bankScholarshipSeekingFor: z.string().min(1, 'This field is required'),
    bankIfscCode: z.string().min(1, 'IFSC Code is required'),
});

// --- Constants ---
const BANK_OPTIONS: { value: string; label: string }[] = [
    { value: 'sbi', label: 'State Bank of India' },
    { value: 'hdfc', label: 'HDFC Bank' },
    { value: 'icici', label: 'ICICI Bank' },
    { value: 'iob', label: 'Indian Overseas Bank' },
    // Add more banks as needed
];

const BRANCH_OPTIONS: { value: string; label: string }[] = [
    { value: 'main', label: 'Main Branch' },
    { value: 'city', label: 'City Branch' },
    // Add more branches as needed
];


const BankDetails = () => {
    const { form, onSubmit } = useRegistrationForm({
        schema: bankSchema,
        stepNumber: 4,
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

    return (
        <StepLayout
            title="Bank details of Applicant (Student)"
            subtitle="Provide accurate bank information for scholarship disbursement."
        >
            <form className="w-full h-full flex flex-col -mt-4" onSubmit={handleSubmit(onSubmit)} id="current-step-form">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                    {/* Row 1: Name and Account Number */}
                    <div className="col-span-1 w-full">
                        <InputField
                            name="bankAccountName"
                            control={control}
                            errors={errors}
                            label="Name (As per passbook)"
                            required
                            placeholder="Enter name"
                        />
                    </div>
                    <div className="col-span-1 w-full">
                        <InputField
                            name="bankAccountNumber"
                            control={control}
                            errors={errors}
                            label="Account Number"
                            required
                            placeholder="Enter account number"
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
                            options={BANK_OPTIONS}
                            placeholder="Select"
                        />
                    </div>
                    <div className="col-span-1 w-full">
                        <SelectField
                            name="bankBranch"
                            control={control}
                            errors={errors}
                            label="Branch"
                            required
                            options={BRANCH_OPTIONS}
                            placeholder="Select"
                        />
                    </div>

                    {/* Row 3: Request Amount & Scholarship Seeking For */}
                    <div className="col-span-1 w-full">
                        <InputField
                            name="bankRequestAmount"
                            control={control}
                            errors={errors}
                            label="Request Amount"
                            required
                            placeholder="Enter Request amount"
                        />
                    </div>
                    <div className="col-span-1 w-full">
                        <InputField
                            name="bankScholarshipSeekingFor"
                            control={control}
                            errors={errors}
                            label="Scholarship Seeking For"
                            required
                            placeholder="Enter Scholarship Seeking For"
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
                            placeholder="Enter IFSC code"
                        />
                    </div>
                </div>
            </form>
        </StepLayout>
    );
};

export default BankDetails;
