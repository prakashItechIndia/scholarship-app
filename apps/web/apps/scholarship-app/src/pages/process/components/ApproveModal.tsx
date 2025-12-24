import * as React from "react";
import { Modal, Button } from "@shared/components";
import { Dismiss24Regular, CheckmarkCircle24Regular } from "@fluentui/react-icons";
import { ApplicationData } from "../types";
import { processManagement } from "../../../services/scholarship.service";
import { useToast } from "@/components/ui/toast";

interface ApproveModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    data?: ApplicationData | null;
    onApproveSuccess?: () => void;
}

const ApproveModal: React.FC<ApproveModalProps> = ({
    open,
    onOpenChange,
    data,
    onApproveSuccess,
}) => {
    const { success, error: showError } = useToast();
    const [approvedAmount, setApprovedAmount] = React.useState("");
    const [comment, setComment] = React.useState("");
    const [isSubmitted, setIsSubmitted] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [modalTitle, setModalTitle] = React.useState("LEO MUTHU - Scholarship Approve Panel ( 2024-2025 )");

    // Clean up state when modal closes/opens
    React.useEffect(() => {
        if (open) {
            setApprovedAmount("");
            setComment("");
            setIsSubmitted(false);
            setModalTitle("LEO MUTHU - Scholarship Approve Panel ( 2024-2025 )");
        }
    }, [open]);

    const details = [
        { label: "Application No", value: data?.applicationNo || "-" },
        { label: "Student Name", value: data?.studentName || "-" },
        { label: "Father's Name", value: "MURUGAN S" }, // Mocked
        { label: "Father's Occupation", value: data?.fatherOccupation || "-" },
        { label: "Scholarship Seeking For", value: "UG-BE - Semester I" }, // Mocked
        { label: "Request Amount", value: "50000" }, // Mocked
        { label: "Suggested Amount", value: "25000" }, // Mocked
    ];

    const handleSubmit = async () => {
        if (!data?.applicationNo || !approvedAmount) {
            showError('Validation Error', 'Please enter approved amount');
            return;
        }

        try {
            setLoading(true);
            // Get current user ID from localStorage
            const authData = localStorage.getItem('scholarship_auth');
            const userId = authData ? JSON.parse(authData).userId : undefined;

            await processManagement.approveApplication({
                applicationId: data.applicationNo,
                approvedAmount: parseFloat(approvedAmount),
                status: 'Approved',
                remarks: comment,
                approvedBy: userId,
            });

            setIsSubmitted(true);
            setModalTitle("Success");
            success('Success', 'Application approved successfully');

            // Call the success callback to refresh data
            if (onApproveSuccess) {
                setTimeout(() => {
                    onApproveSuccess(data.applicationNo);
                    onOpenChange(false);
                }, 1500);
            }
        } catch (err) {
            showError('Failed to Approve', err instanceof Error ? err.message : 'Failed to approve application');
        } finally {
            setLoading(false);
        }
    };

    const handleReject = async () => {
        if (!data?.applicationNo) {
            showError('Validation Error', 'Application data is missing');
            return;
        }

        if (!comment.trim()) {
            showError('Validation Error', 'Remarks are required for rejection');
            return;
        }

        try {
            setLoading(true);
            // Get current user ID from localStorage
            const authData = localStorage.getItem('scholarship_auth');
            const userId = authData ? JSON.parse(authData).userId : undefined;

            await processManagement.approveApplication({
                applicationId: data.applicationNo,
                approvedAmount: 0,
                status: 'Rejected',
                remarks: comment,
                approvedBy: userId,
            });

            success('Success', 'Application rejected successfully');
            onOpenChange(false);
        } catch (err) {
            showError('Failed to Reject', err instanceof Error ? err.message : 'Failed to reject application');
        } finally {
            setLoading(false);
        }
    }

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
                    backgroundColor: "#fafafa",
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
                            {modalTitle}
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
                        backgroundColor: "#ecfdf5",
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
                        Approved Successfully
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

                    {/* Approved Amount Input */}
                    <div>
                        <label style={{
                            display: "block",
                            marginBottom: "8px",
                            fontSize: "14px",
                            fontWeight: 400, // Regular weight as per look
                            color: "#242424",
                            fontFamily: "'Inter', sans-serif"
                        }}>
                            Approved Amount
                        </label>
                        <input
                            type="text"
                            style={{
                                width: "100%",
                                padding: "8px 12px",
                                borderRadius: "4px",
                                border: "1px solid #d1d1d1",
                                fontSize: "14px",
                                fontFamily: "'Inter', sans-serif",
                                color: "#242424",
                                outline: "none",
                                height: "40px"
                            }}
                            value={approvedAmount}
                            onChange={(e) => setApprovedAmount(e.target.value)}
                        />
                    </div>

                    {/* Comments Section */}
                    <div>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                            <label style={{ fontSize: "14px", fontWeight: 400, color: "#242424", fontFamily: "'Inter', sans-serif" }}>
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
                            onClick={handleReject}
                            style={{ minWidth: "100px", borderColor: "#d1d1d1", color: "#242424" }}
                        >
                            Reject
                        </Button>
                        <Button
                            appearance="primary"
                            onClick={handleSubmit}
                            disabled={loading || !approvedAmount}
                            style={{ backgroundColor: "#0F6CBD", color: "white", minWidth: "100px" }}
                        >
                            Approve
                        </Button>
                    </div>

                </div>
            )}
        </Modal>
    );
};

export default ApproveModal;
