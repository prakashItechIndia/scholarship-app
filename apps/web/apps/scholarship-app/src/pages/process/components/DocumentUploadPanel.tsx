import * as React from "react";
import {
    Button,
    TableSkeleton,
    Input,
} from "@shared/components";
import {
    DismissRegular,
    ArrowUploadRegular,
    DeleteRegular,
    AddRegular,
    OpenFilled,
    ArrowSort20Regular,
} from "@fluentui/react-icons";
import { ApplicationData } from "../types";
import { documentUpload } from "../../../services/scholarship.service";
import { apiClient } from "../../../shared/api-client";
import { useToast } from "@/components/ui/toast";

interface DocumentUploadPanelProps {
    isOpen: boolean;
    onClose: () => void;
    data: ApplicationData | null;
    onUploadComplete?: () => void; // Callback to refresh parent data
}

interface DocumentRow {
    id: string;
    documentId?: number; // Database document ID for deletion
    name: string;
    uploadedOn?: string;
    status: "Uploaded" | "Not uploaded";
    url?: string; // Document URL for view
    fileType?: string; // Type of the file for preview
    documentPath?: string; // Document path from API
    isNew?: boolean; // Flag to indicate if this is a newly added row (editable)
}

// Helper function to format date as DD-MM-YYYY
const formatDateToDDMMYYYY = (dateString: string | null | undefined): string | undefined => {
    if (!dateString) return undefined;
    
    try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return undefined;
        
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        
        return `${day}-${month}-${year}`;
    } catch (error) {
        console.error('Error formatting date:', error);
        return undefined;
    }
};

const DocumentUploadPanel: React.FC<DocumentUploadPanelProps> = ({
    isOpen,
    onClose,
    data,
    onUploadComplete,
}) => {
    const { success, error: showError } = useToast();
    const [documents, setDocuments] = React.useState<DocumentRow[]>([]);
    const [documentTypes, setDocumentTypes] = React.useState<string[]>([]);
    const [loading, setLoading] = React.useState(false);
    const fileInputRef = React.useRef<HTMLInputElement>(null);
    const [uploadingDocId, setUploadingDocId] = React.useState<string | null>(null);
    const [deleteData, setDeleteData] = React.useState<{ isOpen: boolean; docId: string; docName: string; documentId?: number } | null>(null);
    const [previewData, setPreviewData] = React.useState<{ isOpen: boolean; url: string; name: string; type?: string } | null>(null);
    const [previewLoading, setPreviewLoading] = React.useState(false);
    const [previewError, setPreviewError] = React.useState<string | null>(null);
    const [newRowCounter, setNewRowCounter] = React.useState(0); // Counter for generating unique IDs for new rows

    // Fetch documents and document types when panel opens
    React.useEffect(() => {
        if (isOpen && data?.applicationNo) {
            // Reset state when panel opens
            setDocuments([]);
            setLoading(true);
            // Fetch document types first, then documents
            void fetchDocumentTypes().then(() => {
                void fetchDocuments();
            });
        }
    }, [isOpen, data?.applicationNo]); // eslint-disable-line react-hooks/exhaustive-deps

    const fetchDocuments = async () => {
        if (!data?.applicationNo) return;
        
        setLoading(true);
        try {
            const docs = await documentUpload.getApplicationDocuments(data.applicationNo);
            
            // Get document types separately
            const typesResponse = await documentUpload.getDocumentTypes();
            setDocumentTypes(typesResponse.documentTypes ?? []);
            
            // Get document types first if not already loaded
            if (documentTypes.length === 0) {
                await fetchDocumentTypes();
            }
            
            // Map API documents to DocumentRow format
            const uploadedDocs = (docs as {
                Document_Type?: string;
                Document_Path?: string;
                Document_URL?: string; // Full URL from backend
                Uploaded_Date?: string | null;
                Document_Id?: number;
                Application_Id?: string;
            }[]).map((doc) => ({
                id: doc.Document_Type ?? '',
                documentId: doc.Document_Id, // May be null for t_esch_ApplicantDocuments
                name: doc.Document_Type ?? '',
                uploadedOn: formatDateToDDMMYYYY(doc.Uploaded_Date),
                status: "Uploaded" as const,
                url: doc.Document_URL ?? doc.Document_Path ?? undefined, // Use full URL from backend if available
                documentPath: doc.Document_Path,
            }));
            
            // Create full document list with uploaded and not uploaded
            const currentTypes = documentTypes.length > 0 ? documentTypes : [
                'Birth Certificate',
                'Student ID Card',
                'Ration Card',
                'Voter ID',
                'Driving License',
                'Bank Pass Book',
                'AADHAAR ID',
                'PAN Card',
                'Bonafide (Student)',
                'Bonafide (Parent)',
            ];
            
            const allDocs: DocumentRow[] = currentTypes.map((type, index) => {
                const uploaded = uploadedDocs.find((d) => d.name === type);
                return uploaded ?? {
                    id: `doc-${index}`,
                    name: type,
                    status: "Not uploaded" as const,
                };
            });
            
            setDocuments(allDocs);
        } catch (err: unknown) {
            console.error('Error fetching documents:', err);
            const errorMessage = err instanceof Error ? err.message : 'Failed to fetch documents';
            showError('Failed to Load Documents', errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const fetchDocumentTypes = async () => {
        try {
            const response = await documentUpload.getDocumentTypes();
            setDocumentTypes(response.documentTypes ?? []);
        } catch (err: unknown) {
            console.error('Error fetching document types:', err);
            // Fallback to standard document types if API fails
            setDocumentTypes([
                'Birth Certificate',
                'Student ID Card',
                'Ration Card',
                'Voter ID',
                'Driving License',
                'Bank Pass Book',
                'AADHAAR ID',
                'PAN Card',
                'Bonafide (Student)',
                'Bonafide (Parent)',
            ]);
        }
    };

    if (!isOpen || !data) return null;

    const handleUploadClick = (docId: string) => {
        setUploadingDocId(docId);
        if (fileInputRef.current) {
            fileInputRef.current.value = ""; // Reset
            fileInputRef.current.click();
        }
    };

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file || !uploadingDocId || !data?.applicationNo) return;
        
        const docToUpload = documents.find(d => d.id === uploadingDocId);
        if (!docToUpload) return;
        
        try {
            setLoading(true);
            // Upload document via API
            await documentUpload.uploadDocument(
                data.applicationNo,
                docToUpload.name,
                file
            );
            
            success('Document Uploaded', `${docToUpload.name} uploaded successfully`);
            
            // Refresh documents list
            await fetchDocuments();
            
            // Call parent callback if provided
            if (onUploadComplete) {
                onUploadComplete();
            }
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to upload document';
            showError('Upload Failed', errorMessage);
        } finally {
            setLoading(false);
            setUploadingDocId(null);
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        }
    };

    const handleView = async (doc: DocumentRow) => {
        console.log('handleView called with:', { doc, applicationNo: data?.applicationNo });
        
        if (!data?.applicationNo || !doc.name) {
            console.error('Missing data:', { applicationNo: data?.applicationNo, docName: doc.name });
            showError('View Failed', 'Missing application number or document name.');
            return;
        }
        
        try {
            setPreviewLoading(true);
            setPreviewError(null);
            
            console.log('Getting document view URL for:', { applicationNo: data.applicationNo, documentType: doc.name });
            
            // Fetch the file as a blob using apiClient (includes auth headers)
            const viewUrl = `/document-upload/view/${encodeURIComponent(data.applicationNo)}/${encodeURIComponent(doc.name)}`;
            
            console.log('Fetching document from:', viewUrl);
            
            // Use apiClient to fetch with authentication
            const response = await apiClient.get(viewUrl, {
                responseType: 'blob', // Important: request as blob
            });
            
            console.log('Document response received:', { status: response.status, contentType: response.headers['content-type'] });
            
            // Create blob URL from response data
            const contentType = (response.headers['content-type'] as string) || 'application/octet-stream';
            const blob = new Blob([response.data as BlobPart], { type: contentType });
            const blobUrl = URL.createObjectURL(blob);
            
            console.log('Document loaded, blob URL created:', blobUrl);
            
            // Determine file type from response headers or document name
            let fileType = 'image/jpeg'; // default
            if (typeof contentType === 'string') {
                if (contentType.includes('pdf')) {
                    fileType = 'application/pdf';
                } else if (contentType.includes('jpeg') || contentType.includes('jpg')) {
                    fileType = 'image/jpeg';
                } else if (contentType.includes('png')) {
                    fileType = 'image/png';
                }
            }
            
            // Fallback to checking document name if content type doesn't help
            if (fileType === 'image/jpeg') {
                const fileExtension = doc.name.toLowerCase().split('.').pop() || '';
                if (fileExtension === 'pdf' || doc.name.toLowerCase().includes('pdf')) {
                    fileType = 'application/pdf';
                } else if (['jpg', 'jpeg'].includes(fileExtension)) {
                    fileType = 'image/jpeg';
                } else if (fileExtension === 'png') {
                    fileType = 'image/png';
                }
            }
            
            console.log('Setting preview data:', { url: blobUrl, name: doc.name, type: fileType });
            
            setPreviewData({
                isOpen: true,
                url: blobUrl, // Use blob URL
                name: doc.name,
                type: fileType
            });
            
            setPreviewLoading(false);
        } catch (err: unknown) {
            console.error('Error in handleView:', err);
            const errorMessage = err instanceof Error ? err.message : 'Failed to load document';
            setPreviewError(errorMessage);
            showError('View Failed', errorMessage);
            setPreviewLoading(false);
        }
    };

    const handleDeleteClick = (doc: DocumentRow) => {
        setDeleteData({ 
            isOpen: true, 
            docId: doc.id, 
            docName: doc.name,
            documentId: doc.documentId
        });
    };

    const handleAddNewRow = () => {
        const newId = `new-doc-${Date.now()}-${newRowCounter}`;
        setNewRowCounter(prev => prev + 1);
        
        const newRow: DocumentRow = {
            id: newId,
            name: "",
            status: "Not uploaded",
            isNew: true,
        };
        
        setDocuments(prev => [...prev, newRow]);
    };

    const handleDocumentNameChange = (docId: string, newName: string) => {
        setDocuments(prev => 
            prev.map(doc => 
                doc.id === docId 
                    ? { ...doc, name: newName }
                    : doc
            )
        );
    };

    const confirmDelete = async () => {
        if (!deleteData?.documentId || !data?.applicationNo) {
            setDeleteData(null);
            return;
        }
        
        // Find the document to get its type
        const docToDelete = documents.find((d) => d.documentId === deleteData.documentId);
        if (!docToDelete) {
            showError('Delete Failed', 'Document not found');
            setDeleteData(null);
            return;
        }
        
        try {
            setLoading(true);
            // Pass applicationId and documentType since t_esch_ApplicantDocuments doesn't have Document_Id
            await documentUpload.deleteDocument(
                deleteData.documentId,
                data.applicationNo,
                docToDelete.name
            );
            
            success('Document Deleted', `${deleteData.docName} deleted successfully`);
            
            // Refresh documents list
            await fetchDocuments();
            
            // Call parent callback if provided
            if (onUploadComplete) {
                onUploadComplete();
            }
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to delete document';
            showError('Delete Failed', errorMessage);
        } finally {
            setLoading(false);
            setDeleteData(null);
        }
    };

    // Helper to render preview content
    const renderPreviewContent = (url: string, type?: string, name?: string) => {
        const isPdf = type?.includes("pdf") || url.toLowerCase().endsWith(".pdf");

        if (isPdf) {
            return (
                <iframe
                    src={`${url}#toolbar=1&navpanes=1&scrollbar=1`}
                    style={{ width: "100%", height: "100%", border: "none" }}
                    title={`Document Preview: ${name || 'Document'}`}
                    onLoad={() => {
                        setPreviewLoading(false);
                        setPreviewError(null);
                    }}
                    onError={() => {
                        setPreviewLoading(false);
                        setPreviewError('Failed to load PDF document. Please check the file URL.');
                        showError('Preview Failed', 'Failed to load PDF document. Please check the file URL.');
                    }}
                />
            );
        } else {
            // Assume image
            return (
                <img
                    src={url}
                    alt={`Preview: ${name || 'Document'}`}
                    style={{
                        maxWidth: "100%",
                        maxHeight: "100%",
                        objectFit: "contain",
                        display: "block",
                        margin: "0 auto"
                    }}
                    onLoad={() => {
                        setPreviewLoading(false);
                        setPreviewError(null);
                    }}
                    onError={(e) => {
                        console.error('Image load error:', url);
                        setPreviewLoading(false);
                        setPreviewError('Failed to load image. Please check the file URL.');
                        showError('Preview Failed', 'Failed to load image. Please check the file URL.');
                    }}
                />
            );
        }
    };

    return (
        <div
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: "rgba(0, 0, 0, 0.4)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                zIndex: 1000,
            }}
        >
            {/* Hidden file input */}
            <input
                type="file"
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={handleFileChange}
                accept=".pdf,.jpg,.jpeg,.png"
            />

            <div
                style={{
                    backgroundColor: "white",
                    borderRadius: "8px",
                    width: "800px",
                    maxWidth: "2000px",
                    // Removed fixed height to eliminate space before footer50
                    minWidth:"100px",
                    maxHeight: "90%",
                    minHeight:"100px",
                    height:"570px",
                    display: "flex",
                    flexDirection: "column",
                    boxShadow: "0px 8px 32px rgba(0, 0, 0, 0.2)",
                    position: "relative", // For absolute positioning of delete modal if needed, though we use fixed for it
                }}
            >
                {/* Header */}
                <div
                    style={{
                        padding: "16px 24px",
                        borderBottom: "1px solid #e0e0e0",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        backgroundColor: "#ffffff",
                        borderTopLeftRadius: "8px",
                        borderTopRightRadius: "8px",
                    }}
                >
                    <h2
                        style={{
                            fontSize: "16px",
                            fontWeight: 600,
                            color: "#242424",
                            margin: 0,
                            fontFamily: "'Inter', sans-serif",
                            lineHeight:"22px"
                        }}
                    >
                        LEO MUTHU - Scholarship Upload Document Panel ( 2025-2026 ) | Student Name: {data.studentName} | Application Number: {data.applicationNo}
                    </h2>
                    <Button
                        appearance="subtle"
                        icon={<DismissRegular />}
                        onClick={onClose}
                        aria-label="Close"
                        style={{
                            backgroundColor: "transparent",
                            color: "#616161",
                            border: "none"
                        }}
                        className="close-button-no-hover"
                    />
                    <style>{`
                        .close-button-no-hover:hover {
                            background-color: transparent !important;
                            color: #616161 !important;
                        }
                        .close-button-no-hover:active {
                            background-color: transparent !important;
                        }
                    `}</style>
                </div>

                {/* Content (Scrollable Table) */}
                <div
                    style={{
                        overflow: "auto",
                        padding: "0",
                    }}
                >
                    {loading && documents.length === 0 ? (
                        <div style={{ padding: "24px" }}>
                            <TableSkeleton
                                columnCount={4}
                                rowCount={5}
                                columnWidths={[40, 200, 150, 120]}
                                showCheckbox={true}
                            />
                        </div>
                    ) : (
                        <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "'Inter', sans-serif" }}>
                            <thead style={{ position: "sticky", top: 0, backgroundColor: "#fafafa", zIndex: 1 }}>
                                <tr>
                                    <th style={{ padding: "12px 24px", textAlign: "left", width: "40px", borderBottom: "1px solid #e0e0e0" }}>
                                        <input type="checkbox" style={{ width: "16px", height: "16px" }} />
                                    </th>
                                    <th style={{ padding: "12px", textAlign: "left", fontSize: "13px", fontWeight: 500, color: "#424242", borderBottom: "1px solid #e0e0e0", lineHeight: "19px" }}>
                                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                            <span>Document Name</span>
                                            <ArrowSort20Regular style={{ width: "16px", height: "16px", color: "#616161" }} />
                                        </div>
                                    </th>
                                    <th style={{ padding: "12px", textAlign: "left", fontSize: "13px", fontWeight: 500, color: "#424242", borderBottom: "1px solid #e0e0e0", lineHeight: "19px" }}>
                                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                            <span>Uploaded on</span>
                                            <ArrowSort20Regular style={{ width: "16px", height: "16px", color: "#616161" }} />
                                        </div>
                                    </th>
                                    <th style={{ padding: "12px", textAlign: "left", fontSize: "13px", fontWeight: 500, color: "#424242", borderBottom: "1px solid #e0e0e0", lineHeight: "19px" }}></th>
                                    <th style={{ padding: "12px", textAlign: "left", fontSize: "13px", fontWeight: 500, color: "#424242", borderBottom: "1px solid #e0e0e0", lineHeight: "19px" }}>
                                        <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-start", gap: "8px" }}>
                                            <span>Status</span>
                                            <ArrowSort20Regular style={{ width: "16px", height: "16px", color: "#616161" }} />
                                        </div>
                                    </th>
                                    <th style={{ padding: "12px", textAlign: "left", fontSize: "13px", fontWeight: 500, color: "#424242", borderBottom: "1px solid #e0e0e0", lineHeight: "19px" }}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {documents.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} style={{ padding: "40px", textAlign: "center", color: "#616161" }}>
                                            No documents found. Please upload documents.
                                        </td>
                                    </tr>
                                ) : (
                                    documents.map((doc) => (
                                <tr key={doc.id} style={{ borderBottom: "1px solid #e0e0e0" }}>
                                    <td style={{ padding: "12px 24px" }}>
                                        <input type="checkbox" style={{ width: "16px", height: "16px" }} />
                                    </td>
                                    <td style={{ padding: "12px", fontSize: "13px", color: "#242424",lineHeight:"19px",fontWeight:400 }}>
                                        {doc.isNew ? (
                                            <Input
                                                type="text"
                                                value={doc.name}
                                                onChange={(e) => handleDocumentNameChange(doc.id, e.target.value)}
                                                placeholder="Enter document name"
                                                style={{
                                                    width: "100%",
                                                    minWidth: "200px",
                                                }}
                                            />
                                        ) : (
                                            doc.name
                                        )}
                                    </td>
                                    <td style={{ padding: "12px", fontSize: "12px", color: "#242424", lineHeight: "16px", fontWeight: 400 }}>
                                        {doc.status === "Uploaded" ? (
                                            doc.uploadedOn || "-"
                                        ) : (
                                            ""
                                        )}
                                    </td>
                                    <td style={{ padding: "12px", fontSize: "12px", color: "#242424", lineHeight: "16px", fontWeight: 400 }}>
                                        {doc.status !== "Uploaded" && (
                                            <Button
                                                appearance="outline"
                                                icon={<ArrowUploadRegular />}
                                                style={{ color: "#242424", borderColor: "#d1d1d1" }}
                                                onClick={() => handleUploadClick(doc.id)}
                                            >
                                                Upload
                                            </Button>
                                        )}
                                    </td>
                                    <td style={{ padding: "12px", textAlign: "left" }}>
                                        <span
                                            style={{
                                                display: "inline-block",
                                                padding: "4px 12px",
                                                borderRadius: "100px",
                                                fontSize: "10px",
                                                lineHeight:"14px",
                                                fontWeight: 600,
                                                backgroundColor: doc.status === "Uploaded" ? "#f1faf1" : "#F0F0F0",
                                                color: doc.status === "Uploaded" ? "#0E700E" : "#424242",
                                                border: `1px solid ${doc.status === "Uploaded" ? "#9fd89f" : "#e0e0e0"}`,
                                            }}
                                        >
                                            {doc.status}
                                        </span>
                                    </td>
                                    <td style={{ padding: "12px" }}>
                                        {doc.status === "Uploaded" && (
                                            <div style={{ display: "flex", gap: "8px" }}>
                                                <Button
                                                    appearance="subtle"
                                                    icon={<OpenFilled />}
                                                    style={{ minWidth: "28px", border: "1px solid #d1d1d1",width:"27px",height:"27px" }}
                                                    onClick={() => {
                                                        void handleView(doc);
                                                    }}
                                                />
                                                <Button
                                                    appearance="subtle"
                                                    icon={<DeleteRegular/>}
                                                    style={{ minWidth: "28px", border: "1px solid #d1d1d1",width:"27px",height:"27px",color:"#242424" }}
                                                    onClick={() => handleDeleteClick(doc)}
                                                />
                                            </div>
                                        )}
                                    </td>
                                </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    )}
                </div>

                {/* Footer */}
                <div
                    style={{
                        padding: "16px 24px",
                        borderTop: "1px solid #e0e0e0",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        backgroundColor: "#ffffff",
                        borderBottomLeftRadius: "8px",
                        borderBottomRightRadius: "8px",
                    }}
                >
                    <div
                        onClick={handleAddNewRow}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "4px",
                            color: "#115ea3",
                            cursor: "pointer",
                            fontSize: "14px",
                            fontWeight: 500,
                        }}
                    >
                        <div style={{ backgroundColor: "#115ea3", borderRadius: "50%", width: "20px", height: "20px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <AddRegular style={{ color: "white", width: "13px", height: "13px" }} />
                        </div>
                        <span>Add (Upload if any other certificates available)</span>
                    </div>

                    <Button
                        appearance="primary"
                        style={{
                            backgroundColor: "#2453C3", // Fluent Primary
                            minWidth: "90px",
                            borderRadius:"5px",
                            color:"#FFFFFF"
                        }}
                        onClick={() => {
                            // Mark documents as verified (update IsUpload_Status to '1' if not already)
                            // This is handled automatically by the upload API, but we can add explicit verification here if needed
                            success('Documents Verified', 'Documents have been marked as verified');
                            onClose();
                            if (onUploadComplete) {
                                onUploadComplete();
                            }
                        }}
                        disabled={loading}
                    >
                        Verified
                    </Button>
                </div>
            </div>

            {/* Custom Delete Confirmation Modal */}
            {deleteData?.isOpen && (
                <div
                    style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: "rgba(0, 0, 0, 0.5)",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        zIndex: 1100,
                    }}
                >
                    <div
                        style={{
                            backgroundColor: "white",
                            borderRadius: "8px",
                            width: "400px",
                            padding: "24px",
                            boxShadow: "0px 8px 32px rgba(0, 0, 0, 0.25)",
                            display: "flex",
                            flexDirection: "column",
                            gap: "16px",
                        }}
                    >
                        <h3 style={{ margin: 0, fontSize: "18px", fontWeight: 600, color: "#242424", fontFamily: "'Inter', sans-serif" }}>
                            Delete Document
                        </h3>
                        <p style={{ margin: 0, fontSize: "14px", color: "#424242", lineHeight: "20px", fontFamily: "'Inter', sans-serif" }}>
                            Are you sure you want to delete <strong>{deleteData.docName}</strong>? This action cannot be undone.
                        </p>
                        <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "8px" }}>
                            <Button
                                appearance="outline"
                                onClick={() => setDeleteData(null)}
                            >
                                Cancel
                            </Button>
                            <Button
                                appearance="primary"
                                style={{ backgroundColor: "#d92b2b", borderColor: "#d92b2b" }}
                                onClick={confirmDelete}
                            >
                                Delete
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Preview Modal */}
            {previewData?.isOpen && (
                <div
                    style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: "rgba(0, 0, 0, 0.8)",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        zIndex: 1200,
                    }}
                    onClick={() => {
                        setPreviewData(null);
                        setPreviewError(null);
                        setPreviewLoading(false);
                    }} // Close on backdrop click
                >
                    <div
                        style={{
                            backgroundColor: "transparent",
                            width: "90%",
                            height: "90%",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            position: "relative",
                        }}
                        onClick={(e) => e.stopPropagation()} // Prevent close on content click
                    >
                        <button
                            onClick={() => {
                                // Clean up blob URL if it exists
                                const url = previewData?.url;
                                if (url && typeof url === 'string' && url.startsWith('blob:')) {
                                    URL.revokeObjectURL(url);
                                }
                                setPreviewData(null);
                                setPreviewError(null);
                                setPreviewLoading(false);
                            }}
                            style={{
                                position: "absolute",
                                top: "-40px",
                                right: "0",
                                background: "transparent",
                                border: "none",
                                color: "white",
                                cursor: "pointer",
                            }}
                        >
                            <DismissRegular style={{ width: "32px", height: "32px" }} />
                        </button>
                        <div style={{
                            backgroundColor: "white",
                            borderRadius: "4px",
                            overflow: "hidden",
                            width: "100%",
                            height: "100%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            position: "relative"
                        }}>
                            {previewLoading && (
                                <div style={{
                                    position: "absolute",
                                    top: "50%",
                                    left: "50%",
                                    transform: "translate(-50%, -50%)",
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    gap: "12px",
                                    zIndex: 10
                                }}>
                                    <div style={{
                                        width: "40px",
                                        height: "40px",
                                        border: "4px solid #e0e0e0",
                                        borderTop: "4px solid #0f6cbd",
                                        borderRadius: "50%",
                                        animation: "spin 1s linear infinite"
                                    }} />
                                    <span style={{ color: "#616161", fontSize: "14px" }}>Loading document...</span>
                                </div>
                            )}
                            {previewError ? (
                                <div style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    gap: "12px",
                                    color: "#c50f1f",
                                    fontSize: "14px",
                                    padding: "24px"
                                }}>
                                    <span>{previewError}</span>
                                    <Button
                                        appearance="outline"
                                        onClick={() => {
                                            // Clean up blob URL if it exists
                                            const url = previewData?.url;
                                            if (url && typeof url === 'string' && url.startsWith('blob:')) {
                                                URL.revokeObjectURL(url);
                                            }
                                            setPreviewData(null);
                                            setPreviewError(null);
                                            setPreviewLoading(false);
                                        }}
                                    >
                                        Close
                                    </Button>
                                </div>
                            ) : previewData.url ? (
                                <div style={{ width: "100%", height: "100%", opacity: previewLoading ? 0.3 : 1 }}>
                                    {renderPreviewContent(previewData.url, previewData.type, previewData.name)}
                                </div>
                            ) : (
                                <div style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    gap: "12px",
                                    color: "#616161",
                                    fontSize: "14px"
                                }}>
                                    <span>No document URL available</span>
                                    <Button
                                        appearance="outline"
                                        onClick={() => {
                                            setPreviewData(null);
                                            setPreviewError(null);
                                            setPreviewLoading(false);
                                        }}
                                    >
                                        Close
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default DocumentUploadPanel;
