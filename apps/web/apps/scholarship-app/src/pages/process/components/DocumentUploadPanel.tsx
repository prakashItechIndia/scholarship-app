import * as React from "react";
import {
    Button,
    TableSkeleton,
} from "@shared/components";
import {
    DismissRegular,
    ArrowUploadRegular,
    DeleteRegular,
    EyeRegular,
    AddRegular,
} from "@fluentui/react-icons";
import { ApplicationData } from "../types";
import { documentUpload } from "../../../services/scholarship.service";
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
}

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
                Uploaded_Date?: string | null;
                Document_Id?: number;
                Application_Id?: string;
            }[]).map((doc) => ({
                id: doc.Document_Type ?? '',
                documentId: doc.Document_Id, // May be null for t_esch_ApplicantDocuments
                name: doc.Document_Type ?? '',
                uploadedOn: doc.Uploaded_Date 
                    ? new Date(doc.Uploaded_Date).toLocaleDateString("en-GB", { 
                        day: "2-digit", 
                        month: "2-digit", 
                        year: "numeric" 
                    }).replace(/\//g, "-")
                    : undefined, // Table doesn't have Uploaded_Date column
                status: "Uploaded" as const,
                url: doc.Document_Path ?? undefined,
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

    const handleView = (doc: DocumentRow) => {
        if (doc.url || doc.documentPath) {
            // Construct full URL if it's a relative path
            const documentUrl = doc.url ?? doc.documentPath ?? '';
            const fullUrl = documentUrl.startsWith('http') 
                ? documentUrl 
                : `${window.location.origin}${documentUrl.startsWith('/') ? '' : '/'}${documentUrl}`;
            
            setPreviewData({
                isOpen: true,
                url: fullUrl,
                name: doc.name,
                type: doc.fileType ?? (documentUrl.toLowerCase().endsWith('.pdf') ? 'application/pdf' : 'image/jpeg')
            });
        } else {
            showError('View Failed', 'No document URL found.');
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

    const confirmDelete = async () => {
        if (!deleteData || !deleteData.documentId || !data?.applicationNo) {
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
    const renderPreviewContent = (url: string, type?: string) => {
        const isPdf = type?.includes("pdf") || url.endsWith(".pdf");

        if (isPdf) {
            return (
                <iframe
                    src={`${url}#toolbar=0&navpanes=0`}
                    style={{ width: "100%", height: "100%", border: "none" }}
                    title="Document Preview"
                />
            );
        } else {
            // Assume image
            return (
                <img
                    src={url}
                    alt="Preview"
                    style={{
                        maxWidth: "100%",
                        maxHeight: "100%",
                        objectFit: "contain",
                        display: "block",
                        margin: "0 auto"
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
                    width: "90%",
                    maxWidth: "1000px",
                    // Removed fixed height to eliminate space before footer
                    maxHeight: "90%",
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
                        }}
                    >
                        LEO MUTHU - Scholarship Upload Document Panel ( 2025-2026 ) | Student Name: {data.studentName} | Application Number: {data.applicationNo}
                    </h2>
                    <Button
                        appearance="subtle"
                        icon={<DismissRegular />}
                        onClick={onClose}
                        aria-label="Close"
                    />
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
                                    <th style={{ padding: "12px", textAlign: "left", fontSize: "14px", fontWeight: 600, color: "#424242", borderBottom: "1px solid #e0e0e0" }}>Document Name ⇅</th>
                                    <th style={{ padding: "12px", textAlign: "left", fontSize: "14px", fontWeight: 600, color: "#424242", borderBottom: "1px solid #e0e0e0" }}>Uploaded on ⇅</th>
                                    <th style={{ padding: "12px", textAlign: "center", fontSize: "14px", fontWeight: 600, color: "#424242", borderBottom: "1px solid #e0e0e0" }}>Status ⇅</th>
                                    <th style={{ padding: "12px", textAlign: "left", fontSize: "14px", fontWeight: 600, color: "#424242", borderBottom: "1px solid #e0e0e0" }}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {documents.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} style={{ padding: "40px", textAlign: "center", color: "#616161" }}>
                                            No documents found. Please upload documents.
                                        </td>
                                    </tr>
                                ) : (
                                    documents.map((doc) => (
                                <tr key={doc.id} style={{ borderBottom: "1px solid #e0e0e0" }}>
                                    <td style={{ padding: "12px 24px" }}>
                                        <input type="checkbox" style={{ width: "16px", height: "16px" }} />
                                    </td>
                                    <td style={{ padding: "12px", fontSize: "14px", color: "#242424" }}>{doc.name}</td>
                                    <td style={{ padding: "12px", fontSize: "14px", color: "#242424" }}>
                                        {doc.uploadedOn ? (
                                            doc.uploadedOn
                                        ) : (
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
                                    <td style={{ padding: "12px", textAlign: "center" }}>
                                        <span
                                            style={{
                                                display: "inline-block",
                                                padding: "4px 12px",
                                                borderRadius: "100px",
                                                fontSize: "12px",
                                                fontWeight: 500,
                                                backgroundColor: doc.status === "Uploaded" ? "#f1faf1" : "#f5f5f5",
                                                color: doc.status === "Uploaded" ? "#0e700e" : "#424242",
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
                                                    icon={<EyeRegular />}
                                                    style={{ padding: "4px", minWidth: "28px", border: "1px solid #d1d1d1" }}
                                                    onClick={() => handleView(doc)}
                                                />
                                                <Button
                                                    appearance="subtle"
                                                    icon={<DeleteRegular />}
                                                    style={{ padding: "4px", minWidth: "28px", border: "1px solid #d1d1d1" }}
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
                            <AddRegular style={{ color: "white", width: "16px", height: "16px" }} />
                        </div>
                        <span>Add (Upload if any other certificates available)</span>
                    </div>

                    <Button
                        appearance="primary"
                        style={{
                            backgroundColor: "#0F6CBD", // Fluent Primary
                            minWidth: "120px",
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
                    onClick={() => setPreviewData(null)} // Close on backdrop click
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
                            onClick={() => setPreviewData(null)}
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
                            justifyContent: "center"
                        }}>
                            {renderPreviewContent(previewData.url, previewData.type)}
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default DocumentUploadPanel;
