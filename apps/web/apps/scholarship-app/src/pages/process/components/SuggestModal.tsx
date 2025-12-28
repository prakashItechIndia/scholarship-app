import * as React from "react";
import { Modal, Button } from "@shared/components";
import { Dismiss24Regular, CheckmarkCircle24Regular } from "@fluentui/react-icons";
import { ApplicationData } from "../types";
import { processManagement } from "../../../services/scholarship.service";
import { useToast } from "@/components/ui/toast";

interface SuggestModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    data?: ApplicationData | null;
    onSuggestSuccess?: (applicationNo: string) => void;
}

const SuggestModal: React.FC<SuggestModalProps> = ({
    open,
    onOpenChange,
    data,
    onSuggestSuccess,
}) => {
    const { success, error: showError } = useToast();
    const [suggestedAmount, setSuggestedAmount] = React.useState("");
    const [comment, setComment] = React.useState("");
    const [isSubmitted, setIsSubmitted] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [modalTitle, setModalTitle] = React.useState("LEO MUTHU - Scholarship Suggestion Panel ( 2024-2025 )");

    // Clean up state when modal closes/opens
    React.useEffect(() => {
        if (open) {
            setSuggestedAmount("");
            setComment("");
            setIsSubmitted(false);
            setModalTitle("LEO MUTHU - Scholarship Suggestion Panel ( 2024-2025 )");
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

    // Map data dynamically from API response (matching old app: ScholarshipSuggest.aspx.cs)
    const apiData = data as Record<string, unknown> | undefined;
    const details = [
        { label: "Application No", value: data?.applicationNo || safeString(apiData?.Application_Id) },
        { label: "Student Name", value: data?.studentName || safeString(apiData?.Applicant_Name) },
        { label: "Father's Name", value: data?.fatherName || safeString(apiData?.Father_Name) },
        { label: "Father's Occupation", value: data?.fatherOccupation || safeString(apiData?.Father_Occupation) },
        { label: "Scholarship Seeking For", value: data?.scholarshipSeekingFor || getScholarshipSeekingFor() },
        { label: "Request Amount", value: getNumberValue(data?.requestAmount, apiData?.RequestAmount, apiData?.Request_Amount) },
    ];

    const handleSubmit = async () => {
        if (!data?.applicationNo || !suggestedAmount) {
            showError('Validation Error', 'Please enter suggested amount');
            return;
        }

        try {
            setLoading(true);
            // Get current user ID from localStorage
            const authData = localStorage.getItem('scholarship_auth');
            const userId = authData ? JSON.parse(authData).userId : undefined;

            await processManagement.suggestAmount({
                applicationId: data.applicationNo,
                suggestedAmount: parseFloat(suggestedAmount),
                remarks: comment,
                suggestedBy: userId,
            });

            setIsSubmitted(true);
            setModalTitle("Success");
            success('Success', 'Amount suggested successfully');

            // Call the success callback to refresh data
            if (onSuggestSuccess && data.applicationNo) {
                setTimeout(() => {
                    onSuggestSuccess(data.applicationNo);
                    onOpenChange(false);
                }, 1500);
            }
        } catch (err) {
            showError('Failed to Suggest Amount', err instanceof Error ? err.message : 'Failed to suggest amount');
        } finally {
            setLoading(false);
        }
    };

    const handleReject = () => {
        console.log("Rejecting Suggestion:", {
            applicationNo: data?.applicationNo,
            comment,
        });
        onOpenChange(false);
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
                        Suggested Successfully
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

                    {/* Suggested Amount Input */}
                    <div>
                        <label style={{
                            display: "block",
                            marginBottom: "8px",
                            fontSize: "14px",
                            fontWeight: 400,
                            color: "#242424",
                            fontFamily: "'Inter', sans-serif"
                        }}>
                            Suggested Amount
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
                            value={suggestedAmount}
                            onChange={(e) => setSuggestedAmount(e.target.value)}
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
                            disabled={loading || !suggestedAmount}
                            style={{ backgroundColor: "#2453C3", color: "white", minWidth: "100px" }}
                        >
                            Suggest
                        </Button>
                    </div>

                </div>
            )}
        </Modal>
    );
};

export default SuggestModal;
