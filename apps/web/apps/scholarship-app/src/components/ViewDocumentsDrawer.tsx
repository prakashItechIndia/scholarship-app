import * as React from "react";
import { Drawer } from "@shared/components";
import { Button } from "@shared/components";
import { 
  DismissRegular,
  ArrowDownRegular,
  OpenRegular,
} from "@fluentui/react-icons";

export interface Document {
  name: string;
  type: string;
  url: string;
  size: string;
  uploadedDate?: string;
  status?: string;
}

interface ViewDocumentsDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  documents: Document[];
  applicationNo?: string;
  studentName?: string;
  onViewDocument?: (document: Document) => void;
  onDownloadDocument?: (document: Document) => void;
}

const ViewDocumentsDrawer: React.FC<ViewDocumentsDrawerProps> = ({
  open,
  onOpenChange,
  documents,
  applicationNo,
  studentName,
  onViewDocument,
  onDownloadDocument,
}) => {
  const handleView = (doc: Document) => {
    if (onViewDocument) {
      onViewDocument(doc);
    } else {
      // Default: open in new tab
      window.open(doc.url, '_blank');
    }
  };

  const handleDownload = (doc: Document) => {
    if (onDownloadDocument) {
      onDownloadDocument(doc);
    } else {
      // Default download behavior
      const link = document.createElement('a');
      link.href = doc.url;
      link.download = doc.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <Drawer
      open={open}
      onOpenChange={onOpenChange}
      side="right"
      width="480px"
    >
      {/* Header */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "20px 24px",
        borderBottom: "1px solid #e0e0e0",
        backgroundColor: "#ffffff",
      }}>
        <h2 style={{
          fontSize: "20px",
          lineHeight: "28px",
          fontWeight: 600,
          color: "#242424",
          fontFamily: "'Inter', sans-serif",
          margin: 0,
        }}>
          View Documents
        </h2>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onOpenChange(false)}
          style={{
            width: "32px",
            height: "32px",
            padding: 0,
          }}
          aria-label="Close"
        >
          <DismissRegular style={{ width: "20px", height: "20px", color: "#616161" }} />
        </Button>
      </div>

      {/* Application Info (if provided) */}
      {(applicationNo || studentName) && (
        <div style={{
          padding: "16px 24px",
          backgroundColor: "#fafafa",
          borderBottom: "1px solid #e0e0e0",
        }}>
          {applicationNo && (
            <div style={{
              fontSize: "12px",
              lineHeight: "16px",
              color: "#616161",
              fontFamily: "'Inter', sans-serif",
              marginBottom: "4px",
            }}>
              Application: <span style={{ fontWeight: 500, color: "#242424" }}>{applicationNo}</span>
            </div>
          )}
          {studentName && (
            <div style={{
              fontSize: "12px",
              lineHeight: "16px",
              color: "#616161",
              fontFamily: "'Inter', sans-serif",
            }}>
              Student: <span style={{ fontWeight: 500, color: "#242424" }}>{studentName}</span>
            </div>
          )}
        </div>
      )}

      {/* Documents List */}
      <div style={{
        flex: 1,
        overflowY: "auto",
        padding: "16px 24px",
      }}>
        {documents.length === 0 ? (
          <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "48px 24px",
            color: "#616161",
            fontFamily: "'Inter', sans-serif",
          }}>
            <span style={{
              fontSize: "14px",
              lineHeight: "20px",
            }}>
              No documents available
            </span>
          </div>
        ) : (
          <div style={{
            display: "flex",
            flexDirection: "column",
            gap: "12px",
          }}>
            {documents.map((doc, index) => (
              <div
                key={index}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "12px 16px",
                  backgroundColor: "#ffffff",
                  border: "1px solid #e0e0e0",
                  borderRadius: "8px",
                  transition: "all 0.2s",
                }}
                className="hover:shadow-sm"
              >
                {/* PDF Icon */}
                <div style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "6px",
                  backgroundColor: "#c50f1f",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}>
                  <span style={{
                    fontSize: "10px",
                    lineHeight: "12px",
                    fontWeight: 600,
                    color: "#ffffff",
                    fontFamily: "'Inter', sans-serif",
                    textTransform: "uppercase",
                  }}>
                    PDF
                  </span>
                </div>

                {/* Document Info */}
                <div style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  gap: "4px",
                  minWidth: 0,
                }}>
                  <span style={{
                    fontSize: "14px",
                    lineHeight: "20px",
                    fontWeight: 500,
                    color: "#242424",
                    fontFamily: "'Inter', sans-serif",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}>
                    {doc.name}
                  </span>
                  <span style={{
                    fontSize: "12px",
                    lineHeight: "16px",
                    color: "#616161",
                    fontFamily: "'Inter', sans-serif",
                  }}>
                    {doc.size}
                  </span>
                </div>

                {/* Action Buttons */}
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  flexShrink: 0,
                }}>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleView(doc)}
                    style={{
                      width: "32px",
                      height: "32px",
                      padding: 0,
                      backgroundColor: "#ebf3fc",
                      color: "#0f6cbd",
                    }}
                    aria-label="View document"
                    className="hover:bg-[#cfe4fa]"
                  >
                    <OpenRegular style={{ width: "16px", height: "16px" }} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDownload(doc)}
                    style={{
                      width: "32px",
                      height: "32px",
                      padding: 0,
                      backgroundColor: "#ebf3fc",
                      color: "#0f6cbd",
                    }}
                    aria-label="Download document"
                    className="hover:bg-[#cfe4fa]"
                  >
                    <ArrowDownRegular style={{ width: "16px", height: "16px" }} />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Drawer>
  );
};

export default ViewDocumentsDrawer;

