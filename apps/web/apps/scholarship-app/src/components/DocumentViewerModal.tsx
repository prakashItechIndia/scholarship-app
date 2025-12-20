import * as React from "react";
import { Modal, Button } from "@shared/components";
import { 
  DismissRegular,
  ArrowDownRegular,
  ArrowUpRegular,
  DocumentRegular,
} from "@fluentui/react-icons";

interface DocumentViewerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  documentUrl?: string;
  documentType?: string;
  applicationNo?: string;
  studentName?: string;
  uploadedDate?: string;
  status?: string;
  title?: string;
}

// Try to dynamically import react-pdf-viewer if available
let Viewer: any = null;
let defaultLayoutPlugin: any = null;

try {
  const pdfViewerCore = require("@react-pdf-viewer/core");
  const pdfViewerDefaultLayout = require("@react-pdf-viewer/default-layout");
  
  if (pdfViewerCore && pdfViewerDefaultLayout) {
    Viewer = pdfViewerCore.Viewer;
    defaultLayoutPlugin = pdfViewerDefaultLayout.defaultLayoutPlugin;
  }
} catch (e) {
  console.log("react-pdf-viewer not available, using iframe fallback");
}

const DocumentViewerModal: React.FC<DocumentViewerModalProps> = ({
  open,
  onOpenChange,
  documentUrl,
  documentType,
  applicationNo,
  studentName,
  uploadedDate,
  status,
  title = "Document Viewer",
}) => {
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [zoomLevel, setZoomLevel] = React.useState(1);

  React.useEffect(() => {
    if (open && documentUrl) {
      setIsLoading(true);
      setError(null);
    }
  }, [open, documentUrl]);

  const displayUrl = documentUrl || `https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf`;
  const useReactPdfViewer = Viewer && defaultLayoutPlugin;

  const plugins = React.useMemo(() => {
    if (defaultLayoutPlugin) {
      return [defaultLayoutPlugin()];
    }
    return [];
  }, []);

  const handleDownload = () => {
    if (documentUrl) {
      const link = document.createElement('a');
      link.href = documentUrl;
      link.download = `${documentType || 'document'}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title=""
      size={"xl" as const}
      className="max-w-[95vw]"
      footer={null}
    >
      <div style={{
        width: "100%",
        height: "85vh",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#ffffff",
        borderRadius: "8px",
        overflow: "hidden",
        fontFamily: "'Inter', sans-serif",
      }}>
        {/* Document Viewer Header */}
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "16px 24px",
          backgroundColor: "#ffffff",
          borderBottom: "1px solid #e0e0e0",
        }}>
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            flex: 1,
          }}>
            <div style={{
              width: "40px",
              height: "40px",
              borderRadius: "6px",
              backgroundColor: "#ebf3fc",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}>
              <DocumentRegular style={{ width: "20px", height: "20px", color: "#0f6cbd" }} />
            </div>
            <div style={{
              display: "flex",
              flexDirection: "column",
              gap: "2px",
            }}>
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
              }}>
                <span style={{
                  fontSize: "16px",
                  lineHeight: "22px",
                  fontWeight: 600,
                  color: "#242424",
                  fontFamily: "'Inter', sans-serif",
                }}>
                  {documentType || "Document"}
                </span>
                {status && (
                  <span style={{
                    fontSize: "12px",
                    lineHeight: "16px",
                    fontWeight: 500,
                    color: "#616161",
                    fontFamily: "'Inter', sans-serif",
                    padding: "2px 8px",
                    backgroundColor: status === "Verified" ? "#f1faf1" : "#fff9f5",
                    color: status === "Verified" ? "#0e700e" : "#bc4b09",
                    borderRadius: "4px",
                  }}>
                    {status}
                  </span>
                )}
              </div>
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: "16px",
                fontSize: "12px",
                lineHeight: "16px",
                color: "#616161",
                fontFamily: "'Inter', sans-serif",
              }}>
                {applicationNo && (
                  <span>Application: {applicationNo}</span>
                )}
                {studentName && (
                  <span>Student: {studentName}</span>
                )}
                {uploadedDate && (
                  <span>Uploaded: {uploadedDate}</span>
                )}
              </div>
            </div>
          </div>
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownload}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <ArrowDownRegular style={{ width: "16px", height: "16px" }} />
              Download
            </Button>
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
              <DismissRegular style={{ width: "16px", height: "16px" }} />
            </Button>
          </div>
        </div>

        {/* Document Viewer Content */}
        <div style={{
          flex: 1,
          position: "relative",
          overflow: "hidden",
          backgroundColor: "#f5f5f5",
        }}>
          {isLoading && (
            <div style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "12px",
              zIndex: 10,
            }}>
              <div style={{
                width: "40px",
                height: "40px",
                border: "4px solid #e0e0e0",
                borderTop: "4px solid #0f6cbd",
                borderRadius: "50%",
                animation: "spin 1s linear infinite",
              }} />
              <span style={{
                fontSize: "14px",
                lineHeight: "20px",
                color: "#616161",
                fontFamily: "'Inter', sans-serif",
              }}>
                Loading document...
              </span>
            </div>
          )}

          {error ? (
            <div style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "12px",
              padding: "24px",
              zIndex: 10,
            }}>
              <span style={{
                fontSize: "14px",
                lineHeight: "20px",
                color: "#c50f1f",
                fontFamily: "'Inter', sans-serif",
              }}>
                {error}
              </span>
              <Button
                variant="outline"
                onClick={() => {
                  setError(null);
                  setIsLoading(true);
                }}
              >
                Retry
              </Button>
            </div>
          ) : useReactPdfViewer ? (
            <div style={{ width: "100%", height: "100%" }}>
              <Viewer
                fileUrl={displayUrl}
                plugins={plugins}
                onDocumentLoad={() => setIsLoading(false)}
                onLoadError={(error: Error) => {
                  setIsLoading(false);
                  setError("Failed to load document: " + error.message);
                }}
              />
            </div>
          ) : (
            <iframe
              src={`${displayUrl}#toolbar=1&navpanes=1&scrollbar=1`}
              style={{
                width: "100%",
                height: "100%",
                border: "none",
                display: isLoading ? "none" : "block",
              }}
              onLoad={() => setIsLoading(false)}
              onError={() => {
                setIsLoading(false);
                setError("Failed to load document");
              }}
              title="Document Viewer"
            />
          )}
        </div>

        {/* Document Viewer Footer with controls */}
        {!useReactPdfViewer && (
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "12px 24px",
            backgroundColor: "#ffffff",
            borderTop: "1px solid #e0e0e0",
          }}>
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setZoomLevel(prev => Math.max(0.5, prev - 0.1));
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                }}
              >
                <ArrowDownRegular style={{ width: "16px", height: "16px" }} />
                Zoom Out
              </Button>
              <span style={{
                fontSize: "12px",
                lineHeight: "16px",
                color: "#616161",
                fontFamily: "'Inter', sans-serif",
                padding: "0 8px",
              }}>
                {Math.round(zoomLevel * 100)}%
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setZoomLevel(prev => Math.min(2, prev + 0.1));
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                }}
              >
                <ArrowUpRegular style={{ width: "16px", height: "16px" }} />
                Zoom In
              </Button>
            </div>
            <div style={{
              fontSize: "12px",
              lineHeight: "16px",
              color: "#616161",
              fontFamily: "'Inter', sans-serif",
            }}>
              Use browser controls to navigate
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </Modal>
  );
};

export default DocumentViewerModal;

