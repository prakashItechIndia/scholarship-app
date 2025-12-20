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
    IconButton,
} from '@fluentui/react';
import { useRegistration } from '@/contexts/RegistrationContext';
import { useThemeTokens } from '@/hooks/useThemeTokens';

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

// --- Styles ---
const containerStyles: IStackStyles = {
    root: {
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
    },
};

// --- Icons ---
const UploadIcon = () => (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-gray-400" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="17 8 12 3 7 8" />
        <line x1="12" y1="3" x2="12" y2="15" />
    </svg>
);

const PdfIcon = () => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-red-500">
        <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="var(--red-50, #fef2f2)" />
        <path d="M14 2V8H20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M8 13H10.5C11.328 13 12 13.672 12 14.5C12 15.328 11.328 16 10.5 16H8V13Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M8 13V18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const ImageIcon = () => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-blue-500">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" stroke="currentColor" strokeWidth="1.5" fill="var(--blue-50, #eff6ff)" />
        <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor" />
        <polyline points="21 15 16 10 5 21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const DocumentsUpload = () => {
    const { formData, updateFormData, nextStep, markStepComplete, setIsLoading } = useRegistration();
    const tokens = useThemeTokens();
    
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
        minHeight: 400,
        padding: '40px 20px',
        width: '100%',
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
    height: 'fit-content',
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
        padding: '10px 12px',
        marginBottom: 10,
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
        if (event.target.files) {
            const newFiles = Array.from(event.target.files);
            const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB in bytes
            
            // Validate file sizes
            const oversizedFiles = newFiles.filter(file => file.size > MAX_FILE_SIZE);
            if (oversizedFiles.length > 0) {
                setError(`The following file(s) exceed the 2MB limit: ${oversizedFiles.map(f => f.name).join(', ')}`);
                return;
            }
            
            const validFiles = newFiles.filter(file => file.size <= MAX_FILE_SIZE);
            const updated = [...uploadedFiles, ...validFiles];
            setUploadedFiles(updated);
            updateFormData({ documents: updated });
            setError(null);
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

    // Helper to check file type
    const isImage = (file: File) => {
        // Check MIME type or extension fallback
        return file.type.startsWith('image/') || /\.(jpg|jpeg|png|gif|webp)$/i.test(file.name);
    };

    return (
        <Stack className="w-4/5 h-full flex flex-col">
            <Stack grow verticalAlign="start">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-1">STEP 5/5 Documents to be uploaded</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Provide the requested documents to complete your application.</p>

                {error && (
                    <MessageBar messageBarType={MessageBarType.error} className="mb-4">
                        {error}
                    </MessageBar>
                )}

                <form id="current-step-form" className="w-full h-full" onSubmit={handleSubmit(onFormSubmit)}>
                    {/* Main Layout: 3 Columns */}
                    <Stack horizontal tokens={{ childrenGap: 20 }} wrap={false} className="w-full">

                        {/* Column 1: Upload Area (Flexible width, maybe 40-50%) */}
                        <Stack.Item grow={2} className="min-w-[300px]">
                            <div className={uploadAreaStyles} onClick={onDropClick}>
                                <input
                                    type="file"
                                    multiple
                                    ref={fileInputRef}
                                    className="hidden"
                                    onChange={handleFileSelect}
                                    accept=".jpg,.jpeg,.png,.pdf"
                                />
                                <UploadIcon />
                                <Text className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-1" style={{ marginTop: '8px' }}>
                                    Click to select files
                                </Text>
                                <Text className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                    Supported formats: JPG, PNG and PDF (max 2MB per file, minimum 3 files required)
                                </Text>
                            </div>
                        </Stack.Item>

                        {/* Column 2: Uploaded Files List (Fixed width or percentage, maybe 25%) */}
                        {uploadedFiles.length > 0 && (
                            <Stack.Item className="w-[320px] min-w-[280px]">
                                <Stack tokens={{ childrenGap: 0 }}>
                                    {uploadedFiles.map((file, idx) => (
                                        <div key={idx} className={`${fileItemStyles} bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700`}>
                                            <Stack horizontal verticalAlign="center" tokens={{ childrenGap: 12 }} className="overflow-hidden" style={{ flex: 1 }}>
                                                <div className="shrink-0">
                                                    {isImage(file) ? <ImageIcon /> : <PdfIcon />}
                                                </div>
                                                <Stack className="overflow-hidden" style={{ minWidth: 0, flex: 1 }}>
                                                    <Text
                                                        className="font-semibold text-gray-900 dark:text-gray-100 text-sm whitespace-nowrap overflow-hidden text-ellipsis"
                                                        title={file.name}
                                                        style={{ lineHeight: '20px' }}
                                                    >
                                                        {file.name}
                                                    </Text>
                                                    <Text className="text-xs text-gray-500 dark:text-gray-400" style={{ lineHeight: '16px', marginTop: '2px' }}>
                                                        {formatBytes(file.size)}
                                                    </Text>
                                                </Stack>
                                            </Stack>
                                            <IconButton
                                                iconProps={{ iconName: 'Cancel' }}
                                                title="Remove file"
                                                ariaLabel="Remove file"
                                                onClick={() => handleRemoveFile(idx)}
                                                className="shrink-0"
                                                styles={{
                                                    root: { 
                                                        color: tokens.colorNeutralForeground4,
                                                        height: 24, 
                                                        width: 24,
                                                        minWidth: 24
                                                    },
                                                    rootHovered: { 
                                                        color: (tokens as any).colorStatusDangerForeground3,
                                                        backgroundColor: 'transparent' 
                                                    },
                                                    icon: { fontSize: parseInt(tokens.fontSizeBase300) }
                                                }}
                                            />
                                        </div>
                                    ))}
                                </Stack>
                            </Stack.Item>
                        )}

                        {/* Column 3: Requirements List (Fixed width, maybe 25%) */}
                        <Stack.Item className="w-[300px] min-w-[280px]">
                            <div className={`${sideCardStyles} border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800`}>
                                <div className={`${sideCardHeaderStyles} bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700`}>
                                    <Text className="font-semibold text-gray-900 dark:text-gray-100 text-base block">
                                        Documents required
                                    </Text>
                                    <Text className="text-sm text-gray-500 dark:text-gray-400 block mt-0.5">
                                        (Any 3 documents are mandatory)
                                    </Text>
                                </div>
                                <ul className={sideCardListStyles}>
                                    {REQUIRED_DOCUMENTS.map((doc, idx) => (
                                        <li key={idx} className={`${sideCardItemStyles} border-gray-100 dark:border-gray-700 text-gray-700 dark:text-gray-300`}>
                                            {doc}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </Stack.Item>

                    </Stack>
                </form>
            </Stack>
        </Stack>
    );
};

export default DocumentsUpload;
