import * as React from "react";
import { Modal, Button } from "@shared/components";
import { DismissRegular } from "@fluentui/react-icons";

interface PDFViewerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pdfUrl?: string;
  applicationNo?: string;
  title?: string;
}

// Try to dynamically import react-pdf-viewer if available
let Viewer: any = null;
let defaultLayoutPlugin: any = null;

try {
  // This will only work if the packages are installed
  const pdfViewerCore = require("@react-pdf-viewer/core");
  const pdfViewerDefaultLayout = require("@react-pdf-viewer/default-layout");
  
  if (pdfViewerCore && pdfViewerDefaultLayout) {
    Viewer = pdfViewerCore.Viewer;
    defaultLayoutPlugin = pdfViewerDefaultLayout.defaultLayoutPlugin;
  }
} catch (e) {
  // Packages not installed, will use iframe fallback
  console.log("react-pdf-viewer not available, using iframe fallback");
}

const PDFViewerModal: React.FC<PDFViewerModalProps> = ({
  open,
  onOpenChange,
  pdfUrl,
  applicationNo,
  title = "Application Document",
}) => {
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [zoomLevel, setZoomLevel] = React.useState(1);

  React.useEffect(() => {
    if (open && pdfUrl) {
      setIsLoading(true);
      setError(null);
    }
  }, [open, pdfUrl]);

  // Sample PDF URL - replace with actual PDF URL from your data
  const displayUrl = pdfUrl || `https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf`;

  // Use react-pdf-viewer if available, otherwise use iframe
  const useReactPdfViewer = Viewer && defaultLayoutPlugin;

  // Initialize plugins for react-pdf-viewer
  const plugins = React.useMemo(() => {
    if (defaultLayoutPlugin) {
      return [defaultLayoutPlugin()];
    }
    return [];
  }, []);

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      size={"xl" as const}
      className="max-w-[90vw]"
      footer={
        <Button variant="outline" onClick={() => onOpenChange(false)}>
          Close
        </Button>
      }
    >
      <div style={{
        width: "100%",
        height: "80vh",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#f5f5f5",
        borderRadius: "8px",
        overflow: "hidden",
      }}>
        {/* PDF Viewer Header */}
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "12px 16px",
          backgroundColor: "#ffffff",
          borderBottom: "1px solid #e0e0e0",
        }}>
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}>
            <span style={{
              fontSize: "14px",
              lineHeight: "20px",
              fontWeight: 600,
              color: "#242424",
              fontFamily: "'Inter', sans-serif",
            }}>
              {applicationNo ? `Application: ${applicationNo}` : "Document Viewer"}
            </span>
          </div>
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

        {/* PDF Viewer Content */}
        <div style={{
          flex: 1,
          position: "relative",
          overflow: "hidden",
          backgroundColor: "#ffffff",
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
                Loading PDF...
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
            // Use react-pdf-viewer if available
            <div style={{ width: "100%", height: "100%" }}>
              <Viewer
                fileUrl={displayUrl}
                plugins={plugins}
                onDocumentLoad={() => setIsLoading(false)}
                onLoadError={(error: Error) => {
                  setIsLoading(false);
                  setError("Failed to load PDF document: " + error.message);
                }}
              />
            </div>
          ) : (
            // Fallback to iframe
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
                setError("Failed to load PDF document");
              }}
              title="PDF Viewer"
            />
          )}
        </div>

        {/* PDF Viewer Footer with controls */}
        {!useReactPdfViewer && (
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "8px 16px",
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
                  const iframe = document.querySelector('iframe[title="PDF Viewer"]') as HTMLIFrameElement;
                  if (iframe?.contentWindow) {
                    iframe.contentWindow.postMessage({ type: 'zoom', value: zoomLevel - 0.1 }, '*');
                  }
                }}
              >
                Zoom Out
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setZoomLevel(prev => Math.min(2, prev + 0.1));
                  const iframe = document.querySelector('iframe[title="PDF Viewer"]') as HTMLIFrameElement;
                  if (iframe?.contentWindow) {
                    iframe.contentWindow.postMessage({ type: 'zoom', value: zoomLevel + 0.1 }, '*');
                  }
                }}
              >
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

export default PDFViewerModal;
