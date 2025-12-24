import * as React from "react";
import {
    Modal,
    Button,
    Table,
} from "@shared/components";
import {
    ArrowDownload24Regular,
    Print24Regular,
    Dismiss24Regular,
} from "@fluentui/react-icons";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

interface ScholarshipHistoryModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    applicationNo?: string;
    studentName?: string;
}

const ScholarshipHistoryModal: React.FC<ScholarshipHistoryModalProps> = ({
    open,
    onOpenChange,
    applicationNo,
    studentName,
}) => {

    // Mock Data
    const alreadyApplied = "2018 ( AF1810636 ), 2019 ( AF1910749 ), 2020 ( AF2010002 ), 2021 ( AF2110755 ), 2022 ( AF2210061 ), 2023 ( AF2310003 ), 2024 ( AF2410001 )";

    const columns = [
        { key: "scholarshipYear", name: "ScholarshipYear", minWidth: 200, style: { width: "70%" }, onRender: (item: any) => item.year },
        { key: "issuedAmount", name: "Issued Amount", minWidth: 150, style: { width: "30%" }, onRender: (item: any) => item.amount },
    ];

    const issuedHistoryData = [
        { year: "2018 ( 18LMSS1120 )", amount: "53750" },
        { year: "2019 ( 19LMSS1215 )", amount: "57350" },
        { year: "2020 ( 20LMSS1263 )", amount: "100000" },
        { year: "2022 ( 22LMSS1002 )", amount: "100000" },
        { year: "2024 ( 24LMSS1002 )", amount: "200000" },
    ];

    const handleDownload = () => {
        const doc = new jsPDF();
        doc.setFontSize(16);
        doc.text("Previous Scholarship History", 14, 15);

        doc.setFontSize(12);
        doc.text(`Application No: ${applicationNo}`, 14, 25);
        doc.text(`Student Name: ${studentName}`, 14, 32);

        // Wrap text for "Already Applied"
        const splitApplied = doc.splitTextToSize(`Already Applied: ${alreadyApplied}`, 180);
        doc.text(splitApplied, 14, 40);

        const startY = 40 + (splitApplied.length * 7) + 10;

        doc.text("Already Scholarship Issued", 14, startY);

        autoTable(doc, {
            startY: startY + 5,
            head: [["ScholarshipYear", "Issued Amount"]],
            body: issuedHistoryData.map(item => [item.year, item.amount]),
        });

        doc.save(`${applicationNo}_scholarship_history.pdf`);
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <Modal
            open={open}
            onOpenChange={onOpenChange}
            size="lg"

            headerContent={
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", gap: "200px" }}>
                    <span style={{ fontSize: "16px", fontWeight: 600, color: "#242424", fontFamily: "'Inter', sans-serif", whiteSpace: "nowrap" }}>
                        Previous Scholarship History
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
            <div style={{ display: "flex", flexDirection: "column", gap: "24px", padding: "8px 0" }}>

                {/* Details Section */}
                <div style={{ border: "1px solid #e0e0e0", borderRadius: "8px", overflow: "hidden" }}>
                    <div style={{ display: "flex", borderBottom: "1px solid #e0e0e0" }}>
                        <div style={{ padding: "12px 16px", width: "30%", backgroundColor: "#fafafa", fontWeight: 600, fontSize: "14px", color: "#424242" }}>
                            Application No
                        </div>
                        <div style={{ padding: "12px 16px", flex: 1, fontSize: "14px", color: "#242424" }}>
                            {applicationNo}
                        </div>
                    </div>
                    <div style={{ display: "flex", borderBottom: "1px solid #e0e0e0" }}>
                        <div style={{ padding: "12px 16px", width: "30%", backgroundColor: "#fafafa", fontWeight: 600, fontSize: "14px", color: "#424242" }}>
                            Student Name
                        </div>
                        <div style={{ padding: "12px 16px", flex: 1, fontSize: "14px", color: "#242424" }}>
                            {studentName}
                        </div>
                    </div>
                    <div style={{ display: "flex" }}>
                        <div style={{ padding: "12px 16px", width: "30%", backgroundColor: "#fafafa", fontWeight: 600, fontSize: "14px", color: "#424242", display: "flex", alignItems: "center" }}>
                            Already Applied
                        </div>
                        <div style={{ padding: "12px 16px", flex: 1, fontSize: "14px", color: "#242424", lineHeight: "1.5" }}>
                            {alreadyApplied}
                        </div>
                    </div>
                </div>

                {/* Issued History Section */}
                <div>
                    <h3 style={{ fontSize: "16px", fontWeight: 600, color: "#242424", marginBottom: "12px", fontFamily: "'Inter', sans-serif" }}>
                        Already Scholarship Issued
                    </h3>
                    <div style={{ border: "1px solid #e0e0e0", borderRadius: "8px", overflow: "hidden" }}>
                        <Table
                            columns={columns}
                            data={issuedHistoryData}
                            disableScroll={true}
                            className="w-full"
                        />
                    </div>
                </div>

            </div>
        </Modal>
    );
};

export default ScholarshipHistoryModal;
