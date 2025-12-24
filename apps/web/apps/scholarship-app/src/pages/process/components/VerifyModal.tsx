import * as React from "react";
import { Button } from "@shared/components";
import { Dismiss24Regular, ArrowDownload24Regular } from "@fluentui/react-icons";
import { ApplicationData } from "../types";
import { processManagement } from "../../../services/scholarship.service";
import { useToast } from "@/components/ui/toast";

interface VerifyModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    data?: ApplicationData | null;
    onPreviousScholarshipHistory?: () => void;
    onVerifySuccess?: () => void;
}

const VerifyModal: React.FC<VerifyModalProps> = ({
    open,
    onOpenChange,
    data,
    onPreviousScholarshipHistory,
    onVerifySuccess,
}) => {
    const { success, error: showError } = useToast();
    const [remarks, setRemarks] = React.useState("");
    const [loading, setLoading] = React.useState(false);
    const [formData, setFormData] = React.useState({
        name: "AGATHIYAN J",
        aadhaar: "**** **** 3901",
        pan: "AAAPA1234A",
        studentId: "TBM24LK127",
        dob: "22/05/2020",
        gender: "Male",
        mobileNumber: "1234567890",
        emailId: "",
        community: "Backward Class",
        caste: "Select",
        fatherName: "JAYAVEL",
        fatherOccupation: "Private Sector",
        motherName: "CHITRA",
        motherOccupation: "House Wife",
        guardianName: "",
        guardianOccupation: "",
        typeOfInstitution: "Private",
        nameOfInstitution: "SAIRAM MAT HR SEC SCHOOL",
        classStudying: "12th STD",
        boardOfStudying: "Matriculation",
        address: "NO.3, GANDHI STREET.....",
        city: "Chennai",
        pincode: "600048",
        country: "India",
        state: "Tamil Nadu",
        district: "Chennai",
    });

    if (!open) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: "rgba(0, 0, 0, 0.4)",
                    zIndex: 1000,
                    animation: "fadeIn 0.2s ease-in-out",
                }}
                onClick={() => onOpenChange(false)}
            />

            {/* Drawer Panel */}
            <div
                style={{
                    position: "fixed",
                    top: 0,
                    right: 0,
                    bottom: 0,
                    width: "70%",
                    backgroundColor: "#ffffff",
                    boxShadow: "-4px 0 16px rgba(0, 0, 0, 0.1)",
                    zIndex: 1001,
                    display: "flex",
                    flexDirection: "column",
                    animation: "slideInRight 0.3s ease-out",
                }}
                onClick={(e) => e.stopPropagation()}
            >
                <style>
                    {`
                        @keyframes fadeIn {
                            from { opacity: 0; }
                            to { opacity: 1; }
                        }
                        @keyframes slideInRight {
                            from { transform: translateX(100%); }
                            to { transform: translateX(0); }
                        }
                    `}
                </style>

                {/* Header */}
                <div style={{
                    padding: "20px 32px",
                    borderBottom: "1px solid #e0e0e0",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    backgroundColor: "#ffffff",
                    flexShrink: 0,
                }}>
                    <span style={{ fontSize: "18px", fontWeight: 600, color: "#242424", fontFamily: "'Inter', sans-serif" }}>
                        LEO MUTHU Scholarship - Document Verification ( 2025-2026 )
                    </span>
                    <Button
                        appearance="subtle"
                        icon={<Dismiss24Regular />}
                        onClick={() => onOpenChange(false)}
                        style={{ padding: 0, minWidth: "32px" }}
                        aria-label="Close"
                    />
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "20px", padding: "24px 32px", overflowY: "auto", flex: 1 }}>
                    {/* Application Number */}
                    <div style={{ marginBottom: "12px" }}>
                        <span style={{ fontSize: "14px", fontWeight: 600, color: "#242424", fontFamily: "'Inter', sans-serif" }}>
                            Application Number : {data?.applicationNo || "AF2510007"}
                        </span>
                    </div>

                    {/* Name, AADHAAR ID, PAN NO Row */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px" }}>
                        <div>
                            <label style={{ display: "block", marginBottom: "6px", fontSize: "13px", fontWeight: 500, color: "#242424", fontFamily: "'Inter', sans-serif" }}>
                                Name
                            </label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                style={{
                                    width: "100%",
                                    padding: "8px 12px",
                                    borderRadius: "4px",
                                    border: "1px solid #d1d1d1",
                                    fontSize: "14px",
                                    fontFamily: "'Inter', sans-serif",
                                    backgroundColor: "#f5f5f5",
                                }}
                            />
                        </div>
                        <div>
                            <label style={{ display: "block", marginBottom: "6px", fontSize: "13px", fontWeight: 500, color: "#242424", fontFamily: "'Inter', sans-serif" }}>
                                AADHAAR ID
                            </label>
                            <input
                                type="text"
                                value={formData.aadhaar}
                                onChange={(e) => setFormData({ ...formData, aadhaar: e.target.value })}
                                style={{
                                    width: "100%",
                                    padding: "8px 12px",
                                    borderRadius: "4px",
                                    border: "1px solid #d1d1d1",
                                    fontSize: "14px",
                                    fontFamily: "'Inter', sans-serif",
                                    backgroundColor: "#f5f5f5",
                                }}
                            />
                        </div>
                        <div>
                            <label style={{ display: "block", marginBottom: "6px", fontSize: "13px", fontWeight: 500, color: "#242424", fontFamily: "'Inter', sans-serif" }}>
                                PAN NO
                            </label>
                            <input
                                type="text"
                                value={formData.pan}
                                onChange={(e) => setFormData({ ...formData, pan: e.target.value })}
                                style={{
                                    width: "100%",
                                    padding: "8px 12px",
                                    borderRadius: "4px",
                                    border: "1px solid #d1d1d1",
                                    fontSize: "14px",
                                    fontFamily: "'Inter', sans-serif",
                                    backgroundColor: "#f5f5f5",
                                }}
                            />
                        </div>
                    </div>

                    {/* Student Id, Date Of Birth, Gender Row */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px" }}>
                        <div>
                            <label style={{ display: "block", marginBottom: "6px", fontSize: "13px", fontWeight: 500, color: "#242424", fontFamily: "'Inter', sans-serif" }}>
                                Student Id
                            </label>
                            <input
                                type="text"
                                value={formData.studentId}
                                style={{
                                    width: "100%",
                                    padding: "8px 12px",
                                    borderRadius: "4px",
                                    border: "1px solid #d1d1d1",
                                    fontSize: "14px",
                                    fontFamily: "'Inter', sans-serif",
                                    backgroundColor: "#f5f5f5",
                                }}
                            />
                        </div>
                        <div>
                            <label style={{ display: "block", marginBottom: "6px", fontSize: "13px", fontWeight: 500, color: "#242424", fontFamily: "'Inter', sans-serif" }}>
                                Date Of Birth
                            </label>
                            <input
                                type="text"
                                value={formData.dob}
                                style={{
                                    width: "100%",
                                    padding: "8px 12px",
                                    borderRadius: "4px",
                                    border: "1px solid #d1d1d1",
                                    fontSize: "14px",
                                    fontFamily: "'Inter', sans-serif",
                                    backgroundColor: "#f5f5f5",
                                }}
                            />
                        </div>
                        <div>
                            <label style={{ display: "block", marginBottom: "6px", fontSize: "13px", fontWeight: 500, color: "#242424", fontFamily: "'Inter', sans-serif" }}>
                                Gender
                            </label>
                            <select
                                value={formData.gender}
                                style={{
                                    width: "100%",
                                    padding: "8px 12px",
                                    borderRadius: "4px",
                                    border: "1px solid #d1d1d1",
                                    fontSize: "14px",
                                    fontFamily: "'Inter', sans-serif",
                                    backgroundColor: "#f5f5f5",
                                }}
                            >
                                <option>Male</option>
                                <option>Female</option>
                                <option>Other</option>
                            </select>
                        </div>
                    </div>

                    {/* Mobile Number, Email Id, Community Row */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px" }}>
                        <div>
                            <label style={{ display: "block", marginBottom: "6px", fontSize: "13px", fontWeight: 500, color: "#242424", fontFamily: "'Inter', sans-serif" }}>
                                Mobile Number
                            </label>
                            <select
                                value={formData.mobileNumber}
                                style={{
                                    width: "100%",
                                    padding: "8px 12px",
                                    borderRadius: "4px",
                                    border: "1px solid #d1d1d1",
                                    fontSize: "14px",
                                    fontFamily: "'Inter', sans-serif",
                                    backgroundColor: "#f5f5f5",
                                }}
                            >
                                <option>1234567890</option>
                            </select>
                        </div>
                        <div>
                            <label style={{ display: "block", marginBottom: "6px", fontSize: "13px", fontWeight: 500, color: "#242424", fontFamily: "'Inter', sans-serif" }}>
                                Email Id
                            </label>
                            <input
                                type="text"
                                value={formData.emailId}
                                placeholder=""
                                style={{
                                    width: "100%",
                                    padding: "8px 12px",
                                    borderRadius: "4px",
                                    border: "1px solid #d1d1d1",
                                    fontSize: "14px",
                                    fontFamily: "'Inter', sans-serif",
                                    backgroundColor: "#f5f5f5",
                                }}
                            />
                        </div>
                        <div>
                            <label style={{ display: "block", marginBottom: "6px", fontSize: "13px", fontWeight: 500, color: "#242424", fontFamily: "'Inter', sans-serif" }}>
                                Community
                            </label>
                            <select
                                value={formData.community}
                                style={{
                                    width: "100%",
                                    padding: "8px 12px",
                                    borderRadius: "4px",
                                    border: "1px solid #d1d1d1",
                                    fontSize: "14px",
                                    fontFamily: "'Inter', sans-serif",
                                    backgroundColor: "#f5f5f5",
                                }}
                            >
                                <option>Backward Class</option>
                            </select>
                        </div>
                    </div>

                    {/* Caste Row */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "16px" }}>
                        <div>
                            <label style={{ display: "block", marginBottom: "6px", fontSize: "13px", fontWeight: 500, color: "#242424", fontFamily: "'Inter', sans-serif" }}>
                                Caste
                            </label>
                            <select
                                value={formData.caste}
                                style={{
                                    width: "100%",
                                    padding: "8px 12px",
                                    borderRadius: "4px",
                                    border: "1px solid #d1d1d1",
                                    fontSize: "14px",
                                    fontFamily: "'Inter', sans-serif",
                                    backgroundColor: "#f5f5f5",
                                }}
                            >
                                <option>Select</option>
                            </select>
                        </div>
                    </div>

                    {/* Father's Name, Father's Occupation, Mother's Name Row */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px" }}>
                        <div>
                            <label style={{ display: "block", marginBottom: "6px", fontSize: "13px", fontWeight: 500, color: "#242424", fontFamily: "'Inter', sans-serif" }}>
                                Father's Name
                            </label>
                            <input
                                type="text"
                                value={formData.fatherName}
                                style={{
                                    width: "100%",
                                    padding: "8px 12px",
                                    borderRadius: "4px",
                                    border: "1px solid #d1d1d1",
                                    fontSize: "14px",
                                    fontFamily: "'Inter', sans-serif",
                                    backgroundColor: "#f5f5f5",
                                }}
                            />
                        </div>
                        <div>
                            <label style={{ display: "block", marginBottom: "6px", fontSize: "13px", fontWeight: 500, color: "#242424", fontFamily: "'Inter', sans-serif" }}>
                                Father's Occupation
                            </label>
                            <select
                                value={formData.fatherOccupation}
                                style={{
                                    width: "100%",
                                    padding: "8px 12px",
                                    borderRadius: "4px",
                                    border: "1px solid #d1d1d1",
                                    fontSize: "14px",
                                    fontFamily: "'Inter', sans-serif",
                                    backgroundColor: "#f5f5f5",
                                }}
                            >
                                <option>Private Sector</option>
                            </select>
                        </div>
                        <div>
                            <label style={{ display: "block", marginBottom: "6px", fontSize: "13px", fontWeight: 500, color: "#242424", fontFamily: "'Inter', sans-serif" }}>
                                Mother's Name
                            </label>
                            <input
                                type="text"
                                value={formData.motherName}
                                style={{
                                    width: "100%",
                                    padding: "8px 12px",
                                    borderRadius: "4px",
                                    border: "1px solid #d1d1d1",
                                    fontSize: "14px",
                                    fontFamily: "'Inter', sans-serif",
                                    backgroundColor: "#f5f5f5",
                                }}
                            />
                        </div>
                    </div>

                    {/* Mother's Occupation, Guardian Name, Guardian Occupation Row */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px" }}>
                        <div>
                            <label style={{ display: "block", marginBottom: "6px", fontSize: "13px", fontWeight: 500, color: "#242424", fontFamily: "'Inter', sans-serif" }}>
                                Mother's Occupation
                            </label>
                            <select
                                value={formData.motherOccupation}
                                style={{
                                    width: "100%",
                                    padding: "8px 12px",
                                    borderRadius: "4px",
                                    border: "1px solid #d1d1d1",
                                    fontSize: "14px",
                                    fontFamily: "'Inter', sans-serif",
                                    backgroundColor: "#f5f5f5",
                                }}
                            >
                                <option>House Wife</option>
                            </select>
                        </div>
                        <div>
                            <label style={{ display: "block", marginBottom: "6px", fontSize: "13px", fontWeight: 500, color: "#242424", fontFamily: "'Inter', sans-serif" }}>
                                Guardian Name
                            </label>
                            <input
                                type="text"
                                value={formData.guardianName}
                                style={{
                                    width: "100%",
                                    padding: "8px 12px",
                                    borderRadius: "4px",
                                    border: "1px solid #d1d1d1",
                                    fontSize: "14px",
                                    fontFamily: "'Inter', sans-serif",
                                    backgroundColor: "#f5f5f5",
                                }}
                            />
                        </div>
                        <div>
                            <label style={{ display: "block", marginBottom: "6px", fontSize: "13px", fontWeight: 500, color: "#242424", fontFamily: "'Inter', sans-serif" }}>
                                Guardian Occupation
                            </label>
                            <input
                                type="text"
                                value={formData.guardianOccupation}
                                style={{
                                    width: "100%",
                                    padding: "8px 12px",
                                    borderRadius: "4px",
                                    border: "1px solid #d1d1d1",
                                    fontSize: "14px",
                                    fontFamily: "'Inter', sans-serif",
                                    backgroundColor: "#f5f5f5",
                                }}
                            />
                        </div>
                    </div>

                    {/* Type of Institution, Name of Institution, Class Studying Row */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px" }}>
                        <div>
                            <label style={{ display: "block", marginBottom: "6px", fontSize: "13px", fontWeight: 500, color: "#242424", fontFamily: "'Inter', sans-serif" }}>
                                Type of Institution
                            </label>
                            <select
                                value={formData.typeOfInstitution}
                                style={{
                                    width: "100%",
                                    padding: "8px 12px",
                                    borderRadius: "4px",
                                    border: "1px solid #d1d1d1",
                                    fontSize: "14px",
                                    fontFamily: "'Inter', sans-serif",
                                    backgroundColor: "#f5f5f5",
                                }}
                            >
                                <option>Private</option>
                            </select>
                        </div>
                        <div>
                            <label style={{ display: "block", marginBottom: "6px", fontSize: "13px", fontWeight: 500, color: "#242424", fontFamily: "'Inter', sans-serif" }}>
                                Name of Institution (Now studying)
                            </label>
                            <select
                                value={formData.nameOfInstitution}
                                style={{
                                    width: "100%",
                                    padding: "8px 12px",
                                    borderRadius: "4px",
                                    border: "1px solid #d1d1d1",
                                    fontSize: "14px",
                                    fontFamily: "'Inter', sans-serif",
                                    backgroundColor: "#f5f5f5",
                                }}
                            >
                                <option>SAIRAM MAT HR SEC SCHOOL</option>
                            </select>
                        </div>
                        <div>
                            <label style={{ display: "block", marginBottom: "6px", fontSize: "13px", fontWeight: 500, color: "#242424", fontFamily: "'Inter', sans-serif" }}>
                                Class Studying
                            </label>
                            <select
                                value={formData.classStudying}
                                style={{
                                    width: "100%",
                                    padding: "8px 12px",
                                    borderRadius: "4px",
                                    border: "1px solid #d1d1d1",
                                    fontSize: "14px",
                                    fontFamily: "'Inter', sans-serif",
                                    backgroundColor: "#f5f5f5",
                                }}
                            >
                                <option>12th STD</option>
                            </select>
                        </div>
                    </div>

                    {/* Board of Studying Row */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "16px" }}>
                        <div>
                            <label style={{ display: "block", marginBottom: "6px", fontSize: "13px", fontWeight: 500, color: "#242424", fontFamily: "'Inter', sans-serif" }}>
                                Board of Studying
                            </label>
                            <select
                                value={formData.boardOfStudying}
                                style={{
                                    width: "100%",
                                    padding: "8px 12px",
                                    borderRadius: "4px",
                                    border: "1px solid #d1d1d1",
                                    fontSize: "14px",
                                    fontFamily: "'Inter', sans-serif",
                                    backgroundColor: "#f5f5f5",
                                }}
                            >
                                <option>Matriculation</option>
                            </select>
                        </div>
                    </div>

                    {/* Address, City, Pincode Row */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px" }}>
                        <div>
                            <label style={{ display: "block", marginBottom: "6px", fontSize: "13px", fontWeight: 500, color: "#242424", fontFamily: "'Inter', sans-serif" }}>
                                Address
                            </label>
                            <input
                                type="text"
                                value={formData.address}
                                style={{
                                    width: "100%",
                                    padding: "8px 12px",
                                    borderRadius: "4px",
                                    border: "1px solid #d1d1d1",
                                    fontSize: "14px",
                                    fontFamily: "'Inter', sans-serif",
                                    backgroundColor: "#f5f5f5",
                                }}
                            />
                        </div>
                        <div>
                            <label style={{ display: "block", marginBottom: "6px", fontSize: "13px", fontWeight: 500, color: "#242424", fontFamily: "'Inter', sans-serif" }}>
                                City
                            </label>
                            <input
                                type="text"
                                value={formData.city}
                                style={{
                                    width: "100%",
                                    padding: "8px 12px",
                                    borderRadius: "4px",
                                    border: "1px solid #d1d1d1",
                                    fontSize: "14px",
                                    fontFamily: "'Inter', sans-serif",
                                    backgroundColor: "#f5f5f5",
                                }}
                            />
                        </div>
                        <div>
                            <label style={{ display: "block", marginBottom: "6px", fontSize: "13px", fontWeight: 500, color: "#242424", fontFamily: "'Inter', sans-serif" }}>
                                Pincode
                            </label>
                            <input
                                type="text"
                                value={formData.pincode}
                                style={{
                                    width: "100%",
                                    padding: "8px 12px",
                                    borderRadius: "4px",
                                    border: "1px solid #d1d1d1",
                                    fontSize: "14px",
                                    fontFamily: "'Inter', sans-serif",
                                    backgroundColor: "#f5f5f5",
                                }}
                            />
                        </div>
                    </div>

                    {/* Country, State, District Row */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px" }}>
                        <div>
                            <label style={{ display: "block", marginBottom: "6px", fontSize: "13px", fontWeight: 500, color: "#242424", fontFamily: "'Inter', sans-serif" }}>
                                Country
                            </label>
                            <select
                                value={formData.country}
                                style={{
                                    width: "100%",
                                    padding: "8px 12px",
                                    borderRadius: "4px",
                                    border: "1px solid #d1d1d1",
                                    fontSize: "14px",
                                    fontFamily: "'Inter', sans-serif",
                                    backgroundColor: "#f5f5f5",
                                }}
                            >
                                <option>India</option>
                            </select>
                        </div>
                        <div>
                            <label style={{ display: "block", marginBottom: "6px", fontSize: "13px", fontWeight: 500, color: "#242424", fontFamily: "'Inter', sans-serif" }}>
                                State
                            </label>
                            <select
                                value={formData.state}
                                style={{
                                    width: "100%",
                                    padding: "8px 12px",
                                    borderRadius: "4px",
                                    border: "1px solid #d1d1d1",
                                    fontSize: "14px",
                                    fontFamily: "'Inter', sans-serif",
                                    backgroundColor: "#f5f5f5",
                                }}
                            >
                                <option>Tamil Nadu</option>
                            </select>
                        </div>
                        <div>
                            <label style={{ display: "block", marginBottom: "6px", fontSize: "13px", fontWeight: 500, color: "#242424", fontFamily: "'Inter', sans-serif" }}>
                                District
                            </label>
                            <select
                                value={formData.district}
                                style={{
                                    width: "100%",
                                    padding: "8px 12px",
                                    borderRadius: "4px",
                                    border: "1px solid #d1d1d1",
                                    fontSize: "14px",
                                    fontFamily: "'Inter', sans-serif",
                                    backgroundColor: "#f5f5f5",
                                }}
                            >
                                <option>Chennai</option>
                            </select>
                        </div>
                    </div>

                    {/* Remarks Section - Required for Recheck and Reject */}
                    <div style={{ marginTop: "20px" }}>
                        <label style={{ display: "block", marginBottom: "6px", fontSize: "14px", fontWeight: 500, color: "#242424", fontFamily: "'Inter', sans-serif" }}>
                            Remarks <span style={{ color: "#dc2626" }}>*</span> (Required for Recheck/Reject)
                        </label>
                        <textarea
                            placeholder="Enter remarks here"
                            style={{
                                width: "100%",
                                minHeight: "80px",
                                padding: "12px",
                                borderRadius: "4px",
                                border: "1px solid #d1d1d1",
                                fontSize: "14px",
                                fontFamily: "'Inter', sans-serif",
                                resize: "vertical",
                                outline: "none"
                            }}
                            value={remarks}
                            onChange={(e) => setRemarks(e.target.value)}
                        />
                    </div>

                    {/* Footer Buttons */}
                    <div style={{ display: "flex", justifyContent: "space-between", marginTop: "20px", paddingTop: "16px", borderTop: "1px solid #e0e0e0" }}>
                        <Button
                            appearance="outline"
                            onClick={onPreviousScholarshipHistory}
                            style={{
                                minWidth: "200px",
                                borderColor: "#d1d1d1",
                                color: "#242424",
                                display: "flex",
                                alignItems: "center",
                                gap: "8px"
                            }}
                            icon={<ArrowDownload24Regular style={{ width: "16px", height: "16px" }} />}
                        >
                            Previous Scholarship History
                        </Button>
                        <div style={{ display: "flex", gap: "12px" }}>
                            <Button
                                appearance="outline"
                                onClick={async () => {
                                    if (!data?.applicationNo) return;
                                    if (!remarks.trim()) {
                                        showError('Validation Error', 'Remarks are required for Recheck');
                                        return;
                                    }
                                    try {
                                        setLoading(true);
                                        const authData = localStorage.getItem('scholarship_auth');
                                        const userId = authData ? JSON.parse(authData).userId : undefined;
                                        await processManagement.verifyApplication({
                                            applicationId: data.applicationNo,
                                            status: 'Recheck',
                                            remarks,
                                            verifiedBy: userId,
                                        });
                                        success('Success', 'Application marked for recheck');
                                        if (onVerifySuccess) onVerifySuccess();
                                        onOpenChange(false);
                                    } catch (err) {
                                        showError('Failed to Recheck', err instanceof Error ? err.message : 'Failed to mark for recheck');
                                    } finally {
                                        setLoading(false);
                                    }
                                }}
                                disabled={loading}
                                style={{ 
                                    backgroundColor: "#FEF3C7", 
                                    color: "#92400E", 
                                    borderColor: "#FCD34D",
                                    minWidth: "100px" 
                                }}
                            >
                                {loading ? "Processing..." : "Recheck"}
                            </Button>
                            <Button
                                appearance="outline"
                                onClick={async () => {
                                    if (!data?.applicationNo) return;
                                    if (!remarks.trim()) {
                                        showError('Validation Error', 'Remarks are required for Rejection');
                                        return;
                                    }
                                    try {
                                        setLoading(true);
                                        const authData = localStorage.getItem('scholarship_auth');
                                        const userId = authData ? JSON.parse(authData).userId : undefined;
                                        await processManagement.verifyApplication({
                                            applicationId: data.applicationNo,
                                            status: 'Reject',
                                            remarks,
                                            verifiedBy: userId,
                                        });
                                        success('Success', 'Application rejected');
                                        if (onVerifySuccess) onVerifySuccess();
                                        onOpenChange(false);
                                    } catch (err) {
                                        showError('Failed to Reject', err instanceof Error ? err.message : 'Failed to reject application');
                                    } finally {
                                        setLoading(false);
                                    }
                                }}
                                disabled={loading}
                                style={{ 
                                    backgroundColor: "#FEE2E2", 
                                    color: "#991B1B", 
                                    borderColor: "#FCA5A5",
                                    minWidth: "100px" 
                                }}
                            >
                                {loading ? "Processing..." : "Reject"}
                            </Button>
                            <Button
                                appearance="primary"
                                onClick={async () => {
                                    if (!data?.applicationNo) return;
                                    try {
                                        setLoading(true);
                                        const authData = localStorage.getItem('scholarship_auth');
                                        const userId = authData ? JSON.parse(authData).userId : undefined;
                                        await processManagement.verifyApplication({
                                            applicationId: data.applicationNo,
                                            status: 'Verified',
                                            remarks: remarks || '',
                                            verifiedBy: userId,
                                        });
                                        success('Success', 'Application verified successfully');
                                        if (onVerifySuccess) onVerifySuccess();
                                        onOpenChange(false);
                                    } catch (err) {
                                        showError('Failed to Verify', err instanceof Error ? err.message : 'Failed to verify application');
                                    } finally {
                                        setLoading(false);
                                    }
                                }}
                                disabled={loading}
                                style={{ backgroundColor: "#10B981", color: "white", minWidth: "100px" }}
                            >
                                {loading ? "Processing..." : "Verify"}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default VerifyModal;
