import * as React from "react";
import {
    Modal,
    Button,
    Table,
    TableSkeleton,
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
import { useToast } from "@/components/ui/toast";

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
    const { success, error: showError, warning } = useToast();
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
            showError('Failed to Load History', 'Failed to fetch application history. Please try again.');
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
        
        setLoading(true);
        try {
            // Fetch ALL history data without pagination
            const response = await processManagement.getApplicationHistory(applicationNo, {
                getAllRecords: true,
            });
            const allHistoryData = response.data || [];

            // Generate PDF with all data
            const doc = new jsPDF();
            
            // Add title and metadata
            doc.setFontSize(16);
            doc.text(`History Against Application Number: ${applicationNo}`, 14, 15);

            doc.setFontSize(10);
            const currentDate = new Date().toLocaleString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
            });
            doc.text(`Generated on: ${currentDate}`, 14, 22);
            doc.text(`Total Records: ${allHistoryData.length}`, 14, 28);

            // Generate table with all data
            autoTable(doc, {
                startY: 35,
                head: [["S.No.", "Action", "Process Undergone", "Handled by", "Date"]],
                body: allHistoryData?.map((item: HistoryItem, index: number) => [
                    index + 1,
                    item.action || '',
                    item.processUndergone || '',
                    item.handledBy || '',
                    item.date || '',
                ]),
                styles: { fontSize: 8 },
                headStyles: { fillColor: [15, 108, 189], textColor: 255, fontStyle: 'bold' },
                alternateRowStyles: { fillColor: [245, 245, 245] },
                margin: { top: 35 },
            });

            doc.save(`${applicationNo}_history.pdf`);
            success('Download Successful', 'History PDF downloaded successfully');
        } catch (error) {
            console.error('Error downloading history:', error);
            showError('Download Failed', 'Failed to download history. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handlePrint = async () => {
        if (!applicationNo) return;
        
        setLoading(true);
        try {
            // Fetch ALL history data without pagination
            const response = await processManagement.getApplicationHistory(applicationNo, {
                getAllRecords: true,
            });
            const allHistoryData = response.data || [];

            // Create a print-friendly HTML document
            const printWindow = window.open('', '_blank');
            if (!printWindow) {
                warning('Popup Blocked', 'Please allow popups to print the history.');
                setLoading(false);
                return;
            }

            const printContent = `
                <!DOCTYPE html>
                <html>
                <head>
                    <title>History - ${applicationNo}</title>
                    <style>
                        @media print {
                            @page {
                                margin: 1cm;
                                size: A4;
                            }
                            body {
                                margin: 0;
                                padding: 0;
                            }
                        }
                        body {
                            font-family: 'Inter', Arial, sans-serif;
                            font-size: 12px;
                            padding: 20px;
                            color: #242424;
                        }
                        .header {
                            margin-bottom: 20px;
                            border-bottom: 2px solid #0f6cbd;
                            padding-bottom: 10px;
                        }
                        .title {
                            font-size: 18px;
                            font-weight: 600;
                            color: #242424;
                            margin-bottom: 8px;
                        }
                        .metadata {
                            font-size: 10px;
                            color: #616161;
                            margin-bottom: 4px;
                        }
                        table {
                            width: 100%;
                            border-collapse: collapse;
                            margin-top: 20px;
                        }
                        th {
                            background-color: #0f6cbd;
                            color: #ffffff;
                            padding: 10px;
                            text-align: left;
                            font-weight: 600;
                            border: 1px solid #0f6cbd;
                        }
                        td {
                            padding: 8px 10px;
                            border: 1px solid #e0e0e0;
                        }
                        tr:nth-child(even) {
                            background-color: #f5f5f5;
                        }
                        tr:hover {
                            background-color: #e6f2ff;
                        }
                        .footer {
                            margin-top: 30px;
                            padding-top: 10px;
                            border-top: 1px solid #e0e0e0;
                            font-size: 10px;
                            color: #616161;
                            text-align: center;
                        }
                    </style>
                </head>
                <body>
                    <div class="header">
                        <div class="title">History Against Application Number: ${applicationNo}</div>
                        <div class="metadata">Generated on: ${new Date().toLocaleString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                        })}</div>
                        <div class="metadata">Total Records: ${allHistoryData.length}</div>
                    </div>
                    <table>
                        <thead>
                            <tr>
                                <th>S.No.</th>
                                <th>Action</th>
                                <th>Process Undergone</th>
                                <th>Handled by</th>
                                <th>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${allHistoryData?.map((item: HistoryItem, index: number) => `
                                <tr>
                                    <td>${index + 1}</td>
                                    <td>${item.action || ''}</td>
                                    <td>${item.processUndergone || ''}</td>
                                    <td>${item.handledBy || ''}</td>
                                    <td>${item.date || ''}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                    <div class="footer">
                        <p>This report contains all history records for Application Number: ${applicationNo}</p>
                    </div>
                </body>
                </html>
            `;

            printWindow.document.write(printContent);
            printWindow.document.close();
            
            // Wait for content to load, then print
            printWindow.onload = () => {
                setTimeout(() => {
                    printWindow.print();
                    printWindow.close();
                }, 250);
            };
            success('Print Ready', 'Print dialog opened successfully');
        } catch (error) {
            console.error('Error printing history:', error);
            showError('Print Failed', 'Failed to print history. Please try again.');
        } finally {
            setLoading(false);
        }
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
                        <TableSkeleton
                            columnCount={5}
                            rowCount={5}
                            columnWidths={[60, 150, 250, 120, 150]}
                            showCheckbox={false}
                        />
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
