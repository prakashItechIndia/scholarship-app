import * as React from "react";
import {
    Modal,
    Button,
    Table,
    TableSkeleton,
    Pagination,
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from "@shared/components";
import {
    ArrowDownload24Regular,
    Dismiss24Regular,
    Print24Regular,
    DocumentRegular,
} from "@fluentui/react-icons";
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

// Helper function to strip HTML tags
const stripHtmlTags = (html: string): string => {
    if (!html) return '';
    // Create a temporary div element
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    // Get text content and remove extra whitespace
    return tmp.textContent || tmp.innerText || '';
};

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
            onRender: (item?: HistoryItem, index?: number) => {
              const idx = index ?? 0;
              return (currentPage - 1) * pageSize + idx + 1;
            }
        },
        { 
            key: "action", 
            name: "Action", 
            minWidth: 150, 
            // For Completed and Registered status: show processUndergone data in Action column
            // Remove HTML tags from the text
            onRender: (item: HistoryItem) => {
              const text = item.processUndergone || item.action || '';
              return stripHtmlTags(text);
            }
        },
        { 
            key: "processUndergone", 
            name: "Process Undergone", 
            minWidth: 250, 
            // For Completed and Registered status: show action data in Process Undergone column
            // Remove HTML tags from the text
            onRender: (item: HistoryItem) => {
              const text = item.action || item.processUndergone || '';
              return stripHtmlTags(text);
            }
        },
        { 
            key: "handledBy", 
            name: "Handled by", 
            minWidth: 120, 
            onRender: (item: HistoryItem) => item.handledBy || ''
        },
        { key: "date", name: "Date", minWidth: 150, onRender: (item: HistoryItem) => item.date },
    ];

    const handleClose = () => {
        onOpenChange(false); // Close the modal when the close icon is clicked
    };

    const fetchAllHistoryData = async () => {
        if (!applicationNo) return [];
        
        try {
            const response = await processManagement.getApplicationHistory(applicationNo, {
                getAllRecords: true,
            });
            return response.data || [];
        } catch (error) {
            console.error('Error fetching history:', error);
            showError('Failed to Load History', 'Failed to fetch application history. Please try again.');
            return [];
        }
    };

    const handleDownloadExcel = async () => {
        if (!applicationNo) return;
        
        setLoading(true);
        try {
            const allHistoryData = await fetchAllHistoryData();
            
            // Prepare CSV data
            const headers = ["S.No.", "Action", "Process Undergone", "Handled by", "Date"];
            const rows = allHistoryData.map((item: HistoryItem, index: number) => [
                index + 1,
                stripHtmlTags(item.processUndergone || item.action || ''),
                stripHtmlTags(item.action || item.processUndergone || ''),
                item.handledBy || '',
                item.date || '',
            ]);
            
            // Create CSV content
            const csvContent = [
                headers.join(','),
                ...rows.map((row: (string | number)[]) => row.map((cell: string | number) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
            ].join('\n');
            
            // Create and download CSV file
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = `${applicationNo}_history.xlsx`;
            link.click();
            URL.revokeObjectURL(link.href);
            
            success('Download Successful', 'History exported to Excel successfully');
        } catch (error) {
            console.error('Error downloading Excel:', error);
            showError('Download Failed', 'Failed to export history to Excel. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleDownloadWord = async () => {
        if (!applicationNo) return;
        
        setLoading(true);
        try {
            const allHistoryData = await fetchAllHistoryData();
            
            // Prepare data for Word export
            const headers = ["S.No.", "Action", "Process Undergone", "Handled by", "Date"];
            const rows = allHistoryData.map((item: HistoryItem, index: number) => [
                index + 1,
                stripHtmlTags(item.processUndergone || item.action || ''),
                stripHtmlTags(item.action || item.processUndergone || ''),
                item.handledBy || '',
                item.date || '',
            ]);
            
            // Create tab-separated content (Word can open TSV files)
            let wordContent = headers.join('\t') + '\n';
            rows.forEach((row: (string | number)[]) => {
                wordContent += row.join('\t') + '\n';
            });
            
            // Create and download Word file
            const blob = new Blob([wordContent], { 
                type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' 
            });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = `${applicationNo}_history.docx`;
            link.click();
            URL.revokeObjectURL(link.href);
            
            success('Download Successful', 'History exported to Word successfully');
        } catch (error) {
            console.error('Error downloading Word:', error);
            showError('Download Failed', 'Failed to export history to Word. Please try again.');
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
                            ${allHistoryData?.map((item: HistoryItem, index: number) => {
                                const actionText = stripHtmlTags(item.processUndergone || item.action || '');
                                const processText = stripHtmlTags(item.action || item.processUndergone || '');
                                return `
                                <tr>
                                <td>${index + 1}</td>
                                <td>${actionText}</td>
                                <td>${processText}</td>
                                <td>${item.handledBy || ''}</td>
                                <td>${item.date || ''}</td>
                                </tr>
                            `;
                            }).join('')}
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
                                        <DocumentRegular style={{ width: "16px", height: "16px" }} />
                                        Excel
                                    </div>
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                    onClick={handleDownloadWord}
                                    style={{ fontSize: "13px", fontFamily: "'Inter', sans-serif" }}
                                >
                                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                        <DocumentRegular style={{ width: "16px", height: "16px" }} />
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
