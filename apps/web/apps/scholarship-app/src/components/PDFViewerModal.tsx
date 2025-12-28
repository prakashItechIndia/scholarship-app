import * as React from "react";
import { Button } from "@shared/components";
import {
  DismissRegular,
  ArrowDownloadRegular,
  PrintRegular,
  ZoomInRegular,
  ZoomOutRegular,
  MoreVerticalRegular,
  ChevronLeftRegular,
  ChevronRightRegular,
  PanelLeftRegular,
} from "@fluentui/react-icons";
import Constants from "../pages/process/constants";

interface PDFViewerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pdfUrl?: string;
  applicationNo?: string;
  title?: string;
  fileName?: string;
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

const PDFViewerModal: React.FC<PDFViewerModalProps> = ({
  open,
  onOpenChange,
  pdfUrl,
  applicationNo,
  title = "File Viewer",
  fileName,
}) => {
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [totalPages, setTotalPages] = React.useState(1);
  const [zoomLevel, setZoomLevel] = React.useState(100);

  React.useEffect(() => {
    if (open && pdfUrl) {
      setIsLoading(true);
      setError(null);
      setCurrentPage(1);
      setTotalPages(1);
      setZoomLevel(100);
    }
  }, [open, pdfUrl]);

  const displayUrl = pdfUrl || Constants.samplePdfUrl;
  const displayFileName = fileName || `${applicationNo || "document"}.pdf`;
  const useReactPdfViewer = Viewer && defaultLayoutPlugin;

  const plugins = React.useMemo(() => {
    if (defaultLayoutPlugin) {
      return [
        defaultLayoutPlugin({
          sidebarTabs: () => [],
          renderToolbar: (Toolbar: any) => (
            <Toolbar>
              {(slots: any) => {
                return <div style={{ display: "none" }} />;
              }}
            </Toolbar>
          ),
        }),
      ];
    }
    return [];
  }, []);

  const handleDownload = async () => {
                  try {
                    const response = await fetch(displayUrl);
                    const blob = await response.blob();
                    const url = window.URL.createObjectURL(blob);
                    const link = document.createElement("a");
                    link.href = url;
      link.download = displayFileName;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    window.URL.revokeObjectURL(url);
                  } catch (error) {
                    console.error("Download failed:", error);
                    const link = document.createElement("a");
                    link.href = displayUrl;
      link.download = displayFileName;
                    link.target = "_blank";
                    link.click();
                  }
                };

  const handlePrint = () => {
    window.open(displayUrl, "_blank");
    setTimeout(() => {
      window.print();
    }, 250);
  };

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 10, 200));
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 10, 50));
  };


  if (!open) return null;

                return (
                  <div
                    style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        zIndex: 9999,
        display: "flex",
                      alignItems: "center",
        justifyContent: "center",
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onOpenChange(false);
        }
      }}
    >
      <div
        style={{
          width: "800px",
          height: "90vh",
          maxWidth: "800px",
          maxHeight: "900px",
          backgroundColor: "#ffffff",
          borderRadius: "8px",
          display: "flex",
          flexDirection: "column",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
          overflow: "hidden",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Title Bar */}
        <div
          style={{
            height: "48px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 16px",
            borderBottom: "1px solid #e0e0e0",
            backgroundColor: "#ffffff",
          }}
        >
          <span
            style={{
              fontSize: "16px",
              fontWeight: 600,
              color: "#242424",
              fontFamily: "'Inter', sans-serif",
            }}
          >
            {title}
          </span>
          <button
            onClick={() => onOpenChange(false)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "4px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#616161",
            }}
            aria-label="Close"
          >
            <DismissRegular style={{ width: "20px", height: "20px" }} />
          </button>
        </div>

        {/* Toolbar */}
        <div
          style={{
            height: "48px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 16px",
            backgroundColor: "#323639",
            gap: "16px",
          }}
        >
          {/* Left side - Hamburger menu, Document name and page navigation */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
              flex: 1,
              minWidth: 0,
            }}
          >
            {/* Hamburger Menu */}
            <button
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "4px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#ffffff",
              }}
              title="Menu"
            >
              <PanelLeftRegular style={{ width: "20px", height: "20px" }} />
            </button>
            <span
              style={{
                fontSize: "14px",
                color: "#ffffff",
                fontFamily: "'Inter', sans-serif",
                fontWeight: 500,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {displayFileName}
            </span>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                fontSize: "14px",
                color: "#ffffff",
                fontFamily: "'Inter', sans-serif",
              }}
            >
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                style={{
                  background: "none",
                  border: "none",
                  cursor: currentPage === 1 ? "not-allowed" : "pointer",
                  padding: "4px",
                  display: "flex",
                  alignItems: "center",
                  color: currentPage === 1 ? "#666666" : "#ffffff",
                }}
              >
                <ChevronLeftRegular style={{ width: "16px", height: "16px" }} />
              </button>
              <span>
                {currentPage} / {totalPages}
              </span>
              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
                style={{
                  background: "none",
                  border: "none",
                  cursor:
                    currentPage === totalPages ? "not-allowed" : "pointer",
                  padding: "4px",
                  display: "flex",
                  alignItems: "center",
                  color: currentPage === totalPages ? "#666666" : "#ffffff",
                }}
              >
                <ChevronRightRegular style={{ width: "16px", height: "16px" }} />
              </button>
            </div>
            <span
              style={{
                fontSize: "14px",
                color: "#ffffff",
                fontFamily: "'Inter', sans-serif",
              }}
            >
              {zoomLevel}%
            </span>
          </div>

          {/* Right side - Toolbar icons */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <button
              onClick={handleZoomOut}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "6px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#ffffff",
                borderRadius: "4px",
              }}
              title="Zoom Out"
            >
              <ZoomOutRegular style={{ width: "18px", height: "18px" }} />
            </button>
            <button
              onClick={handleZoomIn}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "6px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#ffffff",
                borderRadius: "4px",
              }}
              title="Zoom In"
            >
              <ZoomInRegular style={{ width: "18px", height: "18px" }} />
            </button>
            <button
              onClick={handleDownload}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "6px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#ffffff",
                borderRadius: "4px",
              }}
              title="Download"
            >
              <ArrowDownloadRegular style={{ width: "18px", height: "18px" }} />
            </button>
            <button
              onClick={handlePrint}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "6px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#ffffff",
                borderRadius: "4px",
              }}
              title="Print"
            >
              <PrintRegular style={{ width: "18px", height: "18px" }} />
            </button>
            <button
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "6px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#ffffff",
                borderRadius: "4px",
              }}
              title="More Options"
            >
              <MoreVerticalRegular style={{ width: "18px", height: "18px" }} />
            </button>
          </div>
        </div>

        {/* PDF Content Area */}
        <div
          style={{
          flex: 1,
          position: "relative",
          overflow: "auto",
            backgroundColor: "#525659",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "0 16px",
          }}
        >
          {isLoading && (
            <div
              style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "12px",
              zIndex: 10,
              }}
            >
              <div
                style={{
                width: "40px",
                height: "40px",
                border: "4px solid #e0e0e0",
                borderTop: "4px solid #0f6cbd",
                borderRadius: "50%",
                animation: "spin 1s linear infinite",
                }}
              />
              <span
                style={{
                fontSize: "14px",
                lineHeight: "20px",
                color: "#616161",
                fontFamily: "'Inter', sans-serif",
                }}
              >
                Loading PDF...
              </span>
            </div>
          )}

          {error ? (
            <div
              style={{
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
              }}
            >
              <span
                style={{
                fontSize: "14px",
                lineHeight: "20px",
                color: "#c50f1f",
                fontFamily: "'Inter', sans-serif",
                }}
              >
                {error}
              </span>
              <Button
                appearance="outline"
                onClick={() => {
                  setError(null);
                  setIsLoading(true);
                }}
              >
                Retry
              </Button>
            </div>
          ) : useReactPdfViewer ? (
            <div
              style={{
                width: "100%",
                height: "100%",
                overflow: "auto",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "16px 0",
              }}
            >
              <div
                style={{
                  transform: `scale(${zoomLevel / 100})`,
                  transformOrigin: "center center",
                  maxWidth: "100%",
                  maxHeight: "100%",
                }}
              >
              <Viewer
                fileUrl={displayUrl}
                plugins={plugins}
                onDocumentLoad={(e: any) => {
                  setIsLoading(false);
                  if (e?.doc?.numPages) {
                    setTotalPages(e.doc.numPages);
                  }
                }}
                  onLoadError={(error: Error) => {
                    setIsLoading(false);
                  setError("Failed to load PDF document: " + error.message);
                }}
              />
              </div>
            </div>
          ) : (
            <div
              style={{
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                // padding: "16px 0",
              }}
            >
              <iframe
                src={`${displayUrl}#toolbar=0&navpanes=0&scrollbar=0&zoom=page-fit`}
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
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .pdf-viewer-container * {
          overflow: hidden !important;
        }
        .pdf-viewer-container iframe {
          overflow: hidden !important;
        }
        .pdf-viewer-container::-webkit-scrollbar {
          display: none;
        }
        .pdf-viewer-container {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default PDFViewerModal;
