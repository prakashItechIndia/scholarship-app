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

    // Mock data values if not present in ApplicationData
    const details = [
        { label: "Application No", value: data?.applicationNo || "-" },
        { label: "Student Name", value: data?.studentName || "-" },
        { label: "Father's Name", value: "MURUGAN S" }, // Mocked
        { label: "Father's Occupation", value: data?.fatherOccupation || "-" },
        { label: "Scholarship Seeking For", value: "UG-BE - Semester I" }, // Mocked
        { label: "Request Amount", value: "50000" }, // Mocked
        { label: "Suggested Amount", value: "25000" }, // Mocked
        { label: "Approved Amount", value: "25000" }, // Mocked
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
