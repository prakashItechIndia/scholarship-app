import * as React from "react";
import {
    Modal,
    Button,
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem
} from "@shared/components";
import {
    Dismiss24Regular,
    CheckmarkCircle24Regular,
    ChevronDownRegular
} from "@fluentui/react-icons";
import { ApplicationData } from "../types";
import { processManagement } from "../../../services/scholarship.service";
import { useToast } from "@/components/ui/toast";

interface IssueAmountModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    data?: ApplicationData | null;
    onIssueSuccess?: () => void;
}

const IssueAmountModal: React.FC<IssueAmountModalProps> = ({
    open,
    onOpenChange,
    data,
    onIssueSuccess,
}) => {
    const { success, error: showError } = useToast();
    const [comment, setComment] = React.useState("");
    const [paymentMode, setPaymentMode] = React.useState("");
    const [ddChequeNo, setDdChequeNo] = React.useState("");
    const [ddChequeInFavor, setDdChequeInFavor] = React.useState("");
    const [ddChequeDate, setDdChequeDate] = React.useState("");
    const [isSubmitted, setIsSubmitted] = React.useState(false);
    const [loading, setLoading] = React.useState(false);

    // Clean up state when modal closes/opens
    React.useEffect(() => {
        if (open) {
            setComment("");
            setPaymentMode("");
            setDdChequeNo("");
            setDdChequeInFavor("");
            setDdChequeDate("");
            setIsSubmitted(false);
        }
    }, [open]);

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

        try {
            setLoading(true);
            // Get current user ID from localStorage
            const authData = localStorage.getItem('scholarship_auth');
            const userId = authData ? JSON.parse(authData).userId : undefined;

            await processManagement.issueAmount({
                applicationId: data.applicationNo,
                paymentMode,
                comments: comment,
                ddChequeNo: paymentMode === 'DD' || paymentMode === 'Cheque' ? ddChequeNo : '',
                ddChequeInFavor: paymentMode === 'DD' || paymentMode === 'Cheque' ? ddChequeInFavor : '',
                ddChequeDate: paymentMode === 'DD' || paymentMode === 'Cheque' ? ddChequeDate : '',
                issuedBy: userId,
            });

            setIsSubmitted(true);
            success('Success', 'Amount issued successfully');

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
                        style={{ backgroundColor: "#0F6CBD", color: "white", minWidth: "120px", marginTop: "10px" }}
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
                        <DropdownMenu>
                            <DropdownMenuTrigger>
                                <Button
                                    appearance="outline"
                                    style={{
                                        width: "100%",
                                        justifyContent: "space-between",
                                        fontWeight: "normal",
                                        color: paymentMode ? "#242424" : "#616161",
                                        fontFamily: "'Inter', sans-serif",
                                        borderColor: "#d1d1d1",
                                        height: "40px",
                                        padding: "8px 12px",
                                    }}
                                    iconPosition="after"
                                    icon={<ChevronDownRegular />}
                                >
                                    {paymentMode || "Select mode of payment"}
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                {["Demand Draft (DD)", "NEFT/RTGS Transfer", "Cheque", "UPI Transfer"].map((option) => (
                                    <DropdownMenuItem
                                        key={option}
                                        onClick={() => setPaymentMode(option)}
                                        style={{ fontFamily: "'Inter', sans-serif", fontSize: "14px" }}
                                    >
                                        {option}
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>

                    {/* Comments Section */}
                    <div>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                            <label style={{ fontSize: "14px", fontWeight: 500, color: "#242424", fontFamily: "'Inter', sans-serif" }}>
                                Comments
                            </label>
                            <span style={{ fontSize: "12px", color: "#616161", fontFamily: "'Inter', sans-serif" }}>
                                200 words
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
                            style={{ backgroundColor: "#0F6CBD", color: "white", minWidth: "80px" }}
                        >
                            {loading ? "Submitting..." : "Submit"}
                        </Button>
                    </div>

                </div>
            )}
        </Modal>
    );
};

export default IssueAmountModal;
