import * as React from "react";
import {
    Button,
} from "@shared/components";
import {
    DismissRegular,
    ArrowUploadRegular,
    DeleteRegular,
    EyeRegular,
    AddRegular,
} from "@fluentui/react-icons";
import { ApplicationData } from "../types";

interface DocumentUploadPanelProps {
    isOpen: boolean;
    onClose: () => void;
    data: ApplicationData | null;
}

interface DocumentRow {
    id: string;
    name: string;
    uploadedOn?: string;
    status: "Uploaded" | "Not uploaded";
    url?: string; // Mock URL for view
    fileType?: string; // Type of the file for preview
}

const INITIAL_DOCUMENTS: DocumentRow[] = [
    { id: "1", name: "Birth Certificate", uploadedOn: "18-09-2025", status: "Uploaded", url: "https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf" },
    { id: "2", name: "Student ID Card", uploadedOn: "18-09-2025", status: "Uploaded", url: "https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf" },
    { id: "3", name: "Ration Card", uploadedOn: "18-09-2025", status: "Uploaded", url: "https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf" },
    { id: "4", name: "Voter ID", status: "Not uploaded" },
    { id: "5", name: "Driving License", status: "Not uploaded" },
    { id: "6", name: "Bank Pass Book", status: "Not uploaded" },
    { id: "7", name: "AADHAAR ID", status: "Not uploaded" },
    { id: "8", name: "PAN Card", status: "Not uploaded" },
    { id: "9", name: "Bonafide (Student)", status: "Not uploaded" },
    { id: "10", name: "Bonafide (Parent)", status: "Not uploaded" },
];

const DocumentUploadPanel: React.FC<DocumentUploadPanelProps> = ({
    isOpen,
    onClose,
    data,
}) => {
    const [documents, setDocuments] = React.useState<DocumentRow[]>(INITIAL_DOCUMENTS);
    const fileInputRef = React.useRef<HTMLInputElement>(null);
    const [uploadingDocId, setUploadingDocId] = React.useState<string | null>(null);
    const [deleteData, setDeleteData] = React.useState<{ isOpen: boolean; docId: string; docName: string } | null>(null);
    const [previewData, setPreviewData] = React.useState<{ isOpen: boolean; url: string; name: string; type?: string } | null>(null);

    if (!isOpen || !data) return null;

    const handleUploadClick = (docId: string) => {
        setUploadingDocId(docId);
        if (fileInputRef.current) {
            fileInputRef.current.value = ""; // Reset
            fileInputRef.current.click();
        }
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file && uploadingDocId) {
            // Simulate upload
            const today = new Date().toLocaleDateString("en-GB").replace(/\//g, "-"); // DD-MM-YYYY format approx

            setDocuments(prev => prev.map(doc => {
                if (doc.id === uploadingDocId) {
                    return {
                        ...doc,
                        status: "Uploaded",
                        uploadedOn: today,
                        url: URL.createObjectURL(file), // Create a temporary URL for immediate viewing
                        fileType: file.type // Store file type for preview
                    };
                }
                return doc;
            }));
            setUploadingDocId(null);
        }
    };

    const handleView = (doc: DocumentRow) => {
        if (doc.url) {
            setPreviewData({
                isOpen: true,
                url: doc.url,
                name: doc.name,
                type: doc.fileType // Retrieve stored file type or assume PDF from mock
            });
        } else {
            alert("No document URL found.");
        }
    };

    const handleDeleteClick = (doc: DocumentRow) => {
        setDeleteData({ isOpen: true, docId: doc.id, docName: doc.name });
    };

    const confirmDelete = () => {
        if (deleteData) {
            setDocuments(prev => prev.map(doc => {
                if (doc.id === deleteData.docId) {
                    return {
                        ...doc,
                        status: "Not uploaded",
                        uploadedOn: undefined,
                        url: undefined,
                        fileType: undefined
                    } as DocumentRow;
                }
                return doc;
            }));
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
                            {documents.map((doc) => (
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
                            ))}
                        </tbody>
                    </table>
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
                        onClick={onClose}
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
