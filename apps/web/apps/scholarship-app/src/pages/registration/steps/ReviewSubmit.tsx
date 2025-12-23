import React, { useState } from 'react';
import { Stack, Text, IStackStyles, IStackTokens, mergeStyles, FontWeights, DefaultButton, Modal, Image, PrimaryButton, IconButton } from '@fluentui/react';
import { useRegistration } from '@/contexts/RegistrationContext';
import loaderGif from '@shared/assets/icons/loader.gif';
import { PencilIcon } from '@shared/components';

// --- Styles ---
const containerStyles: IStackStyles = {
    root: {
        width: '80%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
    },
};

const stackTokens: IStackTokens = { childrenGap: 22 };
const sectionTokens: IStackTokens = { childrenGap: 16 };

const titleStyles = mergeStyles({
    fontSize: 20,
    fontWeight: FontWeights.semibold,
    color: '#111827',
    marginBottom: 4,
});

const subtitleStyles = mergeStyles({
    fontSize: 14,
    color: '#707070',
    marginBottom: 32,
});

const sectionHeaderStyles = mergeStyles({
    fontSize: 16,
    fontWeight: FontWeights.semibold,
    color: '#111827',
    display: 'flex',
    alignItems: 'center',
    gap: 12,
});

const labelStyles = mergeStyles({
    fontSize: 14,
    color: '#6b7280', // Gray text for labels
});

const valueStyles = mergeStyles({
    fontSize: 13,
    color: '#242424', // Dark text for values
    fontWeight: 600,
});

const editButtonStyles = {
    root: {
        borderRadius: 20,
        height: 28,
        padding: '0 12px',
        borderColor: '#d1d5db',
    },
    label: {
        fontSize: 12,
        fontWeight: FontWeights.semibold,
        color: '#424242',
    },
    text: {
        color: '#707070',
    },
    icon: {
        fontSize: 12        
    }
};

// Modal Styles
const loaderModalStyles = {
    main: {
        borderRadius: 8,
        padding: 24,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        // Remove fixed dimensions to ensuring the box wraps the content symmetrically
        minWidth: 'auto',
        minHeight: 'auto',
    }
};

const successModalStyles = {
    main: {
        borderRadius: 12,
        padding: 0,
        maxWidth: 500,
        minWidth: 400,
    }
};

const checkIconStyles = mergeStyles({
    fontSize: 48,
    color: 'white',
});

const checkCircleStyles = mergeStyles({
    width: 80,
    height: 80,
    borderRadius: '50%',
    backgroundColor: '#39db4a', // Bright Green
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 12px rgba(34, 197, 94, 0.3)',
    marginBottom: 24,
    position: 'relative',
});

// Sparkles (Pseudo-elements simulation for simplicity or could be SVG)
const sparkleStyles = mergeStyles({
    position: 'absolute',
    top: -10,
    right: -10,
    fontSize: 24,
    color: '#86efac',
});


const ReviewSubmit = () => {
    const { formData, prevStep, setStep } = useRegistration();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    // Helper to render value or placeholder
    const displayValue = (val: string | number | Date | File[] | undefined | null): string => {
        if (!val) return '-';
        if (typeof val === 'string') return val;
        if (typeof val === 'number') return val.toString();
        if (val instanceof Date) return val.toLocaleDateString('en-GB');
        if (Array.isArray(val)) return val.length > 0 ? `${val.length} item(s)` : '-';
        return '-';
    };

    // Helper for formatting date
    const formatDate = (dateValue: string | number | Date | File[] | undefined | null): string => {
        if (!dateValue) return '-';
        if (dateValue instanceof Date) {
            return dateValue.toLocaleDateString('en-GB'); // DD/MM/YYYY
        }
        if (typeof dateValue === 'string') {
            try {
                const date = new Date(dateValue);
                return date.toLocaleDateString('en-GB'); // DD/MM/YYYY
            } catch (e) {
                return dateValue;
            }
        }
        return '-';
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate API call delay
        setTimeout(() => {
            setIsSubmitting(false);
            setIsSuccess(true);
        }, 4500); // 4.5 seconds
    };

    const handleSuccessClose = () => {
        setIsSuccess(false);
        window.location.href = '/user-dashboard';
    };

    const renderRow = (label: string, value: string | number | Date | File[] | undefined | null) => (
        <div className="flex flex-col md:flex-row md:items-start gap-1 md:gap-0">
            <Text className={`${labelStyles} w-full md:w-[340px]`}>{label}</Text>
            <Text className={valueStyles}>{displayValue(value)}</Text>
        </div>
    );

    return (
        <form id="current-step-form" onSubmit={handleSubmit} style={{ width: '100%', height: '100%' }}>
            {/* Loader Modal */}
            <Modal
                isOpen={isSubmitting}
                isBlocking={true}
                containerClassName={mergeStyles(loaderModalStyles.main)}
            >
                <Image src={loaderGif} alt="Loading..." width={200} height={200} />
            </Modal>

            {/* Success Modal */}
            <Modal
                isOpen={isSuccess}
                isBlocking={true}
                containerClassName={mergeStyles(successModalStyles.main)}
            >
                <div style={{ padding: 24, position: 'relative' }}>
                    <Stack horizontal horizontalAlign="end">
                        <IconButton
                            iconProps={{ iconName: 'Cancel' }}
                            onClick={handleSuccessClose}
                            styles={{ root: { color: '#9ca3af', position: 'absolute', top: 8, right: 8 } }}
                        />
                    </Stack>

                    <Stack horizontalAlign="center" styles={{ root: { marginTop: 20, marginBottom: 20 } }}>
                        <div className={checkCircleStyles}>
                            <Text className={checkIconStyles}>✓</Text>
                            <div className={sparkleStyles}>✨</div>
                        </div>

                        <Text variant="xLarge" style={{ fontWeight: 700, color: '#111827', marginBottom: 16 }}>
                            Application Submitted!
                        </Text>

                        <Text style={{ textAlign: 'center', color: '#4b5563', lineHeight: '1.5', marginBottom: 24, maxWidth: '90%' }}>
                            Your scholarship application is successfully received.
                            Please note this Application Number <strong>AF2510001</strong> for further reference.
                            Track your status anytime by logging in.
                            <br />
                            Contact <strong>admission@aram.in</strong> or <strong>+91 12345 67890</strong>.
                            <br />
                            Thank you for applying!
                        </Text>

                        <PrimaryButton
                            text="Ok"
                            onClick={handleSuccessClose}
                            styles={{ root: { minWidth: 100, borderRadius: 6, backgroundColor: '#1d4ed8' } }}
                        />
                    </Stack>
                </div>
            </Modal>

            <Stack styles={containerStyles}>
                <Stack grow verticalAlign="start">
                    <h2 className={titleStyles}>Review & Submit Application</h2>
                    <p className={subtitleStyles}>Verify all information and submit to complete your application.</p>

                    <Stack tokens={stackTokens}>

                        {/* Identity Details */}
                        <Stack tokens={sectionTokens} style={{ marginTop: '-1rem' }}>
                            <div className={sectionHeaderStyles}>
                                Identity Details
                                <DefaultButton
                                    text="Edit"
                                    onRenderIcon={() => <PencilIcon width={12} height={12} />}
                                    styles={editButtonStyles}
                                    onClick={() => prevStep()}
                                />
                            </div>
                            <Stack tokens={sectionTokens}>
                                {renderRow('What describes you better', formData.applicantType === 'research_scholar' ? 'I am a Research Scholar seeking Scholarship' : formData.applicantType)}
                                {renderRow('AADHAAR ID (Candidate)', formData.aadhaarId)}
                                {renderRow('PAN ID (Candidate)', formData.panId)}
                            </Stack>
                        </Stack>

                        {/* Personal Details */}
                        <Stack tokens={sectionTokens}>
                            <div className={sectionHeaderStyles}>
                                Personal Details
                                <DefaultButton
                                    text="Edit"
                                    onRenderIcon={() => <PencilIcon width={12} height={12} />}
                                    styles={editButtonStyles}
                                    onClick={() => prevStep()}
                                />
                            </div>
                            <Stack tokens={sectionTokens}>
                                {renderRow('Applied for any other scholarship', formData.scholarshipApplied === 'yes' ? 'Yes' : (formData.scholarshipApplied === 'no' ? 'No' : displayValue(formData.scholarshipApplied)))}
                                {renderRow('Gender', typeof formData.gender === 'string' ? formData.gender.charAt(0).toUpperCase() + formData.gender.slice(1) : '-')}
                                {renderRow('Community', typeof formData.community === 'string' ? formData.community.toUpperCase() : '-')}
                                {renderRow('Caste', formData.caste)}
                                {renderRow('Date of Birth', formatDate(formData.dob))}
                                {renderRow('Email', formData.email)}
                                {renderRow('Mobile Number', formData.mobile)}
                                {renderRow('Address', `${displayValue(formData.addressLine1)}${formData.addressLine2 ? `, ${displayValue(formData.addressLine2)}` : ''}`)}
                                {renderRow('City / District', (() => {
                                    const city = displayValue(formData.city);
                                    const district = displayValue(formData.district);
                                    if (city !== '-' && district !== '-') {
                                        return `${city} / ${district}`;
                                    } else if (city !== '-') {
                                        return city;
                                    } else if (district !== '-') {
                                        return district;
                                    }
                                    return '-';
                                })())}
                                {renderRow('State / Country', (() => {
                                    const state = displayValue(formData.state);
                                    const country = displayValue(formData.country);
                                    if (state !== '-' && country !== '-') {
                                        return `${state} / ${country}`;
                                    } else if (state !== '-') {
                                        return state;
                                    } else if (country !== '-') {
                                        return country;
                                    }
                                    return '-';
                                })())}
                                {renderRow('Pincode', formData.pincode)}
                            </Stack>
                        </Stack>

                        {/* Family Details */}
                        <Stack tokens={sectionTokens}>
                            <div className={sectionHeaderStyles}>
                                Family details
                                <DefaultButton
                                    text="Edit"
                                    onRenderIcon={() => <PencilIcon width={12} height={12} />}
                                    styles={editButtonStyles}
                                    onClick={() => setStep(3)}
                                />
                            </div>
                            <Stack tokens={sectionTokens}>
                                {renderRow('Student ID (if known)', formData.studentId)}
                                {renderRow('Name of Applicant', formData.fullName)}

                                {/* Father */}
                                {renderRow("Father's Name", formData.fatherName)}
                                {renderRow("Father's Occupation", formData.fatherOccupation)}
                                {renderRow("Father Designation", formData.fatherDesignation)}
                                {renderRow("Father Organization Name", formData.fatherOrganization)}
                                {renderRow("Father Annual Income", formData.fatherIncome)}

                                {/* Mother */}
                                {renderRow("Mother's Name", formData.motherName)}
                                {renderRow("Mother's Occupation", formData.motherOccupation)}
                                {renderRow("Mother Designation", formData.motherDesignation)}
                                {renderRow("Mother Organization Name", formData.motherOrganization)}
                                {renderRow("Mother Annual Income", formData.motherIncome)}

                                {/* Guardian */}
                                {renderRow("Guardian Name", formData.guardianName)}
                                {renderRow("Guardian Occupation", formData.guardianOccupation)}
                                {renderRow("Guardian Designation", formData.guardianDesignation)}
                                {renderRow("Guardian Organization Name", formData.guardianOrganization)}
                                {renderRow("Guardian Annual Income", formData.guardianIncome)}
                            </Stack>
                        </Stack>

                        {/* Bank Details */}
                        <Stack tokens={sectionTokens}>
                            <div className={sectionHeaderStyles}>
                                Bank details of Applicant
                                <DefaultButton
                                    text="Edit"
                                    onRenderIcon={() => <PencilIcon width={12} height={12} />}
                                    styles={editButtonStyles}
                                    onClick={() => setStep(4)}
                                />
                            </div>
                            <Stack tokens={sectionTokens}>
                                {renderRow('Account Holder Name', formData.bankAccountName)}
                                {renderRow('Account Number', formData.bankAccountNumber)}
                                {renderRow('Bank Name', formData.bankName)}
                                {renderRow('Branch Name', formData.bankBranch)}
                                {renderRow('IFSC Code', formData.bankIfscCode)}
                                {renderRow('Request Amount', formData.bankRequestAmount)}
                                {renderRow('Scholarship Seeking For', formData.bankScholarshipSeekingFor)}
                            </Stack>
                        </Stack>

                        {/* Documents Details */}
                        <Stack tokens={sectionTokens}>
                            <div className={sectionHeaderStyles}>
                                Documents Uploaded
                                <DefaultButton
                                    text="Edit"
                                    onRenderIcon={() => <PencilIcon width={12} height={12} />}
                                    styles={editButtonStyles}
                                    onClick={() => setStep(5)}
                                />
                            </div>
                            <Stack tokens={sectionTokens}>
                                <Text className={valueStyles}>
                                    {formData.documents && Array.isArray(formData.documents) && formData.documents.length > 0
                                        ? `${formData.documents.length} document(s) uploaded`
                                        : 'No documents uploaded'}
                                </Text>
                            </Stack>
                        </Stack>
                        <div className="h-5"></div>

                    </Stack>
                </Stack>
            </Stack>
        </form>
    );
};
export default ReviewSubmit;