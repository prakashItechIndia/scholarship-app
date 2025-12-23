import * as React from "react";
import { Modal, Button } from "@shared/components";
import {
    ArrowDownload24Regular,
    Print24Regular,
    Dismiss24Regular,
} from "@fluentui/react-icons";
import { ApplicationData } from "../types";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

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
    // Mock data filling if specific fields aren't in ApplicationData types yet
    const details = [
        { id: 1, label: "Application Number", value: data?.applicationNo || "AF2510001" },
        { id: 2, label: "Name", value: data?.studentName || "Malathi R" },
        { id: 3, label: "Cheque in favour of", value: data?.studentName || "Malathi R" }, // Assuming same as student name
        { id: 4, label: "Cheque Date", value: "24/07/2025" }, // Mock
        { id: 5, label: "Cheque Amount", value: String(data?.amount || "200000") },
        { id: 6, label: "Scholarship Issue Number", value: "25LMSS1007" }, // Mock
    ];

    const approvalDetails = [
        { id: 1, label: "Prepared By", value: "Administrator" },
        { id: 2, label: "Verified By", value: "Deepak" },
        { id: 3, label: "Suggested By", value: "Balaji" },
        { id: 4, label: "Authorized By", value: "--" },
        { id: 5, label: "Passed By", value: "--" },
        { id: 6, label: "Trustee", value: "--" },
    ];

    const handlePrint = () => {
        window.print();
    };

    const handleDownload = () => {
        const doc = new jsPDF();

        // Title
        doc.setFontSize(16);
        doc.text("LEO MUTHU - Scholarship Print Details ( 2025-2026 )", 14, 15);

        // First Table - Application Details
        autoTable(doc, {
            startY: 25,
            head: [],
            body: details.map(item => [item.id, item.label, item.value]),
            theme: 'grid',
            styles: { fontSize: 10, cellPadding: 3 },
            columnStyles: {
                0: { cellWidth: 15, halign: 'center', fontStyle: 'normal' },
                1: { cellWidth: 60, fontStyle: 'bold' },
                2: { fontStyle: 'normal' }
            },
        });

        // Get final Y position of previous table
        const finalY = (doc as any).lastAutoTable.finalY + 10;

        // Approval By Header
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.text("Approval By", 14, finalY);

        // Second Table - Approval Details
        autoTable(doc, {
            startY: finalY + 5,
            head: [],
            body: approvalDetails.map(item => [item.id, item.label, item.value]),
            theme: 'grid',
            styles: { fontSize: 10, cellPadding: 3 },
            columnStyles: {
                0: { cellWidth: 15, halign: 'center', fontStyle: 'normal' },
                1: { cellWidth: 60, fontStyle: 'bold' },
                2: { fontStyle: 'normal' }
            },
        });

        doc.save(`${data?.applicationNo || "scholarship"}_print_details.pdf`);
    };

    const renderRow = (id: number, label: string, value: string) => (
        <div key={id} style={{
            display: "flex",
            borderBottom: "1px solid #e0e0e0",
            backgroundColor: "#ffffff",
        }}>
            <div style={{
                width: "60px",
                padding: "12px 16px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRight: "1px solid #e0e0e0",
                color: "#616161",
                fontSize: "14px",
            }}>
                {id}
            </div>
            <div style={{
                flex: 1,
                padding: "12px 16px",
                fontWeight: 600,
                color: "#242424",
                fontSize: "14px",
                borderRight: "1px solid #e0e0e0",
                fontFamily: "'Inter', sans-serif",
            }}>
                {label}
            </div>
            <div style={{
                flex: 1,
                padding: "12px 16px",
                color: "#242424",
                fontSize: "14px",
                fontFamily: "'Inter', sans-serif",
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
            title={`LEO MUTHU - Scholarship Print Details ( 2025-2026 )`}
            headerContent={
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", gap: "20px" }}>
                    <span style={{ fontSize: "16px", fontWeight: 600, color: "#242424", fontFamily: "'Inter', sans-serif", whiteSpace: "nowrap" }}>
                        LEO MUTHU - Scholarship Print Details ( 2025-2026 )
                    </span>
                    <div style={{ display: "flex", gap: "8px" }}>
                        <Button
                            appearance="outline"
                            icon={<ArrowDownload24Regular />}
                            onClick={handleDownload}
                            style={{ width: "32px", height: "32px", padding: 0 }}
                            aria-label="Download"
                        />
                        <Button
                            appearance="outline"
                            icon={<Print24Regular />}
                            onClick={handlePrint}
                            style={{ width: "32px", height: "32px", padding: 0 }}
                            aria-label="Print"
                        />
                        <Button
                            appearance="subtle"
                            icon={<Dismiss24Regular />}
                            onClick={() => onOpenChange(false)}
                            style={{ width: "32px", height: "32px", padding: 0 }}
                            aria-label="Close"
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
                    {details.map((item) => renderRow(item.id, item.label, item.value))}
                </div>

                {/* Approval Section */}
                <div>
                    <h3 style={{
                        fontSize: "16px",
                        fontWeight: 600,
                        color: "#242424",
                        marginBottom: "12px",
                        fontFamily: "'Inter', sans-serif"
                    }}>
                        Approval By
                    </h3>
                    <div style={{
                        border: "1px solid #e0e0e0",
                        borderRadius: "8px",
                        overflow: "hidden"
                    }}>
                        {approvalDetails.map((item) => renderRow(item.id, item.label, item.value))}
                    </div>
                </div>

            </div>
        </Modal>
    );
};

export default PrintDetailsModal;
