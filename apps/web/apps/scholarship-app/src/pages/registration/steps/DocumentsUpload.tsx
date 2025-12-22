import React, { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import {
    Stack,
    Text,
    FontWeights,
    mergeStyles,
    IStackStyles,
    MessageBar,
    MessageBarType,
} from '@fluentui/react';
import { useRegistration } from '@/contexts/RegistrationContext';
import { useThemeTokens } from '@/hooks/useThemeTokens';
// import { usePreviousButton } from '../hooks/usePreviousButton'; // Uncomment to use dynamic previous button
import { PdfIcon, CloseIcon, UploadIcon } from '@shared/components';

// --- Constants ---
const REQUIRED_DOCUMENTS = [
    "Birth Certificate",
    "Student ID Card",
    "Ration Card",
    "Voter ID",
    "Driving License",
    "Bank Pass Book",
    "AADHAAR ID",
    "PAN Card",
    "Bonafide (Student)",
    "Bonafide (Parent)"
];

// --- Helpers ---
function formatBytes(bytes: number, decimals = 2) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

function truncateFileName(fileName: string, maxLength = 10): string {
    if (fileName.length <= maxLength) {
        return fileName;
    }
    const extension = fileName.substring(fileName.lastIndexOf('.'));
    const nameWithoutExt = fileName.substring(0, fileName.lastIndexOf('.'));
    if (nameWithoutExt.length <= maxLength) {
        return fileName;
    }
    return `${nameWithoutExt.substring(0, maxLength)}...${extension}`;
}

// --- Styles ---
const containerStyles: IStackStyles = {
    root: {
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
    },
};

const DocumentsUpload = () => {
    const { formData, updateFormData, nextStep, markStepComplete, setIsLoading } = useRegistration();
    const tokens = useThemeTokens();
    
    // Example: Configure previous button dynamically with styling
    // import { usePreviousButton } from '../hooks/usePreviousButton';
    // const { setStep } = useRegistration();
    // usePreviousButton({
    //   onPrevious: async () => {
    //     // Custom logic before going back
    //     console.log('Going back from documents step');
    //     setStep(4); // Go to a specific step
    //   },
    //   disabled: false, // Enable/disable the button
    //   label: 'Back', // Custom label
    //   bgColor: '#F0F0F0', // Custom background color (hex)
    //   textColor: '#666666', // Custom text color (hex)
    //   // OR use Tailwind classes:
    //   // bgColor: 'bg-gray-200',
    //   // textColor: 'text-gray-600',
    //   // OR use full custom className:
    //   // className: '!bg-blue-500 !text-white hover:!bg-blue-600 h-10 rounded-lg'
    // });
    
    // Type guard to check if documents is File[]
    const getDocumentsFromFormData = (): File[] => {
        const docs = formData.documents;
        if (Array.isArray(docs) && docs.every(item => item instanceof File)) {
            return docs;
        }
        return [];
    };
    
    const [uploadedFiles, setUploadedFiles] = useState<File[]>(getDocumentsFromFormData());
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { handleSubmit } = useForm();

    // Styles using theme tokens
const titleStyles = mergeStyles({
        fontSize: parseInt(tokens.fontSizeBase600),
    fontWeight: FontWeights.semibold,
        color: tokens.colorNeutralForeground1,
    marginBottom: 4,
});

const subtitleStyles = mergeStyles({
        fontSize: parseInt(tokens.fontSizeBase300),
        color: tokens.colorNeutralForeground4,
    marginBottom: 32,
});

const uploadAreaStyles = mergeStyles({
        border: `2px dashed ${tokens.colorNeutralStroke2}`,
        borderRadius: parseInt(tokens.borderRadiusXLarge),
        backgroundColor: tokens.colorNeutralBackground1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.2s',
        padding: '40px 20px',
        width: '100%',
        height: '100%',
    selectors: {
        '&:hover': {
                borderColor: tokens.colorBrandStroke1,
                backgroundColor: tokens.colorNeutralBackground2,
        }
    }
});

const sideCardStyles = mergeStyles({
    width: '100%',
        border: `1px solid ${tokens.colorNeutralStroke2}`,
        borderRadius: parseInt(tokens.borderRadiusXLarge),
        backgroundColor: tokens.colorNeutralBackground1,
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
});

const sideCardHeaderStyles = mergeStyles({
        backgroundColor: tokens.colorNeutralBackground2,
        padding: '12px 16px',
        borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
});

const sideCardListStyles = mergeStyles({
    padding: 0,
    margin: 0,
    listStyle: 'none',
});

const sideCardItemStyles = mergeStyles({
        padding: '10px 16px',
        borderBottom: `1px solid ${tokens.colorNeutralStroke3}`,
        fontSize: parseInt(tokens.fontSizeBase300),
        color: tokens.colorNeutralForeground3,
        lineHeight: '20px',
    selectors: {
        '&:last-child': {
            borderBottom: 'none'
        }
    }
});

const fileItemStyles = mergeStyles({
        backgroundColor: tokens.colorNeutralBackground1,
        borderRadius: parseInt(tokens.borderRadiusLarge),
        border: `1px solid ${tokens.colorNeutralStroke2}`,
        padding: '6px 12px',
        marginBottom: 8,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
});

    useEffect(() => {
        const docs = getDocumentsFromFormData();
        // Only update if documents exist and are different
        if (docs.length !== uploadedFiles.length || docs.some((file, idx) => file !== uploadedFiles[idx])) {
            setUploadedFiles(docs);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [formData.documents]);

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files && files.length > 0) {
            const newFiles = Array.from(files);
            const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB in bytes
            
            // Validate file sizes
            const oversizedFiles = newFiles.filter(file => file.size > MAX_FILE_SIZE);
            if (oversizedFiles.length > 0) {
                setError(`The following file(s) exceed the 2MB limit: ${oversizedFiles.map(f => f.name).join(', ')}`);
                // Reset input
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
                return;
            }
            
            const validFiles = newFiles.filter(file => file.size <= MAX_FILE_SIZE);
            if (validFiles.length > 0) {
                const updated = [...uploadedFiles, ...validFiles];
                console.log('Files selected:', validFiles.map(f => f.name));
                console.log('Updated files array:', updated.length);
                setUploadedFiles(updated);
                updateFormData({ documents: updated });
                setError(null);
            }
            
            // Reset input to allow selecting the same file again
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const handleRemoveFile = (indexToRemove: number) => {
        const updated = uploadedFiles.filter((_, idx) => idx !== indexToRemove);
        setUploadedFiles(updated);
        updateFormData({ documents: updated });
    };

    const onDropClick = () => {
        fileInputRef.current?.click();
    };

    const onFormSubmit = async () => {
        // Validate minimum file count
        if (uploadedFiles.length < 3) {
            setError(`You must upload at least 3 documents. Currently uploaded: ${uploadedFiles.length}`);
            return;
        }
        
        // Validate all files are within size limit (double-check)
        const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
        const oversizedFiles = uploadedFiles.filter(file => file.size > MAX_FILE_SIZE);
        if (oversizedFiles.length > 0) {
            setError(`The following file(s) exceed the 2MB limit: ${oversizedFiles.map(f => f.name).join(', ')}`);
            return;
        }

        setIsLoading(true);
        try {
            // Show loading for a few seconds before moving to next step
            await new Promise(resolve => setTimeout(resolve, 2000));
            updateFormData({ documents: uploadedFiles });
            markStepComplete(5);
            nextStep(); // This now navigates to the Review & Submit step
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Stack className="w-4/5 h-full flex flex-col">
            <Stack grow verticalAlign="start" className="flex-1" style={{ minHeight: 0 }}>
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-1">Documents to be uploaded</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Provide the requested documents to complete your application.</p>

                {error && (
                    <MessageBar messageBarType={MessageBarType.error} className="mb-4">
                        {error}
                    </MessageBar>
                )}

                <form id="current-step-form" className="w-full flex-1 flex flex-col" style={{ minHeight: 0 }} onSubmit={handleSubmit(onFormSubmit)}>
                    {/* Main Layout: Grid - 70% upload area, 30% documents required initially */}
                    <div 
                        className="grid gap-8 w-full" 
                        style={{ 
                            gridTemplateColumns: uploadedFiles.length > 0 ? '60% 30% 30%' : '90% 33%',
                            alignItems: 'stretch'
                        }}
                    >
                        {/* Column 1: Upload Area (70% initially, 40% when files are uploaded) */}
                        <div className="flex flex-col h-full">
                            <div className={`${uploadAreaStyles} h-full`} onClick={onDropClick} style={{ height: '100%' }}>
                                <input
                                    type="file"
                                    multiple
                                    ref={fileInputRef}
                                    className="hidden"
                                    onChange={handleFileSelect}
                                    accept=".jpg,.jpeg,.png,.pdf"
                                />
                                <UploadIcon width={40} height={40} />
                                <Text className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-1" style={{ marginTop: '8px' }}>
                                    Click to select files
                                </Text>
                                <Text className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                    Supported formats: JPG, PNG and PDF (max 2MB per file, minimum 3 files required)
                                </Text>
                            </div>
                        </div>

                        {/* Column 2: Uploaded Files List - Only shown when files are uploaded */}
                        {uploadedFiles.length > 0 && (
                            <div className="flex flex-col h-full" style={{ minHeight: 0 }}>
                                <div className="overflow-y-auto pr-2 h-full" style={{ maxHeight: '100%' }}>
                                    <div className="grid grid-cols-1 gap-3">
                                        {uploadedFiles.map((file, idx) => (
                                            <div key={idx} className={`${fileItemStyles} bg-[#F5F5F5] dark:bg-gray-800 border-gray-200 dark:border-gray-700 border h-[56px]`}>
                                                <Stack horizontal verticalAlign="center" tokens={{ childrenGap: 12 }} style={{ width: '100%' }}>
                                                    <div className="shrink-0">
                                                        <PdfIcon width={28} height={28} />
                                                    </div>
                                                    <div style={{ flex: 1, minWidth: 0, overflow: 'hidden' }}>
                                                        <Text
                                                            className="font-semibold  dark:text-gray-100 text-[12px]"
                                                            title={file.name}
                                                            style={{ 
                                                                lineHeight: '18px', 
                                                                wordBreak: 'break-word',
                                                                display: 'block',
                                                                overflow: 'hidden',
                                                                textOverflow: 'ellipsis'
                                                            }}
                                                        >
                                                            {truncateFileName(file.name, 15)}
                                                        </Text>
                                                        <Text 
                                                            className="text-xs text-gray-500 dark:text-gray-400" 
                                                            style={{ lineHeight: '14px', marginTop: '2px', display: 'block' }}
                                                        >
                                                            {formatBytes(file.size)}
                                                        </Text>
                                                    </div>
                                                    <div 
                                                        className="shrink-0 cursor-pointer hover:opacity-70 transition-opacity"
                                                        onClick={() => handleRemoveFile(idx)}
                                                        title="Remove file"
                                                        aria-label="Remove file"
                                                    >
                                                        <CloseIcon width={18} height={18} />
                                                    </div>
                                                </Stack>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Column 3: Requirements List (30% width) - Height based on content */}
                        <div className="flex flex-col">
                            <div className={`${sideCardStyles} border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex flex-col`}>
                                <div className={`${sideCardHeaderStyles} bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 flex-shrink-0`}>
                                    <Text className=" dark:text-gray-100  text-[#424242] text-[16px] font-semibold">
                                        Documents required
                                    </Text>
                                    <Text className="text-sm text-[#707070] dark:text-gray-400 block mt-0.5">
                                        (Any 3 documents are mandatory)
                                    </Text>
                                </div>
                                <ul className={sideCardListStyles}>
                                    {REQUIRED_DOCUMENTS.map((doc, idx) => (
                                        <li key={idx} className={`${sideCardItemStyles} border-gray-100 dark:border-gray-700 text-gray-700 dark:text-gray-300 text-[12px] font-regular py-1.5`}>
                                            {doc}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                    </div>
                </form>
            </Stack>
        </Stack>
    );
};

export default DocumentsUpload;
