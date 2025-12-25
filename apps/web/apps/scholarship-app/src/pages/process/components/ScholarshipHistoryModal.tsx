import * as React from "react";
import {
    Modal,
    Button,
    Table,
    TableSkeleton,
    Skeleton,
} from "@shared/components";
import {
    ArrowDownload24Regular,
    Print24Regular,
    Dismiss24Regular,
} from "@fluentui/react-icons";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { processManagement } from "../../../services/scholarship.service";
import { useToast } from "@/components/ui/toast";

interface ScholarshipHistoryModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    applicationNo?: string;
    studentName?: string;
}

interface IssuedHistoryItem {
    year: string;
    amount: string;
}

const ScholarshipHistoryModal: React.FC<ScholarshipHistoryModalProps> = ({
    open,
    onOpenChange,
    applicationNo,
    studentName,
}) => {
    const { success, error: showError } = useToast();
    const [alreadyApplied, setAlreadyApplied] = React.useState<string>("");
    const [issuedHistoryData, setIssuedHistoryData] = React.useState<IssuedHistoryItem[]>([]);
    const [loading, setLoading] = React.useState(false);
    const [studentNameFromApi, setStudentNameFromApi] = React.useState<string>("");

    // Fetch scholarship history from API
    React.useEffect(() => {
        if (open && applicationNo) {
            fetchScholarshipHistory();
        }
    }, [open, applicationNo]);

    const fetchScholarshipHistory = async () => {
        if (!applicationNo) return;
        
        setLoading(true);
        try {
            const response = await processManagement.getScholarshipHistory(applicationNo);
            setAlreadyApplied(response.alreadyApplied || "No previous applications");
            setIssuedHistoryData(response.issuedHistory || []);
            setStudentNameFromApi(response.studentName || studentName || "");
        } catch (error) {
            console.error('Error fetching scholarship history:', error);
            showError('Failed to Load History', 'Failed to fetch scholarship history. Please try again.');
            setAlreadyApplied("No previous applications");
            setIssuedHistoryData([]);
        } finally {
            setLoading(false);
        }
    };

    const columns = [
        { key: "scholarshipYear", name: "ScholarshipYear", minWidth: 200, style: { width: "70%" }, onRender: (item: IssuedHistoryItem) => item.year },
        { key: "issuedAmount", name: "Issued Amount", minWidth: 150, style: { width: "30%" }, onRender: (item: IssuedHistoryItem) => item.amount },
    ];

    const handleDownload = () => {
        try {
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
                body: issuedHistoryData?.map(item => [item.year, item.amount]),
            });

            doc.save(`${applicationNo}_scholarship_history.pdf`);
            success('Download Successful', 'Scholarship history PDF downloaded successfully');
        } catch (error) {
            console.error('Error downloading scholarship history:', error);
            showError('Download Failed', 'Failed to download scholarship history. Please try again.');
        }
    };

    const handlePrint = () => {
        try {
            window.print();
            success('Print Ready', 'Print dialog opened successfully');
        } catch (error) {
            console.error('Error printing scholarship history:', error);
            showError('Print Failed', 'Failed to open print dialog. Please try again.');
        }
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
            {loading ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "24px", padding: "8px 0" }}>
                    {/* Details Section Skeleton */}
                    <div style={{ border: "1px solid #e0e0e0", borderRadius: "8px", overflow: "hidden", padding: "12px 16px" }}>
                        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                            <div style={{ display: "flex", gap: "12px" }}>
                                <Skeleton style={{ width: "30%", height: "20px" }} variant="rounded" />
                                <Skeleton style={{ width: "60%", height: "20px" }} variant="rounded" />
                            </div>
                            <div style={{ display: "flex", gap: "12px" }}>
                                <Skeleton style={{ width: "30%", height: "20px" }} variant="rounded" />
                                <Skeleton style={{ width: "60%", height: "20px" }} variant="rounded" />
                            </div>
                            <div style={{ display: "flex", gap: "12px" }}>
                                <Skeleton style={{ width: "30%", height: "20px" }} variant="rounded" />
                                <Skeleton style={{ width: "60%", height: "20px" }} variant="rounded" />
                            </div>
                        </div>
                    </div>
                    {/* Table Skeleton */}
                    <div>
                        <Skeleton style={{ width: "200px", height: "24px", marginBottom: "12px" }} variant="rounded" />
                        <div style={{ border: "1px solid #e0e0e0", borderRadius: "8px", overflow: "hidden" }}>
                            <TableSkeleton
                                columnCount={2}
                                rowCount={5}
                                columnWidths={[200, 150]}
                                showCheckbox={false}
                            />
                        </div>
                    </div>
                </div>
            ) : (
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
                            {studentNameFromApi || studentName || ""}
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
            )}
        </Modal>
    );
};

export default ScholarshipHistoryModal;
