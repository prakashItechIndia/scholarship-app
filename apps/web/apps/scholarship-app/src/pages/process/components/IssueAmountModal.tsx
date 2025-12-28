import * as React from "react";
import {
    Modal,
    Button,
    Input,
    Select,
    Label
} from "@shared/components";
import {
    Dismiss24Regular,
    CheckmarkCircle24Regular
} from "@fluentui/react-icons";
import { Spinner, SpinnerSize } from "@fluentui/react";
import { ApplicationData } from "../types";
import { processManagement } from "../../../services/scholarship.service";
import { useToast } from "@/components/ui/toast";

interface IssueAmountModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    data?: ApplicationData | null;
    onIssueSuccess?: () => void;
    onViewPDF?: (pdfUrl: string, applicationNo: string) => void;
}

const IssueAmountModal: React.FC<IssueAmountModalProps> = ({
    open,
    onOpenChange,
    data,
    onIssueSuccess,
    onViewPDF,
}) => {
    const { success, error: showError } = useToast();
    const [comment, setComment] = React.useState("");
    const [paymentMode, setPaymentMode] = React.useState("");
    const [ddChequeNo, setDdChequeNo] = React.useState("");
    const [ddChequeInFavor, setDdChequeInFavor] = React.useState("");
    const [ddChequeDate, setDdChequeDate] = React.useState("");
    const [ddChequeInFavorType, setDdChequeInFavorType] = React.useState<string>("");
    const [ddChequeInstitutionId, setDdChequeInstitutionId] = React.useState<string>("");
    const [ddChequeOtherInstitution, setDdChequeOtherInstitution] = React.useState("");
    const [ddChequeIssuedBy, setDdChequeIssuedBy] = React.useState<string>("");
    const [scholarshipIssuedDate, setScholarshipIssuedDate] = React.useState("");
    const [bankName, setBankName] = React.useState("");
    const [branchDetails, setBranchDetails] = React.useState("");
    const [uploadedFiles, setUploadedFiles] = React.useState<File[]>([]);
    const [isSubmitted, setIsSubmitted] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [institutions, setInstitutions] = React.useState<Array<{ value: string; label: string }>>([]);
    const [users, setUsers] = React.useState<Array<{ value: string; label: string }>>([]);

    // Clean up state when modal closes/opens
    React.useEffect(() => {
        if (open) {
            setComment("");
            setPaymentMode("");
            setDdChequeNo("");
            setDdChequeInFavor("");
            setDdChequeDate("");
            setDdChequeInFavorType("");
            setDdChequeInstitutionId("");
            setDdChequeOtherInstitution("");
            setDdChequeIssuedBy("");
            setScholarshipIssuedDate("");
            setBankName("");
            setBranchDetails("");
            setUploadedFiles([]);
            setIsSubmitted(false);
        }
    }, [open]);

    // Fetch institutions and users for dropdowns
    React.useEffect(() => {
        if (open) {
            // TODO: Fetch institutions from API
            // For now, using placeholder data
            setInstitutions([
                { value: "1", label: "Institution 1" },
                { value: "2", label: "Institution 2" },
            ]);
            
            // TODO: Fetch users from API (sp_GetAllChequeIssuedBy)
            // For now, using placeholder data
            setUsers([
                { value: "1", label: "User 1" },
                { value: "2", label: "User 2" },
            ]);
        }
    }, [open]);

    // Word count validation for comments
    const wordCount = React.useMemo(() => {
        if (!comment) return 0;
        return comment.trim().split(/\s+/).filter(word => word.length > 0).length;
    }, [comment]);

    // Helper to safely convert to string
    const safeString = (value: unknown): string => {
        if (value === null || value === undefined) return "-";
        if (typeof value === "string") return value || "-";
        if (typeof value === "number") return String(value);
        if (typeof value === "boolean") return String(value);
        return "-";
    };

    // Get scholarship seeking for text based on Scholarship_For (matching old app logic)
    const getScholarshipSeekingFor = (): string => {
        if (!data) return "-";
        const apiData = data as Record<string, unknown>;
        const scholarshipFor = safeString(apiData.Scholarship_For ?? apiData.scholarshipFor);
        
        if (scholarshipFor === "School") {
            return safeString(apiData.Class_Studying ?? data.classStudying);
        } else if (scholarshipFor === "College") {
            const degreeType = safeString(apiData.Degree_Type);
            const degree = safeString(apiData.Degree);
            return degreeType !== "-" && degree !== "-" ? `${degreeType}-${degree}` : "-";
        } else if (scholarshipFor === "Research") {
            return safeString(apiData.Ph_D);
        }
        return "-";
    };

    // Helper to safely get string value from data
    const getStringValue = (primary: string | undefined, ...fallbacks: unknown[]): string => {
        if (primary) return primary;
        for (const fallback of fallbacks) {
            const str = safeString(fallback);
            if (str !== "-") return str;
        }
        return "-";
    };

    // Helper to safely get number value from data
    const getNumberValue = (...values: unknown[]): string => {
        for (const value of values) {
            if (value === null || value === undefined) continue;
            if (typeof value === "number" && !isNaN(value)) return String(value);
            if (typeof value === "string") {
                const num = Number(value);
                if (!isNaN(num)) return String(num);
            }
        }
        return "0";
    };

    // Map data dynamically from API response (matching old app: ScholarshipFinal.aspx.cs)
    const apiData = data as Record<string, unknown> | undefined;
    const details = [
        { 
            label: "Application No", 
            value: getStringValue(data?.applicationNo, apiData?.Application_Id)
        },
        { 
            label: "Student Name", 
            value: getStringValue(data?.studentName, apiData?.Applicant_Name)
        },
        { 
            label: "Father's Name", 
            value: getStringValue(data?.fatherName, apiData?.Father_Name)
        },
        { 
            label: "Father's Occupation", 
            value: getStringValue(data?.fatherOccupation, apiData?.Father_Occupation)
        },
        { 
            label: "Scholarship Seeking For", 
            value: data?.scholarshipSeekingFor ? safeString(data.scholarshipSeekingFor) : getScholarshipSeekingFor()
        },
        { 
            label: "Request Amount", 
            value: getNumberValue(
                data?.requestAmount,
                apiData?.RequestAmount,
                apiData?.Request_Amount
            )
        },
        { 
            label: "Suggested Amount", 
            value: getNumberValue(
                data?.suggestedAmount,
                apiData?.Scholarship_Suggest_Amount
            )
        },
        { 
            label: "Approved Amount", 
            value: getNumberValue(
                data?.approvedAmount,
                apiData?.Scholarship_Approved_Amount
            )
        },
    ];

    const handleSubmit = async () => {
        if (!data?.applicationNo || !paymentMode) {
            showError('Validation Error', 'Please select payment mode');
            return;
        }

        // Validate word count for comments
        if (wordCount > 200) {
            showError('Validation Error', 'Comments cannot exceed 200 words');
            return;
        }

        // Note: Removed validation for DD/Cheque In Favor Type and DD/Cheque Issued By
        // as per UI requirements - only showing basic fields for Cheque/DD

        try {
            setLoading(true);
            // Get current user ID from localStorage
            const authData = localStorage.getItem('scholarship_auth');
            const userId = authData ? JSON.parse(authData).userId : undefined;
            const apiData = data as Record<string, unknown> | undefined;
            const scholarshipId = apiData?.Scholarship_Id ? Number(apiData.Scholarship_Id) : undefined;

            await processManagement.issueAmount({
                applicationId: data.applicationNo,
                scholarshipId,
                paymentMode,
                comments: comment,
                ddChequeNo: paymentMode === 'Demand Draft (DD)' || paymentMode === 'Cheque' ? ddChequeNo : '',
                ddChequeInFavor: paymentMode === 'Demand Draft (DD)' || paymentMode === 'Cheque' ? ddChequeInFavor : '',
                ddChequeDate: paymentMode === 'Demand Draft (DD)' || paymentMode === 'Cheque' ? ddChequeDate : '',
                ddChequeInFavorType: paymentMode === 'Demand Draft (DD)' || paymentMode === 'Cheque' ? ddChequeInFavorType : '',
                ddChequeInstitutionId: ddChequeInFavorType === 'Institution' && ddChequeInstitutionId ? Number(ddChequeInstitutionId) : undefined,
                ddChequeOtherInstitution: ddChequeInFavorType === 'Institution' ? ddChequeOtherInstitution : '',
                ddChequeIssuedBy: paymentMode === 'Demand Draft (DD)' || paymentMode === 'Cheque' ? Number(ddChequeIssuedBy) : undefined,
                scholarshipIssuedDate: paymentMode === 'Demand Draft (DD)' || paymentMode === 'Cheque' ? scholarshipIssuedDate : '',
                bankName: paymentMode === 'Demand Draft (DD)' || paymentMode === 'Cheque' ? bankName : '',
                branchDetails: paymentMode === 'Demand Draft (DD)' || paymentMode === 'Cheque' ? branchDetails : '',
                documents: uploadedFiles,
                issuedBy: userId,
            });

            setIsSubmitted(true);
            success('Success', 'Amount issued successfully');

            // Generate and open PDF after successful submission
            try {
                const scholarshipId = apiData?.Scholarship_Id ? String(apiData.Scholarship_Id) : undefined;
                if (scholarshipId && onViewPDF) {
                    // Wait a bit for the backend to process the file
                    setTimeout(async () => {
                        try {
                            const mergedPdfUrl = await processManagement.getMergedScholarshipPDF({
                                applicationId: data.applicationNo,
                                scholarshipId: scholarshipId,
                            });
                            onViewPDF(mergedPdfUrl, data.applicationNo);
                        } catch (pdfError) {
                            console.warn('Failed to load merged PDF:', pdfError);
                            // Still close modal even if PDF fails
                        }
                    }, 1000);
                }
            } catch (pdfError) {
                console.warn('Error generating PDF:', pdfError);
            }

            // Refresh data and close modal after success
            if (onIssueSuccess) {
                onIssueSuccess();
            }
            setTimeout(() => {
                onOpenChange(false);
            }, 1500);
        } catch (err) {
            showError('Failed to Issue Amount', err instanceof Error ? err.message : 'Failed to issue amount');
        } finally {
            setLoading(false);
        }
    };

    const renderRow = (label: string, value: string, isLast: boolean) => (
        <div
            key={label}
            style={{
                display: "flex",
                borderBottom: isLast ? "none" : "1px solid #e0e0e0",
                backgroundColor: "#ffffff",
            }}
        >
            <div
                style={{
                    width: "40%",
                    padding: "12px 16px",
                    fontWeight: 600,
                    color: "#242424",
                    fontSize: "14px",
                    borderRight: "1px solid #e0e0e0",
                    fontFamily: "'Inter', sans-serif",
                    backgroundColor: "#fafafa", // Slightly gray for header column effect
                }}
            >
                {label}
            </div>
            <div
                style={{
                    width: "60%",
                    padding: "12px 16px",
                    color: "#242424",
                    fontSize: "14px",
                    fontFamily: "'Inter', sans-serif",
                }}
            >
                {value}
            </div>
        </div>
    );

    return (
        <Modal
            open={open}
            onOpenChange={onOpenChange}
            size="md"
            headerContent={
                !isSubmitted ? (
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", gap: "20px" }}>
                        <span style={{
                            fontSize: "16px",
                            fontWeight: 600,
                            color: "#242424",
                            fontFamily: "'Inter', sans-serif",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            flex: 1
                        }}>
                            LEO MUTHU - Scholarship Approve Panel ( 2024-2025 )
                        </span>
                        <Button
                            appearance="subtle"
                            icon={<Dismiss24Regular />}
                            onClick={() => onOpenChange(false)}
                            style={{ padding: 0, minWidth: "32px", flexShrink: 0 }}
                            aria-label="Close"
                        />
                    </div>
                ) : null
            }
            hideDefaultHeader={!isSubmitted}
        >
            {isSubmitted ? (
                <div style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "40px 20px",
                    gap: "16px",
                    height: "100%"
                }}>
                    <div style={{
                        width: "60px",
                        height: "60px",
                        borderRadius: "50%",
                        backgroundColor: "#ecfdf5", // Light green bg
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                    }}>
                        <CheckmarkCircle24Regular style={{ width: "32px", height: "32px", color: "#059669" }} />
                    </div>
                    <h3 style={{
                        fontSize: "18px",
                        fontWeight: 600,
                        color: "#242424",
                        fontFamily: "'Inter', sans-serif",
                        margin: 0
                    }}>
                        Submitted Successfully
                    </h3>
                    <Button
                        appearance="primary"
                        onClick={() => onOpenChange(false)}
                        style={{ backgroundColor: "#2453C3", color: "white", minWidth: "120px", marginTop: "10px" }}
                    >
                        Close
                    </Button>
                </div>
            ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "20px", padding: "8px 0" }}>
                    {/* Details Table */}
                    <div
                        style={{
                            border: "1px solid #e0e0e0",
                            borderRadius: "4px",
                            overflow: "hidden",
                        }}
                    >
                        {details.map((item, index) =>
                            renderRow(item.label, item.value, index === details.length - 1)
                        )}
                    </div>

                    {/* Payment Mode Select */}
                    <div style={{ width: "100%" }}>
                        <Label style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: 500, color: "#242424", fontFamily: "'Inter', sans-serif" }}>
                            Select mode of payment
                        </Label>
                        <Select
                            placeholder="Select mode of payment"
                            selectedKey={paymentMode}
                            onValueChange={(value) => setPaymentMode(value)}
                            options={[
                                { value: "Demand Draft (DD)", label: "Demand Draft (DD)" },
                                { value: "NEFT/RTGS Transfer", label: "NEFT/RTGS Transfer" },
                                { value: "Cheque", label: "Cheque" },
                                { value: "UPI Transfer", label: "UPI Transfer" }
                            ]}
                        />
                    </div>

                    {/* Cheque/DD Details - Show when Cheque or DD is selected */}
                    {(paymentMode === "Cheque" || paymentMode === "Demand Draft (DD)") && (
                        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                                {/* Cheque Number */}
                                <div>
                                    <Label style={{ display: "block", marginBottom: "6px", fontSize: "14px", fontWeight: 500, color: "#242424", fontFamily: "'Inter', sans-serif" }}>
                                        Cheque Number
                                    </Label>
                                    <Input
                                        type="text"
                                        value={ddChequeNo}
                                        onChange={(e) => setDdChequeNo(e.target.value)}
                                        placeholder="Enter cheque number"
                                    />
                                </div>

                                {/* Cheque Date */}
                                <div>
                                    <Label style={{ display: "block", marginBottom: "6px", fontSize: "14px", fontWeight: 500, color: "#242424", fontFamily: "'Inter', sans-serif" }}>
                                        Cheque Date
                                    </Label>
                                    <Input
                                        type="date"
                                        value={ddChequeDate}
                                        onChange={(e) => setDdChequeDate(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                                {/* Bank Name */}
                                <div>
                                    <Label style={{ display: "block", marginBottom: "6px", fontSize: "14px", fontWeight: 500, color: "#242424", fontFamily: "'Inter', sans-serif" }}>
                                        Bank Name
                                    </Label>
                                    <Select
                                        placeholder="Select Bank"
                                        selectedKey={bankName}
                                        onValueChange={(value) => setBankName(value)}
                                        options={[
                                            { value: "HDFC Bank", label: "HDFC Bank" },
                                            { value: "State Bank of India", label: "State Bank of India" },
                                            { value: "ICICI Bank", label: "ICICI Bank" },
                                            { value: "Axis Bank", label: "Axis Bank" },
                                            { value: "Punjab National Bank", label: "Punjab National Bank" },
                                            { value: "Bank of Baroda", label: "Bank of Baroda" },
                                            { value: "Canara Bank", label: "Canara Bank" },
                                            { value: "Union Bank of India", label: "Union Bank of India" }
                                        ]}
                                    />
                                </div>

                                {/* Branch Details */}
                                <div>
                                    <Label style={{ display: "block", marginBottom: "6px", fontSize: "14px", fontWeight: 500, color: "#242424", fontFamily: "'Inter', sans-serif" }}>
                                        Branch Details
                                    </Label>
                                    <Input
                                        type="text"
                                        value={branchDetails}
                                        onChange={(e) => setBranchDetails(e.target.value)}
                                        placeholder="Enter branch details"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Document Upload Area */}
                    <div>
                        <Label style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: 500, color: "#242424", fontFamily: "'Inter', sans-serif" }}>
                            Upload Documents
                        </Label>
                        <div
                            style={{
                                border: "2px dashed #d1d1d1",
                                borderRadius: "4px",
                                padding: "24px",
                                textAlign: "center",
                                backgroundColor: "#fafafa",
                                cursor: "pointer",
                                transition: "all 0.2s"
                            }}
                            onDragOver={(e) => {
                                e.preventDefault();
                                e.currentTarget.style.borderColor = "#2453C3";
                                e.currentTarget.style.backgroundColor = "#f0f7ff";
                            }}
                            onDragLeave={(e) => {
                                e.currentTarget.style.borderColor = "#d1d1d1";
                                e.currentTarget.style.backgroundColor = "#fafafa";
                            }}
                            onDrop={(e) => {
                                e.preventDefault();
                                e.currentTarget.style.borderColor = "#d1d1d1";
                                e.currentTarget.style.backgroundColor = "#fafafa";
                                const files = Array.from(e.dataTransfer.files);
                                const validFiles = files.filter(file => {
                                    const ext = file.name.split('.').pop()?.toLowerCase();
                                    return ['jpg', 'jpeg', 'docx', 'pdf'].includes(ext || '');
                                });
                                setUploadedFiles([...uploadedFiles, ...validFiles]);
                            }}
                            onClick={() => {
                                const input = document.createElement('input');
                                input.type = 'file';
                                input.accept = '.jpg,.jpeg,.docx,.pdf';
                                input.multiple = true;
                                input.onchange = (e) => {
                                    const files = Array.from((e.target as HTMLInputElement).files || []);
                                    setUploadedFiles([...uploadedFiles, ...files]);
                                };
                                input.click();
                            }}
                        >
                            <div style={{ fontSize: "14px", color: "#616161", fontFamily: "'Inter', sans-serif" }}>
                                Drop files here or Choose File
                            </div>
                            <div style={{ fontSize: "12px", color: "#9ca3af", marginTop: "4px", fontFamily: "'Inter', sans-serif" }}>
                                JPG, DOCX and PDF (up to 20MB)
                            </div>
                        </div>
                        {uploadedFiles.length > 0 && (
                            <div style={{ marginTop: "12px", display: "flex", flexDirection: "column", gap: "8px" }}>
                                {uploadedFiles.map((file, index) => (
                                    <div
                                        key={index}
                                        style={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "center",
                                            padding: "8px 12px",
                                            backgroundColor: "#f5f5f5",
                                            borderRadius: "4px",
                                            fontSize: "14px",
                                            fontFamily: "'Inter', sans-serif"
                                        }}
                                    >
                                        <span style={{ color: "#242424" }}>{file.name}</span>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setUploadedFiles(uploadedFiles.filter((_, i) => i !== index));
                                            }}
                                            style={{
                                                background: "none",
                                                border: "none",
                                                color: "#dc2626",
                                                cursor: "pointer",
                                                fontSize: "14px",
                                                padding: "4px 8px"
                                            }}
                                        >
                                            Remove
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Comments Section */}
                    <div>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                            <Label style={{ fontSize: "14px", fontWeight: 500, color: "#242424", fontFamily: "'Inter', sans-serif" }}>
                                Comments
                            </Label>
                            <span style={{ 
                                fontSize: "12px", 
                                color: wordCount > 200 ? "#dc2626" : "#616161", 
                                fontFamily: "'Inter', sans-serif",
                                fontWeight: wordCount > 200 ? 600 : 400
                            }}>
                                {wordCount} / 200 words
                            </span>
                        </div>
                        <textarea
                            placeholder="Enter your comments here"
                            style={{
                                width: "100%",
                                minHeight: "100px",
                                padding: "12px",
                                borderRadius: "4px",
                                border: "1px solid #d1d1d1",
                                fontSize: "14px",
                                fontFamily: "'Inter', sans-serif",
                                resize: "vertical",
                                outline: "none"
                            }}
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                        />
                    </div>

                    {/* Footer Buttons */}
                    <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "10px" }}>
                        <Button
                            appearance="outline"
                            onClick={() => onOpenChange(false)}
                            style={{ minWidth: "80px" }}
                        >
                            Cancel
                        </Button>
                        <Button
                            appearance="primary"
                            onClick={handleSubmit}
                            disabled={loading || !paymentMode}
                            style={{ backgroundColor: "#2453C3", color: "white", minWidth: "80px", display: "flex", alignItems: "center", gap: "8px" }}
                        >
                            {loading ? (
                                <>
                                    <Spinner size={SpinnerSize.small} styles={{ circle: { borderTopColor: "#FFFFFF", borderBottomColor: "#FFFFFF", borderLeftColor: "#FFFFFF", borderRightColor: "#FFFFFF" } }} />
                                    <span>Submitting...</span>
                                </>
                            ) : (
                                "Submit"
                            )}
                        </Button>
                    </div>

                </div>
            )}
        </Modal>
    );
};

export default IssueAmountModal;
