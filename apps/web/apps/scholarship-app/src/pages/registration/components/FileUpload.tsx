import { useState, useRef } from 'react';
import { Button } from '@shared/components';
import { DocumentRegular, DismissRegular } from '@fluentui/react-icons';

interface FileUploadProps {
    files: File[];
    onChange: (files: File[]) => void;
    accept?: string;
    maxSize?: number; // in bytes
    multiple?: boolean;
}

export const FileUpload = ({ files, onChange, accept = '.pdf,.jpg,.jpeg,.png', maxSize = 20 * 1024 * 1024, multiple = true }: FileUploadProps) => {
    const [error, setError] = useState<string>('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = event.target.files;
        if (!selectedFiles || selectedFiles.length === 0) return;

        const fileArray = Array.from(selectedFiles);
        const validFiles: File[] = [];
        const errors: string[] = [];

        fileArray.forEach((file) => {
            // Check file type
            const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
            const acceptedExtensions = accept.split(',').map(ext => ext.trim().toLowerCase());
            
            if (!acceptedExtensions.some(ext => fileExtension === ext || file.type.match(ext.replace('.', '')))) {
                errors.push(`${file.name}: Invalid file type. Accepted types: ${accept}`);
                return;
            }

            // Check file size
            if (file.size > maxSize) {
                errors.push(`${file.name}: File size exceeds ${maxSize / (1024 * 1024)}MB limit`);
                return;
            }

            validFiles.push(file);
        });

        if (errors.length > 0) {
            setError(errors.join('; '));
        } else {
            setError('');
        }

        if (multiple) {
            onChange([...files, ...validFiles]);
        } else {
            onChange(validFiles);
        }

        // Reset input
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleRemoveFile = (index: number) => {
        const newFiles = files.filter((_, i) => i !== index);
        onChange(newFiles);
    };

    const formatFileSize = (bytes: number): string => {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
    };

    return (
        <div className="w-full">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                <input
                    ref={fileInputRef}
                    type="file"
                    accept={accept}
                    multiple={multiple}
                    onChange={handleFileSelect}
                    className="hidden"
                    id="file-upload-input"
                />
                <label htmlFor="file-upload-input" className="cursor-pointer">
                    <DocumentRegular style={{ fontSize: 32, color: '#616161', marginBottom: 8 }} />
                    <p className="text-sm text-gray-600 mb-2">
                        Click to upload or drag and drop
                    </p>
                    <p className="text-xs text-gray-500">
                        {accept} (Max {maxSize / (1024 * 1024)}MB per file)
                    </p>
                </label>
            </div>

            {error && (
                <p className="text-red-500 text-sm mt-2">{error}</p>
            )}

            {files.length > 0 && (
                <div className="mt-4 space-y-2">
                    {files.map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded border">
                            <div className="flex items-center gap-2">
                                <DocumentRegular style={{ fontSize: 20, color: '#616161' }} />
                                <div>
                                    <p className="text-sm text-gray-700">{file.name}</p>
                                    <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => handleRemoveFile(index)}
                                className="text-red-500 hover:text-red-700"
                            >
                                <DismissRegular style={{ fontSize: 20 }} />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

