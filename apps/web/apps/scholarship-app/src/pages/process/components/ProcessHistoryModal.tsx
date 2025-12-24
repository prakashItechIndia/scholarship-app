import * as React from "react";
import {
    Modal,
    Button,
    Table,
    Pagination,
} from "@shared/components";
import {
    ArrowDownload24Regular,
    Dismiss24Regular,
    Print24Regular,
} from "@fluentui/react-icons";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

interface ProcessHistoryModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    applicationNo?: string;
}

interface HistoryItem {
    id: number;
    action: string;
    processUndergone: string;
    handledBy: string;
    date: string;
}

const mockHistoryData: HistoryItem[] = [
    { id: 1, action: "Online Registration", processUndergone: "AF2510001 has registered successfully", handledBy: "Admin", date: "17/04/2025 12:15 PM" },
    { id: 2, action: "Initial Document Upload", processUndergone: "Following Initial Document Upload...", handledBy: "Admin", date: "17/05/2025 06:30 PM" },
    { id: 3, action: "Initial Document Upload", processUndergone: "Following Initial Document Upload...", handledBy: "Admin", date: "17/05/2025 06:45 PM" },
    { id: 4, action: "Initial Document Upload", processUndergone: "Following Initial Document Upload...", handledBy: "Admin", date: "17/05/2025 07:00 PM" },
    { id: 5, action: "Initial Document Upload", processUndergone: "Following Initial Document Upload...", handledBy: "Admin", date: "17/05/2025 07:15 PM" },
    { id: 6, action: "Initial Document Upload", processUndergone: "Following Initial Document Upload...", handledBy: "Admin", date: "17/05/2025 07:30 PM" },
    { id: 7, action: "Re-Print PDF", processUndergone: "Re-Print Application Form", handledBy: "Deepak", date: "30/05/2025 10:00 AM" },
    { id: 8, action: "Document Verification", processUndergone: "Documents are Verified by deepak", handledBy: "Deepak", date: "26/07/2025 05:00 PM" },
];

const ProcessHistoryModal: React.FC<ProcessHistoryModalProps> = ({
    open,
    onOpenChange,
    applicationNo,
}) => {
    const [currentPage, setCurrentPage] = React.useState(1);
    const [pageSize, setPageSize] = React.useState(10);

    const totalItems = mockHistoryData.length;
    const totalPages = Math.ceil(totalItems / pageSize);

    const paginatedData = React.useMemo(() => {
        const startIndex = (currentPage - 1) * pageSize;
        return mockHistoryData.slice(startIndex, startIndex + pageSize);
    }, [currentPage, pageSize]);

    const columns = [
        { key: "id", name: "S.No.", minWidth: 60, maxWidth: 60, onRender: (item: HistoryItem) => item.id },
        { key: "action", name: "Action", minWidth: 150, onRender: (item: HistoryItem) => item.action },
        { key: "processUndergone", name: "Process Undergone", minWidth: 250, onRender: (item: HistoryItem) => item.processUndergone },
        { key: "handledBy", name: "Handled by", minWidth: 120, onRender: (item: HistoryItem) => item.handledBy },
        { key: "date", name: "Date", minWidth: 150, onRender: (item: HistoryItem) => item.date },
    ];

    const handleClose = () => {
        onOpenChange(false); // Close the modal when the close icon is clicked
    };
    const handleDownload = () => {
        const doc = new jsPDF();
        doc.text(`History Against Application Number : ${applicationNo}`, 14, 15);

        autoTable(doc, {
            startY: 20,
            head: [["S.No.", "Action", "Process Undergone", "Handled by", "Date"]],
            body: mockHistoryData.map(item => [item.id, item.action, item.processUndergone, item.handledBy, item.date]),
        });

        doc.save(`${applicationNo}_history.pdf`);
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <Modal
            open={open}
            onOpenChange={onOpenChange}
            size="xl" // Adjusted size to accommodate table

            // Custom header to include actions
            headerContent={
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", gap: "60px" }}>
                    <span style={{ fontSize: "16px", fontWeight: 600, color: "#242424", fontFamily: "'Inter', sans-serif", whiteSpace: "nowrap" }}>
                        History Against Application Number : {applicationNo}
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
                            onClick={handleClose} // Close the modal on click
                            style={{ width: "32px", height: "32px", padding: 0 }}
                            aria-label="Close"
                        />
                    </div>
                </div >
            }
            hideDefaultHeader={true} // We are providing custom header content
        >
            <div style={{ display: "flex", flexDirection: "column", height: "60vh" }}>
                <div style={{ flex: 1, overflow: "auto" }}>
                    <Table
                        columns={columns}
                        data={paginatedData}
                        disableScroll={true} // Modal handles scrolling
                        className="w-full"
                    />
                </div>

                <div style={{
                    paddingTop: "16px",
                    borderTop: "1px solid #e0e0e0",
                    width: "100%"
                }}>
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        pageSize={pageSize}
                        totalItems={totalItems}
                        onPageChange={setCurrentPage}
                        onPageSizeChange={setPageSize}
                        pageSizeOptions={[5, 10, 20]}
                        showFirstLast={true}
                        showPageSize={true}
                        showPageNumbers={true}
                        className="w-full"
                    />
                </div>
            </div>
        </Modal >
    );
};

export default ProcessHistoryModal;
