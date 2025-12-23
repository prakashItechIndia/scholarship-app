import * as React from "react";
import { Modal, Button } from "@shared/components";
import { DismissRegular, ArrowDownloadRegular } from "@fluentui/react-icons";
import Constants from "../pages/process/constants";

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

  React.useEffect(() => {
    if (open && pdfUrl) {
      setIsLoading(true);
      setError(null);
    }
  }, [open, pdfUrl]);

  // Use a fallback URL if none provided, for testing
  const displayUrl = pdfUrl || Constants.samplePdfUrl;

  // State to track current page and total pages if needed for custom toolbar
  // (In this implementation, the default layout plugin handles state internally,
  // but if we were building a fully custom toolbar from scratch we'd need these)
  // For now, we rely on the slots provided by the default layout plugin.

  // Use react-pdf-viewer if available, otherwise use iframe
  const useReactPdfViewer = Viewer && defaultLayoutPlugin;

  // Initialize plugins for react-pdf-viewer
  const plugins = React.useMemo(() => {
    if (defaultLayoutPlugin) {
      return [
        defaultLayoutPlugin({
          renderToolbar: (Toolbar: any) => (
            <Toolbar>
              {(slots: any) => {
                const {
                  CurrentPageInput,
                  GoToNextPage,
                  GoToPreviousPage,
                  NumberOfPages,
                  Print,
                  Rotate,
                  Zoom,
                  ZoomIn,
                  ZoomOut,
                } = slots;

                const handleCustomDownload = async () => {
                  try {
                    const response = await fetch(displayUrl);
                    const blob = await response.blob();
                    const url = window.URL.createObjectURL(blob);
                    const link = document.createElement("a");
                    link.href = url;
                    link.download = `${applicationNo || "document"}.pdf`;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    window.URL.revokeObjectURL(url);
                  } catch (error) {
                    console.error("Download failed:", error);
                    // Fallback to direct link if fetch fails (might not rename correctly due to CORS)
                    const link = document.createElement("a");
                    link.href = displayUrl;
                    link.download = `${applicationNo || "document"}.pdf`;
                    link.target = "_blank";
                    link.click();
                  }
                };

                return (
                  <div
                    style={{
                      alignItems: "center",
                      display: "flex",
                      width: "100%",
                      justifyContent: "space-between",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <div style={{ padding: "0 2px" }}>
                        <GoToPreviousPage />
                      </div>
                      <div style={{ padding: "0 2px", display: "flex", alignItems: "center" }}>
                        <CurrentPageInput /> <span style={{ margin: "0 4px" }}>/</span> <NumberOfPages />
                      </div>
                      <div style={{ padding: "0 2px" }}>
                        <GoToNextPage />
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <div style={{ padding: "0 2px" }}>
                        <ZoomOut />
                      </div>
                      <div style={{ padding: "0 2px" }}>
                        <Zoom />
                      </div>
                      <div style={{ padding: "0 2px" }}>
                        <ZoomIn />
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <div style={{ padding: "0 2px" }}>
                        <Rotate />
                      </div>
                      <div style={{ padding: "0 2px" }}>
                        <Print />
                      </div>
                      <div style={{ padding: "0 2px" }}>
                        <Button
                          appearance="subtle"
                          icon={<ArrowDownloadRegular />}
                          onClick={handleCustomDownload}
                          aria-label="Download"
                          style={{ minWidth: "32px" }}
                        />
                      </div>
                    </div>
                  </div>
                );
              }}
            </Toolbar>
          ),
        }),
      ];
    }
    return [];
  }, [displayUrl, applicationNo]);

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      size={"xl" as const}
      className="max-w-[90vw]"
      footer={
        <Button appearance="outline" onClick={() => onOpenChange(false)}>
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
