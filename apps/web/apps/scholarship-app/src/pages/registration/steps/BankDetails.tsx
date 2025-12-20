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
import { Label } from '@shared/components';
import { useRegistration } from '@/contexts/RegistrationContext';

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

type BankFormData = z.infer<typeof bankSchema>;

// --- Constants ---
const BANK_OPTIONS: IDropdownOption[] = [
    { key: 'sbi', text: 'State Bank of India' },
    { key: 'hdfc', text: 'HDFC Bank' },
    { key: 'icici', text: 'ICICI Bank' },
    { key: 'iob', text: 'Indian Overseas Bank' },
    // Add more banks as needed
];

const BRANCH_OPTIONS: IDropdownOption[] = [
    { key: 'main', text: 'Main Branch' },
    { key: 'city', text: 'City Branch' },
    // Add more branches as needed
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
    marginBottom: 32, // Gap for layout
});

const labelStyles = mergeStyles({
    fontWeight: 600,
    fontSize: 14,
    color: '#374151',
    marginBottom: 6,
    display: 'block'
});

const asteriskStyle = { color: '#ef4444' };
const lookupLinkStyle = mergeStyles({
    float: 'right',
    color: '#ef4444', // Red-ish check for 'Lookup IFSC Code'
    fontSize: 12,
    cursor: 'pointer',
    fontWeight: 500,
    textDecoration: 'none'
});

const dropdownStyles = {
    dropdown: { width: '100%' },
    title: { height: 42, lineHeight: 40, borderRadius: 4, borderColor: '#d1d5db' },
};

const textFieldStyles = {
    fieldGroup: { height: 42, borderRadius: 4, borderColor: '#d1d5db' }
};

const BankDetails = () => {
    const { formData, updateFormData, nextStep, markStepComplete, setIsLoading } = useRegistration();

    const {
        control,
        handleSubmit,
        getValues,
        formState: { errors },
    } = useForm<BankFormData>({
        resolver: zodResolver(bankSchema),
        defaultValues: {
            bankAccountName: formData.bankAccountName || '',
            bankAccountNumber: formData.bankAccountNumber || '',
            bankName: formData.bankName || '',
            bankBranch: formData.bankBranch || '',
            bankRequestAmount: formData.bankRequestAmount || '',
            bankScholarshipSeekingFor: formData.bankScholarshipSeekingFor || '',
            bankIfscCode: formData.bankIfscCode || '',
        },
    });

    // Save data to context on unmount
    useEffect(() => {
        return () => {
            updateFormData(getValues());
        };
    }, [updateFormData, getValues]);

    const onSubmit = async (data: BankFormData) => {
        console.log('Bank Step Data:', data);
        setIsLoading(true);
        try {
            // Show loading for a few seconds before moving to next step
            await new Promise(resolve => setTimeout(resolve, 2000));
            updateFormData(data);
            markStepComplete(4);
            nextStep();
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Stack className="w-4/5 h-full flex flex-col">
            <Stack grow verticalAlign="start">
                <h2 className="text-2xl font-semibold text-gray-900 mb-1">Bank details of Applicant (Student)</h2>
                <p className="text-sm text-gray-500 mb-8">Provide accurate bank information for scholarship disbursement.</p>

                <form className="w-full h-full flex flex-col" onSubmit={handleSubmit(onSubmit)} id="current-step-form">
                    <Stack tokens={stackTokens}>

                        {/* Row 1: Name and Account Number */}
                        <Stack horizontal tokens={rowTokens} wrap>
                            <Stack.Item grow={1} className="min-w-[250px]">
                                <Controller
                                    name="bankAccountName"
                                    control={control}
                                    render={({ field }) => (
                                        <Stack>
                                            <Label required>Name (As per passbook)</Label>
                                            <TextField
                                                {...field}
                                                placeholder="Enter name"
                                                errorMessage={errors.bankAccountName?.message}
                                                styles={textFieldStyles}
                                            />
                                        </Stack>
                                    )}
                                />
                            </Stack.Item>
                            <Stack.Item grow={1} className="min-w-[250px]">
                                <Controller
                                    name="bankAccountNumber"
                                    control={control}
                                    render={({ field }) => (
                                        <Stack>
                                            <Label required>Account Number</Label>
                                            <TextField
                                                {...field}
                                                placeholder="Enter account number"
                                                errorMessage={errors.bankAccountNumber?.message}
                                                styles={textFieldStyles}
                                            />
                                        </Stack>
                                    )}
                                />
                            </Stack.Item>
                        </Stack>

                        {/* Row 2: Bank and Branch */}
                        <Stack horizontal tokens={rowTokens} wrap>
                            <Stack.Item grow={1} className="min-w-[250px]">
                                <Controller
                                    name="bankName"
                                    control={control}
                                    render={({ field }) => (
                                        <Stack>
                                            <Label required>Bank Name</Label>
                                            <Dropdown
                                                selectedKey={field.value}
                                                onChange={(_, opt) => field.onChange(opt?.key)}
                                                placeholder="Select"
                                                options={BANK_OPTIONS}
                                                errorMessage={errors.bankName?.message}
                                                styles={dropdownStyles}
                                            />
                                        </Stack>
                                    )}
                                />
                            </Stack.Item>
                            <Stack.Item grow={1} className="min-w-[250px]">
                                <Controller
                                    name="bankBranch"
                                    control={control}
                                    render={({ field }) => (
                                        <Stack>
                                            <Label required>Branch</Label>
                                            <Dropdown
                                                selectedKey={field.value}
                                                onChange={(_, opt) => field.onChange(opt?.key)}
                                                placeholder="Select"
                                                options={BRANCH_OPTIONS}
                                                errorMessage={errors.bankBranch?.message}
                                                styles={dropdownStyles}
                                            />
                                        </Stack>
                                    )}
                                />
                            </Stack.Item>
                        </Stack>

                        {/* Row 3: Request Amount & Scholarship Seeking For */}
                        <Stack horizontal tokens={rowTokens} wrap>
                            <Stack.Item grow={1} className="min-w-[250px]">
                                <Controller
                                    name="bankRequestAmount"
                                    control={control}
                                    render={({ field }) => (
                                        <Stack>
                                            <Label required>Request Amount</Label>
                                            <TextField
                                                {...field}
                                                placeholder="Enter Request amount"
                                                errorMessage={errors.bankRequestAmount?.message}
                                                styles={textFieldStyles}
                                            />
                                        </Stack>
                                    )}
                                />
                            </Stack.Item>
                            <Stack.Item grow={1} className="min-w-[250px]">
                                <Controller
                                    name="bankScholarshipSeekingFor"
                                    control={control}
                                    render={({ field }) => (
                                        <Stack>
                                            <Label required>Scholarship Seeking For</Label>
                                            <TextField
                                                {...field}
                                                placeholder="Enter Scholarship Seeking For"
                                                errorMessage={errors.bankScholarshipSeekingFor?.message}
                                                styles={textFieldStyles}
                                            />
                                        </Stack>
                                    )}
                                />
                            </Stack.Item>
                        </Stack>

                        {/* Row 4: IFSC Code (Half width) */}
                        <Stack horizontal tokens={rowTokens} wrap>
                            <Stack.Item grow={1} className="w-1/2 min-w-[250px]">
                                <Controller
                                    name="bankIfscCode"
                                    control={control}
                                    render={({ field }) => (
                                        <Stack>
                                            <div className="flex justify-between items-center">
                                                <Label required className="mb-0">IFSC Code</Label>
                                                <span className="float-right text-[#ef4444] text-xs cursor-pointer font-medium no-underline">(Lookup IFSC Code)</span>
                                            </div>
                                            <TextField
                                                {...field}
                                                placeholder="Enter IFSC code"
                                                errorMessage={errors.bankIfscCode?.message}
                                                styles={{
                                                    ...textFieldStyles,
                                                    root: { marginTop: 6 } // manual spacing since label wrapper is custom
                                                }}
                                                className="mt-1.5"
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

export default BankDetails;
