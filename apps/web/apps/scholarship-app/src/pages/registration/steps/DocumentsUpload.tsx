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
    if (!+bytes) return '0 Bytes';
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

const uploadAreaStyles = mergeStyles({
    border: '2px dashed #e5e7eb', // gray-200
    borderRadius: 8,
    backgroundColor: '#f9fafb', // gray-50
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.2s',
    minHeight: 470,
    width: '100%', // Full width of its column
    selectors: {
        '&:hover': {
            borderColor: '#3b82f6', // blue-500
            backgroundColor: '#eff6ff', // blue-50
        }
    }
});

const sideCardStyles = mergeStyles({
    width: '100%',
    border: '1px solid #e5e7eb',
    borderRadius: 8,
    backgroundColor: 'white',
    overflow: 'hidden',
    height: 'fit-content',
});

const sideCardHeaderStyles = mergeStyles({
    backgroundColor: '#f9fafb',
    padding: '10px 15px',
    borderBottom: '1px solid #e5e7eb',
});

const sideCardListStyles = mergeStyles({
    padding: 0,
    margin: 0,
    listStyle: 'none',
});

const sideCardItemStyles = mergeStyles({
    padding: '9px 10px',
    borderBottom: '1px solid #f3f4f6',
    fontSize: 14,
    color: '#374151',
    selectors: {
        '&:last-child': {
            borderBottom: 'none'
        }
    }
});

const fileItemStyles = mergeStyles({
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    padding: '12px',
    marginBottom: 8,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
});

// --- Icons ---
const UploadIcon = () => (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mb-4">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="17 8 12 3 7 8" />
        <line x1="12" y1="3" x2="12" y2="15" />
    </svg>
);

const PdfIcon = () => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="#EF4444" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="#FEF2F2" />
        <path d="M14 2V8H20" stroke="#EF4444" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M8 13H10.5C11.328 13 12 13.672 12 14.5C12 15.328 11.328 16 10.5 16H8V13Z" stroke="#EF4444" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M8 13V18" stroke="#EF4444" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const ImageIcon = () => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" stroke="#3B82F6" strokeWidth="1.5" fill="#EFF6FF" />
        <circle cx="8.5" cy="8.5" r="1.5" fill="#3B82F6" />
        <polyline points="21 15 16 10 5 21" stroke="#3B82F6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const DocumentsUpload = () => {
    const { formData, updateFormData, nextStep, markStepComplete, setIsLoading } = useRegistration();
    const [uploadedFiles, setUploadedFiles] = useState<File[]>(formData.documents || []);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { handleSubmit } = useForm();

    useEffect(() => {
        if (formData.documents && formData.documents !== uploadedFiles) {
            setUploadedFiles(formData.documents);
        }
    }, [formData.documents]);

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            const newFiles = Array.from(event.target.files);
            const updated = [...uploadedFiles, ...newFiles];
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
        if (uploadedFiles.length < 3) {
            setError(`You must upload at least 3 documents. Currently uploaded: ${uploadedFiles.length}`);
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
                <h2 className="text-2xl font-semibold text-gray-900 mb-1">Documents to be uploaded</h2>
                <p className="text-sm text-gray-500 mb-8">Provide the requested documents to complete your application.</p>

                {error && (
                    <MessageBar messageBarType={MessageBarType.error} className="mb-4">
                        {error}
                    </MessageBar>
                )}

                <form id="current-step-form" className="w-full h-full" onSubmit={handleSubmit(onFormSubmit)}>
                    {/* Main Layout: 3 Columns */}
                    <Stack horizontal tokens={{ childrenGap: 24 }} wrap={false} className="w-full">

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
                                <Text className="text-base font-semibold text-gray-900 mb-0.5">
                                    Click to select files
                                </Text>
                                <Text className="text-sm text-gray-500">
                                    Supported formats: JPG, PNG and PDF (up to 20MB)
                                </Text>
                            </div>
                        </Stack.Item>

                        {/* Column 2: Uploaded Files List (Fixed width or percentage, maybe 25%) */}
                        {uploadedFiles.length > 0 && (
                            <Stack.Item className="w-[300px] min-w-[250px]">
                                <Stack>
                                    {uploadedFiles.map((file, idx) => (
                                        <div key={idx} className={fileItemStyles}>
                                            <Stack horizontal verticalAlign="center" tokens={{ childrenGap: 12 }} className="overflow-hidden">
                                                <div className="shrink-0">
                                                    {isImage(file) ? <ImageIcon /> : <PdfIcon />}
                                                </div>
                                                <Stack className="overflow-hidden">
                                                    <Text
                                                        className="font-semibold text-gray-900 text-sm whitespace-nowrap overflow-hidden text-ellipsis"
                                                        title={file.name}
                                                    >
                                                        {file.name}
                                                    </Text>
                                                    <Text className="text-xs text-gray-500">
                                                        {formatBytes(file.size)}
                                                    </Text>
                                                </Stack>
                                            </Stack>
                                            <IconButton
                                                iconProps={{ iconName: 'Cancel' }}
                                                title="Remove file"
                                                ariaLabel="Remove file"
                                                onClick={() => handleRemoveFile(idx)}
                                                className="text-gray-400 h-6 w-6 hover:text-[#ef4444] hover:bg-transparent active:bg-transparent"
                                                styles={{
                                                    icon: { fontSize: 14 }
                                                }}
                                            />
                                        </div>
                                    ))}
                                </Stack>
                            </Stack.Item>
                        )}

                        {/* Column 3: Requirements List (Fixed width, maybe 25%) */}
                        <Stack.Item className="w-[300px] min-w-[250px]">
                            <div className={sideCardStyles}>
                                <div className={sideCardHeaderStyles}>
                                    <Text className="font-semibold text-gray-900 text-base block">
                                        Documents required
                                    </Text>
                                    <Text className="text-sm text-gray-500 block mt-0.5">
                                        (Any 3 documents are mandatory)
                                    </Text>
                                </div>
                                <ul className={sideCardListStyles}>
                                    {REQUIRED_DOCUMENTS.map((doc, idx) => (
                                        <li key={idx} className={sideCardItemStyles}>
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
