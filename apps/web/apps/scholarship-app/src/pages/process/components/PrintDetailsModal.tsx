import * as React from "react";
import { 
    Modal, 
    Button,
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from "@shared/components";
import {
    ArrowDownload24Regular,
    Print24Regular,
    Dismiss24Regular,
    DocumentRegular,
    DocumentDataRegular,
    TableRegular,
} from "@fluentui/react-icons";
import { ApplicationData } from "../types";
import { useToast } from "@/components/ui/toast";

interface PrintDetailsModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    data?: ApplicationData;
}

const PrintDetailsModal: React.FC<PrintDetailsModalProps> = ({
    open,
    onOpenChange,
    data,
}) => {
    const { success, error: showError } = useToast();
    
    // Helper function to format date
    const formatDate = (dateValue: unknown): string => {
        if (!dateValue) return "--";
        try {
            // Handle different date formats
            let dateStr = '';
            if (typeof dateValue === 'string') {
                dateStr = dateValue.trim();
            } else if (typeof dateValue === 'number') {
                dateStr = String(dateValue);
            } else if (dateValue instanceof Date) {
                // If it's already a Date object, format it directly
                if (isNaN(dateValue.getTime())) return "--";
                return dateValue.toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric'
                });
            } else if (typeof dateValue === 'object') {
                // Don't try to stringify objects
                return "--";
            } else {
                dateStr = String(dateValue).trim();
            }
            
            if (!dateStr || dateStr === 'null' || dateStr === 'undefined') return "--";
            
            // Check if the date string is in DD/MM/YYYY format
            const ddmmyyyyPattern = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/;
            const match = ddmmyyyyPattern.exec(dateStr);
            
            let date: Date;
            if (match) {
                // Parse DD/MM/YYYY format
                const day = parseInt(match[1] ?? '0', 10);
                const month = parseInt(match[2] ?? '0', 10) - 1; // Month is 0-indexed
                const year = parseInt(match[3] ?? '0', 10);
                date = new Date(year, month, day);
            } else {
                // Try standard Date parsing (for ISO, MM/DD/YYYY, etc.)
                date = new Date(dateStr);
            }
            
            if (isNaN(date.getTime())) return "--";
            
            // Format as DD-MM-YYYY
            return date.toLocaleDateString('en-GB', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            });
        } catch {
            return "--";
        }
    };
    
    // Get data from ApplicationData - using API fields
    // Priority: Scholarship_Issued_Date (as per existing app) > DDCheque_Date > Donated_Date
    const apiData = data as Record<string, unknown> | undefined;
    
    // Helper to check if a value is valid (not null, undefined, empty string, or 'null' string)
    const isValidValue = (val: unknown): boolean => {
        if (val === null || val === undefined) return false;
        if (typeof val === 'object') return false; // Don't stringify objects
        const str = String(val).trim();
        return str !== '' && str !== 'null' && str !== 'undefined';
    };
    
    // Check for Scholarship_Issued_Date (can be string or null)
    const scholarshipIssuedDate = apiData?.Scholarship_Issued_Date;
    const ddChequeDate = apiData?.DDCheque_Date;
    const donatedDate = apiData?.Donated_Date;
    
    // Debug: Log available date fields (remove in production)
    React.useEffect(() => {
        if (open && data) {
            console.log('PrintDetailsModal - Date fields:', {
                Scholarship_Issued_Date: scholarshipIssuedDate,
                DDCheque_Date: ddChequeDate,
                Donated_Date: donatedDate,
                allData: apiData,
            });
        }
    }, [open, data, scholarshipIssuedDate, ddChequeDate, donatedDate, apiData]);
    
    // Format date with proper null/empty checks
    const chequeDate = isValidValue(scholarshipIssuedDate)
      ? formatDate(scholarshipIssuedDate)
      : isValidValue(ddChequeDate)
        ? formatDate(ddChequeDate)
        : isValidValue(donatedDate)
          ? formatDate(donatedDate)
          : "--";
    
    const chequeAmount = (data as Record<string, unknown>)?.Scholarship_Issued_Amount 
      ? String((data as Record<string, unknown>).Scholarship_Issued_Amount) 
      : (data as Record<string, unknown>)?.Scholarship_Approved_Amount
        ? String((data as Record<string, unknown>).Scholarship_Approved_Amount)
        : data?.approvedAmount 
          ? String(data.approvedAmount)
          : "--";
    
    const scholarshipIssueNumber = data?.scholarshipNumber && data.scholarshipNumber !== '-' 
      ? data.scholarshipNumber 
      : "--";
    
    const chequeInFavor = (data as Record<string, unknown>)?.DDCheque_In_Favor 
      ? String((data as Record<string, unknown>).DDCheque_In_Favor) 
      : data?.studentName || "--";

    const details = [
        { id: 1, label: "Application Number", value: data?.applicationNo || "--" },
        { id: 2, label: "Name", value: data?.studentName || "--" },
        { id: 3, label: "Cheque in favour of", value: chequeInFavor },
        { id: 4, label: "Cheque Date", value: chequeDate },
        { id: 5, label: "Cheque Amount", value: chequeAmount },
        { id: 6, label: "Scholarship Issue Number", value: scholarshipIssueNumber },
    ];

    const approvalDetails = [
        { id: 1, label: "Prepared By", value: data?.preparedBy && data.preparedBy !== '-' ? data.preparedBy : "--" },
        { id: 2, label: "Verified By", value: data?.verifiedBy && data.verifiedBy !== '-' ? data.verifiedBy : "--" },
        { id: 3, label: "Suggested By", value: data?.suggestedBy && data.suggestedBy !== '-' ? data.suggestedBy : "--" },
        { id: 4, label: "Authorized By", value: "--" },
        { id: 5, label: "Passed By", value: "--" },
        { id: 6, label: "Trustee", value: "--" },
    ];

    const handlePrint = () => {
        window.print();
    };

    const handleDownloadExcel = () => {
        try {
            // Prepare CSV data
            const headers = ["ID", "Label", "Value"];
            
            // Combine details and approval details
            const allDetails = [
                ...details.map(item => [item.id, item.label, item.value]),
                ...approvalDetails.map(item => [item.id, item.label, item.value]),
            ];
            
            // Create CSV content
            const csvContent = [
                headers.join(','),
                ...allDetails.map((row: (string | number)[]) => 
                    row.map((cell: string | number) => `"${String(cell).replace(/"/g, '""')}"`).join(',')
                )
            ].join('\n');
            
            // Create and download CSV file
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = `${data?.applicationNo || "scholarship"}_print_details.xlsx`;
            link.click();
            URL.revokeObjectURL(link.href);
            
            success('Download Successful', 'Print details exported to Excel successfully');
        } catch (error) {
            console.error('Error downloading Excel:', error);
            showError('Download Failed', 'Failed to export print details to Excel. Please try again.');
        }
    };

    const handleDownloadWord = () => {
        try {
            // Prepare data for Word export
            const headers = ["ID", "Label", "Value"];
            
            // Combine details and approval details
            const allDetails = [
                ...details.map(item => [item.id, item.label, item.value]),
                ...approvalDetails.map(item => [item.id, item.label, item.value]),
            ];
            
            // Create tab-separated content (Word can open TSV files)
            let wordContent = headers.join('\t') + '\n';
            allDetails.forEach((row: (string | number)[]) => {
                wordContent += row.join('\t') + '\n';
            });
            
            // Create and download Word file
            const blob = new Blob([wordContent], { 
                type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' 
            });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = `${data?.applicationNo || "scholarship"}_print_details.docx`;
            link.click();
            URL.revokeObjectURL(link.href);
            
            success('Download Successful', 'Print details exported to Word successfully');
        } catch (error) {
            console.error('Error downloading Word:', error);
            showError('Download Failed', 'Failed to export print details to Word. Please try again.');
        }
    };

    const renderRow = (id: number, label: string, value: string, index: number) => (
        <div key={id} style={{
            display: "flex",
            borderBottom: "1px solid #e0e0e0",
            backgroundColor: index % 2 === 0 ? "#FAFAFA" : "#ffffff",
        }}>
            <div style={{
                width: "60px",
                padding: "12px 16px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#616161",
                fontSize: "13px",
                lineHeight:"20px",
                fontWeight:400
            }}>
                {id}
            </div>
            <div style={{
                flex: 1,
                padding: "12px 16px",
                fontWeight: 600,
                color: "#242424",
                fontFamily: "'Inter', sans-serif",
                fontSize:"12px",
                lineHeight:"16px"
            }}>
                {label}
            </div>
            <div style={{
                flex: 1,
                padding: "12px 16px",
                color: "#242424",
                fontSize: "13px",
                fontFamily: "'Inter', sans-serif",
                lineHeight:"20px",
                fontWeight:400
            }}>
                {value}
            </div>
        </div>
    );

    return (
        <Modal
            open={open}
            onOpenChange={onOpenChange}
            size="lg"
            headerContent={
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", gap: "20px" }}>
                    <span style={{ fontSize: "16px", fontWeight: 600, color: "#242424", fontFamily: "'Inter', sans-serif", whiteSpace: "nowrap",lineHeight:"22px" }}>
                        LEO MUTHU - Scholarship Print Details ( 2025-2026 )
                    </span>
                    <div style={{ display: "flex", gap: "8px" }}>
                        <DropdownMenu>
                            <DropdownMenuTrigger>
                                <Button
                                    appearance="outline"
                                    icon={<ArrowDownload24Regular />}
                                    style={{ width: "32px", height: "32px", padding: 0 }}
                                    aria-label="Download"
                                />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuItem 
                                    onClick={handleDownloadExcel}
                                    style={{ fontSize: "13px", fontFamily: "'Inter', sans-serif" }}
                                >
                                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                        <TableRegular style={{ width: "16px", height: "16px" }} />
                                        Excel
                                    </div>
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                    onClick={handleDownloadWord}
                                    style={{ fontSize: "13px", fontFamily: "'Inter', sans-serif" }}
                                >
                                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                        <DocumentDataRegular style={{ width: "16px", height: "16px" }} />
                                        Word
                                    </div>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                        <Button
                            appearance="outline"
                            icon={<Print24Regular />}
                            onClick={handlePrint}
                            style={{ width: "32px", height: "32px", padding: 0 }}
                            aria-label="Print"
                        />
                        <style>{`
                            .no-hover-effect:hover {
                                background-color: transparent !important;
                                opacity: 1 !important;
                            }
                        `}</style>
                        <Button
                            appearance="subtle"
                            icon={<Dismiss24Regular />}
                            onClick={() => onOpenChange(false)}
                            style={{ width: "32px", height: "32px", padding: 0 }}
                            aria-label="Close"
                            className="no-hover-effect"
                        />
                    </div>
                </div>
            }
            hideDefaultHeader={true}
        >
            <div style={{
                display: "flex",
                flexDirection: "column",
                gap: "24px",
                padding: "8px 0",
                maxHeight: "75vh",
                overflowY: "auto"
            }}>

                {/* First Table Section */}
                <div style={{
                    border: "1px solid #e0e0e0",
                    borderRadius: "8px",
                    overflow: "hidden"
                }}>
                    {details.map((item, index) => renderRow(item.id, item.label, item.value, index))}
                </div>

                {/* Approval Section */}
                <div>
                    <h3 style={{
                        fontSize: "16px",
                        fontWeight: 600,
                        color: "#242424",
                        marginBottom: "12px",
                        fontFamily: "'Inter', sans-serif",
                        lineHeight:"22px"
                    }}>
                        Approval By
                    </h3>
                    <div style={{
                        border: "1px solid #e0e0e0",
                        borderRadius: "8px",
                        overflow: "hidden"
                    }}>
                        {approvalDetails.map((item, index) => renderRow(item.id, item.label, item.value, index))}
                    </div>
                </div>

            </div>
        </Modal>
    );
};

export default PrintDetailsModal;
