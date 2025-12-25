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
import { processManagement } from "../../../services/scholarship.service";

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

const ProcessHistoryModal: React.FC<ProcessHistoryModalProps> = ({
    open,
    onOpenChange,
    applicationNo,
}) => {
    const [currentPage, setCurrentPage] = React.useState(1);
    const [pageSize, setPageSize] = React.useState(10);
    const [historyData, setHistoryData] = React.useState<HistoryItem[]>([]);
    const [totalItems, setTotalItems] = React.useState(0);
    const [loading, setLoading] = React.useState(false);

    // Fetch history data from API
    React.useEffect(() => {
        if (open && applicationNo) {
            fetchHistory();
        }
    }, [open, applicationNo, currentPage, pageSize]);

    const fetchHistory = async () => {
        if (!applicationNo) return;
        
        setLoading(true);
        try {
            const response = await processManagement.getApplicationHistory(applicationNo, {
                page: currentPage,
                pageSize: pageSize,
            });
            setHistoryData(response.data || []);
            setTotalItems(response.total || 0);
        } catch (error) {
            console.error('Error fetching history:', error);
            setHistoryData([]);
            setTotalItems(0);
        } finally {
            setLoading(false);
        }
    };

    const totalPages = Math.ceil(totalItems / pageSize);

    const columns = [
        { 
            key: "id", 
            name: "S.No.", 
            minWidth: 60, 
            maxWidth: 60, 
            onRender: (item: HistoryItem, index: number) => (currentPage - 1) * pageSize + index + 1 
        },
        { key: "action", name: "Action", minWidth: 150, onRender: (item: HistoryItem) => item.action },
        { key: "processUndergone", name: "Process Undergone", minWidth: 250, onRender: (item: HistoryItem) => item.processUndergone },
        { key: "handledBy", name: "Handled by", minWidth: 120, onRender: (item: HistoryItem) => item.handledBy },
        { key: "date", name: "Date", minWidth: 150, onRender: (item: HistoryItem) => item.date },
    ];

    const handleClose = () => {
        onOpenChange(false); // Close the modal when the close icon is clicked
    };
    const handleDownload = async () => {
        if (!applicationNo) return;
        
        // Fetch all history data for download
        try {
            const response = await processManagement.getApplicationHistory(applicationNo, {
                page: 1,
                pageSize: 1000, // Get all records for download
            });
            const allHistoryData = response.data || [];

            const doc = new jsPDF();
            doc.text(`History Against Application Number : ${applicationNo}`, 14, 15);

            autoTable(doc, {
                startY: 20,
                head: [["S.No.", "Action", "Process Undergone", "Handled by", "Date"]],
                body: allHistoryData.map((item: HistoryItem, index: number) => [
                    index + 1,
                    item.action,
                    item.processUndergone,
                    item.handledBy,
                    item.date,
                ]),
            });

            doc.save(`${applicationNo}_history.pdf`);
        } catch (error) {
            console.error('Error downloading history:', error);
        }
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
                    {loading ? (
                        <div style={{ padding: "20px", textAlign: "center" }}>Loading...</div>
                    ) : (
                        <Table
                            columns={columns}
                            data={historyData}
                            disableScroll={true} // Modal handles scrolling
                            className="w-full"
                        />
                    )}
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
                        onPageChange={(page) => {
                            setCurrentPage(page);
                        }}
                        onPageSizeChange={(newPageSize) => {
                            setPageSize(newPageSize);
                            setCurrentPage(1); // Reset to first page when page size changes
                        }}
                        pageSizeOptions={[5, 10, 20, 50]}
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
