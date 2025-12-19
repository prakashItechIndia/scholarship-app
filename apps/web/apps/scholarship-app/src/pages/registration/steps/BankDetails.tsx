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
    const { formData, updateFormData, nextStep, markStepComplete } = useRegistration();

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

    const onSubmit = (data: BankFormData) => {
        console.log('Bank Step Data:', data);
        updateFormData(data);
        markStepComplete(4);
        nextStep();
    };

    return (
        <Stack styles={containerStyles}>
            <Stack grow verticalAlign="start">
                <h2 className={titleStyles}>Bank details of Applicant (Student)</h2>
                <p className={subtitleStyles}>Provide accurate bank information for scholarship disbursement.</p>

                <form style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }} onSubmit={handleSubmit(onSubmit)} id="current-step-form">
                    <Stack tokens={stackTokens}>

                        {/* Row 1: Name and Account Number */}
                        <Stack horizontal tokens={rowTokens} wrap>
                            <Stack.Item grow={1} styles={{ root: { minWidth: 250 } }}>
                                <Controller
                                    name="bankAccountName"
                                    control={control}
                                    render={({ field }) => (
                                        <Stack>
                                            <label className={labelStyles}>Name (As per passbook) <span style={asteriskStyle}>*</span></label>
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
                            <Stack.Item grow={1} styles={{ root: { minWidth: 250 } }}>
                                <Controller
                                    name="bankAccountNumber"
                                    control={control}
                                    render={({ field }) => (
                                        <Stack>
                                            <label className={labelStyles}>Account Number <span style={asteriskStyle}>*</span></label>
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
                            <Stack.Item grow={1} styles={{ root: { minWidth: 250 } }}>
                                <Controller
                                    name="bankName"
                                    control={control}
                                    render={({ field }) => (
                                        <Stack>
                                            <label className={labelStyles}>Bank Name <span style={asteriskStyle}>*</span></label>
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
                            <Stack.Item grow={1} styles={{ root: { minWidth: 250 } }}>
                                <Controller
                                    name="bankBranch"
                                    control={control}
                                    render={({ field }) => (
                                        <Stack>
                                            <label className={labelStyles}>Branch <span style={asteriskStyle}>*</span></label>
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
                            <Stack.Item grow={1} styles={{ root: { minWidth: 250 } }}>
                                <Controller
                                    name="bankRequestAmount"
                                    control={control}
                                    render={({ field }) => (
                                        <Stack>
                                            <label className={labelStyles}>Request Amount <span style={asteriskStyle}>*</span></label>
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
                            <Stack.Item grow={1} styles={{ root: { minWidth: 250 } }}>
                                <Controller
                                    name="bankScholarshipSeekingFor"
                                    control={control}
                                    render={({ field }) => (
                                        <Stack>
                                            <label className={labelStyles}>Scholarship Seeking For <span style={asteriskStyle}>*</span></label>
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
                            <Stack.Item grow={1} styles={{ root: { width: '50%', minWidth: 250 } }}>
                                <Controller
                                    name="bankIfscCode"
                                    control={control}
                                    render={({ field }) => (
                                        <Stack>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <label className={labelStyles} style={{ marginBottom: 0 }}>IFSC Code <span style={asteriskStyle}>*</span></label>
                                                <span className={lookupLinkStyle}>(Lookup IFSC Code)</span>
                                            </div>
                                            <TextField
                                                {...field}
                                                placeholder="Enter IFSC code"
                                                errorMessage={errors.bankIfscCode?.message}
                                                styles={{
                                                    ...textFieldStyles,
                                                    root: { marginTop: 6 } // manual spacing since label wrapper is custom
                                                }}
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
