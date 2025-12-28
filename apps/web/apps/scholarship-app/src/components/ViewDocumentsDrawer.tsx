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
        padding: "20px 24px 0px 25px",
        // borderBottom: "1px solid #e0e0e0",
        backgroundColor: "#ffffff",
      }}>
        <h2 style={{
          fontSize: "16px",
          lineHeight: "22px",
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
            border:"none"
          }}
          aria-label="Close"
        >
          <DismissRegular style={{ width: "20px", height: "20px", color: "#616161",marginLeft:"20px" }} />
        </Button>
      </div>

      {/* Application Info (if provided) */}


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
                  gap: "16px",
                  padding: "16px",
                  backgroundColor: "#ffffff",
                  border: "1px solid #e0e0e0",
                  borderRadius: "8px",
                  boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.05)",
                }}
              >
                {/* PDF Icon - Simulated look matching screenshot */}
                <div style={{
                  position: "relative",
                  width: "32px",
                  height: "40px",
                  backgroundColor: "#ffffff",
                  border: "1px solid #e0e0e0",
                  borderRadius: "4px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}>
                  {/* Folded corner effect (css triangle) */}
                  <div style={{
                    position: "absolute",
                    top: "-1px",
                    right: "-1px",
                    width: "10px",
                    height: "10px",
                    backgroundColor: "#f5f5f5",
                    borderBottom: "1px solid #e0e0e0",
                    borderLeft: "1px solid #e0e0e0",
                    borderRadius: "0 0 0 4px",
                  }} />

                  {/* PDF Label */}
                  <div style={{
                    backgroundColor: "#d13438",
                    color: "white",
                    fontSize: "8px",
                    fontWeight: "bold",
                    padding: "2px 4px",
                    borderRadius: "2px",
                    marginTop: "8px",
                  }}>
                    PDF
                  </div>
                </div>

                {/* Document Info */}
                <div style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  gap: "2px",
                  minWidth: 0,
                }}>
                  <span style={{
                    fontSize: "14px",
                    lineHeight: "20px",
                    fontWeight: 600,
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
                    appearance="primary"
                    size="icon"
                    onClick={() => handleView(doc)}
                    style={{
                      width: "36px",
                      height: "36px",
                      padding: 0,
                      backgroundColor: "#2453C3", // Primary Blue
                      color: "#ffffff",
                      borderRadius: "4px",
                      border: "none",
                    }}
                    aria-label="View document"
                  >
                    <OpenRegular style={{ width: "20px", height: "20px" }} />
                  </Button>
                  <Button
                    appearance="outline"
                    size="icon"
                    onClick={() => handleDownload(doc)}
                    style={{
                      width: "36px",
                      height: "36px",
                      padding: 0,
                      backgroundColor: "#ffffff",
                      color: "#242424",
                      borderRadius: "4px",
                      border: "1px solid #d1d1d1",
                    }}
                    aria-label="Download document"
                  >
                    <ArrowDownRegular style={{ width: "20px", height: "20px" }} />
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

